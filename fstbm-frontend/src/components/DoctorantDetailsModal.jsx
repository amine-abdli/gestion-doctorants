import React, { useState, useEffect } from 'react';
import { getDoctorant, getJuries } from '../services/api';
import EditDoctorantModal from './EditDoctorantModal';
import DiplomeForm from './DiplomeForm';
import "./style/style-doctorant-details.css";
import axios from 'axios';

export default function DoctorantDetailsModal({ doctorant, onClose }) {
  const [doctorantData, setDoctorantData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [juryList, setJuryList] = useState([]);

  // États pour l'édition de diplôme
  const [showEditDiplomeModal, setShowEditDiplomeModal] = useState(false);
  const [editDiplomeTarget, setEditDiplomeTarget] = useState(null);

  const fetchDoctorantDetails = async () => {
    if (!doctorant?.id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getDoctorant(doctorant.id);
      setDoctorantData(response.data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des données');
      console.error('Erreur API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorantDetails();
    // Charger aussi la liste des jurys disponibles pour le formulaire d'édition
    getJuries().then(r => setJuryList(r.data)).catch(err => console.error("Erreur jurys:", err));
  }, [doctorant?.id]);

  if (!doctorant) return null;

  const data = doctorantData || doctorant;

  if (loading) {
    return (
      <div className="details-overlay" onClick={onClose}>
        <div className="details-modal" onClick={(e) => e.stopPropagation()}>
          <div className="details-header">
            <h2>Informations Complètes du Doctorant</h2>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
          <div className="details-body" style={{ textAlign: 'center', padding: '40px' }}>
            <p>Chargement des données...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="details-overlay" onClick={onClose}>
        <div className="details-modal" onClick={(e) => e.stopPropagation()}>
          <div className="details-header">
            <h2>Informations Complètes du Doctorant</h2>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
          <div className="details-body" style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
            <p>Erreur: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  const handleEdit = (doc) => {
    setEditTarget(doc);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setEditTarget(null);
    fetchDoctorantDetails(); // Rafraîchir les détails après modification
  };

  const editdiplome = (diplome) => {
    setEditDiplomeTarget(diplome);
    setShowEditDiplomeModal(true);
  };

  const handleDiplomeEditSuccess = () => {
    setShowEditDiplomeModal(false);
    setEditDiplomeTarget(null);
    fetchDoctorantDetails(); // Rafraîchir pour voir les modifs du diplôme
  };

const handlePrint = async () => {
  try {
    const response = await axios.get(
      "http://localhost:7777/api/generate-word",
      {
        params: { doctorantId: doctorant.id },
        responseType: "blob",
      }
    );

    const file = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    });

    const url = window.URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Doctorant_${doctorant.id}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (error) {
    // Quand responseType=blob, l'erreur du serveur est un blob — on le lit pour afficher le vrai message
    if (error.response && error.response.data instanceof Blob) {
      const text = await error.response.data.text();
      try {
        const json = JSON.parse(text);
        console.error("Erreur serveur:", json.message, "| Fichier:", json.file, "| Ligne:", json.line);
        alert("Erreur génération document:\n" + json.message);
      } catch {
        console.error("Erreur serveur (raw):", text);
        alert("Erreur génération document:\n" + text);
      }
    } else {
      console.error("Erreur:", error);
    }
  }
};

  return (
    <div className="details-overlay" onClick={onClose}>
      <div className="details-modal" onClick={(e) => e.stopPropagation()}>
        
        <div className="details-header">
          <h2>Informations Complètes du Doctorant</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="details-body">
          <div className="info-section">
            <h3>Identité</h3>
            <div className="info-row">
             
              <div className="info-group">
                <label>N° Inscription</label>
                <p>{data?.nmb_inscription || "---"}</p>
              </div>
            </div>

            <div className="info-row">
              <div className="info-group">
                <label>Nom (FR)</label>
                <p>{data?.nomfr || "---"}</p>
              </div>
              <div className="info-group">
                <label>Nom (AR)</label>
                <p dir="rtl">{data?.nomarb || "---"}</p>
              </div>
            </div>

            <div className="info-row">
              <div className="info-group">
                <label>CIN</label>
                <p>{data?.cin || "---"}</p>
              </div>
              <div className="info-group">
                <label>Date de Naissance</label>
                <p>{data?.date_naissance ? new Date(data.date_naissance).toLocaleDateString('fr-FR') : "---"}</p>
              </div>
            </div>

            <div className="info-row">
              <div className="info-group">
                <label>Lieu de Naissance (AR)</label>
                <p dir="rtl">{data?.lieu_naissance_arb || "---"}</p>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h3>Cursus Académique</h3>
            
            <div className="info-row">
              <div className="info-group">
                <label>Discipline (FR)</label>
                <p>{data?.discipline_fr || "---"}</p>
              </div>
              <div className="info-group">
                <label>Discipline (AR)</label>
                <p dir="rtl">{data?.discipline_arb || "---"}</p>
              </div>
            </div>

            <div className="info-row">
              <div className="info-group">
                <label>Spécialité (FR)</label>
                <p>{data?.specialite_fr || "---"}</p>
              </div>
              <div className="info-group">
                <label>Spécialité (AR)</label>
                <p dir="rtl">{data?.specialite_arb || "---"}</p>
              </div>
            </div>

            <div className="info-row">
              <div className="info-group full-width">
                <label>Sujet de Thèse (FR)</label>
                <p>{data?.sujet_fr || "---"}</p>
              </div>
            </div>
          


          </div>

         
              
              <div className="info-section">
            <h3>Jury</h3>
            
            {data?.juries && data.juries.length > 0 ? (
              <table className="jury-table">
                <thead>
                  <tr>
                    
                  
                    <th>Local</th>
                    <th>Grade</th>
                    <th>Rôle</th>
                    <th>Nom </th>
                  </tr>
                </thead>
                <tbody>
                  {data.juries.map((jury, index) => (
                    <tr key={index}>
                     
                      <td>{jury?.pivot?.local || "---"}</td>
                      <td>{jury?.pivot?.grade || "---"}</td>
                      <td>{jury?.pivot?.role || "---"}</td>
                      <td>{jury?.nom|| "---"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data">Aucun membre de jury enregistré</p>
            )}
          </div>

           <div className="modification-info-doctorant">
            <button className="btn-add" onClick={() => {handleEdit(data)  }} style={{ position: 'relative', left: '50%', transform: 'translateX(-50%)',marginBottom: '20px'  }}>Modifier les informations du doctorant</button>


          
           
         
          </div>
          <div className="info-section">
            <h3>Diplômes</h3>
            
            {data?.diplomes && data.diplomes.length > 0 ? (
              <table className="diplomes-table">
                <thead>
                  <tr>
                    <th>N° Diplôme</th>
                    <th>Mention (FR)</th>
                    <th>Mention (AR)</th>
                    <th>Date Examen</th>
                    <th>Date Obtention</th>
                  </tr>
                </thead>
                <tbody>
                  {data.diplomes.map((diplome, index) => (
                    <tr key={index}>
                      <td>{diplome?.numero_diplome || "---"}</td>
                      <td>{diplome?.mention_fr || "---"}</td>
                      <td dir="rtl">{diplome?.mention_arb || "---"}</td>
                      <td>{diplome?.date_examen ? new Date(diplome.date_examen).toLocaleDateString('fr-FR') : "---"}</td>
                      <td>{diplome?.date_obtention ? new Date(diplome.date_obtention).toLocaleDateString('fr-FR') : "---"}</td>
                      <td><button className="btn-add" onClick={() => {editdiplome(diplome)  }} style={{ position: 'relative', left: '50%', transform: 'translateX(-50%)',marginBottom: '20px'  }}>Modifier les informations de diplome</button></td>
                    </tr>
                   
                  ))}
                </tbody>
              </table>

              
            ) : (
              <p className="no-data">Aucun diplôme enregistré</p>
            )}
          </div>
         


          

          <button type="button" className="btn-print" onClick={handlePrint}>
            Imprimer
          </button>
       
        



        </div>
      </div>
      {showEditModal && editTarget && (
        <EditDoctorantModal
          doctorant={editTarget}
          juryList={juryList}
          onClose={() => { setShowEditModal(false); setEditTarget(null); }}
          onSuccess={handleEditSuccess}
        />
      )}
      {showEditDiplomeModal && editDiplomeTarget && (
        <DiplomeForm
          doctorant={data}
          diplome={editDiplomeTarget}
          onClose={() => { setShowEditDiplomeModal(false); setEditDiplomeTarget(null); }}
          onSuccess={handleDiplomeEditSuccess}
        />
      )}
    </div>
  );
}
