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
import { MdAccountCircle } from "react-icons/md";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { FaGear } from "react-icons/fa6";
import "../styleCss/SideBarNHeader.css";
function SidebarAdmin({ children }) {
  const navigate = useNavigate();
  const [toggleLogOut, setToggleLogOut] = useState(false);
  const [isOpenSideBar,setIsOpenSideBar] = useState(true)
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
    },
  ];

  const toggleSideBar = ()=> setIsOpenSideBar(!isOpenSideBar)
  function toggleBtnLogOut() {
    return setToggleLogOut(!toggleLogOut);
  }

  function handleLogOut() {
    localStorage.removeItem("userData");
    navigate("/");
  }

  useEffect(() => {
    async function verifyToken() {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData) {
        localStorage.removeItem("userData");
        navigate("/");
        return;
      }
      await axios
        .post(
          "http://localhost:5000/auth",
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + userData.token,
            },
          }
        )
        .then((response) => response.data)
        .then((data) => {
          if (data.status === "ok") {
            console.log("auth success");
          } else {
            console.log("auth fail");
            localStorage.removeItem("userData");
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
        <div
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "flex-start",
            alignItems: "center",
            paddingLeft: "1rem",
          }}
        >
          <div>Username:</div>
        </div>
        <div
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
            paddingRight: "1rem",
          }}
        >
          <MdAccountCircle
            className={
              toggleLogOut === false ? "btn-toggleLogOut" : "btn-toggleLogOut2"
            }
            size={30}
            onClick={() => toggleBtnLogOut()}
          />
          {toggleLogOut && (
            <div className="boxDropdown">
              <div
                className="dropdownLogout"
                onClick={() => console.log("Setting")}
              >
                <FaGear />
                <div style={{ paddingLeft: 10 }}>ตั้งค่า</div>
              </div>
              <div onClick={() => handleLogOut()} className="dropdownLogout">
                <RiLogoutBoxRFill />
                <div style={{ paddingLeft: 10 }}>ออกจากระบบ</div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="body">
        <div className={ isOpenSideBar ?"container": "container-narrow"}>
          <div className="top-corner">
          <GiHamburgerMenu size={20} className="hamburgerMenu" onClick={toggleSideBar}/>
          </div>

          {menuItem.map((item, index) => {
            return (
              <NavLink to={item.path} key={index} className="link" title={item.title}>
                <div className="icon">{item.icon}</div>
                { isOpenSideBar && <div className="titleName">{item.title}</div>}
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
