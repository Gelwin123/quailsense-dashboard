"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      switch (err.code) {
        case "auth/user-not-found":
          setError("No account found with this email.");
          break;
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setError("Incorrect email or password.");
          break;
        case "auth/invalid-email":
          setError("Invalid email format.");
          break;
        default:
          setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url('/quailsbg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      />

      {/* Card */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(10px)",
          padding: "2.5rem",
          borderRadius: "1.5rem",
          boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
          animation: "fadeIn 0.6s ease-out",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "2.3rem",
            fontWeight: "bold",
            color: "#166534",
          }}
        >
          QuailSense IoT
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#15803d",
            marginBottom: "1.5rem",
          }}
        >
          Smart Quail Farm Monitoring System
        </p>

        {error && (
          <p style={{ color: "#dc2626", textAlign: "center", marginBottom: "1rem" }}>
            {error}
          </p>
        )}

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "0.8rem",
              borderRadius: "0.75rem",
              border: "1px solid #bbf7d0",
              outline: "none",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "0.8rem",
              borderRadius: "0.75rem",
              border: "1px solid #bbf7d0",
              outline: "none",
            }}
          />

          <button
            type="submit"
            style={{
              padding: "0.8rem",
              borderRadius: "1rem",
              fontWeight: "bold",
              color: "white",
              background: "linear-gradient(to right, #16a34a, #22c55e)",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1rem", color: "#166534" }}>
          Don’t have an account?{" "}
          <a href="/signup" style={{ textDecoration: "underline" }}>
            Sign Up
          </a>
        </p>

        <p
          style={{
            textAlign: "center",
            marginTop: "1rem",
            fontSize: "0.8rem",
            color: "#166534",
          }}
        >
          © {new Date().getFullYear()} QuailSense IoT System
        </p>
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
