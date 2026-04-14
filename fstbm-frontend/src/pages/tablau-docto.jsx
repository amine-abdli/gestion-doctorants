import React, { useState, useEffect } from "react";
import { getDoctorants, deleteDoctorant, updateDoctorant } from "../services/api";
import { getJuries, addJury } from "../services/api";
import Doctorants from "./doctorants";
import AficherDitailDeDoctoran from "./aficher-ditail-de-doctoran";
import "./style/tablau-docto.css";

function getCompletionStatus(doc) {
  const requiredFields = [
    'nmb_inscription', 'nomfr', 'nomarb', 'cin',
    'date_naissance', 'lieu_naissance_arb',
    'discipline_fr', 'specialite_fr',
    'sujet_fr', 'mention_fr',
    'date_descution_jury', 'date_obtinu_diplome', 'status'
  ];
  for (let field of requiredFields) {
    if (!doc[field] || String(doc[field]).trim() === '') {
      return 'attente';
    }
  }

  if (!doc.juries) {
    return 'attente';
  }

  return 'complet';
}
export default function TablauDocto() {
  const [doctorants, setDoctorants] = useState([]);
  const [showDoctorantsForm, setShowDoctorantsForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showDetails, setShowDetails] = useState(false);
  const [selectedDoctorant, setSelectedDoctorant] = useState(null);
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

        <div className="doctorants-header">
          <div className="header-group">
            <div className="doctorants-stats">
              {doctorants.length} doctorants
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

        {showDoctorantsForm && (
          <div className="form-overlay-wrapper">
            <button
              onClick={() => setShowDoctorantsForm(false)}
              className="btn-close"
              title="Fermer"
            >
              ✕
            </button>
            <Doctorants onSuccess={() => { setShowDoctorantsForm(false); fetchDoctorants(); }} />
          </div>
        )}

        {!loading && !showDoctorantsForm && doctorants.length > 0 && (
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder=" Nom, CIN, N inscription..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <span className="search-results">
                {filteredDoctorants.length} résultats
              </span>
            )}
          </div>
        )}


        {!loading && !showDoctorantsForm && (
          <>
            {doctorants.length > 0 ? (
              <div className="table-container">
                <table className="doctorants-table">
                  <thead>
                    <tr>
                      <th>N° Inscription</th>
                      <th>Nom</th>
                      <th>الإسم</th>
                      <th>CIN</th>
                      <th>Discipline</th>
                      
                      <th className="td-center">Dossier</th>
                      <th className="td-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDoctorants.map(doc => {
                      const dossier = getCompletionStatus(doc);
                   

                      return (
                        <tr key={doc.id}>
                          <td className="td-inscription">{doc.nmb_inscription || "—"}</td>
                          <td className="td-nom">{doc.nomfr || "—"}</td>
                          <td className="td-nomarb" dir="rtl">{doc.nomarb || "—"}</td>
                          <td className="td-cin">{doc.cin || "—"}</td>
                          <td className="td-discipline">{doc.discipline_fr || doc.discipline_arb || "—"}</td>
                          
                          <td className="td-center">
                            <span className={`badge-dossier badge-dossier--${dossier}`}>
                              {dossier === 'complet' ? ' Complet' : ' En attente'}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button
                                className="btn-view"
                                onClick={() => { setSelectedDoctorant(doc); setShowDetails(true); }}
                                title="Voir les détails"
                              >
                                Voir
                              </button>
                             <button
                                className="btn-modifier"
                                onClick={() => handleEdit(doc)}
                                title="Modifier"
                              >
                                Modifier
                              </button>
                              <button
                                className="btn-delete"
                                onClick={() => handleDelete(doc.id)}
                                title="Supprimer"
                              >
                                Supprimer
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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

      {showDetails && selectedDoctorant && (
        <AficherDitailDeDoctoran
          doctorant={selectedDoctorant}
          onClose={() => setShowDetails(false)}
        />
      )}

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
      uid: `${j.id}-${Date.now()}-${Math.random()}`,
      id: j.id,
      nom: j.nom,
      role: j.pivot?.role || j.role || "",
      grade: j.pivot?.grade || j.grade || "",
      local: j.pivot?.local || j.local || "",
    }))
  );
  const [submitting, setSubmitting] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleJurySelect = (jury) => {
    setSelectedJury(prev => [
      ...prev,
      { uid: `${jury.id}-${Date.now()}`, id: jury.id, nom: jury.nom, role: "", grade: "", local: jury.local || "" }
    ]);
  };

  const handleJuryChange = (uid, field, value) => {
    setSelectedJury(prev => prev.map(j => j.uid === uid ? { ...j, [field]: value } : j));
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <h2 className="modal-title"> Modifier le Doctorant</h2>
          <button onClick={onClose} className="modal-close-btn">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="modal-grid">
            {[
              { name: 'numero',              label: 'Numéro',            type: 'text' },
              { name: 'nmb_inscription',     label: 'N° Inscription *',  type: 'text', required: true },
              { name: 'nomfr',               label: 'Nom (FR)',           type: 'text' },
              { name: 'nomarb',              label: 'الإسم',              type: 'text', dir: 'rtl' },
              { name: 'cin',                 label: 'CIN *',              type: 'text', required: true },
              { name: 'date_naissance',      label: 'Date naissance',     type: 'date' },
              { name: 'lieu_naissance_arb',  label: 'مكان الإزدياد',      type: 'text', dir: 'rtl' },
              { name: 'discipline_fr',       label: 'Discipline',         type: 'text' },
              { name: 'specialite_fr',       label: 'Spécialité',         type: 'text' },
              { name: 'mention_fr',          label: 'Mention',            type: 'text' },
              { name: 'date_descution_jury', label: 'Date soutenance',    type: 'date' },
              { name: 'date_obtinu_diplome', label: 'Date diplôme',       type: 'date' },
            ].map(f => (
              <div key={f.name} className="modal-field">
                <label className="modal-label">{f.label}</label>
                <input
                  type={f.type} name={f.name} value={form[f.name]}
                  onChange={handleChange} required={f.required} dir={f.dir}
                  className="modal-input"
                />
              </div>
            ))}

            <div className="modal-field">
              <label className="modal-label">Statut</label>
              <select name="status" value={form.status} onChange={handleChange} className="modal-select">
                <option value="">-- Sélectionner --</option>
                <option value="Actif">Actif</option>
                <option value="Diplômé">Diplômé</option>
                <option value="Suspendu">Suspendu</option>
              </select>
            </div>
          </div>

          <div className="jury-section">
            <h3 className="jury-section-title"> Membres du Jury</h3>

            {juryList.length > 0 && (
              <div className="jury-picker-wrapper">
                <table className="jury-picker-table">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Spécialité</th>
                      <th>Ajouter</th>
                    </tr>
                  </thead>
                  <tbody>
                    {juryList.map(j => (
                      <tr key={j.id}>
                        <td>{j.nom}</td>
                        <td className="td-specialite">{j.specialite || "—"}</td>
                        <td className="td-action">
                          <button
                            type="button"
                            onClick={() => handleJurySelect(j)}
                            className="btn-jury-add btn-jury-add--available"
                          >
                            + Ajouter
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedJury.length > 0 && (
              <table className="jury-selected-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Rôle</th>
                    <th>Grade</th>
                    <th>Établissement</th>
                    <th>×</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedJury.map(j => (
                    <tr key={j.uid}>
                      <td className="td-nom-jury">{j.nom}</td>
                      {['role', 'grade', 'local'].map(field => (
                        <td key={field}>
                          <input
                            value={j[field]}
                            onChange={e => handleJuryChange(j.uid, field, e.target.value)}
                            placeholder={field === 'role' ? 'Ex: Président' : field === 'grade' ? 'Ex: Prof.' : 'Ex: FST BM'}
                            className="modal-input-sm"
                          />
                        </td>
                      ))}
                      <td className="td-remove">
                        <button
                          type="button"
                          onClick={() => setSelectedJury(prev => prev.filter(x => x.uid !== j.uid))}
                          className="btn-remove-jury"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-modal-cancel">
              Annuler
            </button>
            <button type="submit" disabled={submitting} className="btn-modal-save">
              {submitting ? "Enregistrement..." : "✔ Sauvegarder les modifications"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
