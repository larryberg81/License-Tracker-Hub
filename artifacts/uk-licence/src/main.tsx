import { createRoot } from 'react-dom/client';
import { setAuthTokenGetter } from '@workspace/api-client-react';

import App from './App';

import './index.css';

// Retain the existing bearer-token login contract; the API now verifies
// signatures and expiry instead of trusting an arbitrary localStorage value.
setAuthTokenGetter(() => localStorage.getItem('admin_token'));
window.addEventListener('admin-session-expired', () => {
  window.location.assign(`${import.meta.env.BASE_URL}admin`);
});

createRoot(document.getElementById('root')!).render(<App />);
