import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchTourPrograms, submitTourProgram, approveTourProgram, rejectTourProgram } from '../../store/slices/tourProgramSlice';
import { FaEye, FaEdit, FaPaperPlane, FaCheck, FaTimes, FaPlus } from 'react-icons/fa';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../ui/dialog';
import { Textarea } from '../ui/textarea';

const TourProgramList = () => {
  const dispatch = useDispatch();
  const { tourPrograms, pagination, loading, error } = useSelector((state) => state.tourProgram);
  const { user } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState({
    status: 'all',
    month: 'all',
    year: new Date().getFullYear().toString(),
  });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [comments, setComments] = useState('');
  const [reviewAction, setReviewAction] = useState('');

  useEffect(() => {
    const params = {
      page: currentPage,
    };

    if (filter.status !== 'all') {
      params.status = filter.status;
    }

    if (filter.month && filter.month !== 'all') {
      params.month = filter.month;
    }

    if (filter.year) {
      params.year = filter.year;
    }

    dispatch(fetchTourPrograms(params));
  }, [dispatch, currentPage, filter]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (name, value) => {
    setFilter({
      ...filter,
      [name]: value,
    });
    setCurrentPage(1);
  };

  const handleSubmit = (id) => {
    if (window.confirm('Are you sure you want to submit this tour program for approval?')) {
      dispatch(submitTourProgram(id)).then((result) => {
        if (!result.error) {
          // Refresh the tour programs list after successful submission
          const params = {
            page: currentPage,
            status: filter.status !== 'all' ? filter.status : undefined,
            month: filter.month !== 'all' ? filter.month : undefined,
            year: filter.year || undefined,
          };
          dispatch(fetchTourPrograms(params));
        }
      });
    }
  };

  const openReviewModal = (program, action) => {
    setSelectedProgram(program);
    setReviewAction(action);
    setComments('');
    setShowReviewModal(true);
  };

  const handleReview = () => {
    if (reviewAction === 'approve') {
      dispatch(approveTourProgram({ id: selectedProgram.id, comments })).then((result) => {
        if (!result.error) {
          // Refresh the tour programs list after successful approval
          const params = {
            page: currentPage,
            status: filter.status !== 'all' ? filter.status : undefined,
            month: filter.month !== 'all' ? filter.month : undefined,
            year: filter.year || undefined,
          };
          dispatch(fetchTourPrograms(params));
        }
      });
    } else if (reviewAction === 'reject') {
      dispatch(rejectTourProgram({ id: selectedProgram.id, comments })).then((result) => {
        if (!result.error) {
          // Refresh the tour programs list after successful rejection
          const params = {
            page: currentPage,
            status: filter.status !== 'all' ? filter.status : undefined,
            month: filter.month !== 'all' ? filter.month : undefined,
            year: filter.year || undefined,
          };
          dispatch(fetchTourPrograms(params));
        }
      });
    }
    setShowReviewModal(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getMonthName = (month) => {
    if (!month) return '';
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month - 1];
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

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Tour Programs</CardTitle>
          <div className="flex items-center space-x-4">
            <Select
              value={filter.status}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filter.month}
              onValueChange={(value) => handleFilterChange('month', value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <SelectItem key={month} value={month.toString()}>
                    {getMonthName(month)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filter.year}
              onValueChange={(value) => handleFilterChange('year', value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button asChild>
              <Link to="/tours/new">
                <FaPlus className="mr-2 h-4 w-4" />
                New Program
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4">
            {error.message || 'An error occurred while fetching tour programs.'}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month/Year</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted At</TableHead>
                  <TableHead>Reviewed At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tourPrograms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                      No tour programs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  tourPrograms.map((program) => (
                    <TableRow key={program.id}>
                      <TableCell className="font-medium">
                        {program.month_name} {program.year}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(program.status)}
                      </TableCell>
                      <TableCell>{formatDate(program.submitted_at)}</TableCell>
                      <TableCell>{formatDate(program.reviewed_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/tours/${program.id}`}>
                              <FaEye className="mr-1 h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Link>
                          </Button>

                          {program.status === 'draft' && program.user === user?.id && (
                            <>
                              <Button variant="ghost" size="sm" asChild>
                                <Link to={`/tours/${program.id}/edit`}>
                                  <FaEdit className="mr-1 h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSubmit(program.id)}
                              >
                                <FaPaperPlane className="mr-1 h-4 w-4 text-green-600" />
                                <span className="sr-only">Submit</span>
                              </Button>
                            </>
                          )}

                          {program.status === 'submitted' && (user?.role === 'manager' || user?.is_staff) && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openReviewModal(program, 'approve')}
                              >
                                <FaCheck className="mr-1 h-4 w-4 text-green-600" />
                                <span className="sr-only">Approve</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openReviewModal(program, 'reject')}
                              >
                                <FaTimes className="mr-1 h-4 w-4 text-red-600" />
                                <span className="sr-only">Reject</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Pagination */}
      {pagination.count > 0 && (
        <CardFooter className="flex justify-center py-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.previous}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
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
        </CardFooter>
      )}

      {/* Review Modal */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' ? 'Approve' : 'Reject'} Tour Program
            </DialogTitle>
            <DialogDescription>
              {selectedProgram && (
                <div className="py-2">
                  <p className="mb-1">
                    <span className="font-medium">Month/Year:</span> {selectedProgram.month_name} {selectedProgram.year}
                  </p>
                  <p>
                    <span className="font-medium">Submitted:</span> {formatDate(selectedProgram.submitted_at)}
                  </p>
                </div>
              )}
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

export default TourProgramList;
