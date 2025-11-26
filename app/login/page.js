"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.error) {
      setError(data.error);
    } else {
      localStorage.setItem("user", JSON.stringify(data));
      if (data.rol === "admin") {
        router.push("/admin");
      } else if (data.rol === "personal") {
        router.push("/personal/dashboard");
      } else {
        router.push("/usuario/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8">
        <h2 className="text-4xl font-normal text-center text-gray-700 mb-10">Iniciar Sesión </h2>

        <div className="mb-6">
          <label className="block text-gray-700 text-lg mb-2">Email:</label>
          <input
            name="email"
            type="email"
            placeholder="Enter email"
            className="w-full p-3 border border-gray-200 rounded text-gray-600 focus:outline-none focus:border-blue-400"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-lg mb-2">Contraseña:</label>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            className="w-full p-3 border border-gray-200 rounded text-gray-600 focus:outline-none focus:border-blue-400"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-8 flex items-center">
          <input
            type="checkbox"
            id="showPassword"
            className="mr-2 h-4 w-4 text-blue-600"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          <label htmlFor="showPassword" className="text-gray-600 cursor-pointer select-none">
            Show Password
          </label>
        </div>

        {error && <div className="text-red-600 mb-4 text-center">{error}</div>}

        <button className="w-full py-3 bg-[#007da0] text-white font-bold rounded hover:bg-[#006480] transition-colors uppercase tracking-wider text-sm">
          Sign In
        </button>

        <div className="mt-8 text-center space-y-2">
          <a href="#" className="block text-[#007da0] hover:underline">
            Forgot Username / Password?
          </a>
          <div className="text-gray-600">
            Don't have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                router.push("/registro");
              }}
              className="text-[#007da0] hover:underline font-medium"
            >
              Sign up
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
