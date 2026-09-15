import { useState, useEffect } from "react";

import API from "../services/api";

function Attendance() {

  const [employees, setEmployees] = useState([]);

  const [attendanceList, setAttendanceList] = useState([]);

  const [selectedAttendance, setSelectedAttendance] = useState(null);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [attendance, setAttendance] = useState({
  employee: "",
  department: "",
  checkIn: "",
  checkOut: "",
  status: "Present",
  latitude: "",
  longitude: "",
  gpsVerified: false,
  distanceFromOffice: 0,
  remarks: "",
});
const user = JSON.parse(localStorage.getItem("user"));

const isEmployee = user?.role === "Employee";

  useEffect(() => {

    fetchEmployees();

    fetchAttendance();

  }, []);

  useEffect(() => {

    if (selectedAttendance) {

      setAttendance({

        employee: selectedAttendance.employee?._id || "",

        checkIn: selectedAttendance.checkIn

          ? new Date(selectedAttendance.checkIn)

              .toISOString()

              .slice(0, 16)

          : "",

        checkOut: selectedAttendance.checkOut

          ? new Date(selectedAttendance.checkOut)

              .toISOString()

              .slice(0, 16)

          : "",

        status: selectedAttendance.status,

        latitude: selectedAttendance.latitude || "",

        longitude: selectedAttendance.longitude || "",

        remarks: selectedAttendance.remarks || "",

      });

    }

  }, [selectedAttendance]);

const fetchEmployees = async () => {
  try {
    if (isEmployee) {
      const res = await API.get("/employees");

      if (res.data.length > 0) {
        setAttendance((prev) => ({
          ...prev,
          employee: res.data[0]._id,
          department: res.data[0].department,
        }));
      }
    } else {
      const res = await API.get("/employees");
      setEmployees(res.data);
    }
  } catch (error) {
    console.error(error);
  }
};

  const fetchAttendance = async () => {

    try {

      const res = await API.get("/attendance");

      setAttendanceList(res.data);

    } catch (error) {

      console.error(error);

    }

  };

  const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  setAttendance((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};
const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by this browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      setAttendance((prev) => ({
        ...prev,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        gpsVerified: true,
      }));

      alert("GPS location captured successfully.");
    },
    (error) => {
      console.error(error);
      alert("Unable to get GPS location.");
    }
  );
};
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (selectedAttendance) {

        await API.put(

          `/attendance/${selectedAttendance._id}`,

          attendance

        );

        alert("Attendance updated successfully!");

      } else {
        if (isEmployee && !attendance.employee) {
  alert("Employee profile not linked.");

  return;
}

        await API.post("/attendance", attendance);

        alert("Attendance saved successfully!");

      }

      fetchAttendance();

      setAttendance({

        employee: "",

        checkIn: "",

        checkOut: "",

        status: "Present",

        latitude: "",

        longitude: "",

        remarks: "",

      });

      setSelectedAttendance(null);

    } catch (error) {

      console.error(error);

      alert(error.response?.data?.message || "Operation failed.");

    }

  };

  const deleteAttendance = async (id) => {

    if (!window.confirm("Delete this attendance record?")) return;

    try {

      await API.delete(`/attendance/${id}`);

      alert("Attendance deleted successfully!");

      fetchAttendance();

    } catch (error) {

      console.error(error);

    }

  };

  const attendancePerPage = 5;

  const filteredAttendance = attendanceList.filter((record) => {

    const searchText = search.toLowerCase();

    return (

      (record.employee?.fullName || "")

        .toLowerCase()

        .includes(searchText) ||

      (record.status || "")

        .toLowerCase()

        .includes(searchText)

    );

  });

  const indexOfLastAttendance =

    currentPage * attendancePerPage;

  const indexOfFirstAttendance =

    indexOfLastAttendance - attendancePerPage;

  const currentAttendance = filteredAttendance.slice(

    indexOfFirstAttendance,

    indexOfLastAttendance

  );

  const totalPages = Math.ceil(

    filteredAttendance.length / attendancePerPage

  );

  return (

    <div style={{ padding: "30px" }}>

      <h1>Attendance Management</h1>

      <form onSubmit={handleSubmit}>

     {!isEmployee && (
  <>
    <select
      name="employee"
      value={attendance.employee}
      onChange={handleChange}
      required
    >
      <option value="">Select Employee</option>

      {employees.map((employee) => (
        <option
          key={employee._id}
          value={employee._id}
        >
          {employee.fullName} ({employee.employeeId})
        </option>
      ))}
    </select>

    <br /><br />
  </>
)}

        <br /><br />

        <input

          type="datetime-local"

          name="checkIn"

          value={attendance.checkIn}

          onChange={handleChange}

          required

        />

        <br /><br />

        <input

          type="datetime-local"

          name="checkOut"

          value={attendance.checkOut}

          onChange={handleChange}

        />

        <br /><br />

        <select

          name="status"

          value={attendance.status}

          onChange={handleChange}

        >

          <option>Present</option>

          <option>Late</option>

          <option>Half Day</option>

          <option>Leave</option>

          <option>Absent</option>

        </select>

        <br /><br />

        <textarea
  name="remarks"
  value={attendance.remarks}
  onChange={handleChange}
  placeholder="Remarks"
  rows="3"
  style={{ width: "100%" }}
/>

<br /><br />

<button
  type="button"
  onClick={getCurrentLocation}
>
  📍 Capture GPS Location
</button>

<br /><br />

<input
  type="text"
  value={attendance.latitude}
  placeholder="Latitude"
  readOnly
/>

<br /><br />

<input
  type="text"
  value={attendance.longitude}
  placeholder="Longitude"
  readOnly
/>

<br /><br />

<p>
  GPS Status:
  {attendance.gpsVerified ? (
    <span style={{ color: "green" }}> ✅ Verified</span>
  ) : (
    <span style={{ color: "red" }}> ❌ Not Verified</span>
  )}
</p>

<br />

<button type="submit">


          {selectedAttendance

            ? "Update Attendance"

            : "Save Attendance"}

        </button>

      </form>

      <hr />

      <input

        type="text"

        placeholder="Search..."

        value={search}

        onChange={(e) =>

          setSearch(e.target.value)

        }

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

            <th>Employee</th>

            <th>Department</th>

            <th>Check In</th>

            <th>Check Out</th>

            <th>Hours</th>

            <th>Status</th>

            <th>GPS</th>

            <th>Date</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {currentAttendance.length > 0 ? (

            currentAttendance.map((record) => (

              <tr key={record._id}>

                <td>{record.employee?.fullName}</td>

                <td>{record.department}</td>

                <td>

                  {record.checkIn

                    ? new Date(

                        record.checkIn

                      ).toLocaleString()

                    : "-"}

                </td>

                <td>

                  {record.checkOut

                    ? new Date(

                        record.checkOut

                      ).toLocaleString()

                    : "-"}

                </td>

                <td>{record.totalHours}</td>

      <td>
  <span
    style={{
      color:
        record.status === "Present"
          ? "green"
          : record.status === "Late"
          ? "orange"
          : record.status === "Absent"
          ? "red"
          : "blue",
      fontWeight: "bold",
    }}
  >
    {record.status}
  </span>
</td>

                <td>
  {record.gpsVerified ? (
    <>
      <span style={{ color: "green", fontWeight: "bold" }}>
        ✅ Verified
      </span>

      <br />

      <a
        href={`https://www.google.com/maps?q=${record.latitude},${record.longitude}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        📍 View Location
      </a>

      <br />

      <small>
        {record.distanceFromOffice} m
      </small>
    </>
  ) : (
    <>
      <span style={{ color: "red", fontWeight: "bold" }}>
        ❌ Not Verified
      </span>

      <br />

      <a
        href={`https://www.google.com/maps?q=${record.latitude},${record.longitude}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        📍 View Location
      </a>

      <br />

      <small>
        {record.distanceFromOffice} m
      </small>
    </>
  )}
</td>

                <td>

                  {new Date(

                    record.createdAt

                  ).toLocaleDateString()}

                </td>

                <td>

                  <button

                    onClick={() =>

                      setSelectedAttendance(record)

                    }

                  >

                    Edit

                  </button>

                  <button

                    style={{

                      marginLeft: "10px",

                      backgroundColor: "red",

                      color: "white",

                    }}

                    onClick={() =>

                      deleteAttendance(record._id)

                    }

                  >

                    Delete

                  </button>

                </td>

              </tr>

            ))

          ) : (

            <tr>

              <td

                colSpan="9"

                style={{

                  textAlign: "center",

                }}

              >

                No attendance records found.

              </td>

            </tr>

          )}

        </tbody>

      </table>

      <div

        style={{

          display: "flex",

          justifyContent: "center",

          gap: "20px",

          marginTop: "20px",

        }}

      >

        <button

          onClick={() =>

            setCurrentPage(currentPage - 1)

          }

          disabled={currentPage === 1}

        >

          Previous

        </button>

        <span>

          Page {currentPage} of {totalPages}

        </span>

        <button

          onClick={() =>

            setCurrentPage(currentPage + 1)

          }

          disabled={

            currentPage === totalPages ||

            totalPages === 0

          }

        >

          Next

        </button>

      </div>

    </div>

  );

}

export default Attendance;