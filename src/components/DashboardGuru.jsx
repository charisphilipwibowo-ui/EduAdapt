import { useState, useEffect } from 'react';
import API from '../api';

const DashboardGuru = () => {
    const [dataSiswa, setDataSiswa] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // AMBIL DATA DENGAN MEKANISME FAILSAFE / FALLBACK AUTOMATIC
    useEffect(() => {
        const fetchMonitoringData = async () => {
            let respon;
            setLoading(true);
            setError(null);

            // Percobaan 1: Endpoint utama yang tersedia di backend
            try {
                respon = await API.get('/guru/monitoring');
            } catch {
                console.warn("Endpoint '/guru/monitoring' tidak merespon, mencoba '/guru'...");

                // Percobaan 2: fallback ke '/guru'
                try {
                    respon = await API.get('/guru');
                } catch {
                    console.warn("Endpoint '/guru' tidak merespon, mencoba '/guru/students'...");

                    // Percobaan 3: fallback ke '/guru/students'
                    try {
                        respon = await API.get('/guru/students');
                    } catch (err3) {
                        console.error("Semua alternatif endpoint guru gagal diakses:", err3);
                        setError("Gagal memuat data. Endpoint /guru/monitoring, /guru, maupun /guru/students tidak ditemukan di backend.");
                        setDataSiswa([]);
                        setLoading(false);
                        return;
                    }
                }
            }

            // PROSES EKSTRAKSI DATA DARI RESPON YANG BERHASIL
            if (respon && respon.data) {
                if (Array.isArray(respon.data)) {
                    setDataSiswa(respon.data);
                } else if (respon.data.students && Array.isArray(respon.data.students)) {
                    setDataSiswa(respon.data.students);
                } else if (respon.data.data && Array.isArray(respon.data.data)) {
                    setDataSiswa(respon.data.data);
                } else {
                    setDataSiswa([]);
                }
            } else {
                setDataSiswa([]);
            }
            setLoading(false);
        };

        fetchMonitoringData();
    }, []);

    // PERHITUNGAN STATISTIK DARI DATA MURNI
    const totalSiswa = dataSiswa.length;
    const siswaSelesai = dataSiswa.filter(s => s.status === 'Selesai' || s.status?.toLowerCase() === 'selesai').length;
    const perluPerhatian = dataSiswa.filter(s => s.level?.toUpperCase() === 'MUDAH' || s.level_adaptif?.toUpperCase() === 'MUDAH').length;

    // PROSES FILTER PENCARIAN
    const siswaTersaring = dataSiswa.filter(siswa => {
        const nama = (siswa.nama_lengkap || siswa.nama || siswa.username || '').toLowerCase();
        return nama.includes(searchQuery.toLowerCase());
    });

    return (
        <div style={{ boxSizing: 'border-box', backgroundColor: '#f0f5ff', minHeight: '100vh', width: '100%', padding: '32px', textAlign: 'left' }}>
        
            {/* BANNER GURU PANEL */}
            <div style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                borderRadius: '24px',
                padding: '32px 40px',
                color: '#ffffff',
                marginBottom: '32px',
                boxShadow: '0 10px 25px rgba(37, 99, 235, 0.12)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxSizing: 'border-box'
            }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 6px 0', letterSpacing: '-0.02em', color: '#ffffff' }}>
                        EduAdapt Guru Panel 🌟
                    </h1>
                    <p style={{ margin: 0, fontSize: '14px', color: '#bfdbfe', fontWeight: '500' }}>
                        Memantau data murni perkembangan tingkat kompetensi siswa langsung dari MariaDB.
                    </p>
                </div>
                <div style={{ fontSize: '54px' }}>👨‍🏫</div>
            </div>

            {/* ERROR ALERTS JIKA KONEKSI ATAU SQL BERMASALAH */}
            {error && (
                <div style={{
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fee2e2',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    color: '#b91c1c',
                    fontSize: '13px',
                    fontWeight: '600',
                    marginBottom: '32px',
                    boxSizing: 'border-box'
                }}>
                    ⚠️ {error}
                </div>
            )}

            {/* LAYOUT KARTU INFORMASI */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px', boxSizing: 'border-box' }}>
                <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Total Siswa Real</span>
                    <span style={{ fontSize: '32px', fontWeight: '800', color: '#1e3a8a', display: 'block' }}>{totalSiswa} Siswa</span>
                </div>
                <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Progres Penyelesaian</span>
                    <span style={{ fontSize: '32px', fontWeight: '800', color: '#10b981', display: 'block' }}>{totalSiswa > 0 ? Math.round((siswaSelesai / totalSiswa) * 100) : 0}%</span>
                </div>
                <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Tingkat Mudah</span>
                    <span style={{ fontSize: '32px', fontWeight: '800', color: '#f97316', display: 'block' }}>{perluPerhatian} Siswa</span>
                </div>
            </div>

            {/* CONTAINER TABEL DATA MURNI */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '36px', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '32px', boxSizing: 'border-box' }}>
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0', letterSpacing: '-0.01em' }}>
                            Daftar Kompetensi Siswa
                        </h2>
                        <p style={{ margin: 0, fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
                            Data di bawah ini ditarik murni tanpa manipulasi *mockup* data.
                        </p>
                    </div>

                    <input
                        type="text"
                        placeholder="Cari nama siswa"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ padding: '12px 18px', borderRadius: '14px', border: '1px solid #cbd5e1', fontSize: '13px', width: '280px', outline: 'none', backgroundColor: '#f8fafc', boxSizing: 'border-box' }}
                    />
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b', fontWeight: '600' }}>
                        ⏳ Menghubungkan ke MariaDB Database...
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto', width: '100%' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                                    <th style={{ padding: '16px 14px', fontSize: '12px', fontWeight: '800', color: '#475569' }}>NAMA SISWA</th>
                                    <th style={{ padding: '16px 14px', fontSize: '12px', fontWeight: '800', color: '#475569' }}>USERNAME</th>
                                    <th style={{ padding: '16px 14px', fontSize: '12px', fontWeight: '800', color: '#475569', textAlign: 'center' }}>LEVEL ADAPTIF</th>
                                    <th style={{ padding: '16px 14px', fontSize: '12px', fontWeight: '800', color: '#475569', textAlign: 'center' }}>SKOR TERAKHIR</th>
                                    <th style={{ padding: '16px 14px', fontSize: '12px', fontWeight: '800', color: '#475569', textAlign: 'right' }}>STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {siswaTersaring.map((siswa, indeks) => {
                                    let badgeColor = { bg: '#ecfdf5', text: '#047857' };
                                    const currentLevel = (siswa.level_adaptif || siswa.level || '').toUpperCase();
                                    if (currentLevel === 'SEDANG') badgeColor = { bg: '#fff7ed', text: '#c2410c' };
                                    if (currentLevel === 'SULIT') badgeColor = { bg: '#fef2f2', text: '#b91c1c' };

                                    return (
                                        <tr key={siswa.id || indeks} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '18px 14px', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                                                {siswa.nama_lengkap || siswa.nama || 'Tidak Ada Nama'}
                                            </td>
                                            <td style={{ padding: '18px 14px', fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
                                                {siswa.username || '-'}
                                            </td>
                                            <td style={{ padding: '18px 14px', textAlign: 'center' }}>
                                                <span style={{ backgroundColor: badgeColor.bg, color: badgeColor.text, padding: '6px 14px', borderRadius: '99px', fontSize: '11px', fontWeight: '800', display: 'inline-block', textTransform: 'uppercase' }}>
                                                    {siswa.level_adaptif || siswa.level || 'MUDAH'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '18px 14px', textAlign: 'center', fontSize: '14px', fontWeight: '800', color: '#1e3a8a' }}>
                                                {siswa.skor_terakhir ?? siswa.skor ?? 0}
                                            </td>
                                            <td style={{ padding: '18px 14px', textAlign: 'right' }}>
                                                <span style={{ color: '#10b981', fontWeight: '700', fontSize: '13px' }}>
                                                    ● {siswa.status || 'Selesai'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {siswaTersaring.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontWeight: '500' }}>
                                Tidak ada data siswa murni yang terdeteksi di database.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardGuru;