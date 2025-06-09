// To fix the issue of missing type declaration for 'react', 
// you can try running the following command in your terminal:
// npm i --save-dev @types/react
// If you don't want to install the type package, 
// you can add a new declaration file with 'declare module 'react';'
import React from "react";
import Button from './Button';

const App = () => (
// To fix the 'Cannot use JSX unless the '--jsx' flag is provided' issue, 
// ensure the tsconfig.json file has the correct 'jsx' option set.
// For React projects, it's recommended to use 'react-jsx' or 'react-jsxdev' for TypeScript 4.1+.
// Here we keep the original JSX code as the fix is usually at the configuration level.
  <div>
    <h1>Basic Host-Remote</h1>
    <h2>App 2啊</h2>
      <Button />
  </div>
);

export default App;