import React, { useState, useEffect } from 'react';
import API from '../services/api';
import "./style/sautn.css";

export default function Soutn() {
  const [doctorants, setDoctorants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedDoctorant, setSelectedDoctorant] = useState(null);
  const [form, setForm] = useState({ date: "", resume: "", mot_cle: "", local: "", heure: "" });
  const [submitting, setSubmitting] = useState(false);

  const [editingDoctorant, setEditingDoctorant] = useState(null);
  const [editForm, setEditForm] = useState({ date: "", resume: "", mot_cle: "", local: "", heure: "" });
  const [editSubmitting, setEditSubmitting] = useState(false);

  const [expandedJury, setExpandedJury] = useState(null);

  useEffect(() => {
    fetchDoctorants();
  }, []);

  const fetchDoctorants = async () => {
    try {
      setLoading(true);
      const res = await API.get("/doctorants");
      setDoctorants(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des doctorants:", err);
    } finally {
      setLoading(false);
    }
  };

  const rows = doctorants.filter(d => d.date_descution_jury);

  const filtered = rows.filter(r =>
    (r.nomfr || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.nomarb || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.nmb_inscription || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer la date de soutenance de ce doctorant ?")) return;
    try {
      await API.put(`/doctorants/${id}`, { date_descution_jury: null });
      fetchDoctorants();
    } catch (err) {
      alert("Erreur lors du retrait de la soutenance.");
    }
  };

  const handleGenerateAvis = async (doctorantId) => {
    try {
      const response = await API.get(`/generate-avis-soutenance?doctorantId=${doctorantId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `avis_soutenance_${doctorantId}.docx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert("Erreur lors de la génération de l'avis de soutenance.");
    }
  };

  const handleGenerateAttestation = async (doctorantId, juryId, nomJury, roleJury) => {
    try {
      const response = await API.get(`/generate-attestation`, {
        params: {
          doctorantId,
          juryId,
          nomJury,
          roleJury
        },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attestation_${juryId}_${Date.now()}.docx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert("Erreur lors de la génération de l'attestation.");
    }
  };

  const handleGenerateinvitation = async (doctorantId, juryId, nomJury, roleJury) => {
    try {
      const doctorant = doctorants.find(d => d.id === doctorantId);
      const response = await API.get(`/generate-invitation`, {
        params: {
          doctorantId,
          juryId,
          nomJury,
          roleJury,
          nomdoctor: doctorant?.nomfr || '',
          datsotno: doctorant?.date_descution_jury || '',
          horer: doctorant?.heure_soutenance || '',
          local: doctorant?.local_soutenance || ''
        },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invitation_${juryId}_${Date.now()}.docx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert("Erreur lors de la génération de l'invitation.");
    }
  };

  const handleSelectDoctorant = (doctorant) => {
    setSelectedDoctorant(doctorant);
    setForm({ date: "",resume: "", mot_cle: "", local: "", heure: "" });
  };

  const handleReset = () => {
    setSelectedDoctorant(null);
    setForm({ date: "", resume: "", mot_cle: "", local: "", heure: "" });
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctorant) return;
    try {
      setSubmitting(true);
      await API.put(`/doctorants/${selectedDoctorant.id}`, {
        date_descution_jury: form.date,
        resume: form.resume,
        mot_cle: form.mot_cle,
        local_soutenance: form.local,
        heure_soutenance: form.heure,
      });
      alert(`Soutenance planifiée pour ${selectedDoctorant.nomfr} ${selectedDoctorant.nomarb}`);
      fetchDoctorants();
      handleReset();
    } catch (err) {
      alert("Erreur lors de la planification de la soutenance.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEdit = (item) => {
    setEditingDoctorant(item);
    setEditForm({
      date: item.date_descution_jury || "",
      resume: item.resume || "",
      mot_cle: item.mot_cle || "",
      local: item.local_soutenance || "",
      heure: item.heure_soutenance || "",
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingDoctorant) return;
    try {
      setEditSubmitting(true);
      await API.put(`/doctorants/${editingDoctorant.id}`, {
        date_descution_jury: editForm.date,
        resume: editForm.resume,
        mot_cle: editForm.mot_cle,
        local_soutenance: editForm.local,
        heure_soutenance: editForm.heure,
      });
      alert("Soutenance mise à jour avec succès !");
      fetchDoctorants();
      setEditingDoctorant(null);
    } catch (err) {
      alert("Erreur lors de la modification de la soutenance.");
    } finally {
      setEditSubmitting(false);
    }
  };

  return (
    <div className="soutenance-page-container">

     
      <div className="soutenance-header">
        <h2>Gestion des Soutenances</h2>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="search-wrapper">
            <input
              type="search"
              placeholder="Rechercher un doctorant..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            className="btn-primary"
            onClick={() => { setShowForm(true); setSelectedDoctorant(null); }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Ajouter une soutenance
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="soutenance-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>الإسم</th>
              <th>Date</th>
              <th>Local</th>
              <th>Heure</th>
             
              <th>Actions</th>
              <th>Document</th>
              <th>Jury</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="empty-state">Chargement...</td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map(item => (
                <React.Fragment key={item.id}>
                  <tr>
                    <td className="nom-cell">{(item.nomfr || "—").toUpperCase()}</td>
                    <td dir="rtl">{item.nomarb || "—"}</td>
                    <td>
                      <span className="date-cell">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        {item.date_descution_jury}
                      </span>
                    </td>
                    <td>
                      <span className="local-badge">
                        {item.local_soutenance || "—"}
                      </span>
                    </td>
                    <td>
                      <span className="heure-badge">
                        {item.heure_soutenance || "—"}
                      </span>
                    </td>
                   
                 
                    <td>
                      <button
                        className="btn-action btn-edit"
                        title="Modifier"
                        onClick={() => handleOpenEdit(item)}
                      >
                        Modifier
                      </button>
                      <button
                        className="btn-action btn-delete"
                        title="Supprimer"
                        onClick={() => handleDelete(item.id)}
                      >
                        Supprimer
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn-action btn-print"
                        onClick={() => handleGenerateAvis(item.id)}
                        style={{display: 'flex', alignItems: 'center', gap: '4px'}}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 6 2 18 2 18 9"></polyline>
                          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                          <rect x="6" y="14" width="12" height="8"></rect>
                        </svg>
                        Générer Avis
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn-action btn-edit"
                        onClick={() => setExpandedJury(prev => prev === item.id ? null : item.id)}
                      >
                        {expandedJury === item.id ? "▲ Masquer" : `▼ Jury (${item.juries?.length || 0})`}
                      </button>
                    </td>
                  </tr>

                  {expandedJury === item.id && (
                    <tr>
                      <td colSpan="10" style={{ padding: 0, background: '#f8fafc' }}>
                        <div style={{ padding: '12px 24px' }}>
                          <strong style={{ fontSize: '0.82rem', color: '#64748b', display: 'block', marginBottom: '8px' }}>
                             Membres du Jury :
                          </strong>
                          {item.juries && item.juries.length > 0 ? (
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                              <thead>
                                <tr style={{ background: '#e2e8f0' }}>
                                  <th style={{ padding: '8px 12px', textAlign: 'left' }}>Nom</th>
                                  <th style={{ padding: '8px 12px', textAlign: 'right' }}>الإسم</th>
                                  <th style={{ padding: '8px 12px', textAlign: 'center' }}>Rôle</th>
                                  <th style={{ padding: '8px 12px', textAlign: 'center' }}>Grade</th>
                                  <th >invitation</th>
                                  <th>document</th>
                                </tr>
                              </thead>
                              <tbody>
                                {item.juries.map((jury, idx) => (
                                  <tr key={`${jury.id}-${idx}`} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '8px 12px', fontWeight: 500 }}>{jury.nom || "—"}</td>
                                    <td style={{ padding: '8px 12px', textAlign: 'right', direction: 'rtl' }}>{jury.nomarb || "—"}</td>
                                    <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                                      <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '2px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 600 }}>
                                        {jury.pivot?.role || "—"}
                                      </span>
                                    </td>
                                    <td style={{ padding: '8px 12px', textAlign: 'center', color: '#475569' }}>{jury.pivot?.grade || "—"}</td>
                                    <td style={{ padding: '8px 12px', textAlign: 'center', color: '#475569' }}> <button
                                        onClick={() => handleGenerateinvitation(item.id, jury.id, jury.nom, jury.pivot?.role)}
                                        className="btn-action btn-print"
                                        title="Générer Attestation"
                                      >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                          <polyline points="6 9 6 2 18 2 18 9"></polyline>
                                          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                                          <rect x="6" y="14" width="12" height="8"></rect>
                                        </svg>
                                        invitation
                                      </button>
                                      </td>
                                    <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                                      <button
                                        onClick={() => handleGenerateAttestation(item.id, jury.id, jury.nom, jury.pivot?.role)}
                                        className="btn-action btn-print"
                                        title="Générer Attestation"
                                      >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                          <polyline points="6 9 6 2 18 2 18 9"></polyline>
                                          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                                          <rect x="6" y="14" width="12" height="8"></rect>
                                        </svg>
                                        Attestation
                                      </button>
                                    </td>
                                  </tr>
                                  
                                ))}
                            
                              </tbody>
                            </table>
                          ) : (
                            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Aucun jury assigné à ce doctorant.</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="empty-state">Aucune soutenance trouvée</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div
          className="modal-overlay"
          onClick={(e) => { if (e.target.classList.contains('modal-overlay')) handleReset(); }}
        >
          <div className="modal-content">

            <div className="modal-header">
              <h3>
                {selectedDoctorant ? ' Planifier la Soutenance' : ' Sélectionner un Doctorant'}
              </h3>
              <button className="modal-close-btn" onClick={handleReset}>✕</button>
            </div>

            <div className="modal-table-wrapper">
              <table className="modal-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>الإسم</th>
                    <th>N° Inscription</th>
                    <th>Discipline</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="empty-state">Chargement...</td>
                    </tr>
                  ) : doctorants.length > 0 ? (
                    doctorants.map(doc => {
                      const isSelected = selectedDoctorant?.id === doc.id;
                      return (
                        <tr
                          key={doc.id}
                          className={isSelected ? 'selected-row' : ''}
                        >
                          <td><strong>{(doc.nomfr || "—").toUpperCase()}</strong></td>
                          <td dir="rtl">{doc.nomarb || "—"}</td>
                          <td className="muted">{doc.nmb_inscription || "—"}</td>
                          <td className="muted">{doc.discipline_fr || "—"}</td>
                          <td>
                            {isSelected ? (
                              <span className="selected-indicator">✔ Sélectionné</span>
                            ) : (
                              <button
                                className="btn-select"
                                onClick={() => handleSelectDoctorant(doc)}
                              >
                                Sélectionner
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="empty-state">Aucun doctorant trouvé</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {selectedDoctorant && (
              <div className="soutenance-form-panel">
                <div className="selected-doctorant-banner">
                  <span>
                    Doctorant sélectionné : {(selectedDoctorant.nomfr || "").toUpperCase()} {selectedDoctorant.nomarb}
                  </span>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label> Date de soutenance</label>
                      <input
                        type="date"
                        value={form.date}
                        onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label> Résumé</label>
                      <textarea
                        value={form.resume}
                        onChange={e => setForm(f => ({ ...f, resume: e.target.value }))}
                        required
                        placeholder="Entrez le résumé de la soutenance"
                      />
                    </div>

                    <div className="form-group">
                      <label> Mots-clés</label>
                      <input
                        value={form.mot_cle}
                        onChange={e => setForm(f => ({ ...f, mot_cle: e.target.value }))}
                        required
                        placeholder="Entrez les mots-clés séparés par des virgules"
                      />
                    </div>
                    <div className="form-group">
                      <label> Lieu / Local</label>
                      <input
                        value={form.local}
                        onChange={e => setForm(f => ({ ...f, local: e.target.value }))}
                        required
                        placeholder="Ex: Salle 24, FST"
                      />
                    </div>
                    <div className="form-group">
                      <label> Heure</label>
                      <input
                        type="time"
                        value={form.heure}
                        onChange={e => setForm(f => ({ ...f, heure: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setSelectedDoctorant(null)}
                    >
                      ← Changer le doctorant
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={submitting}
                    >
                      {submitting ? "Enregistrement..." : "✔ Valider la Soutenance"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {!selectedDoctorant && (
              <div className="modal-cancel-wrapper">
                <button className="btn-secondary" onClick={handleReset}>
                  Annuler
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {editingDoctorant && (
        <div
          className="modal-overlay"
          onClick={(e) => { if (e.target.classList.contains('modal-overlay')) setEditingDoctorant(null); }}
        >
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Modifier la Soutenance</h3>
              <button className="modal-close-btn" onClick={() => setEditingDoctorant(null)}>✕</button>
            </div>

            <div className="selected-doctorant-banner" style={{ margin: '16px 0' }}>
              <span>
                Doctorant : {(editingDoctorant.nomfr || "").toUpperCase()} {editingDoctorant.nomarb || ""}
              </span>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Date de soutenance</label>
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={e => setEditForm(f => ({ ...f, date: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Résumé</label>
                  <textarea
                    value={editForm.resume}
                    onChange={e => setEditForm(f => ({ ...f, resume: e.target.value }))}
                    required
                    placeholder="Entrez le résumé de la soutenance"
                  />
                </div>
                <div className="form-group">
                  <label>Mots-clés</label>
                  <input
                    value={editForm.mot_cle}
                    onChange={e => setEditForm(f => ({ ...f, mot_cle: e.target.value }))}
                    required
                    placeholder="Entrez les mots-clés séparés par des virgules"
                  />
                </div>
                <div className="form-group">
                  <label>Lieu / Local</label>
                  <input
                    value={editForm.local}
                    onChange={e => setEditForm(f => ({ ...f, local: e.target.value }))}
                    required
                    placeholder="Ex: Salle 24, FST"
                  />
                </div>
                <div className="form-group">
                  <label>Heure</label>
                  <input
                    type="time"
                    value={editForm.heure}
                    onChange={e => setEditForm(f => ({ ...f, heure: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setEditingDoctorant(null)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={editSubmitting}
                >
                  {editSubmitting ? "Enregistrement..." : "✔ Sauvegarder les modifications"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}