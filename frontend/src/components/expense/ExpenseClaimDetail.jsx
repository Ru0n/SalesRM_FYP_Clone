import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  fetchExpenseClaimById,
  cancelExpenseClaim,
  approveExpenseClaim,
  rejectExpenseClaim,
  queryExpenseClaim,
  clearCurrentExpenseClaim
} from '../../store/slices/expenseSlice';
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
import {
  FaCalendarAlt,
  FaCheck,
  FaTimes,
  FaBan,
  FaArrowLeft,
  FaUser,
  FaClock,
  FaComments,
  FaQuestion,
  FaFileAlt,
  FaDownload,
  FaRupeeSign
} from 'react-icons/fa';

const ExpenseClaimDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentExpenseClaim, loading, error } = useSelector((state) => state.expense);
  const { user } = useSelector((state) => state.auth);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [comments, setComments] = useState('');
  const [reviewAction, setReviewAction] = useState('');

  useEffect(() => {
    dispatch(fetchExpenseClaimById(id));

    // Cleanup function
    return () => {
      dispatch(clearCurrentExpenseClaim());
    };
  }, [dispatch, id]);

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this expense claim?')) {
      dispatch(cancelExpenseClaim(id));
    }
  };

  const openReviewModal = (action) => {
    setReviewAction(action);
    setComments('');
    setShowReviewModal(true);
  };

  const handleReview = () => {
    if (reviewAction === 'approve') {
      dispatch(approveExpenseClaim({ id, comments }));
    } else if (reviewAction === 'reject') {
      dispatch(rejectExpenseClaim({ id, comments }));
    } else if (reviewAction === 'query') {
      dispatch(queryExpenseClaim({ id, comments }));
    }
    setShowReviewModal(false);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
    }).format(amount || 0);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100">Rejected</Badge>;
      case 'queried':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">Queried</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading && !currentExpenseClaim) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-9 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <div className="h-5 w-28 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="h-1 w-full bg-gray-200 rounded animate-pulse"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-3"></div>
            <div className="space-y-2">
              <div className="flex">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse ml-2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-red-800">Error Loading Expense Claim</h3>
            <div className="mt-1 text-sm text-red-700">
              {error.message || 'An error occurred while fetching the expense claim.'}
            </div>
          </div>
        </div>
        <Button variant="outline" asChild className="mt-2">
          <Link to="/expense">
            <FaArrowLeft className="mr-2 h-4 w-4" />
            Back to Expense Claims
          </Link>
        </Button>
      </div>
    );
  }

  if (!currentExpenseClaim) {
    return (
      <div className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-4 rounded flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Expense Claim Not Found</h3>
            <div className="mt-1 text-sm text-yellow-700">
              The expense claim you are looking for does not exist or has been deleted.
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <Button variant="outline" asChild className="mt-2">
            <Link to="/expense">
              <FaArrowLeft className="mr-2 h-4 w-4" />
              Back to Expense Claims
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium flex items-center">
            {currentExpenseClaim.expense_type_details?.name || 'Unknown Expense Type'}
            <span className="ml-3">{getStatusBadge(currentExpenseClaim.status)}</span>
          </h3>
          <div className="flex items-center mt-1 text-gray-600">
            <FaCalendarAlt className="mr-2 text-gray-400" />
            {formatDate(currentExpenseClaim.date)}
          </div>
          {currentExpenseClaim.user_details && (
            <p className="text-gray-600 mt-1 flex items-center">
              <FaUser className="mr-2 text-gray-400" />
              Submitted by: {currentExpenseClaim.user_details.first_name} {currentExpenseClaim.user_details.last_name}
            </p>
          )}
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/expense">
            <FaArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
        <div className="flex items-center">
          <FaRupeeSign className="text-gray-500 mr-2" />
          <h4 className="font-medium">Amount</h4>
        </div>
        <p className="text-2xl font-semibold mt-1">{formatCurrency(currentExpenseClaim.amount)}</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
        <div className="flex items-center">
          <FaComments className="text-gray-500 mr-2" />
          <h4 className="font-medium">Description</h4>
        </div>
        <p className="mt-2 whitespace-pre-line">{currentExpenseClaim.description}</p>
      </div>

      {currentExpenseClaim.attachment && (
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <div className="flex items-center mb-3">
            <FaFileAlt className="text-gray-500 mr-2" />
            <h4 className="font-medium">Receipt Attachment</h4>
          </div>

          {currentExpenseClaim.attachment_url?.endsWith('.pdf') ? (
            <div className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-red-50 rounded flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm">Receipt Document (PDF)</p>
                  <p className="text-xs text-gray-500">Click the button to view or download</p>
                </div>
              </div>
              <a
                href={currentExpenseClaim.attachment_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button variant="outline" size="sm" className="flex items-center">
                  <FaDownload className="mr-2 h-4 w-4" />
                  View PDF
                </Button>
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-white p-2 rounded border border-gray-200 inline-block">
                <img
                  src={currentExpenseClaim.attachment_url}
                  alt="Receipt"
                  className="max-h-60 rounded"
                />
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">Click to view full size image</p>
                <a
                  href={currentExpenseClaim.attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button variant="outline" size="sm" className="flex items-center h-8 text-xs">
                    <FaDownload className="mr-2 h-3 w-3" />
                    View Full Size
                  </Button>
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-3 flex items-center">
            <FaClock className="mr-2 text-gray-500" />
            Submission Information
          </h4>
          <dl className="space-y-2">
            <div className="flex">
              <dt className="w-32 text-gray-500">Submitted on:</dt>
              <dd>{formatDate(currentExpenseClaim.submitted_at)}</dd>
            </div>
          </dl>
        </div>

        {currentExpenseClaim.status !== 'pending' && currentExpenseClaim.reviewed_by && (
          <div>
            <h4 className="font-medium mb-3 flex items-center">
              <FaUser className="mr-2 text-gray-500" />
              Review Information
            </h4>
            <dl className="space-y-2">
              <div className="flex">
                <dt className="w-32 text-gray-500">Reviewed by:</dt>
                <dd>{currentExpenseClaim.reviewed_by_details?.first_name} {currentExpenseClaim.reviewed_by_details?.last_name}</dd>
              </div>
              {currentExpenseClaim.reviewed_at && (
                <div className="flex">
                  <dt className="w-32 text-gray-500">Reviewed on:</dt>
                  <dd>{formatDate(currentExpenseClaim.reviewed_at)}</dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </div>

      {currentExpenseClaim.manager_comments && (
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <div className="flex items-center">
            <FaComments className="text-gray-500 mr-2" />
            <h4 className="font-medium">Manager Comments</h4>
          </div>
          <p className="mt-2 whitespace-pre-line">{currentExpenseClaim.manager_comments}</p>
        </div>
      )}

      <Separator />

      <div className="flex justify-end space-x-3">
        {currentExpenseClaim.status === 'pending' && currentExpenseClaim.user === user?.id && (
          <Button
            variant="outline"
            onClick={handleCancel}
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <FaBan className="mr-2 h-4 w-4" />
            Cancel Claim
          </Button>
        )}

        {/* Show approval buttons for managers if the claim is from an MR */}
        {user?.role === 'manager' &&
         currentExpenseClaim.user_details?.role?.toLowerCase() === 'mr' &&
         (currentExpenseClaim.status === 'pending' || currentExpenseClaim.status === 'queried') && (
          <>
            <Button
              variant="outline"
              onClick={() => openReviewModal('reject')}
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <FaTimes className="mr-2 h-4 w-4" />
              Reject
            </Button>
            {currentExpenseClaim.status === 'pending' && (
              <Button
                variant="outline"
                onClick={() => openReviewModal('query')}
                className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              >
                <FaQuestion className="mr-2 h-4 w-4" />
                Query
              </Button>
            )}
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

        {/* Show approval buttons for admins if the claim is from a manager */}
        {(user?.is_staff === true || user?.is_superuser === true) &&
         currentExpenseClaim.user_details?.role?.toLowerCase() === 'manager' &&
         (currentExpenseClaim.status === 'pending' || currentExpenseClaim.status === 'queried') && (
          <>
            <Button
              variant="outline"
              onClick={() => openReviewModal('reject')}
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <FaTimes className="mr-2 h-4 w-4" />
              Reject
            </Button>
            {currentExpenseClaim.status === 'pending' && (
              <Button
                variant="outline"
                onClick={() => openReviewModal('query')}
                className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              >
                <FaQuestion className="mr-2 h-4 w-4" />
                Query
              </Button>
            )}
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              {reviewAction === 'approve' && (
                <FaCheck className="mr-2 h-5 w-5 text-green-500" />
              )}
              {reviewAction === 'reject' && (
                <FaTimes className="mr-2 h-5 w-5 text-red-500" />
              )}
              {reviewAction === 'query' && (
                <FaQuestion className="mr-2 h-5 w-5 text-blue-500" />
              )}
              {reviewAction === 'approve' ? 'Approve' : reviewAction === 'reject' ? 'Reject' : 'Query'} Expense Claim
            </DialogTitle>
            <DialogDescription>
              {reviewAction === 'approve'
                ? 'Add any comments before approving this expense claim.'
                : reviewAction === 'reject'
                  ? 'Please provide a reason for rejecting this expense claim.'
                  : 'Please provide details for your query about this expense claim.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {currentExpenseClaim && (
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Type</p>
                    <p className="font-medium">{currentExpenseClaim.expense_type_details?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Amount</p>
                    <p className="font-medium text-green-700">{formatCurrency(currentExpenseClaim.amount)}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="comments" className="block text-sm font-medium mb-1 flex items-center">
                Comments
                {(reviewAction === 'reject' || reviewAction === 'query') && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
              <Textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder={reviewAction === 'approve'
                  ? 'Add any comments (optional)'
                  : reviewAction === 'reject'
                    ? 'Provide a reason for rejection'
                    : 'Provide details for your query'}
                rows="3"
                className={`${(reviewAction === 'reject' || reviewAction === 'query') && !comments.trim() ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              />
              {(reviewAction === 'reject' || reviewAction === 'query') && !comments.trim() && (
                <p className="mt-1 text-sm text-red-600">Comments are required for this action</p>
              )}
            </div>
          </div>

          <DialogFooter className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={() => setShowReviewModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleReview}
              disabled={(reviewAction === 'reject' || reviewAction === 'query') && !comments.trim() || loading}
              className={`${
                reviewAction === 'approve'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : reviewAction === 'reject'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
              } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                <>
                  {reviewAction === 'approve' && <FaCheck className="mr-2 h-4 w-4" />}
                  {reviewAction === 'reject' && <FaTimes className="mr-2 h-4 w-4" />}
                  {reviewAction === 'query' && <FaQuestion className="mr-2 h-4 w-4" />}
                  {reviewAction === 'approve' ? 'Approve' : reviewAction === 'reject' ? 'Reject' : 'Query'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpenseClaimDetail;