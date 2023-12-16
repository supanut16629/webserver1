import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";

import { GiHamburgerMenu } from "react-icons/gi";
import * as FaIcon from "react-icons/fa";
import * as Io5Icon from "react-icons/io5";
import { IoCheckmarkCircle } from "react-icons/io5";
import { PiUserSwitchBold } from "react-icons/pi";
import { CiCirclePlus } from "react-icons/ci";
import { TiFlowMerge } from "react-icons/ti";
import { PiGraphBold } from "react-icons/pi";
import { VscGitPullRequestCreate } from "react-icons/vsc";
import "../styleCss/SideBarNHeader.css";
function SidebarAdmin({ children }) {
  const navigate = useNavigate();

  const menuItem = [
    {
      path: "/admin/",
      title: "Home",
      icon: <FaIcon.FaHome />,
    },
    {
      path: "/admin/approval",
      title: "Approval",
      icon: <IoCheckmarkCircle />,
    },
    {
      path: "/admin/myFlow",
      title: "My Flow",
      icon: <TiFlowMerge />,
    },
    {
      path: "/admin/createFlow",
      title: "Create Flow",
      icon: <CiCirclePlus />,
    },
    {
      path: "/admin/relation",
      title: "Relationship",
      icon: <PiGraphBold />,
    },
    {
      path: "/admin/createRelation",
      title: "Create Relationship",
      icon: <VscGitPullRequestCreate />,
    },
    {
      path: "/main/",
      title: "Switch to User",
      icon: <PiUserSwitchBold />,
    }
  ];
  function handleLogOut() {
    localStorage.removeItem("token");
    navigate("/");
  }

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
            <GiHamburgerMenu size={30}/>
          </div>
          {menuItem.map((item, index) => {
            return (
              <NavLink to={item.path} key={index} className="link">
                <div className="icon">{item.icon}</div>
                <div className="titleName">{item.title}</div>
              </NavLink>
            );
          })}
        </div>

        <main>{children}</main>
      </div>
    </div>
  );
}

export default SidebarAdmin;
