import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Admin from "./pages/Admin";
import Scanner from "./pages/Scanner";
import PublicTokenViewer from "./pages/PublicTokenViewer";
import DbPage from "./pages/DbView";

import Footer from "./components/Footer";

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-orange-50/10">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/table" element={<DbPage />} />
            <Route path="/scan" element={<Scanner />} />
            <Route path="/token/:name/:uuid" element={<PublicTokenViewer />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
