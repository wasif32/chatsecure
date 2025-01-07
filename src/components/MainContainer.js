import React, { createContext, useState } from "react";
import "./myStyles.css";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import Welcome from "./Welcome";
import CreateGroups from "./CreateGroups";
import UsersGroups from "./Users";
import { Outlet } from "react-router-dom";

export const myContext = createContext();

const MainContainer = () => {
  const [refresh, setRefresh] = useState(true);

  return (
    <div className="main-container">
      <myContext.Provider value={{ refresh: refresh, setRefresh: setRefresh }}>
        <Sidebar />
        <Outlet />
      </myContext.Provider>
    </div>
  );
};

export default MainContainer;
