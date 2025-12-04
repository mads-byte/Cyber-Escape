import { useEffect, useState } from "react";
import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openSection, setOpenSection] = useState(null);

  useEffect(() => {
    async function fetchAdminData() {
      try {
        const res = await fetch("http://localhost:3000/api/me", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch admin data`);
        }

        const data = await res.json();
        setAdminData(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch admin data");
      } finally {
        setLoading(false);
      }
    }

    fetchAdminData();
  }, []);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  return (
  <div className="admin-dashboard">

    
    <div className="admin-header">
      <h1 className="admh1">Admin Dashboard</h1>
      <p>Welcome, {adminData.admin}</p>
      <p>Team Code: {adminData.team_code}</p>
    </div>

  
    <div className="dashboard-row users-row">
      <div className="admin-card" onClick={() => toggleSection("users")}>
        <h2>Manage Users</h2>
        {openSection === "users" && (
          <div className="section-content">
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>XP</th>
                  <th>Best Time</th>
                </tr>
              </thead>
              <tbody>
                {adminData.team_members.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.exp_points}</td>
                    <td>{user.best_time || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>

   
    <div className="dashboard-row bottom-row">
      <div className="admin-card" onClick={() => toggleSection("teams")}>
        <h2>View Team Info</h2>
        {openSection === "teams" && (
          <div className="section-content">
            <p>Team Code: {adminData.team_code}</p>
            <p>Total Members: {adminData.team_members.length}</p>
          </div>
        )}
      </div>

      <div className="admin-card" onClick={() => toggleSection("stats")}>
        <h2>Escape Room Stats</h2>
        {openSection === "stats" && (
          <div className="section-content">
            <ul>
              {adminData.team_members.map((user) => (
                <li key={user.id}>
                  {user.username}: XP {user.exp_points}, Best Time:{" "}
                  {user.best_time || "-"}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  </div>
);
}
