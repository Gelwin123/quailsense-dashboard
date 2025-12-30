"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      console.error("Signup Error:", err);

      switch (err.code) {
        case "auth/email-already-in-use":
          setError("This email is already registered.");
          break;
        case "auth/invalid-email":
          setError("Invalid email format.");
          break;
        case "auth/weak-password":
          setError("Password should be at least 6 characters.");
          break;
        default:
          setError("Signup failed. Please try again.");
      }
    }
  };

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundImage: "url('/quailsbg.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      position: "relative"
    }}>
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.4)"
      }}></div>

      <div style={{
        position: "relative",
        zIndex: 10,
        backgroundColor: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(10px)",
        border: "1px solid #bbf7d0",
        borderRadius: "1.5rem",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        padding: "2.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        animation: "fadeIn 0.6s ease-out forwards"
      }}>
        <h1 style={{ textAlign: "center", fontSize: "2.5rem", fontWeight: "bold", color: "#166534", marginBottom: "0.5rem" }}>QuailSense</h1>
        <p style={{ textAlign: "center", color: "#15803d", marginBottom: "1rem" }}>Create your account to monitor your quail farm</p>

        {error && <p style={{ color: "#dc2626", textAlign: "center", fontWeight: 500 }}>{error}</p>}
        {success && <p style={{ color: "#16a34a", textAlign: "center", fontWeight: 500 }}>{success}</p>}

        <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: "0.75rem",
              borderRadius: "0.75rem",
              border: "1px solid #bbf7d0",
              outline: "none",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)"
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: "0.75rem",
              borderRadius: "0.75rem",
              border: "1px solid #bbf7d0",
              outline: "none",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)"
            }}
          />
          <button type="submit" style={{
            padding: "0.75rem",
            borderRadius: "1rem",
            fontWeight: "bold",
            background: "linear-gradient(to right, #16a34a, #facc15)",
            color: "white",
            boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            cursor: "pointer",
            transition: "transform 0.3s"
          }}
          onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
          >
            Sign Up
          </button>
        </form>

        <p style={{ textAlign: "center", color: "#15803d" }}>
          Already have an account? <a href="/login" style={{ textDecoration: "underline", color: "#065f46" }}>Login</a>
        </p>

        <div style={{ textAlign: "center", color: "#166534", fontSize: "0.875rem", marginTop: "1rem" }}>
          &copy; {new Date().getFullYear()} Quail IoT Farm System
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
