import React, {
  Suspense,
  lazy,
  useEffect,
  useState,
} from 'react';

import { NavLink } from 'react-router-dom';
import routes from '../../data/routes';

const Menu = lazy(() => import('react-burger-menu/lib/menus/slide'));

const Hamburger = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <div className="hamburger-container">
      <nav className="main" id="hamburger-nav" aria-label="Main menu">
        <ul>
          <li className={`menu ${open ? 'close-menu' : 'open-menu'}`}>
            <button
              type="button"
              className="menu-button"
              onClick={() => setOpen((prev) => !prev)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            >
              <span aria-hidden="true">{open ? '\u2715' : '\u2630'}</span>
              <span className="visually-hidden">{open ? 'Close menu' : 'Open menu'}</span>
            </button>
          </li>
        </ul>
      </nav>
      <Suspense fallback={null}>
        <Menu right isOpen={open} onClose={() => setOpen(false)}>
          <ul className="hamburger-ul" id="mobile-menu">
            {routes.map((l) => (
              <li key={l.label}>
                <NavLink
                  to={l.path}
                  className={`hamburger-link ${l.index ? 'index-li' : ''}`}
                  onClick={() => setOpen(false)}
                  aria-label={`Go to ${l.label}`}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </Menu>
      </Suspense>
    </div>
  );
};

export default Hamburger;
