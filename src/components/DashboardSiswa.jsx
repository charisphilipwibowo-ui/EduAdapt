import { useState } from 'react';
import Kuis from './kuis';

const DashboardSiswa = ({ userContext, setUserContext }) => {
    const [isKuisActive, setIsKuisActive] = useState(false);

    // Mengambil data user yang sedang login (fallback jika context belum siap)
    const namaSiswa = userContext?.nama_lengkap || userContext?.username || 'Siswa';
    const levelSiswa = userContext?.level || 'SEDANG';

    // FUNGSI UNTUK MENANGKAP PEMBARUAN LEVEL SETELAH KUIS SELESAI
    const handleCloseKuis = (levelBaru) => {
        setIsKuisActive(false);
        if (levelBaru && setUserContext) {
        // Memperbarui state global user agar badge kompetensi di dashboard ikut terupdate
        setUserContext(prev => ({
            ...prev,
            level: levelBaru
        }));
        }
    };

  // KONDISI EKSKLUSIF: Render halaman kuis secara penuh jika sedang aktif
    if (isKuisActive) {
        return (
        <div style={{ padding: '8px', boxSizing: 'border-box' }}>
            <Kuis onCloseKuis={handleCloseKuis} />
        </div>
        );
    }

    // PEWARNAAN BADGE DINAMIS SESUAI TINGKAT KOMPETENSI ADAPTIF
    const getBadgeStyle = () => {
        switch (levelSiswa.toUpperCase()) {
        case 'SULIT':
            return { bg: '#fef2f2', border: '#fca5a5', text: '#ef4444', emoji: '🔥' };
        case 'SEDANG':
            return { bg: '#fff7ed', border: '#fdba74', text: '#f97316', emoji: '⚡' };
        default: // MUDAH
            return { bg: '#ecfdf5', border: '#6ee7b7', text: '#10b981', emoji: '🌱' };
        }
    };

    const badge = getBadgeStyle();

    return (
        <div style={{ padding: '8px', boxSizing: 'border-box' }}>
        
        {/* 1. WELCOME CARD HERO (Sesuai Konsep EdTech Cerah Modern) */}
        <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '36px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.02)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px',
            marginBottom: '36px'
        }}>
            <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1e3a8a', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
                Selamat belajar hari ini, {namaSiswa}! 👋
            </h1>
            <p style={{ margin: 0, fontSize: '14px', color: '#64748b', fontWeight: '500', lineHeight: '1.5' }}>
                Terus semangat, kamu hebat! Sistem adaptif siap menguji dan mengasah pemahaman logikamu hari ini.
            </p>
            </div>

            {/* COMPACT COMPETENCY BADGE */}
            <div style={{
            backgroundColor: badge.bg,
            border: `1px solid ${badge.border}`,
            padding: '12px 20px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)'
            }}>
            <span style={{ fontSize: '20px' }}>{badge.emoji}</span>
            <div>
                <span style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Tingkat Kompetensi
                </span>
                <span style={{ fontSize: '15px', fontWeight: '800', color: badge.text }}>
                {levelSiswa}
                </span>
            </div>
            </div>
        </div>

        {/* 2. DAFTAR MODUL EVALUASI TERSEDIA */}
        <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 20px 4px', letterSpacing: '-0.01em' }}>
            Modul Evaluasi Tersedia
        </h2>

        {/* EVALUATION CARD ROW */}
        <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
            padding: '32px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px'
        }}>
            {/* INFO MODUL */}
            <div style={{ flex: 1, minWidth: '280px' }}>
            <span style={{ 
                fontSize: '11px', 
                fontWeight: '800', 
                color: '#2563eb', 
                backgroundColor: '#eff6ff', 
                padding: '6px 12px', 
                borderRadius: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }}>
                📋 Core Evaluation
            </span>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '14px 0 8px 0' }}>
                Kuis Adaptif Ilmu Informatika
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.6', fontWeight: '500' }}>
                Engine kuis otomatis mendeteksi akurasi logika jawaban untuk menyesuaikan tingkat kesulitan soal berikutnya secara dinamis.
            </p>
            <div style={{ marginTop: '16px', fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>
                ⏱️ Estimasi: 5 Paket Soal
            </div>
            </div>

            {/* ACTIONS: BUTTON MASUK RUANG UJIAN (WARNA BIRU PRIMER MODERN) */}
            <div>
            <button
                onClick={() => setIsKuisActive(true)}
                style={{
                padding: '14px 28px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '14px',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
                onMouseDown={(e) => e.target.style.transform = 'scale(0.97)'}
                onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
            >
                Masuk Ruang Ujian →
            </button>
            </div>
        </div>

        </div>
    );
};

export default DashboardSiswa;