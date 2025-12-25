import StatsCard from '@/components/Cards/StatsCard';
import {
  Package,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  AlertCircle,
  Box,
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Overview of your inventory system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Products"
          value="1,234"
          icon={Package}
          trend={{ value: 12, isPositive: true }}
          color="blue"
        />
        <StatsCard
          title="Total Sales"
          value="₹2,45,680"
          icon={DollarSign}
          trend={{ value: 8, isPositive: true }}
          color="green"
        />
        <StatsCard
          title="Pending Orders"
          value="23"
          icon={ShoppingCart}
          trend={{ value: 5, isPositive: false }}
          color="yellow"
        />
        <StatsCard
          title="Low Stock Items"
          value="15"
          icon={AlertCircle}
          trend={{ value: 3, isPositive: false }}
          color="red"
        />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Sales */}
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Sales</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">Invoice #INV-2024-001{item}</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">₹{1500 + item * 100}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Alerts</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-gray-200"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Product Name {item}</p>
                    <p className="text-xs text-gray-500">Stock: {item} units</p>
                  </div>
                </div>
                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                  Low
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <button className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
            <Package className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Add Product</span>
          </button>
          <button className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
            <ShoppingCart className="h-6 w-6 text-green-600" />
            <span className="text-sm font-medium text-gray-700">New Sale</span>
          </button>
          <button className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
            <Box className="h-6 w-6 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Purchase Order</span>
          </button>
          <button className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
            <TrendingUp className="h-6 w-6 text-yellow-600" />
            <span className="text-sm font-medium text-gray-700">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
}




