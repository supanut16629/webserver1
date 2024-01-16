import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";

import { RiArrowGoBackFill } from "react-icons/ri";
import "../styleCss/RelationshipStyle.css";
const EditRelationship = () => {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  //   console.log(params.id);

  // Use URLSearchParams to extract the 'name' parameter from the URL
  const searchParams = new URLSearchParams(location.search);
  const relationshipName = searchParams.get("name");

  return (
    <div className="container-edit-rela">
      <div className="edit-rela-header">
        <p style={{ margin: "0" }}>ชื่อความสัมพันธ์ : {relationshipName}</p>
        <RiArrowGoBackFill
          title="Go Back"
          className="icon-go-back"
          onClick={() => {
            navigate("/admin/relation");
          }}
        />
      </div>
      <div className="edit-rela-body">
        <div>
          <button onClick={() => console.log("Add new Relationship")}>
            เพิ่มความสัมพันธ์ใหม่
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRelationship;
