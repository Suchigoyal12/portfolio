import React, { createContext, useContext, useMemo, useState } from "react";

// Placeholder. The real overlay is ported from legacy/contact-modal.js.
//
// Contact is an overlay, not a page — it opens above whatever is on screen
// and does not change the URL, which is why this provider sits outside
// <Routes> in App.jsx rather than being a route of its own.
//
// Two things the port must carry over:
//   · It is available from Homepage, About and Work only. The six project
//     pages have no contact affordance, and that is intentional — do not
//     add one while wiring this up.
//   · The static version binds a document-level click handler on
//     [data-contact] and exposes window.openContactModal /
//     closeContactModal / isContactModalOpen. In React that becomes this
//     context. The rail's contact item also carries a fallback
//     href="contact (old).html" pointing at a page that does not exist;
//     the handler calls preventDefault so it only surfaces on middle-click.
//     Decide what happens to it when the rail is authored (brief 2.7).

const ContactContext = createContext({
  isOpen: false,
  open: () => {},
  close: () => {},
});

export function ContactProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo(
    () => ({ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }),
    [isOpen]
  );

  return (
    <ContactContext.Provider value={value}>
      {children}
      {/* The overlay itself renders here once ported. */}
    </ContactContext.Provider>
  );
}

export function useContact() {
  return useContext(ContactContext);
}
