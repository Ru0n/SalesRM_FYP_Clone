import { useEffect } from 'react';
import ExpenseClaimForm from '../../components/expense/ExpenseClaimForm';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

const ExpenseFormPage = () => {
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
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>New Expense Claim</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseClaimForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseFormPage;