import React, { useEffect, useState, useMemo } from "react";
import { FiUploadCloud, FiArrowRight } from "react-icons/fi";

const garmentOptions = ["T-Shirt", "Hoodie", "Shirt", "Kurti", "Jacket"];
const sizeOptions = ["S", "M", "L", "XL", "XXL"];
const placementOptions = ["Front", "Back", "All Over"];

const BASE_PRICES = {
  "T-Shirt": 499,
  Hoodie: 899,
  Shirt: 699,
  Kurti: 749,
  Jacket: 1299,
};

const DESIGN_COST = 199;

export default function Custom() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [state, setState] = useState({
    outfit: "T-Shirt",
    size: "M",
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

  const price = useMemo(() => {
    const base = BASE_PRICES[state.outfit];
    const design = selectedFile ? DESIGN_COST : 0;
    return (base + design) * state.quantity;
  }, [state, selectedFile]);

  const update = (key, value) =>
    setState((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="pt-24 pb-32 max-w-5xl mx-auto px-4 space-y-16">

      {/* HERO */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">
          Build Your Outfit
        </h1>
        <p className="text-gray-500">
          Design it your way. Price updates instantly.
        </p>
      </div>

      {/* DESIGN */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Design</h2>

        <label className="flex flex-col items-center justify-center border border-dashed rounded-3xl p-12 cursor-pointer hover:border-black transition">
          <FiUploadCloud className="text-4xl text-gray-400" />
          <span className="text-sm text-gray-500 mt-3">
            Upload your design
          </span>
          <input
            type="file"
            className="hidden"
            onChange={(e) => setSelectedFile(e.target.files?.[0])}
          />
        </label>

        {previewUrl && (
          <img
            src={previewUrl}
            alt="preview"
            className="w-full h-64 object-contain rounded-3xl border"
          />
        )}
      </section>

      {/* OUTFIT */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Choose Outfit</h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {garmentOptions.map((item) => (
            <button
              key={item}
              onClick={() => update("outfit", item)}
              className={`rounded-2xl px-4 py-4 text-sm border transition
                ${state.outfit === item
                  ? "border-black bg-black text-white"
                  : "border-gray-200 hover:border-black"
                }`}
            >
              {item}
              <div className="text-xs opacity-70 mt-1">
                ₹{BASE_PRICES[item]}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* SIZE */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Size</h2>

        <div className="flex flex-wrap gap-3">
          {sizeOptions.map((size) => (
            <button
              key={size}
              onClick={() => update("size", size)}
              className={`w-14 h-14 rounded-full border text-sm transition
                ${state.size === size
                  ? "bg-black text-white border-black"
                  : "border-gray-300 hover:border-black"
                }`}
            >
              {size}
            </button>
          ))}
        </div>
      </section>

      {/* PLACEMENT */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Print</h2>

        <div className="flex gap-3">
          {placementOptions.map((p) => (
            <button
              key={p}
              onClick={() => update("placement", p)}
              className={`px-6 py-3 rounded-full border text-sm transition
                ${state.placement === p
                  ? "bg-black text-white border-black"
                  : "border-gray-300 hover:border-black"
                }`}
            >
              {p}
            </button>
          ))}
        </div>
      </section>

      {/* OPTIONAL NOTE */}
      <section className="space-y-2 opacity-70">
        <h2 className="text-sm font-medium">Note (optional)</h2>
        <textarea
          rows="2"
          placeholder="Anything extra?"
          value={state.notes}
          onChange={(e) => update("notes", e.target.value)}
          className="w-full rounded-xl border px-4 py-3 text-sm focus:outline-none"
        />
      </section>

      {/* STICKY PRICE BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-semibold">₹{price}</p>
        </div>

        <button className="bg-black text-white px-8 py-3 rounded-2xl flex items-center gap-2">
          Continue <FiArrowRight />
        </button>
      </div>
    </div>
  );
}