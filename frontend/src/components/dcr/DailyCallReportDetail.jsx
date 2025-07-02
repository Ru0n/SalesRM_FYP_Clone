import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchDailyCallReportById, deleteDailyCallReport, clearCurrentDailyCallReport } from '../../store/slices/dcrSlice';
import { FaEdit, FaTrash, FaArrowLeft, FaEye } from 'react-icons/fa';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

const DailyCallReportDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentDailyCallReport, loading, error } = useSelector((state) => state.dcr);
  const { user } = useSelector((state) => state.auth);
  
  useEffect(() => {
    dispatch(fetchDailyCallReportById(id));
    
    // Cleanup on unmount
    return () => {
      dispatch(clearCurrentDailyCallReport());
    };
  }, [dispatch, id]);
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this daily call report?')) {
      dispatch(deleteDailyCallReport(id)).then(() => {
        navigate('/dcr');
      });
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getWorkTypeLabel = (workType) => {
    const workTypes = {
      field_work: 'Field Work',
      office_work: 'Office Work',
      leave: 'Leave',
      holiday: 'Holiday',
    };
    return workTypes[workType] || workType;
  };
  
  const getWorkTypeBadgeVariant = (workType) => {
    switch (workType) {
      case 'field_work':
        return 'success';
      case 'office_work':
        return 'default';
      case 'leave':
        return 'secondary';
      case 'holiday':
        return 'outline';
      default:
        return 'default';
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <p>{error.message || 'An error occurred while fetching the daily call report.'}</p>
      </div>
    );
  }
  
  if (!currentDailyCallReport) {
    return (
      <div className="bg-gray-50 p-6 text-center rounded">
        <p className="text-gray-500">Daily call report not found.</p>
      </div>
    );
  }
  
  const canEdit = user.id === currentDailyCallReport.user || user.is_staff || user.role === 'manager';
  
  return (
    <Card className="shadow-sm max-w-4xl mx-auto">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Daily Call Report Details</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/dcr">
                <FaArrowLeft className="mr-2 h-4 w-4" />
                Back to List
              </Link>
            </Button>
            {canEdit && (
              <>
                <Button variant="default" size="sm" asChild>
                  <Link to={`/dcr/${id}/edit`}>
                    <FaEdit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleDelete}
                >
                  <FaTrash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Date</p>
            <p className="text-sm font-semibold">{formatDate(currentDailyCallReport.date)}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Work Type</p>
            <Badge variant={getWorkTypeBadgeVariant(currentDailyCallReport.work_type)}>
              {currentDailyCallReport.work_type_display || getWorkTypeLabel(currentDailyCallReport.work_type)}
            </Badge>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Submitted By</p>
            <p className="text-sm font-semibold">
              {currentDailyCallReport.user_details
                ? `${currentDailyCallReport.user_details.first_name} ${currentDailyCallReport.user_details.last_name}`
                : 'Unknown User'}
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Submitted At</p>
            <p className="text-sm font-semibold">
              {new Date(currentDailyCallReport.submitted_at).toLocaleString()}
            </p>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">Summary</p>
          <p className="text-sm whitespace-pre-line">{currentDailyCallReport.summary}</p>
        </div>
        
        {currentDailyCallReport.work_type === 'field_work' && (
          <>
            <Separator />
            
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-500">Doctors Visited</p>
              {currentDailyCallReport.doctors_visited_details?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {currentDailyCallReport.doctors_visited_details.map((doctor) => (
                    <Card key={doctor.id} className="p-3 flex justify-between items-center">
                      <div className="truncate">
                        <p className="text-sm font-medium">{doctor.name}</p>
                        <p className="text-xs text-gray-500">
                          {doctor.specialty_details ? doctor.specialty_details.name : 'No specialty'}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/contact/doctor/${doctor.id}`}>
                          <FaEye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No doctors visited</p>
              )}
            </div>
            
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-500">Chemists Visited</p>
              {currentDailyCallReport.chemists_visited_details?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {currentDailyCallReport.chemists_visited_details.map((chemist) => (
                    <Card key={chemist.id} className="p-3 flex justify-between items-center">
                      <div className="truncate">
                        <p className="text-sm font-medium">{chemist.name}</p>
                        <p className="text-xs text-gray-500">
                          {chemist.category_details ? chemist.category_details.name : 'No category'}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/contact/chemist/${chemist.id}`}>
                          <FaEye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No chemists visited</p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyCallReportDetail;