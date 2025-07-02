import LeaveRequestList from '../../components/leave/LeaveRequestList';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

const LeaveListPage = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <LeaveRequestList />
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveListPage;