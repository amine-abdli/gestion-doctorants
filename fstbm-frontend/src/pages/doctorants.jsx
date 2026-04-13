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

  const [formData, setFormData]         = useState(initialForm);
  const [juryList, setJuryList]         = useState([]);
  const [selectedJury, setSelectedJury] = useState([]);
  const [submitting, setSubmitting]     = useState(false);

  const [showNewJuryModal, setShowNewJuryModal] = useState(false);
  const [newJuryForm, setNewJuryForm]           = useState({ nom: "", specialite: "", local: "" });
  const [addingJury, setAddingJury]             = useState(false);

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

        <h2 className="form-card-title">Inscription d'un Doctorant</h2>

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
          

          <div className="input-group full-width-field jury-section-wrapper">
            <div className="jury-section-header">
              <h3 className="jury-section-title">Membres du Jury</h3>
              <button type="button" className="btn-create-jury" onClick={() => setShowNewJuryModal(true)}>
                + Créer nouveau jury
              </button>
            </div>

            {juryList.length > 0 ? (
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
                        <td className="jury-td-nom">{j.nom}</td>
                        <td className="jury-td-specialite">{j.specialite || "—"}</td>
                        <td className="jury-td-action">
                          <button type="button" className="btn-jury-add" onClick={() => handleSelectJury(j)}>
                            + Ajouter
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="jury-empty-msg">Aucun jury disponible. Cliquez sur "Créer nouveau jury".</p>
            )}
          </div>
          {selectedJury.length > 0 && (
            <div className="input-group full-width-field">
              <div className="jury-selected-header">
                <h3 className="jury-section-title">
                  Jury attribué
                   </h3>
              </div>
              <div className="jury-selected-wrapper">
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
                        <td className="jury-sel-nom">{j.nom}</td>
                        <td className="jury-sel-cell">
                          <select
                            value={j.role}
                            onChange={e => handleJuryChange(j.uid, "role", e.target.value)}
                            className="jury-sel-select"
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
                        <td className="jury-sel-cell">
                          <select
                            value={j.grade}
                            onChange={e => handleJuryChange(j.uid, "grade", e.target.value)}
                            className="jury-sel-select"
                          >
                            <option value="">-- Grade --</option>
                            <option value="Professeur">Professeur</option>
                            <option value="Professeur Habilité">Professeur Habilité</option>
                            <option value="Maître de Conférences">Maître de Conférences</option>
                            <option value="Maître Assistant">Maître Assistant</option>
                            <option value="Docteur">Docteur</option>
                          </select>
                        </td>
                        <td className="jury-sel-cell">
                          <input
                            value={j.local}
                            placeholder="Ex: FST BM"
                            onChange={e => handleJuryChange(j.uid, "local", e.target.value)}
                            className="jury-sel-input"
                          />
                        </td>
                        <td className="jury-sel-remove">
                          <button type="button" onClick={() => handleRemoveJury(j.uid)} className="btn-remove-jury">
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
        <div className="new-jury-overlay" onClick={() => { setShowNewJuryModal(false); setNewJuryForm({ nom: "", specialite: "", local: "" }); }}>
          <form className="new-jury-modal" onSubmit={handleNewJurySubmit} onClick={e => e.stopPropagation()}>
            <h3 className="new-jury-title"> Créer un nouveau jury</h3>
            {[
              { name: 'nom',       label: 'Nom complet *',  placeholder: 'Ex: Prof. Ahmed Benali', required: true },
              { name: 'specialite',label: 'Spécialité',     placeholder: 'Ex: Informatique' },
              { name: 'local',     label: 'Établissement',  placeholder: 'Ex: FST Béni Mellal' },
            ].map(f => (
              <div key={f.name} className="new-jury-field">
                <label className="new-jury-label">{f.label}</label>
                <input
                  type="text" name={f.name} value={newJuryForm[f.name]}
                  onChange={e => setNewJuryForm(p => ({ ...p, [f.name]: e.target.value }))}
                  placeholder={f.placeholder} required={f.required}
                  className="new-jury-input"
                />
              </div>
            ))}
            <div className="new-jury-actions">
              <button type="button" className="btn-secondary"
                onClick={() => { setShowNewJuryModal(false); setNewJuryForm({ nom: "", specialite: "", local: "" }); }}>
                Annuler
              </button>
              <button type="submit" className="btn-primary" disabled={addingJury}>
                {addingJury ? "..." : "✔ Créer & Sélectionner"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
