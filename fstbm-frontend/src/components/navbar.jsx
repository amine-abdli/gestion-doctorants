import "./style/navbar.css";

export default function Navbar() {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <nav className="breadcrumb">
          <a href="#" className="breadcrumb-link">Diplômes</a>
          <span className="breadcrumb-sep">&gt;</span>
          <span className="breadcrumb-current">Détails du Cursus</span>
        </nav>
      </div>

      <div className="topbar-center">
        <div className="search-box">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher..."
          />
        </div>
      </div>

      <div className="topbar-right">
        <button className="topbar-icon-btn" title="Notifications">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="notification-dot"></span>
        </button>

    
        <div className="topbar-user">
          <div className="user-info">
            <span className="user-name">Dr. Amine</span>
            <span className="user-role">ADMINISTRATEUR ACADÉMIQUE</span>
          </div>
          <div className="user-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}