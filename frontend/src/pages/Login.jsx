import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, clearError } from '../store/slices/authSlice';
import { isAuthenticated } from '../services/auth';
import { FaSpinner } from 'react-icons/fa';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated: isAuthenticatedRedux } = useSelector((state) => state.auth);

  // Check if user is already authenticated
  useEffect(() => {
    // If authenticated, redirect to dashboard
    if (isAuthenticatedRedux || isAuthenticated()) {
      navigate('/dashboard');
    }

    // Clear any previous errors when component mounts
    dispatch(clearError());
  }, [isAuthenticatedRedux, navigate, dispatch]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(login({ email, password })).unwrap();
      navigate('/dashboard');
    } catch (err) {
      // Error is handled in the auth slice
      console.error('Login failed:', err);
    }
  };

  // Format error message
  const getErrorMessage = () => {
    if (!error) return null;

    if (error.detail) return error.detail;
    if (error.message) return error.message;
    if (error.non_field_errors) return error.non_field_errors[0];

    // If error is an object with multiple field errors
    if (typeof error === 'object' && !Array.isArray(error)) {
      const firstErrorKey = Object.keys(error)[0];
      if (firstErrorKey && error[firstErrorKey]) {
        return `${firstErrorKey}: ${Array.isArray(error[firstErrorKey]) ? error[firstErrorKey][0] : error[firstErrorKey]}`;
      }
    }

    return 'Invalid credentials';
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <div className="bg-blue-600 text-white p-2 rounded-md text-xl font-bold">
              SR
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Login to SFA Platform
          </CardTitle>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="p-3 text-sm rounded-md bg-red-50 text-red-600 mb-4">
              {getErrorMessage()}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                disabled={loading}
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="••••••••••"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;