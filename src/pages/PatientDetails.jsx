import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import PatientTimeline from '../components/PatientTimeline'; 
import api from '../api/axios'; 

const PatientDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);

    // Chargement initial des données du patient
    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const response = await api.get(`/patients/${id}/`); 
                setPatient(response.data);
                setFormData(response.data); 
            } catch (error) {
                console.error("Erreur chargement patient", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchPatient();
    }, [id]);

    // Mise à jour des informations (Email, Adresse, Tel, Date)
    const handleUpdate = async () => {
        try {
            const response = await api.put(`/patients/${id}/`, formData);
            setPatient(response.data);
            setIsEditing(false);
        } catch (error) {
            console.error("Erreur mise à jour", error);
        }
    };

    // Toggle Actif / Inactif (Désactivation)
    const toggleStatus = async () => {
        try {
            const newStatus = !patient.is_active;
            // On utilise PATCH pour ne modifier QUE le champ is_active
            const response = await api.patch(`/patients/${id}/`, { is_active: newStatus });
            setPatient(response.data);
            // On met aussi à jour le formData pour rester synchronisé
            setFormData(prev => ({ ...prev, is_active: newStatus }));
        } catch (error) {
            console.error("Erreur lors du changement de statut", error);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-[#FDFDFD]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8EBAE3]"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-8">
            
            {/* BARRE DE NAVIGATION HAUTE */}
            <div className="max-w-5xl mx-auto mb-8 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="text-gray-400 font-bold hover:text-[#8EBAE3] transition-all">
                    ← RETOUR
                </button>
                <div className="w-10"></div>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* COLONNE GAUCHE : INFOS PATIENT */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 relative overflow-hidden">
                        
                        {/* PASTILLE DE STATUT DYNAMIQUE */}
                        <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter transition-colors ${
                            patient.is_active ? "bg-[#98EAD3]/20 text-[#98EAD3]" : "bg-red-50 text-red-400"
                        }`}>
                            {patient.is_active ? "Patient Actif" : "Dossier Archivé"}
                        </div>

                        {/* AVATAR ET NOM */}
                        <div className="flex flex-col items-center mb-8">
                            <div className={`h-20 w-20 rounded-[2rem] text-white flex items-center justify-center text-2xl font-black mb-4 shadow-lg transition-all ${
                                patient.is_active ? "bg-gradient-to-br from-[#8EBAE3] to-[#98EAD3]" : "bg-gray-300"
                            }`}>
                                {patient.first_name?.[0]}{patient.last_name?.[0]}
                            </div>
                            <h2 className={`text-xl font-black text-center ${patient.is_active ? "text-gray-800" : "text-gray-400"}`}>
                                {patient.first_name} {patient.last_name}
                            </h2>
                            <p className="text-gray-400 text-xs font-medium">Inscrit le {new Date(patient.date_joined).toLocaleDateString()}</p>
                        </div>

                        <div className="space-y-4">
                            {/* DATE DE NAISSANCE */}
                            <div className="group">
                                <label className="text-[9px] font-black text-[#8EBAE3] uppercase tracking-widest block mb-1">Date de naissance</label>
                                {isEditing ? (
                                    <input 
                                        type="date"
                                        className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#8EBAE3]"
                                        value={formData.date_of_birth || ""}
                                        onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                                    />
                                ) : (
                                    <p className="text-sm font-bold text-gray-700">
                                        {patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : "Non renseignée"}
                                    </p>
                                )}
                            </div>

                            {/* COORDONNÉES (EMAIL) */}
                            <div className="group">
                                <label className="text-[9px] font-black text-[#8EBAE3] uppercase tracking-widest block mb-1">Email</label>
                                {isEditing ? (
                                    <input 
                                        className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#8EBAE3]"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    />
                                ) : (
                                    <p className="text-sm font-bold text-gray-700">{patient.email}</p>
                                )}
                            </div>

                            {/* TÉLÉPHONE */}
                            <div className="group">
                                <label className="text-[9px] font-black text-[#8EBAE3] uppercase tracking-widest block mb-1">Téléphone</label>
                                {isEditing ? (
                                    <input 
                                        className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#8EBAE3]"
                                        value={formData.phone_number}
                                        onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                                    />
                                ) : (
                                    <p className="text-sm font-bold text-gray-700">{patient.phone_number || "Non renseigné"}</p>
                                )}
                            </div>

                            {/* ADRESSE */}
                            <div className="group">
                                <label className="text-[9px] font-black text-[#8EBAE3] uppercase tracking-widest block mb-1">Adresse</label>
                                {isEditing ? (
                                    <textarea 
                                        className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#8EBAE3]"
                                        value={formData.address}
                                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    />
                                ) : (
                                    <p className="text-sm font-bold text-gray-700">{patient.address || "Aucune adresse"}</p>
                                )}
                            </div>

                            {/* ACTIONS */}
                            <div className="pt-6 space-y-3">
                                {isEditing ? (
                                    <button 
                                        onClick={handleUpdate}
                                        className="w-full py-3 bg-[#98EAD3] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#98EAD3]/20 hover:scale-[1.02] transition-transform"
                                    >
                                        Sauvegarder les changements
                                    </button>
                                ) : (
                                    <>
                                        <button 
                                            onClick={() => setIsEditing(true)}
                                            className="w-full py-3 border-2 border-[#8EBAE3] text-[#8EBAE3] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#8EBAE3] hover:text-white transition-all"
                                        >
                                            Modifier le dossier
                                        </button>
                                        
                                        {/* BOUTON DÉSACCTIVATION / RÉACTIVATION */}
                                        <button 
                                            onClick={toggleStatus}
                                            className={`w-full py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${
                                                patient.is_active 
                                                ? "border-red-100 text-red-400 hover:bg-red-50" 
                                                : "border-green-100 text-green-400 hover:bg-green-50"
                                            }`}
                                        >
                                            {patient.is_active ? "Désactiver le dossier" : "Réactiver le dossier"}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* COLONNE DROITE : TIMELINE ET NOTES */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50">
                        <div className="flex items-center gap-3 mb-8">
                            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Suivi des séances</h3>
                        </div>
                        <PatientTimeline patientId={id} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDetails;