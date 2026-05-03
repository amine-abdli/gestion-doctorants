import { useState, useEffect } from "react";
import { getJuries, addDoctorant, addJury } from "../services/api";
import "./style/doctorants.css";

export default function Doctorants({ onSuccess }) {

  const initialForm = {

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
    status: "",
  };
  const rolesarb = {
  "Président": "رئيسا",
  "Rapporteur": "عضو",
  "Examinateur": "عضو",
  "Co-encadrant": "عضو",
  "Invité": "عضو",
  "Encadrant": "عضو",
  "Directeur de thèse": "عضو",
  "Co-Directeur de thèse": "عضو",
  "Membre": "عضو",
   "Présidente": "رئيسا",
   "Rapporteuse": "عضو",
   "Examinatrice": "عضو",
   "Co-encadrante": "عضو",
   "Invitée": "عضو",
   "Encadrante": "عضو",
   "Directrice de thèse": "عضو",
   "Co-Directrice de thèse": "عضو",
   "Membre": "عضو"
};


const gradesarb = {
  "Maitre de conferences Habilite": "مؤهل محاضر أستاذ",
  "Maitre de conferences Habilitee": "مؤهل محاضر أستاذة",
  "Professeur de l'enseignement superieur": "العالي التعليم أستاذ",
  "Professeure de l'enseignement superieur": "العالي التعليم أستاذة"
};
// const gradesarb = {
//   "Professeur": "أستاذ",
//   "Professeur Habilité": "أستاذ مؤهل",
//   "Maître de Conférences Habilité": "أستاذ محاضر مؤهل",
//   "Maître Assistant": "أستاذ مساعد",
//   "Maitre de conferences": "أستاذ محاضر",
//   "Maitre de conferences Habilité": "أستاذ محاضر مؤهل",
//   "Professeur de l'enseignement superieur": "أستاذ التعليم العالي"
// };
  const [formData, setFormData] = useState(initialForm);
  const [juryList, setJuryList] = useState([]);
  const [selectedJury, setSelectedJury] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [showNewJuryModal, setShowNewJuryModal] = useState(false);
  const [newJuryForm, setNewJuryForm] = useState({ nom: "", nomarb: "", specialite: "", local: "", F: false });
  const [addingJury, setAddingJury] = useState(false);

  useEffect(() => { loadJuries(); }, []);

  useEffect(() => {
    if (selectedJury.length > 0) {
      const nomsArabes = selectedJury.map(j => j.nomarb || j.nom);
      
      const nomLePlusLong = nomsArabes.reduce((a, b) => a.length > b.length ? a : b, "");
      const maxLength = nomLePlusLong.length;

      const nomsModifies = nomsArabes.map(nom => {
        if (!nom) return "vide";
        const diff = maxLength - nom.length;
        if (diff <= 0) return nom;
        return nom.slice(0, -1) + "ـ".repeat(diff) + nom.slice(-1);
      });

      const updatedJury = selectedJury.map((jury, idx) => ({
        ...jury,
        nom_modifier: nomsModifies[idx] || jury.nom_modifier
      }));
      
      const hasChanged = updatedJury.some((jury, idx) => 
        jury.nom_modifier !== selectedJury[idx].nom_modifier
      );
      
      if (hasChanged) {
        setSelectedJury(updatedJury);
      }
    }
  }, [selectedJury.map(j => j.nomarb || j.nom).join('|')]);

  const loadJuries = () =>
    getJuries().then(r => setJuryList(r.data)).catch(console.error);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSelectJury = (jury) => {
    setSelectedJury(prev => [...prev, {
      uid: `${jury.id}-${Date.now()}`,
      id: jury.id,
      nom: jury.nom,
      nomarb: jury.nomarb || "",
      F: jury.F || false,
      nom_modifier: "",  
      role: "",
      grade: "",
      graderb: "",
      rolearb: "",
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
        nomarb: created.nomarb || "",
        F: created.F || false,
        nom_modifier: "", 
        role: "",
        rolearb: "",
        graderb: "",
        grade: "",
        local: created.local || ""
      }]);

      setNewJuryForm({ nom: "", nomarb: "", specialite: "", local: "", F: false });
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
      juries: selectedJury.map(j => ({ id: j.id, nom_modifier: j.nom_modifier, role: j.role, rolearb: j.rolearb, grade: j.grade, graderb: j.graderb, local: j.local }))
    };
    try {
      setSubmitting(true);
      await addDoctorant(dataToSend);
      alert("Doctorant ajouté avec succès !");
      resetForm();
      if (onSuccess) onSuccess();
      console.log("Noms modifiés:", selectedJury.map(j => j.nom_modifier));
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
                      <th>الإسم الكامل</th>
                      <th>Spécialité</th>
                      <th>Ajouter</th>
                    </tr>
                  </thead>
                  <tbody>
                    {juryList.map(j => (
                      <tr key={j.id}>
                        <td className="jury-td-nom">{j.nom}</td>
                        <td className="jury-td-nomarb">{j.nomarb || "—"}</td>
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
                      <th>nomarb modifier</th>
                      <th>Rôle</th>
                      <th>الدور</th>
                      <th>Grade</th>
                      <th>الرتبة</th>
                      <th>Établissement</th>
                      <th>×</th>
                    </tr>
                  </thead>
                  <tbody>

                    {selectedJury.map(j => (
                      <tr key={j.uid}>
                        <td className="jury-sel-nom">{j.nom}</td>
                        <td className="jury-sel-nom">{j.nom_modifier}</td>

                        <td className="jury-sel-cell">
                          <select
                            value={j.role}
                            onChange={e => {
                              const selectedRole = e.target.value;
                              handleJuryChange(j.uid, "role", selectedRole);
                              handleJuryChange(j.uid, "rolearb", rolesarb[selectedRole] || "");
                            }}
                            className="jury-sel-select"
                          >
                              <option value="">-- Rôle --</option>
                              {j.F ? (
                                <>
                                  <option value="Présidente">Présidente</option>
                                  <option value="Rapporteuse">Rapporteuse</option>
                                  <option value="Examinatrice">Examinatrice</option>
                                  <option value="Co-encadrante">Co-encadrante</option>
                                  <option value="Invitée">Invitée</option>
                                  <option value="Encadrante">Encadrante</option>
                                  <option value="Directrice de thèse">Directrice de thèse</option>
                                  <option value="Co-Directrice de thèse">Co-Directrice de thèse</option>
                                  <option value="Membre">Membre</option>
                                </>
                              ) : (
                                <>
                                  <option value="Président">Président</option>
                                  <option value="Rapporteur">Rapporteur</option>
                                  <option value="Examinateur">Examinateur</option>
                                  <option value="Co-encadrant">Co-encadrant</option>
                                  <option value="Invité">Invité</option>
                                  <option value="Encadrant">Encadrant</option>
                                  <option value="Directeur de thèse">Directeur de thèse</option>
                                  <option value="Co-Directeur de thèse">Co-Directeur de thèse</option>
                                  <option value="Membre">Membre</option>
                                </>
                              )}
                          </select>
                        </td>
                        <td className="jury-sel-cell">
                          <span style={{ textAlign: 'center', display: 'block', direction: 'rtl' }}>
                            {j.rolearb || "---"}
                          </span>
                        </td>
                        <td className="jury-sel-cell">
                          <select
                            value={j.grade}
                            onChange={e => {
                              const selectedGrade = e.target.value;
                              handleJuryChange(j.uid, "grade", selectedGrade);
                              handleJuryChange(j.uid, "graderb", gradesarb[selectedGrade] || "");
                            }}
                            className="jury-sel-select"
                          >
                            <option value="">-- Sélectionner le grade --</option>
                            {j.F ? (
                              <>
                                <option value="Maitre de conferences Habilitee">Maitre de conferences Habilitée</option>
                                <option value="Professeure de l'enseignement superieur">Professeure de l'enseignement superieur</option>
                              </>
                            ) : (
                              <>
                                <option value="Maitre de conferences Habilite">Maitre de conferences Habilité</option>
                                <option value="Professeur de l'enseignement superieur">Professeur de l'enseignement superieur</option>
                              </>
                            )}
                          </select>
                        </td>
                        <td className="jury-sel-cell">
                          <span style={{ textAlign: 'center', display: 'block', direction: 'rtl' }}>
                            {j.graderb || "---"}
                          </span>
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
        <div className="new-jury-overlay" onClick={() => { setShowNewJuryModal(false); setNewJuryForm({ nom: "", nomarb: "", specialite: "", local: "", F: false }); }}>
          <form className="new-jury-modal" onSubmit={handleNewJurySubmit} onClick={e => e.stopPropagation()}>
            <h3 className="new-jury-title"> Créer un nouveau jury</h3>
            {[
              { name: 'nom', label: 'Nom complet *', placeholder: 'Ex: Prof. Ahmed Benali', required: true },
              { name: 'nomarb', label: 'الإسم الكامل', placeholder: 'الإسم الكامل' },
              { name: 'specialite', label: 'Spécialité', placeholder: 'Spécialité' },
              { name: 'local', label: 'Établissement', placeholder: ' FST Béni Mellal' },
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', marginTop: '4px' }}>
              <input
                type="checkbox"
                id="new-jury-F"
                checked={newJuryForm.F}
                onChange={e => setNewJuryForm(p => ({ ...p, F: e.target.checked }))}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="new-jury-F" style={{ cursor: 'pointer', fontWeight: 500, margin: 0 }}>Féminin (F)</label>
            </div>
            <div className="new-jury-actions">
              <button type="button" className="btn-secondary"
                onClick={() => { setShowNewJuryModal(false); setNewJuryForm({ nom: "", nomarb: "", specialite: "", local: "", F: false }); }}>
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
