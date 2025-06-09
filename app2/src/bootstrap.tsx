import App from "./app";
import React from "react";
import { createRoot } from 'react-dom/client';
import '../public-path';

let root: ReturnType<typeof createRoot> | null = null;
function render(props: any) {
  const { container } = props;
  const rootElement = container ? container.querySelector('#root2') : document.querySelector('#root2');
  if (rootElement) {
    root = createRoot(rootElement);
    root.render(<App />);
  }
}

if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}

export async function bootstrap() {
  console.log('[app2] react app bootstraped');
}

export async function mount(props) {
  console.log('[app2] props from main framework', props);
  render(props);
}

export async function unmount(props) {
  root?.unmount();
}