import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { FiAlertCircle, FiRefreshCw, FiSearch, FiUploadCloud } from "react-icons/fi";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { fetchCatalog } from "../../../redux/slices/catalogSlice";
import { KNOWN_CATEGORIES, columnDefs, categoryColumnDefs, defaultColDef } from "../Catalog/catalogGridConfig";
import CategoryTabs from "../../components/CategoryTabs";

ModuleRegistry.registerModules([AllCommunityModule]);

const CategoryTable = ({ title, rowData, quickFilter, height, showCategoryColumn, emptyMessage }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between gap-4">
      <h3 className="text-sm font-semibold text-gray-700">
        {title} <span className="text-gray-400 font-normal">({rowData.length} products)</span>
      </h3>
      <Link
        to="/admin/catalog"
        className="flex items-center gap-1.5 text-xs font-medium text-black hover:underline"
      >
        <FiUploadCloud /> Add New
      </Link>
    </div>

    <div className="rounded-xl border overflow-hidden" style={{ height }}>
      <AgGridReact
        rowData={rowData}
        getRowId={(params) => params.data._id}
        columnDefs={showCategoryColumn ? categoryColumnDefs : columnDefs}
        defaultColDef={defaultColDef}
        quickFilterText={quickFilter}
        pagination={true}
        paginationPageSize={20}
        paginationPageSizeSelector={[10, 20, 50]}
        animateRows={true}
        overlayNoRowsTemplate={`<span style="color:#9ca3af;font-size:13px;">${emptyMessage}</span>`}
      />
    </div>
  </div>
);

export default function Products() {
  const dispatch = useDispatch();
  const [quickFilter, setQuickFilter] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const { categories, loading, error } = useSelector((state) => state.catalog);

  useEffect(() => {
    dispatch(fetchCatalog());
  }, [dispatch]);

  const sections = useMemo(() => {
    const extraNames = categories
      .map((c) => c.category)
      .filter((name) => name && !KNOWN_CATEGORIES.includes(name));

    return [...KNOWN_CATEGORIES, ...extraNames].map((name) => {
      const group = categories.find((c) => c.category === name);
      return { name, rowData: group?.products || [] };
    });
  }, [categories]);

  const tabs = useMemo(
    () => [{ label: "All", value: "All" }, ...sections.map((s) => ({ label: s.name, value: s.name }))],
    [sections]
  );

  const allRowData = useMemo(
    () => categories.flatMap((c) => (c.products || []).map((p) => ({ ...p, category: c.category }))),
    [categories]
  );

  const totalProducts = categories.reduce((sum, c) => sum + (c.products?.length || 0), 0);
  const activeSection = sections.find((s) => s.name === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">
            Products {!loading && <span className="text-base text-gray-400 font-normal">({totalProducts})</span>}
          </h1>
          <p className="text-sm text-gray-500 mt-1">The full catalog, grouped by category.</p>
        </div>

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

      <CategoryTabs options={tabs} active={activeTab} onChange={setActiveTab} />

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <FiAlertCircle />
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-400">Loading catalog...</p>
      ) : (
        <CategoryTable
          title={activeTab === "All" ? "All Products" : activeTab}
          rowData={activeTab === "All" ? allRowData : activeSection?.rowData || []}
          quickFilter={quickFilter}
          height={560}
          showCategoryColumn={activeTab === "All"}
          emptyMessage={
            activeTab === "All"
              ? "No products yet — upload a catalog file to add some."
              : `No ${activeTab} products yet — upload a catalog file to add some.`
          }
        />
      )}
    </div>
  );
}
