  import React, { useState, useEffect } from 'react';
import DiplomeForm from '../components/DiplomeForm';
import SelectDoctorant from './select-doctorant';
import DoctorantDetailsModal from '../components/DoctorantDetailsModal';
import "./style/style-diplomas.css";
import API from '../services/api';

export default function Diplomas() {
  const [showDiplomeForm, setShowDiplomeForm] = useState(false);
  const [showSelectDoctorant, setShowSelectDoctorant] = useState(false);
  const [showDoctorantDetails, setShowDoctorantDetails] = useState(false);
  const [selectedDoctorant, setSelectedDoctorant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [diplomes, setDiplomes] = useState([]);
  const [availableDoctorants, setAvailableDoctorants] = useState([]);

  const fetchDiplomas = async () => {
    try {
      setLoading(true);
      const response = await API.get('/diplomes');
      setDiplomes(response.data);
    } catch (error) {
      console.error('Erreur chargement diplwmes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorants = async () => {
    try {
      const response = await API.get('/doctorants');
      setAvailableDoctorants(response.data);
    } catch (error) {
      console.error('Erreur chargement doctorants:', error);
    }
  };

  useEffect(() => {
    fetchDiplomas();
    fetchDoctorants();
  }, []);

  const handleDiplomaSelect = (id) => {
    const selected = diplomes.find(d => d.id === id);
    if (selected && selected.doctorant) {
      setSelectedDoctorant(selected.doctorant);
      setShowDoctorantDetails(true);
    }
  };

  const handleAddNew = () => {
    setShowSelectDoctorant(true);
  };

  const handleSelectDoctorant = (doctorant) => {
    setSelectedDoctorant(doctorant);
    setShowSelectDoctorant(false);
    setShowDiplomeForm(true);
  };

  const handleDiplomeSuccess = () => {
    fetchDiplomas();
    setSelectedDoctorant(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Etes-vous sur de vouloir supprimer ce diplome ?')) {
      try {
        await API.delete(`/diplomes/${id}`);
        setDiplomes(diplomes.filter(d => d.id !== id));
      } catch (error) {
        console.error('Erreur suppression:', error);
        alert('Erreur lors de la suppression: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const diplomasWithDetails = diplomes.filter(d => {
    const s = searchTerm.toLowerCase();
    return (
      (d.doctorant?.nomfr || '').toLowerCase().includes(s) ||
      (d.doctorant?.nomarb || '').toLowerCase().includes(s) ||
      (d.doctorant?.cin || '').toLowerCase().includes(s) ||
      (d.numero_diplome || '').toLowerCase().includes(s)
    );
  });

  return (
    <div className="diplomas-container">
      <div className="diplomas-header">
        <h1>Gestion des Diplômes</h1>
        <button className="btn-add" onClick={handleAddNew}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Nouveau Diplôme
        </button>
      </div>
      
      <div className="table-card">
        <table className="diplomas-table">
          <thead>
            <tr>
              <th colSpan="5">
                <div className="search-container">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '-40px', zIndex: 1, marginLeft: '12px' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  <input type="text" placeholder="Rechercher un diplôme, un doctorant..." className="search-input" style={{ paddingLeft: '45px' }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  {searchTerm && <span className="search-results">{diplomasWithDetails.length} résultats</span>}
                </div>
              </th>
            </tr>
            <tr>
              <th>N° Diplôme</th>
              <th>Doctorant</th>
              <th>CIN</th>
              <th>Mention</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                   <div style={{ color: '#4f46e5', fontWeight: '600' }}>Chargement en cours...</div>
                </td>
              </tr>
            ) : diplomasWithDetails.length > 0 ? (
              diplomasWithDetails.map((diplome) => (
                <tr key={diplome.id} onClick={() => handleDiplomaSelect(diplome.id)}>
                  <td><span style={{ fontWeight: '600', color: '#4f46e5' }}>{diplome.numero_diplome || 'N/A'}</span></td>
                  <td>{diplome.doctorant?.nomfr || 'N/A'}</td>
                  <td>{diplome.doctorant?.cin || 'N/A'}</td>
                  <td>
                    <span className={`status-badge ${diplome.mention_fr ? 'status-complet' : 'status-incomplet'}`}>
                      {diplome.mention_fr || 'À renseigner'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => handleDiplomaSelect(diplome.id)} className="btn-icon view">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        Voir
                      </button>
                      <button onClick={() => handleDelete(diplome.id)} className="btn-icon delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-empty">Aucun diplôme trouvé</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showDoctorantDetails && selectedDoctorant && (
        <DoctorantDetailsModal doctorant={selectedDoctorant} onClose={() => { setShowDoctorantDetails(false); setSelectedDoctorant(null); }} />
      )}
      {showSelectDoctorant && (
        <SelectDoctorant onclose={() => setShowSelectDoctorant(false)} onSelect={handleSelectDoctorant} availableDoctorants={availableDoctorants} />
      )}
      {showDiplomeForm && selectedDoctorant && (
        <DiplomeForm doctorant={selectedDoctorant} onClose={() => { setShowDiplomeForm(false); setSelectedDoctorant(null); }} onSuccess={handleDiplomeSuccess} />
      )}
    </div>
  );
}
