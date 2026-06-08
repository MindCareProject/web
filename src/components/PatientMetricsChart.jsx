import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { getPatientMetrics } from '../api/patientApi';

const PatientMetricsChart = ({ patientId }) => {
  const [metrics, setMetrics] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const data = await getPatientMetrics(patientId);
        setMetrics(data);
        
        // Sélectionner par défaut la dernière séance s'il y a des données
        if (data && data.length > 0) {
          setSelectedSession(data[data.length - 1]);
        }
      } catch (err) {
        setError(err.response?.data?.error || err.message || "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };

    if (patientId) fetchMetrics();
  }, [patientId]);

  // Formater les données pour le graphique Radar de la séance sélectionnée
  const getRadarData = () => {
    if (!selectedSession) return [];
    return [
      { dimension: 'Anxiété', score: selectedSession.anxiete },
      { dimension: 'Fatigue', score: selectedSession.fatigue_mentale },
      { dimension: 'Tristesse', score: selectedSession.tristesse },
      { dimension: 'Colère', score: selectedSession.colere },
      { dimension: 'Clarté', score: selectedSession.clarte_cognitive },
      { dimension: 'Estime', score: selectedSession.estime_de_soi },
      { dimension: 'Joie', score: selectedSession.joie },
      { dimension: 'Résilience', score: selectedSession.indice_resilience }
    ];
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8EBAE3]"></div>
    </div>
  );
  
  if (error) return <p className="text-red-500 text-center font-medium p-4 bg-red-50 rounded-xl">{error}</p>;
  
  if (metrics.length === 0) return (
    <div className="text-center p-12 bg-white rounded-2xl shadow-sm border border-gray-100">
      <p className="text-gray-500 font-medium">Aucune métrique IA disponible pour ce patient.</p>
    </div>
  );

  return (
    <div className="space-y-8">
      
      {/* 1. GRAPHIQUE PRINCIPAL (LIGNE DU TEMPS) */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
        <h3 className="text-sm font-black text-[#8EBAE3] uppercase tracking-widest mb-6">
          Évolution Globale (Cliquez sur un point pour les détails)
        </h3>
        
       <div className="h-72 w-full cursor-pointer">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={metrics} 
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 10]} stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              
              <Line 
                type="monotone" 
                dataKey="anxiete" 
                name="Anxiété" 
                stroke="#ef4444" 
                strokeWidth={3}
                dot={{ r: 5, strokeWidth: 2, cursor: 'pointer', onClick: (e, payload) => setSelectedSession(payload.payload) }}
                activeDot={{ r: 8, cursor: 'pointer', onClick: (e, payload) => setSelectedSession(payload.payload) }}
              />
              <Line 
                type="monotone" 
                dataKey="fatigue_mentale" 
                name="Fatigue" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ r: 5, strokeWidth: 2, cursor: 'pointer', onClick: (e, payload) => setSelectedSession(payload.payload) }}
                activeDot={{ r: 8, cursor: 'pointer', onClick: (e, payload) => setSelectedSession(payload.payload) }}
              />
              <Line 
                type="monotone" 
                dataKey="indice_resilience" 
                name="Résilience" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ r: 5, strokeWidth: 2, cursor: 'pointer', onClick: (e, payload) => setSelectedSession(payload.payload) }}
                activeDot={{ r: 8, cursor: 'pointer', onClick: (e, payload) => setSelectedSession(payload.payload) }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. DÉTAILS DE LA SÉANCE SÉLECTIONNÉE */}
      {selectedSession && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Le Radar Chart (Empreinte émotionnelle) */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 lg:col-span-1 flex flex-col items-center justify-center">
            <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 w-full text-left">
              Empreinte du {selectedSession.date}
            </h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getRadarData()}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="dimension" tick={{ fill: '#6b7280', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                  <Radar name="Score" dataKey="score" stroke="#8EBAE3" fill="#8EBAE3" fillOpacity={0.4} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* L'analyse Textuelle de l'IA */}
          <div className="bg-[#F8FAFC] p-6 rounded-[2rem] border border-[#8EBAE3]/30 lg:col-span-2 flex flex-col justify-between">
            
            {/* Thèmes et Urgence */}
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedSession.urgence && (
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                  ⚠️ Alerte Urgence
                </span>
              )}
              {selectedSession.themes_cles?.map((theme, idx) => (
                <span key={idx} className="bg-white border border-[#98EAD3] text-[#4bb395] px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                  #{theme}
                </span>
              ))}
            </div>

            {/* Questions et Réponses */}
            <div className="space-y-4 flex-1">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
                <span className="text-[10px] font-black text-[#8EBAE3] uppercase tracking-widest block mb-1">
                  Question posée par l'IA
                </span>
                <p className="text-sm text-gray-700 font-medium italic">
                  {selectedSession.question_ia || "Aucune question enregistrée."}
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
                <span className="text-[10px] font-black text-[#98EAD3] uppercase tracking-widest block mb-1">
                  Réponse du patient
                </span>
                <p className="text-sm text-gray-800">
                  {selectedSession.reponse_patient || "Aucune réponse fournie."}
                </p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default PatientMetricsChart;