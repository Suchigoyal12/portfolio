/* global React */
// =============================================================
// AUDIT PIPELINE — 5-node permissions evaluation diagram
// Adapted from a Tailwind/Framer source into the cream editorial
// style. Horizontal scroll on small screens. Bezier connector
// animated with a stroke-dashoffset keyframe.
// =============================================================

const PIPELINE_NODES = [
{
  id: 1,
  title: "What can the user access?",
  dot: "oklch(0.55 0.15 145)",
  render: () =>
  <div style={{ display: "grid", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{ background: "var(--ink)", color: "var(--ink-inverse)", fontFamily: window.monoFamily, fontSize: 10, padding: "3px 8px", letterSpacing: "0.08em", fontWeight: 600 }}>IT ADMIN</span>
        <span style={{ color: "var(--muted)", fontFamily: window.sansFamily, fontSize: 12 }}>Initiating system-wide scan.</span>
      </div>
      <span style={{ border: "1px solid oklch(0.55 0.13 290)", color: "oklch(0.55 0.13 290)", fontFamily: window.sansFamily, fontSize: 12, padding: "3px 10px", width: "fit-content" }}>User (Alex)</span>
    </div>
},
{
  id: 2,
  title: "Organisation Level",
  dot: "oklch(0.55 0.13 290)",
  render: () =>
  <div style={{ display: "grid", gap: 10 }}>
      <p style={{ margin: 0, fontFamily: window.sansFamily, fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
        Scanning ROLES across <strong style={{ color: "var(--ink)" }}>Azure Directory</strong>, custom <strong style={{ color: "var(--ink)" }}>groups</strong>, <strong style={{ color: "var(--ink)" }}>direct assignments</strong>.
      </p>
      <div style={{ background: "var(--bg)", border: "1px solid var(--line)", padding: "10px 12px", display: "grid", gap: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: window.monoFamily, fontSize: 11, padding: "5px 0", borderBottom: "1px solid var(--line)" }}>
          <span style={{ color: "var(--muted)" }}>ORG ID:</span>
          <span style={{ color: "oklch(0.55 0.15 145)", fontWeight: 600 }}>03</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: window.monoFamily, fontSize: 11, padding: "5px 0" }}>
          <span style={{ color: "var(--muted)" }}>TENANTS:</span>
          <span style={{ color: "oklch(0.65 0.15 75)", fontWeight: 600 }}>T1,T3,T4,T9..</span>
        </div>
      </div>
    </div>
},
{
  id: 3,
  title: "Tenant Search",
  dot: "oklch(0.65 0.15 75)",
  render: () =>
  <div style={{ display: "grid", gap: 7 }}>
      <p style={{ margin: "0 0 2px", fontFamily: window.sansFamily, fontSize: 12, color: "var(--muted)", lineHeight: 1.4 }}>Mapping cross-tenant roles &amp; verifying access at tenant level.</p>
      {[
    { label: "Tenant (Asia-Pacific)", dot: "oklch(0.55 0.15 145)" },
    { label: "Tenant (US-East)", dot: "oklch(0.55 0.13 290)" },
    { label: "Tenant (IT Services)", dot: "oklch(0.65 0.15 75)" }].
    map(({ label, dot }, i, arr) =>
    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid var(--line)", borderBottom: i < arr.length - 1 ? "none" : "1px solid var(--line)", padding: "6px 10px", background: "var(--bg)", fontFamily: window.monoFamily, fontSize: 11 }}>
          <span style={{ color: "var(--ink)" }}>{label}</span>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: dot, display: "inline-block", flexShrink: 0 }} />
        </div>
    )}
      <span style={{ border: "1px solid oklch(0.65 0.15 75)", color: "oklch(0.65 0.15 75)", fontFamily: window.monoFamily, fontSize: 9, padding: "3px 8px", letterSpacing: "0.08em", fontWeight: 600, width: "fit-content" }}>WARN: 24 TENANTS FOUND</span>
    </div>
},
{
  id: 4,
  title: "Service Search",
  dot: "oklch(0.55 0.13 250)",
  render: () =>
  <div style={{ display: "grid", gap: 8 }}>
      <p style={{ margin: 0, fontFamily: window.sansFamily, fontSize: 12, color: "var(--muted)" }}>Fan-out into 15+ internal services.</p>
      <span style={{ background: "var(--ink)", color: "var(--ink-inverse)", fontFamily: window.monoFamily, fontSize: 10, padding: "3px 8px", letterSpacing: "0.08em", fontWeight: 600, width: "fit-content" }}>Tenant (US-East)</span>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, borderLeft: "2px solid var(--line)", paddingLeft: 8 }}>
        {[
      { icon: <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="3" r="2" stroke="currentColor" strokeWidth="1.5" /><circle cx="3" cy="13" r="2" stroke="currentColor" strokeWidth="1.5" /><circle cx="13" cy="13" r="2" stroke="currentColor" strokeWidth="1.5" /><line x1="8" y1="5" x2="3" y2="11" stroke="currentColor" strokeWidth="1.5" /><line x1="8" y1="5" x2="13" y2="11" stroke="currentColor" strokeWidth="1.5" /></svg>, label: "Orchestrator" },
      { icon: <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><ellipse cx="8" cy="4" rx="6" ry="2" stroke="currentColor" strokeWidth="1.5" /><path d="M2 4v8c0 1.1 2.7 2 6 2s6-.9 6-2V4" stroke="currentColor" strokeWidth="1.5" /><line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.5" opacity="0.5" /></svg>, label: "Data Service" },
      { icon: <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 13l2-2 7-7-2-2-7 7-2 2z" stroke="currentColor" strokeWidth="1.5" /><path d="M11 2l3 3" stroke="currentColor" strokeWidth="1.5" /></svg>, label: "Studio" }].
      map(({ icon, label }) =>
      <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, border: "1px solid var(--line)", borderBottom: "none", padding: "6px 8px", background: "var(--bg)", fontFamily: window.monoFamily, fontSize: 10, color: "var(--ink)" }}>
            <span style={{ color: "var(--muted)", display: "flex" }}>{icon}</span>
            {label}
          </div>
      )}
        <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 8px", fontFamily: window.monoFamily, fontSize: 10, color: "var(--muted)", border: "1px solid var(--line)", borderBottom: "none" }}>
          <strong style={{ color: "var(--ink)", fontSize: 13 }}>+14</strong>&nbsp;Services
        </div>
      </div>
    </div>
},
{
  id: 5,
  title: "Service Artefact Matrix",
  dot: "oklch(0.55 0.18 20)",
  render: () => {
    const folderSvg = (size) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M1 3h5l2 2h7v9H1z" fill="oklch(0.65 0.15 75)" stroke="oklch(0.5 0.12 60)" strokeWidth="1" /></svg>;
    const levels = [
    { depth: 0, name: "root_directory" },
    { depth: 1, name: "var" },
    { depth: 2, name: "logs" },
    { depth: 3, name: "auth_cluster" },
    { depth: 4, name: "tenants" },
    { depth: 5, name: "t_88392" },
    { depth: 6, name: "sensitive_exports" }];

    return (
      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {folderSvg(14)}
          <strong style={{ fontFamily: window.sansFamily, fontSize: 12, color: "var(--ink)" }}>Custom Folders</strong>
          <span style={{ fontFamily: window.monoFamily, fontSize: 9, letterSpacing: "0.12em", color: "var(--muted)" }}>7 LEVELS DEEP ANALYSIS</span>
        </div>
        <div style={{ borderTop: "1px solid var(--line)" }} />
        <div style={{ fontFamily: "var(--mono, monospace)", fontSize: 10, color: "var(--ink)", lineHeight: 1.8 }}>
          {levels.map(({ depth, name }) =>
          <div key={name} style={{ display: "flex", alignItems: "center", paddingLeft: depth * 8 }}>
              {depth > 0 && <span style={{ color: "var(--muted)", marginRight: 3, opacity: 0.6, fontSize: 9 }}>└─</span>}
              <span style={{ marginRight: 4, display: "flex", flexShrink: 0 }}>{folderSvg(10)}</span>
              <span style={{ color: "var(--muted)" }}>{name}</span>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", paddingLeft: 7 * 8 }}>
            <span style={{ color: "var(--muted)", marginRight: 3, opacity: 0.6, fontSize: 9 }}>└─</span>
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" style={{ marginRight: 4, flexShrink: 0 }}><rect x="2" y="1" width="12" height="14" rx="1" stroke="var(--muted)" strokeWidth="1.5" /><line x1="5" y1="5" x2="11" y2="5" stroke="var(--muted)" strokeWidth="1" /><line x1="5" y1="8" x2="11" y2="8" stroke="var(--muted)" strokeWidth="1" /></svg>
            <span style={{ border: "1px solid oklch(0.5 0.2 25)", color: "oklch(0.6 0.18 25)", fontFamily: window.monoFamily, fontSize: 9, padding: "1px 5px" }}>auth_keys_dump.json</span>
          </div>
        </div>
      </div>);

  }
},
{
  id: 6,
  title: "Rule Evaluation Engine",
  dot: "oklch(0.65 0.15 75)",
  render: () =>
  <div style={{ display: "grid", gap: 0 }}>
      <p style={{ margin: "0 0 8px", fontFamily: window.sansFamily, fontSize: 12, color: "var(--muted)" }}>The origins of permissions.</p>
      {[
    "Direct Assignment (At Org Level)",
    "Direct Assignment (At Tenant Level)",
    "Direct Assignment (At Service Level)",
    "Group Inheritance (At Tenant Level)",
    "Group Inheritance (At Service Level)",
    "Direct Assignment (At Folder Level)",
    "Group Inheritance (At Folder Level)"].
    map((rule, i, arr) =>
    <div key={rule} style={{ fontFamily: window.monoFamily, fontSize: 10, color: "var(--ink)", background: "var(--bg)", border: "1px solid var(--line)", borderBottom: i < arr.length - 1 ? "none" : "1px solid var(--line)", padding: "6px 10px" }}>
          {rule}
        </div>
    )}
    </div>
},
{
  id: 7,
  title: "The Friction",
  dot: "oklch(0.5 0.22 25)",
  cardStyle: {
    background: "oklch(0.15 0.06 25)",
    border: "1px solid oklch(0.45 0.2 25)",
    boxShadow: "6px 6px 0 oklch(0.3 0.12 25), 0 0 40px color-mix(in oklch, oklch(0.45 0.2 25) 25%, transparent)"
  },
  render: () =>
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, minHeight: 100, padding: "10px 4px" }}>
      <svg width="40" height="36" viewBox="0 0 40 36" fill="none">
        <path d="M20 3 L37 33 L3 33 Z" fill="color-mix(in oklch, oklch(0.45 0.2 25) 18%, transparent)" stroke="oklch(0.55 0.22 25)" strokeWidth="2" />
        <line x1="20" y1="13" x2="20" y2="23" stroke="oklch(0.7 0.18 25)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="20" cy="28" r="1.8" fill="oklch(0.7 0.18 25)" />
      </svg>
      <p style={{ margin: 0, fontFamily: window.sansFamily, fontSize: 12, color: "oklch(0.7 0.1 25)", textAlign: "center", lineHeight: 1.6 }}>
        Manual Inspection Required to untangle <strong style={{ color: "oklch(0.85 0.12 25)" }}>15+ Services</strong> and <strong style={{ color: "oklch(0.85 0.12 25)" }}>5 Assignment Types</strong>
      </p>
    </div>
}];



// ── Helpers ───────────────────────────────────────────────────
const tagStyle = {
  display: "inline-block",
  fontFamily: "var(--mono, 'JetBrains Mono', monospace)",
  fontSize: 9,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  background: "var(--ink)",
  color: "var(--ink-inverse)",
  padding: "4px 8px",
  fontWeight: 600,
  width: "fit-content"
};

const codeBlockStyle = {
  fontFamily: "var(--mono, 'JetBrains Mono', monospace)",
  fontSize: 11,
  color: "var(--ink)",
  background: "var(--bg)",
  padding: 10,
  border: "1px solid var(--line)"
};

const chipStyle = {
  flex: 1,
  fontFamily: "var(--mono, 'JetBrains Mono', monospace)",
  fontSize: 11,
  textAlign: "center",
  border: "1px solid var(--line)",
  background: "var(--bg)",
  padding: 8,
  color: "var(--ink)"
};

function Row({ k, v }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
      <span style={{ color: "var(--muted)", fontFamily: window.sansFamily }}>{k}</span>
      <span style={{ fontFamily: window.sansFamily }}>{v}</span>
    </div>);

}

function Pill({ children }) {
  return (
    <span
      style={{
        background: "var(--bg)",
        border: "1px solid var(--line)",
        padding: "3px 8px",
        color: "var(--ink)",
        fontFamily: window.sansFamily,
        fontSize: 12
      }}>
      
      {children}
    </span>);

}

function EvalRow({ label, status, last }) {
  const colors = {
    PASS: "#1a7f4f",
    FAIL: "#ba1a1a",
    WARN: "var(--accent)"
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "5px 0",
        borderBottom: last ? "none" : "1px solid var(--line)",
        color: "var(--muted)"
      }}>
      
      <span>{label}</span>
      <span style={{ color: colors[status], fontWeight: 600, letterSpacing: "0.06em" }}>{status}</span>
    </div>);

}

// ── Main component ────────────────────────────────────────────
// Horizontal-scroll diagram. All 5 nodes visible side-by-side,
// connected by a flowy bezier path. An admin avatar travels along
// that path as the user scrolls horizontally (scroll progress 0→1
// maps to point along the SVG path via getPointAtLength).
// =============================================================
function AuditPipeline({ intro } = {}) {
  const wrapRef = React.useRef(null);
  const scrollRef = React.useRef(null);
  const pathRef = React.useRef(null);

  const [layout, setLayout] = React.useState({ width: 1800, height: 320, nodeCenters: [] });
  const [progress, setProgress] = React.useState(0); // 0..1
  const progressRef = React.useRef(0);
  const [activeStep, setActiveStep] = React.useState(0);
  const [pathLen, setPathLen] = React.useState(0);
  const [avatarPos, setAvatarPos] = React.useState({ x: 0, y: 0, angle: 0 });
  const [stageWidth, setStageWidth] = React.useState(0);
  const [isTouch, setIsTouch] = React.useState(false);

  React.useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  const NODE_W = 300;
  const NODE_GAP = 120;
  const SIDE_PAD = 80;
  const STAGE_H = 460;

  // Compute layout
  const measure = React.useCallback(() => {
    const total = PIPELINE_NODES.length;
    const width = SIDE_PAD * 2 + total * NODE_W + (total - 1) * NODE_GAP;
    const centers = PIPELINE_NODES.map(
      (_, i) => SIDE_PAD + NODE_W / 2 + i * (NODE_W + NODE_GAP)
    );
    setLayout({ width, height: STAGE_H, nodeCenters: centers });
  }, []);

  React.useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Track path length once path renders
  React.useEffect(() => {
    if (pathRef.current) {
      const l = pathRef.current.getTotalLength();
      setPathLen(l);
    }
  }, [layout.width]);

  // Detect touch/coarse-pointer devices — on those, keep native horizontal
  // swipe-to-scroll instead of scroll-jacking the vertical scroll.
  React.useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  // Measure the visible stage width so we know how much horizontal room
  // ("extra") the stage has beyond the visible frame.
  React.useEffect(() => {
    const stageEl = scrollRef.current;
    if (!stageEl) return;
    const measureSizes = () => setStageWidth(stageEl.clientWidth);
    measureSizes();
    const ro = new ResizeObserver(measureSizes);
    ro.observe(stageEl);
    return () => ro.disconnect();
  }, [layout.width]);

  const extra = Math.max(0, layout.width - stageWidth);

  // Position avatar along path based on scroll progress
  React.useEffect(() => {
    if (!pathRef.current || !pathLen) return;
    const dist = progress * pathLen;
    const p = pathRef.current.getPointAtLength(dist);
    const ahead = pathRef.current.getPointAtLength(Math.min(pathLen, dist + 1));
    const angle = Math.atan2(ahead.y - p.y, ahead.x - p.x) * (180 / Math.PI);
    setAvatarPos({ x: p.x, y: p.y, angle });

    // Determine active step (closest node center to current visual position)
    if (layout.nodeCenters.length) {
      const visualX = isTouch ?
      (scrollRef.current ? scrollRef.current.scrollLeft + scrollRef.current.clientWidth / 2 : 0) :
      progress * extra + stageWidth / 2;
      let closest = 0,bestD = Infinity;
      layout.nodeCenters.forEach((c, i) => {
        const d = Math.abs(c - visualX);
        if (d < bestD) {bestD = d;closest = i;}
      });
      setActiveStep(closest);
    }
  }, [progress, pathLen, layout, isTouch, extra, stageWidth]);

  // Touch devices: native horizontal scroll drives progress directly.
  const onScroll = () => {
    if (!isTouch) return;
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const p = max > 0 ? el.scrollLeft / max : 0;
    setProgress(Math.max(0, Math.min(1, p)));
  };

  // Non-touch devices: only take over the wheel while the pointer is
  // actually over the frame. Wheel events target whatever DOM element sits
  // under the cursor, so attaching straight to the stage element gives us
  // pointer-gating for free — move the mouse off the frame and the browser's
  // normal page scroll resumes untouched, nothing to opt back out of.
  React.useEffect(() => {
    if (isTouch || extra <= 0) return;
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e) => {
      // Two-finger horizontal trackpad gestures pass through untouched.
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const cur = progressRef.current;
      const atStart = cur <= 0 && e.deltaY < 0;
      const atEnd = cur >= 1 && e.deltaY > 0;
      if (atStart || atEnd) return; // exhausted in this direction — let the page scroll
      e.preventDefault();
      const next = Math.max(0, Math.min(1, cur + e.deltaY / extra));
      progressRef.current = next;
      setProgress(next);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [isTouch, extra]);

  const jumpTo = (i) => {
    if (!layout.nodeCenters[i]) return;
    if (isTouch) {
      const el = scrollRef.current;
      if (!el) return;
      el.scrollTo({ left: layout.nodeCenters[i] - el.clientWidth / 2, behavior: "smooth" });
      return;
    }
    if (extra <= 0) return;
    const targetProgress = Math.max(0, Math.min(1, (layout.nodeCenters[i] - stageWidth / 2) / extra));
    progressRef.current = targetProgress;
    setProgress(targetProgress);
  };

  // Build a straight horizontal path connecting all node centers
  const baselineY = STAGE_H * 0.76;
  const buildPath = () => {
    const cs = layout.nodeCenters;
    if (cs.length < 2) return "";
    return `M ${cs[0]} ${baselineY} L ${cs[cs.length - 1]} ${baselineY}`;
  };
  const pathD = buildPath();

  const total = PIPELINE_NODES.length;

  return (
    <div
      ref={wrapRef}
      style={{
        position: "relative",
        width: "100%",
        minWidth: 0,
        maxWidth: "var(--frame-w)",
        margin: "0 auto"
      }}>
      
      <div>
        {intro && <div style={{ marginBottom: 24 }}>{intro}</div>}

        <div
          style={{
            position: "relative",
            border: "1px solid var(--ink)",
            background: "var(--surface)",
            overflow: "hidden",
            minWidth: 0,
            maxWidth: "100%"
          }}>
        
        {/* Header */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            padding: "32px 36px 24px",
            borderBottom: "1px solid var(--line)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 24
          }}>
          
          <h3
            style={{
              fontFamily: window.serifFamily,
              fontStyle: "italic",
              fontWeight: 400,

              lineHeight: 1.05,
              letterSpacing: "-0.015em",
              color: "var(--ink)",
              margin: 0, fontSize: "26px"
            }}>
            
            Audit user access
          </h3>
          <window.MonoLabel>ADMIN TASK PIPELINE</window.MonoLabel>
        </div>

        {/* Stage — horizontal scroll (native on touch, scroll-jacked otherwise) */}
        <div
          ref={scrollRef}
          onScroll={onScroll}
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            overflowX: isTouch ? "auto" : "hidden",
            overflowY: "hidden",
            scrollSnapType: isTouch ? "x proximity" : "none",
            WebkitOverflowScrolling: "touch"
          }}>
          
          {/* Inner stage at full width */}
          <div
            style={{
              position: "relative",
              width: layout.width,
              height: STAGE_H,
              transform: !isTouch ? `translateX(${-progress * extra}px)` : undefined,
              willChange: !isTouch ? "transform" : undefined
            }}>
            
            {/* Dot grid */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.5,
                pointerEvents: "none",
                backgroundImage:
                "radial-gradient(color-mix(in oklch, var(--ink) 20%, transparent) 1px, transparent 1px)",
                backgroundSize: "20px 20px"
              }} />
            

            {/* Bezier path */}
            <svg
              aria-hidden
              width={layout.width}
              height={STAGE_H}
              style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
              
              <defs>
                <filter id="ap-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" />
                </filter>
              </defs>
              {/* Faint base */}
              <path
                ref={pathRef}
                d={pathD}
                fill="none"
                stroke="var(--line)"
                strokeWidth="2" />
              
              {/* Travelled segment (accent) */}
              {pathLen > 0 &&
              <path
                d={pathD}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2.5"
                strokeDasharray={`${pathLen} ${pathLen}`}
                strokeDashoffset={pathLen * (1 - progress)}
                style={{ transition: "stroke-dashoffset 120ms linear" }} />

              }
              {/* Animated dotted lead-line on top */}
              <path
                d={pathD}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1.5"
                strokeDasharray="4 10"
                opacity="0.5"
                style={{ animation: "auditDash 4s linear infinite" }} />
              
              {/* Node anchor pins */}
              {layout.nodeCenters.map((cx, i) =>
              <g key={i}>
                  <circle cx={cx} cy={baselineY} r="6" fill="var(--surface)" stroke="var(--ink)" strokeWidth="1.5" />
                  <circle cx={cx} cy={baselineY} r="2.5" fill={i <= activeStep ? "var(--accent)" : "var(--muted)"} />
                </g>
              )}
            </svg>

            {/* Admin avatar that travels along the path */}
            {pathLen > 0 &&
            <AdminAvatar x={avatarPos.x} y={avatarPos.y} />
            }

            {/* Nodes */}
            {PIPELINE_NODES.map((node, i) => {
              const cx = layout.nodeCenters[i] || 0;
              // All cards sit above the baseline at same height
              const above = true;
              const top = baselineY - 220;
              return (
                <div
                  key={node.id}
                  style={{
                    position: "absolute",
                    left: cx - NODE_W / 2,
                    top,
                    width: NODE_W,
                    background: "var(--surface)",
                    border: "1px solid var(--ink)",
                    padding: 18,
                    boxShadow: "6px 6px 0 var(--ink)",
                    ...(node.cardStyle || {}),
                    scrollSnapAlign: "center",
                    transition: "transform 250ms, box-shadow 250ms",
                    transform: i === activeStep ? "scale(1.02)" : "scale(1)"
                  }}>
                  
                  {/* Connector lines removed */}
                  
                  {/* Step tag */}
                  <div
                    style={{
                      position: "absolute",
                      top: -14,
                      left: -1,
                      background: i === activeStep ? "var(--accent)" : "var(--ink)",
                      color: "var(--ink-inverse)",
                      fontFamily: window.monoFamily,
                      fontSize: 10,
                      letterSpacing: "0.1em",
                      padding: "4px 10px",
                      fontWeight: 600
                    }}>
                    
                    STEP 0{i + 1}
                  </div>
                  {/* Top bar */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      paddingBottom: 12,
                      marginBottom: 14,
                      borderBottom: "1px solid var(--line)"
                    }}>
                    
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: node.dot,
                        boxShadow: `0 0 10px ${node.dot}`
                      }} />
                    
                    <h4
                      style={{
                        margin: 0,
                        fontFamily: window.sansFamily,
                        fontWeight: 600,
                        fontSize: 13,
                        letterSpacing: "0.01em",
                        color: "var(--ink)"
                      }}>
                      
                      {node.title}
                    </h4>
                  </div>
                  <div style={{ minHeight: 90 }}>{node.render()}</div>
                </div>);

            })}
          </div>
        </div>

        {/* Stepper rail */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            padding: "20px 36px 24px",
            borderTop: "1px solid var(--line)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 18
          }}>
          
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {PIPELINE_NODES.map((n, i) =>
            <button
              key={n.id}
              onClick={() => jumpTo(i)}
              aria-label={`Jump to ${n.title}`}
              style={{
                flex: "0 0 32px",
                textAlign: "left",
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
                fontFamily: "inherit"
              }}>
              
                <div
                style={{
                  height: 3,
                  background: i <= activeStep ? "var(--accent)" : "var(--line)",
                  transition: "background 250ms"
                }} />
              </button>
            )}
          </div>
        </div>

        {/* Footer caption */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            padding: "14px 36px",
            borderTop: "1px solid var(--line)",
            display: "flex",
            justifyContent: "space-between",
            background: "var(--bg)"
          }}>
          
          <window.MonoLabel>{isTouch ? "SWIPE TO TRAVERSE" : "HOVER + SCROLL TO TRAVERSE"}</window.MonoLabel>
        </div>
      </div>
      </div>

      <style>{`
        @keyframes auditDash {
          to { stroke-dashoffset: -56; }
        }
        @keyframes adminPulse {
          0%, 100% { box-shadow: 0 0 0 0 color-mix(in oklch, var(--accent) 50%, transparent); }
          50% { box-shadow: 0 0 0 12px color-mix(in oklch, var(--accent) 0%, transparent); }
        }
      `}</style>
    </div>);

}

// ── Admin avatar (the circular figure) — travels along the path
function AdminAvatar({ x, y }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        zIndex: 1,
        pointerEvents: "none",
        transition: "left 80ms linear, top 80ms linear"
      }}>
      
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "var(--accent)",
          border: "2px solid var(--ink)",
          boxShadow: "0 6px 0 var(--ink)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "adminPulse 2s ease-in-out infinite",
          position: "relative"
        }}>
        
        {/* Simple admin glyph: head + shoulders */}
        <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden>
          <circle cx="16" cy="12" r="5" fill="var(--ink-inverse)" />
          <path d="M 5 27 C 5 21 9 18 16 18 C 23 18 27 21 27 27 Z" fill="var(--ink-inverse)" />
        </svg>
        {/* Tag below */}
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--ink)",
            color: "var(--ink-inverse)",
            fontFamily: window.monoFamily,
            fontSize: 9,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "3px 8px",
            whiteSpace: "nowrap",
            fontWeight: 600
          }}>
          
          IT ADMIN
        </div>
      </div>
    </div>);

}

function shortTitle(t) {
  const map = {
    "What can the user access?": "ACCESS",
    "Cloud Level": "CLOUD",
    "Tenant Sprawl": "TENANT",
    "Service Sprawl": "SERVICE",
    "Artefact Matrix": "ARTEFACT",
    "Rule Evaluation Engine": "RULES",
    "The Friction": "FRICTION"
  };
  return map[t] || t.toUpperCase();
}

function NavButton() {return null;}

window.AuditPipeline = AuditPipeline;