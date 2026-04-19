import React, { useState, useEffect } from "react";
import { getDoctorants, deleteDoctorant, updateDoctorant } from "../services/api";
import { getJuries, addJury } from "../services/api";
import Doctorants from "./doctorants";
import AficherDitailDeDoctoran from "./aficher-ditail-de-doctoran";
import EditDoctorantModal from "../components/EditDoctorantModal";
import "./style/tablau-docto.css";

function getCompletionStatus(doc) {
  const requiredFields = [
    'nmb_inscription', 'nomfr', 'nomarb', 'cin',
    'date_naissance', 'lieu_naissance_arb',
    'discipline_fr', 'specialite_fr',
    'sujet_fr'
  ];
  for (let field of requiredFields) {
    if (!doc[field] || String(doc[field]).trim() === '') {
      return 'attente';
    }
  }

  if (!doc.juries) {
    return 'attente';
  }

  return 'complet';
}
export default function TablauDocto() {
  const [doctorants, setDoctorants] = useState([]);
  const [showDoctorantsForm, setShowDoctorantsForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showDetails, setShowDetails] = useState(false);
  const [selectedDoctorant, setSelectedDoctorant] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [juryList, setJuryList] = useState([]);

  useEffect(() => {
    fetchDoctorants();
    getJuries().then(r => setJuryList(r.data)).catch(() => {});
  }, []);

  const fetchDoctorants = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getDoctorants();
      setDoctorants(res.data);
    } catch {
      setError("Impossible de charger les doctorants. Vérifiez que le serveur backend est démarré.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce doctorant ? Cette action est irréversible.")) return;
    try {
      await deleteDoctorant(id);
      setDoctorants(prev => prev.filter(d => d.id !== id));
    } catch {
      alert("Erreur lors de la suppression.");
    }
  };

  const handleEdit = (doctorant) => {
    setEditTarget(doctorant);
    setShowEditModal(true);
  };

  const handlePrintDiplome = (id) => {
    const doc = doctorants.find(d => d.id === id);
    alert(`Impression du diplôme pour ${doc?.nomfr || 'Doctorant'}.\n(Fonctionnalité en attente de génération PDF backend)`);
  };

  const handlePrintAvis = (id) => {
    const doc = doctorants.find(d => d.id === id);
    alert(`Impression de l'avis de soutenance pour ${doc?.nomfr || 'Doctorant'}.\n(Fonctionnalité en attente de génération PDF backend)`);
  };

  const filteredDoctorants = doctorants.filter(doc => {
    const s = searchTerm.toLowerCase();
    return (
      (doc.nomfr || "").toLowerCase().includes(s) ||
      (doc.nomarb || "").toLowerCase().includes(s) ||
      (doc.nmb_inscription || "").toLowerCase().includes(s) ||
      (doc.cin || "").toLowerCase().includes(s)
    );
  });

  return (
    <div className="doctorants-container">
      <div className="doctorants-wrapper">

        <div className="doctorants-header">
          <div className="header-group">
            <div className="doctorants-stats">
              {doctorants.length} doctorants
            </div>
            {!showDoctorantsForm && (
              <button className="btn-add-header" onClick={() => setShowDoctorantsForm(true)}>
                + Ajouter
              </button>
            )}
            <button className="btn-add-header" onClick={fetchDoctorants} title="Actualiser">
              ↻ Actualiser
            </button>
          </div>
        </div>

        {showDoctorantsForm && (
          <div className="form-overlay-wrapper">
            <button
              onClick={() => setShowDoctorantsForm(false)}
              className="btn-close"
              title="Fermer"
            >
              ✕
            </button>
            <Doctorants onSuccess={() => { setShowDoctorantsForm(false); fetchDoctorants(); }} />
          </div>
        )}

        {!loading && !showDoctorantsForm && doctorants.length > 0 && (
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder=" Nom, CIN, N inscription..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <span className="search-results">
                {filteredDoctorants.length} résultats
              </span>
            )}
          </div>
        )}


        {!loading && !showDoctorantsForm && (
          <>
            {doctorants.length > 0 ? (
              <div className="table-container">
                <table className="doctorants-table">
                  <thead>
                    <tr>
                      <th>N° Inscription</th>
                      <th>Nom</th>
                      <th>الإسم</th>
                      <th>CIN</th>
                      <th>Discipline</th>
                      
                      <th className="td-center">Dossier</th>
                      <th className="td-center">Actions</th>  

                    </tr>
                  </thead>
                  <tbody>
                    {filteredDoctorants.map(doc => {
                      const dossier = getCompletionStatus(doc);
                   

                      return (
                        <tr key={doc.id}>
                          <td className="td-inscription">{doc.nmb_inscription || "—"}</td>
                          <td className="td-nom">{doc.nomfr || "—"}</td>
                          <td className="td-nomarb" dir="rtl">{doc.nomarb || "—"}</td>
                          <td className="td-cin">{doc.cin || "—"}</td>
                          <td className="td-discipline">{doc.discipline_fr || doc.discipline_arb || "—"}</td>
                          
                          <td className="td-center">
                            <span className={`badge-dossier badge-dossier--${dossier}`}>
                              {dossier === 'complet' ? ' Complet' : ' En attente'}
                            </span>
                          </td>

                          <td>
                            <div className="table-actions">
                              <button
                                className="btn-view"
                                onClick={() => { setSelectedDoctorant(doc); setShowDetails(true); }}
                                title="Voir les détails"
                              >
                                Voir
                              </button>
                             <button
                                className="btn-modifier"
                                onClick={() => handleEdit(doc)}
                                title="Modifier"
                              >
                                Modifier
                              </button>
                              <button
                                className="btn-delete"
                                onClick={() => handleDelete(doc.id)}
                                title="Supprimer"
                              >
                                Supprimer
                              </button>
                            </div>
                          </td>
                         
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-message">
                <div className="empty-icon"></div>
                <p>Aucun doctorant enregistré.</p>
                <p>Cliquez sur "Ajouter" pour commencer.</p>
              </div>
            )}
          </>
        )}
      </div>

      {showDetails && selectedDoctorant && (
        <AficherDitailDeDoctoran
          doctorant={selectedDoctorant}
          onClose={() => setShowDetails(false)}
        />
      )}

      {showEditModal && editTarget && (
        <EditDoctorantModal
          doctorant={editTarget}
          juryList={juryList}
          onClose={() => { setShowEditModal(false); setEditTarget(null); }}
          onSuccess={() => { setShowEditModal(false); setEditTarget(null); fetchDoctorants(); }}
        />
      )}
    </div>
  );
}
