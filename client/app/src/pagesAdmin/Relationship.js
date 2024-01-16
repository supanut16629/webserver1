import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styleCss/RelationshipStyle.css"

import { FaRegPlusSquare } from "react-icons/fa";

function Relationship() {
  const navigate = useNavigate();
  const [allRelationship,setAllRelationship] = useState([])

  function handleEditRelationship (item){
    const name = item.relationship_Name
    const id = item._id
    navigate(`/admin/relation/${id}?name=${name}`)
  }


  function isEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  useEffect(()=> {
    async function fetchRelationship (){
      const userData = JSON.parse(localStorage.getItem("userData"));
      try{
        const response = await axios.get("http://localhost:5000/api/fetchRelationship"
        ,{
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userData.token,
          },
        })

        console.log(response.data.results)
        const results = response.data.results
        

        if (!isEqual(results, allRelationship)) {
          // Update state only if the data is different
          setAllRelationship(results)
        }

      }catch(error){
        console.error("Error fetching relationship:", error);
      }
    }
    fetchRelationship();
  },[allRelationship])
  return (
    <div>
      <div className="container-rela-window">
        <div className="frame-btn-create-rela">
          <button onClick={()=>navigate("/admin/createRelation")}><FaRegPlusSquare/><p>Create Relationship</p></button>
        </div>
        <div className="frame-all-rela">
          <u><h2>รายการ Relationship ทั้งหมด</h2></u>
          <div className="all-menu">
            {allRelationship.map((item,index) => {
              return(
                <div key={index} className="box-rela-menu" onClick={()=>handleEditRelationship(item)}>
                  <div>• {item.relationship_Name}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Relationship