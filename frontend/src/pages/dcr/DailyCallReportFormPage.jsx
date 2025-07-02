import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DailyCallReportForm from '../../components/dcr/DailyCallReportForm';

const DailyCallReportFormPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;

  useEffect(() => {
    document.title = `${isEditMode ? 'Edit Daily Call Report' : 'New Daily Call Report'} | Sales Force Automation`;

    // Force sidebar to be visible when this component mounts
    const sidebar = document.querySelector('aside');
    if (sidebar) {
      sidebar.style.display = 'block';
      sidebar.style.visibility = 'visible';
    }
  }, [isEditMode]);

  return (
    <div className="container mx-auto px-4 py-6">
      <DailyCallReportForm />
    </div>
  );
};

export default DailyCallReportFormPage;
