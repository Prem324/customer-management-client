import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navigation.css";
import { GoHomeFill } from "react-icons/go";
import { IoPerson } from "react-icons/io5";
import { IoMdAddCircle } from "react-icons/io";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: <GoHomeFill style={{ fontSize: "26px" }} />,
    },
    {
      path: "/customers",
      label: "Customers",
      icon: <IoPerson style={{ fontSize: "26px" }} />,
    },
    {
      path: "/customers/new",
      label: "Add Customer",
      icon: <IoMdAddCircle style={{ fontSize: "26px" }} />,
    },
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h1>
            <Link
              to="/"
              style={{ color: "white", textDecoration: "none", border: "none" }}
            >
              Customer Management
            </Link>
          </h1>
        </div>
        <ul className="nav-menu">
          {navItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${
                  location.pathname === item.path ? "active" : ""
                }`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
