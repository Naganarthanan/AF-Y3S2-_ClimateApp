import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/hello")
      .then((res) => setMessage(res.data.message))
      .catch(() => setMessage("Backend not connected"));
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>Basic React + Backend Setup</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;