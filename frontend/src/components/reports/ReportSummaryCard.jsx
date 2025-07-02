import React from 'react';
import { Card, CardContent } from '../../components/ui/card';

const ReportSummaryCard = ({ title, value, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    purple: 'bg-purple-100 text-purple-800',
    indigo: 'bg-indigo-100 text-indigo-800',
    pink: 'bg-pink-100 text-pink-800',
    gray: 'bg-gray-100 text-gray-800',
  };

  const colorClass = colorClasses[color] || colorClasses.blue;

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center">
          {icon && (
            <div className={`p-3 rounded-full ${colorClass} mr-4 flex items-center justify-center`}>
              {icon}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-semibold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportSummaryCard;
