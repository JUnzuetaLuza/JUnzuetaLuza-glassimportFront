// src/pages/admin/AdminLayout.jsx

import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar"; 

export const AdminLayout = () => {
    return (
        <div className="admin-page-layout">
            
            {/* Sidebar */}
            <Sidebar />
            
            {/* Contenido dinámico según la ruta */}
            <main className="admin-content-area">
                <Outlet />
            </main>

            <style>{`
                .admin-page-layout {
                    display: flex;
                    min-height: 100vh;
                    background-color: #f8fafc; 
                }
                .admin-content-area {
                    flex-grow: 1; 
                    padding: 20px;
                    margin-left: 250px; 
                    width: calc(100% - 250px);
                    box-sizing: border-box;
                }
            `}</style>
        </div>
    );
};
