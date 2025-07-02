import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchCurrentUser } from '../store/slices/authSlice';
import { isAuthenticated, refreshToken } from '../services/auth';

/**
 * ProtectedRoute component that checks if the user is authenticated
 * If not, redirects to the login page
 * Also attempts to fetch the current user if authenticated but user data is missing
 */
const ProtectedRoute = ({ children }) => {
  const { loading, isAuthenticated: isAuthenticatedRedux, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshFailed, setRefreshFailed] = useState(false);

  // Check authentication from both Redux state and localStorage
  // This ensures we're protected even if Redux state is reset
  const authenticated = isAuthenticatedRedux || isAuthenticated();

  useEffect(() => {
    const attemptTokenRefresh = async () => {
      // Only try to refresh if we have a token in localStorage but no user data
      if (isAuthenticated() && !user && !loading && !isRefreshing && !refreshFailed) {
        try {
          setIsRefreshing(true);
          // Try to refresh the token
          await refreshToken();
          // If successful, fetch the user data
          dispatch(fetchCurrentUser());
        } catch (error) {
          console.error('Failed to refresh token:', error);
          setRefreshFailed(true);
        } finally {
          setIsRefreshing(false);
        }
      }
    };

    // If authenticated but no user data, fetch the user data
    if (authenticated && !user && !loading && !isRefreshing) {
      dispatch(fetchCurrentUser());
    } else if (!authenticated && isAuthenticated() && !isRefreshing && !refreshFailed) {
      // If not authenticated in Redux but we have a token, try to refresh
      attemptTokenRefresh();
    }
  }, [authenticated, user, loading, dispatch, isRefreshing, refreshFailed]);

  // If still loading or refreshing, show a loading indicator
  if (loading || isRefreshing) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Check if user is authenticated
  if (!authenticated || refreshFailed) {
    // Redirect to login if not authenticated or refresh failed
    return <Navigate to="/login" />;
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute;