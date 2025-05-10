import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
if (window.location.href.indexOf('#') > 0) {
  window.open(location.origin, '_self');
}
if (window.location.search.indexOf('token') > 0) {
  const searchParams = new URLSearchParams(window.location.search);
  sessionStorage.setItem('token', searchParams.get('token')!);
  window.open(location.origin, '_self');
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
