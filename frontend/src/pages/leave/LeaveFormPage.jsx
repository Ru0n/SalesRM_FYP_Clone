import LeaveRequestForm from '../../components/leave/LeaveRequestForm';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

const LeaveFormPage = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>New Leave Request</CardTitle>
        </CardHeader>
        <CardContent>
          <LeaveRequestForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveFormPage;