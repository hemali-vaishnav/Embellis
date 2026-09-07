import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { FiUploadCloud, FiCheckCircle, FiAlertCircle, FiFile, FiArrowRight } from "react-icons/fi";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { uploadCatalog, fetchCatalog, clearUploadResult } from "../../../redux/slices/catalogSlice";
import { columnDefs, defaultColDef } from "./catalogGridConfig";

ModuleRegistry.registerModules([AllCommunityModule]);

const ACCEPTED_TYPES = ".xlsx,.xls,.csv";

const RECENT_UPLOADS_KEY = "admin_recent_catalog_uploads";
const RECENT_WINDOW_MS = 24 * 60 * 60 * 1000; // a category drops off this page 24h after its last upload

const readRecentUploads = () => {
  try {
    const raw = localStorage.getItem(RECENT_UPLOADS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const recordUpload = (categoryNames, uploadedAt) => {
  const byCategory = new Map(readRecentUploads().map((e) => [e.category, e]));
  categoryNames.forEach((category) => byCategory.set(category, { category, uploadedAt }));
  localStorage.setItem(RECENT_UPLOADS_KEY, JSON.stringify([...byCategory.values()]));
};

const timeAgo = (ms) => {
  const minutes = Math.max(1, Math.round(ms / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.round(minutes / 60)}h ago`;
};

export default function UploadCatalog() {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const { uploading, uploadError, uploadResult, categories } = useSelector((state) => state.catalog);

  useEffect(() => {
    dispatch(fetchCatalog());
  }, [dispatch]);

  // Ticks once a minute so a category's table disappears on its own once the 24h window passes,
  // even if the admin leaves this page open the whole time.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const recentUploads = useMemo(() => {
    const entries = readRecentUploads();
    const stillValid = entries.filter((e) => now - e.uploadedAt < RECENT_WINDOW_MS);
    if (stillValid.length !== entries.length) {
      localStorage.setItem(RECENT_UPLOADS_KEY, JSON.stringify(stillValid));
    }
    return stillValid;
  }, [now]);

  const sections = useMemo(
    () =>
      recentUploads.map((entry) => {
        const group = categories.find((c) => c.category === entry.category);
        return { ...entry, rowData: group?.products || [] };
      }),
    [recentUploads, categories]
  );

  const handleFile = (file) => {
    if (!file) return;
    dispatch(clearUploadResult());
    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const result = await dispatch(uploadCatalog(selectedFile));
    if (uploadCatalog.fulfilled.match(result)) {
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      const uploadedCategories = result.payload?.categories || [];
      if (uploadedCategories.length) {
        recordUpload(uploadedCategories, Date.now());
        setNow(Date.now());
      }

      dispatch(fetchCatalog());
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">Upload Catalog</h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload an Excel/CSV file to bulk add products. Expected columns: product_name, price,
          size, type, stock, category, sub_category, gender, description, image_1, image_2,
          is_trending, is_best_seller (use TRUE/FALSE). Use "gender" (Men/Women) on Handwork
          rows to also filter them under Handcrafted &gt; Men/Women. Products marked is_trending
          or is_best_seller show up in the matching Home page section.
        </p>
      </div>

      {/* UPLOAD BOX */}
      <section className="space-y-4">
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center border border-dashed rounded-xl px-6 py-5 cursor-pointer transition
            ${dragActive ? "border-black bg-black/5" : "border-gray-300 hover:border-black"}`}
        >
          <FiUploadCloud className="text-xl text-gray-400" />
          <span className="text-xs text-gray-500 mt-1.5">
            Drag & drop your catalog file here, or click to browse
          </span>
          <span className="text-[11px] text-gray-400 mt-0.5">Supported: .xlsx, .xls, .csv</span>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES}
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>

        {selectedFile && (
          <div className="flex items-center justify-between rounded-xl border px-4 py-3 bg-white">
            <div className="flex items-center gap-2 text-sm">
              <FiFile className="text-gray-500" />
              <span>{selectedFile.name}</span>
              <span className="text-gray-400">
                ({(selectedFile.size / 1024).toFixed(1)} KB)
              </span>
            </div>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-black text-white text-sm px-6 py-2 rounded-xl disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload Catalog"}
            </button>
          </div>
        )}

        {uploadResult && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <FiCheckCircle />
            {uploadResult.message} — {uploadResult.inserted} products inserted.
          </div>
        )}

        {uploadError && (
          <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <FiAlertCircle />
            {uploadError}
          </div>
        )}
      </section>

      {/* RECENTLY UPLOADED (last 24h only) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-lg font-medium">Recently Uploaded</h2>
          <Link
            to="/admin/products"
            className="flex items-center gap-1.5 text-sm font-medium text-black hover:underline"
          >
            View full catalog <FiArrowRight />
          </Link>
        </div>

        {sections.length === 0 ? (
          <p className="text-sm text-gray-400">
            Nothing uploaded in the last 24 hours. Once you upload a file, its category shows up
            here for a day — after that, find it on the full{" "}
            <Link to="/admin/products" className="underline">
              Products
            </Link>{" "}
            page.
          </p>
        ) : (
          sections.map(({ category, rowData, uploadedAt }) => (
            <div key={category} className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-sm font-semibold text-gray-700">
                  {category} <span className="text-gray-400 font-normal">({rowData.length} products)</span>
                </h3>
                <span className="text-xs text-gray-400">uploaded {timeAgo(now - uploadedAt)}</span>
              </div>

              <div className="rounded-xl border overflow-hidden" style={{ height: 320 }}>
                <AgGridReact
                  rowData={rowData}
                  getRowId={(params) => params.data._id}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  pagination={true}
                  paginationPageSize={10}
                  paginationPageSizeSelector={[10, 20, 50]}
                  animateRows={true}
                />
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
