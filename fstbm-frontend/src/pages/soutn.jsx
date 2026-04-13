import { useState } from 'react';
import "./style/sautn.css";

const initialData = [
  { id: 1, nom: "amine1", prenom: "amine1", date: "2022-01-01", local: "local1", heure: "10:00" },
  { id: 2, nom: "amine2", prenom: "amine2", date: "2022-01-01", local: "local1", heure: "10:00" },
  { id: 3, nom: "amine3", prenom: "amine3", date: "2022-01-01", local: "local1", heure: "10:00" },
];

export default function Soutn() {
  const [rows, setRows] = useState(initialData);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ nom: "", prenom: "", date: "", local: "", heure: "" });
  const [showForm, setShowForm] = useState(false);

  const filtered = rows.filter(r =>
    r.nom.toLowerCase().includes(search.toLowerCase()) ||
    r.prenom.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    setRows(prev => [...prev, { id: prev.length > 0 ? Math.max(...prev.map(r => r.id)) + 1 : 1, ...form }]);
  };

  const handleReset = () => {
    setForm({ nom: "", prenom: "", date: "", local: "", heure: "" });
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nom || !form.prenom || !form.date || !form.local || !form.heure) return;
    handleAdd();
    handleReset();
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
            {filtered.length > 0 ? (
              filtered.map(item => (
                <tr key={item.id}>
                 
                  <td style={{fontWeight: 600, color: '#0f172a'}}>{item.nom.toUpperCase()}</td>
                  <td>{item.prenom}</td>
                  <td>
                    <span style={{color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px'}}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      {item.date}
                    </span>
                  </td>
                  <td>
                    <span style={{backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 500}}>
                      {item.local}
                    </span>
                  </td>
                  <td>
                    <span style={{backgroundColor: '#111213ff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 500}}>
                      {item.heure}
                    </span>
                  </td>
                  <td>
                    <button className="btn-action btn-edit" title="Modifier">Modifier</button> 
                    <button className="btn-action btn-delete" title="Supprimer" onClick={() => setRows(rows.filter(r => r.id !== item.id))}>Supprimer</button>
                  </td>
                  <td>
                    <button className="btn-action btn-print" style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
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