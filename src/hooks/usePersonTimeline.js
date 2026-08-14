import { useCallback, useEffect, useRef, useState } from "react";
import { CUES, LYRICS, cueTimeFor } from "../routes/aboutContent.js";

// The PERSON branch's playback driver, ported from legacy/about.html.
//
// USE_AUDIO is false and the timeline is synthetic — a closure faking the
// playback clock so the branch's behaviour exists before the voiceover does.
// This is the documented flag pattern, not dead code: when the recording
// arrives, the real audio-backed driver swaps in behind the same interface and
// nothing else on the page changes. Do not simplify it away, do not replace it
// with an <audio> element, and do not remove the flag.
export const USE_AUDIO = false; // marker: real audio-backed driver swaps in here at deploy. do not build it now.

function createTimeline() {
  let started = 0, held = 0, running = false;
  return {
    duration: 125,                       // seconds — placeholder, real VO is ~2:05
    get running() { return running; },
    getTime() { return running ? held + (performance.now() - started) / 1000 : held; },
    play()  { if (running) return; started = performance.now(); running = true; },
    pause() { if (!running) return; held = this.getTime(); running = false; },
    seek(t) { held = Math.max(0, Math.min(t, this.duration)); started = performance.now(); },
    reset() { running = false; held = 0; started = 0; },
  };
}

// One timeline drives every lyric panel, exactly as the original did by querying
// all .lyrics at once — the desktop composition and the mobile stack both render
// the branch, and only one is visible at a time, but they stay in lockstep
// rather than running two clocks.
export function usePersonTimeline({ reduceMotion, panelRefs }) {
  const timelineRef = useRef(null);
  if (!timelineRef.current) timelineRef.current = createTimeline();

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
    timelineRef.current.pause();
    cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    setPlaying(false);
  }, []);

  const sync = useCallback(() => {
    const timeline = timelineRef.current;
    const t = timeline.getTime();
    if (t >= timeline.duration) { apply(LYRICS.length - 1); stop(); return; } // end of track: hold last, leave scroll
    let i = 0;
    for (let k = 0; k < CUES.length; k++) if (CUES[k].t <= t) i = CUES[k].para;
    apply(i);
    rafRef.current = requestAnimationFrame(sync);
  }, [apply, stop]);

  const toggle = useCallback(() => {
    const timeline = timelineRef.current;
    if (timeline.running) { stop(); return; }
    if (timeline.getTime() >= timeline.duration) { timeline.reset(); cueRef.current = -1; setCue(-1); }
    setRevealed(true); // stepped reveal, first play only
    timeline.play();
    setPlaying(true);
    rafRef.current = requestAnimationFrame(sync);
  }, [stop, sync]);

  // Intent, not the scroll event — programmatic scrolling fires `scroll` and would self-trigger.
  const onScrollIntent = useCallback(() => {
    userScrollingRef.current = true;
    clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      userScrollingRef.current = false;
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
    },
    []
  );

  // Leaving the branch always resets it — returning starts fresh.
  const teardown = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    clearTimeout(scrollTimerRef.current);
    timelineRef.current.reset();
    cueRef.current = -1;
    setCue(-1);
    setPlaying(false);
    setRevealed(false);
    userScrollingRef.current = false;
  }, []);

  return { playing, cue, revealed, toggle, seekTo, onScrollIntent, teardown };
}
