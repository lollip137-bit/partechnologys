'use client';

import { useEffect, useState } from 'react';

/** Glass cookie consent — appears once, remembers the choice. */
export default function CookieBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('par-cookies') !== null) return;
    const t = setTimeout(() => setShow(true), 1800);
    return () => clearTimeout(t);
  }, []);

  const choose = (v: string) => {
    localStorage.setItem('par-cookies', v);
    setShow(false);
  };

  if (!show) return null;
  return (
    <div className="cookiebar" role="dialog" aria-label="Cookie preferences">
      <div className="cookiebar-glow" />
      <p>
        We use cookies to shape a premium experience — analytics only, never sold.
      </p>
      <div className="cookiebar-actions">
        <button className="cookie-accept" onClick={() => choose('all')}>Accept</button>
        <button className="cookie-essential" onClick={() => choose('essential')}>Essential only</button>
      </div>
    </div>
  );
}
