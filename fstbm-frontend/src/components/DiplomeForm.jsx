import React, { useState } from 'react';
import API from '../services/api';
import "./style/style-diplome-form.css";

export default function DiplomeForm({ doctorant, diplome, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    doctorant_id: doctorant?.id || diplome?.doctorant_id || "",
    numero_diplome: diplome?.numero_diplome || "",
    mention_fr: diplome?.mention_fr || "",
    mention_arb: diplome?.mention_arb || "",
    date_examen: diplome?.date_examen || "",
    date_obtention: diplome?.date_obtention || "",
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const isEditing = !!diplome;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!formData.doctorant_id) {
      setMessage({ type: 'error', text: 'Le doctorant est obligatoire!' });
      return;
    }

    try {
      setSubmitting(true);
      let response;
      if (isEditing) {
        response = await API.put(`/diplomes/${diplome.id}`, formData);
        setMessage({ type: 'success', text: '✓ Diplôme mis à jour avec succès!' });
      } else {
        response = await API.post('/diplomes', formData);
        setMessage({ type: 'success', text: '✓ Diplôme créé avec succès!' });
      }
      
      if (onSuccess) {
        onSuccess(response.data);
      }

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Erreur:", error);
      const errors = error.response?.data?.errors;
      if (errors) {
        const errorMessages = Object.values(errors).flat().join('\n');
        setMessage({ type: 'error', text: errorMessages });
      } else {
        setMessage({
          type: 'error',
          text: error.response?.data?.message || error.message || 'Une erreur est survenue'
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="diplome-overlay" onClick={onClose}>
      <div className="diplome-modal" onClick={(e) => e.stopPropagation()}>
        
        <div className="diplome-header">
          <h2>{isEditing ? 'Modifier le Diplôme' : 'Créer un Diplôme'}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {message.text && (
          <div className={`message message-${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="diplome-form">
          
          {/* Informations du Doctorant */}
          <div className="form-section">
            <h3>Informations Complètes du Doctorant</h3>
            
            <div className="form-row">
             
              <div className="form-group">
                <label>N° Inscription</label>
                <input type="text" value={doctorant?.nmb_inscription || ""} disabled className="form-input" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Nom (FR)</label>
                <input type="text" value={doctorant?.nomfr || ""} disabled className="form-input" />
              </div>
              <div className="form-group">
                <label>Nom (AR)</label>
                <input type="text" value={doctorant?.nomarb || ""} disabled className="form-input" dir="rtl" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>CIN</label>
                <input type="text" value={doctorant?.cin || ""} disabled className="form-input" />
              </div>
              <div className="form-group">
                <label>Date de Naissance</label>
                <input type="date" value={doctorant?.date_naissance || ""} disabled className="form-input" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Lieu de Naissance (AR)</label>
                <input type="text" value={doctorant?.lieu_naissance_arb || ""} disabled className="form-input" dir="rtl" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Discipline (FR)</label>
                <input type="text" value={doctorant?.discipline_fr || ""} disabled className="form-input" />
              </div>
              <div className="form-group">
                <label>Discipline (AR)</label>
                <input type="text" value={doctorant?.discipline_arb || ""} disabled className="form-input" dir="rtl" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Spécialité (FR)</label>
                <input type="text" value={doctorant?.specialite_fr || ""} disabled className="form-input" />
              </div>
              <div className="form-group">
                <label>Spécialité (AR)</label>
                <input type="text" value={doctorant?.specialite_arb || ""} disabled className="form-input" dir="rtl" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Sujet de Thèse (FR)</label>
                <input type="text" value={doctorant?.sujet_fr || ""} disabled className="form-input" />
              </div>
            </div>

           

           
          </div>

          <div className="form-section">
            <h3>Informations du Diplôme</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="numero_diplome">N° Diplôme</label>
                <input
                  id="numero_diplome"
                  type="text"
                  name="numero_diplome"
                  placeholder={doctorant?.numero || ""}
                  value={formData.numero_diplome}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="mention_fr">Mention (FR)</label>
                <input
                  id="mention_fr"
                  type="text"
                  name="mention_fr"
                  
                  value={formData.mention_fr}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="mention_arb">Mention (AR)</label>
                <input
                  id="mention_arb"
                  type="text"
                  name="mention_arb"
                 
                  value={formData.mention_arb}
                  onChange={handleChange}
                  className="form-input"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date_examen">Date d'examen</label>
                <input
                  id="date_examen"
                  type="date"
                  name="date_examen"
                  value={formData.date_examen}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="date_obtention">Date d'obtention</label>
                <input
                  id="date_obtention"
                  type="date"
                  name="date_obtention"
                  value={formData.date_obtention}
                  placeholder={doctorant?.date_obtinu_diplome || ""}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

         
          </div>

      
          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-cancel"
              disabled={submitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={submitting}
            >
              {submitting ? 'Enregistrement...' : 'Enregistrer le Diplôme'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
