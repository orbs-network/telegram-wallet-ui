import React from 'react'
import { Link } from 'react-router-dom';
import { usePersistedStore } from '../../store/persisted-store';

export function Page3() {
  const {hideOnboarding} = usePersistedStore()
  return (
    <div>
      <p>Page3</p>
      <Link onClick={hideOnboarding} to='/'>Done</Link>
    </div>
  );
}

