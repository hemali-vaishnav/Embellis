import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiUploadCloud,
  FiArrowRight,
  FiX,
  FiMinus,
  FiPlus,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { submitCustomOrder, clearCustomOrderResult } from "../../../redux/slices/customOrderSlice";
import { openAuthModal } from "../../../redux/slices/authModalSlice";
import { useIsLoggedIn } from "../../../commonfunction/useAuthState";
import { COLOR_OPTIONS, COLOR_HEX_BY_NAME } from "../../../commonfunction/customOrderOptions";

const garmentOptions = ["T-Shirt", "Hoodie", "Shirt", "Kurti", "Jacket"];
const sizeOptions = ["S", "M", "L", "XL", "XXL"];
const placementOptions = ["Front", "Back", "All Over"];
const PLACEMENT_VALUE = { Front: "front", Back: "back", "All Over": "all_over" };

const BASE_PRICES = {
  "T-Shirt": 499,
  Hoodie: 899,
  Shirt: 699,
  Kurti: 749,
  Jacket: 1299,
};

const DESIGN_COST = 199;
const MAX_QUANTITY = 10;

export default function Custom() {
  const dispatch = useDispatch();
  const loggedIn = useIsLoggedIn();
  const { submitting, submitError, submitResult } = useSelector((state) => state.customOrder);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [formError, setFormError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const [state, setState] = useState({
    outfit: "T-Shirt",
    size: "M",
    color: COLOR_OPTIONS[0].name,
    placement: "Front",
    quantity: 1,
    notes: "",
  });

  useEffect(() => {
    if (!selectedFile) return setPreviewUrl("");
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const unitPrice = useMemo(() => {
    const base = BASE_PRICES[state.outfit];
    const design = selectedFile ? DESIGN_COST : 0;
    return base + design;
  }, [state.outfit, selectedFile]);

  const totalPrice = unitPrice * state.quantity;

  const update = (key, value) => setState((prev) => ({ ...prev, [key]: value }));

  const handleFile = (file) => {
    if (!file) return;
    setFormError("");
    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleQuantity = (delta) => {
    update("quantity", Math.min(MAX_QUANTITY, Math.max(1, state.quantity + delta)));
  };

  const handleContinue = () => {
    if (!loggedIn) {
      dispatch(openAuthModal());
      return;
    }
    if (!selectedFile) {
      setFormError("Please upload your design before continuing.");
      return;
    }
    setFormError("");
    setShowConfirm(true);
  };

  const handleConfirmOrder = () => {
    dispatch(
      submitCustomOrder({
        file: selectedFile,
        type: state.outfit,
        size: state.size,
        color: state.color,
        printPlacement: PLACEMENT_VALUE[state.placement],
        quantity: state.quantity,
        price: totalPrice,
        note: state.notes,
      })
    );
  };

  const handleEditDetails = () => {
    setShowConfirm(false);
  };

  const handleStartOver = () => {
    dispatch(clearCustomOrderResult());
    setSelectedFile(null);
    setShowConfirm(false);
    setState({
      outfit: "T-Shirt",
      size: "M",
      color: COLOR_OPTIONS[0].name,
      placement: "Front",
      quantity: 1,
      notes: "",
    });
  };

  if (submitResult) {
    return (
      <section className="min-h-screen bg-[#fbf7ef] px-6 pt-32 pb-20">
        <div className="mx-auto max-w-lg rounded-[28px] border border-[#3d2b1a]/10 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#3d2b1a]/10">
            <FiCheckCircle className="text-3xl text-[#3d2b1a]" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold text-[#2f241b]">Order request sent!</h1>
          <p className="mt-2 text-[#5c4634]">
            We&apos;ve received your custom design. Our team will reach out to confirm details and
            delivery.
          </p>

          <div className="mt-8 space-y-3 rounded-2xl bg-[#fbf7ef] p-5 text-left text-sm">
            <div className="flex justify-between">
              <span className="text-[#8a5a35]">Garment</span>
              <span className="font-medium text-[#2f241b]">{submitResult.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8a5a35]">Size</span>
              <span className="font-medium text-[#2f241b]">{submitResult.size || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8a5a35]">Color</span>
              <span className="font-medium text-[#2f241b]">{submitResult.color || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8a5a35]">Quantity</span>
              <span className="font-medium text-[#2f241b]">{submitResult.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8a5a35]">Total</span>
              <span className="font-semibold text-[#2f241b]">₹{submitResult.price}</span>
            </div>
          </div>

          <button
            onClick={handleStartOver}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#3d2b1a] px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-[#2f2115]"
          >
            Design Another
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#fbf7ef] px-6 pt-28 pb-20">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* HERO */}
        <div className="text-center space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-[#8a5a35]">Made For You</p>
          <h1 className="text-4xl font-semibold text-[#2f241b]">Build Your Outfit</h1>
          <p className="text-[#5c4634]">Design it your way — the price updates instantly.</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
          <div className="space-y-6">
            {/* DESIGN */}
            <section className="rounded-2xl border border-[#3d2b1a]/10 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#2f241b] mb-6">Your Design</h2>

              {!previewUrl ? (
                <label
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 cursor-pointer transition
                    ${dragActive ? "border-[#3d2b1a] bg-[#3d2b1a]/5" : "border-[#3d2b1a]/25 hover:border-[#3d2b1a]"}`}
                >
                  <FiUploadCloud className="text-3xl text-[#3d2b1a]/50" />
                  <span className="text-sm text-[#5c4634] mt-3">
                    Drag &amp; drop your design, or click to browse
                  </span>
                  <span className="text-xs text-[#8a5a35] mt-1">
                    PNG, JPG — adds ₹{DESIGN_COST} to the price
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Your design"
                    className="w-full h-64 object-contain rounded-2xl border border-[#3d2b1a]/10 bg-[#fbf7ef]"
                  />
                  <button
                    onClick={() => setSelectedFile(null)}
                    aria-label="Remove design"
                    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm text-[#3d2b1a] hover:bg-[#3d2b1a] hover:text-white transition"
                  >
                    <FiX />
                  </button>
                </div>
              )}
            </section>

            {/* OUTFIT */}
            <section className="rounded-2xl border border-[#3d2b1a]/10 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#2f241b] mb-6">Choose Outfit</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {garmentOptions.map((item) => (
                  <button
                    key={item}
                    onClick={() => update("outfit", item)}
                    className={`rounded-xl px-4 py-4 text-sm border transition
                      ${
                        state.outfit === item
                          ? "border-[#3d2b1a] bg-[#3d2b1a] text-white"
                          : "border-[#3d2b1a]/15 text-[#2f241b] hover:border-[#3d2b1a]"
                      }`}
                  >
                    {item}
                    <div className={`text-xs mt-1 ${state.outfit === item ? "text-white/70" : "text-[#8a5a35]"}`}>
                      ₹{BASE_PRICES[item]}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* COLOR */}
            <section className="rounded-2xl border border-[#3d2b1a]/10 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#2f241b] mb-6">Choose Color</h2>
              <div className="flex flex-wrap gap-5">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => update("color", c.name)}
                    aria-pressed={state.color === c.name}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <span
                      className={`block w-10 h-10 rounded-full border border-black/10 transition
                        ${state.color === c.name ? "ring-2 ring-offset-2 ring-[#3d2b1a]" : "group-hover:ring-2 group-hover:ring-offset-2 group-hover:ring-[#3d2b1a]/30"}`}
                      style={{ backgroundColor: c.hex }}
                    />
                    <span
                      className={`text-xs transition ${
                        state.color === c.name ? "font-semibold text-[#2f241b]" : "text-[#8a5a35]"
                      }`}
                    >
                      {c.name}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* SIZE */}
            <section className="rounded-2xl border border-[#3d2b1a]/10 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#2f241b] mb-6">Choose Size</h2>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    onClick={() => update("size", size)}
                    className={`w-12 h-12 rounded-full border text-sm transition
                      ${
                        state.size === size
                          ? "bg-[#3d2b1a] text-white border-[#3d2b1a]"
                          : "border-[#3d2b1a]/20 text-[#2f241b] hover:border-[#3d2b1a]"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </section>

            {/* PRINT PLACEMENT */}
            <section className="rounded-2xl border border-[#3d2b1a]/10 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#2f241b] mb-6">Print Placement</h2>
              <div className="flex flex-wrap gap-2">
                {placementOptions.map((p) => (
                  <button
                    key={p}
                    onClick={() => update("placement", p)}
                    className={`px-4 py-2.5 rounded-full border text-sm transition
                      ${
                        state.placement === p
                          ? "bg-[#3d2b1a] text-white border-[#3d2b1a]"
                          : "border-[#3d2b1a]/20 text-[#2f241b] hover:border-[#3d2b1a]"
                      }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </section>

            {/* NOTE */}
            <section className="rounded-2xl border border-[#3d2b1a]/10 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#2f241b] mb-6">Note (optional)</h2>
              <textarea
                rows="3"
                placeholder="Anything extra we should know?"
                value={state.notes}
                onChange={(e) => update("notes", e.target.value)}
                className="w-full rounded-xl border border-[#3d2b1a]/15 px-4 py-3 text-sm text-[#2f241b] focus:outline-none focus:border-[#3d2b1a]"
              />
            </section>
          </div>

          {/* ORDER SUMMARY */}
          <div className="lg:sticky lg:top-32">
            <section className="rounded-2xl border border-[#3d2b1a]/10 bg-white p-8 shadow-sm space-y-7">
              <h2 className="text-lg font-semibold text-[#2f241b]">Order Summary</h2>

              <div className="space-y-3 text-base">
                <div className="flex justify-between">
                  <span className="text-[#5c4634]">Garment</span>
                  <span className="font-semibold text-[#2f241b]">{state.outfit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5c4634]">Size</span>
                  <span className="font-semibold text-[#2f241b]">{state.size}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#5c4634]">Color</span>
                  <span className="flex items-center gap-2 font-semibold text-[#2f241b]">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-[#3d2b1a]/20"
                      style={{ backgroundColor: COLOR_HEX_BY_NAME[state.color] }}
                    />
                    {state.color}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5c4634]">Print</span>
                  <span className="font-semibold text-[#2f241b]">{state.placement}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5c4634]">Design</span>
                  <span className="font-semibold text-[#2f241b]">
                    {selectedFile ? `+₹${DESIGN_COST}` : "None"}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#8a5a35] mb-4">Quantity</p>
                <div className="inline-flex items-center gap-5 rounded-lg border border-[#3d2b1a]/20 px-4 py-2.5">
                  <button
                    onClick={() => handleQuantity(-1)}
                    disabled={state.quantity <= 1}
                    aria-label="Decrease quantity"
                    className="w-8 h-8 flex items-center justify-center rounded-full text-[#3d2b1a] hover:bg-[#3d2b1a]/5 disabled:opacity-30"
                  >
                    <FiMinus size={16} />
                  </button>
                  <span className="w-6 text-center text-base font-semibold text-[#2f241b]">
                    {state.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantity(1)}
                    disabled={state.quantity >= MAX_QUANTITY}
                    aria-label="Increase quantity"
                    className="w-8 h-8 flex items-center justify-center rounded-full text-[#3d2b1a] hover:bg-[#3d2b1a]/5 disabled:opacity-30"
                  >
                    <FiPlus size={16} />
                  </button>
                </div>
              </div>

              <div className="border-t border-[#3d2b1a]/10 pt-5 flex items-center justify-between">
                <span className="text-base text-[#5c4634]">Total</span>
                <span className="text-3xl font-bold text-[#2f241b]">₹{totalPrice}</span>
              </div>

              {(formError || submitError) && (
                <p className="flex items-center gap-1.5 text-sm text-red-600">
                  <FiAlertCircle /> {formError || submitError}
                </p>
              )}

              {showConfirm ? (
                <>
                  <p className="flex items-start gap-1.5 text-xs text-[#8a5a35]">
                    <FiAlertCircle className="mt-0.5 shrink-0" />
                    This price is an estimate. The final price may vary based on your design.
                  </p>

                  <button
                    onClick={handleConfirmOrder}
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 bg-[#3d2b1a] text-white py-4 rounded-xl text-base font-semibold uppercase tracking-wider hover:bg-[#2f2115] transition disabled:opacity-50"
                  >
                    {submitting ? "Confirming..." : "Confirm Order"} {!submitting && <FiArrowRight />}
                  </button>

                  <button
                    onClick={handleEditDetails}
                    disabled={submitting}
                    className="w-full text-center text-xs font-medium text-[#8a5a35] hover:text-[#3d2b1a] transition disabled:opacity-50"
                  >
                    Edit details
                  </button>
                </>
              ) : (
                <button
                  onClick={handleContinue}
                  className="w-full flex items-center justify-center gap-2 bg-[#3d2b1a] text-white py-4 rounded-xl text-base font-semibold uppercase tracking-wider hover:bg-[#2f2115] transition"
                >
                  Continue <FiArrowRight />
                </button>
              )}
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
