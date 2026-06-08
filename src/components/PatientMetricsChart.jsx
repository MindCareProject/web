import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { getPatientMetrics } from '../api/patientApi';

const PatientMetricsChart = ({ patientId }) => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const data = await getPatientMetrics(patientId);
        setMetrics(data);
      } catch (err) {
        setError(err.response?.data?.error || err.message || "Erreur lors du chargement des statistiques");
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchMetrics();
    }
  }, [patientId]);

  if (loading) return <p style={{ textAlign: 'center' }}>Chargement des statistiques de la thérapie...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
  if (metrics.length === 0) return <p style={{ textAlign: 'center' }}>Aucune donnée disponible pour ce patient.</p>;

  return (
    <div style={{ width: '100%', height: 400, backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h3 style={{ marginBottom: '20px', color: '#333', fontFamily: 'sans-serif' }}>
        Évolution Clinique (Score sur 10)
      </h3>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={metrics} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" stroke="#888" />
          <YAxis domain={[0, 10]} stroke="#888" />
          
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
          />
          <Legend />
          
          <Line type="monotone" dataKey="anxiete" name="Niveau d'Anxiété" stroke="#ef4444" strokeWidth={3} activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="fatigue_mentale" name="Fatigue Mentale" stroke="#3b82f6" strokeWidth={3} />
          <Line type="monotone" dataKey="indice_resilience" name="Résilience" stroke="#10b981" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PatientMetricsChart;