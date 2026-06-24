import { useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
function Dashboard() {
  const [activeTab, setActiveTab] = useState("status");
  const API_URL = import.meta.env.VITE_API_URL;
  const userEmail = localStorage.getItem("email");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const navigate = useNavigate();
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };
  const [form, setForm] = useState({
    sleep: "",
    work: "",
    mood: "",
    screen: "",
    activity: "",
    heart: "",
    spo2: "",
  });

  // ✅ NEW STATE FOR RESULT
  const [result, setResult] = useState("");
  const [history, setHistory] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheck = async () => {
    for (let key in form) {
      if (form[key] === "") {
        alert("All fields are required!");
        return;
      }
    }

    const numericFields = [
      "sleep",
      "work",
      "screen",
      "activity",
      "heart",
      "spo2",
    ];

    for (let key of numericFields) {
      if (isNaN(form[key])) {
        alert(`${key} must be a number`);
        return;
      }
    }

    try {
      const response = await fetch(`${API_URL}/predict-stress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          sleep: Number(form.sleep),
          work: Number(form.work),
          mood: Number(form.mood),
          screen: Number(form.screen),
          activity: Number(form.activity),
          heart: Number(form.heart),
          spo2: Number(form.spo2),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.stressLevel);
      } else {
        alert(data.message || "Prediction failed");
        setResult("");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  const getColor = (level) => {
    if (level === "Low") return "green";
    if (level === "Medium") return "orange";
    if (level === "High") return "red";
    return "gray";
  };
  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/history?email=${userEmail}`);

      const data = await response.json();

      if (data.success) {
        setHistory(data.records);
      } else {
        alert(data.message || "Failed to fetch history");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const stressData = history.map(item => ({
  ...item,
  stressValue:
    item.prediction === "Low"
      ? 1
      : item.prediction === "Medium"
      ? 2
      : 3
}));
  const GraphCard = ({ title, dataKey }) => (
  <div className="graph-card">
    <h3>{title}</h3>

    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={dataKey === "stressValue" ? stressData : history}
      >
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="date"
          tickFormatter={(value) =>
            new Date(value).toLocaleDateString()
          }
        />

        <YAxis />

        <Tooltip
          labelFormatter={(value) =>
            new Date(value).toLocaleString()
          }
        />

        <Line
          type="monotone"
          dataKey={dataKey}
          stroke="#4f46e5"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

  return (
    <div className="dashboard-container">
      {/* LEFT SIDEBAR */}
      <div className="sidebar">
        <h2>🧠 MindCare</h2>

        <button onClick={() => setActiveTab("profile")}>👤 Profile</button>

        <button onClick={() => setActiveTab("status")}>📊 Status Check</button>

        <button
          onClick={() => {
            setActiveTab("history");
            fetchHistory();
          }}
        >
          📜 History
        </button>
        <button
          onClick={() => {
            setActiveTab("Visualization");
            fetchHistory();
          }}
        >
          📈 Visualization
        </button>

        <button
          type="button"
          onClick={() => {
            localStorage.removeItem("email");
            navigate("/login");
          }}
        >
          📴 Log Out
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="main">
        {activeTab === "status" && (
          <div className="status-container">
            <div className="status-header">
              <h1>🧘 Stress Status Checker</h1>
              <p>Enter your daily health and lifestyle details</p>
            </div>

            <div className="input-grid">
              <div className="input-group">
                <label>Sleep Duration (Hours)</label>
                <input
                  name="sleep"
                  value={form.sleep}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>Work Hours</label>
                <input name="work" value={form.work} onChange={handleChange} />
              </div>

              <div className="input-group">
                <label>Mood Level</label>
                <input name="mood" value={form.mood} onChange={handleChange} />
              </div>

              <div className="input-group">
                <label>Screen Time</label>
                <input
                  name="screen"
                  value={form.screen}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>Physical Activity</label>
                <input
                  name="activity"
                  value={form.activity}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>Heart Rate</label>
                <input
                  name="heart"
                  value={form.heart}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>Blood Oxygen (SpO₂)</label>
                <input name="spo2" value={form.spo2} onChange={handleChange} />
              </div>
            </div>

            <button className="check-btn" onClick={handleCheck}>
              Check Stress Status
            </button>

            {result && (
              <div
                className="result-box"
                style={{ backgroundColor: getColor(result) }}
              >
                Stress Level : {result}
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="history-container">
            <h2>📜 History</h2>

            <div className="table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Sleep</th>
                    <th>Work</th>
                    <th>Mood</th>
                    <th>Screen</th>
                    <th>Activity</th>
                    <th>Heart</th>
                    <th>SpO2</th>
                    <th>Stress</th>
                  </tr>
                </thead>

                <tbody>
                  {history.length > 0 ? (
                    history.map((item, index) => (
                      <tr key={index}>
                        <td>{item.date.split("T")[0]}</td>
                        <td>{item.date.split("T")[1]}</td>
                        <td>{item.sleep}</td>
                        <td>{item.work}</td>
                        <td>{item.mood}</td>
                        <td>{item.screen}</td>
                        <td>{item.activity}</td>
                        <td>{item.heart}</td>
                        <td>{item.spo2}</td>
                        <td style={{ color: getColor(item.prediction) }}>
                          {item.prediction}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10">No history found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === "Visualization" && (
  <div className="visualization-container">

    <h1>📈 Stress Analytics Dashboard</h1>

    <div className="graph-grid">

      <GraphCard title="Sleep Duration Trend" dataKey="sleep" />
      <GraphCard title="Work Hours Trend" dataKey="work" />

      <GraphCard title="Mood Level Trend" dataKey="mood" />
      <GraphCard title="Screen Time Trend" dataKey="screen" />

      <GraphCard title="Physical Activity Trend" dataKey="activity" />
      <GraphCard title="Heart Rate Trend" dataKey="heart" />

      <GraphCard title="SpO₂ Trend" dataKey="spo2" />
      <GraphCard title="Stress Trend" dataKey="stressValue" />

    </div>

  </div>
)}

        {activeTab === "profile" && (
          <div className="profile-container">
            <div className="profile-header">
              <h1>👤 My Profile</h1>
            </div>

            <div className="profile-content">
              <div className="photo-section">
                <img
                  src={profilePhoto || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="profile-photo"
                />

                <input
                  id="photoUpload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: "none" }}
                />
                <label htmlFor="photoUpload" className="upload-btn">
                  Change Photo
                </label>
              </div>

              <div className="profile-form">
                <div className="input-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label>Email</label>
                  <input type="email" value={userEmail} disabled />
                </div>

                <div className="input-group">
                  <label>Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>

                <button className="save-btn">Save Profile</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
