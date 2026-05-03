export type Category = "Beverages" | "Groceries" | "Bakery" | "Dairy" | "Snacks" | "Alcohol";

export type Product = {
  id: string;
  name: string;
  sku: string;
  category: Category;
  price: number;
  cost: number;
  stock: number;
  lowStockAt: number;
  emoji: string;
};

export const products: Product[] = [
  { id: "p1", name: "Espresso Roast 250g", sku: "BEV-001", category: "Beverages", price: 12.5, cost: 6, stock: 48, lowStockAt: 10, emoji: "☕" },
  { id: "p2", name: "Cold Brew Bottle", sku: "BEV-002", category: "Beverages", price: 4.5, cost: 1.8, stock: 7, lowStockAt: 12, emoji: "🧋" },
  { id: "p3", name: "Sourdough Loaf", sku: "BAK-001", category: "Bakery", price: 6.0, cost: 2.2, stock: 22, lowStockAt: 8, emoji: "🍞" },
  { id: "p4", name: "Croissant", sku: "BAK-002", category: "Bakery", price: 3.25, cost: 1.0, stock: 35, lowStockAt: 10, emoji: "🥐" },
  { id: "p5", name: "Whole Milk 1L", sku: "DAI-001", category: "Dairy", price: 2.8, cost: 1.2, stock: 60, lowStockAt: 20, emoji: "🥛" },
  { id: "p6", name: "Greek Yogurt", sku: "DAI-002", category: "Dairy", price: 3.5, cost: 1.4, stock: 18, lowStockAt: 15, emoji: "🍶" },
  { id: "p7", name: "Dark Chocolate Bar", sku: "SNK-001", category: "Snacks", price: 4.0, cost: 1.6, stock: 80, lowStockAt: 20, emoji: "🍫" },
  { id: "p8", name: "Sea Salt Chips", sku: "SNK-002", category: "Snacks", price: 3.2, cost: 1.1, stock: 4, lowStockAt: 15, emoji: "🥔" },
  { id: "p9", name: "Organic Bananas", sku: "GRC-001", category: "Groceries", price: 1.9, cost: 0.7, stock: 120, lowStockAt: 30, emoji: "🍌" },
  { id: "p10", name: "Avocado", sku: "GRC-002", category: "Groceries", price: 2.2, cost: 0.9, stock: 45, lowStockAt: 20, emoji: "🥑" },
  { id: "p11", name: "Craft IPA 330ml", sku: "ALC-001", category: "Alcohol", price: 5.5, cost: 2.4, stock: 32, lowStockAt: 12, emoji: "🍺" },
  { id: "p12", name: "Red Wine 750ml", sku: "ALC-002", category: "Alcohol", price: 18.0, cost: 8.5, stock: 14, lowStockAt: 6, emoji: "🍷" },
];

export const categories: Category[] = ["Beverages", "Groceries", "Bakery", "Dairy", "Snacks", "Alcohol"];

export type SalesPoint = { label: string; revenue: number; orders: number };

export const weeklySales: SalesPoint[] = [
  { label: "Mon", revenue: 1240, orders: 84 },
  { label: "Tue", revenue: 1580, orders: 102 },
  { label: "Wed", revenue: 1320, orders: 91 },
  { label: "Thu", revenue: 1890, orders: 124 },
  { label: "Fri", revenue: 2640, orders: 178 },
  { label: "Sat", revenue: 3120, orders: 211 },
  { label: "Sun", revenue: 2380, orders: 162 },
];

export const recentTransactions = [
  { id: "TX-10293", time: "12:48", items: 4, total: 28.40, method: "Card", cashier: "Amelia" },
  { id: "TX-10292", time: "12:41", items: 2, total: 9.25, method: "Cash", cashier: "Noah" },
  { id: "TX-10291", time: "12:36", items: 7, total: 54.10, method: "Mobile", cashier: "Amelia" },
  { id: "TX-10290", time: "12:29", items: 1, total: 4.50, method: "Card", cashier: "Liam" },
  { id: "TX-10289", time: "12:22", items: 3, total: 16.70, method: "Cash", cashier: "Noah" },
];

export const outlets = [
  { id: "o1", name: "Downtown Flagship", revenue: 18420, orders: 412, status: "Open" },
  { id: "o2", name: "Harbor Market", revenue: 9120, orders: 218, status: "Open" },
  { id: "o3", name: "Airport Kiosk", revenue: 5340, orders: 167, status: "Open" },
  { id: "o4", name: "University Cafe", revenue: 7820, orders: 289, status: "Closed" },
];
