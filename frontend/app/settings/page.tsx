import { Settings, User, Database, Bell, Shield, Palette } from 'lucide-react';

export default function SettingsPage() {
  const settingsCategories = [
    {
      icon: User,
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      color: 'blue',
    },
    {
      icon: Database,
      title: 'Database Settings',
      description: 'Configure database connections and backups',
      color: 'green',
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Set up alerts and notifications',
      color: 'yellow',
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Security settings and access control',
      color: 'red',
    },
    {
      icon: Palette,
      title: 'Appearance',
      description: 'Customize theme and display settings',
      color: 'purple',
    },
    {
      icon: Settings,
      title: 'General',
      description: 'General application settings',
      color: 'gray',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
    gray: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">Manage your application settings</p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {settingsCategories.map((category) => {
          const Icon = category.icon;
          return (
            <div
              key={category.title}
              className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className={`rounded-full p-3 ${colorClasses[category.color as keyof typeof colorClasses]}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{category.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* System Info */}
      <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-600">Application Version</p>
            <p className="mt-1 text-sm font-medium text-gray-900">1.0.0</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Database Version</p>
            <p className="mt-1 text-sm font-medium text-gray-900">PostgreSQL 16.11</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Last Backup</p>
            <p className="mt-1 text-sm font-medium text-gray-900">2024-12-22 10:30 AM</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">System Status</p>
            <p className="mt-1 text-sm font-medium text-green-600">All Systems Operational</p>
          </div>
        </div>
      </div>
    </div>
  );
}




