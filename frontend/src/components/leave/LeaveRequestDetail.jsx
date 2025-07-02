import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  fetchLeaveRequestById, 
  cancelLeaveRequest, 
  approveLeaveRequest, 
  rejectLeaveRequest,
  clearCurrentLeaveRequest
} from '../../store/slices/leaveSlice';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogDescription 
} from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { FaCalendarAlt, FaCheck, FaTimes, FaBan, FaArrowLeft, FaUser, FaClock, FaComments } from 'react-icons/fa';

const LeaveRequestDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentLeaveRequest, loading, error, success } = useSelector((state) => state.leave);
  const { user } = useSelector((state) => state.auth);
  
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [comments, setComments] = useState('');
  const [reviewAction, setReviewAction] = useState('');
  
  useEffect(() => {
    dispatch(fetchLeaveRequestById(id));
    
    // Cleanup function
    return () => {
      dispatch(clearCurrentLeaveRequest());
    };
  }, [dispatch, id]);
  
  useEffect(() => {
    if (success) {
      // Refresh the leave request data
      dispatch(fetchLeaveRequestById(id));
    }
  }, [success, dispatch, id]);
  
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this leave request?')) {
      dispatch(cancelLeaveRequest(id));
    }
  };
  
  const openReviewModal = (action) => {
    setReviewAction(action);
    setComments('');
    setShowReviewModal(true);
  };
  
  const handleReview = () => {
    if (reviewAction === 'approve') {
      dispatch(approveLeaveRequest({ id, comments }));
    } else if (reviewAction === 'reject') {
      dispatch(rejectLeaveRequest({ id, comments }));
    }
    setShowReviewModal(false);
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'cancelled':
        return <Badge>Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  if (loading && !currentLeaveRequest) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-2 text-gray-600">Loading leave request details...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error.detail || error.message || 'An error occurred while fetching the leave request.'}
        </div>
        <Button variant="outline" asChild>
          <Link to="/leave">
            <FaArrowLeft className="mr-2 h-4 w-4" />
            Back to Leave Requests
          </Link>
        </Button>
      </div>
    );
  }
  
  if (!currentLeaveRequest) {
    return (
      <div className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          Leave request not found.
        </div>
        <Button variant="outline" asChild>
          <Link to="/leave">
            <FaArrowLeft className="mr-2 h-4 w-4" />
            Back to Leave Requests
          </Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium flex items-center">
            {currentLeaveRequest.leave_type_details?.name || 'Unknown Leave Type'}
            <span className="ml-3">{getStatusBadge(currentLeaveRequest.status)}</span>
          </h3>
          <p className="text-gray-600 flex items-center mt-1">
            <FaCalendarAlt className="mr-2 text-gray-400" />
            {formatDate(currentLeaveRequest.start_date)} - {formatDate(currentLeaveRequest.end_date)}
            {' '}({currentLeaveRequest.days_count} day{currentLeaveRequest.days_count !== 1 ? 's' : ''})
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/leave">
            <FaArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
        <h4 className="font-medium mb-2 flex items-center">
          <FaComments className="mr-2 text-gray-500" />
          Reason
        </h4>
        <p className="text-gray-700 whitespace-pre-line">{currentLeaveRequest.reason}</p>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-3 flex items-center">
            <FaUser className="mr-2 text-gray-500" />
            Request Information
          </h4>
          <dl className="space-y-2">
            <div className="flex">
              <dt className="w-32 text-gray-500">Requested by:</dt>
              <dd>{currentLeaveRequest.user_details?.first_name} {currentLeaveRequest.user_details?.last_name}</dd>
            </div>
            <div className="flex">
              <dt className="w-32 text-gray-500">Requested on:</dt>
              <dd>{formatDate(currentLeaveRequest.requested_at)}</dd>
            </div>
          </dl>
        </div>
        
        {currentLeaveRequest.reviewed_by && (
          <div>
            <h4 className="font-medium mb-3 flex items-center">
              <FaClock className="mr-2 text-gray-500" />
              Review Information
            </h4>
            <dl className="space-y-2">
              <div className="flex">
                <dt className="w-32 text-gray-500">Reviewed by:</dt>
                <dd>{currentLeaveRequest.reviewed_by}</dd>
              </div>
              <div className="flex">
                <dt className="w-32 text-gray-500">Reviewed on:</dt>
                <dd>{formatDate(currentLeaveRequest.reviewed_at)}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>
      
      {currentLeaveRequest.manager_comments && (
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <h4 className="font-medium mb-2 flex items-center">
            <FaComments className="mr-2 text-gray-500" />
            Manager Comments
          </h4>
          <p className="text-gray-700 whitespace-pre-line">{currentLeaveRequest.manager_comments}</p>
        </div>
      )}
      
      <Separator />
      
      <div className="flex justify-end space-x-3">
        {currentLeaveRequest.status === 'pending' && currentLeaveRequest.user === user?.id && (
          <Button
            variant="outline"
            onClick={handleCancel}
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <FaBan className="mr-2 h-4 w-4" />
            Cancel Request
          </Button>
        )}
        
        {currentLeaveRequest.status === 'pending' && user?.role === 'manager' && (
          <>
            <Button
              variant="outline"
              onClick={() => openReviewModal('reject')}
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <FaTimes className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              variant="default"
              onClick={() => openReviewModal('approve')}
              className="bg-green-600 hover:bg-green-700"
            >
              <FaCheck className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </>
        )}
      </div>
      
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' ? 'Approve' : 'Reject'} Leave Request
            </DialogTitle>
            <DialogDescription>
              {reviewAction === 'approve' 
                ? 'Add any comments before approving this leave request.' 
                : 'Please provide a reason for rejecting this leave request.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div>
              <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
                Comments {reviewAction === 'reject' && '(Required)'}
              </label>
              <Textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder={reviewAction === 'approve' 
                  ? 'Add any comments (optional)' 
                  : 'Provide a reason for rejection'}
                rows="3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReviewModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleReview}
              variant={reviewAction === 'approve' ? 'default' : 'destructive'}
              disabled={reviewAction === 'reject' && !comments.trim()}
            >
              {reviewAction === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaveRequestDetail;