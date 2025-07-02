import { useEffect } from 'react';
import DailyCallReportList from '../../components/dcr/DailyCallReportList';

const DailyCallReportsPage = () => {
  useEffect(() => {
    document.title = 'Daily Call Reports | Sales Force Automation';

    // Force sidebar to be visible when this component mounts
    const sidebar = document.querySelector('aside');
    if (sidebar) {
      sidebar.style.display = 'block';
      sidebar.style.visibility = 'visible';
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <DailyCallReportList />
    </div>
  );
};

export default DailyCallReportsPage;
