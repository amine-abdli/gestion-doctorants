import { useState } from "react";

export default function AddJury({ onclose, onAddJury }) {

 const [jury, setJury] = useState({
    nomarb: "",
    specialite: ""
  });

  const handleChange = (e) => {
    setJury({
      ...jury,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newJury = {
      id: Date.now(),
            ...jury
    };

    onAddJury(newJury); 
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>

      <div style={{ background: "#fff", padding: 20, borderRadius: 10, width: 400 }}>

        <h3>إضافة Jury</h3>

        <form onSubmit={handleSubmit}>

          <input
            name="nomarb"
            placeholder="Nom"
            onChange={handleChange}
          />

         
          <input
            name="specialite"
            placeholder="Spécialité"
            onChange={handleChange}
          />

         

          <button type="submit">Ajouter</button>

          <button type="button" onClick={onclose}>
            Annuler
          </button>

        </form>

      </div>
    </div>
  );
}