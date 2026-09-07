import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiShoppingCart, FiHeart, FiUsers, FiRefreshCw, FiSearch } from "react-icons/fi";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { fetchAllCarts, fetchAllFavorites } from "../../../redux/slices/adminCartFavoritesSlice";
import { imageCellRenderer, defaultColDef } from "../Catalog/catalogGridConfig";
import CategoryTabs from "../../components/CategoryTabs";

ModuleRegistry.registerModules([AllCommunityModule]);

const customerCellRenderer = (p) => (
  <div style={{ lineHeight: 1.3, padding: "6px 0" }}>
    <div style={{ fontWeight: 600 }}>{p.value?.name || "Unknown"}</div>
    <div style={{ fontSize: 11, color: "#6b7280" }}>{p.value?.email || "-"}</div>
  </div>
);

const customerQuickFilterText = (p) => `${p.value?.name || ""} ${p.value?.email || ""}`;
const money = (p) => (p.value != null ? `₹${p.value}` : "-");
const dateFormatter = (p) => (p.value ? new Date(p.value).toLocaleDateString() : "-");

const cartColumnDefs = [
  {
    headerName: "Customer",
    field: "user",
    minWidth: 200,
    flex: 1.2,
    cellRenderer: customerCellRenderer,
    getQuickFilterText: customerQuickFilterText,
  },
  {
    field: "product.image_1",
    headerName: "Image",
    minWidth: 70,
    maxWidth: 70,
    sortable: false,
    filter: false,
    cellRenderer: imageCellRenderer,
  },
  {
    field: "product.product_name",
    headerName: "Product",
    minWidth: 180,
    flex: 1.3,
    valueFormatter: (p) => p.value || "Deleted product",
  },
  { field: "product.category", headerName: "Category", minWidth: 110, valueFormatter: (p) => p.value || "-" },
  { field: "size", headerName: "Size", minWidth: 90, valueFormatter: (p) => p.value || "-" },
  { field: "quantity", headerName: "Qty", minWidth: 80, type: "numericColumn" },
  { field: "product.price", headerName: "Price", minWidth: 100, type: "numericColumn", valueFormatter: money },
  {
    headerName: "Subtotal",
    minWidth: 110,
    type: "numericColumn",
    valueGetter: (p) => (p.data.product?.price || 0) * (p.data.quantity || 0),
    valueFormatter: money,
  },
];

const favoritesColumnDefs = [
  {
    headerName: "Customer",
    field: "user",
    minWidth: 200,
    flex: 1.2,
    cellRenderer: customerCellRenderer,
    getQuickFilterText: customerQuickFilterText,
  },
  {
    field: "product.image_1",
    headerName: "Image",
    minWidth: 70,
    maxWidth: 70,
    sortable: false,
    filter: false,
    cellRenderer: imageCellRenderer,
  },
  {
    field: "product.product_name",
    headerName: "Product",
    minWidth: 180,
    flex: 1.3,
    valueFormatter: (p) => p.value || "Deleted product",
  },
  { field: "product.category", headerName: "Category", minWidth: 110, valueFormatter: (p) => p.value || "-" },
  { field: "product.price", headerName: "Price", minWidth: 100, type: "numericColumn", valueFormatter: money },
  { field: "createdAt", headerName: "Added", minWidth: 130, valueFormatter: dateFormatter },
];

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

const TABS = [
  { label: "Cart", value: "cart" },
  { label: "Wishlist", value: "wishlist" },
];

export default function CartWishlist() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("cart");
  const [quickFilter, setQuickFilter] = useState("");

  const { carts, cartsLoading, cartsError, favorites, favoritesLoading, favoritesError } = useSelector(
    (state) => state.adminCartFavorites
  );

  const refresh = () => {
    dispatch(fetchAllCarts());
    dispatch(fetchAllFavorites());
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const uniqueCustomers = useMemo(() => {
    const ids = new Set();
    carts.forEach((c) => c.user?._id && ids.add(c.user._id));
    favorites.forEach((f) => f.user?._id && ids.add(f.user._id));
    return ids.size;
  }, [carts, favorites]);

  const isCart = activeTab === "cart";
  const loading = isCart ? cartsLoading : favoritesLoading;
  const error = isCart ? cartsError : favoritesError;
  const rowData = isCart ? carts : favorites;
  const columnDefs = isCart ? cartColumnDefs : favoritesColumnDefs;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Cart &amp; Wishlist</h1>
        <p className="text-sm text-gray-500 mt-1">What every customer currently has in their cart or wishlist.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<FiShoppingCart />} label="Cart Items" value={carts.length} />
        <StatCard icon={<FiHeart />} label="Wishlist Items" value={favorites.length} />
        <StatCard icon={<FiUsers />} label="Customers" value={uniqueCustomers} />
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <CategoryTabs options={TABS} active={activeTab} onChange={setActiveTab} />

        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              value={quickFilter}
              onChange={(e) => setQuickFilter(e.target.value)}
              placeholder="Search by customer or product..."
              className="pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-black"
            />
          </div>
          <button
            onClick={refresh}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-gray-300 hover:border-black transition"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</div>
      )}

      {loading ? (
        <p className="text-sm text-gray-400">Loading {isCart ? "cart" : "wishlist"} items...</p>
      ) : (
        <div className="rounded-xl border overflow-hidden" style={{ height: 520 }}>
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
            overlayNoRowsTemplate={`<span style="color:#9ca3af;font-size:13px;">No ${isCart ? "cart" : "wishlist"} items yet.</span>`}
          />
        </div>
      )}
    </div>
  );
}
