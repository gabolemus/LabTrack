import React, { ReactNode, useEffect, useState } from "react";
import Navbar from "../../organisms/Navbar/Navbar";

import "./MainPage.scss";

interface Props {
  /** Element(s) to be rendered inside the main page */
  children: ReactNode | ReactNode[];
}

/**
 * Template for the components that will be rendered inside the main page
 * @param {Props} props - Properties passed to component
 */
const MainPage: React.FC<Props> = ({ children }: Props) => {
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("logged") === null) {
      setShowLogin(true);
    }
  }, []);

  return (
    <>
      <Navbar showLogin={showLogin} />
      <main className="container">{children}</main>
    </>
  );
};

export default MainPage;
