import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/table';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const ReportTable = ({ data, columns, title, loading, error }) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle sort direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort data if sortField is set
  const sortedData = sortField
    ? [...data].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        // Handle different data types
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        // For numbers, dates, etc.
        return sortDirection === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      })
    : data;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded">
            <p>Error: {error.message || 'Failed to load data'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded text-center">
            <p className="text-muted-foreground">No data available.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.field}
                  className={column.sortable !== false ? "cursor-pointer" : ""}
                  onClick={() => column.sortable !== false && handleSort(column.field)}
                >
                  <div className="flex items-center">
                    {column.header}
                    {column.sortable !== false && (
                      <span className="ml-1">
                        {sortField === column.field ? (
                          sortDirection === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                        ) : (
                          <FaSort className="ml-1 opacity-40" />
                        )}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column) => (
                  <TableCell
                    key={`${rowIndex}-${column.field}`}
                  >
                    {column.render
                      ? column.render(row[column.field], row)
                      : row[column.field]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ReportTable;
