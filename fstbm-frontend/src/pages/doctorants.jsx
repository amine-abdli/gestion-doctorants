import { useState, useEffect } from "react";
import { getJuries, addDoctorant, addJury } from "../services/api";
import "./style/doctorants.css";

export default function Doctorants({ onSuccess }) {

  const initialForm = {
    numero: "",
    nmb_inscription: "",
    nomfr: "",
    nomarb: "",
    cin: "",
    date_naissance: "",
    lieu_naissance_arb: "",
    discipline_fr: "",
    discipline_arb: "",
    specialite_fr: "",
    specialite_arb: "",
    sujet_fr: "",
    mention_fr: "",
    mention_arb: "",
    date_descution_jury: "",
    date_obtinu_diplome: "",
    status: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [juryList, setJuryList] = useState([]);
 const [selectedJury, setSelectedJury] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  //  jury 
  const [showNewJuryModal, setShowNewJuryModal] = useState(false);
  const [newJuryForm, setNewJuryForm] = useState({ nom: "", specialite: "", local: "" });
  const [addingJury, setAddingJury] = useState(false);

  useEffect(() => { loadJuries(); }, []);

  const loadJuries = () =>
    getJuries().then(r => setJuryList(r.data)).catch(console.error);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  
  const handleSelectJury = (jury) => {
    setSelectedJury(prev => [...prev, {
      uid: `${jury.id}-${Date.now()}`,
      id: jury.id,
      nom: jury.nom,
      role: "",
      grade: "",
      local: jury.local || ""
    }]);
  };

  // bjaf dyal les rol

  const handleJuryChange = (uid, field, value) => {
    setSelectedJury(prev => prev.map(j => j.uid === uid ? { ...j, [field]: value } : j));
  };

  const handleRemoveJury = (uid) => {
    setSelectedJury(prev => prev.filter(j => j.uid !== uid));
  };

  const handleNewJurySubmit = async (e) => {
    e.preventDefault();
    if (!newJuryForm.nom.trim()) { alert("Le nom est obligatoire."); return; }
    try {
      setAddingJury(true);
      const res = await addJury(newJuryForm);
      const created = res.data;
      setJuryList(prev => [...prev, created]);

      setSelectedJury(prev => [...prev, {
        uid: `${created.id}-${Date.now()}`,
        id: created.id,
        nom: created.nom,
        role: "",
        grade: "",
        local: created.local || ""
      }]);
      setNewJuryForm({ nom: "", specialite: "", local: "" });
      setShowNewJuryModal(false);
    } catch (err) {
      alert("Erreur: " + (err.response?.data?.message || "Erreur serveur"));
    } finally {
      setAddingJury(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      juries: selectedJury.map(j => ({ id: j.id, role: j.role, grade: j.grade, local: j.local }))
    };
    try {
      setSubmitting(true);
      await addDoctorant(dataToSend);
      alert("Doctorant ajouté avec succès !");
      resetForm();
      if (onSuccess) onSuccess();
    } catch (error) {
      const errors = error.response?.data?.errors;
      if (errors) alert("Erreurs:\n" + Object.values(errors).flat().join("\n"));
      else alert("Erreur: " + (error.response?.data?.message || "Erreur serveur"));
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => { setFormData(initialForm); setSelectedJury([]); };

  return (
    <div className="doctorants-page-container">
      <div className="doctorants-form-card">
        <h2>Inscription d'un Doctorant</h2>
        <form className="doctorants-form" onSubmit={handleSubmit}>

          <div className="input-group">
            <label htmlFor="numero">Numéro</label>
            <input type="text" name="numero" id="numero" value={formData.numero} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label htmlFor="nmb_inscription">N° Inscription *</label>
            <input type="text" name="nmb_inscription" id="nmb_inscription" value={formData.nmb_inscription} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label htmlFor="nomfr">Nom et prénom (FR)</label>
            <input type="text" name="nomfr" id="nomfr" value={formData.nomfr} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label htmlFor="nomarb">الإسم الكامل</label>
            <input type="text" name="nomarb" id="nomarb" value={formData.nomarb} onChange={handleChange} dir="rtl" />
          </div>
          <div className="input-group">
            <label htmlFor="cin">N° CIN *</label>
            <input type="text" name="cin" id="cin" value={formData.cin} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label htmlFor="date_naissance">Date de naissance</label>
            <input type="date" name="date_naissance" id="date_naissance" value={formData.date_naissance} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label htmlFor="lieu_naissance_arb">مكان الإزدياد</label>
            <input type="text" name="lieu_naissance_arb" id="lieu_naissance_arb" value={formData.lieu_naissance_arb} onChange={handleChange} dir="rtl" />
          </div>
          <div className="input-group">
            <label htmlFor="discipline_fr">Discipline</label>
            <input type="text" name="discipline_fr" id="discipline_fr" value={formData.discipline_fr} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label htmlFor="discipline_arb">المادة</label>
            <input type="text" name="discipline_arb" id="discipline_arb" value={formData.discipline_arb} onChange={handleChange} dir="rtl" />
          </div>
          <div className="input-group">
            <label htmlFor="specialite_fr">Spécialité</label>
            <input type="text" name="specialite_fr" id="specialite_fr" value={formData.specialite_fr} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label htmlFor="specialite_arb">التخصص</label>
            <input type="text" name="specialite_arb" id="specialite_arb" value={formData.specialite_arb} onChange={handleChange} dir="rtl" />
          </div>
          <div className="input-group full-width-field">
            <label htmlFor="sujet_fr">Sujet de thèse</label>
            <input type="text" name="sujet_fr" id="sujet_fr" value={formData.sujet_fr} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label htmlFor="mention_fr">Mention</label>
            <input type="text" name="mention_fr" id="mention_fr" value={formData.mention_fr} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label htmlFor="mention_arb">ميزة</label>
            <input type="text" name="mention_arb" id="mention_arb" value={formData.mention_arb} onChange={handleChange} dir="rtl" />
          </div>
          <div className="input-group">
            <label htmlFor="date_descution_jury">Date de soutenance</label>
            <input type="date" name="date_descution_jury" id="date_descution_jury" value={formData.date_descution_jury} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label htmlFor="date_obtinu_diplome">Date d'obtention diplôme</label>
            <input type="date" name="date_obtinu_diplome" id="date_obtinu_diplome" value={formData.date_obtinu_diplome} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label htmlFor="status">Statut</label>
            <select name="status" id="status" value={formData.status} onChange={handleChange}>
              <option value="">-- Sélectionner --</option>
              <option value="Actif">Actif</option>
              <option value="Diplômé">Diplômé</option>
              <option value="Suspendu">Suspendu</option>
            </select>
          </div>

          <div className="input-group full-width-field" style={{ marginTop: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>🎓 Membres du Jury</h3>
              <button type="button" className="btn-primary"
                style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                onClick={() => setShowNewJuryModal(true)}>
                + Créer nouveau jury
              </button>
            </div>

            {juryList.length > 0 ? (
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead style={{ background: '#f8fafc' }}>
                    <tr>
                      <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Nom</th>
                      <th style={{ padding: '8px 12px', fontWeight: 600, color: '#475569' }}>Spécialité</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>Ajouter</th>
                    </tr>
                  </thead>
                  <tbody>
                    {juryList.map(j => (
                      <tr key={j.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '8px 12px', fontWeight: 500 }}>{j.nom}</td>
                        <td style={{ padding: '8px 12px', color: '#64748b' }}>{j.specialite || "—"}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                       
                          <button type="button"
                            onClick={() => handleSelectJury(j)}
                            style={{
                              padding: '4px 14px', borderRadius: '6px', border: 'none',
                              background: '#dbeafe', color: '#1d4ed8',
                              fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem'
                            }}>
                            + Ajouter
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                Aucun jury disponible. Cliquez sur "Créer nouveau jury".
              </p>
            )}
          </div>

          {selectedJury.length > 0 && (
            <div className="input-group full-width-field">
              <h3 style={{ margin: '0 0 10px', fontSize: '0.95rem', color: '#0f172a' }}>
                 Jury attribué
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginLeft: '8px', fontWeight: 400 }}>
                  (le même jury peut avoir plusieurs rôles)
                </span>
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                <thead style={{ background: '#f1f5f9' }}>
                  <tr>
                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>Nom</th>
                    <th style={{ padding: '8px 10px' }}>Rôle</th>
                    <th style={{ padding: '8px 10px' }}>Grade</th>
                    <th style={{ padding: '8px 10px' }}>Établissement</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center' }}>×</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedJury.map(j => (
                    <tr key={j.uid} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '6px 10px', fontWeight: 600, color: '#0f172a' }}>{j.nom}</td>
                      <td style={{ padding: '4px 6px' }}>
                        <select
                          value={j.role}
                          onChange={e => handleJuryChange(j.uid, "role", e.target.value)}
                          style={{ width: '100%', padding: '5px 8px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                        >
                          <option value="">-- Rôle --</option>
                          <option value="Président">Président</option>
                          <option value="Rapporteur">Rapporteur</option>
                          <option value="Examinateur">Examinateur</option>
                          <option value="Co-encadrant">Co-encadrant</option>
                          <option value="Encadrant">Encadrant</option>
                          <option value="Membre">Membre</option>
                        </select>
                      </td>
                      <td style={{ padding: '4px 6px' }}>
                        <select
                          value={j.grade}
                          onChange={e => handleJuryChange(j.uid, "grade", e.target.value)}
                          style={{ width: '100%', padding: '5px 8px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                        >
                          <option value="">-- Grade --</option>
                          <option value="Professeur">Professeur</option>
                          <option value="Professeur Habilité">Professeur Habilité</option>
                          <option value="Maître de Conférences">Maître de Conférences</option>
                          <option value="Maître Assistant">Maître Assistant</option>
                          <option value="Docteur">Docteur</option>
                        </select>
                      </td>
                      <td style={{ padding: '4px 6px' }}>
                        <input
                          value={j.local}
                          placeholder="Ex: FST BM"
                          onChange={e => handleJuryChange(j.uid, "local", e.target.value)}
                          style={{ width: '100%', padding: '5px 8px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                        />
                      </td>
                      <td style={{ padding: '4px', textAlign: 'center' }}>
                        <button type="button" onClick={() => handleRemoveJury(j.uid)}
                          style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '4px 10px', fontWeight: 700 }}>
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="doctorants-actions">
            <button type="button" className="btn-secondary" onClick={resetForm}>Annuler</button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Enregistrement..." : "✔ Enregistrer"}
            </button>
          </div>

        </form>
      </div>

      {showNewJuryModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }}>
          <form onSubmit={handleNewJurySubmit} style={{
            background: '#fff', borderRadius: '12px', padding: '28px',
            width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '14px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.1rem' }}>➕ Créer un nouveau jury</h3>
            {[
              { name: 'nom', label: 'Nom complet *', placeholder: 'Ex: Prof. Ahmed Benali', required: true },
              { name: 'specialite', label: 'Spécialité', placeholder: 'Ex: Informatique' },
              { name: 'local', label: 'Établissement', placeholder: 'Ex: FST Béni Mellal' },
            ].map(f => (
              <div key={f.name} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>{f.label}</label>
                <input
                  type="text" name={f.name} value={newJuryForm[f.name]}
                  onChange={e => setNewJuryForm(p => ({ ...p, [f.name]: e.target.value }))}
                  placeholder={f.placeholder} required={f.required}
                  style={{ padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>
            ))}
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button type="button"
                onClick={() => { setShowNewJuryModal(false); setNewJuryForm({ nom: "", specialite: "", local: "" }); }}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontWeight: 600 }}>
                Annuler
              </button>
              <button type="submit" disabled={addingJury}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>
                {addingJury ? "..." : "✔ Créer & Sélectionner"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
