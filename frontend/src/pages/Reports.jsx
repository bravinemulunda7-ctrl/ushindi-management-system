import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Reports() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payroll, setPayroll] = useState([]);

useEffect(() => {
  fetchEmployees();
  fetchAttendance();
  fetchLeaves();
  fetchPayroll();
}, []);

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employees");
      setEmployees(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchAttendance = async () => {
  try {
    const res = await API.get("/attendance");
    setAttendance(res.data);
  } catch (error) {
    console.error(error);
  }
};
const fetchLeaves = async () => {
  try {
    const res = await API.get("/leaves");
    setLeaves(res.data);
  } catch (error) {
    console.error(error);
  }
};
const fetchPayroll = async () => {
  try {
    const res = await API.get("/payroll");
    setPayroll(res.data);
  } catch (error) {
    console.error(error);
  }
};

  const generateEmployeeReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("USHINDI MANAGEMENT SYSTEM", 20, 20);

    doc.setFontSize(14);
    doc.text("Employees Report", 20, 32);

    autoTable(doc, {
      startY: 40,
      head: [[
        "Employee ID",
        "Full Name",
        "Email",
        "Department",
        "Position"
      ]],
      body: employees.map(emp => [
        emp.employeeId,
        emp.fullName,
        emp.email,
        emp.department,
        emp.position
      ]),
    });

    doc.save("Employees_Report.pdf");
  };
  const generateAttendanceReport = () => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("USHINDI MANAGEMENT SYSTEM", 20, 20);

  doc.setFontSize(14);
  doc.text("Attendance Report", 20, 32);

  autoTable(doc, {
    startY: 40,
    head: [["Employee", "Date", "Status"]],
    body: attendance.map((item) => [
      item.employee?.fullName || "",
      item.date,
      item.status,
    ]),
  });

  doc.save("Attendance_Report.pdf");
};
const generateLeaveReport = () => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("USHINDI MANAGEMENT SYSTEM", 20, 20);

  doc.setFontSize(14);
  doc.text("Leave Report", 20, 32);

  autoTable(doc, {
    startY: 40,
    head: [["Employee", "Leave Type", "Start Date", "End Date", "Status"]],
    body: leaves.map((item) => [
      item.employee?.fullName || "",
      item.leaveType,
      item.startDate,
      item.endDate,
      item.status,
    ]),
  });

  doc.save("Leave_Report.pdf");
};
const generatePayrollReport = () => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("USHINDI MANAGEMENT SYSTEM", 20, 20);

  doc.setFontSize(14);
  doc.text("Payroll Report", 20, 32);

  autoTable(doc, {
    startY: 40,
    head: [[
      "Employee",
      "Basic Salary",
      "Allowances",
      "Deductions",
      "Net Salary",
      "Pay Month",
    ]],
    body: payroll.map((item) => [
      item.employee?.fullName || "",
      item.basicSalary,
      item.allowances,
      item.deductions,
      item.netSalary,
      item.payMonth,
    ]),
  });

  doc.save("Payroll_Report.pdf");
};

  return (
    <div style={{ padding: "30px" }}>
      <h1>USHINDI MANAGEMENT SYSTEM</h1>
      <h2>Reports Centre</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <div
          style={{
            border: "1px solid gray",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>Employees Report</h3>

          <button onClick={generateEmployeeReport}>
            Generate PDF
          </button>
        </div>

        <div
          style={{
            border: "1px solid gray",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>Attendance Report</h3>

          <button onClick={generateAttendanceReport}>
  Generate PDF
</button>
        </div>

        <div
          style={{
            border: "1px solid gray",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>Leave Report</h3>

<button onClick={generateLeaveReport}>
  Generate PDF
</button>
        </div>

        <div
          style={{
            border: "1px solid gray",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
         <h3>Payroll Report</h3>

<button onClick={generatePayrollReport}>
  Generate PDF
</button>
        </div>
      </div>

      <br />

      <button onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default Reports;