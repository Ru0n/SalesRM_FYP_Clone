import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchDCRSummaryReport } from '../../store/slices/reportingSlice';
import ReportFilters from '../../components/reports/ReportFilters';
import ReportTable from '../../components/reports/ReportTable';
import ReportSummaryCard from '../../components/reports/ReportSummaryCard';
import ReportPagination from '../../components/reports/ReportPagination';
import { Button } from '../../components/ui/button';
import { FaChartBar, FaBuilding, FaBriefcase, FaCalendarAlt, FaUserMd, FaPrescriptionBottleAlt } from 'react-icons/fa';

const DCRSummaryReportPage = () => {
  const dispatch = useDispatch();
  const { dcrSummary, filters } = useSelector((state) => state.reporting);
  const [showDetailed, setShowDetailed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Fetch report data with initial filters
    dispatch(fetchDCRSummaryReport({
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
    dispatch(fetchDCRSummaryReport({
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
    { field: 'date', header: 'Date', sortable: true },
    { field: 'user', header: 'User', sortable: true },
    { field: 'work_type', header: 'Work Type', sortable: true },
    { field: 'doctors_count', header: 'Doctors Visited', sortable: true },
    { field: 'chemists_count', header: 'Chemists Visited', sortable: true },
    {
      field: 'id',
      header: 'Actions',
      sortable: false,
      render: (value) => (
        <Link
          to={`/dcr/${value}`}
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
          <FaChartBar className="mr-2 text-blue-600" />
          DCR Summary Report
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
        reportType="dcr"
        onFilterChange={handleFilterChange}
      />

      {dcrSummary.data && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <ReportSummaryCard
              title="Total DCRs"
              value={dcrSummary.data.total_dcrs}
              icon={<FaChartBar />}
              color="blue"
            />
            <ReportSummaryCard
              title="Field Work"
              value={dcrSummary.data.field_work_count}
              icon={<FaBuilding />}
              color="green"
            />
            <ReportSummaryCard
              title="Office Work"
              value={dcrSummary.data.office_work_count}
              icon={<FaBriefcase />}
              color="indigo"
            />
            <ReportSummaryCard
              title="Leave/Holiday"
              value={dcrSummary.data.leave_count + dcrSummary.data.holiday_count}
              icon={<FaCalendarAlt />}
              color="yellow"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <ReportSummaryCard
              title="Total Doctors Visited"
              value={dcrSummary.data.total_doctors_visited}
              icon={<FaUserMd />}
              color="purple"
            />
            <ReportSummaryCard
              title="Total Chemists Visited"
              value={dcrSummary.data.total_chemists_visited}
              icon={<FaPrescriptionBottleAlt />}
              color="pink"
            />
          </div>
        </div>
      )}

      {showDetailed && dcrSummary.data?.dcrs && (
        <>
          <ReportTable
            data={dcrSummary.data.dcrs}
            columns={columns}
            title="DCR Details"
            loading={dcrSummary.loading}
            error={dcrSummary.error}
          />

          {dcrSummary.data.pagination && (
            <ReportPagination
              currentPage={currentPage}
              totalPages={Math.ceil(dcrSummary.data.pagination.count / itemsPerPage)}
              onPageChange={handlePageChange}
              disabled={dcrSummary.loading}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DCRSummaryReportPage;
