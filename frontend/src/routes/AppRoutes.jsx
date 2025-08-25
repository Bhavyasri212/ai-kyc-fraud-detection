import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import UploadPage from "../pages/UploadPage";
import LoadingPage from "../pages/LoadingPage";
import ResultPage from "../pages/ResultPage";
import { useState } from "react";

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
