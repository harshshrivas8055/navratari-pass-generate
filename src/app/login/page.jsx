"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "@/app/redux-toolkit/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";

function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async () => {
    dispatch(loginUser(form)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        router.push("/profile");
      }
    });
  };

  useEffect(() => {
    if (user) router.push("/profile");
    return () => {
      dispatch(clearError());
    };
  }, [user]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-semibold text-center mb-4">
        {loading ? "Processing..." : "Login"}
      </h1>

      {/* ✅ Safe error rendering */}
      {error && (
        <p className="text-red-500 text-center">
          {typeof error === "string" ? error : error?.error || JSON.stringify(error)}
        </p>
      )}

      <input
        type="email"
        placeholder="Email"
        className="w-full border p-2 rounded mb-2"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full border p-2 rounded mb-4"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <div className="text-right mt-2">
        <Link href="/signup" className="text-blue-500 hover:underline">
          Go to Signup
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;
