import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { pages } from "./utils/pages";

const App = () => {
  return (
    <Routes>
      {pages.map((page) => (
        <Route key={page.name} path={page.path} element={page.element} />
      ))}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
