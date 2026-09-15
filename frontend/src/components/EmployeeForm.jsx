import { useState, useEffect } from "react";

import API from "../services/api";

function EmployeeForm({

  fetchEmployees,

  selectedEmployee,

  clearSelection,

}) {

const [managers, setManagers] = useState([]);
const [users, setUsers] = useState([]);

const [formData, setFormData] = useState({
  user: "",
  fullName: "",
  employeeId: "",
  email: "",
  phone: "",
  department: "",
  position: "",
  manager: "",
  shift: "Morning",
  salary: "",
  status: "Active",
});

  // Load managers

  const fetchManagers = async () => {

    try {

      const res = await API.get("/users/managers");

      setManagers(res.data);

    } catch (error) {

      console.error(error);

    }

  };
  const fetchUsers = async () => {
  try {
    const res = await API.get("/users");
    setUsers(res.data);
  } catch (error) {
    console.error(error);
  }
};

 useEffect(() => {
  fetchManagers();
  fetchUsers();
}, []);

  useEffect(() => {

    if (selectedEmployee) {

      setFormData({
        user: selectedEmployee.user || "",

        fullName: selectedEmployee.fullName || "",

        employeeId: selectedEmployee.employeeId || "",

        email: selectedEmployee.email || "",

        phone: selectedEmployee.phone || "",

        department: selectedEmployee.department || "",

        position: selectedEmployee.position || "",

        manager: selectedEmployee.manager?._id || "",

        shift: selectedEmployee.shift || "Morning",

        salary: selectedEmployee.salary || "",

        status: selectedEmployee.status || "Active",

      });

    } else {

      resetForm();

    }

  }, [selectedEmployee]);

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value,

    });

  };

  const resetForm = () => {

   setFormData({
  user: "",
  fullName: "",
  employeeId: "",
  email: "",
  phone: "",
  department: "",
  position: "",
  manager: "",
  shift: "Morning",
  salary: "",
  status: "Active",
});

    if (clearSelection) clearSelection();

  };

const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("Sending Employee Data:");
  console.log(formData);

  try {
    if (selectedEmployee) {
      await API.put(`/employees/${selectedEmployee._id}`, formData);
      alert("Employee updated successfully!");
    } else {
      await API.post("/employees", formData);
      alert("Employee added successfully!");
    }

    fetchEmployees();
    resetForm();

  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || "Operation failed.");
  }
};

  return (

    <form onSubmit={handleSubmit}>

      <h2>

        {selectedEmployee

          ? "Edit Employee"

          : "Add New Employee"}

      </h2>
<label><strong>User Account</strong></label>
<br />

<select
  name="user"
  value={formData.user}
  onChange={handleChange}
  required
>
  <option value="">Select User</option>

  {users.map((user) => (
    <option key={user._id} value={user._id}>
      {user.fullName} ({user.email})
    </option>
  ))}
</select>

<br /><br />

      <input

        type="text"

        name="fullName"

        placeholder="Full Name"

        value={formData.fullName}

        onChange={handleChange}

        required

      />

      <br /><br />

      <input

        type="text"

        name="employeeId"

        placeholder="Employee ID"

        value={formData.employeeId}

        onChange={handleChange}

        required

      />

      <br /><br />

      <input

        type="email"

        name="email"

        placeholder="Email Address"

        value={formData.email}

        onChange={handleChange}

        required

      />

      <br /><br />

      <input

        type="text"

        name="phone"

        placeholder="Phone Number"

        value={formData.phone}

        onChange={handleChange}

        required

      />

      <br /><br />

      <input

        type="text"

        name="department"

        placeholder="Department"

        value={formData.department}

        onChange={handleChange}

        required

      />

      <br /><br />

      <input

        type="text"

        name="position"

        placeholder="Position"

        value={formData.position}

        onChange={handleChange}

        required

      />

      <br /><br />

      <label><strong>Manager</strong></label>

      <br />

      <select

        name="manager"

        value={formData.manager}

        onChange={handleChange}

      >

        <option value="">Select Manager</option>

        {managers.map((manager) => (

          <option

            key={manager._id}

            value={manager._id}

          >

            {manager.fullName}

          </option>

        ))}

      </select>

      <br /><br />

      <label><strong>Shift</strong></label>

      <br />

      <select

        name="shift"

        value={formData.shift}

        onChange={handleChange}

        required

      >

        <option value="Morning">

          Morning (8:00 AM)

        </option>

        <option value="Afternoon">

          Afternoon (2:00 PM)

        </option>

        <option value="Evening">

          Evening (6:00 PM)

        </option>

      </select>

      <br /><br />

      <input

        type="number"

        name="salary"

        placeholder="Salary (KES)"

        value={formData.salary}

        onChange={handleChange}

        required

      />

      <br /><br />

      <label><strong>Status</strong></label>

      <br />

      <select

        name="status"

        value={formData.status}

        onChange={handleChange}

      >

        <option value="Active">Active</option>

        <option value="Inactive">Inactive</option>

      </select>

      <br /><br />

      <button type="submit">

        {selectedEmployee

          ? "Update Employee"

          : "Save Employee"}

      </button>

      {selectedEmployee && (

        <button

          type="button"

          onClick={resetForm}

          style={{ marginLeft: "10px" }}

        >

          Cancel

        </button>

      )}

    </form>

  );

}

export default EmployeeForm;