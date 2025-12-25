import { Package, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';

export default function StockPage() {
  // Mock data
  const stockItems = [
    {
      variant_id: 1,
      product_name: 'Men Slim Fit Shirt',
      sku: 'MSHIRT101-BLUE-M',
      color: 'Blue',
      size: 'M',
      location: 'Main Store',
      quantity_on_hand: 45,
      min_stock_level: 20,
      status: 'normal',
    },
    {
      variant_id: 2,
      product_name: 'Men Slim Fit Shirt',
      sku: 'MSHIRT101-RED-M',
      color: 'Red',
      size: 'M',
      location: 'Main Store',
      quantity_on_hand: 8,
      min_stock_level: 20,
      status: 'low',
    },
    {
      variant_id: 3,
      product_name: 'Women A-Line Skirt',
      sku: 'WSKIRT201-BLACK-L',
      color: 'Black',
      size: 'L',
      location: 'Main Store',
      quantity_on_hand: 120,
      min_stock_level: 30,
      status: 'normal',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Stock Management</h1>
        <p className="mt-2 text-gray-600">View and manage inventory stock levels</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">1,234</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
              <p className="mt-2 text-3xl font-bold text-red-600">15</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">₹12,45,680</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="rounded-lg bg-white shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Stock Levels</h2>
          <div className="flex gap-2">
            <select className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
              <option>All Locations</option>
              <option>Main Store</option>
              <option>Warehouse</option>
            </select>
            <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  Color / Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  Min Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stockItems.map((item) => (
                <tr key={item.variant_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.product_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.color} / {item.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {item.quantity_on_hand}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.min_stock_level}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.status === 'low' ? (
                      <span className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">
                        Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                        In Stock
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}




