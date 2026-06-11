import { useState } from 'react';
import Login from './components/login';
import DashboardGuru from './components/DashboardGuru';
import DashboardSiswa from './components/DashboardSiswa';

// REUSABLE SIDEBAR ITEM COMPONENT DENGAN HOVER & ACTIVE STATE DYNAMIC
const SidebarItem = ({ id, label, activeMenu, setActiveMenu }) => {
  const isActive = activeMenu === id;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={() => setActiveMenu(id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => !isActive && setIsHovered(false)}
      style={{
        padding: '12px 16px',
        backgroundColor: isActive ? '#1e293b' : isHovered ? 'rgba(255,255,255,0.03)' : 'transparent',
        color: isActive ? '#ffffff' : isHovered ? '#f8fafc' : '#94a3b8',
        borderRadius: '10px',
        fontWeight: isActive ? '600' : '500',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}
    >
      {/* Indikator Garis Vertikal Kecil untuk Menu Aktif */}
      {isActive && (
        <div style={{ width: '4px', height: '14px', backgroundColor: '#4f46e5', borderRadius: '99px' }} />
      )}
      {label}
    </div>
  );
};

function App() {
  const [user, setUser] = useState(() => {
    const userLokal = localStorage.getItem('user');
    return userLokal ? JSON.parse(userLokal) : null;
  });

  // STATE UNTUK MENGONTROL NAVIGASI SIDEBAR
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setActiveMenu('dashboard'); // Reset menu ke awal
  };

  const handleLoginSuccess = (dataUser) => {
    localStorage.setItem('user', JSON.stringify(dataUser));
    setUser(dataUser);
  };

  // KONDISI BELUM LOGIN
  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

// RENDER MAIN WORKSPACE BERDASARKAN KONDISI MENU AKTIF
  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return user.role === 'guru' ? (
          <DashboardGuru />
        ) : (
          <DashboardSiswa userContext={user} setUserContext={setUser} />
        );
        
      case 'catalog':
        return (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px 0' }}>Course Catalog</h3>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0, maxWidth: '400px', marginInline: 'auto', lineHeight: '1.5' }}>
              Modul katalog silabus dan materi pembelajaran adaptif sedang dipersiapkan untuk sinkronisasi kurikulum.
            </p>
          </div>
        );
        
      case 'analytics':
        return (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px 0' }}>Analytics Report</h3>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0, maxWidth: '400px', marginInline: 'auto', lineHeight: '1.5' }}>
              Grafik performa komparatif, visualisasi matriks, dan rekam jejak capaian evaluasi adaptif kamu akan tampil di sini.
            </p>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: '"Inter", sans-serif' }}>
      
      {/* SIDEBAR NAVIGATION PANEL */}
      <aside style={{
        width: '260px',
        backgroundColor: '#ffffff', // Mengubah warna latar dari hitam menjadi putih bersih
        borderRight: '1px solid #e2e8f0', // Batas garis tipis estetik
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '32px 20px',
        boxSizing: 'border-box'
      }}>
        
        {/* Bagian Menu Atas */}
        <div>
          {/* BRANDING LOGO */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px', paddingLeft: '8px' }}>
            <span style={{ fontSize: '28px' }}>🎓</span>
            <span style={{ fontSize: '18px', fontWeight: '800', color: '#1e3a8a', letterSpacing: '-0.02em' }}>EduAdapt</span>
          </div>

          {/* LIST ITEM MENU NAVIGASI */}
          {/* Pastikan menu yang aktif (activeMenu) diberi background biru transparan '#eff6ff' dan teks biru '#2563eb' */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <SidebarItem id="dashboard" label="📊 Dashboard" activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
            <SidebarItem id="catalog" label="📚 Katalog Materi" activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
            <SidebarItem id="analytics" label="📈 Analitik" activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
          </nav>
        </div>

        {/* TOMBOL KELUAR APLIKASI DI BAGIAN BAWAH SIDEBAR */}
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '12px 0',
            backgroundColor: '#fff1f2', // Latar merah muda soft yang ramah
            color: '#e11d48', // Teks merah cerah penanda keluar
            border: '1px solid #ffe4e6',
            borderRadius: '12px',
            fontWeight: '700',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          🚪 Keluar Aplikasi
        </button>
      </aside>

      {/* RIGHT CONTENT CONTAINER */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* GLOBAL HEADER TOPBAR */}
        <header style={{ height: '70px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ position: 'relative' }}>
            <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>Sistem Manajemen Pembelajaran Adaptif Digital</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{user.nama || user.username}</span>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{user.role} Account</span>
            </div>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#475569', border: '2px solid #fff', boxShadow: '0 0 0 2px #4f46e5' }}>
              {(user.nama || user.username).charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* CONTROLLER ROUTER WORKSPACE AREA */}
        <main style={{ 
          flex: 1, 
          padding: '40px', 
          boxSizing: 'border-box',
          backgroundColor: '#f8fafc',
          minHeight: 'calc(100vh - 70px)', // Menghitung sisa tinggi layar setelah dikurangi header
          overflowY: 'auto' // Jika konten panjang, dia akan membuat scroll internal yang rapi
        }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;