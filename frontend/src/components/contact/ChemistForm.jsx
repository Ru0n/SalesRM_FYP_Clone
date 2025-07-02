import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchChemistCategories,
  fetchChemistById,
  createChemist,
  updateChemist,
  clearSuccess,
  clearError
} from '../../store/slices/contactSlice';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';

const ChemistForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { chemistCategories, currentChemist, loading, error, success } = useSelector((state) => state.contact);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    location: '',
    contact_number: '',
    email: '',
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  // Fetch chemist categories on component mount
  useEffect(() => {
    dispatch(fetchChemistCategories());
    
    // Clear any previous success/error states
    dispatch(clearSuccess());
    dispatch(clearError());
    
    // If editing an existing chemist, fetch their data
    if (id) {
      dispatch(fetchChemistById(id));
    }
    
    // Cleanup on unmount
    return () => {
      dispatch(clearSuccess());
      dispatch(clearError());
    };
  }, [dispatch, id]);
  
  // Populate form when currentChemist changes (for edit mode)
  useEffect(() => {
    if (id && currentChemist) {
      setFormData({
        name: currentChemist.name || '',
        category: currentChemist.category || '',
        location: currentChemist.location || '',
        contact_number: currentChemist.contact_number || '',
        email: currentChemist.email || '',
      });
    }
  }, [id, currentChemist]);
  
  // Redirect on successful submission
  useEffect(() => {
    if (success) {
      navigate('/contact/chemists');
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
      category: value,
    });
    
    // Clear error for this field
    if (formErrors.category) {
      setFormErrors({
        ...formErrors,
        category: '',
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
      // Update existing chemist
      dispatch(updateChemist({ id, chemistData: formData }));
    } else {
      // Create new chemist
      dispatch(createChemist(formData));
    }
  };
  
  return (
    <Card className="shadow-sm max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{id ? 'Edit Chemist' : 'Add New Chemist'}</CardTitle>
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
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={handleSelectChange}>
              <SelectTrigger id="category">
                <SelectValue placeholder="-- Select Category --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">-- Select Category --</SelectItem>
                {chemistCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
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
            onClick={() => navigate('/contact/chemists')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Saving...' : id ? 'Update Chemist' : 'Add Chemist'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ChemistForm;