import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar'
import Saidbar from './components/saidbar'
import Dashbord from './pages/dashbord'
import TablauDocto from './pages/tablau-docto'
import Jury from './pages/jury'
import Soutn from './pages/soutn'
import Doctorants from './pages/doctorants'
import Diplomas from './pages/diplomes'


import './App.css'

function App() {
  return (
   <Router>
     <Saidbar />
     <Navbar />
     <div className="main-content" style={{ marginLeft: "260px", marginTop: "72px", padding: "32px", backgroundColor: "#f8fafc", minHeight: "calc(100vh - 72px)" }}>
       <Routes >
         <Route path="/" element={<Dashbord />} />
         <Route path="/dashbord" element={<Dashbord />} />
         <Route path="/tablau-docto" element={<TablauDocto />} />
         <Route path="/jury" element={<Jury />} />
         <Route path="/soutn" element={<Soutn />} />
         <Route path="/doctorant" element={<Doctorants />} />
         <Route path="/diplomes" element={<Diplomas />} />
       </Routes>
     </div>
   </Router>
  )
}

export default App
