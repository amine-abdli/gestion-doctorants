import React, { useState, useEffect } from 'react';
import API from '../services/api';
import "./style/style-doctorant-selection.css";

export default function DoctorantSelectionModal({ onSelect, onClose }) {
  const [doctorants, setDoctorants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDoctorants();
  }, []);

  const fetchDoctorants = async () => {
    try {
      setLoading(true);
      const response = await API.get('/doctorants');
      setDoctorants(response.data);
    } catch (error) {
      console.error('Erreur chargement doctorants:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctorants = doctorants.filter(d => {
    const s = searchTerm.toLowerCase();
    return (
      (d.nomfr || "").toLowerCase().includes(s) ||
      (d.nomarb || "").toLowerCase().includes(s) ||
      (d.cin || "").toLowerCase().includes(s) ||
      (d.numero || "").toLowerCase().includes(s)
    );
  });

  const handleSelectDoctorant = (doctorant) => {
    onSelect(doctorant);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Sélectionner un Doctorant</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-search">
          <input
            type="text"
            placeholder="Rechercher par nom, CIN ou numéro..."
            className="search-input-modal"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <span className="search-results-modal">
              {filteredDoctorants.length} résultats
            </span>
          )}
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="loading-message">Chargement des doctorants...</div>
          ) : filteredDoctorants.length > 0 ? (
            <div className="doctorants-list">
              {filteredDoctorants.map((doctorant) => (
                <div key={doctorant.id} className="doctorant-card">
                  <div className="doctorant-info">
                    <div className="doctorant-name">
                      <strong>{doctorant.nomfr || "---"}</strong>
                      <span dir="rtl" className="doctorant-name-arb">
                        {doctorant.nomarb || ""}
                      </span>
                    </div>
                    <div className="doctorant-details">
                      <div className="detail-line">
                        <span className="detail-label">CIN:</span>
                        <span className="detail-value">{doctorant.cin || "Non défini"}</span>
                      </div>
                      <div className="detail-line">
                        <span className="detail-label">Spécialité:</span>
                        <span className="detail-value">
                          {doctorant.specialite_fr || doctorant.specialite_arb || "Non défini"}
                        </span>
                      </div>
                      <div className="detail-line">
                        <span className="detail-label">Discipline:</span>
                        <span className="detail-value">
                          {doctorant.discipline_fr || doctorant.discipline_arb || "Non défini"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn-select"
                    onClick={() => handleSelectDoctorant(doctorant)}
                  >
                    Sélectionner
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-message">
              {searchTerm 
                ? "Aucun doctorant ne correspond à votre recherche"
                : "Aucun doctorant disponible"
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
