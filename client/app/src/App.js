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

//page Admin
import HomeAdmin from "./pagesAdmin/HomeAdmin";
import Approval from "./pagesAdmin/Approval";
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
                    <Route path="/approval" element={<Approval />} />
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
