import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiUsers, FiShield, FiCheckCircle, FiRefreshCw, FiSearch } from "react-icons/fi";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { fetchAllUsers } from "../../../redux/slices/adminUserSlice";

ModuleRegistry.registerModules([AllCommunityModule]);

const roleCellRenderer = (p) => (
  <span
    style={{
      padding: "2px 10px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 600,
      textTransform: "uppercase",
      color: p.value === "admin" ? "#7c2d12" : "#374151",
      background: p.value === "admin" ? "#fed7aa" : "#e5e7eb",
    }}
  >
    {p.value}
  </span>
);

const verifiedCellRenderer = (p) => (p.value ? "✅ Verified" : "— Unverified");

const dateFormatter = (p) => (p.value ? new Date(p.value).toLocaleDateString() : "-");

const columnDefs = [
  { field: "name", headerName: "Name", minWidth: 160, flex: 1.2, valueFormatter: (p) => p.value || "-" },
  { field: "email", headerName: "Email", minWidth: 220, flex: 1.4 },
  { field: "phone", headerName: "Phone", minWidth: 140, valueFormatter: (p) => p.value || "-" },
  { field: "role", headerName: "Role", minWidth: 110, cellRenderer: roleCellRenderer },
  { field: "isEmailVerified", headerName: "Email Status", minWidth: 140, cellRenderer: verifiedCellRenderer },
  { field: "createdAt", headerName: "Joined", minWidth: 130, valueFormatter: dateFormatter },
];

const defaultColDef = {
  sortable: true,
  filter: true,
  resizable: true,
};

const StatCard = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 rounded-xl border bg-white px-5 py-4">
    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg text-gray-600">
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  </div>
);

export default function Users() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.adminUsers);
  const [quickFilter, setQuickFilter] = useState("");

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter((u) => u.role === "admin").length;
    const verified = users.filter((u) => u.isEmailVerified).length;
    return { total, admins, verified };
  }, [users]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-sm text-gray-500 mt-1">All registered users on the platform.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<FiUsers />} label="Total Users" value={stats.total} />
        <StatCard icon={<FiShield />} label="Admins" value={stats.admins} />
        <StatCard icon={<FiCheckCircle />} label="Verified Emails" value={stats.verified} />
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            value={quickFilter}
            onChange={(e) => setQuickFilter(e.target.value)}
            placeholder="Search users..."
            className="pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-black"
          />
        </div>
        <button
          onClick={() => dispatch(fetchAllUsers())}
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
        <p className="text-sm text-gray-400">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-sm text-gray-400">No users found.</p>
      ) : (
        <div className="rounded-xl border overflow-hidden" style={{ height: 500 }}>
          <AgGridReact
            rowData={users}
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
