import { useEffect, useState } from "react";
import API from "../services/api";
import EmployeeForm from "../components/EmployeeForm";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const employeesPerPage = 5;

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;

  // Fetch Employees
  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employees");
      setEmployees(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load employees.");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Delete Employee
  const deleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    try {
      await API.delete(`/employees/${id}`);
      alert("Employee deleted successfully!");
      fetchEmployees();
    } catch (error) {
      console.error(error);
      alert("Failed to delete employee.");
    }
  };
  // Toggle Employee Status
const toggleEmployeeStatus = async (employee) => {
  try {
    await API.patch(`/employees/${employee._id}/status`);

    alert("Employee status updated successfully!");

    fetchEmployees();

  } catch (error) {
    console.error(error);
    alert(
      error.response?.data?.message ||
      "Failed to update employee status."
    );
  }
};

  // Filter Employees
const filteredEmployees = employees.filter((employee) => {
  const searchText = search.toLowerCase();

  return (
    (employee.fullName || "").toLowerCase().includes(searchText) ||
    (employee.employeeId || "").toLowerCase().includes(searchText) ||
    (employee.email || "").toLowerCase().includes(searchText) ||
    (employee.phone || "").toLowerCase().includes(searchText) ||
    (employee.department || "").toLowerCase().includes(searchText) ||
    (employee.position || "").toLowerCase().includes(searchText) ||
    (employee.employmentType || "").toLowerCase().includes(searchText) ||
    (employee.status || "").toLowerCase().includes(searchText)
  );
});
  const currentEmployees = filteredEmployees.slice(
  indexOfFirstEmployee,
  indexOfLastEmployee
);

const totalPages = Math.ceil(
  filteredEmployees.length / employeesPerPage
);

  return (
    <div style={{ padding: "30px" }}>
      <h1>Employee Management</h1>

      <EmployeeForm
        fetchEmployees={fetchEmployees}
        selectedEmployee={selectedEmployee}
        clearSelection={() => setSelectedEmployee(null)}
      />

      <hr />

      <input
        type="text"
        placeholder="Search by Name, ID, Email, Department..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          fontSize: "16px",
        }}
      />

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
  <tr>
    <th>Employee No.</th>
    <th>Full Name</th>
    <th>Email</th>
    <th>Phone</th>
    <th>Department</th>
    <th>Manager</th>
    <th>Position</th>
    <th>Shift</th>
    <th>Employment Type</th>
    <th>Salary</th>
    <th>Status</th>
    <th>Actions</th>
  </tr>
</thead>

 <tbody>
  {filteredEmployees.length > 0 ? (
    currentEmployees.map((employee) => (
      <tr key={employee._id}>
        <td>{employee.employeeId}</td>
        <td>{employee.fullName}</td>
        <td>{employee.email}</td>
        <td>{employee.phone}</td>
        <td>{employee.department}</td>
        <td>{employee.manager?.fullName || "Not Assigned"}</td>
        <td>{employee.position}</td>

        <td>{employee.shift || "Morning"}</td>

        <td>{employee.employmentType}</td>

        <td>
          KES{" "}
          {employee.salary
            ? Number(employee.salary).toLocaleString()
            : "0"}
        </td>

        <td>{employee.status}</td>

        <td>
          <button onClick={() => setSelectedEmployee(employee)}>
            Edit
          </button>

          <button
            style={{
              marginLeft: "10px",
              backgroundColor:
                employee.status === "Active"
                  ? "orange"
                  : "green",
              color: "white",
            }}
            onClick={() => toggleEmployeeStatus(employee)}
          >
            {employee.status === "Active"
              ? "Deactivate"
              : "Activate"}
          </button>

          <button
            style={{
              marginLeft: "10px",
              backgroundColor: "red",
              color: "white",
            }}
            onClick={() => deleteEmployee(employee._id)}
          >
            Delete
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="12" style={{ textAlign: "center" }}>
        No employees found.
      </td>
    </tr>
  )}
</tbody>
      </table>
      <div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "15px",
    marginTop: "20px",
  }}
>
  <button
    onClick={() => setCurrentPage(currentPage - 1)}
    disabled={currentPage === 1}
  >
    Previous
  </button>

  <span>
    Page {currentPage} of {totalPages}
  </span>

  <button
    onClick={() => setCurrentPage(currentPage + 1)}
    disabled={currentPage === totalPages || totalPages === 0}
  >
    Next
  </button>
</div>
    </div>
  );
}

export default Employees;