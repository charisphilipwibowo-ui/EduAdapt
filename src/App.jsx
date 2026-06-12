import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import Layout from './components/Layout';
import DashboardSiswa from './components/DashboardSiswa';
import DashboardGuru from './components/DashboardGuru';
import DashboardWali from './components/DashboardWali';
import DashboardKepsek from './components/DashboardKepsek';
import KatalogMateriGuru from './components/KatalogMateriGuru';
import AnalitikSiswa from './components/AnalitikSiswa';
import AnalitikGuru from './components/AnalitikGuru';
import AnalitikWali from './components/AnalitikWali';
import AnalitikKepsek from './components/AnalitikKepsek';

function App() {
    return (
        <Router>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" />} />
            
            {/* Menggunakan Layout untuk membungkus dashboard */}
            <Route path="/dashboard-siswa" element={<Layout><DashboardSiswa /></Layout>} />
            <Route path="/dashboard-guru" element={<Layout><DashboardGuru /></Layout>} />
            <Route path="/dashboard-wali" element={<Layout><DashboardWali /></Layout>} />
            <Route path="/dashboard-kepsek" element={<Layout><DashboardKepsek /></Layout>} />

            {/* Halaman Katalog Materi untuk Guru */}
            <Route path="/materi-guru" element={<Layout><KatalogMateriGuru /></Layout>} />

            {/* Halaman Analitik untuk semua role */}
            <Route path="/analitik-siswa" element={<Layout><AnalitikSiswa /></Layout>} />
            <Route path="/analitik-guru" element={<Layout><AnalitikGuru /></Layout>} />
            <Route path="/analitik-wali" element={<Layout><AnalitikWali /></Layout>} />
            <Route path="/analitik-kepsek" element={<Layout><AnalitikKepsek /></Layout>} />
        </Routes>
        </Router>
    );
}
export default App;