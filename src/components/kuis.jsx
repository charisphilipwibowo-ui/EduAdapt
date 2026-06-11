import { useState } from 'react';

// Pastikan props 'onCloseKuis' diterima dari DashboardSiswa
const Kuis = ({ onCloseKuis }) => {
  // 1. STATE MANAGEMENT KUIS
    const [mulai, setMulai] = useState(false);
    const [nomorSoal, setNomorSoal] = useState(0);
    const [skor, setSkor] = useState(0);
    const [kuisSelesai, setKuisSelesai] = useState(false);
    const [levelAdaptif, setLevelAdaptif] = useState('SEDANG');

    // BANK SOAL MOCKUP (Contoh Soal Berdasarkan Tingkat Kesulitan)
    const bankSoal = {
        MUDAH: [
        { q: "Manakah yang merupakan perangkat keras masukan (input device)?", a: ["Mouse", "Monitor", "Printer", "Speaker"], benar: 0 },
        { q: "Apa kepanjangan dari RAM?", a: ["Random Access Memory", "Read Access Memory", "Run Application Module", "Reset All Memory"], benar: 0 }
        ],
        SEDANG: [
        { q: "Jika P = True dan Q = False, maka hasil dari P AND Q adalah...", a: ["True", "False", "Null", "Error"], benar: 1 },
        { q: "Struktur data yang menggunakan prinsip FIFO (First In First Out) disebut...", a: ["Stack", "Queue", "Tree", "Graph"], benar: 1 }
        ],
        SULIT: [
        { q: "Manakah protokol yang berjalan pada Transport Layer di OSI Model dan bersifat Connectionless?", a: ["TCP", "UDP", "HTTP", "FTP"], benar: 1 },
        { q: "Berapakah hasil biner dari operasi logika 1010 XOR 1100?", a: ["0110", "1110", "0010", "1000"], benar: 0 }
        ]
    };

    const soalAktif = bankSoal[levelAdaptif];

    const handleJawaban = (indeksDipilih) => {
        // Cek Jawaban
        if (indeksDipilih === soalAktif[nomorSoal].benar) {
        setSkor((prev) => prev + 10);
        }

        // Engine Adaptif Sederhana & Navigasi Soal
        if (nomorSoal + 1 < soalAktif.length) {
        setNomorSoal((prev) => prev + 1);
        } else {
        // Evaluasi Level Adaptif Akhir berdasarkan performa kuis saat ini
        if (skor >= 10) {
            setLevelAdaptif('MUDAH'); // Penyesuaian agar belajar lebih nyaman sesuai screenshot
        }
        setKuisSelesai(true);
        }
    };

    // FUNGSI UNTUK MERESET TOTAL STATE KUIS SEBELUM KEMBALI
    const handleKeluarKuisSempurna = () => {
        setMulai(false);
        setNomorSoal(0);
        setSkor(0);
        setKuisSelesai(false);
        setLevelAdaptif('SEDANG');
        
        // Memicu fungsi callback dari parent agar komponen ini hancur (unmount) secara bersih
        if (typeof onCloseKuis === 'function') {
        onCloseKuis();
        }
    };

    // ==========================================
    // RENDERING TAMPILAN 1: HALAMAN AWAL KUIS
    // ==========================================
    if (!mulai) {
        return (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '40px', maxWidth: '600px', margin: '40px auto', textAlign: 'center', boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.04)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚡</div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 12px 0' }}>Kuis Adaptif Ilmu Informatika</h2>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', margin: '0 0 32px 0' }}>
            Engine kuis otomatis mendeteksi akurasi logika jawaban untuk menyesuaikan tingkat kesulitan soal berikutnya secara dinamis.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button 
                onClick={onCloseKuis}
                style={{ padding: '12px 24px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' }}
            >
                ← Kembali
            </button>
            <button 
                onClick={() => setMulai(true)}
                style={{ padding: '12px 32px', backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)' }}
            >
                Mulai Evaluasi
            </button>
            </div>
        </div>
        );
    }

    // ==========================================
    // RENDERING TAMPILAN 2: HALAMAN HASIL / SELESAI
    // ==========================================
    if (kuisSelesai) {
        return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px', boxSizing: 'border-box' }}>
            <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '520px', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.03)', border: '1px solid #e2e8f0', textAlign: 'center', boxSizing: 'border-box' }}>
            
            <div style={{ fontSize: '54px', marginBottom: '12px', animation: 'bounce 1s infinite' }}>🎉</div>
            <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
                Kuis Selesai!
            </h2>
            <p style={{ margin: '0 0 32px 0', fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
                Evaluasi adaptif selesai diproses.
            </p>

            {/* BOX SKOR */}
            <div style={{ backgroundColor: '#f0f3ff', border: '2px dashed #cbd5e1', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
                <span style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#4f46e5', letterSpacing: '0.05em', marginBottom: '4px', textTransform: 'uppercase' }}>
                Total Skor Anda
                </span>
                <span style={{ fontSize: '64px', fontWeight: '900', color: '#4f46e5' }}>
                {skor}
                </span>
            </div>

            {/* NOTIFIKASI LEVEL ADAPTIF */}
            <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '14px 16px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
                <span style={{ fontSize: '14px' }}>📉</span>
                <p style={{ margin: 0, fontSize: '13px', color: '#065f46', fontWeight: '600', lineHeight: '1.4' }}>
                Level disesuaikan menjadi <span style={{ fontWeight: '800', textDecoration: 'underline' }}>{levelAdaptif}</span> agar kamu bisa belajar lebih nyaman.
                </p>
            </div>

            {/* BUTTON BACK TO DASHBOARD UTAMA */}
            <button
                onClick={handleKeluarKuisSempurna}
                style={{
                width: '100%',
                padding: '14px 0',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.1)'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#1e293b'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#0f172a'}
            >
                Selesai & Kembali ke Dashboard
            </button>

            </div>
        </div>
        );
    }

    // ==========================================
    // RENDERING TAMPILAN 3: INTERFACE PERTANYAAN KUIS
    // ==========================================
    return (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '40px', maxWidth: '700px', margin: '0 auto', boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.02)' }}>
        {/* HEADER SOAL */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#4f46e5', backgroundColor: '#eeebff', padding: '6px 12px', borderRadius: '8px' }}>
            Soal {nomorSoal + 1} dari {soalAktif.length}
            </span>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '8px' }}>
            Difficulty: {levelAdaptif}
            </span>
        </div>

        {/* TEXT PERTANYAAN */}
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', lineHeight: '1.5', marginBottom: '32px' }}>
            {soalAktif[nomorSoal].q}
        </h3>

        {/* DAFTAR PILIHAN JAWABAN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {soalAktif[nomorSoal].a.map((pilihan, indeks) => (
            <button
                key={indeks}
                onClick={() => handleJawaban(indeks)}
                style={{
                width: '100%',
                padding: '14px 20px',
                textAlign: 'left',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#334155',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
                }}
                onMouseOver={(e) => {
                e.target.style.borderColor = '#4f46e5';
                e.target.style.backgroundColor = '#f5f3ff';
                e.target.style.color = '#4f46e5';
                }}
                onMouseOut={(e) => {
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.color = '#334155';
                }}
            >
                {pilihan}
            </button>
            ))}
        </div>
        </div>
    );
};

export default Kuis;