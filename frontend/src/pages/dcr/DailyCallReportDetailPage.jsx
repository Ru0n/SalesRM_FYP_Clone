import { useEffect } from 'react';
import DailyCallReportDetail from '../../components/dcr/DailyCallReportDetail';

const DailyCallReportDetailPage = () => {
  useEffect(() => {
    document.title = 'Daily Call Report Details | Sales Force Automation';

    // Force sidebar to be visible when this component mounts
    const sidebar = document.querySelector('aside');
    if (sidebar) {
      sidebar.style.display = 'block';
      sidebar.style.visibility = 'visible';
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <DailyCallReportDetail />
    </div>
  );
};

export default DailyCallReportDetailPage;
