import Link from 'next/link';
import { Plus, Search, Filter, Receipt, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function SalesPage() {
  const sales = [
    {
      sale_id: 1,
      invoice_number: 'INV-2024-001',
      customer: 'Walk-in Customer',
      sale_date: '2024-12-22',
      total_amount: 3450,
      payment_status: 'paid',
      items_count: 3,
    },
    {
      sale_id: 2,
      invoice_number: 'INV-2024-002',
      customer: 'John Doe',
      sale_date: '2024-12-22',
      total_amount: 5600,
      payment_status: 'partial',
      items_count: 5,
    },
    {
      sale_id: 3,
      invoice_number: 'INV-2024-003',
      customer: 'Walk-in Customer',
      sale_date: '2024-12-21',
      total_amount: 8900,
      payment_status: 'paid',
      items_count: 7,
    },
  ];

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'partial':
        return <Clock className="h-4 w-4" />;
      case 'unpaid':
        return <XCircle className="h-4 w-4" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'unpaid':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales</h1>
          <p className="mt-2 text-gray-600">Manage sales and invoices</p>
        </div>
        <Link
          href="/sales/new"
          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Sale
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-600">Today's Sales</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">₹12,450</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-600">Today's Orders</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">23</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-600">Paid</p>
          <p className="mt-2 text-3xl font-bold text-green-600">18</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-600">Pending</p>
          <p className="mt-2 text-3xl font-bold text-yellow-600">5</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search invoices..."
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Sales Table */}
      <div className="rounded-lg bg-white shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  Invoice #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  Payment Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.map((sale) => (
                <tr key={sale.sale_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {sale.invoice_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {sale.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(sale.sale_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {sale.items_count} items
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{sale.total_amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${getPaymentStatusColor(
                        sale.payment_status,
                      )}`}
                    >
                      {getPaymentStatusIcon(sale.payment_status)}
                      {sale.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/sales/${sale.sale_id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Receipt className="h-4 w-4" />
                      </button>
                    </div>
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




