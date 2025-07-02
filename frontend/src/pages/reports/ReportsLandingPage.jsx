import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { FaChartBar, FaMoneyBillWave, FaCalendarAlt } from 'react-icons/fa';

const ReportsLandingPage = () => {
  const reports = [
    {
      id: 'dcr-summary',
      title: 'DCR Summary Report',
      description: 'View summary statistics for Daily Call Reports, including work types, doctor visits, and chemist visits.',
      path: '/reports/dcr-summary',
      icon: <FaChartBar className="h-6 w-6 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200',
    },
    {
      id: 'expense-summary',
      title: 'Expense Summary Report',
      description: 'View summary statistics for Expense Claims, including expense types, amounts, and approval status.',
      path: '/reports/expense-summary',
      icon: <FaMoneyBillWave className="h-6 w-6 text-green-600" />,
      color: 'bg-green-50 border-green-200',
    },
    {
      id: 'leave-summary',
      title: 'Leave Summary Report',
      description: 'View summary statistics for Leave Requests, including leave types, days, and approval status.',
      path: '/reports/leave-summary',
      icon: <FaCalendarAlt className="h-6 w-6 text-purple-600" />,
      color: 'bg-purple-50 border-purple-200',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Reports</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <Card
            key={report.id}
            className={`border overflow-hidden transition-all duration-200 hover:shadow-md ${report.color}`}
          >
            <Link to={report.path} className="block h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <div className="mr-3 p-2 rounded-full bg-white shadow-sm">
                    {report.icon}
                  </div>
                  <CardTitle>{report.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{report.description}</p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReportsLandingPage;
