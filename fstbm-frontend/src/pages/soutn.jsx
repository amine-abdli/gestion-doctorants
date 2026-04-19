import { useState, useEffect } from 'react';
import API from '../services/api';
import "./style/sautn.css";

export default function Soutn() {
  const [doctorants, setDoctorants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ nom: "", prenom: "", date: "", local: "", heure: "" });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchDoctorants();
  }, []);

  const fetchDoctorants = async () => {
    try {
      setLoading(true);
      const res = await API.get("/doctorants");
      setDoctorants(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des doctorants:", err);
    } finally {
      setLoading(false);
    }
  };

  const rows = doctorants.filter(d => d.date_descution_jury);

  const filtered = rows.filter(r =>
    (r.nomfr || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.nomarb || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.nmb_inscription || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer la date de soutenance de ce doctorant ?")) return;
    try {
      await API.put(`/doctorants/${id}`, { date_descution_jury: null });
      fetchDoctorants();
    } catch (err) {
      alert("Erreur lors du retrait de la soutenance.");
    }
  };

  const handlePrintFiche = (doc) => {
    alert(`Impression de la fiche de soutenance pour ${doc.nomfr || 'Doctorant'}.\n(Fonctionnalité en attente de génération PDF backend)`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Normalement on choisirait un doctorant et on mettrait à jour sa date
    // Pour l'instant on garde la structure simplifiée mais avec un message
    alert("Veuillez utiliser la page Gestion Doctorants pour planifier une soutenance.");
    setShowForm(false);
  };

  return (
    <div className="soutenance-page-container">
      <div className="soutenance-header">
        <h2 style={{margin: 0, fontSize: '1.25rem', fontWeight: 700}}>Gestion des Soutenances</h2>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="search-wrapper">
            <input
              type="search"
              placeholder="Rechercher un doctorant..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Ajouter une soutenance
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="soutenance-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Date</th>
              <th>Local</th>
              <th>heure</th>
              <th>Actions</th>
              <th>Document</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: "center", padding: "40px" }}>Chargement...</td></tr>
            ) : filtered.length > 0 ? (
              filtered.map(item => (
                <tr key={item.id}>
                  <td style={{fontWeight: 600, color: '#0f172a'}}>{(item.nomfr || "—").toUpperCase()}</td>
                  <td>{item.nomarb || "—"}</td>
                  <td>
                    <span style={{color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px'}}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      {item.date_descution_jury}
                    </span>
                  </td>
                  <td>
                    <span style={{backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 500}}>
                      {item.juries?.[0]?.pivot?.local || "FST BM"}
                    </span>
                  </td>
                  <td>
                    <span style={{backgroundColor: '#111213ff', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 500}}>
                      10:00
                    </span>
                  </td>
                  <td>
                    <button className="btn-action btn-edit" title="Modifier" onClick={() => alert("Modification via la fiche doctorant")}>Modifier</button> 
                    <button className="btn-action btn-delete" title="Supprimer" onClick={() => handleDelete(item.id)}>Supprimer</button>
                  </td>
                  <td>
                    <button className="btn-action btn-print" onClick={() => handlePrintFiche(item)} style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                      Imprimer fiche
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>Aucune soutenance trouvée</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ margin: '0 0 24px 0', fontSize: '1.2rem', fontWeight: 700 }}>Nouvelle Soutenance</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nom</label>
                <input value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} required placeholder="Ex: Dupont" />
              </div>

              <div className="form-group">
                <label>Prénom</label>
                <input value={form.prenom} onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))} required placeholder="Ex: Jean" />
              </div>

              <div className="form-group">
                <label>Date de soutenance</label>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
              </div>

              <div className="form-group">
                <label>Lieu / Local</label>
                <input value={form.local} onChange={e => setForm(f => ({ ...f, local: e.target.value }))} required placeholder="Ex: Salle 24, FST" />
              </div>

              <div className="form-group">
                <label>Heure de soutenance</label>
                <input type="time" value={form.heure} onChange={e => setForm(f => ({ ...f, heure: e.target.value }))} required />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontWeight: 600, cursor: 'pointer' }} onClick={handleReset}>Annuler</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Valider l'Ajout</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}