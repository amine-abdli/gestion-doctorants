import "./style/dashbord.css";
import CardCalcul from "./card-calcul";
import DiplomasTable from "./Diplomas-Table";
import { Link } from "react-router-dom";

export default function Dashbord() {
   
    return (
        <div className="dashboard">
            <div className="dash-header">
                <div>
                    <h1 className="dash-title">Tableau de Bord</h1>
                </div>
                <p className="dash-session">Session {new Date().getFullYear() - 1} - {new Date().getFullYear()} • Faculté des Sciences et Techniques</p>
            </div>
            {/* les cardes doctorants et jury */}
            <div className="caret-insericption">
                <div className="doctorants">
                    <Link to='/doctorant' className="action-card">
                        <div className="card-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="8.5" cy="7" r="4" />
                                <line x1="20" y1="8" x2="20" y2="14" />
                                <line x1="23" y1="11" x2="17" y2="11" />
                            </svg>
                        </div>
                        <div className="action-card-text">
                            <span className="action-label">NOUVELLE INSCRIPTION</span> <br />
                            <span className="action-title">AJOUTER Étudiant</span>
                        </div>
                        <svg className="action-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>


                    </Link>

                </div>
                <div className="jury">
                    <Link to="/jury" className="action-card">
                        <div className="action-card-icon-outline-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="8.5" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </div>
                        <div className="action-card-text">
                            <span className="action-label">SESSION DE DÉLIBÉRATION</span><br />
                            <span className="action-title">LANCER Jury</span>
                        </div>
                        <svg className="action-arrow-jury" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>

                    </Link>

                </div>

            </div>

            {/* les carde de calcule */}

            <div className="card-calcul-container">
                <CardCalcul />
            </div>


            {/* Diplomas Table */}

            <div className="diplomas-table-container">
               <DiplomasTable />
            </div>

            {/* Footer */}
            <footer className="dash-footer">
                <span>© 2026 gestion-doctorants cree by     amine abdli</span>
                <div className="footer-links">
                   
                    <a href="https://fstbm.ac.ma" target="_blank">Support Universitaire fstbm.ma</a>
                </div>
            </footer>
        </div>
    );
}