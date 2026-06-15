import React, { useState, useEffect, useCallback } from 'react';
import { apiSessions } from '../api/sessions'; 

const SessionCard = ({ session, onUpdate }) => {
    const [draft, setDraft] = useState(session.draft);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [editedQuestion, setEditedQuestion] = useState(draft?.ai_question || "");
    
    const [isManualMode, setIsManualMode] = useState(false);

    useEffect(() => {
        setDraft(session.draft);
        setEditedQuestion(session.draft?.ai_question || "");
    }, [session.draft]);

    // Génération de question assistée par l'IA
    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const data = await apiSessions.generateDraft(session.id);
            setDraft({ id: data.draft_id, ai_question: data.question, is_sent_to_patient: false });
            setEditedQuestion(data.question);
            setIsManualMode(false);
        } catch (error) {
            console.error("Erreur génération", error);
        } finally {
            setIsGenerating(false);
        }
    };

    // Envoi du brouillon au patient
    const handleSend = async () => {
        setIsSending(true);
        try {
            await apiSessions.sendToPatient(draft.id, editedQuestion);
            setDraft(prev => ({ ...prev, is_sent_to_patient: true, ai_question: editedQuestion }));
        } catch (error) {
            console.error("Erreur envoi", error);
        } finally {
            setIsSending(false);
        }
    };

    // Envoi direct d'une question rédigée manuellement
    const handleManualSend = async () => {
        if (!editedQuestion.trim()) return;
        setIsSending(true);
        try {
            await apiSessions.sendManualQuestion(session.id, editedQuestion);
            setDraft({ 
                is_sent_to_patient: true, 
                ai_question: editedQuestion, 
                is_answered: false 
            });
            setIsManualMode(false);
        } catch (error) {
            console.error("Erreur envoi manuel", error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#FDFDFD] bg-white shadow-sm absolute left-0 md:left-1/2 md:-translate-x-1/2 z-10 group-hover:border-[#8EBAE3] transition-all duration-300">
                <span className="text-[#8EBAE3] text-xs">●</span>
            </div>
            
            <div className="w-[calc(100%-3rem)] md:w-[45%] bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 group-hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                    <time className="text-[10px] font-black text-[#8EBAE3] uppercase tracking-widest">{session.date}</time>
                    <span className="text-[9px] font-bold text-gray-400 italic">Dr. {session.psychologist_name}</span>
                </div>
                <div className="text-sm text-gray-600 leading-relaxed font-medium mb-6">
                    {session.decrypted_notes}                           
                </div>

                {/* Bloc suggestion et envoi */}
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                    
                    {!draft && !isManualMode && (
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button 
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="flex-1 py-2 bg-gradient-to-r from-[#8EBAE3]/10 to-[#98EAD3]/10 text-[#8EBAE3] border border-[#8EBAE3]/20 rounded-xl text-xs font-bold hover:bg-[#8EBAE3]/20 transition-colors disabled:opacity-50"
                            >
                                {isGenerating ? "Génération..." : "Suggestion IA"}
                            </button>
                            <button 
                                onClick={() => {
                                    setIsManualMode(true);
                                    setEditedQuestion("");
                                }}
                                className="flex-1 py-2 bg-gray-50 text-gray-500 border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors"
                            >
                                Rédiger manuellement
                            </button>
                        </div>
                    )}

                    {/* Zone de texte pour la question */}
                    {((draft && !draft.is_sent_to_patient) || isManualMode) && (
                        <div className="space-y-3 animate-slide-up">
                            <label className="text-[10px] font-black text-gray-400 uppercase">
                                {isManualMode ? "Votre question pour le patient" : "Suggestion IA (Brouillon)"}
                            </label>
                            <textarea 
                                className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm text-gray-700 focus:ring-2 focus:ring-[#8EBAE3]"
                                value={editedQuestion}
                                onChange={(e) => setEditedQuestion(e.target.value)}
                                rows={3}
                                placeholder="Posez une question ouverte pour inciter à la réflexion..."
                                autoFocus={isManualMode}
                            />
                            <div className="flex gap-2">
                                {isManualMode && (
                                    <button 
                                        onClick={() => setIsManualMode(false)}
                                        className="px-4 py-2 bg-gray-100 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                )}
                                <button 
                                    onClick={isManualMode ? handleManualSend : handleSend}
                                    disabled={isSending || !editedQuestion.trim()}
                                    className="flex-1 py-2 bg-[#98EAD3] text-white rounded-xl text-xs font-bold shadow-md shadow-[#98EAD3]/30 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    {isSending ? "Envoi..." : "Valider et Envoyer au patient"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* État envoyé */}
                    {draft && draft.is_sent_to_patient && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-[#8EBAE3]/10 text-[#8EBAE3] rounded text-[9px] font-black uppercase">Envoyé</span>
                                {!draft.is_answered && <span className="text-xs text-gray-400 italic">En attente de réponse...</span>}
                            </div>
                            <p className="text-sm text-gray-700 font-medium italic">"{draft.ai_question}"</p>
                            
                            {draft.is_answered && (
                                <div className="mt-3 p-3 bg-[#F8FAFC] rounded-xl border border-gray-100">
                                    <label className="text-[9px] font-black text-[#98EAD3] uppercase mb-1 block">Réponse du patient</label>
                                    <p className="text-sm text-gray-800">{draft.decrypted_patient_response}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const PatientTimeline = ({ patientId }) => {
    const [sessions, setSessions] = useState([]);
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(true);

    const today = new Date().toLocaleDateString('fr-FR', {
        weekday: 'long', day: 'numeric', month: 'long'
    });

    const loadData = useCallback(async () => {
        try {
            const data = await apiSessions.fetchByPatient(patientId);
            setSessions(data);
        } catch (err) {
            console.error("Erreur chargement", err);
        } finally {
            setLoading(false);
        }
    }, [patientId]);

    useEffect(() => {
        if (patientId) {
            loadData();
        }
    }, [patientId, loadData]);

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

            <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                </div>
                <span className="relative bg-[#FDFDFD] px-4 text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">Historique Sécurisé</span>
            </div>

            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#8EBAE3]/50 before:via-gray-100 before:to-transparent">
                
                {loading ? (
                    <div className="text-center py-10 text-gray-400 animate-pulse font-black text-xs uppercase tracking-widest">Chiffrement en cours...</div>
                ) : sessions.map((session, index) => (
                    <SessionCard key={session.id} session={session} onUpdate={loadData} />
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