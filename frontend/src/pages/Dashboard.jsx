import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCurrentUser } from '../store/slices/authSlice';
import { getDashboardData } from '../services/dashboardService';
import {
  FaTachometerAlt,
  FaUserMd,
  FaFlask,
  FaCalendarCheck,
  FaReceipt,
  FaUsers,
  FaRoute,
  FaChartBar,
  FaBoxes
} from 'react-icons/fa';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('tourProgram');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user data if not available
    if (!user) {
      dispatch(fetchCurrentUser());
    }

    // Fetch dashboard data
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardData();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, user]);

  // Show loading spinner while fetching data
  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px]">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  // Show error message if there was an error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px]">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Get user's role display name
  const getRoleDisplayName = (role) => {
    const roleMap = {
      'admin': 'Administrator',
      'manager': 'Area Sales Manager',
      'mr': 'Medical Representative'
    };
    return roleMap[role] || role;
  };

  return (
    <div className="">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
      </div>

      {dashboardData && (
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-2">{dashboardData.welcome_message}</h2>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {getRoleDisplayName(dashboardData.role)}
          </div>
        </div>
      )}

      {dashboardData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Render summary cards based on user role */}
          {dashboardData.role === 'mr' && (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <FaUserMd className="text-blue-600 text-lg" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-500">Doctors Added</h3>
                </div>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.summary_cards.doctors_added}</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <FaFlask className="text-green-600 text-lg" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-500">Chemists Added</h3>
                </div>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.summary_cards.chemists_added}</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <FaCalendarCheck className="text-purple-600 text-lg" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-500">Pending Leave Requests</h3>
                </div>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.summary_cards.pending_leave_requests}</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                    <FaReceipt className="text-yellow-600 text-lg" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-500">Pending Expense Claims</h3>
                </div>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.summary_cards.pending_expense_claims}</p>
              </div>
            </>
          )}

          {dashboardData.role === 'manager' && (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <FaUsers className="text-blue-600 text-lg" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-500">Team Members</h3>
                </div>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.summary_cards.team_members}</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <FaRoute className="text-green-600 text-lg" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-500">Pending TP Approvals</h3>
                </div>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.summary_cards.pending_tp_approvals}</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <FaCalendarCheck className="text-purple-600 text-lg" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-500">Pending Leave Approvals</h3>
                </div>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.summary_cards.pending_leave_approvals}</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                    <FaReceipt className="text-yellow-600 text-lg" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-500">Pending Expense Approvals</h3>
                </div>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.summary_cards.pending_expense_approvals}</p>
              </div>
            </>
          )}

          {dashboardData.role === 'admin' && (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <FaUsers className="text-blue-600 text-lg" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                </div>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.summary_cards.total_users}</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <FaUsers className="text-green-600 text-lg" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
                </div>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.summary_cards.active_users}</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <FaBoxes className="text-purple-600 text-lg" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
                </div>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.summary_cards.total_products}</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                    <FaReceipt className="text-yellow-600 text-lg" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-500">Pending Manager Expense Approvals</h3>
                </div>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.summary_cards.pending_manager_expense_approvals}</p>
              </div>
            </>
          )}
        </div>
      )}

      <div className="mb-8">
        <div className="flex overflow-x-auto border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'tourProgram'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('tourProgram')}
          >
            <FaRoute className="inline-block mr-2" />
            Tour Program
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'leave'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('leave')}
          >
            <FaCalendarCheck className="inline-block mr-2" />
            Leave
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'expense'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('expense')}
          >
            <FaReceipt className="inline-block mr-2" />
            Expense
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'secondarySales'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('secondarySales')}
          >
            <FaChartBar className="inline-block mr-2" />
            Secondary Sales
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'productWise'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('productWise')}
          >
            <FaBoxes className="inline-block mr-2" />
            Product Wise
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'team'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('team')}
          >
            <FaUsers className="inline-block mr-2" />
            Team
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          {activeTab === 'tourProgram' && dashboardData && (
            <>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Tour Program</h3>
              {dashboardData.tour_program ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Month</p>
                      <p className="font-medium">{dashboardData.tour_program.current_month}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Year</p>
                      <p className="font-medium">{dashboardData.tour_program.current_year}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Status</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        dashboardData.tour_program.status === 'Approved'
                          ? 'bg-green-100 text-green-800'
                          : dashboardData.tour_program.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {dashboardData.tour_program.status}
                      </span>
                    </div>
                    {dashboardData.tour_program.area_details && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Area Details</p>
                        <p className="font-medium">{dashboardData.tour_program.area_details}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Link
                      to="/tours"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FaRoute className="mr-2" />
                      Manage Tour Programs
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <FaRoute className="text-gray-400 text-xl" />
                  </div>
                  <p className="text-gray-500 mb-4">No tour program available for the current month.</p>
                  <Link
                    to="/tours/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create Tour Program
                  </Link>
                </div>
              )}
            </>
          )}

          {activeTab === 'leave' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Leave Requests</h3>
                <Link
                  to="/leave"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaCalendarCheck className="mr-2" />
                  Manage Leave Requests
                </Link>
              </div>
              <p className="text-gray-600">View your leave requests and apply for new leaves.</p>
            </>
          )}

          {activeTab === 'expense' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Expense Claims</h3>
                <Link
                  to="/expense"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaReceipt className="mr-2" />
                  Manage Expense Claims
                </Link>
              </div>
              <p className="text-gray-600">View your expense claims and submit new claims.</p>
            </>
          )}

          {activeTab === 'secondarySales' && (
            <>
              <div className="text-center py-8">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <FaChartBar className="text-gray-400 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Secondary Sales</h3>
                <p className="text-gray-500">No sales data available at this time.</p>
              </div>
            </>
          )}

          {activeTab === 'productWise' && (
            <>
              <div className="text-center py-8">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <FaBoxes className="text-gray-400 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Wise</h3>
                <p className="text-gray-500">No product data available at this time.</p>
              </div>
            </>
          )}

          {activeTab === 'team' && (
            <>
              <div className="text-center py-8">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <FaUsers className="text-gray-400 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Team</h3>
                <p className="text-gray-500">No team data available at this time.</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Upcoming Events Section */}
      {dashboardData && dashboardData.upcoming_events && dashboardData.upcoming_events.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {dashboardData.upcoming_events.map((event, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-800">{new Date(event.date).toLocaleDateString()}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    event.type === 'holiday'
                      ? 'bg-blue-100 text-blue-800'
                      : event.type === 'meeting'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </span>
                </div>
                <div className="text-gray-700">{event.title}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;