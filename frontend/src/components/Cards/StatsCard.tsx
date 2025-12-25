import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red';
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'blue',
}: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 dark:from-blue-900/20 dark:to-blue-800/20 dark:text-blue-400',
    green: 'bg-gradient-to-br from-green-50 to-green-100 text-green-600 dark:from-green-900/20 dark:to-green-800/20 dark:text-green-400',
    yellow: 'bg-gradient-to-br from-yellow-50 to-yellow-100 text-yellow-600 dark:from-yellow-900/20 dark:to-yellow-800/20 dark:text-yellow-400',
    purple: 'bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 dark:from-purple-900/20 dark:to-purple-800/20 dark:text-purple-400',
    red: 'bg-gradient-to-br from-red-50 to-red-100 text-red-600 dark:from-red-900/20 dark:to-red-800/20 dark:text-red-400',
  };

  return (
    <div className="card group hover:shadow-lg transition-all duration-300 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {trend && (
            <p
              className={`mt-2 text-sm font-medium flex items-center gap-1 ${
                trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}
            >
              <span className={trend.isPositive ? '↑' : '↓'}>{trend.isPositive ? '↑' : '↓'}</span>
              {Math.abs(trend.value)}% from last month
            </p>
          )}
        </div>
        <div className={`rounded-xl p-4 transition-transform duration-300 group-hover:scale-110 ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
