import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:7777/api",
});

export const getDoctorants = ()       => API.get("/doctorants");
export const getDoctorant  = (id)     => API.get(`/doctorants/${id}`);
export const addDoctorant  = (data)   => API.post("/doctorants", data);
export const updateDoctorant = (id, data) => API.put(`/doctorants/${id}`, data);
export const deleteDoctorant = (id)   => API.delete(`/doctorants/${id}`);

export const getJuries   = ()           => API.get("/juries");
export const getJury     = (id)         => API.get(`/juries/${id}`);
export const addJury     = (data)       => API.post("/juries", data);
export const updateJury  = (id, data)   => API.put(`/juries/${id}`, data);
export const deleteJury  = (id)         => API.delete(`/juries/${id}`);

export const attachJuryToDoctorant = (juryId, data) => API.post(`/juries/${juryId}/attach`, data);

export const getDiplomes = ()           => API.get("/diplomes");
export const getDiplome  = (id)         => API.get(`/diplomes/${id}`);
export const addDiplome  = (data)       => API.post("/diplomes", data);
export const updateDiplome = (id, data) => API.put(`/diplomes/${id}`, data);
export const deleteDiplome = (id)       => API.delete(`/diplomes/${id}`);
export const getDiplomesByDoctorant = (doctorantId) => API.get(`/diplomes/doctorant/${doctorantId}`);


export default API;