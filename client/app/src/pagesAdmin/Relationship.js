import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styleCss/RelationshipStyle.css"

import { FaRegPlusSquare } from "react-icons/fa";

function Relationship() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="container-rela-window">
        <div className="frame-btn-create-rela">
          <button onClick={()=>navigate("/admin/createRelation")}><FaRegPlusSquare/><p>Create Relationship</p></button>
        </div>
        <div className="frame-all-rela">
          <u><h2>รายการ Relationship ทั้งหมด</h2></u>
        </div>
      </div>
    </div>
  )
}

export default Relationship