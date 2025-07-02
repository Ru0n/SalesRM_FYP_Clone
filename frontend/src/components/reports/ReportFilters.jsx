import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, clearFilters } from '../../store/slices/reportingSlice';
import { fetchUsers } from '../../store/slices/userSlice';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { FaCalendarAlt, FaFilter } from 'react-icons/fa';

const ReportFilters = ({ reportType, onFilterChange, expenseTypes = [], leaveTypes = [] }) => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.reporting);
  const { user } = useSelector((state) => state.auth);
  const { users, loading: loadingUsers } = useSelector((state) => state.user);

  const [localFilters, setLocalFilters] = useState({
    user_id: 'all',
    start_date: '',
    end_date: '',
    work_type: 'all',
    status: 'all',
    expense_type: 'all',
    leave_type: 'all',
  });

  useEffect(() => {
    // Initialize local filters from Redux state
    setLocalFilters({
      user_id: filters.user_id || 'all',
      start_date: filters.start_date || '',
      end_date: filters.end_date || '',
      work_type: filters.work_type || 'all',
      status: filters.status || 'all',
      expense_type: filters.expense_type || 'all',
      leave_type: filters.leave_type || 'all',
    });
  }, [filters]);

  // Fetch users for the filter dropdown (only for managers and admins)
  useEffect(() => {
    if (user.role === 'manager' || user.is_staff) {
      dispatch(fetchUsers());
    }
  }, [dispatch, user.role, user.is_staff]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
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
    setLocalFilters({
      user_id: 'all',
      start_date: '',
      end_date: '',
      work_type: 'all',
      status: 'all',
      expense_type: 'all',
      leave_type: 'all',
    });

    dispatch(clearFilters());

    if (onFilterChange) {
      onFilterChange({});
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <FaFilter className="mr-2 h-4 w-4 text-muted-foreground" />
          Filters
        </CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Date Range Filters (common to all report types) */}
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
                />
                <FaCalendarAlt className="absolute right-3 top-3 text-muted-foreground" />
              </div>
            </div>

            {/* User Filter (only for managers and admins) */}
            {(user.role === 'manager' || user.is_staff) && (
              <div className="space-y-2">
                <Label htmlFor="user_id">User</Label>
                <Select
                  value={localFilters.user_id}
                  onValueChange={(value) =>
                    handleFilterChange({ target: { name: 'user_id', value } })
                  }
                  disabled={loadingUsers}
                >
                  <SelectTrigger id="user_id" className="w-full">
                    <SelectValue placeholder="All Users" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    {users.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.first_name && u.last_name
                          ? `${u.first_name} ${u.last_name} (${u.role})`
                          : `${u.email} (${u.role})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {loadingUsers && (
                  <p className="text-sm text-muted-foreground mt-1">Loading users...</p>
                )}
              </div>
            )}

          {/* Report-specific filters */}
          {reportType === 'dcr' && (
            <div className="space-y-2">
              <Label htmlFor="work_type">Work Type</Label>
              <Select
                value={localFilters.work_type}
                onValueChange={(value) =>
                  handleFilterChange({ target: { name: 'work_type', value } })
                }
              >
                <SelectTrigger id="work_type" className="w-full">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="field_work">Field Work</SelectItem>
                  <SelectItem value="office_work">Office Work</SelectItem>
                  <SelectItem value="leave">Leave</SelectItem>
                  <SelectItem value="holiday">Holiday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {reportType === 'expense' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={localFilters.status}
                  onValueChange={(value) =>
                    handleFilterChange({ target: { name: 'status', value } })
                  }
                >
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="queried">Queried</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expense_type">Expense Type</Label>
                <Select
                  value={localFilters.expense_type}
                  onValueChange={(value) =>
                    handleFilterChange({ target: { name: 'expense_type', value } })
                  }
                >
                  <SelectTrigger id="expense_type" className="w-full">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {expenseTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {reportType === 'leave' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={localFilters.status}
                  onValueChange={(value) =>
                    handleFilterChange({ target: { name: 'status', value } })
                  }
                >
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="leave_type">Leave Type</Label>
                <Select
                  value={localFilters.leave_type}
                  onValueChange={(value) =>
                    handleFilterChange({ target: { name: 'leave_type', value } })
                  }
                >
                  <SelectTrigger id="leave_type" className="w-full">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {leaveTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            type="submit"
          >
            Apply Filters
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ReportFilters;
