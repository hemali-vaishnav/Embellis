import React, { useState } from "react";
import { FiArrowLeft, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp } from "../../redux/slices/sendOtpSlice";
import { verifyOtp } from "../../redux/slices/verifyOtpSlice";

export default function VerifyOtp({ onClose, onVerified }) {
  const dispatch = useDispatch();
  const {
    loading: sendOtpLoading,
    error: sendOtpError,
  } = useSelector((state) => state.sendOtp);
  const { loading: verifyOtpLoading, error: verifyOtpError } = useSelector(
    (state) => state.verifyOtp
  );
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const loading = sendOtpLoading || verifyOtpLoading;
  const error = sendOtpError || verifyOtpError;
  const showOtpStep = otpStep;

  const handleClose = () => {
    onClose?.();
  };

  const handleBack = () => {
    setOtpStep(false);
    setOtp("");
  };

  const handleSendOtp = async () => {
    if (!isValidEmail) return;
    try {
      await dispatch(sendOtp(email)).unwrap();
      setOtpStep(true);
    } catch {
      // Redux stores and renders the API error.
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 4) return;
    try {
      const data = await dispatch(verifyOtp({ email, otp })).unwrap();
      onVerified?.({ ...data, email: data.user?.email || email });
    } catch {
      // Redux stores and renders the API error.
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative flex w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* LEFT PANEL */}
        <div className="relative hidden w-1/2 overflow-hidden bg-[#f5f1e8] md:flex md:flex-col md:items-center md:justify-center p-5 text-[#28311d]">
          <div className="relative flex flex-col items-center text-center">
            <div className="embellis-logo-glow absolute inset-0 m-auto h-64 w-72 rounded-full bg-white/50 blur-2xl" />
            <img src="/assets/EmbellisLogo.png" alt="Embellis" className="embellis-logo-float relative h-64 w-72 object-contain drop-shadow-2xl" />
            <p className="max-w-xs text-center -m-6 font-medium text-[#3d462b]">
              Welcome to Embellis. <br /> Login to unlock exclusive deals ✨
            </p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="relative w-full p-8 md:w-1/2">
          <button onClick={handleClose} className="absolute right-4 top-4 text-gray-400 hover:text-black">
            <FiX size={18} />
          </button>

          {showOtpStep && (
            <button onClick={handleBack} className="absolute left-4 top-4 text-gray-400 hover:text-black">
              <FiArrowLeft size={18} />
            </button>
          )}

          <h2 className="text-2xl font-semibold text-center">{showOtpStep ? "OTP Verification" : "Login / Signup"}</h2>
          <p className="mt-1 text-sm text-center text-gray-500">{showOtpStep ? `OTP sent to ${email}` : "Enter your email address"}</p>

          {!showOtpStep ? (
            <div className="mt-6 flex h-14 overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm">
              <input type="email" placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 px-3 outline-none" />
            </div>
          ) : (
            <input type="tel" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} placeholder="Enter OTP" className="mt-6 h-14 w-full rounded-lg border text-center text-xl tracking-[0.4em]" />
          )}

          {error && <p className="mt-3 text-center text-sm text-red-500">{error}</p>}

          <button
            onClick={showOtpStep ? handleVerifyOtp : handleSendOtp}
            disabled={loading || (!showOtpStep && !isValidEmail) || (showOtpStep && otp.length < 4)}
            className="mt-5 w-full rounded-lg bg-black py-3 text-white disabled:opacity-50"
          >
            {loading ? "Please wait..." : showOtpStep ? "Verify OTP" : "Continue"}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes embellisLogoFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        .embellis-logo-float { animation: embellisLogoFloat 4.8s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
