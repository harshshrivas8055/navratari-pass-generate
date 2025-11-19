"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "@/app/redux-toolkit/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";

function SignupPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const handleSignup = async () => {
    dispatch(signupUser(form)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        router.push("/login");
      }
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-semibold text-center mb-4">
        {loading ? "Processing..." : "Signup"}
      </h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <input
        type="text"
        placeholder="Firstname"
        className="w-full border p-2 rounded mb-2"
        value={form.firstname}
        onChange={(e) => setForm({ ...form, firstname: e.target.value })}
      />
      <input
        type="text"
        placeholder="Lastname"
        className="w-full border p-2 rounded mb-2"
        value={form.lastname}
        onChange={(e) => setForm({ ...form, lastname: e.target.value })}
      />
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
        onClick={handleSignup}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Signup
      </button>
      <div className="text-right mt-2">
        <Link href="/login" className="text-blue-500 hover:underline">
          Go to Login
        </Link>
      </div>
    </div>
  );
}

export default SignupPage;
