import { useState, useEffect } from "react";
import "./style/card-calcul.css";
import { getDoctorants } from "../services/api";

export default function CardCalcul() {
    const [stats, setStats] = useState({
        total: 0,
        actifs: 0,
        diplomes: 0,
    });

    useEffect(() => {
        getDoctorants()
            .then(res => {
                const data = res.data;
                setStats({
                    total: data.length,
                    actifs: data.filter(d => d.status === "Actif").length,
                    diplomes: data.filter(d => d.status === "Diplômé").length,
                });
            })
            .catch(() => {
                setStats({ total: 0, actifs: 0, diplomes: 0 });
            });
    }, []);

    return (
        <div className="card-calcul">
            <div className="card-calcul-1">
                <p className="card-calcul-1-title">MESURES ACADÉMIQUES GLOBALES</p><br />
                <span className="card-calcul-1-number">{stats.total}</span><br />
                <span className="card-calcul-1-text">Total doctorants inscrits</span>
            </div>
            <div className="card-calcul-2">
                <div className="card-calcul-2-child-1">
                    <div className="card-calcul-2-child-1-text-number">
                        <span className="card-calcul-2-child-1-number">{stats.actifs}</span><br />
                        <span className="card-calcul-2-child-1-text">Thèses en cours</span>
                    </div>
                    <div className="card-calcul-2-child-1-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="8.5" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </div>
                </div>
                <div className="card-calcul-2-child-2">
                    <div className="card-calcul-2-child-2-text-number">
                        <span className="card-calcul-2-child-2-number">{stats.diplomes}</span><br />
                        <span className="card-calcul-2-child-2-text">Diplômés</span>
                    </div>
                    <div className="card-calcul-2-child-2-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                            <path d="M6 12v5c3 3 9 3 12 0v-5" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}