import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import Layout from './components/Layout';
import DashboardSiswa from './components/DashboardSiswa';
import DashboardGuru from './components/DashboardGuru';
import DashboardWali from './components/DashboardWali';
import DashboardKepsek from './components/DashboardKepsek';
import KatalogMateriGuru from './components/KatalogMateriGuru';

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
        </Routes>
        </Router>
    );
}
export default App;