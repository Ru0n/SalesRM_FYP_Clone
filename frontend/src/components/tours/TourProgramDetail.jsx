import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  fetchTourProgramById,
  submitTourProgram,
  approveTourProgram,
  rejectTourProgram,
  clearCurrentTourProgram
} from '../../store/slices/tourProgramSlice';
import { FaEdit, FaPaperPlane, FaCheck, FaTimes, FaArrowLeft } from 'react-icons/fa';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../ui/dialog';

const TourProgramDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentTourProgram, loading, error } = useSelector((state) => state.tourProgram);
  const { user } = useSelector((state) => state.auth);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [comments, setComments] = useState('');
  const [reviewAction, setReviewAction] = useState('');

  useEffect(() => {
    dispatch(fetchTourProgramById(id));

    // Cleanup function
    return () => {
      dispatch(clearCurrentTourProgram());
    };
  }, [dispatch, id]);

  const handleSubmit = () => {
    if (window.confirm('Are you sure you want to submit this tour program for approval?')) {
      dispatch(submitTourProgram(id)).then((result) => {
        if (!result.error) {
          // Refresh the tour program data after successful submission
          dispatch(fetchTourProgramById(id));
        }
      });
    }
  };

  const openReviewModal = (action) => {
    setReviewAction(action);
    setComments('');
    setShowReviewModal(true);
  };

  const handleReview = () => {
    if (reviewAction === 'approve') {
      dispatch(approveTourProgram({ id, comments })).then((result) => {
        if (!result.error) {
          // Refresh the tour program data after successful approval
          dispatch(fetchTourProgramById(id));
        }
      });
    } else if (reviewAction === 'reject') {
      dispatch(rejectTourProgram({ id, comments })).then((result) => {
        if (!result.error) {
          // Refresh the tour program data after successful rejection
          dispatch(fetchTourProgramById(id));
        }
      });
    }
    setShowReviewModal(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'submitted':
        return <Badge variant="default">Submitted</Badge>;
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardContent className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error.message || 'An error occurred while fetching the tour program.'}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentTourProgram) {
    return (
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            Tour program not found.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Tour Program Details</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link to="/tours">
            <FaArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">
              {currentTourProgram.month_name} {currentTourProgram.year}
            </h3>
            <p className="text-gray-600 text-sm">
              Created by: {currentTourProgram.user_details?.first_name} {currentTourProgram.user_details?.last_name}
            </p>
          </div>
          <div>
            {getStatusBadge(currentTourProgram.status)}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-500">Area Details</h4>
          <div className="bg-gray-50 p-4 rounded border whitespace-pre-wrap">
            {currentTourProgram.area_details}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-500">Submission Details</h4>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="font-medium">Submitted At:</span> {formatDate(currentTourProgram.submitted_at)}
              </p>
            </div>
          </div>

          {(currentTourProgram.status === 'approved' || currentTourProgram.status === 'rejected') && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-500">Review Details</h4>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Reviewed By:</span> {currentTourProgram.reviewer_details?.first_name} {currentTourProgram.reviewer_details?.last_name}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Reviewed At:</span> {formatDate(currentTourProgram.reviewed_at)}
                </p>
                {currentTourProgram.manager_comments && (
                  <div className="mt-2">
                    <p className="font-medium text-sm">Manager Comments:</p>
                    <div className="bg-gray-50 p-3 rounded border text-sm mt-1">
                      {currentTourProgram.manager_comments}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-end space-x-2 pt-2 border-t">
        {currentTourProgram.status === 'draft' && currentTourProgram.user === user?.id && (
          <>
            <Button variant="outline" asChild>
              <Link to={`/tours/${id}/edit`}>
                <FaEdit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700"
            >
              <FaPaperPlane className="mr-2 h-4 w-4" />
              Submit for Approval
            </Button>
          </>
        )}

        {currentTourProgram.status === 'submitted' && (user?.role === 'manager' || user?.is_staff) && (
          <>
            <Button
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-50"
              onClick={() => openReviewModal('reject')}
            >
              <FaTimes className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => openReviewModal('approve')}
            >
              <FaCheck className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </>
        )}
      </CardFooter>

      {/* Review Modal */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' ? 'Approve' : 'Reject'} Tour Program
            </DialogTitle>
            <DialogDescription>
              <div className="py-2">
                <p className="mb-1">
                  <span className="font-medium">Month/Year:</span> {currentTourProgram.month_name} {currentTourProgram.year}
                </p>
                <p>
                  <span className="font-medium">Submitted:</span> {formatDate(currentTourProgram.submitted_at)}
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <label htmlFor="comments" className="block mb-2 text-sm font-medium">
              Comments (Optional)
            </label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Enter your comments here..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReviewModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant={reviewAction === 'approve' ? 'default' : 'destructive'}
              onClick={handleReview}
            >
              {reviewAction === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TourProgramDetail;
