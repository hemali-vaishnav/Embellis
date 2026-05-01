import React from "react";
import { FiMail, FiLock, FiX } from "react-icons/fi";

export default function Login({ onClose, onSignupClick }) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#fffaf0] text-[#3d2b1a] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 h-10 w-10 flex items-center justify-center"
        >
          <FiX />
        </button>

        <div className="border-b px-7 pb-6 pt-8">
          <h2 className="text-3xl font-semibold">Welcome Back</h2>
          <p className="mt-2 text-sm text-[#3d2b1a]/70">
            Log in to continue
          </p>
        </div>

        <form className="space-y-4 px-7 py-7">
          <div className="flex items-center border bg-white px-3">
            <FiMail className="text-[#3d2b1a]/45" />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-3 outline-none"
            />
          </div>

          <div className="flex items-center border bg-white px-3">
            <FiLock className="text-[#3d2b1a]/45" />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-3 outline-none"
            />
          </div>

          <button className="w-full bg-[#3d2b1a] py-3 text-[#fffaf0]">
            Log in
          </button>

          <p className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={onSignupClick}
              className="font-semibold underline"
            >
              Sign up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}