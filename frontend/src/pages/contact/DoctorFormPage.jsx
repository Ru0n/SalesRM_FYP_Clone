import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DoctorForm from '../../components/contact/DoctorForm';

const DoctorFormPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;

  useEffect(() => {
    document.title = `${isEditMode ? 'Edit Doctor' : 'Add Doctor'} | Sales Force Automation`;
  }, [isEditMode]);

  return (
    <div className="container mx-auto px-4 py-6">
      <DoctorForm />
    </div>
  );
};

export default DoctorFormPage;
