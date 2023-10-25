import React from 'react'
import { Link } from 'react-router-dom';
import { Page } from '../../components';

export function Page2() {
  return (
    <Page>
      <p>Page2</p>
      <Link to="/3">Next</Link>
    </Page>
  );
}

