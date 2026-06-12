import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();

    return (
        <div style={{
        width: '260px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
        boxSizing: 'border-box'
        }}>
        {/* Logo EduAdapt */}
        <div style={{ fontSize: '20px', fontWeight: '800', color: '#2563eb', marginBottom: '40px' }}>
            EduAdapt
        </div>

        {/* Menu Navigasi */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            <div style={{ cursor: 'pointer', color: '#1e293b', fontWeight: '600' }} onClick={() => navigate('/dashboard-guru')}>Dashboard</div>
            <div style={{ cursor: 'pointer', color: '#64748b' }} onClick={() => navigate('/materi-guru')}>Katalog Materi</div>
            <div style={{ cursor: 'pointer', color: '#64748b' }} onClick={() => navigate('/analitik-guru')}>Analitik</div>
        </div>

        {/* Tombol Logout */}
        <button 
            onClick={() => { localStorage.clear(); navigate('/login'); }}
            style={{ padding: '10px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
            Logout
        </button>
        </div>
    );
};

export default Sidebar;