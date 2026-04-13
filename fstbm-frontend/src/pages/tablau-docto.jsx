import React, { useState, useEffect } from "react";
import { getDoctorants, deleteDoctorant, updateDoctorant } from "../services/api";
import { getJuries, addJury } from "../services/api";
import Doctorants from "./doctorants";
import AficherDitailDeDoctoran from "./aficher-ditail-de-doctoran";
import "./style/tablau-docto.css";

export default function TablauDocto() {
  const [doctorants, setDoctorants] = useState([]);
  const [showDoctorantsForm, setShowDoctorantsForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ── Détails ──
  const [showDetails, setShowDetails] = useState(false);
  const [selectedDoctorant, setSelectedDoctorant] = useState(null);

  // ── Modifier ──
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [juryList, setJuryList] = useState([]);

  useEffect(() => {
    fetchDoctorants();
    getJuries().then(r => setJuryList(r.data)).catch(() => {});
  }, []);

  const fetchDoctorants = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getDoctorants();
      setDoctorants(res.data);
    } catch {
      setError("Impossible de charger les doctorants. Vérifiez que le serveur backend est démarré.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce doctorant ?")) return;
    try {
      await deleteDoctorant(id);
      setDoctorants(prev => prev.filter(d => d.id !== id));
    } catch {
      alert("Erreur lors de la suppression.");
    }
  };

  const handleEdit = (doctorant) => {
    setEditTarget(doctorant);
    setShowEditModal(true);
  };

  const filteredDoctorants = doctorants.filter(doc => {
    const s = searchTerm.toLowerCase();
    return (
      (doc.nomfr || "").toLowerCase().includes(s) ||
      (doc.nomarb || "").toLowerCase().includes(s) ||
      (doc.nmb_inscription || "").toLowerCase().includes(s) ||
      (doc.cin || "").toLowerCase().includes(s)
    );
  });

  return (
    <div className="doctorants-container">
      <div className="doctorants-wrapper">

        {/* ── Header ── */}
        <div className="doctorants-header">
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div className="doctorants-stats">
              {doctorants.length} doctorant{doctorants.length !== 1 ? "s" : ""}
            </div>
            {!showDoctorantsForm && (
              <button className="btn-add-header" onClick={() => setShowDoctorantsForm(true)}>
                + Ajouter
              </button>
            )}
            <button className="btn-add-header" onClick={fetchDoctorants} title="Actualiser">
              ↻ Actualiser
            </button>
          </div>
        </div>

        {/* ── Erreur ── */}
        {error && (
          <div style={{ padding: '12px 16px', background: '#fef2f2', borderRadius: '8px', color: '#dc2626', marginBottom: '16px', fontWeight: 500 }}>
            ⚠️ {error}
          </div>
        )}

        {/* ── Formulaire Ajout ── */}
        {showDoctorantsForm && (
          <div style={{ position: 'relative', marginBottom: '2rem' }}>
            <button
              onClick={() => setShowDoctorantsForm(false)}
              className="btn-close"
              title="Fermer"
              style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 10 }}
            >
              ✕
            </button>
            <Doctorants onSuccess={() => { setShowDoctorantsForm(false); fetchDoctorants(); }} />
          </div>
        )}

        {/* ── Recherche ── */}
        {!loading && !showDoctorantsForm && doctorants.length > 0 && (
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Nom, CIN, N° inscription..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <span className="search-results">
                {filteredDoctorants.length} résultat{filteredDoctorants.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}

        {/* ── Chargement ── */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>Chargement...</div>
        )}

        {/* ── Tableau ── */}
        {!loading && !showDoctorantsForm && (
          <>
            {doctorants.length > 0 ? (
              <div className="table-container">
                <table className="doctorants-table">
                  <thead>
                    <tr>
                      <th>N° Inscription</th>
                      <th>Nom (FR)</th>
                      <th>الإسم</th>
                      <th>CIN</th>
                      <th>Discipline</th>
                      <th>Statut</th>
                      <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDoctorants.map(doc => (
                      <tr key={doc.id}>
                        <td style={{ fontFamily: 'monospace', color: '#475569' }}>{doc.nmb_inscription || "—"}</td>
                        <td style={{ fontWeight: 600, color: '#0f172a' }}>{doc.nomfr || "—"}</td>
                        <td dir="rtl" style={{ color: '#0f172a' }}>{doc.nomarb || "—"}</td>
                        <td style={{ color: '#64748b' }}>{doc.cin || "—"}</td>
                        <td style={{ color: '#475569' }}>{doc.discipline_fr || doc.discipline_arb || "—"}</td>
                        <td>
                          <span style={{
                            padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 600,
                            background: doc.status === 'Diplômé' ? '#dcfce7' : doc.status === 'Suspendu' ? '#fef2f2' : '#f1f5f9',
                            color: doc.status === 'Diplômé' ? '#16a34a' : doc.status === 'Suspendu' ? '#dc2626' : '#475569'
                          }}>
                            {doc.status || "—"}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions" style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                            {/* Voir détails */}
                            <button
                              className="btn-view"
                              onClick={() => { setSelectedDoctorant(doc); setShowDetails(true); }}
                              title="Voir les détails"
                            >
                              👁 Voir
                            </button>
                            {/* Modifier */}
                            <button
                              className="btn-view"
                              style={{ background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a' }}
                              onClick={() => handleEdit(doc)}
                              title="Modifier"
                            >
                              ✏ Modifier
                            </button>
                            {/* Supprimer */}
                            <button
                              className="btn-delete"
                              onClick={() => handleDelete(doc.id)}
                              title="Supprimer"
                            >
                              🗑 Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-message">
                <div className="empty-icon"></div>
                <p>Aucun doctorant enregistré.</p>
                <p>Cliquez sur "Ajouter" pour commencer.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Détails Doctorant ── */}
      {showDetails && selectedDoctorant && (
        <AficherDitailDeDoctoran
          doctorant={selectedDoctorant}
          onClose={() => setShowDetails(false)}
        />
      )}

      {/* ── Modal Modifier ── */}
      {showEditModal && editTarget && (
        <EditDoctorantModal
          doctorant={editTarget}
          juryList={juryList}
          onClose={() => { setShowEditModal(false); setEditTarget(null); }}
          onSuccess={() => { setShowEditModal(false); setEditTarget(null); fetchDoctorants(); }}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Modal de Modification d'un Doctorant
═══════════════════════════════════════════ */
function EditDoctorantModal({ doctorant, juryList, onClose, onSuccess }) {
  const [form, setForm] = useState({
    numero: doctorant.numero || "",
    nmb_inscription: doctorant.nmb_inscription || "",
    nomfr: doctorant.nomfr || "",
    nomarb: doctorant.nomarb || "",
    cin: doctorant.cin || "",
    date_naissance: doctorant.date_naissance || "",
    lieu_naissance_arb: doctorant.lieu_naissance_arb || "",
    discipline_fr: doctorant.discipline_fr || "",
    discipline_arb: doctorant.discipline_arb || "",
    specialite_fr: doctorant.specialite_fr || "",
    specialite_arb: doctorant.specialite_arb || "",
    sujet_fr: doctorant.sujet_fr || "",
    mention_fr: doctorant.mention_fr || "",
    mention_arb: doctorant.mention_arb || "",
    date_descution_jury: doctorant.date_descution_jury || "",
    date_obtinu_diplome: doctorant.date_obtinu_diplome || "",
    status: doctorant.status || "",
  });

  const [selectedJury, setSelectedJury] = useState(
    (doctorant.juries || []).map(j => ({
      id: j.id, nom: j.nom,
      role: j.pivot?.role || "",
      grade: j.pivot?.grade || "",
      local: j.pivot?.local || "",
    }))
  );
  const [submitting, setSubmitting] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleJurySelect = (jury) => {
    if (selectedJury.find(j => j.id === jury.id)) return;
    setSelectedJury(prev => [...prev, { id: jury.id, nom: jury.nom, role: "", grade: "", local: jury.local || "" }]);
  };

  const handleJuryChange = (id, field, value) => {
    setSelectedJury(prev => prev.map(j => j.id === id ? { ...j, [field]: value } : j));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const dataToSend = {
      ...form,
      juries: selectedJury.map(j => ({ id: j.id, role: j.role, grade: j.grade, local: j.local }))
    };
    try {
      setSubmitting(true);
      await updateDoctorant(doctorant.id, dataToSend);
      alert("Doctorant mis à jour !");
      onSuccess();
    } catch (err) {
      const errors = err.response?.data?.errors;
      alert(errors ? Object.values(errors).flat().join("\n") : (err.response?.data?.message || "Erreur serveur"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, padding: '20px'
    }}
      onClick={onClose}
    >
      <div style={{
        background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '800px',
        maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
      }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '20px 28px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>✏️ Modifier le Doctorant</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px 28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>

            {[
              { name: 'numero', label: 'Numéro', type: 'text' },
              { name: 'nmb_inscription', label: 'N° Inscription *', type: 'text', required: true },
              { name: 'nomfr', label: 'Nom (FR)', type: 'text' },
              { name: 'nomarb', label: 'الإسم', type: 'text', dir: 'rtl' },
              { name: 'cin', label: 'CIN *', type: 'text', required: true },
              { name: 'date_naissance', label: 'Date naissance', type: 'date' },
              { name: 'lieu_naissance_arb', label: 'مكان الإزدياد', type: 'text', dir: 'rtl' },
              { name: 'discipline_fr', label: 'Discipline', type: 'text' },
              { name: 'specialite_fr', label: 'Spécialité', type: 'text' },
              { name: 'mention_fr', label: 'Mention', type: 'text' },
              { name: 'date_descution_jury', label: 'Date soutenance', type: 'date' },
              { name: 'date_obtinu_diplome', label: "Date diplôme", type: 'date' },
            ].map(f => (
              <div key={f.name} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>{f.label}</label>
                <input
                  type={f.type} name={f.name} value={form[f.name]}
                  onChange={handleChange} required={f.required} dir={f.dir}
                  style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>
            ))}

            {/* Statut */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>Statut</label>
              <select name="status" value={form.status} onChange={handleChange}
                style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}>
                <option value="">-- Sélectionner --</option>
                <option value="Actif">Actif</option>
                <option value="Diplômé">Diplômé</option>
                <option value="Suspendu">Suspendu</option>
              </select>
            </div>
          </div>

          {/* ── Jury ── */}
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: '1rem', color: '#0f172a' }}>🎓 Membres du Jury</h3>

            {/* Sélection */}
            {juryList.length > 0 && (
              <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '12px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead style={{ background: '#f8fafc' }}>
                    <tr>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>Nom</th>
                      <th style={{ padding: '8px 12px' }}>Spécialité</th>
                      <th style={{ padding: '8px 12px' }}>Ajouter</th>
                    </tr>
                  </thead>
                  <tbody>
                    {juryList.map(j => (
                      <tr key={j.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '6px 12px' }}>{j.nom}</td>
                        <td style={{ padding: '6px 12px', color: '#64748b' }}>{j.specialite || "—"}</td>
                        <td style={{ padding: '6px 12px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleJurySelect(j)}
                            disabled={!!selectedJury.find(s => s.id === j.id)}
                            style={{
                              padding: '3px 12px', borderRadius: '6px', border: 'none',
                              background: selectedJury.find(s => s.id === j.id) ? '#dcfce7' : '#dbeafe',
                              color: selectedJury.find(s => s.id === j.id) ? '#16a34a' : '#1d4ed8',
                              fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem'
                            }}
                          >
                            {selectedJury.find(s => s.id === j.id) ? "✓ Ajouté" : "Ajouter"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Jurys sélectionnés avec rôles */}
            {selectedJury.length > 0 && (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead style={{ background: '#f1f5f9' }}>
                  <tr>
                    <th style={{ padding: '8px' }}>Nom</th>
                    <th style={{ padding: '8px' }}>Rôle</th>
                    <th style={{ padding: '8px' }}>Grade</th>
                    <th style={{ padding: '8px' }}>Établissement</th>
                    <th style={{ padding: '8px' }}>×</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedJury.map(j => (
                    <tr key={j.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '6px 8px', fontWeight: 600 }}>{j.nom}</td>
                      {['role', 'grade', 'local'].map(field => (
                        <td key={field} style={{ padding: '4px' }}>
                          <input
                            value={j[field]}
                            onChange={e => handleJuryChange(j.id, field, e.target.value)}
                            placeholder={field === 'role' ? 'Ex: Président' : field === 'grade' ? 'Ex: Prof.' : 'Ex: FST BM'}
                            style={{ width: '100%', padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.85rem' }}
                          />
                        </td>
                      ))}
                      <td style={{ padding: '4px', textAlign: 'center' }}>
                        <button type="button"
                          onClick={() => setSelectedJury(prev => prev.filter(x => x.id !== j.id))}
                          style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '3px 8px' }}>
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
            <button type="button" onClick={onClose}
              style={{ flex: 1, padding: '11px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>
              Annuler
            </button>
            <button type="submit" disabled={submitting}
              style={{ flex: 2, padding: '11px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
              {submitting ? "Enregistrement..." : "✔ Sauvegarder les modifications"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
