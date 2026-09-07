// Shared ag-Grid config for the catalog tables on both the Upload page (recent
// uploads only) and the Products page (full, persistent per-category listing).

// Storefront categories that must always have a table, even before any file is uploaded for them.
export const KNOWN_CATEGORIES = ["Men", "Women", "Handwork"];

export const imageCellRenderer = (p) =>
  p.value ? (
    <img
      src={p.value}
      alt=""
      style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 6, margin: "3px 0" }}
    />
  ) : (
    <span style={{ color: "#aaa" }}>-</span>
  );

export const columnDefs = [
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
  { field: "product_name", headerName: "Product", minWidth: 180, flex: 1.4 },
  { field: "gender", headerName: "Gender", minWidth: 110, valueFormatter: (p) => p.value || "-" },
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
  { field: "is_trending", headerName: "Trending", minWidth: 100, cellRenderer: (p) => (p.value ? "✅" : "—") },
  { field: "is_best_seller", headerName: "Best Seller", minWidth: 110, cellRenderer: (p) => (p.value ? "✅" : "—") },
];

// Same as columnDefs, but with a Category column — for a merged, multi-category table
// where the category isn't already implied by a section heading.
export const categoryColumnDefs = [
  columnDefs[0],
  columnDefs[1],
  { field: "category", headerName: "Category", minWidth: 120 },
  ...columnDefs.slice(2),
];

export const defaultColDef = {
  sortable: true,
  filter: true,
  resizable: true,
};
