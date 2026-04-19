import React, { useState } from "react";
import { updateDoctorant } from "../services/api";
import "./style/EditDoctorantModal.css";

export default function EditDoctorantModal({ doctorant, juryList, onClose, onSuccess }) {
  const [form, setForm] = useState({
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
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 10001 }}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <h2 className="modal-title"> Modifier le Doctorant</h2>
          <button onClick={onClose} className="modal-close-btn">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="modal-grid">
            {[
              { name: 'nmb_inscription',     label: 'N° Inscription *',  type: 'text', required: true },
              { name: 'nomfr',               label: 'Nom (FR)',           type: 'text' },
              { name: 'nomarb',              label: 'الإسم',              type: 'text', dir: 'rtl' },
              { name: 'cin',                 label: 'CIN *',              type: 'text', required: true },
              { name: 'date_naissance',      label: 'Date naissance',     type: 'date' },
              { name: 'lieu_naissance_arb',  label: 'مكان الإزدياد',      type: 'text', dir: 'rtl' },
              { name: 'discipline_fr',       label: 'Discipline',         type: 'text' },
              { name: 'discipline_arb',      label: 'المادة (AR)',         type: 'text', dir: 'rtl' },
              { name: 'specialite_fr',       label: 'Spécialité',         type: 'text' },
              { name: 'specialite_arb',      label: 'التخصص (AR)',         type: 'text', dir: 'rtl' },
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
          </div>

          <div className="jury-section">
            <h3 className="jury-section-title"> Membres du Jury</h3>

            {juryList && juryList.length > 0 && (
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
