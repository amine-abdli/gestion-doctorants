import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:7777/api",
});

// ============ Doctorants ============
export const getDoctorants = ()       => API.get("/doctorants");
export const getDoctorant  = (id)     => API.get(`/doctorants/${id}`);
export const addDoctorant  = (data)   => API.post("/doctorants", data);
export const updateDoctorant = (id, data) => API.put(`/doctorants/${id}`, data);
export const deleteDoctorant = (id)   => API.delete(`/doctorants/${id}`);

// ============ Juries ============
export const getJuries   = ()           => API.get("/juries");
export const getJury     = (id)         => API.get(`/juries/${id}`);
export const addJury     = (data)       => API.post("/juries", data);
export const updateJury  = (id, data)   => API.put(`/juries/${id}`, data);
export const deleteJury  = (id)         => API.delete(`/juries/${id}`);
// Affecter un doctorant à un jury avec rôle + grade
export const attachJuryToDoctorant = (juryId, data) => API.post(`/juries/${juryId}/attach`, data);


export default API;