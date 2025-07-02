import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Leave pages
import LeaveListPage from './pages/leave/LeaveListPage';
import LeaveFormPage from './pages/leave/LeaveFormPage';
import LeaveDetailPage from './pages/leave/LeaveDetailPage';

// Expense pages
import ExpenseListPage from './pages/expense/ExpenseListPage';
import ExpenseFormPage from './pages/expense/ExpenseFormPage';
import ExpenseDetailPage from './pages/expense/ExpenseDetailPage';

// Contact pages
import DoctorsPage from './pages/contact/DoctorsPage';
import DoctorFormPage from './pages/contact/DoctorFormPage';
import ChemistsPage from './pages/contact/ChemistsPage';
import ChemistFormPage from './pages/contact/ChemistFormPage';

// DCR pages
import DailyCallReportsPage from './pages/dcr/DailyCallReportsPage';
import DailyCallReportFormPage from './pages/dcr/DailyCallReportFormPage';
import DailyCallReportDetailPage from './pages/dcr/DailyCallReportDetailPage';

// Tour Program pages
import TourProgramListPage from './pages/tours/TourProgramListPage';
import TourProgramFormPage from './pages/tours/TourProgramFormPage';
import TourProgramDetailPage from './pages/tours/TourProgramDetailPage';

// Report pages
import ReportsLandingPage from './pages/reports/ReportsLandingPage';
import DCRSummaryReportPage from './pages/reports/DCRSummaryReportPage';
import ExpenseSummaryReportPage from './pages/reports/ExpenseSummaryReportPage';
import LeaveSummaryReportPage from './pages/reports/LeaveSummaryReportPage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Leave routes */}
            <Route
              path="/leave"
              element={
                <ProtectedRoute>
                  <LeaveListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leave/new"
              element={
                <ProtectedRoute>
                  <LeaveFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leave/:id"
              element={
                <ProtectedRoute>
                  <LeaveDetailPage />
                </ProtectedRoute>
              }
            />

            {/* Expense routes */}
            <Route
              path="/expense"
              element={
                <ProtectedRoute>
                  <ExpenseListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expense/new"
              element={
                <ProtectedRoute>
                  <ExpenseFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expense/:id"
              element={
                <ProtectedRoute>
                  <ExpenseDetailPage />
                </ProtectedRoute>
              }
            />

            {/* Contact routes */}
            <Route
              path="/contact/doctors"
              element={
                <ProtectedRoute>
                  <DoctorsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact/doctor/new"
              element={
                <ProtectedRoute>
                  <DoctorFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact/doctor/:id"
              element={
                <ProtectedRoute>
                  <DoctorFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact/doctor/:id/edit"
              element={
                <ProtectedRoute>
                  <DoctorFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact/chemists"
              element={
                <ProtectedRoute>
                  <ChemistsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact/chemist/new"
              element={
                <ProtectedRoute>
                  <ChemistFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact/chemist/:id"
              element={
                <ProtectedRoute>
                  <ChemistFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact/chemist/:id/edit"
              element={
                <ProtectedRoute>
                  <ChemistFormPage />
                </ProtectedRoute>
              }
            />

            {/* DCR routes */}
            <Route
              path="/dcr"
              element={
                <ProtectedRoute>
                  <DailyCallReportsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dcr/new"
              element={
                <ProtectedRoute>
                  <DailyCallReportFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dcr/:id"
              element={
                <ProtectedRoute>
                  <DailyCallReportDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dcr/:id/edit"
              element={
                <ProtectedRoute>
                  <DailyCallReportFormPage />
                </ProtectedRoute>
              }
            />

            {/* Tour Program routes */}
            <Route
              path="/tours"
              element={
                <ProtectedRoute>
                  <TourProgramListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tours/new"
              element={
                <ProtectedRoute>
                  <TourProgramFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tours/:id"
              element={
                <ProtectedRoute>
                  <TourProgramDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tours/:id/edit"
              element={
                <ProtectedRoute>
                  <TourProgramFormPage />
                </ProtectedRoute>
              }
            />

            {/* Report routes */}
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <ReportsLandingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/dcr-summary"
              element={
                <ProtectedRoute>
                  <DCRSummaryReportPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/expense-summary"
              element={
                <ProtectedRoute>
                  <ExpenseSummaryReportPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/leave-summary"
              element={
                <ProtectedRoute>
                  <LeaveSummaryReportPage />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;