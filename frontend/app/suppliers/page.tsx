import Link from 'next/link';
import { Plus, Search, Phone, Mail, MapPin, Edit, Trash2, Eye } from 'lucide-react';

export default function SuppliersPage() {
  const suppliers = [
    {
      supplier_id: 1,
      name: 'Textile Suppliers Inc.',
      contact_person: 'John Smith',
      phone: '+91 98765 43210',
      email: 'john@textilesuppliers.com',
      city: 'Mumbai',
      state: 'Maharashtra',
      status: 'active',
    },
    {
      supplier_id: 2,
      name: 'Fashion Wholesale',
      contact_person: 'Sarah Johnson',
      phone: '+91 98765 43211',
      email: 'sarah@fashionwholesale.com',
      city: 'Delhi',
      state: 'Delhi',
      status: 'active',
    },
    {
      supplier_id: 3,
      name: 'Style Mart',
      contact_person: 'Raj Kumar',
      phone: '+91 98765 43212',
      email: 'raj@stylemart.com',
      city: 'Bangalore',
      state: 'Karnataka',
      status: 'inactive',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Suppliers</h1>
          <p className="mt-2 text-gray-600">Manage your suppliers and vendors</p>
        </div>
        <Link
          href="/suppliers/new"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Supplier
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search suppliers..."
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <select className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm">
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {suppliers.map((supplier) => (
          <div
            key={supplier.supplier_id}
            className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{supplier.contact_person}</p>
              </div>
              <span
                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                  supplier.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {supplier.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{supplier.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{supplier.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>
                  {supplier.city}, {supplier.state}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
              <button className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Eye className="h-4 w-4" />
                View
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Edit className="h-4 w-4" />
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}




