import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiRefreshCw, FiSearch } from "react-icons/fi";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { fetchAllCustomOrders } from "../../../redux/slices/adminCustomSlice";

ModuleRegistry.registerModules([AllCommunityModule]);

const dateFormatter = (p) => (p.value ? new Date(p.value).toLocaleString() : "-");

const columnDefs = [
  { field: "type", headerName: "Garment Type", minWidth: 150, flex: 1 },
  { field: "size", headerName: "Size", minWidth: 90, valueFormatter: (p) => p.value || "-" },
  { field: "print_placement", headerName: "Print Placement", minWidth: 150 },
  { field: "quality", headerName: "Quality", minWidth: 100 },
  { field: "note", headerName: "Note", minWidth: 200, flex: 1.4, valueFormatter: (p) => p.value || "-" },
  { field: "user_id", headerName: "User ID", minWidth: 200 },
  { field: "createdAt", headerName: "Submitted", minWidth: 180, valueFormatter: dateFormatter },
];

const defaultColDef = {
  sortable: true,
  filter: true,
  resizable: true,
};

export default function CustomOrders() {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.adminCustom);
  const [quickFilter, setQuickFilter] = useState("");

  useEffect(() => {
    dispatch(fetchAllCustomOrders());
  }, [dispatch]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Custom Orders</h1>
        <p className="text-sm text-gray-500 mt-1">
          Custom design requests submitted by customers ({orders.length}).
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            value={quickFilter}
            onChange={(e) => setQuickFilter(e.target.value)}
            placeholder="Search orders..."
            className="pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-black"
          />
        </div>
        <button
          onClick={() => dispatch(fetchAllCustomOrders())}
          className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-gray-300 hover:border-black transition"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-400">Loading custom orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-gray-400">No custom orders yet.</p>
      ) : (
        <div className="rounded-xl border overflow-hidden" style={{ height: 500 }}>
          <AgGridReact
            rowData={orders}
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
    </div>
  );
}
