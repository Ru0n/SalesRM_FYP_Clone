import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchDoctors, deleteDoctor } from '../../store/slices/contactSlice';
import { FaEdit, FaEye, FaTrash, FaPlus } from 'react-icons/fa';

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

const DoctorList = () => {
  const dispatch = useDispatch();
  const { doctors, doctorPagination, loading, error } = useSelector((state) => state.contact);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const params = {
      page: currentPage,
    };

    if (filter !== 'all') {
      params.is_active = filter === 'active';
    }

    dispatch(fetchDoctors(params));
  }, [dispatch, currentPage, filter]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (value) => {
    setFilter(value);
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      dispatch(deleteDoctor(id));
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Doctors</CardTitle>
          <div className="flex items-center space-x-4">
            <Select value={filter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Doctors</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button asChild>
              <Link to="/contact/doctor/new">
                <FaPlus className="mr-2 h-4 w-4" />
                Add Doctor
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error.message || 'An error occurred while fetching doctors.'}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : doctors.length === 0 ? (
          <div className="bg-gray-50 p-6 text-center rounded">
            <p className="text-gray-500">No doctors found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell className="font-medium">{doctor.name}</TableCell>
                    <TableCell>{doctor.specialty_details?.name || 'N/A'}</TableCell>
                    <TableCell>{doctor.location || 'N/A'}</TableCell>
                    <TableCell>
                      {doctor.contact_number || doctor.email ? (
                        <>
                          {doctor.contact_number && <div>{doctor.contact_number}</div>}
                          {doctor.email && <div>{doctor.email}</div>}
                        </>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={doctor.is_active ? "success" : "destructive"}>
                        {doctor.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/contact/doctor/${doctor.id}`}>
                            <FaEye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/contact/doctor/${doctor.id}/edit`}>
                            <FaEdit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(doctor.id)}
                        >
                          <FaTrash className="h-4 w-4 text-red-600" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {doctorPagination && doctorPagination.count > 0 && (
        <CardFooter className="flex justify-center pt-2">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!doctorPagination.previous}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {Math.ceil(doctorPagination.count / 10)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!doctorPagination.next}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default DoctorList;