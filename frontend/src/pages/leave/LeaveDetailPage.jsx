import LeaveRequestDetail from '../../components/leave/LeaveRequestDetail';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

const LeaveDetailPage = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Leave Request Details</CardTitle>
        </CardHeader>
        <CardContent>
          <LeaveRequestDetail />
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveDetailPage;