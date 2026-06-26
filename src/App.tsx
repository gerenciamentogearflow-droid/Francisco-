/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      {isAuthenticated ? (
        <Dashboard onLogout={() => setIsAuthenticated(false)} />
      ) : (
        <Login onLogin={() => setIsAuthenticated(true)} />
      )}
    </>
  );
}
