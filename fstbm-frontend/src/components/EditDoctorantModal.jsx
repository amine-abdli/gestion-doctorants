import React, { useState, useEffect } from "react";
import { updateDoctorant } from "../services/api";
import "./style/EditDoctorantModal.css";

export default function EditDoctorantModal({ doctorant, juryList, onClose, onSuccess }) {

 const rolesarb = {
  "Président": "رئيسا",
  "Rapporteur": "عضو",
  "Examinateur": "عضو",
  "Co-encadrant": "عضو",
  "Invité": "عضو",
  "Encadrant": "عضو",
  "Directeur de thèse": "عضو",
  "Co-Directeur de thèse": "عضو",
  "Membre": "عضو"
};


const gradesarb = {
  "Maitre de conferences Habilité": "مؤهل محاضر أستاذ",
  "Maitre de conferences Habilitée": "مؤهل محاضر أستاذة",
  "Professeur de l'enseignement superieur": "العالي التعليم أستاذ",
  "Professeure de l'enseignement superieur": "العالي التعليم أستاذة"
};

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
      nomarb: j.nomarb || "",
      nom_modifier: j.pivot?.nom_modifier || j.nom_modifier || "",
      role: j.pivot?.role || j.role || "",
      rolearb: j.pivot?.rolearb || j.rolearb || "",
      grade: j.pivot?.grade || j.grade || "",
      graderb: j.pivot?.graderb || j.graderb || "",
      local: j.pivot?.local || j.local || "",
    }))
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (selectedJury.length > 0) {
  
      const nomsArabes = selectedJury.map(j => j.nomarb || j.nom);
      
      const nomLePlusLong = nomsArabes.reduce((a, b) => a.length > b.length ? a : b, "");
      const maxLength = nomLePlusLong.length;

      const nomsModifies = nomsArabes.map(nom => {
        if (!nom) return "";
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

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleJurySelect = (jury) => {
    setSelectedJury(prev => [
      ...prev,
      {
        uid: `${jury.id}-${Date.now()}`,
        id: jury.id,
        nom: jury.nom,
        nomarb: jury.nomarb || "",
        nom_modifier: "",  
        role: "",
        rolearb: "",
        grade: "",
        graderb: "",
        local: jury.local || ""
      }
    ]);
  };

  const handleJuryChange = (uid, field, value) => {
    setSelectedJury(prev => prev.map(j => j.uid === uid ? { ...j, [field]: value } : j));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const dataToSend = {
      ...form,
      juries: selectedJury.map(j => ({
        id: j.id,
        nom_modifier: j.nom_modifier,
        role: j.role,
        rolearb: j.rolearb,
        grade: j.grade,
        graderb: j.graderb,
        local: j.local
      }))
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
          <h2 className="modal-title">Modifier le Doctorant</h2>
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

          
          <div className="modal-field" style={{ marginTop: '8px' }}>
            <label className="modal-label">Sujet de thèse</label>
            <input
              type="text" name="sujet_fr" value={form.sujet_fr}
              onChange={handleChange}
              className="modal-input"
            />
          </div>

          <div className="jury-section">
            <h3 className="jury-section-title">Membres du Jury</h3>

            {juryList && juryList.length > 0 && (
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
                        <td>{j.nom}</td>
                        <td className="td-nomarb" dir="rtl">{j.nomarb || "—"}</td>
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
                      <td className="td-nom-jury">{j.nom}</td>
                      <td>
                        <select
                          value={j.role}
                          onChange={e => {
                            const selectedRole = e.target.value;
                            handleJuryChange(j.uid, "role", selectedRole);
                            handleJuryChange(j.uid, "rolearb", rolesarb[selectedRole] || "");
                          }}
                          className="modal-input-sm"
                        >
                          <option value="">-- Rôle --</option>
                          <option value="Président">Président</option>
                          <option value="Président">Présidente (F)</option>

                          <option value="Rapporteur">Rapporteur</option>
                          <option value="Rapporteur">Rapporteuse (F)</option>
                          <option value="Examinateur">Examinateur</option>
                          <option value="Examinateur">Examinatrice (F)</option>
                          <option value="Co-encadrant">Co-encadrant</option>
                          <option value="Co-encadrant">Co-encadrante (F)</option>
                          <option value="Invité">Invité</option>
                          <option value="Invité">Invitée (F)</option>
                          <option value="Encadrant">Encadrant</option>
                          <option value="Encadrant">Encadrante (F)</option>
                          <option value="Directeur de thèse">Directeur de thèse</option>
                          <option value="Directeur de thèse">Directrice de thèse (F)</option>
                          <option value="Co-Directeur de thèse">Co-Directeur de thèse</option>
                          <option value="Co-Directeur de thèse">Co-Directrice de thèse (F)</option>
                          <option value="Membre">Membre</option>
                        </select>
                      </td>
                      <td>
                        <span style={{ textAlign: 'center', display: 'block', direction: 'rtl', fontSize: '0.85rem' }}>
                          {j.rolearb || "---"}
                        </span>
                      </td>
                      <td>
                        <select
                          value={j.grade}
                          onChange={e => {
                            const selectedGrade = e.target.value;
                            handleJuryChange(j.uid, "grade", selectedGrade);
                            handleJuryChange(j.uid, "graderb", gradesarb[selectedGrade] || "");
                          }}
                          className="modal-input-sm"
                        >
                          <option value="">-- Grade --</option>
                          <option value="Maitre de conferences Habilité">Maitre de conferences Habilité</option>
                          <option value="Maitre de conferences Habilitée">Maitre de conferences Habilitée (F)</option>
                          <option value="Professeur de l'enseignement superieur">Professeur de l'enseignement superieur</option>
                          <option value="Professeure de l'enseignement superieur">Professeure de l'enseignement superieur (F)</option>
                        </select>
                      </td>
                      <td>
                        <span style={{ textAlign: 'center', display: 'block', direction: 'rtl', fontSize: '0.85rem' }}>
                          {j.graderb || "---"}
                        </span>
                      </td>
                      <td>
                        <input
                          value={j.local}
                          onChange={e => handleJuryChange(j.uid, "local", e.target.value)}
                          placeholder="Ex: FST BM"
                          className="modal-input-sm"
                        />
                      </td>
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
