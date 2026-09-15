import { useEffect, useState } from "react";

import API from "../services/api";

function Users() {

  const [users, setUsers] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({

    fullName: "",

    email: "",

    password: "",

    role: "Employee",

    department: "",

    phone: "",

  });

  useEffect(() => {

    fetchUsers();

  }, []);

  const fetchUsers = async () => {

    try {

      const res = await API.get("/users");

      setUsers(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]: e.target.value,

    });

  };

  const createUser = async (e) => {

    e.preventDefault();

    try {

      if (editingId) {

        await API.put(`/users/${editingId}`, form);

        alert("User updated successfully.");

        setEditingId(null);

      } else {

        await API.post("/users", form);

        alert("User created successfully.");

      }

      setForm({

        fullName: "",

        email: "",

        password: "",

        role: "Employee",

        department: "",

        phone: "",

      });

      fetchUsers();

    } catch (error) {

      alert(error.response?.data?.message || "Operation failed.");

    }

  };

  // Edit User

  const editUser = (user) => {

    setEditingId(user._id);

    setForm({

      fullName: user.fullName,

      email: user.email,

      password: "",

      role: user.role,

      department: user.department,

      phone: user.phone,

    });

  };

  // Activate / Deactivate User

  const toggleStatus = async (user) => {

    try {

      await API.patch(`/users/${user._id}/status`);

      alert("User status updated successfully.");

      fetchUsers();

    } catch (error) {

      alert(error.response?.data?.message || "Failed to update status.");

    }

  };

  // Delete User

  const deleteUser = async (user) => {

    if (!window.confirm(`Delete ${user.fullName}?`)) return;

    try {

      await API.delete(`/users/${user._id}`);

      alert("User deleted successfully.");

      fetchUsers();

    } catch (error) {

      alert(error.response?.data?.message || "Failed to delete user.");

    }

  };

  return (

    <div style={{ padding: "30px" }}>

      <h1>User Management</h1>

      <form onSubmit={createUser} style={{ marginBottom: "30px" }}>

        <input

          name="fullName"

          placeholder="Full Name"

          value={form.fullName}

          onChange={handleChange}

          required

        />

        <input

          name="email"

          type="email"

          placeholder="Email"

          value={form.email}

          onChange={handleChange}

          required

        />

        <input

          type="password"

          name="password"

          placeholder="Password"

          value={form.password}

          onChange={handleChange}

          required={!editingId}

        />

        <select

          name="role"

          value={form.role}

          onChange={handleChange}

        >

          <option value="Director">Director</option>

          <option value="Department Manager">Department Manager</option>

          <option value="Payroll Officer">Payroll Officer</option>

          <option value="Employee">Employee</option>

        </select>

        <input

          name="department"

          placeholder="Department"

          value={form.department}

          onChange={handleChange}

        />

        <input

          name="phone"

          placeholder="Phone Number"

          value={form.phone}

          onChange={handleChange}

        />

        <button type="submit">

          {editingId ? "Update User" : "Add User"}

        </button>

      </form>

      <table border="1" cellPadding="10" style={{ width: "100%" }}>

        <thead>

          <tr>

            <th>Name</th>

            <th>Email</th>

            <th>Role</th>

            <th>Department</th>

            <th>Status</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {users.map((user) => (

            <tr key={user._id}>

              <td>{user.fullName}</td>

              <td>{user.email}</td>

              <td>{user.role}</td>

              <td>{user.department}</td>

              <td>{user.status}</td>

              <td>

                <button

                  type="button"

                  onClick={() => editUser(user)}

                >

                  Edit

                </button>

                <button

                  type="button"

                  onClick={() => toggleStatus(user)}

                >

                  {user.status === "Active"

                    ? "Deactivate"

                    : "Activate"}

                </button>

                <button

                  type="button"

                  onClick={() => deleteUser(user)}

                >

                  Delete

                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default Users;