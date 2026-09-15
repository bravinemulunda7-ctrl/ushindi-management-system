import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Departments from "./pages/Departments";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Leave from "./pages/Leave";
import Payroll from "./pages/Payroll";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/departments" element={<Departments />} />

      <Route path="/employees" element={<Employees />} />

      <Route path="/attendance" element={<Attendance />} />

      <Route path="/leave" element={<Leave />} />

      <Route path="/payroll" element={<Payroll />} />

      <Route path="/reports" element={<Reports />} />

      <Route path="/users" element={<Users />} />

      <Route path="/profile" element={<Profile />} />

    </Routes>
  );
}

export default App;