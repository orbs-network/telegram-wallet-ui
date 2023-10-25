import React from 'react'
import {Link} from 'react-router-dom'
import { Page } from '../../components';
export function Page1() {
  return (
    <Page>
      <p>Page1</p>
      <Link to="/2">Next</Link>
    </Page>
  );
}

