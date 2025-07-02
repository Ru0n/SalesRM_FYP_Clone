import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchTopPerformers } from '../../store/slices/analyticsSlice';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { 
  FaTrophy, 
  FaMedal, 
  FaAward, 
  FaChartLine,
  FaArrowRight,
  FaSpinner
} from 'react-icons/fa';

const TopPerformersWidget = ({ limit = 3, days = 30 }) => {
  const dispatch = useDispatch();
  const { topPerformers } = useSelector((state) => state.analytics);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Only fetch if user is manager or admin
    if (user.role === 'manager' || user.is_staff) {
      dispatch(fetchTopPerformers({ limit, days }));
    }
  }, [dispatch, limit, days, user.role, user.is_staff]);

  // Don't render for MRs
  if (user.role !== 'manager' && !user.is_staff) {
    return null;
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

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <FaTrophy className="mr-2 h-5 w-5 text-yellow-500" />
            Top Performers
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/reports/performance" className="flex items-center text-sm">
              View All
              <FaArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Last {days} days performance
        </p>
      </CardHeader>

      <CardContent>
        {topPerformers.loading && (
          <div className="flex items-center justify-center py-8">
            <FaSpinner className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading...</span>
          </div>
        )}

        {topPerformers.error && (
          <div className="text-center py-8">
            <div className="text-red-600 text-sm">
              <p className="font-medium">Error loading top performers</p>
              <p className="text-muted-foreground mt-1">
                {typeof topPerformers.error === 'string' 
                  ? topPerformers.error 
                  : 'An unexpected error occurred'
                }
              </p>
            </div>
          </div>
        )}

        {!topPerformers.loading && !topPerformers.error && topPerformers.data.length === 0 && (
          <div className="text-center py-8">
            <FaChartLine className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground font-medium">No performance data available</p>
            <p className="text-sm text-muted-foreground mt-1">
              Check back once team members have submitted their activities
            </p>
          </div>
        )}

        {!topPerformers.loading && !topPerformers.error && topPerformers.data.length > 0 && (
          <div className="space-y-4">
            {topPerformers.data.map((performer) => (
              <div 
                key={performer.user.id} 
                className="flex items-center space-x-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(performer.rank)}
                </div>
                
                <Avatar className="h-10 w-10">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {performer.user.first_name?.[0]}{performer.user.last_name?.[0]}
                    </span>
                  </div>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {performer.user.first_name} {performer.user.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {performer.user.email}
                  </p>
                </div>

                <Badge className={`${getScoreColor(performer.performance_score)} text-xs`}>
                  {performer.performance_score.toFixed(1)}%
                </Badge>
              </div>
            ))}

            {topPerformers.data.length > 0 && (
              <div className="pt-2 border-t">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/reports/performance" className="flex items-center justify-center">
                    <FaChartLine className="mr-2 h-4 w-4" />
                    View Detailed Analytics
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopPerformersWidget;
