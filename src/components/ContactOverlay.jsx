import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./ContactOverlay.css";

// Ported from legacy/contact-modal.js — the one shared implementation, used by
// Homepage, About and Work. Contact is an overlay, not a page: it opens above
// whatever is on screen and does not change the URL, which is why the provider
// sits outside <Routes> in App.jsx.
//
// The six project pages have no contact affordance. That is intentional; do not
// add one when porting them.
//
// Everything the original did is preserved: the [data-contact] document
// handler, Escape to close, backdrop click, the Tab focus trap, focus restored
// to whatever opened it, body scroll locked while open, and the two clocks
// ticking every 30 seconds with the visitor's own time hidden when they are
// already on IST.
//
// One thing deliberately not carried over: window.openContactModal /
// closeContactModal / isContactModalOpen. legacy/site-work/stage.jsx calls the
// global today; when the stage is ported it uses useContact() instead, so the
// globals would only be a bridge that outlives its purpose.

const ContactContext = createContext({
  isOpen: false,
  open: () => {},
  close: () => {},
});

const FOCUSABLE = 'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])';
const BLR_TZ = "Asia/Kolkata";

function fmt(tz, now) {
  try {
    return new Intl.DateTimeFormat([], {
      timeZone: tz,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
      .format(now)
      .toUpperCase()
      .replace(/\s+/g, " ");
  } catch (e) {
    return "";
  }
}

function tzShort(now) {
  try {
    const p = new Intl.DateTimeFormat([], { timeZoneName: "short", hour: "numeric" })
      .formatToParts(now)
      .find((x) => x.type === "timeZoneName");
    return p ? p.value : "";
  } catch (e) {
    return "";
  }
}

function localTz() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch (e) {
    return "";
  }
}

export function ContactProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  // The original bound this at document level so any [data-contact] element on
  // any page opened the modal. Keeping it means ported markup can carry the
  // attribute exactly as authored — the Homepage rail's contact item needs no
  // edit at all.
  useEffect(() => {
    const onClick = (e) => {
      const t = e.target.closest("[data-contact]");
      if (t) {
        e.preventDefault();
        open();
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [open]);

  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);

  return (
    <ContactContext.Provider value={value}>
      {children}
      {isOpen && <ContactModal onClose={close} />}
    </ContactContext.Provider>
  );
}

function ContactModal({ onClose }) {
  const overlayRef = useRef(null);
  const closeRef = useRef(null);
  const [now, setNow] = useState(() => new Date());

  const tz = localTz();
  const same = tz === BLR_TZ;

  // Clocks tick on the original's 30s interval.
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  // Escape closes from anywhere, as before.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock body scroll while open and restore whatever was there before —
  // the Homepage sets overflow on body itself, so this must put it back
  // rather than clear it.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Focus the close button on open, restore focus to the opener on close.
  useEffect(() => {
    const lastFocus = document.activeElement;
    closeRef.current?.focus();
    return () => {
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };
  }, []);

  const onKeyDown = (e) => {
    if (e.key !== "Tab") return;
    const items = [...overlayRef.current.querySelectorAll(FOCUSABLE)];
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      ref={overlayRef}
      className="cm-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cm-title"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      onKeyDown={onKeyDown}>
      <div className="cm-card">
        <div className="cm-head">
          <div className="cm-kicker">/ contact</div>
          <button
            type="button"
            className="cm-close"
            aria-label="Close contact"
            ref={closeRef}
            onClick={onClose}>
            <kbd>esc</kbd>close
          </button>
        </div>

        <div className="cm-body">
          <h2 id="cm-title">Let's talk.</h2>
          <p className="cm-lede">
            Available for high-impact roles at the intersection of design and emerging tech.
          </p>

          <div className="cm-rows">
            <a className="cm-row" href="mailto:suchigoyal12@gmail.com">
              <span className="k">email</span>
              <span className="v">suchigoyal12@gmail.com</span>
              <span className="a">↗</span>
            </a>
            <a
              className="cm-row"
              href="https://linkedin.com/in/suchigoyal12"
              target="_blank"
              rel="noreferrer">
              <span className="k">linkedin</span>
              <span className="v">linkedin.com/in/suchigoyal12</span>
              <span className="a">↗</span>
            </a>
            <a
              className="cm-row"
              href="/suchi-resume.pdf"
              target="_blank"
              rel="noopener noreferrer">
              <span className="k">resume</span>
              <span className="v">Suchi · Resume</span>
              <span className="a">↗</span>
            </a>
          </div>

          <div className={same ? "cm-clocks solo" : "cm-clocks"}>
            <div>
              <div className="cm-clabel">
                <span className="cm-dot"></span>Suchi · Bangalore
              </div>
              <div className="cm-time">
                <span>{fmt(BLR_TZ, now)}</span> <span className="cm-tz">IST</span>
              </div>
            </div>
            {!same && (
              <div>
                <div className="cm-clabel">Your time</div>
                <div className="cm-time">
                  <span>{fmt(tz, now)}</span> <span className="cm-tz">{tzShort(now)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function useContact() {
  return useContext(ContactContext);
}
