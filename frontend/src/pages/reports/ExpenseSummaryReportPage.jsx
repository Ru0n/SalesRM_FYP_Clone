import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchExpenseSummaryReport } from '../../store/slices/reportingSlice';
import { fetchExpenseTypes } from '../../store/slices/expenseSlice';
import ReportFilters from '../../components/reports/ReportFilters';
import ReportTable from '../../components/reports/ReportTable';
import ReportSummaryCard from '../../components/reports/ReportSummaryCard';
import ReportPagination from '../../components/reports/ReportPagination';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import {
  FaChartBar,
  FaMoneyBillWave,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaQuestionCircle
} from 'react-icons/fa';

const ExpenseSummaryReportPage = () => {
  const dispatch = useDispatch();
  const { expenseSummary, filters } = useSelector((state) => state.reporting);
  const { expenseTypes } = useSelector((state) => state.expense);
  const [showDetailed, setShowDetailed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Fetch expense types for filters
    dispatch(fetchExpenseTypes());

    // Fetch report data with initial filters
    dispatch(fetchExpenseSummaryReport({
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
    dispatch(fetchExpenseSummaryReport({
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

  // Format currency
  const formatCurrency = (amount) => {
    const formattedAmount = new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
    }).format(amount);
    return formattedAmount;
  };

  // Define columns for the detailed table
  const columns = [
    { field: 'date', header: 'Date', sortable: true },
    { field: 'user', header: 'User', sortable: true },
    { field: 'expense_type', header: 'Expense Type', sortable: true },
    {
      field: 'amount',
      header: 'Amount',
      sortable: true,
      render: (value) => formatCurrency(value),
    },
    { field: 'status', header: 'Status', sortable: true },
    {
      field: 'id',
      header: 'Actions',
      sortable: false,
      render: (value) => (
        <Link
          to={`/expense/${value}`}
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
          <FaMoneyBillWave className="mr-2 text-green-600" />
          Expense Summary Report
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
        reportType="expense"
        onFilterChange={handleFilterChange}
        expenseTypes={expenseTypes}
      />

      {expenseSummary.data && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <ReportSummaryCard
              title="Total Expenses"
              value={expenseSummary.data.total_expenses}
              icon={<FaChartBar />}
              color="blue"
            />
            <ReportSummaryCard
              title="Total Amount"
              value={formatCurrency(expenseSummary.data.total_amount)}
              icon={<FaMoneyBillWave />}
              color="green"
            />
            <ReportSummaryCard
              title="Pending"
              value={expenseSummary.data.pending_count}
              icon={<FaClock />}
              color="yellow"
            />
            <ReportSummaryCard
              title="Approved"
              value={expenseSummary.data.approved_count}
              icon={<FaCheckCircle />}
              color="green"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
            <ReportSummaryCard
              title="Rejected"
              value={expenseSummary.data.rejected_count}
              icon={<FaTimesCircle />}
              color="red"
            />
            <ReportSummaryCard
              title="Queried"
              value={expenseSummary.data.queried_count}
              icon={<FaQuestionCircle />}
              color="purple"
            />
          </div>

          {/* Expense by Type */}
          {Object.keys(expenseSummary.data.expense_by_type).length > 0 && (
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle>Expense by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(expenseSummary.data.expense_by_type).map(([type, amount]) => (
                    <Card key={type} className="bg-muted/30">
                      <CardContent className="p-3">
                        <p className="text-sm font-medium text-muted-foreground">{type}</p>
                        <p className="text-lg font-semibold">{formatCurrency(amount)}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {showDetailed && expenseSummary.data?.expenses && (
        <>
          <ReportTable
            data={expenseSummary.data.expenses}
            columns={columns}
            title="Expense Details"
            loading={expenseSummary.loading}
            error={expenseSummary.error}
          />

          {expenseSummary.data.pagination && (
            <ReportPagination
              currentPage={currentPage}
              totalPages={Math.ceil(expenseSummary.data.pagination.count / itemsPerPage)}
              onPageChange={handlePageChange}
              disabled={expenseSummary.loading}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ExpenseSummaryReportPage;
