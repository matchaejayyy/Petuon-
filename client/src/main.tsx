import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import RoutesComponent from './routes/Routes';  // Import Routes

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RoutesComponent />  {/* Render the Routes component */}
  </StrictMode>
);
