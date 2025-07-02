import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, clearFilters } from '../../store/slices/analyticsSlice';
import { fetchUsers } from '../../store/slices/userSlice';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { FaCalendarAlt, FaFilter, FaSearch, FaUndo } from 'react-icons/fa';

const PerformanceFilters = ({ onFilterChange }) => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.analytics);
  const { user } = useSelector((state) => state.auth);
  const { users, loading: loadingUsers } = useSelector((state) => state.user);

  const [localFilters, setLocalFilters] = useState({
    user_id: 'all',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    // Initialize local filters from Redux state
    setLocalFilters({
      user_id: filters.user_id || 'all',
      start_date: filters.start_date || '',
      end_date: filters.end_date || '',
    });
  }, [filters]);

  // Fetch users for the filter dropdown (only for managers and admins)
  useEffect(() => {
    if (user.role === 'manager' || user.is_staff) {
      dispatch(fetchUsers());
    }
  }, [dispatch, user.role, user.is_staff]);

  // Set default date range (last 30 days)
  useEffect(() => {
    if (!localFilters.start_date && !localFilters.end_date) {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      
      setLocalFilters(prev => ({
        ...prev,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
      }));
    }
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters({
      ...localFilters,
      [name]: value,
    });
  };

  const handleSelectChange = (name, value) => {
    setLocalFilters({
      ...localFilters,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert 'all' values to null for backend filtering
    const processedFilters = Object.entries(localFilters).reduce((acc, [key, value]) => {
      acc[key] = (value === 'all' || value === '') ? null : value;
      return acc;
    }, {});

    dispatch(setFilters(processedFilters));

    if (onFilterChange) {
      onFilterChange(processedFilters);
    }
  };

  const handleReset = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    const resetFilters = {
      user_id: 'all',
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
    };

    setLocalFilters(resetFilters);
    dispatch(clearFilters());

    if (onFilterChange) {
      onFilterChange({
        start_date: resetFilters.start_date,
        end_date: resetFilters.end_date,
      });
    }
  };

  // Filter users to show only MRs
  const mrUsers = users.filter(u => u.role === 'mr');

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <FaFilter className="mr-2 h-4 w-4 text-muted-foreground" />
          Performance Report Filters
        </CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Date Range Filters */}
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <div className="relative">
                <Input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={localFilters.start_date}
                  onChange={handleFilterChange}
                  className="w-full pr-10"
                  required
                />
                <FaCalendarAlt className="absolute right-3 top-3 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <div className="relative">
                <Input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={localFilters.end_date}
                  onChange={handleFilterChange}
                  className="w-full pr-10"
                  required
                />
                <FaCalendarAlt className="absolute right-3 top-3 text-muted-foreground" />
              </div>
            </div>

            {/* User Filter (only for managers and admins) */}
            {(user.role === 'manager' || user.is_staff) && (
              <div className="space-y-2">
                <Label htmlFor="user_id">Medical Representative</Label>
                <Select
                  value={localFilters.user_id}
                  onValueChange={(value) => handleSelectChange('user_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select MR" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All MRs</SelectItem>
                    {mrUsers.map((u) => (
                      <SelectItem key={u.id} value={u.id.toString()}>
                        {u.first_name} {u.last_name} ({u.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="flex items-center"
          >
            <FaUndo className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button type="submit" className="flex items-center">
            <FaSearch className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PerformanceFilters;
