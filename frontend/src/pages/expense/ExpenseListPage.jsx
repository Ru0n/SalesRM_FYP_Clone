import { useEffect } from 'react';
import ExpenseClaimList from '../../components/expense/ExpenseClaimList';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

const ExpenseListPage = () => {
  // Force sidebar to be visible when this component mounts
  useEffect(() => {
    // This ensures the sidebar is visible when navigating to this page
    const sidebar = document.querySelector('aside');
    if (sidebar) {
      sidebar.style.display = 'block';
      sidebar.style.visibility = 'visible';
    }
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Expense Claims</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseClaimList />
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseListPage;