import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import WelcomePage from "./pages/WelcomePage";
import PatientsPage from "./pages/PatientsPage";
import AddPatientPage from "./pages/AddPatientPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PatientDetails from "./pages/PatientDetails";
import Layout from "./components/Layout"; 
import RegisterPage from './pages/RegisterPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import CompleteProfilePage from './pages/CompleteProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔓 ROUTES PUBLIQUES (Accessibles sans être connecté) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* 🔒 ROUTES PROTÉGÉES (Nécessitent une connexion) */}
        <Route element={<ProtectedRoute />}>
          {/* Cette page est entre les deux : accessible seulement après Google Login mais avant le tableau de bord */}
          <Route path="/complete-profile" element={<CompleteProfilePage />} />
          
          <Route element={<Layout />}> 
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/add-patient" element={<AddPatientPage />} />
            <Route path="/patients/:id" element={<PatientDetails />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}