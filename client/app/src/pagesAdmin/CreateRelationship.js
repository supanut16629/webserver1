import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styleCss/RelationshipStyle.css";
import axios from "axios";

function CreateRelationship() {
  const navigate = useNavigate();
  const [nameCreateRelationship, setNameCreateRelationship] = useState("");

  async function createRelationship (){
    const userData = JSON.parse(localStorage.getItem("userData"));
    try{
      const response = await axios.post("http://localhost:5000/api/createRelationshipGroup",
      {nameRelationship:nameCreateRelationship},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userData.token,
        },
      })

      console.log(response.data.status)
      const status = response.data.status
      //alert เสร็จสิ้น
      //navigate
      if(status === "ok"){
        alert("สร้าง Relationship สำเร็จ")
        navigate("/admin/relation")
      }
      if(status === "repeat"){
        alert("ชื่อ Relationship ซ้ำกรุณาตั้งชื่อใหม่")
        setNameCreateRelationship("")
      }

    }catch(error){
      console.log(error)
    }
  }
  return (
    <div>
      <div className="container-create-rela-window">
        <div className="frame-create">
          <u>
            <h1>สร้าง Relationship ใหม่</h1>
          </u>
          <div className="sub-frame-create">
            <p>ชื่อของ Relationship</p>
            <input
              type="text"
              required={true}
              placeholder="ชื่อของ Relationship ที่ต้องการ"
              value={nameCreateRelationship}
              onChange={(event) =>
                setNameCreateRelationship(event.target.value)
              }
            />
            <div className="group-btn">
              <button onClick={()=>createRelationship()}>+ Create</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateRelationship;
