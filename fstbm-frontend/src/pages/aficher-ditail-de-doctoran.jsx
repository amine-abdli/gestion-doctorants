
import "./style/aficher-ditail-de-doctoran.css";

export default function AficherDitailDeDoctoran({ doctorant, onClose }) {
  if (!doctorant) return null;

  const fields = [
    { label: "N° Inscription",     value: doctorant.nmb_inscription },
   
    { label: "Nom (FR)",           value: doctorant.nomfr },
    { label: "الإسم",              value: doctorant.nomarb,         dir: "rtl" },
    { label: "CIN",                value: doctorant.cin },
    { label: "Date de naissance",  value: doctorant.date_naissance },
    { label: "مكان الإزدياد",      value: doctorant.lieu_naissance_arb, dir: "rtl" },
    { label: "Discipline",         value: doctorant.discipline_fr },
    { label: "المادة",            value: doctorant.discipline_arb, dir: "rtl" },
    { label: "Spécialité",         value: doctorant.specialite_fr },
    { label: "التخصص",            value: doctorant.specialite_arb, dir: "rtl" },
    { label: "Sujet de thèse",     value: doctorant.sujet_fr }
  
  ];


  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-box" onClick={e => e.stopPropagation()}>

        <div className="detail-header">
          <div>
            <h2 className="detail-title">Fiche Doctorant</h2>
            <p className="detail-subtitle">{doctorant.nomfr || doctorant.nomarb || "—"}</p>
          </div>
          <button className="detail-close-btn" onClick={onClose} title="Fermer">✕</button>
        </div>

       
        <div className="detail-body">
          <div className="detail-grid">
            {fields.map(({ label, value, dir }) => (
              <div key={label} className="detail-field">
                <span className="detail-label">{label}</span>
                <span className="detail-value" dir={dir || "ltr"}>
                  {value || "—"}
                </span>
              </div>
            ))}
          </div>

        
          {doctorant.juries && doctorant.juries.length > 0 && (
            <div className="detail-jury-section">
              <h3 className="detail-jury-title">Membres du Jury</h3>
              <div className="detail-jury-wrapper">
                <table className="detail-jury-table">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Rôle</th>
                      <th>Grade</th>
                      <th>Établissement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctorant.juries.map(j => (
                      <tr key={j.id}>
                        <td className="jury-td-nom">{j.nom}</td>
                        <td>{j.pivot?.role || "—"}</td>
                        <td>{j.pivot?.grade || "—"}</td>
                        <td>{j.pivot?.local || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

   
        <div className="detail-footer">
          <button className="detail-btn-close" onClick={onClose}>
            ✕ Fermer
          </button>
        </div>

      </div>
    </div>
  );
}
