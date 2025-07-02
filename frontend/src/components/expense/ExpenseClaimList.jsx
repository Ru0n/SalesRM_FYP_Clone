import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchExpenseClaims, cancelExpenseClaim, approveExpenseClaim, rejectExpenseClaim, queryExpenseClaim } from '../../store/slices/expenseSlice';
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
import { FaEye, FaCheck, FaTimes, FaBan, FaQuestion, FaPlus, FaReceipt } from 'react-icons/fa';

const ExpenseClaimList = () => {
  const dispatch = useDispatch();
  const { expenseClaims, pagination, loading, error } = useSelector((state) => state.expense);
  const { user } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [comments, setComments] = useState('');
  const [reviewAction, setReviewAction] = useState('');

  useEffect(() => {
    const params = {
      page: currentPage,
    };

    if (filter !== 'all') {
      params.status = filter;
    }

    dispatch(fetchExpenseClaims(params));
  }, [dispatch, currentPage, filter]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (value) => {
    setFilter(value);
    setCurrentPage(1);
  };

  const handleCancel = (id) => {
    if (window.confirm('Are you sure you want to cancel this expense claim?')) {
      dispatch(cancelExpenseClaim(id));
    }
  };

  const openReviewModal = (claim, action) => {
    setSelectedClaim(claim);
    setReviewAction(action);
    setComments('');
    setShowReviewModal(true);
  };

  const handleReview = () => {
    if (reviewAction === 'approve') {
      dispatch(approveExpenseClaim({ id: selectedClaim.id, comments }));
    } else if (reviewAction === 'reject') {
      dispatch(rejectExpenseClaim({ id: selectedClaim.id, comments }));
    } else if (reviewAction === 'query') {
      dispatch(queryExpenseClaim({ id: selectedClaim.id, comments }));
    }
    setShowReviewModal(false);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
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

  if (loading && expenseClaims.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="w-64 opacity-50">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="opacity-50">
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <div className="bg-white">
            <div className="h-12 border-b bg-gray-50 flex items-center px-4">
              <div className="grid grid-cols-7 w-full gap-4">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>

            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-b last:border-0 h-16 px-4 flex items-center">
                <div className="grid grid-cols-7 w-full gap-4">
                  {[...Array(6)].map((_, j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                  <div className="flex justify-end space-x-2">
                    {[...Array(2)].map((_, k) => (
                      <div key={k} className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
              <SelectItem value="all">All Claims</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="queried">Queried</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button asChild>
          <Link to="/expense/new">
            <FaPlus className="mr-2 h-4 w-4" />
            New Claim
          </Link>
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error.detail || error.message || 'An error occurred while fetching expense claims.'}
        </div>
      )}

      {expenseClaims.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-md border border-gray-200">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="rounded-full bg-gray-100 p-3">
              <FaReceipt className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No expense claims found</h3>
            <p className="text-gray-500 max-w-sm">
              {filter !== 'all'
                ? `No ${filter} expense claims found. Try changing the filter or create a new claim.`
                : 'You have not submitted any expense claims yet. Create a new claim to get started.'}
            </p>
            <Button asChild className="mt-2">
              <Link to="/expense/new">
                <FaPlus className="mr-2 h-4 w-4" />
                New Claim
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Submitted On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenseClaims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell>{formatDate(claim.date)}</TableCell>
                  <TableCell className="font-medium">
                    {claim.expense_type_details?.name}
                  </TableCell>
                  <TableCell>{formatCurrency(claim.amount)}</TableCell>
                  <TableCell>{getStatusBadge(claim.status)}</TableCell>
                  <TableCell>
                    {claim.user_details ?
                      `${claim.user_details.first_name} ${claim.user_details.last_name}` :
                      'Unknown User'}
                  </TableCell>
                  <TableCell>{formatDate(claim.submitted_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/expense/${claim.id}`}>
                          <FaEye className="mr-1 h-4 w-4" />
                          <span className="sr-only md:not-sr-only md:ml-1">View</span>
                        </Link>
                      </Button>

                      {claim.status === 'pending' && claim.user === user?.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancel(claim.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <FaBan className="mr-1 h-4 w-4" />
                          <span className="sr-only md:not-sr-only md:ml-1">Cancel</span>
                        </Button>
                      )}

                      {/* Show approval buttons for managers if the claim is from an MR */}
                      {user?.role === 'manager' &&
                       claim.user_details?.role?.toLowerCase() === 'mr' &&
                       (claim.status === 'pending' || claim.status === 'queried') && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openReviewModal(claim, 'approve')}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <FaCheck className="mr-1 h-4 w-4" />
                            <span className="sr-only md:not-sr-only md:ml-1">Approve</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openReviewModal(claim, 'reject')}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <FaTimes className="mr-1 h-4 w-4" />
                            <span className="sr-only md:not-sr-only md:ml-1">Reject</span>
                          </Button>
                          {claim.status === 'pending' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openReviewModal(claim, 'query')}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <FaQuestion className="mr-1 h-4 w-4" />
                              <span className="sr-only md:not-sr-only md:ml-1">Query</span>
                            </Button>
                          )}
                        </>
                      )}

                      {/* Show approval buttons for admins if the claim is from a manager */}
                      {(user?.is_staff === true || user?.is_superuser === true) &&
                       claim.user_details?.role?.toLowerCase() === 'manager' &&
                       (claim.status === 'pending' || claim.status === 'queried') && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openReviewModal(claim, 'approve')}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <FaCheck className="mr-1 h-4 w-4" />
                            <span className="sr-only md:not-sr-only md:ml-1">Approve</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openReviewModal(claim, 'reject')}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <FaTimes className="mr-1 h-4 w-4" />
                            <span className="sr-only md:not-sr-only md:ml-1">Reject</span>
                          </Button>
                          {claim.status === 'pending' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openReviewModal(claim, 'query')}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <FaQuestion className="mr-1 h-4 w-4" />
                              <span className="sr-only md:not-sr-only md:ml-1">Query</span>
                            </Button>
                          )}
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

      {pagination && pagination.count > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, pagination.count)} of {pagination.count} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.previous || loading}
              className="h-8 px-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 h-4 w-4">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Previous
            </Button>
            <div className="flex items-center">
              {[...Array(Math.min(5, Math.ceil(pagination.count / 10)))].map((_, i) => {
                const pageNumber = i + 1;
                const isCurrentPage = pageNumber === currentPage;

                return (
                  <Button
                    key={i}
                    variant={isCurrentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                    disabled={loading}
                    className={`h-8 w-8 p-0 ${isCurrentPage ? 'pointer-events-none' : ''}`}
                  >
                    {pageNumber}
                  </Button>
                );
              })}
              {Math.ceil(pagination.count / 10) > 5 && (
                <span className="px-2 text-gray-500">...</span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.next || loading}
              className="h-8 px-3"
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-4 w-4">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </Button>
          </div>
        </div>
      )}

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
              Review the expense claim details before {reviewAction === 'approve' ? 'approving' : reviewAction === 'reject' ? 'rejecting' : 'querying'}.
            </DialogDescription>
          </DialogHeader>

          {selectedClaim && (
            <div className="space-y-4 py-2">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Type</p>
                    <p className="font-medium">{selectedClaim.expense_type_details?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Amount</p>
                    <p className="font-medium text-green-700">{formatCurrency(selectedClaim.amount)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Date</p>
                    <p>{formatDate(selectedClaim.date)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Submitted By</p>
                    <p>{selectedClaim.user_details ?
                      `${selectedClaim.user_details.first_name} ${selectedClaim.user_details.last_name}` :
                      'Unknown User'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Description</p>
                    <p className="text-sm text-gray-700">{selectedClaim.description}</p>
                  </div>
                  {selectedClaim.attachment && (
                    <div className="col-span-2">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Attachment</p>
                      <a
                        href={selectedClaim.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <FaReceipt className="mr-1 h-4 w-4" />
                        View Receipt
                      </a>
                    </div>
                  )}
                </div>
              </div>

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
                  placeholder={`Add your comments for ${reviewAction === 'approve' ? 'approval' : reviewAction === 'reject' ? 'rejection' : 'query'}`}
                  rows="3"
                  className={`${(reviewAction === 'reject' || reviewAction === 'query') && !comments.trim() ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                />
                {(reviewAction === 'reject' || reviewAction === 'query') && !comments.trim() && (
                  <p className="mt-1 text-sm text-red-600">Comments are required for this action</p>
                )}
              </div>
            </div>
          )}

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

export default ExpenseClaimList;