import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PatientMetricsChart from '../components/PatientMetricsChart';

export default function PatientMetricsPage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 p-8 rounded-xl">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex items-center gap-4 mb-8">
          <Link 
            to="/patients" 
            className="text-gray-500 hover:text-blue-600 transition-colors font-medium flex items-center gap-2"
          >
            &larr; Retour aux patients
          </Link>
        </div>

        <PatientMetricsChart patientId={id} />

      </div>
    </div>
  );
}