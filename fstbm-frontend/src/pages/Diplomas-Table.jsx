import { useEffect, useState } from "react";
import "./style/Diplomas-Table.css";
import { Link } from "react-router-dom";
import { getDoctorants } from "../services/api";

function getCompletionStatus(doc) {
  const requiredFields = [
    'nmb_inscription', 'nomfr', 'nomarb', 'cin',
    'date_naissance', 'lieu_naissance_arb',
    'discipline_fr', 'specialite_fr',
    'sujet_fr', 'mention_fr',
    'date_descution_jury', 'date_obtinu_diplome', 'status'
  ];
  for (const field of requiredFields) {
    if (!doc[field] || String(doc[field]).trim() === '') return 'attente';
  }
  if (!Array.isArray(doc.juries) || doc.juries.length === 0) return 'attente';
  return 'complet';
}

export default function DiplomasTable() {
    const [diplomas, setDiplomas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDoctorants()
            .then(res => {
                const data = res.data.slice(-5).reverse();
                setDiplomas(data);
            })
            .catch(err => {
                console.error("Erreur chargement diplômes:", err);
                setDiplomas([]);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="diplomas-section">
            <div className="diplomas-header">
                <h2 className="diplomas-title">Derniers Doctorants Inscrits</h2>
                <Link to="/diplomes" className="diplomas-link">Voir tout l'historique ↗</Link>
            </div>
            <table className="diplomas-table">
                <thead>
                    <tr>
                        <th>RÉCIPIENDAIRE</th>
                        <th>N° INSCRIPTION</th>
                        <th>DISCIPLINE / SPÉCIALITÉ</th>
                        <th>STATUT</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
                                Chargement...
                            </td>
                        </tr>
                    ) : diplomas.length > 0 ? (
                        diplomas.map((d) => (
                            <tr key={d.id}>
                                <td>
                                    <div className="recipient-info">
                                        <span className="recipient-name">{d.nomfr || d.nomarb || "—"}</span>
                                        <span className="recipient-id">CIN: {d.cin || "—"}</span>
                                    </div>
                                </td>
                                <td>{d.nmb_inscription || "—"}</td>
                                <td>{d.discipline_fr || d.discipline_arb || "—"}</td>
                                <td>
                                    {(() => {
                                        const s = getCompletionStatus(d);
                                        return (
                                            <span className={`status-badge ${s === 'complet' ? 'dossier-complet' : 'dossier-attente'}`}>
                                                {s === 'complet' ? 'Complet' : 'En attente'}
                                            </span>
                                        );
                                    })()}
                                </td>
                                <td>
                                    <Link to="/diplomes" className="view-link">Voir détails ↗</Link>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
                                Aucun doctorant enregistré pour le moment.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}