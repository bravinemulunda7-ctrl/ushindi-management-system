import React, { useEffect, useState } from "react";
import API from "../services/api";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    nationalId: "",
    profilePhoto: "",
  });

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/employees/profile");

      setProfile(res.data);

      setFormData({
        phone: res.data.phone || "",
        address: res.data.address || "",
        nationalId: res.data.nationalId || "",
        profilePhoto: res.data.profilePhoto || "",
      });
    } catch (error) {
      console.log(error.response);
      alert("Failed to load profile.");
    }
  };

  const handleSave = async () => {
    try {
      const res = await API.put("/employees/profile", formData);

      setProfile(res.data.employee);

      setEditing(false);

      alert("Profile updated successfully!");
    } catch (error) {
      console.log("Update Error:");
      console.log(error.response);

      alert(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>My Profile</h1>

      <div
        style={{
          maxWidth: "700px",
          background: "#fff",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <img
            src={
              profile?.profilePhoto ||
              "https://via.placeholder.com/120"
            }
            alt="Profile"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />

          <h2>{profile?.fullName}</h2>

          <p>{profile?.position}</p>
        </div>

        <hr />

        <p><strong>Employee ID:</strong> {profile?.employeeId}</p>

        <p><strong>Email:</strong> {profile?.email}</p>

        <p>
          <strong>Phone:</strong>{" "}
          {editing ? (
            <input
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: e.target.value,
                })
              }
            />
          ) : (
            profile?.phone
          )}
        </p>

        <p><strong>Department:</strong> {profile?.department}</p>

        <p><strong>Position:</strong> {profile?.position}</p>

        <p><strong>Role:</strong> {user?.role}</p>

        <p><strong>Gender:</strong> {profile?.gender}</p>

        <p><strong>Employment Type:</strong> {profile?.employmentType}</p>

        <p>
          <strong>Employment Date:</strong>{" "}
          {profile?.employmentDate
            ? new Date(profile.employmentDate).toLocaleDateString()
            : ""}
        </p>

        <p><strong>Salary:</strong> KES {profile?.salary}</p>

        <p><strong>Status:</strong> {profile?.status}</p>

        <p>
          <strong>National ID:</strong>{" "}
          {editing ? (
            <input
              type="text"
              value={formData.nationalId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  nationalId: e.target.value,
                })
              }
            />
          ) : (
            profile?.nationalId
          )}
        </p>

        <p>
          <strong>Address:</strong>{" "}
          {editing ? (
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: e.target.value,
                })
              }
            />
          ) : (
            profile?.address
          )}
        </p>

        <div style={{ marginTop: "20px" }}>
          {!editing ? (
            <button onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          ) : (
            <>
              <button onClick={handleSave}>
                Save Changes
              </button>

              <button
                onClick={() => {
                  setEditing(false);
                  fetchProfile();
                }}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;