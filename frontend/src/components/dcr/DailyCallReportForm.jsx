import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchDailyCallReportById,
  createDailyCallReport,
  updateDailyCallReport,
  clearSuccess,
  clearError
} from '../../store/slices/dcrSlice';
import {
  fetchDoctors,
  fetchChemists
} from '../../store/slices/contactSlice';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { MultiSelect } from '../ui/multi-select';

const DailyCallReportForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentDailyCallReport, loading, error, success } = useSelector((state) => state.dcr);
  const { doctors, chemists } = useSelector((state) => state.contact);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    work_type: 'field_work',
    summary: '',
    doctors_visited: [],
    chemists_visited: [],
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  // Fetch doctors and chemists on component mount
  useEffect(() => {
    dispatch(fetchDoctors());
    dispatch(fetchChemists());
    
    // Clear any previous success/error states
    dispatch(clearSuccess());
    dispatch(clearError());
    
    // If editing an existing report, fetch its data
    if (id) {
      dispatch(fetchDailyCallReportById(id));
    }
    
    // Cleanup on unmount
    return () => {
      dispatch(clearSuccess());
      dispatch(clearError());
    };
  }, [dispatch, id]);
  
  // Populate form when currentDailyCallReport changes (for edit mode)
  useEffect(() => {
    if (id && currentDailyCallReport) {
      setFormData({
        date: currentDailyCallReport.date || new Date().toISOString().split('T')[0],
        work_type: currentDailyCallReport.work_type || 'field_work',
        summary: currentDailyCallReport.summary || '',
        doctors_visited: currentDailyCallReport.doctors_visited || [],
        chemists_visited: currentDailyCallReport.chemists_visited || [],
      });
    }
  }, [id, currentDailyCallReport]);
  
  // Redirect on successful submission
  useEffect(() => {
    if (success) {
      navigate('/dcr');
    }
  }, [success, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle work type change - clear doctors and chemists if not field work
    if (name === 'work_type' && value !== 'field_work') {
      setFormData({
        ...formData,
        [name]: value,
        doctors_visited: [],
        chemists_visited: [],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };

  const handleSelectChange = (value) => {
    // Handle work type change - clear doctors and chemists if not field work
    if (value !== 'field_work') {
      setFormData({
        ...formData,
        work_type: value,
        doctors_visited: [],
        chemists_visited: [],
      });
    } else {
      setFormData({
        ...formData,
        work_type: value,
      });
    }
    
    // Clear error for work_type
    if (formErrors.work_type) {
      setFormErrors({
        ...formErrors,
        work_type: '',
      });
    }
  };
  
  const handleDoctorsChange = (selected) => {
    setFormData({
      ...formData,
      doctors_visited: selected.map(item => parseInt(item.value)),
    });
    
    // Clear error for doctors_visited
    if (formErrors.doctors_visited) {
      setFormErrors({
        ...formErrors,
        doctors_visited: '',
      });
    }
  };
  
  const handleChemistsChange = (selected) => {
    setFormData({
      ...formData,
      chemists_visited: selected.map(item => parseInt(item.value)),
    });
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.date) {
      errors.date = 'Date is required';
    }
    
    if (!formData.summary.trim()) {
      errors.summary = 'Summary is required';
    }
    
    if (formData.work_type === 'field_work' && 
        formData.doctors_visited.length === 0 && 
        formData.chemists_visited.length === 0) {
      errors.doctors_visited = 'For field work, you must visit at least one doctor or chemist';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (id) {
      // Update existing report
      dispatch(updateDailyCallReport({ id, dcrData: formData }));
    } else {
      // Create new report
      dispatch(createDailyCallReport(formData));
    }
  };

  // Convert doctors and chemists arrays to the format expected by MultiSelect
  const doctorOptions = doctors.map(doctor => ({
    value: doctor.id.toString(),
    label: `${doctor.name} ${doctor.specialty_details ? `(${doctor.specialty_details.name})` : ''}`
  }));
  
  const chemistOptions = chemists.map(chemist => ({
    value: chemist.id.toString(),
    label: `${chemist.name} ${chemist.category_details ? `(${chemist.category_details.name})` : ''}`
  }));
  
  // Convert selected doctor and chemist IDs to the format expected by MultiSelect
  const selectedDoctors = doctorOptions.filter(option => 
    formData.doctors_visited.includes(parseInt(option.value))
  );
  
  const selectedChemists = chemistOptions.filter(option => 
    formData.chemists_visited.includes(parseInt(option.value))
  );
  
  return (
    <Card className="shadow-sm max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{id ? 'Edit Daily Call Report' : 'New Daily Call Report'}</CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error.message || 'An error occurred. Please try again.'}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="date">
              Date <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={formErrors.date ? 'border-red-500 focus:ring-red-500' : ''}
              required
            />
            {formErrors.date && (
              <p className="text-red-500 text-sm mt-1">{formErrors.date}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="work_type">
              Work Type <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.work_type} onValueChange={handleSelectChange}>
              <SelectTrigger id="work_type">
                <SelectValue placeholder="Select work type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="field_work">Field Work</SelectItem>
                <SelectItem value="office_work">Office Work</SelectItem>
                <SelectItem value="leave">Leave</SelectItem>
                <SelectItem value="holiday">Holiday</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="summary">
              Summary <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              rows={4}
              className={formErrors.summary ? 'border-red-500 focus:ring-red-500' : ''}
              required
            />
            {formErrors.summary && (
              <p className="text-red-500 text-sm mt-1">{formErrors.summary}</p>
            )}
          </div>
          
          {formData.work_type === 'field_work' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="doctors_visited">
                  Doctors Visited
                </Label>
                <MultiSelect
                  id="doctors_visited"
                  options={doctorOptions}
                  selected={selectedDoctors}
                  onChange={handleDoctorsChange}
                  placeholder="Select doctors..."
                  className={formErrors.doctors_visited ? 'border-red-500 focus:ring-red-500' : ''}
                  emptyMessage="No doctors found."
                />
                {formErrors.doctors_visited && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.doctors_visited}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="chemists_visited">
                  Chemists Visited
                </Label>
                <MultiSelect
                  id="chemists_visited"
                  options={chemistOptions}
                  selected={selectedChemists}
                  onChange={handleChemistsChange}
                  placeholder="Select chemists..."
                  emptyMessage="No chemists found."
                />
              </div>
            </>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dcr')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Saving...' : id ? 'Update Report' : 'Submit Report'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default DailyCallReportForm;