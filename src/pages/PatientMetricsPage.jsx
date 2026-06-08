import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PatientMetricsChart from '../components/PatientMetricsChart'; // Vérifie que le chemin est bon !

export default function PatientMetricsPage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* En-tête avec bouton retour */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            to="/patients" 
            className="text-gray-500 hover:text-blue-600 transition-colors font-medium flex items-center gap-2"
          >
            &larr; Retour aux patients
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">
            Suivi Clinique du patient #{id}
          </h1>
        </div>

        {/* On appelle ton super composant graphique ici en lui passant l'ID */}
        <PatientMetricsChart patientId={id} />

      </div>
    </div>
  );
}