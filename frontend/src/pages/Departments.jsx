import { useEffect, useState } from "react";
import API from "../services/api";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    manager: "",
    description: "",
  });

  useEffect(() => {
    fetchDepartments();
    fetchManagers();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await API.get("/departments");
      setDepartments(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchManagers = async () => {
    try {
      const res = await API.get("/users");

      const managers = res.data.filter(
        (user) =>
          user.role === "Department Manager" ||
          user.role === "Director"
      );

      setUsers(managers);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setEditingId(null);

    setForm({
      name: "",
      manager: "",
      description: "",
    });
  };

  const saveDepartment = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await API.put(`/departments/${editingId}`, form);
        alert("Department updated successfully.");
      } else {
        await API.post("/departments", form);
        alert("Department created successfully.");
      }

      resetForm();
      fetchDepartments();

    } catch (error) {
      alert(error.response?.data?.message || "Operation failed.");
    }
  };

  const editDepartment = (department) => {
    setEditingId(department._id);

    setForm({
      name: department.name,
      manager: department.manager?._id || "",
      description: department.description || "",
    });
  };

  const toggleStatus = async (department) => {
    try {
      await API.patch(`/departments/${department._id}/status`);

      alert("Department status updated.");

      fetchDepartments();
    } catch (error) {
      alert(error.response?.data?.message || "Operation failed.");
    }
  };

  const deleteDepartment = async (department) => {
    if (!window.confirm(`Delete ${department.name}?`)) return;

    try {
      await API.delete(`/departments/${department._id}`);

      alert("Department deleted.");

      fetchDepartments();
    } catch (error) {
      alert(error.response?.data?.message || "Operation failed.");
    }
  };

  const filteredDepartments = departments.filter((department) =>
    department.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "30px" }}>
      <h1>Department Management</h1>

      <form onSubmit={saveDepartment} style={{ marginBottom: "25px" }}>

        <input
          name="name"
          placeholder="Department Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <select
          name="manager"
          value={form.manager}
          onChange={handleChange}
        >
          <option value="">Select Manager</option>

          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.fullName}
            </option>
          ))}
        </select>

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <button type="submit">
          {editingId ? "Update Department" : "Add Department"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        )}

      </form>

      <input
        type="text"
        placeholder="Search Department..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
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
            <th>Department</th>
            <th>Manager</th>
            <th>Description</th>
            <th>Total Employees</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {filteredDepartments.length > 0 ? (
            filteredDepartments.map((department) => (
              <tr key={department._id}>
                <td>{department.name}</td>

                <td>
                  {department.manager?.fullName || "Not Assigned"}
                </td>

                <td>{department.description}</td>

                <td>{department.totalEmployees || 0}</td>

                <td>{department.status}</td>

                <td>

                  <button
                    type="button"
                    onClick={() => editDepartment(department)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    style={{ marginLeft: "8px" }}
                    onClick={() => toggleStatus(department)}
                  >
                    {department.status === "Active"
                      ? "Deactivate"
                      : "Activate"}
                  </button>

                  <button
                    type="button"
                    style={{
                      marginLeft: "8px",
                      color: "white",
                      background: "red",
                    }}
                    onClick={() => deleteDepartment(department)}
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No departments found.
              </td>
            </tr>
          )}

        </tbody>

      </table>

    </div>
  );
}

export default Departments;