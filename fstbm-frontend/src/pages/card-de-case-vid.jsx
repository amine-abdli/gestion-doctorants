import { useState, useEffect } from 'react';
import "./style/style-de-case.css";
import { getJuries, addDoctorant, updateDoctorant } from '../services/api';

export default function CaseVid({ onclose, diploma }) {
  const [juryList, setJuryList] = useState([]);
  const [selectedJury, setSelectedJury] = useState([]);
  const [juryCounter, setJuryCounter] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });

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
    sujet_fr: diploma?.sujet_fr || ""
  };

  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  useEffect(() => {
    getJuries()
      .then(res => setJuryList(res.data))
      .catch(err => console.error("Erreur chargement jurys:", err));
  }, []);

  useEffect(() => {
    if (diploma?.juries && diploma?.juries.length > 0) {
      const juries = diploma.juries.map((j, idx) => ({
        uniqueId: `${j.id}-${idx}`,
        id: j.id,
        nom: j.nom,
        role: j.pivot?.role || "",
        grade: j.pivot?.grade || "",
        local: j.pivot?.local || "",
      }));
      setSelectedJury(juries);
      setJuryCounter(juries.length);
    } else {
      setSelectedJury([]);
      setJuryCounter(0);
    }
  }, [diploma]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectJury = (jury) => {
    const uniqueId = `${jury.id}-${juryCounter}`;
    setSelectedJury(prev => [...prev, {
      uniqueId: uniqueId,
      id: jury.id,
      nom: jury.nom,
      role: "",
      grade: "",
      local: jury.local || "",
    }]);
    setJuryCounter(prev => prev + 1);
  };

  const handleJuryChange = (uniqueId, field, value) => {
    setSelectedJury(prev =>
      prev.map(j => j.uniqueId === uniqueId ? { ...j, [field]: value } : j)
    );
  };

  const handleRemoveJury = (uniqueId) => {
    setSelectedJury(prev => prev.filter(j => j.uniqueId !== uniqueId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validation minimale
    if (!formData.nmb_inscription || !formData.cin) {
      setMessage({ type: 'error', text: 'N° Inscription et CIN sont obligatoires!' });
      return;
    }

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
        setMessage({ type: 'success', text: '✓ Doctorant mis à jour avec succès!' });
      } else {
        await addDoctorant(dataToSend);
        setMessage({ type: 'success', text: '✓ Doctorant enregistré avec succès!' });
      }
      
      setTimeout(() => {
        onclose();
      }, 1000);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      const errors = error.response?.data?.errors;
      if (errors) {
        const errorMessages = Object.values(errors).flat().join('\n');
        setMessage({ type: 'error', text: errorMessages });
      } else {
        setMessage({ 
          type: 'error', 
          text: error.response?.data?.message || error.message || 'Une erreur est survenue'
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="doctorants-overlay" onClick={onclose}>
      <div className="doctorants-modal" onClick={(e) => e.stopPropagation()}>

        <div className="modal-header">
          <h2>{diploma?.id ? "Mettre à jour le Doctorant" : "Enregistrement d'un Doctorant"}</h2>
          <button className="btn-close" onClick={onclose}>✕</button>
        </div>

        <div className="modal-body">
          <form className="doctorants-form" onSubmit={handleSubmit}>

            {message.text && (
              <div className={`message-alert message-${message.type}`} style={{
                gridColumn: '1 / -1',
                padding: '14px 16px',
                borderRadius: '10px',
                marginBottom: '12px',
                fontSize: '13px',
                fontWeight: '600',
              }}>
                {message.text}
              </div>
            )}

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
                              className="btn-add-jury"
                              onClick={() => handleSelectJury(j)}
                            >
                              + Ajouter
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

            {selectedJury.length > 0 && (
              <div className="full-width-field jury-assigned">
                <h4>Jury attribué :</h4>
                <div className="jury-table-container">
                  <table className="jury-table">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Rôle</th>
                        <th>Grade</th>
                        <th>Établissement</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedJury.map(j => (
                        <tr key={j.uniqueId}>
                          <td className="jury-nom">{j.nom}</td>
                          <td className="jury-field">
                            <select 
                              value={j.role}
                              onChange={e => handleJuryChange(j.uniqueId, 'role', e.target.value)}
                              className="jury-select"
                            >
                              <option value="">-- Sélectionner --</option>
                              <option value="Président">Président</option>
                              <option value="Rapporteur">Rapporteur</option>
                              <option value="Examinateur">Examinateur</option>
                              <option value="Invité">Invité</option>
                              <option value="Membre">Membre</option>
                            </select>
                          </td>
                          <td className="jury-field">
                            <select 
                              value={j.grade}
                              onChange={e => handleJuryChange(j.uniqueId, 'grade', e.target.value)}
                              className="jury-select"
                            >
                              <option value="">-- Sélectionner --</option>
                              <option value="Professeur">Professeur</option>
                              <option value="Professeur Habilité">Professeur Habilité</option>
                              <option value="Maître de Conférences">Maître de Conférences</option>
                              <option value="Maître Assistant">Maître Assistant</option>
                              <option value="Assistant">Assistant</option>
                              <option value="Doctorant">Doctorant</option>
                            </select>
                          </td>
                          <td className="jury-field">
                            <input 
                              type="text"
                              value={j.local} 
                              placeholder="Ex: FST BM"
                              className="jury-input"
                              onChange={e => handleJuryChange(j.uniqueId, 'local', e.target.value)}
                            />
                          </td>
                          <td className="jury-action">
                            <button 
                              type="button" 
                              className="btn-remove-jury"
                              onClick={() => handleRemoveJury(j.uniqueId)}
                            >
                              ✕ Retirer
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
              <button type="button" className="btn-secondary" onClick={onclose}>Annuler</button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? "En cours..." : (diploma?.id ? "Mettre à jour" : "Enregistrer")}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}