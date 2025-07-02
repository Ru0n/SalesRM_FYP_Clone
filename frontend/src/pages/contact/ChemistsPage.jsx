import { useEffect } from 'react';
import ChemistList from '../../components/contact/ChemistList';

const ChemistsPage = () => {
  useEffect(() => {
    document.title = 'Chemists | Sales Force Automation';
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <ChemistList />
    </div>
  );
};

export default ChemistsPage;
