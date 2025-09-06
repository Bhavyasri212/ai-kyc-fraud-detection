import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import UploadPage from "../pages/UploadPage";
import LoadingPage from "../pages/LoadingPage";
import ResultPage from "../pages/ResultPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import VerificationDashboard from "../pages/VerificationDashboard";
import ProfilePage from "../pages/ProfilePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "../components/PrivateRoute";
function RouterWrapper() {
  const [aadhaarData, setAadhaarData] = useState(null);
  const navigate = useNavigate();

  const handleExtract = (data) => {
    setAadhaarData(data);
    navigate("/results");
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify" element={<VerificationDashboard />} />
        {/* Protected routes go here */}
        <Route element={<PrivateRoute />}>
          <Route path="/upload" element={<UploadPage />} />
        </Route>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route
          path="/results"
          element={
            <ResultPage data={aadhaarData} onBack={() => navigate("/upload")} />
          }
        />
      </Routes>

      {/* Toast notifications - must be outside <Routes> */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <RouterWrapper />
    </BrowserRouter>
  );
}
