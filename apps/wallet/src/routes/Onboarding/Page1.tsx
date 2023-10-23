import React from 'react'
import {Link} from 'react-router-dom'
export function Page1() {
  return (
    <div>
      <p>Page1</p>
        <Link to="/2">Next</Link>
    </div>
  );
}

