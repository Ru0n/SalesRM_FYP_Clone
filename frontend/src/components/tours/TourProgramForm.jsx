import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createTourProgram,
  updateTourProgram,
  fetchTourProgramById,
  submitTourProgram,
  clearSuccess,
  clearError,
  clearCurrentTourProgram
} from '../../store/slices/tourProgramSlice';
import { FaSave, FaPaperPlane } from 'react-icons/fa';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';

const TourProgramForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const { currentTourProgram, loading, error, success } = useSelector((state) => state.tourProgram);

  const [formData, setFormData] = useState({
    month: '',
    year: new Date().getFullYear().toString(),
    area_details: '',
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    // Clear any previous success/error states
    dispatch(clearSuccess());
    dispatch(clearError());

    if (isEditMode) {
      dispatch(fetchTourProgramById(id));
    }

    // Cleanup function
    return () => {
      dispatch(clearCurrentTourProgram());
    };
  }, [dispatch, id, isEditMode]);

  useEffect(() => {
    if (isEditMode && currentTourProgram) {
      setFormData({
        month: currentTourProgram.month.toString(),
        year: currentTourProgram.year.toString(),
        area_details: currentTourProgram.area_details,
      });
    }
  }, [isEditMode, currentTourProgram]);

  useEffect(() => {
    if (success) {
      navigate('/tours');
    }
  }, [success, navigate]);

  const validateForm = () => {
    const errors = {};

    if (!formData.month) {
      errors.month = 'Month is required';
    }

    if (!formData.year) {
      errors.year = 'Year is required';
    }

    if (!formData.area_details.trim()) {
      errors.area_details = 'Area details are required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (name, value) => {
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

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  const handleSubmit = (e, submitForApproval = false) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isEditMode) {
      dispatch(updateTourProgram({
        id,
        tourProgramData: formData,
      })).then((result) => {
        if (!result.error && submitForApproval) {
          dispatch(submitTourProgram(id));
        }
      });
    } else {
      dispatch(createTourProgram(formData)).then((result) => {
        if (!result.error && submitForApproval) {
          dispatch(submitTourProgram(result.payload.id));
        }
      });
    }
  };

  const handleCancel = () => {
    navigate('/tours');
  };

  const getMonthName = (month) => {
    if (!month) return '';
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month - 1];
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>
          {isEditMode ? 'Edit Tour Program' : 'Create Tour Program'}
        </CardTitle>
      </CardHeader>

      <form onSubmit={(e) => handleSubmit(e, false)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error.message || 'An error occurred while saving the tour program.'}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month" className="flex items-center">
                Month <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                value={formData.month}
                onValueChange={(value) => handleChange('month', value)}
                disabled={loading || (isEditMode && currentTourProgram?.status !== 'draft')}
              >
                <SelectTrigger id="month" className={formErrors.month ? 'border-red-500 focus:ring-red-500' : ''}>
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <SelectItem key={month} value={month.toString()}>
                      {getMonthName(month)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.month && (
                <p className="text-red-500 text-sm mt-1">{formErrors.month}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="year" className="flex items-center">
                Year <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                value={formData.year}
                onValueChange={(value) => handleChange('year', value)}
                disabled={loading || (isEditMode && currentTourProgram?.status !== 'draft')}
              >
                <SelectTrigger id="year" className={formErrors.year ? 'border-red-500 focus:ring-red-500' : ''}>
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.year && (
                <p className="text-red-500 text-sm mt-1">{formErrors.year}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="area_details" className="flex items-center">
              Area Details <span className="text-red-500 ml-1">*</span>
            </Label>
            <Textarea
              id="area_details"
              name="area_details"
              value={formData.area_details}
              onChange={handleTextChange}
              className={formErrors.area_details ? 'border-red-500 focus:ring-red-500' : ''}
              rows={10}
              placeholder="Enter detailed plan for your tour program..."
              disabled={loading || (isEditMode && currentTourProgram?.status !== 'draft')}
            />
            {formErrors.area_details && (
              <p className="text-red-500 text-sm mt-1">{formErrors.area_details}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-2 pt-2">
          {(!isEditMode || (isEditMode && currentTourProgram?.status === 'draft')) ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Saving...' : (
                  <>
                    <FaSave className="mr-2 h-4 w-4" />
                    Save as Draft
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="success"
                onClick={(e) => handleSubmit(e, true)}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Submitting...' : (
                  <>
                    <FaPaperPlane className="mr-2 h-4 w-4" />
                    Submit for Approval
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Back to List
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};

export default TourProgramForm;
