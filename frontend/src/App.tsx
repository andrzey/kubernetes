import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("Laster fra API...");

  useEffect(() => {
    fetch("/api")
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => setMessage("Feil ved henting: " + err.message));
  }, []);

  return (
    <div>
      <h1>Frontend i Kubernetes</h1>
      <p>
        Hilsen fra API-et: <strong>{message}</strong>
      </p>
    </div>
  );
}

export default App;
