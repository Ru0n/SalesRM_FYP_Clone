import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchLeaveTypes, createLeaveRequest, clearSuccess, clearError } from '../../store/slices/leaveSlice';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select';
import { FaCalendarAlt, FaSave, FaTimes } from 'react-icons/fa';

const LeaveRequestForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { leaveTypes, loading, error, success } = useSelector((state) => state.leave);
  
  const [formData, setFormData] = useState({
    leave_type: '',
    start_date: '',
    end_date: '',
    reason: '',
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  useEffect(() => {
    dispatch(fetchLeaveTypes());
    
    // Clear any previous success/error states
    dispatch(clearSuccess());
    dispatch(clearError());
  }, [dispatch]);
  
  useEffect(() => {
    if (success) {
      navigate('/leave');
    }
  }, [success, navigate]);
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.leave_type) {
      errors.leave_type = 'Leave type is required';
    }
    
    if (!formData.start_date) {
      errors.start_date = 'Start date is required';
    }
    
    if (!formData.end_date) {
      errors.end_date = 'End date is required';
    } else if (formData.start_date && new Date(formData.end_date) < new Date(formData.start_date)) {
      errors.end_date = 'End date must be after or equal to start date';
    }
    
    if (!formData.reason.trim()) {
      errors.reason = 'Reason is required';
    } else if (formData.reason.trim().length < 10) {
      errors.reason = 'Reason must be at least 10 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear the error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };

  const handleSelectChange = (value) => {
    setFormData({
      ...formData,
      leave_type: value,
    });
    
    // Clear the error for this field
    if (formErrors.leave_type) {
      setFormErrors({
        ...formErrors,
        leave_type: '',
      });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      dispatch(createLeaveRequest(formData));
    }
  };
  
  const calculateDays = () => {
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end dates
      return diffDays;
    }
    return 0;
  };
  
  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {typeof error === 'object' && error !== null
            ? Object.entries(error).map(([key, value]) => (
                <p key={key}>
                  {key}: {Array.isArray(value) ? value.join(', ') : value}
                </p>
              ))
            : error.message || 'An error occurred while submitting your leave request.'}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="leave_type">Leave Type *</Label>
          <Select 
            value={formData.leave_type} 
            onValueChange={handleSelectChange}
            disabled={loading}
          >
            <SelectTrigger id="leave_type" className={formErrors.leave_type ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select Leave Type" />
            </SelectTrigger>
            <SelectContent>
              {leaveTypes.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.name} {type.is_paid ? '(Paid)' : '(Unpaid)'} 
                  {type.max_days_per_year > 0 ? ` - Max ${type.max_days_per_year} days/year` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formErrors.leave_type && (
            <p className="text-red-500 text-sm mt-1">{formErrors.leave_type}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start_date">Start Date *</Label>
            <div className="relative">
              <Input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className={formErrors.start_date ? 'border-red-500' : ''}
                min={new Date().toISOString().split('T')[0]} // Prevent past dates
                disabled={loading}
              />
              <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
            </div>
            {formErrors.start_date && (
              <p className="text-red-500 text-sm mt-1">{formErrors.start_date}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="end_date">End Date *</Label>
            <div className="relative">
              <Input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className={formErrors.end_date ? 'border-red-500' : ''}
                min={formData.start_date || new Date().toISOString().split('T')[0]} // Prevent dates before start_date
                disabled={loading}
              />
              <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
            </div>
            {formErrors.end_date && (
              <p className="text-red-500 text-sm mt-1">{formErrors.end_date}</p>
            )}
          </div>
        </div>
        
        {formData.start_date && formData.end_date && (
          <div className="p-3 bg-blue-50 rounded-md border border-blue-100 text-blue-800">
            <p className="font-medium flex items-center">
              <FaCalendarAlt className="mr-2" />
              Duration: <span className="ml-1 font-bold">{calculateDays()} day(s)</span>
            </p>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="reason">Reason *</Label>
          <Textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className={formErrors.reason ? 'border-red-500' : ''}
            rows="4"
            disabled={loading}
            placeholder="Please provide a detailed reason for your leave request"
          />
          {formErrors.reason && (
            <p className="text-red-500 text-sm mt-1">{formErrors.reason}</p>
          )}
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/leave')}
            disabled={loading}
          >
            <FaTimes className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            <FaSave className="mr-2 h-4 w-4" />
            {loading ? 'Submitting...' : 'Submit Request'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LeaveRequestForm;