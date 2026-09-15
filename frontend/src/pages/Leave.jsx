import { useState, useEffect } from "react";
import API from "../services/api";
function Leave() {
  const [employees, setEmployees] = useState([]);
  const [leaveList, setLeaveList] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const [leave, setLeave] = useState({
    employee: "",
    leaveType: "Annual",
    startDate: "",
    endDate: "",
    reason: "",
    status: "Pending",
  });
  useEffect(() => {
  fetchEmployees();
  fetchLeaves();
}, []);
useEffect(() => {
  if (selectedLeave) {
    setLeave({
      employee: selectedLeave.employee?._id || selectedLeave.employee,
      leaveType: selectedLeave.leaveType,
      startDate: selectedLeave.startDate.split("T")[0],
      endDate: selectedLeave.endDate.split("T")[0],
      reason: selectedLeave.reason,
      status: selectedLeave.status,
    });
  }
}, [selectedLeave]);
  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employees");
      setEmployees(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchLeaves = async () => {
  try {
    const res = await API.get("/leaves");
    setLeaveList(res.data);
  } catch (error) {
    console.error(error);
  }
};
// ADD THIS CODE HERE
const deleteLeave = async (id) => {
  if (!window.confirm("Delete this leave request?")) {
    return;
  }
  try {
    await API.delete(`/leaves/${id}`);
    alert("Leave deleted successfully!");
    fetchLeaves();
  } catch (error) {
    console.error(error);
    alert("Failed to delete leave.");
  }
};
const approveLeave = async (id) => {
  try {
    await API.put(`/leaves/${id}`, {
      status: "Approved",
    });
    alert("Leave approved successfully!");
    fetchLeaves();
  } catch (error) {
    console.error(error);
    alert("Failed to approve leave.");
  }
};
const rejectLeave = async (id) => {
  try {
    await API.put(`/leaves/${id}`, {
      status: "Rejected",
    });
    alert("Leave rejected successfully!");
    fetchLeaves();
  } catch (error) {
    console.error(error);
    alert("Failed to reject leave.");
  }
};
// handleChange comes after this
const handleChange = (e) => {
  setLeave({
    ...leave,
    [e.target.name]: e.target.value,
  });
};

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (selectedLeave) {
      await API.put(`/leaves/${selectedLeave._id}`, leave);
      alert("Leave updated successfully!");
    } else {
      await API.post("/leaves", leave);
      alert("Leave application submitted successfully!");
    }
    fetchLeaves();
    setLeave({
      employee: "",
      leaveType: "Annual",
      startDate: "",
      endDate: "",
      reason: "",
      status: "Pending",
    });
    setSelectedLeave(null);
  } catch (error) {
    console.error(error);
    alert("Failed to save leave.");
  }
};
  return (
    <div style={{ padding: "30px" }}>
      <h1>Leave Management</h1>
      <form onSubmit={handleSubmit}>
        <label><strong>Employee</strong></label>
        <br /><br />
        <select
          name="employee"
          value={leave.employee}
          onChange={handleChange}
          required
        >
          <option value="">Select Employee</option>
          {employees.map((employee) => (
            <option key={employee._id} value={employee._id}>
              {employee.fullName}
            </option>
          ))}
        </select>
        <br /><br />
        <label><strong>Leave Type</strong></label>
        <br /><br />
        <select
          name="leaveType"
          value={leave.leaveType}
          onChange={handleChange}
        >
          <option>Annual</option>
          <option>Sick</option>
          <option>Maternity</option>
          <option>Paternity</option>
          <option>Other</option>
        </select>
        <br /><br />
        <label><strong>Start Date</strong></label>
        <br /><br />
        <input
          type="date"
          name="startDate"
          value={leave.startDate}
          onChange={handleChange}
          required
        />
        <br /><br />
        <label><strong>End Date</strong></label>
        <br /><br />
        <input
          type="date"
          name="endDate"
          value={leave.endDate}
          onChange={handleChange}
          required
        />
        <br /><br />
        <label><strong>Reason</strong></label>
        <br /><br />
        <textarea
          name="reason"
          value={leave.reason}
          onChange={handleChange}
          rows="4"
          cols="50"
          required
        />
        <br /><br />
        <button type="submit">
  {selectedLeave ? "Update Leave" : "Apply Leave"}
</button>
      </form>
      <hr />
      <h2>Leave Requests</h2>
      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr>
            <th>Employee</th>
            <th>Leave Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leaveList.length > 0 ? (
            leaveList.map((item) => (
              <tr key={item._id}>
                <td>{item.employee?.fullName}</td>
                <td>{item.leaveType}</td>
                <td>{new Date(item.startDate).toLocaleDateString()}</td>
                <td>{new Date(item.endDate).toLocaleDateString()}</td>
                <td>{item.reason}</td>
 <td>{item.status}</td>
<td>
  {user?.role === "Director" ||
  user?.role === "Department Manager" ? (
    <>
      <button
        onClick={() => setSelectedLeave(item)}
      >
        Edit
      </button>

      <button
        style={{
          marginLeft: "10px",
          backgroundColor: "green",
          color: "white",
        }}
        onClick={() => approveLeave(item._id)}
      >
        Approve
      </button>

      <button
        style={{
          marginLeft: "10px",
          backgroundColor: "orange",
          color: "white",
        }}
        onClick={() => rejectLeave(item._id)}
      >
        Reject
      </button>

      <button
        style={{
          marginLeft: "10px",
          backgroundColor: "red",
          color: "white",
        }}
        onClick={() => deleteLeave(item._id)}
      >
        Delete
      </button>
    </>
  ) : (
    <span>No Actions</span>
  )}
</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No leave requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
export default Leave;