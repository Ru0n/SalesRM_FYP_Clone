import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchDoctorSpecialties,
  fetchDoctorById,
  createDoctor,
  updateDoctor,
  clearSuccess,
  clearError
} from '../../store/slices/contactSlice';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';

const DoctorForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { doctorSpecialties, currentDoctor, loading, error, success } = useSelector((state) => state.contact);
  
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    location: '',
    contact_number: '',
    email: '',
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  // Fetch doctor specialties on component mount
  useEffect(() => {
    dispatch(fetchDoctorSpecialties());
    
    // Clear any previous success/error states
    dispatch(clearSuccess());
    dispatch(clearError());
    
    // If editing an existing doctor, fetch their data
    if (id) {
      dispatch(fetchDoctorById(id));
    }
    
    // Cleanup on unmount
    return () => {
      dispatch(clearSuccess());
      dispatch(clearError());
    };
  }, [dispatch, id]);
  
  // Populate form when currentDoctor changes (for edit mode)
  useEffect(() => {
    if (id && currentDoctor) {
      setFormData({
        name: currentDoctor.name || '',
        specialty: currentDoctor.specialty || '',
        location: currentDoctor.location || '',
        contact_number: currentDoctor.contact_number || '',
        email: currentDoctor.email || '',
      });
    }
  }, [id, currentDoctor]);
  
  // Redirect on successful submission
  useEffect(() => {
    if (success) {
      navigate('/contact/doctors');
    }
  }, [success, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error for this field
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
      specialty: value,
    });
    
    // Clear error for this field
    if (formErrors.specialty) {
      setFormErrors({
        ...formErrors,
        specialty: '',
      });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
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
      // Update existing doctor
      dispatch(updateDoctor({ id, doctorData: formData }));
    } else {
      // Create new doctor
      dispatch(createDoctor(formData));
    }
  };
  
  return (
    <Card className="shadow-sm max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{id ? 'Edit Doctor' : 'Add New Doctor'}</CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error.message || 'An error occurred. Please try again.'}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={formErrors.name ? 'border-red-500 focus:ring-red-500' : ''}
              required
            />
            {formErrors.name && (
              <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="specialty">Specialty</Label>
            <Select value={formData.specialty} onValueChange={handleSelectChange}>
              <SelectTrigger id="specialty">
                <SelectValue placeholder="-- Select Specialty --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">-- Select Specialty --</SelectItem>
                {doctorSpecialties.map((specialty) => (
                  <SelectItem key={specialty.id} value={specialty.id.toString()}>
                    {specialty.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Textarea
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contact_number">Contact Number</Label>
            <Input
              id="contact_number"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={formErrors.email ? 'border-red-500 focus:ring-red-500' : ''}
            />
            {formErrors.email && (
              <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/contact/doctors')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Saving...' : id ? 'Update Doctor' : 'Add Doctor'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default DoctorForm;