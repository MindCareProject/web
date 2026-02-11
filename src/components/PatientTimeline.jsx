import React, { useState, useEffect } from 'react';
import { apiSessions } from '../api/sessions'; 

const PatientTimeline = ({ patientId }) => {
    const [sessions, setSessions] = useState([]);
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(true);

    const today = new Date().toLocaleDateString('fr-FR', {
        weekday: 'long', day: 'numeric', month: 'long'
    });

    useEffect(() => {
        if (patientId) loadData();
    }, [patientId]);

    const loadData = async () => {
        try {
            const data = await apiSessions.fetchByPatient(patientId);
            setSessions(data);
        } catch (err) {
            console.error("Erreur chargement", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!note.trim()) return;
        try {
            await apiSessions.create(patientId, note);
            setNote(""); 
            loadData();  
        } catch (err) {
            console.error("Erreur sauvegarde");
        }
    };

    return (
        <div className="space-y-10">
            {/* --- BLOC NOUVELLE SÉANCE --- */}
            <div className="bg-[#F8FAFC] p-6 rounded-[2rem] border border-dashed border-[#8EBAE3]/50">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[10px] font-black text-[#8EBAE3] uppercase tracking-[0.2em]">Nouvelle Séance</h3>
                    <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-50">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">{today}</span>
                        <span className="h-2 w-2 rounded-full bg-[#98EAD3] animate-pulse"></span>
                    </div>
                </div>

                <textarea 
                    className="w-full bg-white border-none rounded-2xl p-4 text-sm font-medium text-gray-700 placeholder:text-gray-300 focus:ring-2 focus:ring-[#8EBAE3] min-h-[120px] shadow-inner"
                    placeholder="Saisissez vos observations cliniques ici..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
                
                <div className="flex justify-end mt-4">
                    <button 
                        className="bg-[#8EBAE3] hover:bg-[#98EAD3] text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-md shadow-[#8EBAE3]/20 active:scale-95"
                        onClick={handleSave}
                    >
                        Enregistrer la séance
                    </button>
                </div>
            </div>

            {/* --- DIVISEUR --- */}
            <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                </div>
                <span className="relative bg-[#FDFDFD] px-4 text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">Historique Sécurisé</span>
            </div>

            {/* --- LISTE DES SÉANCES (TIMELINE) --- */}
            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#8EBAE3]/50 before:via-gray-100 before:to-transparent">
                
                {loading ? (
                    <div className="text-center py-10 text-gray-400 animate-pulse font-black text-xs uppercase tracking-widest">Chiffrement en cours...</div>
                ) : sessions.map((session, index) => (
                    <div key={session.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                        
                        {/* Point sur la ligne */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#FDFDFD] bg-white shadow-sm absolute left-0 md:left-1/2 md:-translate-x-1/2 z-10 group-hover:border-[#8EBAE3] transition-all duration-300">
                {/* Icône sobre en bleu ciel ou gris très clair */}
                <span className="text-[#8EBAE3] text-xs">●</span>
            </div>
                        {/* Carte de la note */}
                        <div className="w-[calc(100%-3rem)] md:w-[45%] bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 group-hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <time className="text-[10px] font-black text-[#8EBAE3] uppercase tracking-widest">{session.date}</time>
                                <span className="text-[9px] font-bold text-gray-400 italic">Dr. {session.psychologist_name}</span>
                            </div>
                            <div className="text-sm text-gray-600 leading-relaxed font-medium">
                                {session.notes}
                            </div>
                        </div>
                    </div>
                ))}

                {sessions.length === 0 && !loading && (
                    <div className="text-center py-20 opacity-30">
                        <div className="text-4xl mb-2"></div>
                        <p className="text-xs font-black uppercase tracking-widest">Aucune séance enregistrée</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientTimeline;