import { useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";

import API from "../services/api";

import "../styles/dashboard.css";

function Dashboard() {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState({

    employees: 0,

    attendance: 0,

    leave: 0,

    payroll: 0,

  });

  const [recentAttendance, setRecentAttendance] = useState([]);

  useEffect(() => {

    fetchDashboardData();

  }, []);

 const fetchDashboardData = async () => {

  let employees = [];
  let attendance = [];
  let leave = [];
  let payroll = [];

  try {
    const res = await API.get("/employees");
    employees = res.data;
    console.log("Employees:", employees);
  } catch (err) {
    console.log("Employees Error:", err);
  }

  try {
    const res = await API.get("/attendance");
    attendance = res.data;
    console.log("Attendance:", attendance);
  } catch (err) {
    console.log("Attendance Error:", err);
  }

  try {
    const res = await API.get("/leaves");
    leave = res.data;
    console.log("Leave:", leave);
  } catch (err) {
    console.log("Leave Error:", err.response?.data || err.message);
  }

  try {
    const res = await API.get("/payroll");
    payroll = res.data;
    console.log("Payroll:", payroll);
  } catch (err) {
    console.log("Payroll Error:", err.response?.data || err.message);
  }

  setStats({
    employees: employees.length,
    attendance: attendance.length,
    leave: leave.length,
    payroll: payroll.length,
  });

  setRecentAttendance(attendance.slice(-5).reverse());
};

  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/");

  };

  return (

    <div className="dashboard-container">

      {/* Sidebar */}

      <div className="sidebar">

        <h2 className="sidebar-title">USHINDI</h2>

        <p

          style={{

            color: "white",

            textAlign: "center",

            marginBottom: "20px",

            fontWeight: "bold",

          }}

        >

          {user?.fullName}

          <br />

          <small>{user?.role}</small>

        </p>

        <button onClick={() => navigate("/dashboard")}>🏠 Dashboard</button>

        {user?.role === "Director" && (

          <>

            <button onClick={() => navigate("/users")}>👤 User Management</button>

            <button onClick={() => navigate("/departments")}>🏢 Departments</button>

            <button onClick={() => navigate("/employees")}>👥 Employees</button>

            <button onClick={() => navigate("/attendance")}>📅 Attendance</button>

            <button onClick={() => navigate("/leave")}>📝 Leave</button>

            <button onClick={() => navigate("/payroll")}>💰 Payroll</button>

            <button onClick={() => navigate("/reports")}>📊 Reports</button>

          </>

        )}

        {user?.role === "Department Manager" && (

          <>

            <button onClick={() => navigate("/employees")}>👥 Employees</button>

            <button onClick={() => navigate("/attendance")}>📅 Attendance</button>

            <button onClick={() => navigate("/leave")}>📝 Leave</button>

            <button onClick={() => navigate("/reports")}>📊 Reports</button>

          </>

        )}

        {user?.role === "Payroll Officer" && (

          <>


            <button onClick={() => navigate("/payroll")}>💰 Payroll</button>

            <button onClick={() => navigate("/reports")}>📊 Reports</button>

          </>

        )}

  {user?.role === "Employee" && (
  <>
    
    <button onClick={() => navigate("/attendance")}>
      📅 My Attendance
    </button>

    <button onClick={() => navigate("/leave")}>
      📝 My Leave
    </button>

    <button onClick={() => navigate("/payroll")}>
      💰 My Payslips
    </button>

    <button onClick={() => navigate("/profile")}>
      👤 My Profile
    </button>
  </>
)}

<button className="logout" onClick={logout}>
  🚪 Logout
</button>

      </div>

      {/* Main Content */}

      <div className="main-content">

        <h1>Ushindi Management System</h1>

        <p style={{ fontSize: "18px", marginBottom: "20px" }}>

          Welcome back <strong>{user?.fullName}</strong>

        </p>

        <div className="cards">

          {user?.role === "Director" && (

            <>

              <div className="card">

                <h2>Employees</h2>

                <h1>{stats.employees}</h1>

              </div>

              <div className="card">

                <h2>Attendance</h2>

                <h1>{stats.attendance}</h1>

              </div>

              <div className="card">

                <h2>Leave</h2>

                <h1>{stats.leave}</h1>

              </div>

              <div className="card">

                <h2>Payroll</h2>

                <h1>{stats.payroll}</h1>

              </div>

            </>

          )}

          {user?.role === "Department Manager" && (

            <>

              <div className="card">

                <h2>Employees</h2>

                <h1>{stats.employees}</h1>

              </div>

              <div className="card">

                <h2>Attendance</h2>

                <h1>{stats.attendance}</h1>

              </div>

              <div className="card">

                <h2>Leave Requests</h2>

                <h1>{stats.leave}</h1>

              </div>

            </>

          )}

          {user?.role === "Payroll Officer" && (

            <>

              <div className="card">

                <h2>Attendance</h2>

                <h1>{stats.attendance}</h1>

              </div>

              <div className="card">

                <h2>Payroll</h2>

                <h1>{stats.payroll}</h1>

              </div>

            </>

          )}

          {user?.role === "Employee" && (

            <>

              <div className="card">

                <h2>My Attendance</h2>

                <h1>{stats.attendance}</h1>

              </div>

              <div className="card">

                <h2>My Leave</h2>

                <h1>{stats.leave}</h1>

              </div>

            </>

          )}

        </div>
        {/* Hide Recent Attendance from Employees */}
        {user?.role !== "Employee" && (
          <div
            style={{
              marginTop: "30px",
              background: "#fff",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 5px 12px rgba(0,0,0,.1)",
            }}
          >
            <h2>Recent Attendance</h2>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "15px",
              }}
            >
              <thead>
                <tr style={{ background: "#2563eb", color: "#fff" }}>
                  <th style={{ padding: "10px" }}>Employee</th>
                  <th style={{ padding: "10px" }}>Date</th>
                  <th style={{ padding: "10px" }}>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentAttendance.length > 0 ? (
                  recentAttendance.map((record) => (
                    <tr key={record._id}>
                      <td style={{ padding: "10px" }}>
                        {record.employee?.fullName || "Unknown Employee"}
                      </td>

                      <td style={{ padding: "10px" }}>
                        {record.checkIn
                          ? new Date(record.checkIn).toLocaleDateString()
                          : "-"}
                      </td>

                      <td
                        style={{
                          padding: "10px",
                          color:
                            record.status === "Present"
                              ? "green"
                              : record.status === "Late"
                              ? "orange"
                              : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {record.status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      style={{
                        textAlign: "center",
                        padding: "20px",
                      }}
                    >
                      No attendance records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;