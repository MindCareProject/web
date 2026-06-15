import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Select from 'react-select';
import { apiAppointments } from '../api/appointments';
import { getPatients } from '../api/patientApi';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function CalendarWidget() {
  const [events, setEvents] = useState([]);
  const [patients, setPatients] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  const [formData, setFormData] = useState({
    patient: '',
    motif: 'Consultation',
    startTime: '',
    endTime: ''
  });

  const motifs = ["Consultation", "Bilan initial", "Suivi régulier", "Urgence", "Thérapie de couple", "Autre"];

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await apiAppointments.getAll();
      const formattedEvents = data.map(apt => {
        let color = '#8EBAE3'; // scheduled (bleu)
        if (apt.status === 'completed') color = '#98EAD3'; // green
        if (apt.status === 'pending') color = '#fb923c'; // orange
        if (apt.status === 'cancelled') color = '#f87171'; // red

        return {
          id: apt.id,
          title: `${apt.patient_name} - ${apt.motif || 'RDV'}`,
          start: apt.start_time,
          end: apt.end_time,
          backgroundColor: color,
          borderColor: 'transparent',
          extendedProps: { ...apt }
        };
      });
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Erreur chargement rendez-vous:", error);
    }
  };

  const fetchPatients = async () => {
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (error) {
      console.error("Erreur chargement patients:", error);
    }
  };

  const handleDateClick = (arg) => {
    setSelectedDate(arg.date);
    const start = arg.date;
    const end = new Date(start.getTime() + 60 * 60 * 1000); // +1 heure
    
    // Format pour l'input datetime-local (YYYY-MM-DDThh:mm)
    const pad = n => n < 10 ? '0'+n : n;
    const formatDateTime = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    
    setFormData({
      patient: '',
      motif: 'Consultation',
      startTime: formatDateTime(start),
      endTime: formatDateTime(end)
    });
    setIsCreateModalOpen(true);
  };

  const handleEventClick = (arg) => {
    const apt = arg.event.extendedProps;
    setSelectedEvent(apt);
    setIsViewModalOpen(true);
  };

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    try {
      const data = {
        patient: formData.patient,
        motif: formData.motif,
        start_time: new Date(formData.startTime).toISOString(),
        end_time: new Date(formData.endTime).toISOString(),
        status: "scheduled"
      };
      await apiAppointments.create(data);
      setIsCreateModalOpen(false);
      fetchAppointments();
    } catch (error) {
      console.error("Erreur création RDV:", error);
    }
  };

  // Préparation des données du graphique en araignée
  const renderRadarChart = (metrics) => {
    if (!metrics) return <div className="text-gray-400 text-sm text-center">Aucune métrique IA disponible.</div>;

    const emotions = metrics.emotions_primaires || {};
    const indicateurs = metrics.indicateurs_cliniques || {};
    
    const data = [
      { subject: 'Tristesse', A: emotions.tristesse || 0, fullMark: 10 },
      { subject: 'Colère', A: emotions.colere || 0, fullMark: 10 },
      { subject: 'Anxiété', A: emotions.anxiete || 0, fullMark: 10 },
      { subject: 'Fatigue', A: indicateurs.fatigue_mentale || 0, fullMark: 10 },
      { subject: 'Estime de soi', A: indicateurs.estime_de_soi || 0, fullMark: 10 },
      { subject: 'Clarté cognitive', A: indicateurs.clarte_cognitive || 0, fullMark: 10 },
      { subject: 'Résilience', A: indicateurs.indice_resilience || 0, fullMark: 10 },
    ];

    return (
      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
            <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
            <Radar name="Séance" dataKey="A" stroke="#8EBAE3" fill="#8EBAE3" fillOpacity={0.5} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 relative overflow-hidden h-full">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#8EBAE3] to-[#98EAD3]"></div>
      
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-black text-[#8EBAE3] uppercase tracking-[0.2em] flex items-center gap-2">
          <span className="w-2 h-2 bg-[#8EBAE3] rounded-full"></span>
          Mon Planning
        </h3>
        <div className="flex gap-2">
            <span className="text-[9px] font-bold text-gray-500 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#8EBAE3]"></div> À venir</span>
            <span className="text-[9px] font-bold text-gray-500 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#98EAD3]"></div> Terminé</span>
            <span className="text-[9px] font-bold text-gray-500 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-400"></div> En attente</span>
        </div>
      </div>

      <div className="h-[600px] overflow-hidden calendar-container">
        <FullCalendar
          plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          height="100%"
          slotMinTime="06:00:00"
          slotMaxTime="23:00:00"
          allDaySlot={false}
          locale="fr"
          buttonText={{
            today: "Aujourd'hui",
            month: 'Mois',
            week: 'Semaine',
            day: 'Jour',
            list: 'Liste'
          }}
        />
      </div>

      {/* --- MODAL CREATION --- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative">
            <h2 className="text-xl font-black text-gray-800 mb-6">Nouveau Rendez-vous</h2>
            
            <form onSubmit={handleCreateAppointment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Patient</label>
                <Select
                  options={patients.map(p => ({ value: p.id, label: `${p.first_name} ${p.last_name}` }))}
                  onChange={(option) => setFormData({...formData, patient: option ? option.value : ''})}
                  placeholder="Rechercher un patient..."
                  isClearable
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: '#F8FAFC',
                      borderColor: '#f3f4f6',
                      borderRadius: '0.75rem',
                      padding: '4px',
                      fontSize: '0.875rem',
                      fontWeight: '700',
                      color: '#374151',
                      boxShadow: 'none',
                      '&:hover': { borderColor: '#8EBAE3' }
                    }),
                    menu: (base) => ({
                      ...base,
                      borderRadius: '0.75rem',
                      overflow: 'hidden',
                      fontSize: '0.875rem',
                      fontWeight: '700'
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? '#F8FAFC' : 'white',
                      color: state.isSelected ? '#8EBAE3' : '#374151',
                      cursor: 'pointer',
                      '&:active': { backgroundColor: '#e2e8f0' }
                    })
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Motif</label>
                <select 
                  required
                  value={formData.motif}
                  onChange={(e) => setFormData({...formData, motif: e.target.value})}
                  className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 outline-none focus:border-[#8EBAE3]"
                >
                  {motifs.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Début</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl px-3 py-3 text-xs font-bold text-gray-700 outline-none focus:border-[#8EBAE3]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Fin</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl px-3 py-3 text-xs font-bold text-gray-700 outline-none focus:border-[#8EBAE3]"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl py-3 text-xs font-black uppercase tracking-widest transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-[#8EBAE3] hover:bg-[#7aa6ce] text-white rounded-xl py-3 text-xs font-black uppercase tracking-widest transition-colors shadow-lg shadow-[#8EBAE3]/30"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL VIEW EVENT --- */}
      {isViewModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsViewModalOpen(false)}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
            >
              ✕
            </button>

            <h2 className="text-2xl font-black text-gray-800 mb-1">{selectedEvent.patient_name}</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
              {selectedEvent.motif} • {new Date(selectedEvent.start_time).toLocaleDateString()}
            </p>

            {selectedEvent.status === 'scheduled' ? (
              <div className="bg-[#F8FAFC] rounded-2xl p-6 text-center border border-[#8EBAE3]/20">
                 <h4 className="text-sm font-black text-[#8EBAE3] uppercase tracking-wider mb-2">Séance à venir</h4>
                 <p className="text-xs text-gray-500">
                    Les notes et l'analyse IA de cette séance apparaîtront ici une fois la consultation terminée et le suivi rédigé.
                 </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Notes du Psychologue</h4>
                  <div className="bg-gray-50 rounded-2xl p-5 text-sm text-gray-700 italic border border-gray-100">
                    "{selectedEvent.session?.notes || 'Aucune note rédigée.'}"
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    Analyse IA (Radar)
                  </h4>
                  {selectedEvent.session?.metrics ? (
                    renderRadarChart(selectedEvent.session.metrics)
                  ) : (
                    <p className="text-xs text-gray-400 bg-gray-50 p-4 rounded-xl">Analyse en cours ou non générée.</p>
                  )}
                  
                  {selectedEvent.session?.metrics?.themes_cles && (
                     <div className="mt-4 flex gap-2 flex-wrap">
                        {selectedEvent.session.metrics.themes_cles.map((th, i) => (
                           <span key={i} className="text-[10px] font-bold px-3 py-1 bg-[#8EBAE3]/10 text-[#8EBAE3] rounded-full uppercase tracking-wider">
                              {th}
                           </span>
                        ))}
                     </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Styles personnalisés pour FullCalendar via style block */}
      <style>{`
        .calendar-container .fc {
          --fc-button-bg-color: #8EBAE3;
          --fc-button-border-color: transparent;
          --fc-button-hover-bg-color: #7aa6ce;
          --fc-button-hover-border-color: transparent;
          --fc-button-active-bg-color: #6a95bd;
          --fc-today-bg-color: #F8FAFC;
          font-family: inherit;
        }
        .calendar-container .fc-toolbar-title {
          font-size: 1.1rem !important;
          font-weight: 900 !important;
          color: #1f2937;
          text-transform: capitalize;
        }
        .calendar-container .fc-button {
          font-size: 0.75rem !important;
          font-weight: 800 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.1em;
          border-radius: 0.75rem !important;
          padding: 0.5rem 1rem !important;
          box-shadow: none !important;
          margin-right: 0.5rem !important;
        }
        .calendar-container .fc-button:last-child {
          margin-right: 0 !important;
        }
        .calendar-container .fc-col-header-cell {
          padding: 0.5rem 0;
          font-size: 0.7rem;
          text-transform: uppercase;
          font-weight: 800;
          color: #9ca3af;
        }
        .calendar-container .fc-event {
          border-radius: 6px;
          border: none;
          padding: 2px 4px;
          cursor: pointer;
          font-size: 0.7rem;
          font-weight: 700;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
      `}</style>
    </div>
  );
}
