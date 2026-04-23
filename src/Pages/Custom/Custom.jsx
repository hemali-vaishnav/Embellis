import React, { useEffect, useState } from "react";
import { FiUploadCloud, FiArrowRight } from "react-icons/fi";

const garmentOptions = ["T-Shirt", "Hoodie", "Shirt", "Kurti", "Jacket"];
const fitOptions = ["Regular", "Oversized", "Slim", "Relaxed"];
const placementOptions = ["Front Print", "Back Print", "Full Pattern", "Sleeve Detail"];

export default function Custom() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [formData, setFormData] = useState({
    garmentType: "T-Shirt",
    fit: "Regular",
    quantity: "10",
    placement: "Front Print",
    notes: "",
  });

  useEffect(() => {
    if (!selectedFile) return setPreviewUrl("");
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="pt-40 pb-16 px-4 max-w-3xl mx-auto space-y-10">

      {/* HEADER */}
      <div className="space-y-3">
        <h1 className="text-4xl font-bold text-gray-900">
          Create Your Custom Outfit
        </h1>
        <p className="text-gray-500">
          Upload your design and customize every detail easily.
        </p>
      </div>

      {/* UPLOAD */}
      <div className="space-y-4">
        <label className="block text-sm font-medium">Upload Design</label>
        <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 cursor-pointer hover:bg-gray-50 transition">
          <FiUploadCloud className="text-3xl mb-2" />
          <span className="text-sm text-gray-500">Click to upload image</span>
          <input type="file" className="hidden" onChange={handleImageUpload} />
        </label>

        {previewUrl && (
          <img
            src={previewUrl}
            alt="preview"
            className="w-full h-64 object-contain rounded-xl border"
          />
        )}
      </div>

      {/* FORM FIELDS */}
      <div className="space-y-6">

        <div>
          <label className="block text-sm font-medium mb-1">Garment Type</label>
          <select
            name="garmentType"
            value={formData.garmentType}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          >
            {garmentOptions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Fit Style</label>
          <select
            name="fit"
            value={formData.fit}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          >
            {fitOptions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Print Placement</label>
          <select
            name="placement"
            value={formData.placement}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          >
            {placementOptions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>
      </div>

      {/* BUTTON */}
      <button className="w-full bg-black text-white py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90">
        Submit Request <FiArrowRight />
      </button>

    </div>
  );
}
