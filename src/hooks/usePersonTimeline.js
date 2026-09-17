import { useCallback, useEffect, useRef, useState } from "react";
import { CUES, LYRICS, cueTimeFor } from "../routes/aboutContent.js";

// The PERSON branch's playback driver, ported from legacy/about.html.
//
// The flag pattern did exactly what it was written to do: the branch's whole
// behaviour was built and shipped against a synthetic clock, and swapping in
// the real recording changed this file only. Nothing in About.jsx moved.
//
// USE_AUDIO is now true. Do NOT delete the synthetic timeline — it is not dead
// code, it is the fallback. If the file 404s, the container is refused, or the
// network dies mid-load, the branch degrades to the clock that worked before
// the audio existed rather than to a Play button that does nothing.
export const USE_AUDIO = true;

export const AUDIO_SRC = "/assets/audio/about-voiceover.m4a";

// Fallback duration only. The real one comes from the file's own metadata;
// this is what the synthetic clock uses when there is no file to ask.
const FALLBACK_DURATION = 127.6;

function createTimeline() {
  let started = 0, held = 0, running = false;
  return {
    duration: FALLBACK_DURATION,
    get running() { return running; },
    getTime() { return running ? held + (performance.now() - started) / 1000 : held; },
    play()  { if (running) return; started = performance.now(); running = true; },
    pause() { if (!running) return; held = this.getTime(); running = false; },
    seek(t) { held = Math.max(0, Math.min(t, this.duration)); started = performance.now(); },
    reset() { running = false; held = 0; started = 0; },
  };
}

// The real driver. Same shape as createTimeline() — getTime/play/pause/seek/
// reset/duration/running — so every caller below is unchanged.
//
// Three things this has to get right that the synthetic clock never faced:
//
//  · SEEKING BEFORE THE FILE IS READY. Clicking a paragraph during load is the
//    obvious first interaction, and assigning currentTime before metadata
//    exists is silently dropped. Pending seeks are held and applied on
//    loadedmetadata instead.
//  · DURATION IS NOT KNOWN AT CONSTRUCTION. It arrives with metadata, so it is
//    a getter, not a captured value. The end-of-track check in sync() reads it
//    every frame and would compare against a stale number otherwise.
//  · play() IS ASYNC AND CAN REJECT. Autoplay policy, a decoder refusal, or a
//    404 all surface here. On failure the caller is told, and the branch falls
//    back rather than appearing broken.
function createAudioTimeline(src, onFail) {
  const el = new Audio();
  // preload="none" so 1MB does not load for the majority who never press play.
  // The cost is that nothing is fetched until play() explicitly asks — see the
  // load() call there, which is required, not belt-and-braces.
  el.preload = "none";
  el.src = src;
  // No crossOrigin. The file is same-origin, and setting the attribute AFTER
  // src resets the element's resource selection: measured networkState 0 and
  // readyState 0 after play(), i.e. the fetch never started at all.

  let pendingSeek = null;
  let failed = false;

  const fail = (why) => {
    if (failed) return;
    failed = true;
    if (onFail) onFail(why);
  };

  el.addEventListener("error", () => fail("error"));
  el.addEventListener("loadedmetadata", () => {
    if (pendingSeek != null) {
      try { el.currentTime = pendingSeek; } catch (e) {/* still not seekable */}
      pendingSeek = null;
    }
  });

  return {
    el,
    get duration() {
      return Number.isFinite(el.duration) && el.duration > 0 ? el.duration : FALLBACK_DURATION;
    },
    get running() { return !el.paused && !el.ended; },
    getTime() { return el.currentTime; },
    play() {
      // With preload="none" the element sits at NETWORK_EMPTY until something
      // asks for the bytes. play() alone does not reliably start that fetch;
      // load() does, and is a no-op once loading has begun.
      if (el.networkState === 0 /* NETWORK_EMPTY */ || el.readyState === 0) el.load();
      const p = el.play();
      if (p && typeof p.catch === "function") p.catch(() => fail("play-rejected"));
    },
    pause() { el.pause(); },
    seek(t) {
      const clamped = Math.max(0, Math.min(t, this.duration));
      if (el.readyState === 0) { pendingSeek = clamped; el.load(); return; }
      try { el.currentTime = clamped; } catch (e) { pendingSeek = clamped; }
    },
    reset() {
      el.pause();
      pendingSeek = null;
      try { el.currentTime = 0; } catch (e) {/* not seekable yet */}
    },
    teardown() {
      // Pause and rewind only — deliberately NOT removeAttribute("src") + load().
      //
      // React StrictMode runs effect cleanup and then re-runs effects WITHOUT
      // re-rendering. Destroying the resource here therefore stripped the src
      // from the live element on every dev mount, and the render body never
      // rebuilt it because the ref was still populated: readyState stayed 0 and
      // nothing ever played. Pausing is enough — a real unmount drops the last
      // reference and the element is collected with its buffer.
      el.pause();
      try { el.currentTime = 0; } catch (e) {/* not seekable yet */}
    },
  };
}

// One timeline drives every lyric panel, exactly as the original did by querying
// all .lyrics at once — the desktop composition and the mobile stack both render
// the branch, and only one is visible at a time, but they stay in lockstep
// rather than running two clocks.
export function usePersonTimeline({ reduceMotion, panelRefs }) {
  const timelineRef = useRef(null);
  const usingAudioRef = useRef(false);

  // Constructed lazily but idempotently. React StrictMode double-invokes render
  // and simulates a mount/unmount cycle in development; building an <audio> in
  // the render body created two elements, one of which was immediately aborted
  // by teardown. The ref guard plus teardown-on-unmount keeps exactly one live.
  if (!timelineRef.current) {
    if (USE_AUDIO) {
      // If the audio ever fails — 404, refused container, dead network — swap
      // the synthetic clock in underneath at the point of failure, preserving
      // roughly where the reader had got to. The branch keeps working; it
      // simply stops being audible. Better than a Play button that does
      // nothing and gives no reason.
      timelineRef.current = createAudioTimeline(AUDIO_SRC, () => {
        if (!usingAudioRef.current) return;
        const at = timelineRef.current ? timelineRef.current.getTime() : 0;
        usingAudioRef.current = false;
        timelineRef.current = createTimeline();
        timelineRef.current.seek(at);
      });
      usingAudioRef.current = true;
    } else {
      timelineRef.current = createTimeline();
    }
  }

  const [playing, setPlaying] = useState(false);
  const [cue, setCue] = useState(-1);
  const [revealed, setRevealed] = useState(false);

  const rafRef = useRef(0);
  const cueRef = useRef(-1);
  const userScrollingRef = useRef(false);
  const scrollTimerRef = useRef(0);

  const panels = useCallback(() => panelRefs.current.filter(Boolean), [panelRefs]);

  const center = useCallback(
    (panel, p) => {
      if (!p || panel.scrollHeight <= panel.clientHeight) return;
      const top = p.offsetTop - (panel.clientHeight - p.offsetHeight) / 2;
      panel.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? "auto" : "smooth" });
    },
    [reduceMotion]
  );

  // Highlight advances on every cue; scroll is suspended while the reader is driving.
  const apply = useCallback(
    (i) => {
      if (i === cueRef.current) return;
      cueRef.current = i;
      setCue(i);
      panels().forEach((panel) => {
        if (!userScrollingRef.current) center(panel, panel.querySelectorAll("p")[i]);
      });
    },
    [center, panels]
  );

  const stop = useCallback(() => {
    timelineRef.current.pause();   // pauses the <audio> element on the real driver
    cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    // Drop any pending autoscroll: pausing hands scroll control back to the
    // reader, and a queued re-centre firing afterwards would take it away.
    clearTimeout(scrollTimerRef.current);
    userScrollingRef.current = false;
    setPlaying(false);
  }, []);

  const sync = useCallback(() => {
    const timeline = timelineRef.current;
    const t = timeline.getTime();
    // End of track: hold the last paragraph, leave the scroll position alone.
    // A small epsilon because currentTime can settle a few ms short of
    // duration on a real element and never satisfy a strict >=.
    if (t >= timeline.duration - 0.05) { apply(LYRICS.length - 1); stop(); return; }
    let i = 0;
    for (let k = 0; k < CUES.length; k++) if (CUES[k].t <= t) i = CUES[k].para;
    apply(i);
    rafRef.current = requestAnimationFrame(sync);
  }, [apply, stop]);

  const toggle = useCallback(() => {
    const timeline = timelineRef.current;
    if (timeline.running) { stop(); return; }
    if (timeline.getTime() >= timeline.duration - 0.05) { timeline.reset(); cueRef.current = -1; setCue(-1); }
    setRevealed(true); // stepped reveal, first play only
    timeline.play();
    setPlaying(true);
    rafRef.current = requestAnimationFrame(sync);
  }, [stop, sync]);

  // Intent, not the scroll event — programmatic scrolling fires `scroll` and would self-trigger.
  //
  // Only meaningful while the timeline is running. Autoscroll exists to keep
  // the spoken paragraph in view; paused, there is no spoken paragraph and the
  // reader is simply reading. Without this guard, scrolling the panel at rest
  // snapped back to the highlight three seconds later — the panel taking the
  // scroll position away from the person using it.
  //
  // Guarded twice, deliberately. The early return covers scrolling while
  // already paused; the check inside the timeout covers scrolling during
  // playback and then pausing before the three seconds elapse, which would
  // otherwise fire a re-centre into a paused panel.
  const onScrollIntent = useCallback(() => {
    if (!timelineRef.current.running) return;
    userScrollingRef.current = true;
    clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      userScrollingRef.current = false;
      if (!timelineRef.current.running) return;
      panels().forEach((panel) => center(panel, panel.querySelectorAll("p")[cueRef.current]));
    }, 3000);
  }, [center, panels]);

  // Spotify-style scrub: clicking a paragraph highlights it and moves the timeline to its cue.
  const seekTo = useCallback(
    (i) => {
      if (i < 0 || i >= LYRICS.length) return;
      const timeline = timelineRef.current;
      setRevealed(true);
      timeline.seek(cueTimeFor(i));
      clearTimeout(scrollTimerRef.current);
      userScrollingRef.current = false;
      cueRef.current = -1;
      apply(i);
      if (!timeline.running) return;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(sync);
    },
    [apply, sync]
  );

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden && timelineRef.current.running) stop(); // stays paused on return
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [stop]);

  useEffect(
    () => () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(scrollTimerRef.current);
      // Release the audio element. Leaving About with the voiceover still
      // playing over another page is the kind of bug people notice loudly.
      const t = timelineRef.current;
      if (t && typeof t.teardown === "function") t.teardown();
      // Deliberately NOT nulling timelineRef here. It was tried and it crashed:
      // the exported teardown() below reads timelineRef.current, About calls it
      // whenever the branch changes, and under StrictMode that call can land
      // between this cleanup and the next render — reading .reset() off null.
      // A remount builds a new component instance with its own ref anyway, so
      // nulling bought nothing.
    },
    []
  );

  // Leaving the branch always resets it — returning starts fresh.
  const teardown = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    clearTimeout(scrollTimerRef.current);
    if (timelineRef.current) timelineRef.current.reset();
    cueRef.current = -1;
    setCue(-1);
    setPlaying(false);
    setRevealed(false);
    userScrollingRef.current = false;
  }, []);

  return { playing, cue, revealed, toggle, seekTo, onScrollIntent, teardown };
}
