import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";

import * as FaIcon from "react-icons/fa";
import * as Io5Icon from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaRegStar } from "react-icons/fa6";
import { FaBarsProgress } from "react-icons/fa6";
import { MdAdminPanelSettings } from "react-icons/md";
import "../styleCss/SideBarNHeader.css";
function Sidebar({ children }) {
  const navigate = useNavigate();
  //Ex
  const [userInfo, setUserInfo] = useState({
    name: "admin",
    isAdmin: 1,
  });
  ////////////
  const menuItem = [
    {
      path: "/main/",
      title: "Home",
      icon: <FaIcon.FaHome />,
    },
    {
      path: "/main/docFlow",
      title: "Document Flow",
      icon: <Io5Icon.IoDocumentText />,
    },
    {
      path: "/main/faFlow",
      title: "Favorite Flow",
      icon: <FaRegStar />,
    },
    {
      path: "/main/progress",
      title: "Progress",
      icon: <FaBarsProgress />,
    },
    {
      path: "/main/history",
      title: "History",
      icon: <FaIcon.FaHistory />,
    },
    {
      path: "/admin/",
      title: "Admin Management",
      icon: <MdAdminPanelSettings />,
    },
  ];

  function handleLogOut() {
    localStorage.removeItem("token");
    //delete from redux state
    navigate("/");
  }

  //useEffect load redux state

  useEffect(() => {
    async function verifyToken() {
      const token = localStorage.getItem("token");
      await axios
        .post(
          "http://localhost:5000/auth",
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        )
        .then((response) => response.data)
        .then((data) => {
          if (data.status === "ok") {
            console.log("auth success");
          } else {
            console.log("auth fail");
            localStorage.removeItem("token");
            navigate("/");
          }
        })
        .catch((error) => console.error("err : ", error));
    }
    verifyToken();
  }, []);

  return (
    <div>
      <div className="header">
        <button type="button" onClick={() => handleLogOut()}>
          <p>Log Out</p>
        </button>
      </div>
      <div className="body">
        <div className="container">
          <div className="top-corner">
            <GiHamburgerMenu size={30} />
          </div>
          {menuItem.map((item, index) => {
            if (item.title !== "Admin Management" || userInfo.isAdmin === 1) {
              return (
                <NavLink to={item.path} key={index} className="link">
                  <div className="icon">{item.icon}</div>
                  <div className="titleName">{item.title}</div>
                </NavLink>
              );
            }
          })}
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
}

export default Sidebar;
