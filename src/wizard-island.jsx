import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PoolConnectionWizard } from 'sv2-wizard';
import './wizard-tailwind.css';

let root = null;

/**
 * Mount the PoolConnectionWizard React component into a DOM container.
 * Called when the wizard modal opens.
 */
export function mountWizard(container) {
  if (root) {
    root.unmount();
  }
  root = createRoot(container);
  root.render(
    React.createElement(StrictMode, null,
      React.createElement(PoolConnectionWizard)
    )
  );
}

/**
 * Unmount the wizard and clean up the React root.
 * Called when the wizard modal closes.
 */
export function unmountWizard() {
  if (root) {
    root.unmount();
    root = null;
  }
}
