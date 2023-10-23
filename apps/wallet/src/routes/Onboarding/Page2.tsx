import React from 'react'
import { Link } from 'react-router-dom';

export function Page2() {
  return (
    <div>
      <p>Page2</p>
      <Link to="/3">Next</Link>
    </div>
  );
}

