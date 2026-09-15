import { useState, useEffect } from "react";
import API from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Payroll() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [employees, setEmployees] = useState([]);
  const [payrollList, setPayrollList] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPayroll, setSelectedPayroll] = useState(null);

  const [payroll, setPayroll] = useState({
    employee: "",
    basicSalary: "",
    allowances: "",
    deductions: "",
    netSalary: "",
    payMonth: "",
  });

  useEffect(() => {
    fetchEmployees();
    fetchPayroll();
  }, []);

  useEffect(() => {
    if (selectedPayroll) {
      setPayroll({
        employee:
          selectedPayroll.employee?._id || selectedPayroll.employee,
        basicSalary: selectedPayroll.basicSalary,
        allowances: selectedPayroll.allowances,
        deductions: selectedPayroll.deductions,
        netSalary: selectedPayroll.netSalary,
        payMonth: selectedPayroll.payMonth,
      });
    }
  }, [selectedPayroll]);

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employees");
      setEmployees(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPayroll = async () => {
    try {
      const res = await API.get("/payroll");
      setPayrollList(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deletePayroll = async (id) => {
    if (!window.confirm("Delete this payroll record?")) return;

    try {
      await API.delete(`/payroll/${id}`);
      alert("Payroll deleted successfully!");
      fetchPayroll();
    } catch (error) {
      console.error(error);
      alert("Failed to delete payroll.");
    }
  };

  const generatePayslip = (record) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("USHINDI MANAGEMENT SYSTEM", 20, 20);

    doc.setFontSize(14);
    doc.text("Employee Payslip", 20, 30);

    autoTable(doc, {
      startY: 40,
      head: [["Field", "Value"]],
      body: [
        ["Employee", record.employee?.fullName],
        ["Pay Month", record.payMonth],
        ["Basic Salary", `KES ${record.basicSalary}`],
        ["Allowances", `KES ${record.allowances}`],
        ["Deductions", `KES ${record.deductions}`],
        ["Net Salary", `KES ${record.netSalary}`],
        ["Generated On", new Date().toLocaleDateString()],
      ],
    });

    doc.save(`${record.employee?.fullName}-Payslip.pdf`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedPayroll = {
      ...payroll,
      [name]: value,
    };

    const basic = Number(updatedPayroll.basicSalary) || 0;
    const allowances = Number(updatedPayroll.allowances) || 0;
    const deductions = Number(updatedPayroll.deductions) || 0;

    updatedPayroll.netSalary =
      basic + allowances - deductions;

    setPayroll(updatedPayroll);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedPayroll) {
        await API.put(
          `/payroll/${selectedPayroll._id}`,
          payroll
        );
        alert("Payroll updated successfully!");
      } else {
        await API.post("/payroll", payroll);
        alert("Payroll saved successfully!");
      }

      fetchPayroll();

      setPayroll({
        employee: "",
        basicSalary: "",
        allowances: "",
        deductions: "",
        netSalary: "",
        payMonth: "",
      });

      setSelectedPayroll(null);

    } catch (error) {
      console.error(error);
      alert("Failed to save payroll.");
    }
  };

 const filteredPayroll = payrollList.filter((record) => {
  const searchText = search.toLowerCase();

  return (
    (record.employee?.fullName || "")
      .toLowerCase()
      .includes(searchText) ||
    (record.payMonth || "")
      .toLowerCase()
      .includes(searchText)
  );
});

return (
  <div style={{ padding: "30px" }}>
    <h1>
      {user?.role === "Employee"
        ? "My Payslips"
        : "Payroll Management"}
    </h1>

    {/* Payroll Form - Only Director & Payroll Officer */}
    {(user?.role === "Director" ||
      user?.role === "Payroll Officer") && (
      <>
        <form onSubmit={handleSubmit}>

          <label><strong>Employee</strong></label><br /><br />

          <select
            name="employee"
            value={payroll.employee}
            onChange={handleChange}
            required
          >
            <option value="">Select Employee</option>

            {employees.map((employee) => (
              <option
                key={employee._id}
                value={employee._id}
              >
                {employee.fullName}
              </option>
            ))}

          </select>

          <br /><br />

          <label><strong>Basic Salary</strong></label><br /><br />

          <input
            type="number"
            name="basicSalary"
            value={payroll.basicSalary}
            onChange={handleChange}
            required
          />

          <br /><br />

          <label><strong>Allowances</strong></label><br /><br />

          <input
            type="number"
            name="allowances"
            value={payroll.allowances}
            onChange={handleChange}
          />

          <br /><br />

          <label><strong>Deductions</strong></label><br /><br />

          <input
            type="number"
            name="deductions"
            value={payroll.deductions}
            onChange={handleChange}
          />

          <br /><br />

          <label><strong>Net Salary</strong></label><br /><br />

          <input
            type="number"
            value={payroll.netSalary}
            readOnly
          />

          <br /><br />

          <label><strong>Pay Month</strong></label><br /><br />

          <input
            type="month"
            name="payMonth"
            value={payroll.payMonth}
            onChange={handleChange}
            required
          />

          <br /><br />

          <button type="submit">
            {selectedPayroll
              ? "Update Payroll"
              : "Save Payroll"}
          </button>

        </form>

        <hr />
      </>
    )}

    <h2>
      {user?.role === "Employee"
        ? "My Payslips"
        : "Payroll Records"}
    </h2>

    {/* Search - Only Director & Payroll Officer */}
    {(user?.role === "Director" ||
      user?.role === "Payroll Officer") && (

      <input
        type="text"
        placeholder="Search payroll..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
        }}
      />

    )}

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

          {user?.role !== "Employee" &&
            <th>Employee</th>}

          <th>Basic Salary</th>
          <th>Allowances</th>
          <th>Deductions</th>
          <th>Net Salary</th>
          <th>Pay Month</th>
          <th>Action</th>

        </tr>

      </thead>

      <tbody>

        {filteredPayroll.length > 0 ? (

          filteredPayroll.map((record) => (

            <tr key={record._id}>

              {user?.role !== "Employee" && (
                <td>{record.employee?.fullName}</td>
              )}

              <td>{record.basicSalary}</td>

              <td>{record.allowances}</td>

              <td>{record.deductions}</td>

              <td>{record.netSalary}</td>

              <td>{record.payMonth}</td>

              <td>

                {user?.role === "Employee" ? (

                  <button
                    style={{
                      background: "green",
                      color: "white",
                    }}
                    onClick={() => generatePayslip(record)}
                  >
                    Download Payslip
                  </button>

                ) : (

                  <>
                    <button
                      onClick={() =>
                        setSelectedPayroll(record)
                      }
                    >
                      Edit
                    </button>

                    <button
                      style={{
                        background: "red",
                        color: "white",
                        marginLeft: "5px",
                      }}
                      onClick={() =>
                        deletePayroll(record._id)
                      }
                    >
                      Delete
                    </button>

                    <button
                      style={{
                        background: "green",
                        color: "white",
                        marginLeft: "5px",
                      }}
                      onClick={() =>
                        generatePayslip(record)
                      }
                    >
                      Payslip
                    </button>
                  </>

                )}

              </td>

            </tr>

          ))

        ) : (

          <tr>

            <td
              colSpan={
                user?.role === "Employee" ? 6 : 7
              }
              style={{ textAlign: "center" }}
            >
              No payroll records found.
            </td>

          </tr>

        )}

      </tbody>

    </table>

  </div>
);

}

export default Payroll;