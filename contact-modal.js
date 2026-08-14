/* Shared contact modal — the ONE implementation. Used by index.html, about.html, work.html
   (site-work/stage.jsx calls window.openContactModal()). Do not fork this. */
(function(){
if(window.openContactModal)return; // guard: double-include is a no-op
const SANS="'DM Sans',system-ui,sans-serif",MONO="'JetBrains Mono',ui-monospace,monospace",ACCENT="#B5522E";
const css=`@keyframes cmFade{from{opacity:0}to{opacity:1}}@keyframes cmPop{from{opacity:0;transform:translateY(12px) scale(.98)}to{opacity:1;transform:none}}@keyframes cmPulse{0%,100%{opacity:1}50%{opacity:.35}}
.cm-overlay{position:fixed;inset:0;z-index:95;background:rgba(14,14,12,.5);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;animation:cmFade 220ms ease both;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
.cm-card{width:min(560px,92vw);background:#FBFAF6;border:1px solid #D9D4C8;border-radius:18px;box-shadow:0 40px 80px -20px rgba(0,0,0,.45);overflow:hidden;font-family:${SANS};animation:cmPop 320ms cubic-bezier(.22,1,.36,1) both}
.cm-head{display:flex;justify-content:space-between;align-items:center;padding:16px 22px;border-bottom:1px solid #E8E4DC}
.cm-kicker{font-family:${MONO};font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#8A857C}
.cm-close{all:unset;cursor:pointer;font-family:${MONO};font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#8A857C;display:flex;align-items:center;gap:6px}
.cm-close kbd{font-family:${MONO};font-size:10px;padding:3px 7px;border-radius:5px;border:1px solid #D9D4C8;background:#FFF;color:#1C1C1A}
.cm-card :focus-visible{outline:2px solid ${ACCENT};outline-offset:3px;border-radius:4px}
.cm-body{padding:28px 22px 24px}
.cm-body h2{font-family:'Cormorant Garamond',serif;font-weight:500;font-size:38px;line-height:1.04;color:#111110;margin:0 0 6px;letter-spacing:-.01em}
.cm-lede{font-family:${SANS};font-weight:400;font-size:14px;line-height:1.55;color:#5C5A53;margin:0 0 22px;max-width:440px}
.cm-rows{display:flex;flex-direction:column;gap:2px}
.cm-row{display:grid;grid-template-columns:84px 1fr 20px;align-items:center;gap:18px;padding:14px 0;border-bottom:1px solid #E8E4DC;text-decoration:none;transition:background 160ms}
.cm-row:hover{background:rgba(181,82,46,.04)}
.cm-row .k{font-family:${MONO};font-weight:400;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#8A857C}
.cm-row .v{font-family:${SANS};font-size:15px;color:#111110;font-weight:500}
.cm-row .a{color:${ACCENT};font-size:14px}
.cm-clocks{margin-top:24px;display:grid;grid-template-columns:1fr 1fr;gap:18px;padding-top:18px;border-top:1px dashed rgba(217,212,200,.9)}
.cm-clocks.solo{grid-template-columns:1fr}
.cm-clabel{font-family:${MONO};font-weight:400;font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:#8A857C;margin-bottom:6px;display:flex;align-items:center;gap:8px}
.cm-dot{width:6px;height:6px;border-radius:999px;background:#1F8A5B;animation:cmPulse 2.2s infinite}
.cm-time{font-family:${MONO};font-weight:400;font-size:15px;color:#111110;letter-spacing:.04em}
.cm-tz{color:#8A857C;font-size:11px;letter-spacing:.08em}`;

let overlay=null,timer=null,lastFocus=null,prevOverflow="";
const FOCUSABLE='a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])';
function fmt(tz,now){try{return new Intl.DateTimeFormat([],{timeZone:tz,hour:"numeric",minute:"2-digit",hour12:true}).format(now).toUpperCase().replace(/\s+/g," ");}catch(e){return"";}}
function tzShort(now){try{const p=new Intl.DateTimeFormat([],{timeZoneName:"short",hour:"numeric"}).formatToParts(now).find(x=>x.type==="timeZoneName");return p?p.value:"";}catch(e){return"";}}
function localTz(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"";}catch(e){return"";}}
function tick(){if(!overlay)return;const now=new Date();overlay.querySelector("[data-blr]").textContent=fmt("Asia/Kolkata",now);const l=overlay.querySelector("[data-loc]");if(l)l.textContent=fmt(localTz(),now);}

function open(){
  if(overlay)return;
  if(!document.getElementById("cm-styles")){const s=document.createElement("style");s.id="cm-styles";s.textContent=css;document.head.appendChild(s);}
  lastFocus=document.activeElement;
  const same=localTz()==="Asia/Kolkata",now=new Date();
  overlay=document.createElement("div");overlay.className="cm-overlay";overlay.setAttribute("role","dialog");overlay.setAttribute("aria-modal","true");overlay.setAttribute("aria-labelledby","cm-title");
  overlay.innerHTML=`<div class="cm-card"><div class="cm-head"><div class="cm-kicker">/ contact</div><button type="button" class="cm-close" aria-label="Close contact"><kbd>esc</kbd>close</button></div>
<div class="cm-body"><h2 id="cm-title">Let's talk.</h2><p class="cm-lede">Available for high-impact roles at the intersection of design and emerging tech.</p>
<div class="cm-rows">
<a class="cm-row" href="mailto:suchigoyal12@gmail.com"><span class="k">email</span><span class="v">suchigoyal12@gmail.com</span><span class="a">↗</span></a>
<a class="cm-row" href="https://linkedin.com/in/suchigoyal12" target="_blank" rel="noreferrer"><span class="k">linkedin</span><span class="v">linkedin.com/in/suchigoyal12</span><span class="a">↗</span></a>
<a class="cm-row" href="/suchi-resume.pdf" target="_blank" rel="noopener noreferrer"><span class="k">resume</span><span class="v">Suchi · Resume</span><span class="a">↗</span></a>
</div>
<div class="cm-clocks${same?" solo":""}"><div><div class="cm-clabel"><span class="cm-dot"></span>Suchi · Bangalore</div><div class="cm-time"><span data-blr>${fmt("Asia/Kolkata",now)}</span> <span class="cm-tz">IST</span></div></div>
${same?"":`<div><div class="cm-clabel">Your time</div><div class="cm-time"><span data-loc>${fmt(localTz(),now)}</span> <span class="cm-tz">${tzShort(now)}</span></div></div>`}</div></div></div>`;
  document.body.appendChild(overlay);
  prevOverflow=document.body.style.overflow;document.body.style.overflow="hidden";
  overlay.addEventListener("click",e=>{if(e.target===overlay)close();});
  overlay.querySelector(".cm-close").addEventListener("click",close);
  overlay.addEventListener("keydown",trap);
  overlay.querySelector(".cm-close").focus();
  timer=setInterval(tick,30000);
}
function trap(e){
  if(e.key!=="Tab")return;
  const items=[...overlay.querySelectorAll(FOCUSABLE)];if(!items.length)return;
  const first=items[0],last=items[items.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
}
function close(){
  if(!overlay)return;
  clearInterval(timer);overlay.remove();overlay=null;
  document.body.style.overflow=prevOverflow;
  if(lastFocus&&lastFocus.focus)lastFocus.focus();
  lastFocus=null;
}
document.addEventListener("click",e=>{const t=e.target.closest("[data-contact]");if(t){e.preventDefault();open();}});
document.addEventListener("keydown",e=>{if(e.key==="Escape")close();});
window.openContactModal=open;window.closeContactModal=close;window.isContactModalOpen=()=>!!overlay;
})();
