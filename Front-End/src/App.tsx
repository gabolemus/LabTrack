import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { pages } from "./utils/pages";

/** Component that render the web application */
const App = () => {
  return (
    <Routes>
      {pages.all.map((page) => (
        <Route key={page.name} path={page.path} element={page.element} />
      ))}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
