import { useState, useEffect } from "react";
import { getJuries, addJury, deleteJury, getDoctorants, attachJuryToDoctorant } from "../services/api";
import "./style/jury.css";

export default function Jury() {
    const [juryList, setJuryList]         = useState([]);
    const [doctorantsList, setDoctorantsList] = useState([]);
    const [loading, setLoading]           = useState(true);
    const [jurySearchTerm, setJurySearchTerm] = useState("");
    const [expandedJury, setExpandedJury] = useState(null);

    const [isAddJuryOpen, setIsAddJuryOpen] = useState(false);
    const [addForm, setAddForm]           = useState({ nom: "", specialite: "", local: "" });
    const [addSubmitting, setAddSubmitting] = useState(false);

    const [affectModal, setAffectModal]   = useState(null); 
    const [affectSearch, setAffectSearch] = useState("");
    const [affectForm, setAffectForm]     = useState({ doctorant_id: "", role: "", grade: "", local: "" });
    const [affectSubmitting, setAffectSubmitting] = useState(false);

    useEffect(() => {
        Promise.all([
            getJuries().then(r => setJuryList(r.data)),
            getDoctorants().then(r => setDoctorantsList(r.data))
        ]).finally(() => setLoading(false));
    }, []);

    const refreshJuries = () => getJuries().then(r => setJuryList(r.data));

    const filteredJury = juryList.filter(item =>
        (item.nom || "").toLowerCase().includes(jurySearchTerm.toLowerCase()) ||
        (item.specialite || "").toLowerCase().includes(jurySearchTerm.toLowerCase()) ||
        (item.local || "").toLowerCase().includes(jurySearchTerm.toLowerCase())
    );

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!addForm.nom.trim()) { alert("Le nom est obligatoire."); return; }
        try {
            setAddSubmitting(true);
            const res = await addJury(addForm);
            setJuryList(prev => [...prev, { ...res.data, doctorants: [] }]);
            setAddForm({ nom: "", specialite: "", local: "" });
            setIsAddJuryOpen(false);
        } catch (err) {
            alert("Erreur: " + (err.response?.data?.message || "Erreur serveur"));
        } finally {
            setAddSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer ce membre du jury ?")) return;
        try {
            await deleteJury(id);
            setJuryList(prev => prev.filter(j => j.id !== id));
            if (expandedJury === id) setExpandedJury(null);
        } catch { alert("Erreur lors de la suppression."); }
    };

    const openAffectModal = (jury) => {
        setAffectModal(jury);
        setAffectSearch("");
        setAffectForm({ doctorant_id: "", role: "", grade: "", local: jury.local || "" });
    };

    const handleSelectDoctorant = (doc) => {
        setAffectForm(f => ({ ...f, doctorant_id: doc.id }));
    };

    const handleAffectSubmit = async (e) => {
        e.preventDefault();
        if (!affectForm.doctorant_id) { alert("Veuillez sélectionner un doctorant."); return; }
        try {
            setAffectSubmitting(true);
            await attachJuryToDoctorant(affectModal.id, affectForm);
            await refreshJuries();
            setAffectModal(null);
            alert("Doctorant affecté avec succès !");
        } catch (err) {
            alert("Erreur: " + (err.response?.data?.message || "Erreur serveur"));
        } finally {
            setAffectSubmitting(false);
        }
    };

    const filteredDoctorantsForAffect = doctorantsList.filter(d => {
        const s = affectSearch.toLowerCase();
        return (d.nomfr || "").toLowerCase().includes(s) ||
               (d.nomarb || "").toLowerCase().includes(s) ||
               (d.nmb_inscription || "").toLowerCase().includes(s);
    });

    const selectedDoc = doctorantsList.find(d => d.id === affectForm.doctorant_id);

    return (
        <div className="jury-page-container">

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '16px' }}>
                <button className="btn-primary" onClick={() => setIsAddJuryOpen(true)}>
                    + Ajouter un membre
                </button>
                <input
                    type="text"
                    placeholder="Rechercher jury..."
                    value={jurySearchTerm}
                    onChange={e => setJurySearchTerm(e.target.value)}
                    style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '300px', fontSize: '0.9rem', outline: 'none' }}
                />
            </div>

            {isAddJuryOpen && (
                <div className="modal-overlay">
                    <form className="modal-content jury" onSubmit={handleAddSubmit}>
                        <h3>+ Ajouter un membre du Jury</h3>
                        <label>Nom complet *</label>
                        <input type="text" name="nom" value={addForm.nom}
                            onChange={e => setAddForm(f => ({...f, nom: e.target.value}))}
                            required placeholder="Ex: Prof. Ahmed Benali" />
                        <label>Spécialité</label>
                        <input type="text" name="specialite" value={addForm.specialite}
                            onChange={e => setAddForm(f => ({...f, specialite: e.target.value}))}
                            placeholder="Ex: Informatique" />
                        <label>Établissement</label>
                        <input type="text" name="local" value={addForm.local}
                            onChange={e => setAddForm(f => ({...f, local: e.target.value}))}
                            placeholder="Ex: FST Béni Mellal" />
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button type="button" className="btn-secondary" style={{ flex: 1 }}
                                onClick={() => setIsAddJuryOpen(false)}>Annuler</button>
                            <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={addSubmitting}>
                                {addSubmitting ? "..." : "Valider"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {affectModal && (
                <div className="modal-overlay" onClick={() => setAffectModal(null)}>
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: '#fff', borderRadius: '14px', padding: '28px',
                            width: '100%', maxWidth: '560px', maxHeight: '90vh',
                            overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>
                                Affecter un doctorant à <br />
                                <span style={{ color: '#2563eb' }}>{affectModal.nom}</span>
                            </h3>
                            <button onClick={() => setAffectModal(null)}
                                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}>✕</button>
                        </div>

                        <form onSubmit={handleAffectSubmit}>

                            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>
                                Sélectionner un doctorant
                            </label>
                            <input
                                type="text"
                                placeholder=" Nom, N° inscription..."
                                value={affectSearch}
                                onChange={e => setAffectSearch(e.target.value)}
                                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '8px', boxSizing: 'border-box' }}
                            />

                            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', maxHeight: '180px', overflowY: 'auto', marginBottom: '16px' }}>
                                {filteredDoctorantsForAffect.length > 0 ? filteredDoctorantsForAffect.map(doc => (
                                    <div key={doc.id}
                                        onClick={() => handleSelectDoctorant(doc)}
                                        style={{
                                            padding: '10px 14px', cursor: 'pointer',
                                            borderBottom: '1px solid #f1f5f9',
                                            background: affectForm.doctorant_id === doc.id ? '#eff6ff' : '#fff',
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            transition: 'background 0.1s'
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>
                                                {doc.nomfr || doc.nomarb || "—"}
                                            </div>
                                            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                                                {doc.nmb_inscription} • {doc.cin}
                                            </div>
                                        </div>
                                        {affectForm.doctorant_id === doc.id && (
                                            <span style={{ color: '#2563eb', fontWeight: 700, fontSize: '1rem' }}>✓</span>
                                        )}
                                    </div>
                                )) : (
                                    <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
                                        {doctorantsList.length === 0 ? "Aucun doctorant enregistré" : "Aucun résultat"}
                                    </div>
                                )}
                            </div>

                            {selectedDoc && (
                                <div style={{ padding: '10px 14px', background: '#eff6ff', borderRadius: '8px', marginBottom: '16px', fontSize: '0.875rem', color: '#1d4ed8', fontWeight: 500 }}>
                                    ✓ Sélectionné : {selectedDoc.nomfr || selectedDoc.nomarb} ({selectedDoc.nmb_inscription})
                                </div>
                            )}

                            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                                Rôle dans le jury *
                            </label>
                            <select
                                value={affectForm.role}
                                onChange={e => setAffectForm(f => ({...f, role: e.target.value}))}
                                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '12px', boxSizing: 'border-box' }}
                            >
                                <option value="">-- Sélectionner le rôle --</option>
                                <option value="Président">Président</option>
                                <option value="Rapporteur">Rapporteur</option>
                                <option value="Examinateur">Examinateur</option>
                                <option value="Co-encadrant">Co-encadrant</option>
                                <option value="Encadrant">Encadrant</option>
                                <option value="Directeur de these">Directeur de these </option>
                                <option value="Co-Directeur de these">Co-Directeur de these</option>
                                <option value="Membre">Membre</option>
                            </select>

                            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                                Grade
                            </label>
                            <select
                                value={affectForm.grade}
                                onChange={e => setAffectForm(f => ({...f, grade: e.target.value}))}
                                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '12px', boxSizing: 'border-box' }}
                            >
                                <option value="">-- Sélectionner le grade --</option>
                                <option value="Professeur">Professeur</option>
                                <option value="Professeur Habilité">Professeur Habilité</option>
                                <option value="Maître de Conférences">Maître de Conférences</option>
                                <option value="Maître Assistant">Maître Assistant</option>
                                <option value="Maitre de conferences">Maitre de conferences</option>
                                <option value="Maitre de conferences Habilité">Maitre de conferences Habilité</option>
                                <option value="Professeur de l'enseignement superieur">Professeur de l'enseignement superieur</option>
                            </select>

                            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                                Établissement
                            </label>
                            <input
                                type="text"
                                value={affectForm.local}
                                onChange={e => setAffectForm(f => ({...f, local: e.target.value}))}
                                placeholder="Ex: FST Béni Mellal"
                                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '20px', boxSizing: 'border-box' }}
                            />

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="button" onClick={() => setAffectModal(null)}
                                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>
                                    Annuler
                                </button>
                                <button type="submit" disabled={affectSubmitting || !affectForm.doctorant_id}
                                    style={{ flex: 2, padding: '10px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 600, cursor: 'pointer', opacity: (!affectForm.doctorant_id ? 0.6 : 1) }}>
                                    {affectSubmitting ? "Enregistrement..." : "✔ Confirmer l'affectation"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ════ Tableau des Jurys ════ */}
            <div className="affichagejury">
                {loading ? (
                    <p style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>Chargement...</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Nom complet</th>
                                <th>Spécialité</th>
                                <th>Établissement</th>
                                <th style={{ textAlign: 'center' }}>Doctorants</th>
                                <th style={{ textAlign: 'center' }}>Affecter</th>
                                <th style={{ textAlign: 'center' }}>Supprimer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredJury.length > 0 ? filteredJury.map(item => (
                                <>
                                    {/* ── Ligne jury ── */}
                                    <tr key={item.id}>
                                        <td style={{ fontWeight: 600, color: '#0f172a' }}>{item.nom}</td>
                                        <td style={{ color: '#475569', fontSize: '0.875rem' }}>{item.specialite || "—"}</td>
                                        <td style={{ color: '#475569', fontSize: '0.875rem' }}>{item.local || "—"}</td>

                                        {/* Bouton voir doctorants */}
                                        <td style={{ textAlign: 'center' }}>
                                            <button
                                                className="btn-action"
                                                onClick={() => setExpandedJury(prev => prev === item.id ? null : item.id)}
                                            >
                                                {expandedJury === item.id ? "▲ Masquer" : `▼ Voir (${item.doctorants?.length || 0})`}
                                            </button>
                                        </td>

                                        {/* Bouton affecter doctorant */}
                                        <td style={{ textAlign: 'center' }}>
                                            <button
                                                className="btn-primary"
                                                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                                                onClick={() => openAffectModal(item)}
                                            >
                                                📎 Affecter doctorant
                                            </button>
                                        </td>

                                        {/* Supprimer */}
                                        <td style={{ textAlign: 'center' }}>
                                            <button className="btn-danger" onClick={() => handleDelete(item.id)}>
                                                🗑 Supprimer
                                            </button>
                                        </td>
                                    </tr>

                                    {/* ── Accordion : doctorants associés ── */}
                                    {expandedJury === item.id && (
                                        <tr key={`expand-${item.id}`}>
                                            <td colSpan="6" style={{ padding: 0, background: '#f8fafc' }}>
                                                <div style={{ padding: '12px 24px' }}>
                                                    <strong style={{ fontSize: '0.82rem', color: '#64748b', display: 'block', marginBottom: '8px' }}>
                                                        📋 Doctorants associés à <em>{item.nom}</em> :
                                                    </strong>
                                                    {item.doctorants && item.doctorants.length > 0 ? (
                                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                                            <thead>
                                                                <tr style={{ background: '#e2e8f0' }}>
                                                                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Nom (FR)</th>
                                                                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>الإسم</th>
                                                                    <th style={{ padding: '8px 12px', textAlign: 'center' }}>N° Inscription</th>
                                                                    <th style={{ padding: '8px 12px', textAlign: 'center' }}>Rôle</th>
                                                                    <th style={{ padding: '8px 12px', textAlign: 'center' }}>Grade</th>
                                                                    <th style={{ padding: '8px 12px', textAlign: 'center' }}>Établissement</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {item.doctorants.map((d, idx) => (
                                                                    <tr key={`${d.id}-${idx}`} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                                        <td style={{ padding: '8px 12px', fontWeight: 500 }}>{d.nomfr || "—"}</td>
                                                                        <td style={{ padding: '8px 12px', textAlign: 'right', direction: 'rtl' }}>{d.nomarb || "—"}</td>
                                                                        <td style={{ padding: '8px 12px', textAlign: 'center', color: '#64748b', fontFamily: 'monospace' }}>{d.nmb_inscription || "—"}</td>
                                                                        <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                                                                            <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '2px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 600 }}>
                                                                                {d.pivot?.role || "—"}
                                                                            </span>
                                                                        </td>
                                                                        <td style={{ padding: '8px 12px', textAlign: 'center', color: '#475569' }}>{d.pivot?.grade || "—"}</td>
                                                                        <td style={{ padding: '8px 12px', textAlign: 'center', color: '#475569' }}>{d.pivot?.local || "—"}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    ) : (
                                                        <p style={{ color: '#94a3b8', fontSize: '0.85rem', padding: '8px 0' }}>
                                                            Aucun doctorant affecté à ce membre du jury.
                                                            <button
                                                                type="button"
                                                                onClick={() => { setExpandedJury(null); openAffectModal(item); }}
                                                                style={{ marginLeft: '8px', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.85rem' }}
                                                            >
                                                                Affecter maintenant →
                                                            </button>
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            )) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                                        {jurySearchTerm ? "Aucun résultat" : "Aucun jury enregistré. Cliquez sur '+ Ajouter un membre'."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
