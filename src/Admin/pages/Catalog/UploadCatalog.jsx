import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiUploadCloud, FiCheckCircle, FiAlertCircle, FiRefreshCw, FiFile, FiSearch } from "react-icons/fi";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { uploadCatalog, fetchCatalog, clearUploadResult } from "../../../redux/slices/catalogSlice";

ModuleRegistry.registerModules([AllCommunityModule]);

const ACCEPTED_TYPES = ".xlsx,.xls,.csv";

const imageCellRenderer = (p) =>
  p.value ? (
    <img
      src={p.value}
      alt=""
      style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 6, margin: "3px 0" }}
    />
  ) : (
    <span style={{ color: "#aaa" }}>-</span>
  );

const columnDefs = [
  {
    field: "image_1",
    headerName: "Image 1",
    minWidth: 80,
    maxWidth: 80,
    sortable: false,
    filter: false,
    cellRenderer: imageCellRenderer,
  },
  {
    field: "image_2",
    headerName: "Image 2",
    minWidth: 80,
    maxWidth: 80,
    sortable: false,
    filter: false,
    cellRenderer: imageCellRenderer,
  },
  { field: "category", headerName: "Category", minWidth: 130 },
  { field: "product_name", headerName: "Product", minWidth: 180, flex: 1.4 },
  { field: "sub_category", headerName: "Sub Category", minWidth: 140, valueFormatter: (p) => p.value || "-" },
  { field: "type", headerName: "Type", minWidth: 130, valueFormatter: (p) => p.value || "-" },
  { field: "size", headerName: "Size", minWidth: 100 },
  {
    field: "price",
    headerName: "Price",
    minWidth: 110,
    type: "numericColumn",
    valueFormatter: (p) => (p.value != null ? `₹${p.value}` : ""),
  },
  { field: "stock", headerName: "Stock", minWidth: 100, type: "numericColumn" },
];

const defaultColDef = {
  sortable: true,
  filter: true,
  resizable: true,
};

export default function UploadCatalog() {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [quickFilter, setQuickFilter] = useState("");

  const { uploading, uploadError, uploadResult, categories, loading, error } = useSelector(
    (state) => state.catalog
  );

  const rowData = useMemo(
    () =>
      categories.flatMap((cat) =>
        (cat.products || []).map((p) => ({ ...p, category: cat.category }))
      ),
    [categories]
  );

  useEffect(() => {
    dispatch(fetchCatalog());
  }, [dispatch]);

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
      dispatch(fetchCatalog());
    }
  };

  const totalProducts = categories.reduce((sum, c) => sum + (c.products?.length || 0), 0);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">Product Catalog</h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload an Excel/CSV file to bulk add products. Expected columns: product_name, price,
          size, type, stock, category, sub_category, description, image_1, image_2.
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

      {/* CATALOG LIST */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-lg font-medium">
            Current Catalog {!loading && <span className="text-sm text-gray-400">({totalProducts} products)</span>}
          </h2>

          <div className="flex items-center gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                value={quickFilter}
                onChange={(e) => setQuickFilter(e.target.value)}
                placeholder="Search products..."
                className="pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-black"
              />
            </div>
            <button
              onClick={() => dispatch(fetchCatalog())}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-gray-300 hover:border-black transition"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <FiAlertCircle />
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-sm text-gray-400">Loading catalog...</p>
        ) : categories.length === 0 ? (
          <p className="text-sm text-gray-400">No products uploaded yet.</p>
        ) : (
          <div className="rounded-xl border overflow-hidden" style={{ height: 500 }}>
            <AgGridReact
              rowData={rowData}
              getRowId={(params) => params.data._id}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              quickFilterText={quickFilter}
              pagination={true}
              paginationPageSize={20}
              paginationPageSizeSelector={[20, 50, 100]}
              animateRows={true}
            />
          </div>
        )}
      </section>
    </div>
  );
}
