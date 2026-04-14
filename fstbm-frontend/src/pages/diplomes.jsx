import React, { useState } from 'react';
import CaseVid from './card-de-case-vid';
import "./style/style-diplomas.css";

export default function Diplomas() {
  const [showinputvid, setShowinputvid] = useState(false);
  const [selectedDiploma, setSelectedDiploma] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCount, setSearchCount] = useState(0);


  const [diplomas, setDiplomas] = useState([
    {
      numero: "D2026-001",
      nmb_inscription: "INS-1001",
      nomfr: "Amine El Fassi",
      nomarb: "أمين الفاسي",
      cin: "J123456",
      date_naissance: "2003-05-14",
      lieu_naissance_arb: "بني ملال",
      discipline_fr: "",
      discipline_arb: "الاعلاميات",
      specialite_fr: "Intelligence Artificielle",
      specialite_arb: "الذكاء الاصطناعي",
      sujet_fr: "Optimisation des systèmes intelligents",
      mention_fr: "Très Bien",
      mention_arb: "جيد جدا",
      jury_id: "1",
      grde: "Doctorant 1ère année",
      lorole: "Étudiant",
      local: "FST Béni Mellal",
      status: "Actif"
    },
    {
      numero: "D2026-002",
      nmb_inscription: "INS-1002",
      nomfr: "Sara Benali",
      nomarb: "سارة بنعلي",
      cin: "J654321",
      date_naissance: "2002-11-22",
      lieu_naissance_arb: "الرباط",
      discipline_fr: "Mathématiques",
      discipline_arb: "الرياضيات",
      specialite_fr: "Algèbre avancée",
      specialite_arb: "الجبر المتقدم",
      sujet_fr: "Étude des structures algébriques",
      mention_fr: "Bien",
      mention_arb: "جيد",
      jury_id: "2",
      grde: "Doctorante 2ème année",
      lorole: "",
      local: "FST Settat",
      status: "Actif"
    },
  ]);

  const handlediplomselect = (numero) => {
    const selected = diplomas.find(d => d.numero === numero);
    setSelectedDiploma(selected);
    setShowinputvid(true);
  };

  const handleAddNew = () => {
    setSelectedDiploma(null);
    setShowinputvid(true);
  };

  const handleDelete = (numero) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce doctorant ?")) {
      setDiplomas(diplomas.filter(d => d.numero !== numero));
    }
  };

  const diplomasWithStatus = diplomas.map(diploma => {
    const isIncomplete =
      (!diploma.nomfr && !diploma.nomarb) ||
      !diploma.numero ||
      !diploma.cin ||
      (!diploma.discipline_fr && !diploma.discipline_arb) ||
      (!diploma.specialite_fr && !diploma.specialite_arb);

    return {
      ...diploma,
      computedStatus: isIncomplete ? "Incomplet" : "Complet",
    };
  });

  return (
    <div className="diplomas-container">
      <div className="diplomas-header">
        <h1>Gestion des Doctorants & Diplômes</h1>
        <button className="btn-add" onClick={handleAddNew}>
          <span>+</span> Nouveau Doctorant
        </button>
      </div>

      <div className="table-card">
        <table className="diplomas-table">
          <thead>
            <div className="search-container">
              <input
                type="text"
                placeholder="Rechercher un doctorant..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchCount > 0 && (
                <span className="search-results">
                  {searchCount} résultats trouvés
                </span>
              )}
            </div>
            <tr>
              <th>Numéro</th>
              <th>Nom & Prénom</th>
              <th>CIN</th>
              <th>Discipline / Spécialité</th>
              <th>Mention</th>
              <th>Statut</th>
              <th>Actions</th>
              <th>Impression</th>
            </tr>
          </thead>

          <tbody>
            {diplomasWithStatus.length > 0 ? (
              diplomasWithStatus.map((diploma) => (
                <tr key={diploma.nmb_inscription || diploma.numero}>
                  <td>
                    <span className={diploma.numero ? "" : "text-empty"}>
                      {diploma.numero || "Non défini"}
                    </span>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: 600 }}>{diploma.nomfr || "---"}</div>
                      <div style={{ fontSize: '12px', color: '#666' }} dir="rtl">{diploma.nomarb}</div>
                    </div>
                  </td>
                  <td>{diploma.cin || <span className="text-empty">---</span>}</td>
                  <td>
                    <div style={{ maxWidth: '200px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {diploma.discipline_fr || diploma.discipline_arb || <span className="text-empty">Discipline...</span>}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {diploma.specialite_fr || diploma.specialite_arb}
                      </div>
                    </div>
                  </td>
                  <td>{diploma.mention_fr || <span className="text-empty">---</span>}</td>
                  <td>
                    <span className={`status-badge status-${diploma.computedStatus.toLowerCase()}`}>
                      {diploma.computedStatus}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon view"
                        title="Voir / Modifier"
                        onClick={() => handlediplomselect(diploma.numero)}
                      >
                        Voir
                      </button>
                      <button
                        className="btn-icon delete"
                        title="Supprimer"
                        onClick={() => handleDelete(diploma.numero)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                  <td>
                    <button className="btn-print-mini">Imprimer 🖨️</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                  Aucun doctorant trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showinputvid && (
        <CaseVid
          onclose={() => setShowinputvid(false)}
          diploma={selectedDiploma}
        />
      )}
    </div>
  );
}