// src/routes/AppRoutes.jsx
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import UploadPage from "../pages/UploadPage";
import LoadingPage from "../pages/LoadingPage";
import ResultPage from "../pages/ResultPage";

function RouterWrapper() {
  const [aadhaarData, setAadhaarData] = useState(null);
  const navigate = useNavigate();

  const handleExtract = (data) => {
    setAadhaarData(data);
    navigate("/results");
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/upload"
        element={<UploadPage onExtract={handleExtract} />}
      />
      <Route path="/loading" element={<LoadingPage />} />
      <Route
        path="/results"
        element={
          <ResultPage data={aadhaarData} onBack={() => navigate("/upload")} />
        }
      />
    </Routes>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <RouterWrapper />
    </BrowserRouter>
  );
}
