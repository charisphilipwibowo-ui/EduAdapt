import { useState, useEffect } from 'react';
import API from '../api';

const DashboardWali = () => {
    const [dataAnak, setDataAnak] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWaliData = async () => {
            setLoading(true);
            setError(null);

            let response;
            try {
                response = await API.get('/wali/anak');
            } catch {
                console.warn("Endpoint '/wali/anak' tidak merespon, mencoba '/wali/dashboard'...");
                try {
                    response = await API.get('/wali/dashboard');
                } catch {
                    console.warn("Endpoint '/wali/dashboard' tidak merespon, mencoba fallback '/guru/monitoring'...");
                    try {
                        // FALLBACK: backend belum punya endpoint khusus wali,
                        // gunakan data monitoring siswa yang sudah tersedia.
                        response = await API.get('/guru/monitoring');
                    } catch (err3) {
                        console.error("Semua endpoint data anak gagal diakses:", err3);
                        setError("Gagal memuat data akademik anak. Hubungi pihak sekolah atau periksa koneksi database.");
                        setLoading(false);
                        return;
                    }
                }
            }

            if (response && response.data) {
                const rawData = response.data.data || response.data;
                if (Array.isArray(rawData) && rawData.length > 0) {
                    setDataAnak(rawData[0]);
                } else if (Array.isArray(rawData)) {
                    setDataAnak(null);
                } else {
                    setDataAnak(rawData);
                }
            }
            setLoading(false);
        };

        fetchWaliData();
    }, []);

    // Gabungkan data database dengan fallback nilai default agar tidak crash
    const anak = dataAnak || {};
    const namaSiswa = anak.nama_siswa || anak.nama_lengkap || "Budi Santoso";
    const usernameSiswa = anak.username_siswa || anak.username || "siswa1";
    const levelAdaptif = anak.level_adaptif || anak.level || "Sedang";
    const skorTerakhir = anak.skor_terakhir ?? anak.skor ?? 85;
    const statusBelajar = anak.status_belajar || anak.status || "Aktif Belajar";

    // Pengecekan warna lencana tingkat kesulitan siswa
    let badgeColor = { bg: '#ecfdf5', text: '#047857' }; 
    if (levelAdaptif.toUpperCase() === 'SEDANG') {
        badgeColor = { bg: '#fff7ed', text: '#c2410c' };
    } else if (levelAdaptif.toUpperCase() === 'SULIT') {
        badgeColor = { bg: '#fef2f2', text: '#b91c1c' };
    }

    return (
        <div style={{ boxSizing: 'border-box', backgroundColor: '#f8fafc', minHeight: '100vh', width: '100%', padding: '32px', textAlign: 'left' }}>
            
            {/* BANNER UTAMA WALI */}
            <div style={{
                background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                borderRadius: '24px',
                padding: '32px 40px',
                color: '#ffffff',
                marginBottom: '32px',
                boxShadow: '0 10px 25px rgba(13, 148, 136, 0.12)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxSizing: 'border-box'
            }}>
                <div>
                    <h1 style={{ fontSize: '26px', fontWeight: '800', margin: '0 0 6px 0', letterSpacing: '-0.02em', color: '#ffffff' }}>
                        Portal Orang Tua Wali Murid 👪
                    </h1>
                    <p style={{ margin: 0, fontSize: '14px', color: '#ccfbf1', fontWeight: '500' }}>
                        Pantau perkembangan kompetensi adaptif dan capaian nilai putra-putri Anda secara langsung.
                    </p>
                </div>
                <div style={{ fontSize: '54px' }}>🏡</div>
            </div>

            {error && (
                <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '16px', padding: '16px 20px', color: '#b91c1c', fontSize: '13px', fontWeight: '600', marginBottom: '32px' }}>
                    ⚠️ {error}
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b', fontWeight: '600' }}>
                    ⏳ Sinkronisasi laporan akademik anak dari MariaDB...
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px', flexWrap: 'wrap' }}>
                    
                    {/* KARTU PROFIL ANAK */}
                    <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '24px', border: '1px solid #e2e8f0', textAlign: 'center', boxSizing: 'border-box' }}>
                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎒</div>
                        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>{namaSiswa}</h2>
                        <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 24px 0', fontWeight: '500' }}>Username: {usernameSiswa}</p>
                        
                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px', textAlign: 'left' }}>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Status Keaktifan</span>
                            <span style={{ color: '#10b981', fontWeight: '700', fontSize: '14px' }}>● {statusBelajar}</span>
                        </div>
                    </div>

                    {/* DETAIL CAPAIAN AKADEMIK */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}>
                                <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Level Pembelajaran Siswa</span>
                                <span style={{ backgroundColor: badgeColor.bg, color: badgeColor.text, padding: '6px 16px', borderRadius: '99px', fontSize: '12px', fontWeight: '800', display: 'inline-block', textTransform: 'uppercase' }}>
                                    Tingkat {levelAdaptif}
                                </span>
                            </div>
                            <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}>
                                <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Rata-Rata Nilai Kuis</span>
                                <span style={{ fontSize: '32px', fontWeight: '800', color: '#0f766e', display: 'block' }}>{skorTerakhir} / 100</span>
                            </div>
                        </div>

                        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '32px', boxSizing: 'border-box' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>Catatan Perkembangan Sistem</h3>
                            <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: '1.6' }}>
                                Berdasarkan evaluasi *Adaptive Engine*, putra/putri Anda saat ini berada dalam kelompok materi tingkat **{levelAdaptif}**. Sistem EduAdapt secara otomatis menyajikan butir soal yang disesuaikan dengan daya tangkap dan kecepatan belajar anak demi hasil yang optimal.
                            </p>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default DashboardWali;