import { useState, useEffect } from 'react';
import "./style/style-de-case.css";
import { getJuries, addDoctorant, updateDoctorant } from '../services/api';

export default function CaseVid({ onclose, diploma }) {
  const [juryList, setJuryList] = useState([]);
  const [selectedJury, setSelectedJury] = useState([]);

  const initialForm = {
    numero: diploma?.numero || "",
    nmb_inscription: diploma?.nmb_inscription || "",
    nomfr: diploma?.nomfr || "",
    nomarb: diploma?.nomarb || "",
    cin: diploma?.cin || "",
    date_naissance: diploma?.date_naissance || "",
    lieu_naissance_arb: diploma?.lieu_naissance_arb || "",
    discipline_fr: diploma?.discipline_fr || "",
    discipline_arb: diploma?.discipline_arb || "",
    specialite_fr: diploma?.specialite_fr || "",
    specialite_arb: diploma?.specialite_arb || "",
    sujet_fr: diploma?.sujet_fr || "",
    mention_fr: diploma?.mention_fr || "",
    mention_arb: diploma?.mention_arb || "",
    date_descution_jury: diploma?.date_descution_jury || "",
    date_obtinu_diplome: diploma?.date_obtinu_diplome || "",
    status: diploma?.status || "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  // Bloquer le scroll du body
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  // Charger la liste des jurys
  useEffect(() => {
    getJuries()
      .then(res => setJuryList(res.data))
      .catch(err => console.error("Erreur chargement jurys:", err));
  }, []);

  // Pré-remplir les jurys si on édite un doctorant existant
  useEffect(() => {
    if (diploma?.juries) {
      setSelectedJury(diploma.juries.map(j => ({
        id: j.id,
        nom: j.nom,
        role: j.pivot?.role || "",
        grade: j.pivot?.grade || "",
        local: j.pivot?.local || "",
      })));
    }
  }, [diploma]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectJury = (jury) => {
    if (selectedJury.find(j => j.id === jury.id)) return;
    setSelectedJury(prev => [...prev, {
      id: jury.id,
      nom: jury.nom,
      role: "",
      grade: "",
      local: jury.local || "",
    }]);
  };

  const handleJuryChange = (id, field, value) => {
    setSelectedJury(prev =>
      prev.map(j => j.id === id ? { ...j, [field]: value } : j)
    );
  };

  const handleRemoveJury = (id) => {
    setSelectedJury(prev => prev.filter(j => j.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      juries: selectedJury.map(j => ({
        id: j.id,
        role: j.role,
        grade: j.grade,
        local: j.local,
      }))
    };

    try {
      setSubmitting(true);
      if (diploma?.id) {
        await updateDoctorant(diploma.id, dataToSend);
        alert("Doctorant mis à jour avec succès !");
      } else {
        await addDoctorant(dataToSend);
        alert("Doctorant enregistré avec succès !");
      }
      onclose();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      const errors = error.response?.data?.errors;
      if (errors) {
        alert("Erreurs:\n" + Object.values(errors).flat().join("\n"));
      } else {
        alert("Erreur: " + (error.response?.data?.message || error.message));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="doctorants-overlay" onClick={onclose}>
      <div className="doctorants-modal" onClick={(e) => e.stopPropagation()}>

        <div className="modal-header">
          <h2>{diploma ? "Mettre à jour le Doctorant" : "Inscription d'un Doctorant"}</h2>
          <button className="btn-close" onClick={onclose}>✕</button>
        </div>

        <div className="modal-body">
          <form className="doctorants-form" onSubmit={handleSubmit}>

            <div className="input-group">
              <label htmlFor="cv-numero">Numéro</label>
              <input type="text" name="numero" id="cv-numero" value={formData.numero} onChange={handleChange} placeholder="Ex: D2026-001" />
            </div>

            <div className="input-group">
              <label htmlFor="cv-nmb_inscription">رقم التسجيل (N° Inscription) *</label>
              <input type="text" name="nmb_inscription" id="cv-nmb_inscription" value={formData.nmb_inscription} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label htmlFor="cv-nomfr">Nom et prénom</label>
              <input type="text" name="nomfr" id="cv-nomfr" value={formData.nomfr} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label htmlFor="cv-nomarb">الإسم الكامل</label>
              <input type="text" name="nomarb" id="cv-nomarb" value={formData.nomarb} onChange={handleChange} dir="rtl" />
            </div>

            <div className="input-group">
              <label htmlFor="cv-cin">N° CIN / رقم البطاقة *</label>
              <input type="text" name="cin" id="cv-cin" value={formData.cin} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label htmlFor="cv-date_naissance">Date de naissance</label>
              <input type="date" name="date_naissance" id="cv-date_naissance" value={formData.date_naissance} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label htmlFor="cv-lieu_naissance_arb">مكان الإزدياد</label>
              <input type="text" name="lieu_naissance_arb" id="cv-lieu_naissance_arb" value={formData.lieu_naissance_arb} onChange={handleChange} dir="rtl" />
            </div>

            <div className="input-group">
              <label htmlFor="cv-discipline_fr">Discipline</label>
              <input type="text" name="discipline_fr" id="cv-discipline_fr" value={formData.discipline_fr} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label htmlFor="cv-discipline_arb">المادة</label>
              <input type="text" name="discipline_arb" id="cv-discipline_arb" value={formData.discipline_arb} onChange={handleChange} dir="rtl" />
            </div>

            <div className="input-group">
              <label htmlFor="cv-specialite_fr">Spécialité</label>
              <input type="text" name="specialite_fr" id="cv-specialite_fr" value={formData.specialite_fr} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label htmlFor="cv-specialite_arb">التخصص</label>
              <input type="text" name="specialite_arb" id="cv-specialite_arb" value={formData.specialite_arb} onChange={handleChange} dir="rtl" />
            </div>

            <div className="input-group full-width-field">
              <label htmlFor="cv-sujet_fr">Sujet de thèse</label>
              <input type="text" name="sujet_fr" id="cv-sujet_fr" value={formData.sujet_fr} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label htmlFor="cv-mention_fr">Mention</label>
              <input type="text" name="mention_fr" id="cv-mention_fr" value={formData.mention_fr} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label htmlFor="cv-mention_arb">ميزة</label>
              <input type="text" name="mention_arb" id="cv-mention_arb" value={formData.mention_arb} onChange={handleChange} dir="rtl" />
            </div>

            <div className="input-group">
              <label htmlFor="cv-date_descution_jury">Date de soutenance</label>
              <input type="date" name="date_descution_jury" id="cv-date_descution_jury" value={formData.date_descution_jury} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label htmlFor="cv-date_obtinu_diplome">Date d'obtention du diplôme</label>
              <input type="date" name="date_obtinu_diplome" id="cv-date_obtinu_diplome" value={formData.date_obtinu_diplome} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label htmlFor="cv-status">Statut</label>
              <select name="status" id="cv-status" value={formData.status} onChange={handleChange}>
                <option value="">-- Sélectionner --</option>
                <option value="Actif">Actif</option>
                <option value="Diplômé">Diplômé</option>
                <option value="Suspendu">Suspendu</option>
              </select>
            </div>

            {/* Sélection du jury */}
            <div className="input-group full-width-field">
              <h3>Membres du Jury</h3>
              {juryList.length > 0 ? (
                <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Spécialité</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {juryList.map(j => (
                        <tr key={j.id}>
                          <td>{j.nom}</td>
                          <td>{j.specialite || "—"}</td>
                          <td>
                            <button
                              type="button"
                              onClick={() => handleSelectJury(j)}
                              disabled={!!selectedJury.find(s => s.id === j.id)}
                            >
                              {selectedJury.find(s => s.id === j.id) ? "✓ Ajouté" : "Ajouter"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Aucun jury disponible. Créez d'abord des membres de jury.</p>
              )}
            </div>

            {/* Jurys sélectionnés */}
            {selectedJury.length > 0 && (
              <div className="full-width-field">
                <h4>Jury attribué :</h4>
                <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                      <tr key={j.id}>
                        <td>{j.nom}</td>
                        <td>
                          <input value={j.role} placeholder="Ex: Président"
                            onChange={e => handleJuryChange(j.id, 'role', e.target.value)} />
                        </td>
                        <td>
                          <input value={j.grade} placeholder="Ex: Professeur"
                            onChange={e => handleJuryChange(j.id, 'grade', e.target.value)} />
                        </td>
                        <td>
                          <input value={j.local} placeholder="Ex: FST BM"
                            onChange={e => handleJuryChange(j.id, 'local', e.target.value)} />
                        </td>
                        <td>
                          <button type="button" onClick={() => handleRemoveJury(j.id)}>✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="doctorants-actions">
              <button type="button" className="btn-secondary" onClick={onclose}>Annuler</button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? "En cours..." : (diploma ? "Mettre à jour" : "Enregistrer")}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}