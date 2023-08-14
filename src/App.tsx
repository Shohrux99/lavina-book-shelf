import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import SearchPage from "./pages/Search/SearchPage";
import MyShelfPage from "./pages/MyShelf/MyShelfPage";
import RegistrationPage from "./pages/Auth/RegistrationPage";

function App() {
  const aboutUser = localStorage.getItem("auth");

  if (!aboutUser) {
    return (
      <Router>
        <Routes>
          <Route path="/">
            <Route index element={<Navigate to="register" />} />
            <Route path="register" element={<RegistrationPage />} />
          </Route>
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Navigation />
      <Routes>
        
          <Route path="/my-shelf" element={<MyShelfPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="*" element={<Navigate to="/my-shelf" />} />
        
      </Routes>
    </Router>
  );
}

export default App;
