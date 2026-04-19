import React, { useState } from 'react';
import "./style/style-select-doctorant.css";

export default function SelectDoctorant({ onclose, onSelect, availableDoctorants }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDoctorants = availableDoctorants.filter(d => {
    const search = searchTerm.toLowerCase();
    return (
      (d.nomfr || "").toLowerCase().includes(search) ||
      (d.nomarb || "").toLowerCase().includes(search) ||
      (d.specialite_fr || "").toLowerCase().includes(search) ||
      (d.specialite_arb || "").toLowerCase().includes(search) ||
      (d.cin || "").toLowerCase().includes(search)
    );
  });

  const handleSelect = (doctorant) => {
    onSelect(doctorant);
    onclose();
  };

  return (
    <div className="select-overlay" onClick={onclose}>
      <div className="select-modal" onClick={(e) => e.stopPropagation()}>
        
        <div className="select-header">
          <h2>Sélectionner un Doctorant</h2>
          <button className="btn-close-select" onClick={onclose}>✕</button>
        </div>

        <div className="select-body">
          <div className="search-bar-select">
            <input
              type="text"
              placeholder="Rechercher par nom, spécialité, CIN..."
              className="search-input-select"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <span className="search-count">
                {filteredDoctorants.length} résultats
              </span>
            )}
          </div>

          {filteredDoctorants.length > 0 ? (
            <table className="doctorants-table">
              <thead>
                <tr>
                  <th>Nom & Prénom</th>
                  <th>CIN</th>
                  <th>Spécialité</th>
                  <th>Discipline</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctorants.map((doctorant) => (
                  <tr key={doctorant.id || doctorant.nmb_inscription}>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600 }}>{doctorant.nomfr || "---"}</div>
                        <div style={{ fontSize: '12px', color: '#666' }} dir="rtl">{doctorant.nomarb}</div>
                      </div>
                    </td>
                    <td>{doctorant.cin || "---"}</td>
                    <td>
                      <div>
                        <div>{doctorant.specialite_fr || "---"}</div>
                        <div style={{ fontSize: '12px', color: '#666' }} dir="rtl">{doctorant.specialite_arb}</div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div>{doctorant.discipline_fr || "---"}</div>
                        <div style={{ fontSize: '12px', color: '#666' }} dir="rtl">{doctorant.discipline_arb}</div>
                      </div>
                    </td>
                    <td>
                      <button
                        className="btn-select-doctorant"
                        onClick={() => handleSelect(doctorant)}
                      >
                        Sélectionner
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <p>Aucun doctorant trouvé</p>
             
            </div>
          )}
        </div>

        <div className="select-footer">
          <button className="btn-cancel" onClick={onclose}>Annuler</button>
        </div>
      </div>
    </div>
  );
}
