import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchLeaveSummaryReport } from '../../store/slices/reportingSlice';
import { fetchLeaveTypes } from '../../store/slices/leaveSlice';
import ReportFilters from '../../components/reports/ReportFilters';
import ReportTable from '../../components/reports/ReportTable';
import ReportSummaryCard from '../../components/reports/ReportSummaryCard';
import ReportPagination from '../../components/reports/ReportPagination';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import {
  FaChartBar,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaBan
} from 'react-icons/fa';

const LeaveSummaryReportPage = () => {
  const dispatch = useDispatch();
  const { leaveSummary, filters } = useSelector((state) => state.reporting);
  const { leaveTypes } = useSelector((state) => state.leave);
  const [showDetailed, setShowDetailed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Fetch leave types for filters
    dispatch(fetchLeaveTypes());

    // Fetch report data with initial filters
    dispatch(fetchLeaveSummaryReport({
      ...filters,
      detailed: showDetailed,
      page: currentPage,
      page_size: itemsPerPage
    }));
  }, [dispatch, showDetailed, currentPage]);

  const handleFilterChange = (newFilters) => {
    // Reset to first page when filters change
    setCurrentPage(1);
    // Fetch report data with new filters
    dispatch(fetchLeaveSummaryReport({
      ...newFilters,
      detailed: showDetailed,
      page: 1,
      page_size: itemsPerPage
    }));
  };

  const handleToggleDetailed = () => {
    setShowDetailed(!showDetailed);
    // Reset to first page when toggling detailed view
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Define columns for the detailed table
  const columns = [
    { field: 'start_date', header: 'Start Date', sortable: true },
    { field: 'end_date', header: 'End Date', sortable: true },
    { field: 'days', header: 'Days', sortable: true },
    { field: 'user', header: 'User', sortable: true },
    { field: 'leave_type', header: 'Leave Type', sortable: true },
    { field: 'status', header: 'Status', sortable: true },
    {
      field: 'id',
      header: 'Actions',
      sortable: false,
      render: (value) => (
        <Link
          to={`/leave/${value}`}
          className="text-primary-color hover:text-primary-color-dark"
        >
          View
        </Link>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold flex items-center">
          <FaCalendarAlt className="mr-2 text-purple-600" />
          Leave Summary Report
        </h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            asChild
          >
            <Link to="/reports">
              Back to Reports
            </Link>
          </Button>
          <Button
            onClick={handleToggleDetailed}
          >
            {showDetailed ? 'Hide Details' : 'Show Details'}
          </Button>
        </div>
      </div>

      <ReportFilters
        reportType="leave"
        onFilterChange={handleFilterChange}
        leaveTypes={leaveTypes}
      />

      {leaveSummary.data && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <ReportSummaryCard
              title="Total Leave Requests"
              value={leaveSummary.data.total_leaves}
              icon={<FaChartBar />}
              color="blue"
            />
            <ReportSummaryCard
              title="Total Days"
              value={leaveSummary.data.total_days}
              icon={<FaCalendarAlt />}
              color="indigo"
            />
            <ReportSummaryCard
              title="Pending"
              value={leaveSummary.data.pending_count}
              icon={<FaClock />}
              color="yellow"
            />
            <ReportSummaryCard
              title="Approved"
              value={leaveSummary.data.approved_count}
              icon={<FaCheckCircle />}
              color="green"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
            <ReportSummaryCard
              title="Rejected"
              value={leaveSummary.data.rejected_count}
              icon={<FaTimesCircle />}
              color="red"
            />
            <ReportSummaryCard
              title="Cancelled"
              value={leaveSummary.data.cancelled_count}
              icon={<FaBan />}
              color="gray"
            />
          </div>

          {/* Leave by Type */}
          {Object.keys(leaveSummary.data.leave_by_type).length > 0 && (
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle>Leave by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(leaveSummary.data.leave_by_type).map(([type, count]) => (
                    <Card key={type} className="bg-muted/30">
                      <CardContent className="p-3">
                        <p className="text-sm font-medium text-muted-foreground">{type}</p>
                        <p className="text-lg font-semibold">{count} requests</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {showDetailed && leaveSummary.data?.leaves && (
        <>
          <ReportTable
            data={leaveSummary.data.leaves}
            columns={columns}
            title="Leave Details"
            loading={leaveSummary.loading}
            error={leaveSummary.error}
          />

          {leaveSummary.data.pagination && (
            <ReportPagination
              currentPage={currentPage}
              totalPages={Math.ceil(leaveSummary.data.pagination.count / itemsPerPage)}
              onPageChange={handlePageChange}
              disabled={leaveSummary.loading}
            />
          )}
        </>
      )}
    </div>
  );
};

export default LeaveSummaryReportPage;
