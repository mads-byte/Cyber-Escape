
import { useEffect, useState } from "react";
import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAdminData() {
      try {
        const API_URL = import.meta.env.VITE_BACKEND_URL
        const res = await fetch(`${API_URL}/api/me`, {
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
        <div className="admin-card">
          <h2>Your Team: {adminData.team_members.length} Total Members</h2>
          <div className="section-content">
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>XP</th>
                </tr>
              </thead>
              <tbody>
                {adminData.team_members.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.exp_points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
