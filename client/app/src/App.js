import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import "./App.css";

import store from "./redux/store";
import { Provider } from "react-redux";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

import Sidebar from "./components/Sidebar";
import SidebarAdmin from "./components/SidebarAdmin";

//page User
import Home from "./pages/Home";
import DocumentFlow from "./pages/DocumentFlow";
import FavoriteFlow from "./pages/FavoriteFlow";
import Progress from "./pages/Progress";
import History from "./pages/History";
import Approval from "./pages/Approval";

//page Admin
import HomeAdmin from "./pagesAdmin/HomeAdmin";

import MyFlow from "./pagesAdmin/MyFlow";
import CreateFlow from "./pagesAdmin/CreateFlow";
import Relationship from "./pagesAdmin/Relationship";
import CreateRelationship from "./pagesAdmin/CreateRelationship";
import Role from "./pagesAdmin/Role";

function App() {
  function MyRoutes() {
    return (
      <BrowserRouter>
        <Provider store={store}>
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route
              path="/main/*"
              element={
                <Sidebar>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/docFlow" element={<DocumentFlow />} />
                    <Route path="/faFlow" element={<FavoriteFlow />} />
                    <Route path="/approval" element={<Approval />} />
                    <Route path="/progress" element={<Progress />} />
                    <Route path="/history" element={<History />} />
                  </Routes>
                </Sidebar>
              }
            />
            <Route
              path="/admin/*"
              element={
                <SidebarAdmin>
                  <Routes>
                    <Route path="/" element={<HomeAdmin />} />
                    
                    <Route path="/myFlow" element={<MyFlow />} />
                    <Route path="/createFlow" element={<CreateFlow />} />
                    <Route path="/relation" element={<Relationship />} />
                    <Route path="/createRelation" element={<CreateRelationship />}/>
                    <Route path="/role" element={<Role />}/>
                  </Routes>
                </SidebarAdmin>
              }
            />
          </Routes>
        </Provider>
      </BrowserRouter>
    );
  }
  return (
    <div>
      <MyRoutes />
    </div>
  );
}

export default App;

//Selection users
/*
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  {"name":'Oliver Hansen',"email":"email1"},
  {"name":'Oliver Hansen2',"email":"email2"},
  {"name":'Oliver Hansen3',"email":"email3"},
  {"name":'Oliver Hansen4',"email":"email4"},
];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelect() {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      //typeof value === 'string' ? value.split(',') : value,
      value
    );
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-name-label">Name</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput label="Name" />}
          MenuProps={MenuProps}
        >
          {names.map((item,index) => (
            <MenuItem
              key={index}
              value={item}
              style={getStyles(item, personName, theme)}
            >
              {item.name} {item.email}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {personName.map((item,index) => {
      return(
        <div style={{background:"#0FF",margin:"1rem"}}>{item.name} {item.email}</div>
      )
      })}
    </div>
  );
}

*/
