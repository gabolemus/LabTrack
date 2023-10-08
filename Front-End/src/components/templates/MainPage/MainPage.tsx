import React, { ReactNode, useEffect, useState } from "react";
import Navbar from "../../organisms/Navbar/Navbar";
import "./MainPage.scss";
import { Page, pages } from "../../../utils/pages";
import { useNavigate } from "react-router-dom";

interface Props {
  /** Element(s) to be rendered inside the main page */
  children: ReactNode | ReactNode[];
  /** User roles that can access the page */
  roles?: Array<string>;
}

/**
 * Template for the components that will be rendered inside the main page
 * @param {Props} props - Properties passed to component
 */
const MainPage: React.FC<Props> = ({ children, roles }: Props) => {
  const [showLogin, setShowLogin] = useState(true);
  const [navBarPages, setNavBarPages] = useState<Array<Page>>([]);
  const navigation = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    if (userRole === null && roles !== undefined) {
      navigation("/login");
    }

    if (userRole !== null && roles !== undefined) {
      if (!roles.includes(userRole)) {
        navigation("/login");
      }
    }

    setShowLogin(localStorage.getItem("logged") === null);

    const role = localStorage.getItem("role");
    if (role === null) {
      setNavBarPages(pages.allUsers.navbar);
    }

    // If it's not null, check if it's an admin or a super admin
    if (role === "admin") {
      setNavBarPages(pages.inquiriesSupervisors.navbar);
    } else if (role === "superAdmin") {
      setNavBarPages(pages.systemAdministrators.navbar);
    }
  }, []);

  /** Logout callback function */
  const logoutCallback = () => {
    setShowLogin(true);
    setNavBarPages(pages.allUsers.navbar);
  };

  return (
    <>
      <Navbar
        showLogin={showLogin}
        logoutCallback={logoutCallback}
        pages={navBarPages}
      />
      <main className="container">{children}</main>
    </>
  );
};

export default MainPage;
