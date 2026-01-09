import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DarkModeExample from "./components/DarkModeExample";
import About from "./pages/About";
import Sales from "./pages/Sales";
import Services from "./pages/Services";
import Team from "./pages/Team";
import Registration from "./pages/Registration";
import AddService from "./pages/AddService";
import UpdateService from "./pages/UpdateService";
import AddSales from "./pages/AddSales";
import UpdateSales from "./pages/UpdateSales";
import "./styles/style.css";

function App() {
  return (
    <Router>
      <Navbar />
      <DarkModeExample />
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/services" element={<Services />} />
        <Route path="/team" element={<Team />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/add-service" element={<AddService />} />
        <Route path="/update-service/:id" element={<UpdateService />} />
        <Route path="/add-sale" element={<AddSales />} />
        <Route path="/update-sale/:id" element={<UpdateSales />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
