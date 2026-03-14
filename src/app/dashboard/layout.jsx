import Sidebar from "@/Components/Sidebar";
import React from "react";

const layout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-[#F5F7FB]">
      <Sidebar />
      <main className="flex-1 min-h-screen overflow-y-auto">{children}</main>
    </div>
  );
};

export default layout;