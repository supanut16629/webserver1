import React, { useEffect, useState, useMemo } from "react";
import { FaPlus } from "react-icons/fa6";
import axios from "axios";
import "../styleCss/RoleStyle.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { IoAlertCircleOutline } from "react-icons/io5";
//component
import SelectionAddUsers from "../components/SelectionAddUsers";
import TablePersonInRole from "../components/TablePersonInRole";

const WindowAddUserToRole = ({
  listUsers,
  onClickAddUser,
  personToAdd,
  setPersonToAdd,
}) => {
  return (
    <div className="window-overlay">
      <div className="window-add-users-to-role">
        <SelectionAddUsers
          listUsers={listUsers}
          personToAdd={personToAdd}
          setPersonToAdd={setPersonToAdd}
        />
        <div
          style={{
            display: "flex",
            width: "500px",
            justifyContent: "flex-end",
          }}
        >
          <button onClick={() => onClickAddUser()}>ตกลง</button>
        </div>
      </div>
    </div>
  );
};

/////////////////////////////////////////////////////////////////////////
const TabDelete = ({ onClose, selected,handleDelPersonInRole }) => {
  return (
    <div className="window-overlay">
      <div className="tab-del">
        <div
          style={{
            display: "flex",
            width: "100%",
            flexDirection: "column",
            margin: "0.5rem",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <IoAlertCircleOutline size={100} style={{ padding: 0 }} />
          <h2 style={{ padding: 0, margin: 0 }}>ลบรายการที่เลือกหรือไม่?</h2>
          <p style={{ padding: 0, margin: 0 }}>
            เมื่อลบแล้วรายการที่เลือกจะถูกนำออกทันที
          </p>
        </div>

        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-around",
          }}
        >
          <button className="btn-cancel-del-user" onClick={() => onClose()}>
            ยกเลิก
          </button>
          <button
            className="btn-confirm-del-user"
            onClick={() => handleDelPersonInRole()}
          >
            ตกลง
          </button>
        </div>
      </div>
    </div>
  );
};

/////////////////////////////////////////////////////////////////////////
const WindowRole = ({
  onClose,
  handleconfirmRole,
  role,
  setRole,
  role_Name,
  setRole_Name,
  person,
  setPerson,
  handleFetchUserInRole,
}) => {
  const [isOpenSubWindow, setIsOpenSubWindow] = useState(false);
  const [listPersonWithOutRole, setListPersonWithOutRole] = useState([]); // [{user},{user}]
  const [personToAdd, setPersonToAdd] = useState([]);

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [isOpenTabDelete, setIsOpenTabDelete] = useState(false);


  async function handleManageWindowAdduser(usersInRole) {
    const listUserInRoleID = usersInRole.map((item, index) => item._id);
    console.log(listUserInRoleID);
    const userData = JSON.parse(localStorage.getItem("userData"));
    await axios
      .post(
        "http://localhost:5000/api/fetchUserWithOutRole",
        {
          listUserInRoleID,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userData.token,
          },
        }
      )
      .then((res) => res.data)
      .then((data) => {
        // console.log(data.users)
        setListPersonWithOutRole(data.users);
      });
    setIsOpenSubWindow(true);
  }

  const openTabDelete = () => {
    if (person.length === selectedItems.length) {
      alert("ไม่สามารถลบรายการทั้งหมดได้");
      setIsOpenTabDelete(false);
      return;
    }
    setIsOpenTabDelete(true);
  };

  const onCloseTabDelete = () => {
    setIsOpenTabDelete(false);
  };

  function handleAddUserToRole() {
    setIsOpenSubWindow(false);
  }

  const handleDelPersonInRole = async () => {
    // console.log("list uesr_id ที่ต้องหาในการลบ", selected);
    // console.log("role_id ที่ต้องหาในการลบ", role._id);
    const userData = JSON.parse(localStorage.getItem("userData"));
    try {
      const response = await axios.post(
        "http://localhost:5000/api/delUserFromRoleUpdate",
        {
          listIdToDel: selectedItems,
          role_ID: role._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userData.token,
          },
        }
      );
      //ยังไม่เสร็จ เหลือ fetch user ที่มาล่าสุดใหม่
      //call api by axios POST
      await axios
        .post(
          "http://localhost:5000/api/fetchPersonFromRole",
          {
            role_ID: role._id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + userData.token,
            },
          }
        )
        .then((response) => response.data)
        .then((data) => {
          console.log("setPerson =", data.users);
          setPerson(data.users);
        });
      //set ให้หน้าต่างปิด
      onCloseTabDelete();
    } catch (error) {
      console.log(error)
    }
  };


  const handleCheckboxChange = (itemId) => {
    if (selectAll) {
      // If "Select All" is checked, uncheck it and clear selected items
      setSelectAll(false);
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      // Otherwise, toggle the selected status of the clicked item
      const updatedSelectedItems = [...selectedItems];

      if (updatedSelectedItems.includes(itemId)) {
        updatedSelectedItems.splice(updatedSelectedItems.indexOf(itemId), 1);
      } else {
        updatedSelectedItems.push(itemId);
      }

      setSelectedItems(updatedSelectedItems);
    }
  };
  const handleSelectAllChange = () => {
    // Toggle the "Select All" status and clear or populate the selected items accordingly
    setSelectAll(!selectAll);
    setSelectedItems(selectAll ? [] : person.map((item) => item._id));
  };

  const handleDelData = () => {
    console.log(selectedItems)
  };
  return (
    <>
      <div className="window-overlay">
        <div className="window-add-role">
          <u>
            <h2>ชื่อ Role</h2>
          </u>
          <input
            className="textInput-role"
            type="text"
            placeholder="ชื่อ Role ที่ต้องการ"
            value={role_Name}
            onChange={(event) => setRole_Name(event.target.value)}
          ></input>

          <u>
            <h2>{person.length > 0 ? "รายชื่อทั้งหมด" : "ยังไม่มีรายชื่อ"}</h2>
          </u>
          <div className="frame-display-user-in-role">
            {person.length > 0 && (
              <div className="group-header">
                <div
                  style={{ flex: 1, justifyContent: "center", display: "flex" }}
                >
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                  />
                </div>
                <div
                  style={{
                    flex: 1,
                    borderRight: "1px solid",
                    justifyContent: "center",
                    display: "flex",
                  }}
                >
                  ชื่อ
                </div>
                <div
                  style={{
                    flex: 1,
                    borderRight: "1px solid",
                    justifyContent: "center",
                    display: "flex",
                  }}
                >
                  นามสกุล
                </div>
                <div
                  style={{
                    flex: 1,
                    borderRight: "1px solid",
                    justifyContent: "center",
                    display: "flex",
                  }}
                >
                  อีเมล
                </div>
                <div
                  style={{ flex: 1, justifyContent: "center", display: "flex" }}
                >
                  สถานะ
                </div>
              </div>
            )}
            {person.map((item, index) => {
              // console.log(item)
              return (
                <div key={index}>
                  <div className="group-person-in-role">
                    <input
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        display: "flex",
                      }}
                      type="checkbox"
                      checked={selectedItems.includes(item._id)}
                      onChange={() => handleCheckboxChange(item._id)}
                    />
                    <div style={{ flex: 1 }}>{item.firstname}</div>
                    <div style={{ flex: 1 }}>{item.surname}</div>
                    <div style={{ flex: 1 }}>{item.email}</div>
                    <div style={{ flex: 1 }}>
                      {item.isAdmin === 1 ? "Admin" : "User"}
                    </div>
                  </div>
                </div>
              );
            })}
            {/* <TablePersonInRole listPerson={person} role={role} setPerson={setPerson} handleFetchUserInRole={handleFetchUserInRole} /> */}
          </div>
          <div className="frame-btn-del">
            {selectedItems.length !== 0 && (
              <button className="btn-del" onClick={()=>openTabDelete()}>
                <DeleteIcon />
                <p>ลบรายการ</p>
              </button>
            )}
          </div>
          <div className="add-user-frame">
            <div>
              {personToAdd.length > 0 && (
                <u>
                  <h2>รายชื่อที่ต้องการเพิ่ม</h2>
                </u>
              )}
            </div>
            {listPersonWithOutRole.map((item, index) => {
              if (personToAdd.includes(item._id)) {
                return (
                  <div key={index} className="display-user-to-add">
                    <div style={{ flex: 2 }}>
                      ชื่อ : {item.firstname} {item.surname}
                    </div>
                    <div style={{ flex: 1 }}>Email : {item.email}</div>
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {item.isAdmin === 1 ? "Admin" : "User"}
                    </div>
                  </div>
                );
              }
            })}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "700px",
              borderTop: "0.5px solid",
              paddingTop: "0.5rem",
            }}
          >
            <button
              className="btn-add-name"
              onClick={() => handleManageWindowAdduser(person)}
            >
              + เพิ่มรายชื่อ
            </button>
            <div className="box-btn-in-window">
              <button className="close-button" onClick={onClose}>
                ยกเลิก
              </button>
              <button
                className="confirm-button"
                onClick={() => handleconfirmRole(personToAdd)}
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
        {isOpenSubWindow && (
          <WindowAddUserToRole
            listUsers={listPersonWithOutRole}
            onClickAddUser={handleAddUserToRole}
            personToAdd={personToAdd}
            setPersonToAdd={setPersonToAdd}
          />
        )}
        {isOpenTabDelete && (
        <TabDelete
          onClose={onCloseTabDelete}
          selected={selectedItems}
          handleDelPersonInRole={handleDelPersonInRole}
        />
      )}
      </div>
    </>
  );
};

////////
function Role() {
  const [isWindowRoleOpen, setIsWindowRoleOpen] = useState(false);
  const [role, setRole] = useState(); //role
  const [role_Name, setRole_Name] = useState("");
  const [person, setPerson] = useState([]); //คนในroleนั้นๆ
  const [allRole, setAllRole] = useState([]); //ไว้รับข้อมูลที่ fetchมา

  //function
  async function handleFetchUserInRole(role_ID) {
    console.log("come on", role_ID);
    const userData = JSON.parse(localStorage.getItem("userData"));
    //call api by axios POST
    await axios
      .post(
        "http://localhost:5000/api/fetchPersonFromRole",
        {
          role_ID: role_ID,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userData.token,
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        console.log("setPerson =", data.users);
        setPerson(data.users);
      });
  }

  async function openWindow(item) {
    if (item) {
      const userData = JSON.parse(localStorage.getItem("userData"));
      //call api by axios POST
      await axios
        .post(
          "http://localhost:5000/api/fetchPersonFromRole",
          {
            role_ID: item._id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + userData.token,
            },
          }
        )
        .then((response) => response.data)
        .then((data) => {
          console.log("setPerson =", data.users);
          setPerson(data.users);
        });
      // handleFetchUserInRole(item._id)
    }
    setRole(item);
    setRole_Name(item.role_Name);
    setIsWindowRoleOpen(true);
  }

  async function closeWindow() {
    const userData = JSON.parse(localStorage.getItem("userData"));
    try{
    const response = await axios.get("http://localhost:5000/api/fetchRoles", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userData.token,
        },
      });
      const data = response.data.results;
      setAllRole(data);
    } catch (error) {
      console.log("closeWindow", error);
    }
    setIsWindowRoleOpen(false);

  }

  //ตอนกดตกลง ยังไม่เสร็จ
  async function handleconfirmRole(personToAdd) {
    console.log("ID =", role._id);
    console.log("Role", role);
    console.log("ชื่อRole :", role_Name);
    console.log("personToAdd :", personToAdd);

    const userData = JSON.parse(localStorage.getItem("userData"));
    try {
      //
      if (!role_Name?.trim()) {
        alert("กรุณาใส่ชื่อ Role");
        return;
      }
      //case มีroleอยู่แล้ว updateข้อมูล
      if (role?._id) {
        console.log("go to api");
        await axios.put(
          `http://localhost:5000/api/updateRole/${role._id}`,
          {
            role_Name: role_Name,
            personToAdd: personToAdd,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + userData.token,
            },
          }
        );
      }
      // สร้าง role ใหม่ต้องมี Personsก่อน
      else {
        console.log("ต้องสร้างRoleใหม่");
        if (personToAdd.length === 0) {
          alert(
            "ไม่สามารถสร้างRole ได้เนื่องจากไม่มีการเพิ่มรายชื่อ \nคุณสามารถกดเพิ่มรายชื่อที่มุมซ้ายล่างได้"
          );
          return;
        }
        //เรียก Api
        await axios
          .post(
            `http://localhost:5000/api/createRoleAndInsertPerson`,
            {
              role_Name: role_Name,
              personToAdd: personToAdd,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + userData.token,
              },
            }
          )
          .then((res) => res.data)
          .then((data) => {
            console.log(data);
          });
      }

      //หลัง create หรือ update ข้อมูลเสร็จ
      const response = await axios.get("http://localhost:5000/api/fetchRoles", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userData.token,
        },
      });
      const data = response.data.results;
      setAllRole(data);
    } catch (error) {
      console.log("handleconfirmRoleERROR", error);
    }

    setIsWindowRoleOpen(false);
  }

  function isEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  useEffect(() => {
    async function fetchRole() {
      const userData = JSON.parse(localStorage.getItem("userData"));
      try {
        const response = await axios.get(
          "http://localhost:5000/api/fetchRoles",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + userData.token,
            },
          }
        );
        const data = response.data.results;

        // Update state with the fetched data
        if (!isEqual(data, allRole)) {
          // Update state only if the data is different
          setAllRole(data);
        }
        console.log("allRole", allRole);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    }
    fetchRole();
  }, [allRole]);

  useEffect(() => {
    console.log("person", person);
  }, [person]);

  return (
    <div>
      <div
        className="container-window"
        style={{ width: "calc(100vw - 260px)" }}
      >
        <button className="btn-add-role" onClick={openWindow}>
          <FaPlus />
          <p> เพิ่มRoleใหม่</p>
        </button>
        <h3>รายการของRole</h3>

        <div style={{ width: "calc(100vw - 260px)" }}>
          {allRole.map((item, index) => {
            return (
              <div key={index}>
                <div className="role-box">
                  <p>Role: {item.role_Name}</p>
                  <p>จำนวน {item.number_Of_People} คน</p>
                  <div className="btn-edit">
                    <button onClick={() => openWindow(item)}>Edit</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {isWindowRoleOpen && (
        <WindowRole
          onClose={closeWindow}
          handleconfirmRole={handleconfirmRole}
          role={role}
          setRole={setRole}
          role_Name={role_Name}
          setRole_Name={setRole_Name}
          person={person}
          setPerson={setPerson}
          handleFetchUserInRole={handleFetchUserInRole}
        />
      )}
    </div>
  );
}

export default Role;
