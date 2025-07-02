import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchLeaveRequests, cancelLeaveRequest, approveLeaveRequest, rejectLeaveRequest } from '../../store/slices/leaveSlice';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '../ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogDescription 
} from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { FaEye, FaCheck, FaTimes, FaBan, FaPlus } from 'react-icons/fa';

const LeaveRequestList = () => {
  const dispatch = useDispatch();
  const { leaveRequests, pagination, loading, error } = useSelector((state) => state.leave);
  const { user } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [comments, setComments] = useState('');
  const [reviewAction, setReviewAction] = useState('');

  useEffect(() => {
    const params = {
      page: currentPage,
    };
    
    if (filter !== 'all') {
      params.status = filter;
    }
    
    dispatch(fetchLeaveRequests(params));
  }, [dispatch, currentPage, filter]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (value) => {
    setFilter(value);
    setCurrentPage(1);
  };

  const handleCancel = (id) => {
    if (window.confirm('Are you sure you want to cancel this leave request?')) {
      dispatch(cancelLeaveRequest(id));
    }
  };

  const openReviewModal = (request, action) => {
    setSelectedRequest(request);
    setReviewAction(action);
    setComments('');
    setShowReviewModal(true);
  };

  const handleReview = () => {
    if (reviewAction === 'approve') {
      dispatch(approveLeaveRequest({ id: selectedRequest.id, comments }));
    } else if (reviewAction === 'reject') {
      dispatch(rejectLeaveRequest({ id: selectedRequest.id, comments }));
    }
    setShowReviewModal(false);
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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading && leaveRequests.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-2 text-gray-600">Loading leave requests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="w-64">
          <Select value={filter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button asChild>
          <Link to="/leave/new">
            <FaPlus className="mr-2 h-4 w-4" />
            New Request
          </Link>
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error.detail || error.message || 'An error occurred while fetching leave requests.'}
        </div>
      )}

      {leaveRequests.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-gray-500">No leave requests found.</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    {request.leave_type_details?.name || 'Unknown'}
                  </TableCell>
                  <TableCell>
                    {formatDate(request.start_date)} - {formatDate(request.end_date)}
                  </TableCell>
                  <TableCell>{request.days_count}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>{formatDate(request.requested_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/leave/${request.id}`}>
                          <FaEye className="mr-1 h-4 w-4" />
                          <span className="sr-only md:not-sr-only md:ml-1">View</span>
                        </Link>
                      </Button>
                      
                      {request.status === 'pending' && request.user === user?.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancel(request.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <FaBan className="mr-1 h-4 w-4" />
                          <span className="sr-only md:not-sr-only md:ml-1">Cancel</span>
                        </Button>
                      )}
                      
                      {request.status === 'pending' && user?.role === 'manager' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openReviewModal(request, 'approve')}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <FaCheck className="mr-1 h-4 w-4" />
                            <span className="sr-only md:not-sr-only md:ml-1">Approve</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openReviewModal(request, 'reject')}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <FaTimes className="mr-1 h-4 w-4" />
                            <span className="sr-only md:not-sr-only md:ml-1">Reject</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {pagination.count > 0 && (
        <div className="flex justify-center mt-4 space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.previous}
          >
            Previous
          </Button>
          <span className="px-3 py-2 text-sm">
            Page {currentPage} of {Math.ceil(pagination.count / 10)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.next}
          >
            Next
          </Button>
        </div>
      )}

      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' ? 'Approve' : 'Reject'} Leave Request
            </DialogTitle>
            <DialogDescription>
              Review the leave request details before {reviewAction === 'approve' ? 'approving' : 'rejecting'}.
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Type</p>
                  <p>{selectedRequest.leave_type_details?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Days</p>
                  <p>{selectedRequest.days_count}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">Period</p>
                  <p>{formatDate(selectedRequest.start_date)} - {formatDate(selectedRequest.end_date)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">Reason</p>
                  <p className="text-sm text-gray-700">{selectedRequest.reason}</p>
                </div>
              </div>
              
              <div>
                <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
                  Comments (Optional)
                </label>
                <Textarea
                  id="comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Add your comments here..."
                  rows="3"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReviewModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleReview}
              variant={reviewAction === 'approve' ? 'default' : 'destructive'}
            >
              {reviewAction === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaveRequestList;