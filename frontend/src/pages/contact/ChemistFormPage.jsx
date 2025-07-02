import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChemistForm from '../../components/contact/ChemistForm';

const ChemistFormPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;

  useEffect(() => {
    document.title = `${isEditMode ? 'Edit Chemist' : 'Add Chemist'} | Sales Force Automation`;
  }, [isEditMode]);

  return (
    <div className="container mx-auto px-4 py-6">
      <ChemistForm />
    </div>
  );
};

export default ChemistFormPage;
