import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchDailyCallReports, deleteDailyCallReport } from '../../store/slices/dcrSlice';
import { FaEdit, FaEye, FaTrash, FaPlus } from 'react-icons/fa';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '../ui/table';

const DailyCallReportList = () => {
  const dispatch = useDispatch();
  const { dailyCallReports, pagination, loading, error } = useSelector((state) => state.dcr);
  const { user } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const params = {
      page: currentPage,
    };

    if (filter !== 'all') {
      params.work_type = filter;
    }

    dispatch(fetchDailyCallReports(params));
  }, [dispatch, currentPage, filter]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (value) => {
    setFilter(value);
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this daily call report?')) {
      dispatch(deleteDailyCallReport(id));
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getWorkTypeLabel = (workType) => {
    const workTypes = {
      field_work: 'Field Work',
      office_work: 'Office Work',
      leave: 'Leave',
      holiday: 'Holiday',
    };
    return workTypes[workType] || workType;
  };

  const getWorkTypeBadgeVariant = (workType) => {
    switch (workType) {
      case 'field_work':
        return 'success';
      case 'office_work':
        return 'default';
      case 'leave':
        return 'secondary';
      case 'holiday':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Daily Call Reports</CardTitle>
          <div className="flex items-center space-x-4">
            <Select value={filter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="field_work">Field Work</SelectItem>
                <SelectItem value="office_work">Office Work</SelectItem>
                <SelectItem value="leave">Leave</SelectItem>
                <SelectItem value="holiday">Holiday</SelectItem>
              </SelectContent>
            </Select>
            <Button asChild>
              <Link to="/dcr/new">
                <FaPlus className="mr-2 h-4 w-4" />
                New Report
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error.message || 'An error occurred while fetching daily call reports.'}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : dailyCallReports.length === 0 ? (
          <div className="bg-gray-50 p-6 text-center rounded">
            <p className="text-gray-500">No daily call reports found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Work Type</TableHead>
                  <TableHead>Summary</TableHead>
                  <TableHead>Doctors</TableHead>
                  <TableHead>Chemists</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dailyCallReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{formatDate(report.date)}</TableCell>
                    <TableCell>
                      <Badge variant={getWorkTypeBadgeVariant(report.work_type)}>
                        {report.work_type_display || getWorkTypeLabel(report.work_type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {report.summary.length > 50
                        ? `${report.summary.substring(0, 50)}...`
                        : report.summary}
                    </TableCell>
                    <TableCell>{report.doctors_visited?.length || 0}</TableCell>
                    <TableCell>{report.chemists_visited?.length || 0}</TableCell>
                    <TableCell>
                      {report.user_details
                        ? `${report.user_details.first_name} ${report.user_details.last_name}`
                        : 'Unknown User'}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/dcr/${report.id}`}>
                            <FaEye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                        {(user.id === report.user || user.is_staff || user.role === 'manager') && (
                          <>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/dcr/${report.id}/edit`}>
                                <FaEdit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Link>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDelete(report.id)}
                            >
                              <FaTrash className="h-4 w-4 text-red-600" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {pagination && pagination.count > 0 && (
        <CardFooter className="flex justify-center pt-2">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.previous}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {Math.ceil(pagination.count / 10)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.next}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default DailyCallReportList;