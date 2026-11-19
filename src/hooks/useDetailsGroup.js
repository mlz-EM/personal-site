import { useRef, useState } from 'react';

// Native details own their open state, including nested sections on Resources.
const useDetailsGroup = () => {
  const ref = useRef(null);
  const [anyOpen, setAnyOpen] = useState(false);
  const hasOpenDetails = () => Boolean(ref.current.querySelector('details[open]'));

  const toggleAll = () => {
    const open = !hasOpenDetails();
    ref.current.querySelectorAll('details').forEach((detail) => detail.toggleAttribute('open', open));
    setAnyOpen(open);
  };

  return {
    groupProps: { ref, onToggleCapture: () => setAnyOpen(hasOpenDetails()) },
    anyOpen,
    toggleAll,
  };
};

export default useDetailsGroup;
