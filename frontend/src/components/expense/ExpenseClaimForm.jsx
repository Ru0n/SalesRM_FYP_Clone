import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchExpenseTypes, createExpenseClaim, clearSuccess, clearError } from '../../store/slices/expenseSlice';
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
import { FaCalendarAlt, FaSave, FaTimes, FaReceipt } from 'react-icons/fa';

const ExpenseClaimForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { expenseTypes, loading, error, success } = useSelector((state) => state.expense);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    expense_type: '',
    amount: '',
    date: '',
    description: '',
    attachment: null,
  });

  const [formErrors, setFormErrors] = useState({});
  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    dispatch(fetchExpenseTypes());

    // Clear any previous success/error states
    dispatch(clearSuccess());
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      navigate('/expense');
    }
  }, [success, navigate]);

  const validateForm = () => {
    const errors = {};

    if (!formData.expense_type) {
      errors.expense_type = 'Expense type is required';
    }

    if (!formData.amount) {
      errors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      errors.amount = 'Amount must be a positive number';
    }

    if (!formData.date) {
      errors.date = 'Date is required';
    }

    if (!formData.description) {
      errors.description = 'Description is required';
    }

    // Check if the selected expense type requires a receipt
    const selectedExpenseType = expenseTypes.find(
      (type) => type.id === parseInt(formData.expense_type)
    );

    if (selectedExpenseType?.requires_receipt && !formData.attachment) {
      errors.attachment = 'Receipt is required for this expense type';
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
      expense_type: value,
    });

    // Clear the error for this field
    if (formErrors.expense_type) {
      setFormErrors({
        ...formErrors,
        expense_type: '',
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        attachment: file,
      });

      // Create a preview URL for the file
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);

      // Clear the error for this field
      if (formErrors.attachment) {
        setFormErrors({
          ...formErrors,
          attachment: '',
        });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      dispatch(createExpenseClaim(formData));
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-red-800">Error Submitting Expense Claim</h3>
            <div className="mt-1 text-sm text-red-700">
              {error.message || 'An error occurred while submitting the expense claim.'}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="expense_type" className="flex items-center">
            Expense Type <span className="text-red-500 ml-1">*</span>
          </Label>
          {loading && expenseTypes.length === 0 ? (
            <div className="h-10 bg-gray-100 animate-pulse rounded"></div>
          ) : (
            <Select
              value={formData.expense_type}
              onValueChange={handleSelectChange}
              disabled={loading}
            >
              <SelectTrigger
                id="expense_type"
                className={`${formErrors.expense_type ? 'border-red-500 focus:ring-red-500' : ''}`}
              >
                <SelectValue placeholder="Select Expense Type" />
              </SelectTrigger>
              <SelectContent>
                {expenseTypes.length === 0 ? (
                  <div className="p-2 text-center text-sm text-gray-500">
                    No expense types available
                  </div>
                ) : (
                  expenseTypes.map((type) => (
                    <SelectItem
                      key={type.id}
                      value={type.id.toString()}
                      className="py-2 px-3"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{type.name}</span>
                        <span className="text-xs text-gray-500 mt-0.5">
                          {type.max_amount > 0 ? `Max रु ${type.max_amount}` : 'No limit'}
                          {type.requires_receipt ? ' • Receipt Required' : ''}
                        </span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
          {formErrors.expense_type && (
            <p className="text-red-500 text-sm mt-1">{formErrors.expense_type}</p>
          )}
          <p className="text-xs text-gray-500">Select the type of expense you are claiming</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="flex items-center">
              Amount <span className="text-red-500 ml-1">*</span>
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-gray-500">रु</span>
              </div>
              <Input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className={`${formErrors.amount ? 'border-red-500 focus:ring-red-500' : ''} pl-8`}
                min="0"
                step="0.01"
                placeholder="0.00"
                disabled={loading}
              />
              {formData.expense_type && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {(() => {
                    const selectedType = expenseTypes.find(
                      (type) => type.id === parseInt(formData.expense_type)
                    );
                    if (selectedType?.max_amount > 0 && formData.amount) {
                      const amount = parseFloat(formData.amount);
                      if (amount > selectedType.max_amount) {
                        return (
                          <span className="text-xs text-red-500">
                            Exceeds max (रु {selectedType.max_amount})
                          </span>
                        );
                      }
                    }
                    return null;
                  })()}
                </div>
              )}
            </div>
            {formErrors.amount && (
              <p className="text-red-500 text-sm mt-1">{formErrors.amount}</p>
            )}
            <p className="text-xs text-gray-500">
              {formData.expense_type && expenseTypes.find(
                (type) => type.id === parseInt(formData.expense_type)
              )?.max_amount > 0 ? (
                <>Maximum allowed: रु {expenseTypes.find(
                  (type) => type.id === parseInt(formData.expense_type)
                )?.max_amount}</>
              ) : 'Enter the amount spent on this expense'}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center">
              Date Incurred <span className="text-red-500 ml-1">*</span>
            </Label>
            <div className="relative">
              <Input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`${formErrors.date ? 'border-red-500 focus:ring-red-500' : ''} pr-10`}
                max={new Date().toISOString().split('T')[0]} // Prevent future dates
                disabled={loading}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FaCalendarAlt className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            {formErrors.date && (
              <p className="text-red-500 text-sm mt-1">{formErrors.date}</p>
            )}
            <p className="text-xs text-gray-500">Select the date when the expense was incurred</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="flex items-center">
            Description <span className="text-red-500 ml-1">*</span>
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`${formErrors.description ? 'border-red-500 focus:ring-red-500' : ''} min-h-[100px]`}
            disabled={loading}
            placeholder="Provide details about this expense (e.g., purpose, location, participants)"
          />
          {formErrors.description && (
            <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
          )}
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">Provide a clear description of the expense</p>
            <p className="text-xs text-gray-500">
              {formData.description.length} / 500 characters
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="attachment" className="flex items-center">
              Attachment
              {formData.expense_type && expenseTypes.find(
                (type) => type.id === parseInt(formData.expense_type)
              )?.requires_receipt ? (
                <span className="text-red-500 ml-1">*</span>
              ) : null}
            </Label>
            <span className="text-xs text-gray-500">Supported formats: JPG, PNG, PDF (Max 5MB)</span>
          </div>

          <div className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
            formErrors.attachment
              ? 'border-red-300 bg-red-50'
              : formData.attachment
                ? 'border-green-300 bg-green-50'
                : 'border-gray-300 hover:border-gray-400 bg-gray-50'
          }`}>
            <input
              type="file"
              id="attachment"
              name="attachment"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
              accept="image/*,.pdf"
              disabled={loading}
            />

            {!formData.attachment ? (
              <div className="flex flex-col items-center justify-center py-4">
                <FaReceipt className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-700 mb-1">Drag and drop your receipt here</p>
                <p className="text-xs text-gray-500 mb-3">or</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current.click()}
                  disabled={loading}
                  className="bg-white"
                >
                  <FaReceipt className="mr-2 h-4 w-4" />
                  Browse Files
                </Button>
              </div>
            ) : (
              <div className="flex items-start space-x-3">
                {filePreview ? (
                  <div className="h-16 w-16 rounded border overflow-hidden bg-white flex-shrink-0">
                    <img
                      src={filePreview}
                      alt="Receipt preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-16 w-16 rounded border bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <FaReceipt className="h-6 w-6 text-gray-400" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">
                    {formData.attachment.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(formData.attachment.size / 1024).toFixed(2)} KB
                  </p>
                  <div className="mt-2 flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current.click()}
                      disabled={loading}
                      className="h-8 px-2 text-xs"
                    >
                      Replace
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          attachment: null
                        });
                        setFilePreview(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      disabled={loading}
                      className="h-8 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {formErrors.attachment && (
            <p className="text-red-500 text-sm mt-1">{formErrors.attachment}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/expense')}
            disabled={loading}
            className="min-w-[120px]"
          >
            <FaTimes className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="min-w-[140px]"
          >
            {loading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Submitting...
              </>
            ) : (
              <>
                <FaSave className="mr-2 h-4 w-4" />
                Submit Claim
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseClaimForm;