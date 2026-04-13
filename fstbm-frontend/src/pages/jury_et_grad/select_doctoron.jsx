
export default function Select_doctoron({ juryList = [], onSelectJury }) {
  if (!juryList || juryList.length === 0) {
    return (
      <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
        Aucun jury disponible.
      </p>
    );
  }

  return (
    <div>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Spécialité</th>
            <th>Établissement</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {juryList.map(j => (
            <tr key={j.id}>
              <td>{j.nom}</td>
              <td>{j.specialite || "—"}</td>
              <td>{j.local || "—"}</td>
              <td>
                <button type="button" onClick={() => onSelectJury(j)}>
                  Sélectionner
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}