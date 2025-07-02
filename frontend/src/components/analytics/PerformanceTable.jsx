import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar } from '../ui/avatar';
import { 
  FaTrophy, 
  FaMedal, 
  FaAward, 
  FaChartLine, 
  FaPhone, 
  FaClipboardList, 
  FaMoneyBillWave,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

const PerformanceTable = ({ data, loading, error }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading performance data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center text-red-600">
            <p className="font-medium">Error loading performance data</p>
            <p className="text-sm text-muted-foreground mt-1">
              {typeof error === 'string' ? error : 'An unexpected error occurred'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.performances || data.performances.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center text-muted-foreground">
            <FaChartLine className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">No performance data available</p>
            <p className="text-sm mt-1">Try adjusting your filters or date range</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <FaTrophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <FaMedal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <FaAward className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-muted-foreground font-medium">#{rank}</span>;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    if (score >= 40) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const formatNumber = (value) => {
    return value.toFixed(1);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <FaChartLine className="mr-2 h-5 w-5 text-primary" />
            Performance Rankings
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center"
          >
            {showDetails ? (
              <>
                <FaEyeSlash className="mr-2 h-4 w-4" />
                Hide Details
              </>
            ) : (
              <>
                <FaEye className="mr-2 h-4 w-4" />
                Show Details
              </>
            )}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Performance period: {new Date(data.period_start).toLocaleDateString()} - {new Date(data.period_end).toLocaleDateString()}
        </p>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Medical Representative</TableHead>
                <TableHead className="text-center">Overall Score</TableHead>
                {showDetails && (
                  <>
                    <TableHead className="text-center">
                      <div className="flex items-center justify-center">
                        <FaClipboardList className="mr-1 h-4 w-4" />
                        DCR Compliance
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div className="flex items-center justify-center">
                        <FaPhone className="mr-1 h-4 w-4" />
                        Call Average
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div className="flex items-center justify-center">
                        <FaClipboardList className="mr-1 h-4 w-4" />
                        TP Submission
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div className="flex items-center justify-center">
                        <FaMoneyBillWave className="mr-1 h-4 w-4" />
                        Expense Efficiency
                      </div>
                    </TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.performances.map((performance) => (
                <TableRow key={performance.user.id} className="hover:bg-muted/50">
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      {getRankIcon(performance.rank)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {performance.user.first_name?.[0]}{performance.user.last_name?.[0]}
                          </span>
                        </div>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {performance.user.first_name} {performance.user.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {performance.user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={getScoreColor(performance.performance_score)}>
                      {formatPercentage(performance.performance_score)}
                    </Badge>
                  </TableCell>
                  {showDetails && (
                    <>
                      <TableCell className="text-center">
                        <div className="text-sm">
                          <div className="font-medium">
                            {formatPercentage(performance.kpis.dcr_compliance)}
                          </div>
                          <div className="text-muted-foreground">
                            {performance.kpis.total_dcrs}/{performance.kpis.working_days} days
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="text-sm">
                          <div className="font-medium">
                            {formatNumber(performance.kpis.call_average)}
                          </div>
                          <div className="text-muted-foreground">
                            {performance.kpis.total_doctors_visited + performance.kpis.total_chemists_visited} visits
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="text-sm">
                          <div className="font-medium">
                            {formatPercentage(performance.kpis.tp_submission)}
                          </div>
                          <div className="text-muted-foreground">
                            {performance.kpis.tp_submitted ? 'Submitted' : 'Not Submitted'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="text-sm">
                          <div className="font-medium">
                            {formatPercentage(performance.kpis.expense_efficiency)}
                          </div>
                          <div className="text-muted-foreground">
                            NPR {performance.kpis.total_expense_amount.toLocaleString()}
                          </div>
                        </div>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceTable;
