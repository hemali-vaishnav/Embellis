import React, { useState } from "react";
import { FiMail, FiPhone, FiUser, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../redux/slices/signupSlice";

export default function Signup({ email: verifiedEmail = "", onClose, onSuccess }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.signup);
  const rememberMe = useSelector((state) => state.authModal.rememberMe);
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const email = verifiedEmail;

  const handleSignup = async (e) => {
    e.preventDefault();

    const isEmailVerified =
      Boolean(verifiedEmail) &&
      email.trim().toLowerCase() === verifiedEmail.trim().toLowerCase();

    try {
      const data = await dispatch(
        signupUser({
          name: fullName,
          email,
          phone: mobile,
          isEmailVerified,
          remember: rememberMe,
        })
      ).unwrap();

      onSuccess?.(data);
    } catch {
      // Redux stores and renders the API error.
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-black"
          aria-label="Close"
        >
          <FiX size={18} />
        </button>

        <h2 className="text-center text-2xl font-semibold text-gray-900">
          Create Account
        </h2>
        <p className="mt-1 text-center text-sm text-gray-500">
          Add your details to complete signup
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSignup}>
          {/* 1. FULL NAME FIELD */}
          <label className="flex h-14 items-center rounded-lg border border-gray-300 bg-white px-4 shadow-sm focus-within:ring-1 focus-within:ring-black">
            <FiUser className="mr-3 shrink-0 text-gray-400" />
            <input
              type="text"
              required
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="min-w-0 flex-1 text-base font-medium text-gray-900 outline-none placeholder:text-gray-400"
            />
          </label>

          {/* 2. PHONE NUMBER FIELD */}
          <label className="flex h-14 items-center rounded-lg border border-gray-300 bg-white px-4 shadow-sm focus-within:ring-1 focus-within:ring-black">
            <FiPhone className="mr-3 shrink-0 text-gray-400" />
            <span className="mr-1 text-base font-semibold text-gray-600">+91</span>
            <input
              type="tel"
              required
              maxLength={10}
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              className="min-w-0 flex-1 bg-transparent text-base font-medium text-gray-900 outline-none"
            />
          </label>

          {/* 3. EMAIL FIELD (Pre-filled & Read Only) */}
          <label className="flex h-14 items-center rounded-lg border border-gray-300 bg-gray-50 px-4 shadow-sm">
            <FiMail className="mr-3 shrink-0 text-gray-400" />
            <input
              type="email"
              value={email}
              readOnly // Email is already verified, so we keep it read-only
              className="min-w-0 flex-1 text-base font-medium text-gray-500 outline-none cursor-not-allowed"
            />
          </label>

          {error && <p className="text-center text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading || !fullName.trim() || mobile.length < 10}
            className="w-full rounded-lg bg-black py-3 text-sm font-medium text-white transition hover:bg-gray-900 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
