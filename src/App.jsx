// App.js
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar/Sidebar";
import Tanımlar from "./pages/Tanımlar";
import ServisDetay from "./pages/ServisDetay";
import React from "react";

function App() {
  return (
    <div className="flex bg-gray-50">
      <div className="fixed top-0 left-0 z-10">
        <Sidebar />
      </div>

      <div className="main w-full ml-20 md:ml-60">
        <Routes>
          <Route path="/" element={<Tanımlar />} />
          <Route path="/servis-detay" element={<ServisDetay />} />
          <Route path="/tanimlar" element={<Tanımlar />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
