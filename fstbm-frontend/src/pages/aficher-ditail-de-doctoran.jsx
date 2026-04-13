import React from "react";
import "./style/aficher-ditail-de-doctoran.css";

export default function AficherDitailDeDoctoran({ doctorant, onClose }) {
  if (!doctorant) return null;

  return (
    <div className="details-container">
      <div className="doctorant-details">
        <h2>Détails du Doctorant</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <p><strong>N° Inscription:</strong> {doctorant.nmb_inscription || "—"}</p>
          <p><strong>Numéro:</strong> {doctorant.numero || "—"}</p>
          <p><strong>Nom (FR):</strong> {doctorant.nomfr || "—"}</p>
          <p dir="rtl"><strong>الإسم:</strong> {doctorant.nomarb || "—"}</p>
          <p><strong>CIN:</strong> {doctorant.cin || "—"}</p>
          <p><strong>Date de naissance:</strong> {doctorant.date_naissance || "—"}</p>
          <p dir="rtl"><strong>مكان الإزدياد:</strong> {doctorant.lieu_naissance_arb || "—"}</p>
          <p><strong>Discipline:</strong> {doctorant.discipline_fr || "—"}</p>
          <p><strong>Spécialité:</strong> {doctorant.specialite_fr || "—"}</p>
          <p><strong>Sujet de thèse:</strong> {doctorant.sujet_fr || "—"}</p>
          <p><strong>Mention:</strong> {doctorant.mention_fr || "—"}</p>
          <p><strong>Statut:</strong> {doctorant.status || "—"}</p>
          <p><strong>Date soutenance:</strong> {doctorant.date_descution_jury || "—"}</p>
          <p><strong>Date diplôme:</strong> {doctorant.date_obtinu_diplome || "—"}</p>
        </div>

        {/* Jury */}
        {doctorant.juries && doctorant.juries.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <h3>Membres du Jury</h3>
            <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Rôle</th>
                  <th>Grade</th>
                  <th>Établissement</th>
                </tr>
              </thead>
              <tbody>
                {doctorant.juries.map(j => (
                  <tr key={j.id}>
                    <td>{j.nom}</td>
                    <td>{j.pivot?.role || "—"}</td>
                    <td>{j.pivot?.grade || "—"}</td>
                    <td>{j.pivot?.local || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
          {onClose && (
            <button className="btn-close" onClick={onClose}>✕ Fermer</button>
          )}
        </div>
      </div>
    </div>
  );
}
