import { useEffect } from 'react';
import DoctorList from '../../components/contact/DoctorList';

const DoctorsPage = () => {
  useEffect(() => {
    document.title = 'Doctors | Sales Force Automation';
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <DoctorList />
    </div>
  );
};

export default DoctorsPage;
