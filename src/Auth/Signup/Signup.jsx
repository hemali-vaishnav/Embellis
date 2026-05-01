import React from "react";
import { FiArrowRight, FiMail, FiUser, FiX } from "react-icons/fi";

export default function Signup({ onClose , onLoginClick  }) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 px-4 py-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden bg-[#fffaf0] text-[#3d2b1a] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close signup popup"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center text-[#3d2b1a]/70 transition hover:bg-[#3d2b1a]/8 hover:text-[#3d2b1a]"
        >
          <FiX className="h-5 w-5" />
        </button>

        <div className="border-b border-[#3d2b1a]/10 px-7 pb-6 pt-8">
          <p className="mb-2 text-xs uppercase tracking-[0.28em] text-[#3d2b1a]/60">
            Create account
          </p>
          <h2 className="text-3xl font-semibold">Join Embellis</h2>
          <p className="mt-3 text-sm leading-6 text-[#3d2b1a]/75">
            Save favorites, track orders, and keep your handcrafted picks close.
          </p>
        </div>

        <form className="space-y-4 px-7 py-7">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">First name</span>
              <div className="flex items-center border border-[#3d2b1a]/15 bg-white px-3">
                <FiUser className="h-4 w-4 text-[#3d2b1a]/45" />
                <input
                  type="text"
                  placeholder="Ava"
                  className="w-full bg-transparent px-3 py-3 text-sm outline-none"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">Last name</span>
              <div className="flex items-center border border-[#3d2b1a]/15 bg-white px-3">
                <FiUser className="h-4 w-4 text-[#3d2b1a]/45" />
                <input
                  type="text"
                  placeholder="Shaw"
                  className="w-full bg-transparent px-3 py-3 text-sm outline-none"
                />
              </div>
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Email address</span>
            <div className="flex items-center border border-[#3d2b1a]/15 bg-white px-3">
              <FiMail className="h-4 w-4 text-[#3d2b1a]/45" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-transparent px-3 py-3 text-sm outline-none"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Password</span>
            <input
              type="password"
              placeholder="Create a password"
              className="w-full border border-[#3d2b1a]/15 bg-white px-4 py-3 text-sm outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Confirm password</span>
            <input
              type="password"
              placeholder="Repeat your password"
              className="w-full border border-[#3d2b1a]/15 bg-white px-4 py-3 text-sm outline-none"
            />
          </label>

          <label className="flex items-start gap-3 pt-1 text-sm leading-6 text-[#3d2b1a]/75">
            <input type="checkbox" className="mt-1 h-4 w-4 accent-[#3d2b1a]" />
            <span>I&apos;d like occasional updates on new drops and custom pieces.</span>
          </label>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 bg-[#3d2b1a] px-4 py-3 text-sm font-medium text-[#fffaf0] transition hover:bg-[#2c1f13]"
          >
            Create account
            <FiArrowRight className="h-4 w-4" />
          </button>

          <p className="text-center text-sm text-[#3d2b1a]/70">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onLoginClick}
              className="font-semibold text-[#3d2b1a] underline underline-offset-4"
            >
              Log in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
