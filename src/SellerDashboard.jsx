import { useState, useEffect } from "react";
import { SHFooter, SHARED_CSS } from "./shared";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const BACKEND_BASE = "https://stylehub-backend-tau.vercel.app/api";

async function sellerRequest(method, path, body = null) {
  const headers = { "Content-Type": "application/json" };
  const token = localStorage.getItem("sellerToken");
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BACKEND_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "API error");
  return data;
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700;800&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --green: #7b8b5b;
  --green-dark: #5e6d41;
  --green-light: #e3e8d9;
  --green-mid: #d4dcbe;
  --white: #ffffff;
  --gray-text: #888;
  --border: #e0e0e0;
  --shadow: 0 20px 50px rgba(0,0,0,0.09);
  --radius-card: 22px;
  --font: 'Jost', sans-serif;
}

body { font-family: var(--font); background: #f5f7f0; }

.dashboard-page { min-height: 100vh; display: flex; }

/* Sidebar */
.dash-sidebar {
  width: 260px;
  background: linear-gradient(180deg, #5e6d41 0%, #7b8b5b 100%);
  color: #fff;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 100;
}
.dash-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.3rem;
  font-weight: 800;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.15);
}
.dash-logo i { font-size: 1.5rem; }

.dash-nav { flex: 1; display: flex; flex-direction: column; gap: 0.4rem; }
.dash-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  font-size: 0.88rem;
  font-weight: 500;
  color: rgba(255,255,255,0.75);
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
  font-family: var(--font);
}
.dash-nav-item:hover { background: rgba(255,255,255,0.1); color: #fff; }
.dash-nav-item.active { background: rgba(255,255,255,0.2); color: #fff; font-weight: 600; }
.dash-nav-item i { width: 20px; text-align: center; font-size: 1rem; }

.dash-logout {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(255,255,255,0.15);
}
.dash-logout-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  font-size: 0.88rem;
  font-weight: 600;
  color: #fff;
  background: rgba(231, 76, 60, 0.8);
  border: none;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s;
  font-family: var(--font);
}
.dash-logout-btn:hover { background: #e74c3c; }

/* Main Content */
.dash-main {
  flex: 1;
  margin-left: 260px;
  padding: 2rem;
  background: #f5f7f0;
  min-height: 100vh;
}

.dash-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.dash-welcome h1 {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1a1a18;
}
.dash-welcome p {
  color: var(--gray-text);
  font-size: 0.9rem;
  margin-top: 0.3rem;
}
.dash-date {
  font-size: 0.85rem;
  color: var(--gray-text);
  background: #fff;
  padding: 0.6rem 1rem;
  border-radius: 10px;
  border: 1px solid var(--border);
}

/* Stats Cards */
.dash-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.2rem;
  margin-bottom: 2rem;
}
.stat-card {
  background: #fff;
  border-radius: 18px;
  padding: 1.5rem;
  border: 1px solid var(--border);
  transition: all 0.2s;
}
.stat-card:hover {
  box-shadow: 0 8px 24px rgba(91,109,65,0.1);
  border-color: var(--green-mid);
}
.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--green-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: var(--green-dark);
  margin-bottom: 1rem;
}
.stat-value {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1a1a18;
  margin-bottom: 0.3rem;
}
.stat-label {
  font-size: 0.8rem;
  color: var(--gray-text);
  font-weight: 500;
}
.stat-change {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
}
.stat-change.up { background: #edf7ee; color: #2d7a35; }
.stat-change.down { background: #fdf0ee; color: #c0392b; }

/* Content Grid */
.dash-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.dash-card {
  background: #fff;
  border-radius: 18px;
  padding: 1.5rem;
  border: 1px solid var(--border);
}
.dash-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
}
.dash-card-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a18;
}
.dash-card-action {
  font-size: 0.8rem;
  color: var(--green);
  font-weight: 600;
  cursor: pointer;
  background: none;
  border: none;
  font-family: var(--font);
}
.dash-card-action:hover { text-decoration: underline; }

/* Orders Table */
.orders-table {
  width: 100%;
  border-collapse: collapse;
}
.orders-table th {
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--gray-text);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0.8rem;
  border-bottom: 1px solid var(--border);
}
.orders-table td {
  padding: 1rem 0.8rem;
  font-size: 0.85rem;
  color: #333;
  border-bottom: 1px solid var(--border);
}
.orders-table tr:last-child td { border-bottom: none; }
.order-id { font-weight: 600; color: var(--green-dark); }
.order-status {
  display: inline-block;
  padding: 0.3rem 0.7rem;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 600;
}
.order-status.pending { background: #fff3cd; color: #856404; }
.order-status.shipped { background: #d1ecf1; color: #0c5460; }
.order-status.delivered { background: #d4edda; color: #155724; }
.order-status.cancelled { background: #f8d7da; color: #721c24; }

/* Products List */
.product-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--border);
}
.product-item:last-child { border-bottom: none; }
.product-img {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: var(--green-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}
.product-info { flex: 1; }
.product-name { font-size: 0.88rem; font-weight: 600; color: #1a1a18; }
.product-stock { font-size: 0.75rem; color: var(--gray-text); margin-top: 0.2rem; }
.product-price { font-size: 0.9rem; font-weight: 700; color: var(--green-dark); }

/* Quick Actions */
.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
}
.quick-btn {
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid var(--border);
  background: #fff;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s;
  font-family: var(--font);
}
.quick-btn:hover { border-color: var(--green); background: var(--green-light); }
.quick-btn i { display: block; font-size: 1.3rem; color: var(--green); margin-bottom: 0.5rem; }
.quick-btn span { font-size: 0.78rem; font-weight: 600; color: #333; }

/* Page Title */
.page-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #1a1a18;
  margin-bottom: 1.5rem;
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.2rem;
}
.product-card {
  background: #fff;
  border-radius: 16px;
  padding: 1rem;
  border: 1px solid var(--border);
  transition: all 0.2s;
}
.product-card:hover {
  box-shadow: 0 8px 24px rgba(91,109,65,0.1);
  border-color: var(--green-mid);
}
.product-card-img {
  width: 100%;
  height: 140px;
  border-radius: 12px;
  background: var(--green-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: var(--green);
  margin-bottom: 1rem;
}
.product-card-name { font-size: 0.9rem; font-weight: 600; color: #1a1a18; margin-bottom: 0.3rem; }
.product-card-price { font-size: 0.85rem; font-weight: 700; color: var(--green-dark); margin-bottom: 0.3rem; }
.product-card-stock { font-size: 0.75rem; color: var(--gray-text); }
.product-card-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}
.product-card-btn {
  flex: 1;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  font-family: var(--font);
  transition: all 0.2s;
}
.product-card-btn:hover { border-color: var(--green); background: var(--green-light); }
.product-card-btn.primary { background: var(--green); color: #fff; border-color: var(--green); }
.product-card-btn.primary:hover { background: var(--green-dark); }

/* Add Product Button */
.add-product-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.8rem 1.5rem;
  background: var(--green);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  font-family: var(--font);
  transition: all 0.2s;
}
.add-product-btn:hover { background: var(--green-dark); }

/* Analytics */
.analytics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}
.chart-card {
  background: #fff;
  border-radius: 18px;
  padding: 1.5rem;
  border: 1px solid var(--border);
}
.chart-placeholder {
  height: 200px;
  background: linear-gradient(135deg, var(--green-light) 0%, var(--green-mid) 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--green-dark);
  font-size: 0.9rem;
  font-weight: 600;
}

/* Customers */
.customers-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid var(--border);
}
.customers-table th {
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--gray-text);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 1rem;
  background: var(--green-light);
  border-bottom: 1px solid var(--border);
}
.customers-table td {
  padding: 1rem;
  font-size: 0.85rem;
  color: #333;
  border-bottom: 1px solid var(--border);
}
.customers-table tr:last-child td { border-bottom: none; }
.customer-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--green);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
}
.customer-name-cell {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

/* Settings */
.settings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
.settings-card {
  background: #fff;
  border-radius: 18px;
  padding: 1.5rem;
  border: 1px solid var(--border);
}
.settings-card h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a18;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.settings-card h3 i { color: var(--green); }
.settings-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--border);
}
.settings-row:last-child { border-bottom: none; }
.settings-label { font-size: 0.85rem; color: #333; }
.settings-value { font-size: 0.85rem; color: var(--gray-text); }
.settings-input {
  padding: 0.6rem 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 0.85rem;
  font-family: var(--font);
  width: 200px;
}
.settings-input:focus { outline: none; border-color: var(--green); }
.settings-toggle {
  width: 44px;
  height: 24px;
  background: var(--border);
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: all 0.2s;
}
.settings-toggle.on { background: var(--green); }
.settings-toggle::after {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  background: #fff;
  border-radius: 50%;
  top: 3px;
  left: 3px;
  transition: all 0.2s;
}
.settings-toggle.on::after { left: 23px; }
.settings-btn {
  padding: 0.6rem 1.2rem;
  background: var(--green);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  font-family: var(--font);
  margin-top: 1rem;
}
.settings-btn:hover { background: var(--green-dark); }

@media (max-width: 1200px) {
  .dash-stats { grid-template-columns: repeat(2, 1fr); }
  .dash-content { grid-template-columns: 1fr; }
  .products-grid { grid-template-columns: repeat(3, 1fr); }
  .analytics-grid { grid-template-columns: 1fr; }
  .settings-grid { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .dash-sidebar { display: none; }
  .dash-main { margin-left: 0; }
  .dash-stats { grid-template-columns: 1fr; }
  .products-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .products-grid { grid-template-columns: 1fr; }
}
`;

const NAV_ITEMS = [
  { id: "dashboard", icon: "fas fa-th-large", label: "Dashboard" },
  { id: "orders", icon: "fas fa-shopping-bag", label: "Orders" },
  { id: "products", icon: "fas fa-tshirt", label: "Products" },
  { id: "reviews", icon: "fas fa-star", label: "Reviews" },
  { id: "analytics", icon: "fas fa-chart-line", label: "Analytics" },
  { id: "customers", icon: "fas fa-users", label: "Customers" },
  { id: "settings", icon: "fas fa-cog", label: "Settings" },
];

// Dashboard View
function DashboardView({ setActiveNav }) {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, ordersRes] = await Promise.all([
          sellerRequest("GET", "/seller/dashboard"),
          sellerRequest("GET", "/seller/orders"),
        ]);
        setStats(dashRes.data);
        setOrders(ordersRes.data?.orders || []);
        setProducts(ordersRes.data?.products || []);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: "2rem", color: "var(--gray-text)" }}>Loading dashboard...</div>;

  const STAT_CARDS = [
    { icon: "fas fa-dollar-sign", value: `EGP ${stats?.totalRevenue?.toLocaleString() || 0}`, label: "Total Revenue" },
    { icon: "fas fa-shopping-cart", value: stats?.totalOrders || 0, label: "Total Orders" },
    { icon: "fas fa-box", value: stats?.totalProducts || 0, label: "Products Listed" },
    { icon: "fas fa-star", value: stats?.avgRating || "0.0", label: "Avg Rating" },
  ];

  return (
    <>
      <div className="dash-stats">
        {STAT_CARDS.map((stat, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-icon"><i className={stat.icon} /></div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="dash-content">
        <div className="dash-card">
          <div className="dash-card-header">
            <h3 className="dash-card-title">Recent Orders</h3>
            <button className="dash-card-action" onClick={() => setActiveNav("orders")}>View All</button>
          </div>
          {orders.length === 0 ? (
            <p style={{ color: "var(--gray-text)", fontSize: ".85rem" }}>No orders yet.</p>
          ) : (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 4).map((order) => (
                  <tr key={order._id}>
                    <td className="order-id">#{order._id?.slice(-6).toUpperCase()}</td>
                    <td>{order.customer?.firstName} {order.customer?.lastName}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>EGP {order.totalPrice?.toLocaleString()}</td>
                    <td>
                      <span className={`order-status ${order.status}`}>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="dash-card">
            <div className="dash-card-header">
              <h3 className="dash-card-title">Orders by Status</h3>
            </div>
            {stats?.ordersByStatus && Object.entries(stats.ordersByStatus).map(([status, count]) => (
              <div key={status} style={{ display: "flex", justifyContent: "space-between", padding: ".5rem 0", borderBottom: "1px solid var(--border)", fontSize: ".85rem" }}>
                <span className={`order-status ${status}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>

          <div className="dash-card">
            <div className="dash-card-header">
              <h3 className="dash-card-title">Quick Actions</h3>
            </div>
            <div className="quick-actions">
              <button className="quick-btn" onClick={() => setActiveNav("products")}>
                <i className="fas fa-plus" /><span>Add Product</span>
              </button>
              <button className="quick-btn" onClick={() => setActiveNav("orders")}>
                <i className="fas fa-shopping-bag" /><span>View Orders</span>
              </button>
              <button className="quick-btn" onClick={() => setActiveNav("analytics")}>
                <i className="fas fa-chart-bar" /><span>View Reports</span>
              </button>
              <button className="quick-btn" onClick={() => setActiveNav("settings")}>
                <i className="fas fa-cog" /><span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Orders View
function OrdersView() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sellerRequest("GET", "/seller/orders")
      .then(res => setOrders(res.data?.orders || []))
      .catch(err => console.error("Failed to load orders:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: "2rem", color: "var(--gray-text)" }}>Loading orders...</div>;

  return (
    <>
      <h2 className="page-title">Orders</h2>
      <div className="dash-card">
        {orders.length === 0 ? (
          <p style={{ color: "var(--gray-text)", fontSize: ".85rem" }}>No orders yet.</p>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="order-id">#{order._id?.slice(-6).toUpperCase()}</td>
                  <td>{order.customer?.firstName} {order.customer?.lastName}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.items?.length} items</td>
                  <td>EGP {order.totalPrice?.toLocaleString()}</td>
                  <td>
                    <span className={`order-status ${order.status}`}>
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

// Products View
function ProductsView() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);   // product being edited
  const [showAdd, setShowAdd] = useState(false);          // show add modal
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  // Empty form state
  const emptyForm = { name: "", price: "", salePrice: "", stock: "", category: "", type: "", description: "", sizes: "", images: [] };
  const [form, setForm] = useState(emptyForm);

  const loadProducts = () => {
    setLoading(true);
    sellerRequest("GET", "/products/my")
      .then(res => setProducts(res.data?.products || []))
      .catch(err => console.error("Failed to load products:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadProducts(); }, []);

  const openEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name || "",
      price: product.price || "",
      salePrice: product.salePrice || "",
      stock: product.stock || "",
      category: product.category || "",
      type: (product.tags?.[0]?.toLowerCase() || ""),
      description: product.description || "",
      sizes: (product.sizes || []).join(", "),
      images: (product.images || []).map((img, i) => ({
        imageFile: null,
        existingImage: img,
        color: product.colors?.[i] || "",
      })),
    });
  };

  const closeModal = () => { setEditProduct(null); setShowAdd(false); setForm(emptyForm); setMsg(null); };

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const token = localStorage.getItem("sellerToken");
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      if (form.salePrice) formData.append("salePrice", form.salePrice);
      formData.append("stock", form.stock);
      formData.append("category", form.category);
      if (form.type) formData.append("tags", form.type);
      formData.append("description", form.description);
      formData.append("sizes", form.sizes);
      const imgs = form.images || [];
      const colors = imgs.map(i => i.color?.trim() || "").filter(Boolean);
      if (colors.length > 0) formData.append("colors", colors.join(","));
      imgs.forEach(img => { if (img.imageFile) formData.append("images", img.imageFile); });

      const url = editProduct
        ? `https://stylehub-backend-tau.vercel.app/api/products/${editProduct._id}`
        : "https://stylehub-backend-tau.vercel.app/api/products";
      const method = editProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong.");

      setMsg({ type: "success", text: editProduct ? "Product updated successfully!" : "Product added successfully!" });
      loadProducts();
      setTimeout(closeModal, 1200);
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Something went wrong." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId) => {

    try {
      const token = localStorage.getItem("sellerToken") || localStorage.getItem("token");
      const res = await fetch(`https://stylehub-backend-tau.vercel.app/api/products/${productId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed");
      loadProducts();
    } catch (err) {
      alert("Failed to delete product.");
    }
  };

  if (loading) return <div style={{ padding: "2rem", color: "var(--gray-text)" }}>Loading products...</div>;

  // Modal styles
  const modalOverlay = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" };
  const modalBox = { background: "#fff", borderRadius: 18, padding: "2rem", width: "100%", maxWidth: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" };
  const inputStyle = { width: "100%", padding: "10px 14px", border: "1.5px solid var(--border)", borderRadius: 10, fontFamily: "var(--font)", fontSize: ".88rem", outline: "none", marginBottom: "1rem", background: "var(--green-light)" };
  const labelStyle = { display: "block", fontSize: ".75rem", fontWeight: 700, color: "#555", marginBottom: ".3rem" };
  const rowStyle = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" };

  const isOpen = editProduct || showAdd;

  return (
    <>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 className="page-title" style={{ marginBottom: 0 }}>Products</h2>
        <button className="add-product-btn" onClick={() => { setShowAdd(true); setForm(emptyForm); }}>
          <i className="fas fa-plus" /> Add Product
        </button>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <p style={{ color: "var(--gray-text)", fontSize: ".85rem" }}>No products yet. Add your first product!</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div className="product-card" key={product._id}>
              <div className="product-card-img">
                {product.images && product.images.length > 0
                  ? <img src={product.images[0]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <i className="fas fa-tshirt" />
                }
              </div>
              <div className="product-card-name">{product.name}</div>
              <div className="product-card-price">
                EGP {product.price?.toLocaleString()}
                {product.salePrice && <span style={{ fontSize: ".72rem", color: "var(--gray-text)", marginLeft: 6, textDecoration: "line-through" }}>EGP {product.salePrice?.toLocaleString()}</span>}
              </div>
              <div className="product-card-stock">
                {product.stock} in stock · {typeof product.category === "object" ? product.category?.name || "" : product.category}
              </div>
              <div className="product-card-actions">
                <button className="product-card-btn" onClick={() => openEdit(product)}>
                  <i className="fas fa-edit" style={{ marginRight: 4 }} /> Edit
                </button>
                <button className="product-card-btn" style={{ color: "#e74c3c", borderColor: "#e74c3c" }} onClick={() => handleDelete(product._id)}>
                  <i className="fas fa-trash" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Add Modal */}
      {isOpen && (
        <div style={modalOverlay} onClick={e => e.target === e.currentTarget && closeModal()}>
          <div style={modalBox}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontWeight: 800, fontSize: "1.1rem", color: "#1a1a18" }}>
                {editProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button onClick={closeModal} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "var(--gray-text)" }}>✕</button>
            </div>

            {msg && (
              <div style={{ padding: "10px 14px", borderRadius: 10, marginBottom: "1rem", fontSize: ".83rem", fontWeight: 500, background: msg.type === "success" ? "#edf7ee" : "#fdf0ee", color: msg.type === "success" ? "#2d7a35" : "#c0392b", border: `1px solid ${msg.type === "success" ? "#b8e6bc" : "#f5c6c2"}` }}>
                {msg.text}
              </div>
            )}

            <label style={labelStyle}>Product Name</label>
            <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Studio Zip-up" />

            <div style={rowStyle}>
              <div>
                <label style={labelStyle}>Price (EGP)</label>
                <input style={inputStyle} type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="600" />
              </div>
              <div>
                <label style={labelStyle}>Sale Price (optional)</label>
                <input style={inputStyle} type="number" value={form.salePrice} onChange={e => setForm(f => ({ ...f, salePrice: e.target.value }))} placeholder="500" />
              </div>
            </div>

            <div style={rowStyle}>
              <div>
                <label style={labelStyle}>Stock</label>
                <input style={inputStyle} type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} placeholder="10" />
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <select style={{ ...inputStyle, appearance: "none" }} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  <option value="">Select…</option>
                  <option value="women">Women</option>
                  <option value="men">Men</option>
                  <option value="kids">Kids</option>
                </select>
              </div>
            </div>

            <div style={rowStyle}>
              <div>
                <label style={labelStyle}>Type</label>
                <select style={{ ...inputStyle, appearance: "none" }} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  <option value="">Select…</option>
                  <option value="tops">Tops</option>
                  <option value="bottoms">Bottoms</option>
                  <option value="jackets">Jackets</option>
                  <option value="t-shirts">T-Shirts</option>
                  <option value="hoodies">Hoodies</option>
                  <option value="dresses">Dresses</option>
                </select>
              </div>
              <div />
            </div>

            <label style={labelStyle}>Description (optional)</label>
            <textarea style={{ ...inputStyle, minHeight: 70, resize: "vertical" }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe your product..." />

            <label style={labelStyle}>Sizes</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", marginBottom: "1rem" }}>
              {["XS", "S", "M", "L", "XL", "XXL", "One Size"].map(size => {
                const selected = (form.sizes || "").split(",").map(s => s.trim()).filter(Boolean).includes(size);
                return (
                  <button key={size} type="button"
                    onClick={() => {
                      const current = (form.sizes || "").split(",").map(s => s.trim()).filter(Boolean);
                      const updated = selected ? current.filter(s => s !== size) : [...current, size];
                      setForm(f => ({ ...f, sizes: updated.join(", ") }));
                    }}
                    style={{ padding: ".4rem .9rem", border: `1.5px solid ${selected ? "var(--green-dark)" : "var(--border)"}`, borderRadius: 8, background: selected ? "var(--green)" : "#fff", color: selected ? "#fff" : "#333", fontFamily: "var(--font)", fontSize: ".82rem", fontWeight: selected ? 700 : 400, cursor: "pointer", transition: "all .15s" }}>
                    {size}
                  </button>
                );
              })}
            </div>

            <label style={labelStyle}>Product Images <span style={{ fontWeight: 400, color: "#aaa" }}>(each image can have an optional color)</span></label>
            <div style={{ marginBottom: "1rem" }}>
              {/* Existing + new images */}
              {(form.images || []).map((img, i) => (
                <div key={i} style={{ display: "flex", gap: ".6rem", alignItems: "center", marginBottom: ".6rem", background: "var(--green-light)", borderRadius: 10, padding: ".6rem .8rem" }}>
                  {/* Image preview */}
                  <div style={{ width: 50, height: 50, flexShrink: 0, borderRadius: 8, overflow: "hidden", background: "#fff", border: "1.5px solid var(--border)" }}>
                    {(img.imageFile || img.existingImage) && (
                      <img src={img.imageFile ? URL.createObjectURL(img.imageFile) : img.existingImage} alt=""
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    )}
                  </div>
                  {/* Change image */}
                  <label style={{ fontSize: ".7rem", color: "var(--green-dark)", cursor: "pointer", fontWeight: 600, flexShrink: 0 }}>
                    {img.imageFile || img.existingImage ? "Change" : "+ Image"}
                    <input type="file" accept="image/*" style={{ display: "none" }}
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) setForm(f => ({ ...f, images: f.images.map((x, j) => j === i ? { ...x, imageFile: file } : x) }));
                      }} />
                  </label>
                  {/* Optional color */}
                  <div style={{ display: "flex", alignItems: "center", gap: ".4rem", flex: 1 }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: img.color || "#e0e0e0", border: "1.5px solid #ccc", flexShrink: 0 }} />
                    <input
                      style={{ flex: 1, padding: "6px 10px", border: "1.5px solid var(--border)", borderRadius: 8, fontFamily: "var(--font)", fontSize: ".8rem", outline: "none", background: "#fff" }}
                      placeholder="Color (optional) e.g. #FF0000"
                      value={img.color || ""}
                      onChange={e => setForm(f => ({ ...f, images: f.images.map((x, j) => j === i ? { ...x, color: e.target.value } : x) }))}
                    />
                  </div>
                  {/* Remove */}
                  <button type="button" onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#e74c3c", fontSize: "1rem", flexShrink: 0 }}>✕</button>
                </div>
              ))}
              {/* Add new image button */}
              <label style={{ display: "inline-block", padding: ".5rem 1rem", border: "1px dashed var(--green)", borderRadius: 8, cursor: "pointer", fontSize: ".75rem", color: "var(--green-dark)", fontWeight: 600, marginTop: ".3rem" }}>
                + Add Image
                <input type="file" accept="image/*" multiple style={{ display: "none" }}
                  onChange={e => {
                    const files = Array.from(e.target.files);
                    setForm(f => ({ ...f, images: [...(f.images || []), ...files.map(file => ({ imageFile: file, existingImage: null, color: "" }))] }));
                  }} />
              </label>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: ".5rem" }}>
              <button onClick={closeModal} style={{ flex: 1, padding: "11px", border: "1.5px solid var(--border)", borderRadius: 25, background: "#fff", fontFamily: "var(--font)", fontSize: ".85rem", fontWeight: 600, cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving || !form.name || !form.price || !form.category} style={{ flex: 2, padding: "11px", border: "none", borderRadius: 25, background: "var(--green)", color: "#fff", fontFamily: "var(--font)", fontSize: ".85rem", fontWeight: 700, cursor: "pointer", opacity: saving ? .6 : 1 }}>
                {saving ? <><i className="fas fa-circle-notch fa-spin" /> Saving…</> : editProduct ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Reviews View
function ReviewsView() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get seller products first, then fetch reviews for each
    sellerRequest("GET", "/products/my")
      .then(async res => {
        const products = res.data?.products || [];
        const allReviews = [];
        for (const product of products) {
          try {
            const rv = await sellerRequest("GET", `/products/${product._id}/reviews?limit=50`);
            const reviews = rv.data?.reviews || [];
            reviews.forEach(r => allReviews.push({ ...r, productName: product.name }));
          } catch (e) { }
        }
        allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReviews(allReviews);
      })
      .catch(err => console.error("Failed to load reviews:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: "2rem", color: "var(--gray-text)" }}>Loading reviews...</div>;

  const avg = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <>
      <h2 className="page-title">Customer Reviews</h2>

      {/* Summary */}
      <div className="dash-stats" style={{ marginBottom: "1.5rem" }}>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-star" /></div>
          <div className="stat-value">{avg}</div>
          <div className="stat-label">Avg Rating</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-comments" /></div>
          <div className="stat-value">{reviews.length}</div>
          <div className="stat-label">Total Reviews</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-thumbs-up" /></div>
          <div className="stat-value">{reviews.filter(r => r.rating >= 4).length}</div>
          <div className="stat-label">Positive Reviews</div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="dash-card" style={{ padding: "2rem", textAlign: "center", color: "var(--gray-text)" }}>
          <i className="fas fa-star" style={{ fontSize: "2rem", marginBottom: "1rem", display: "block", opacity: .3 }} />
          No reviews yet. Reviews will appear here when customers rate your products.
        </div>
      ) : (
        <div className="dash-card" style={{ padding: "1.5rem" }}>
          {reviews.map((rv, i) => {
            const name = rv.customer
              ? `${rv.customer.firstName || ""} ${rv.customer.lastName || ""}`.trim() || "Customer"
              : "Customer";
            const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
            const date = new Date(rv.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
            return (
              <div key={rv._id} style={{ padding: "1.2rem 0", borderBottom: i < reviews.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: ".8rem", marginBottom: ".5rem" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--green)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".72rem", fontWeight: 700, flexShrink: 0 }}>{initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: ".5rem", flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, fontSize: ".85rem" }}>{name}</span>
                      <span style={{ fontSize: ".68rem", color: "var(--gray-text)" }}>on</span>
                      <span style={{ fontSize: ".78rem", color: "var(--green-dark)", fontWeight: 600 }}>{rv.productName}</span>
                    </div>
                    <div style={{ display: "flex", gap: ".6rem", alignItems: "center", marginTop: ".1rem" }}>
                      <span style={{ color: "#c8a96e", fontSize: ".78rem" }}>{"★".repeat(rv.rating) + "☆".repeat(5 - rv.rating)}</span>
                      <span style={{ fontSize: ".68rem", color: "var(--gray-text)" }}>{date}</span>
                    </div>
                  </div>
                </div>
                {rv.comment && <p style={{ fontSize: ".83rem", color: "#555", lineHeight: 1.7, paddingLeft: "2.8rem" }}>{rv.comment}</p>}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

// Analytics View
function AnalyticsView() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      sellerRequest("GET", "/seller/dashboard"),
      sellerRequest("GET", "/seller/orders"),
    ])
      .then(([dashRes, ordersRes]) => {
        setStats(dashRes.data);
        setOrders(ordersRes.data?.orders || []);
      })
      .catch(err => console.error("Failed to load analytics:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: "2rem", color: "var(--gray-text)" }}>Loading analytics...</div>;

  // ── Derived chart data ──

  // 1. Orders by status — pie chart
  const statusColors = { pending: "#f59e0b", confirmed: "#3b82f6", shipped: "#8b5cf6", delivered: "#10b981", cancelled: "#ef4444" };
  const statusData = Object.entries(stats?.ordersByStatus || {}).map(([name, value]) => ({ name, value }));

  // 2. Revenue by month — bar chart (last 6 months)
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const revenueByMonth = {};
  orders.forEach(o => {
    const d = new Date(o.createdAt);
    const key = monthNames[d.getMonth()];
    revenueByMonth[key] = (revenueByMonth[key] || 0) + (o.totalPrice || 0);
  });
  const now = new Date();
  const last6 = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const key = monthNames[d.getMonth()];
    return { month: key, revenue: revenueByMonth[key] || 0 };
  });

  // 3. Orders per month — line chart
  const ordersByMonth = {};
  orders.forEach(o => {
    const d = new Date(o.createdAt);
    const key = monthNames[d.getMonth()];
    ordersByMonth[key] = (ordersByMonth[key] || 0) + 1;
  });
  const ordersLast6 = last6.map(m => ({ month: m.month, orders: ordersByMonth[m.month] || 0 }));

  // 4. Top 5 products by revenue
  const productRevenue = {};
  orders.forEach(o => {
    (o.items || []).forEach(item => {
      const name = item.name?.slice(0, 18) || "Unknown";
      productRevenue[name] = (productRevenue[name] || 0) + (item.price * item.quantity);
    });
  });
  const topProducts = Object.entries(productRevenue)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, revenue]) => ({ name, revenue }));

  const STAT_CARDS = [
    { icon: "fas fa-dollar-sign", value: `EGP ${stats?.totalRevenue?.toLocaleString() || 0}`, label: "Total Revenue", color: "#10b981" },
    { icon: "fas fa-shopping-cart", value: stats?.totalOrders || 0, label: "Total Orders", color: "#3b82f6" },
    { icon: "fas fa-box", value: stats?.totalProducts || 0, label: "Products Listed", color: "#8b5cf6" },
    { icon: "fas fa-star", value: stats?.avgRating || "0.0", label: "Avg Rating", color: "#f59e0b" },
  ];

  const PIE_COLORS = ["#f59e0b", "#3b82f6", "#8b5cf6", "#10b981", "#ef4444"];

  const cardStyle = { background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: "1.5rem", marginBottom: "1.5rem" };
  const titleStyle = { fontSize: ".8rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--gray-text)", marginBottom: "1.2rem" };

  return (
    <>
      <h2 className="page-title">Store Analytics</h2>

      {/* STAT CARDS */}
      <div className="dash-stats" style={{ marginBottom: "1.5rem" }}>
        {STAT_CARDS.map((s, i) => (
          <div className="stat-card" key={i} style={{ borderTop: `3px solid ${s.color}` }}>
            <div className="stat-icon" style={{ color: s.color }}><i className={s.icon} /></div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ROW 1 — Revenue Bar + Orders Line */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>

        {/* Revenue by Month */}
        <div style={cardStyle}>
          <div style={titleStyle}>Monthly Revenue (EGP)</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={last6} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ece6" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={v => [`EGP ${v.toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="#92A079" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by Month */}
        <div style={cardStyle}>
          <div style={titleStyle}>Orders Over Time</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={ordersLast6} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ece6" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip formatter={v => [v, "Orders"]} />
              <Line type="monotone" dataKey="orders" stroke="#1a1a18" strokeWidth={2} dot={{ fill: "#1a1a18", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ROW 2 — Status Pie + Top Products */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>

        {/* Orders by Status */}
        <div style={cardStyle}>
          <div style={titleStyle}>Orders by Status</div>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                  dataKey="value" nameKey="name" paddingAngle={3}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}>
                  {statusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--gray-text)", fontSize: ".85rem" }}>No orders yet</div>
          )}
        </div>

        {/* Top Products */}
        <div style={cardStyle}>
          <div style={titleStyle}>Top Products by Revenue</div>
          {topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topProducts} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ece6" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={90} />
                <Tooltip formatter={v => [`EGP ${v.toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="#728060" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--gray-text)", fontSize: ".85rem" }}>No sales data yet</div>
          )}
        </div>
      </div>
    </>
  );
}

// Customers View
function CustomersView() {
  return (
    <>
      <h2 className="page-title">Customers</h2>
      <div className="dash-card" style={{ padding: "2rem", textAlign: "center", color: "var(--gray-text)" }}>
        <i className="fas fa-users" style={{ fontSize: "2rem", marginBottom: "1rem", display: "block" }} />
        Customer analytics coming soon.
      </div>
    </>
  );
}

// Settings View
function SettingsView() {
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);

  return (
    <>
      <h2 className="page-title">Settings</h2>
      <div className="settings-grid">
        <div className="settings-card">
          <h3><i className="fas fa-store" /> Store Information</h3>
          <div className="settings-row">
            <span className="settings-label">Store Name</span>
            <input className="settings-input" type="text" defaultValue="My Fashion Store" />
          </div>
          <div className="settings-row">
            <span className="settings-label">Store Email</span>
            <input className="settings-input" type="email" defaultValue="store@example.com" />
          </div>
          <div className="settings-row">
            <span className="settings-label">Phone</span>
            <input className="settings-input" type="tel" defaultValue="+20 123 456 7890" />
          </div>
          <button className="settings-btn">Save Changes</button>
        </div>

        <div className="settings-card">
          <h3><i className="fas fa-bell" /> Notifications</h3>
          <div className="settings-row">
            <span className="settings-label">Push Notifications</span>
            <div className={`settings-toggle ${notifications ? "on" : ""}`} onClick={() => setNotifications(!notifications)} />
          </div>
          <div className="settings-row">
            <span className="settings-label">Email Updates</span>
            <div className={`settings-toggle ${emailUpdates ? "on" : ""}`} onClick={() => setEmailUpdates(!emailUpdates)} />
          </div>
          <div className="settings-row">
            <span className="settings-label">Order Alerts</span>
            <div className="settings-toggle on" />
          </div>
        </div>

        <div className="settings-card">
          <h3><i className="fas fa-truck" /> Shipping</h3>
          <div className="settings-row">
            <span className="settings-label">Default Shipping</span>
            <span className="settings-value">Standard (3-5 days)</span>
          </div>
          <div className="settings-row">
            <span className="settings-label">Free Shipping Above</span>
            <input className="settings-input" type="text" defaultValue="EGP 500" />
          </div>
          <button className="settings-btn">Update Shipping</button>
        </div>

        <div className="settings-card">
          <h3><i className="fas fa-credit-card" /> Payment</h3>
          <div className="settings-row">
            <span className="settings-label">Bank Account</span>
            <span className="settings-value">**** **** 4582</span>
          </div>
          <div className="settings-row">
            <span className="settings-label">Payout Schedule</span>
            <span className="settings-value">Weekly</span>
          </div>
          <div className="settings-row">
            <span className="settings-label">Commission Rate</span>
            <span className="settings-value">8%</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default function SellerDashboard({ onLogout }) {
  const [activeNav, setActiveNav] = useState("dashboard");

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const renderContent = () => {
    switch (activeNav) {
      case "dashboard":
        return <DashboardView setActiveNav={setActiveNav} />;
      case "orders":
        return <OrdersView />;
      case "products":
        return <ProductsView />;
      case "reviews":
        return <ReviewsView />;
      case "analytics":
        return <AnalyticsView />;
      case "customers":
        return <CustomersView />;
      case "settings":
        return <SettingsView />;
      default:
        return <DashboardView setActiveNav={setActiveNav} />;
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <style>{SHARED_CSS}</style>
      <div className="dashboard-page">
        <aside className="dash-sidebar">
          <div className="dash-logo">
            <i className="fas fa-store" />
            <span>Seller Hub</span>
          </div>

          <nav className="dash-nav">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`dash-nav-item${activeNav === item.id ? " active" : ""}`}
                onClick={() => setActiveNav(item.id)}
              >
                <i className={item.icon} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="dash-logout">
            <button className="dash-logout-btn" onClick={onLogout}>
              <i className="fas fa-sign-out-alt" />
              Logout
            </button>
          </div>
        </aside>

        <main className="dash-main">
          <header className="dash-header">
            <div className="dash-welcome">
              <h1>
                {activeNav === "dashboard" && "Welcome back, Seller!"}
                {activeNav === "orders" && "Manage Orders"}
                {activeNav === "products" && "Your Products"}
                {activeNav === "reviews" && "Customer Reviews"}
                {activeNav === "analytics" && "Store Analytics"}
                {activeNav === "customers" && "Your Customers"}
                {activeNav === "settings" && "Store Settings"}
              </h1>
              <p>
                {activeNav === "dashboard" && "Here is what is happening with your store today."}
                {activeNav === "orders" && "View and manage all your orders."}
                {activeNav === "products" && "Add, edit, and manage your product listings."}
                {activeNav === "reviews" && "See what customers are saying about your products."}
                {activeNav === "analytics" && "Track your store performance and growth."}
                {activeNav === "customers" && "View your customer base and their activity."}
                {activeNav === "settings" && "Configure your store preferences."}
              </p>
            </div>
            <div className="dash-date">
              <i className="far fa-calendar" style={{ marginRight: 8 }} />
              {today}
            </div>
          </header>

          {renderContent()}
        </main>
      </div>
    </>
  );
}