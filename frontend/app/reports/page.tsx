import { BarChart3, TrendingUp, Package, DollarSign, ShoppingCart } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="mt-2 text-gray-600">View detailed reports and analytics</p>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-100 p-3">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sales Report</h3>
              <p className="text-sm text-gray-600">View sales by date, product, category</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-green-100 p-3">
              <ShoppingCart className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Purchase Report</h3>
              <p className="text-sm text-gray-600">Supplier-wise purchase analysis</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-purple-100 p-3">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Stock Report</h3>
              <p className="text-sm text-gray-600">Current stock levels and valuation</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-yellow-100 p-3">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Fast/Slow Moving</h3>
              <p className="text-sm text-gray-600">Identify top and slow selling items</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-red-100 p-3">
              <BarChart3 className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Stock Valuation</h3>
              <p className="text-sm text-gray-600">Total inventory value calculation</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-indigo-100 p-3">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
              <p className="text-sm text-gray-600">Monthly and yearly sales trends</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales Overview</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Today's Sales</span>
              <span className="text-lg font-semibold text-gray-900">₹12,450</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">This Week</span>
              <span className="text-lg font-semibold text-gray-900">₹87,650</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">This Month</span>
              <span className="text-lg font-semibold text-gray-900">₹3,45,680</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">This Year</span>
              <span className="text-lg font-semibold text-gray-900">₹42,56,890</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-gray-200"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Product {item}</p>
                    <p className="text-xs text-gray-500">{100 + item * 10} units sold</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  ₹{(5000 + item * 500).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}




