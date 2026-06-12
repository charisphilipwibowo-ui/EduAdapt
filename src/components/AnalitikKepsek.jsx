import { useState, useEffect } from 'react';
import API from '../api';

const AnalitikKepsek = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await API.get('/analitik/kepsek');
                setData(res.data);
            } catch (err) {
                console.error("Gagal memuat analitik kepsek:", err);
                setError("Gagal memuat rekapitulasi analitik sekolah. Pastikan backend server aktif.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const summary = data?.summary || {};
    const perMapel = data?.per_mapel || [];
    const perLevel = data?.per_level || [];
    const perJenis = data?.per_jenis_ujian || [];

    const badgeColorForLevel = (level) => {
        switch ((level || '').toLowerCase()) {
            case 'sedang': return { bg: '#fff7ed', text: '#c2410c' };
            case 'sulit': return { bg: '#fef2f2', text: '#b91c1c' };
            default: return { bg: '#ecfdf5', text: '#047857' };
        }
    };

    return (
        <div style={{ boxSizing: 'border-box', backgroundColor: '#fafafa', minHeight: '100vh', width: '100%', padding: '32px', textAlign: 'left' }}>

            {/* BANNER */}
            <div style={{
                background: 'linear-gradient(135deg, #4b5563 0%, #1f2937 100%)',
                borderRadius: '24px',
                padding: '32px 40px',
                color: '#ffffff',
                marginBottom: '32px',
                boxShadow: '0 10px 25px rgba(31, 41, 55, 0.12)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxSizing: 'border-box'
            }}>
                <div>
                    <h1 style={{ fontSize: '26px', fontWeight: '800', margin: '0 0 6px 0', letterSpacing: '-0.02em', color: '#ffffff' }}>
                        Analitik Sekolah 🏛️
                    </h1>
                    <p style={{ margin: 0, fontSize: '14px', color: '#d1d5db', fontWeight: '500' }}>
                        Rekapitulasi menyeluruh pencapaian akademik seluruh siswa.
                    </p>
                </div>
                <div style={{ fontSize: '54px' }}>🎓</div>
            </div>

            {error && (
                <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '16px', padding: '16px 20px', color: '#b91c1c', fontSize: '13px', fontWeight: '600', marginBottom: '32px' }}>
                    ⚠️ {error}
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b', fontWeight: '600' }}>
                    ⏳ Mengompilasi data analitik sekolah...
                </div>
            ) : (
                <>
                    {/* KARTU SUMMARY */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', border: '1px solid #e5e7eb' }}>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Siswa Aktif Mengerjakan</span>
                            <span style={{ fontSize: '32px', fontWeight: '800', color: '#111827', display: 'block' }}>{summary.total_siswa_aktif || 0}</span>
                        </div>
                        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', border: '1px solid #e5e7eb' }}>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Total Data Nilai</span>
                            <span style={{ fontSize: '32px', fontWeight: '800', color: '#111827', display: 'block' }}>{summary.total_data_nilai || 0}</span>
                        </div>
                        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', border: '1px solid #e5e7eb' }}>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Rata-rata Sekolah</span>
                            <span style={{ fontSize: '32px', fontWeight: '800', color: '#2563eb', display: 'block' }}>{summary.rata_rata_sekolah ?? '-'}</span>
                        </div>
                        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', border: '1px solid #e5e7eb' }}>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Tertinggi / Terendah</span>
                            <span style={{ fontSize: '24px', fontWeight: '800', color: '#111827', display: 'block' }}>
                                <span style={{ color: '#047857' }}>{summary.skor_tertinggi ?? '-'}</span>
                                {' / '}
                                <span style={{ color: '#b91c1c' }}>{summary.skor_terendah ?? '-'}</span>
                            </span>
                        </div>
                    </div>

                    {/* GRID: PER MAPEL & PER LEVEL */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
                        {/* PER MATA PELAJARAN */}
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e5e7eb', padding: '28px' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#111827', margin: '0 0 16px 0' }}>Rata-rata per Mata Pelajaran</h2>
                            {perMapel.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '20px 0', color: '#94a3b8', fontSize: '13px' }}>Belum ada data nilai.</div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {perMapel.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                                            <div>
                                                <span style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>{item.nama_mapel || 'Tanpa Nama'}</span>
                                                <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '8px' }}>({item.jumlah_data} data)</span>
                                            </div>
                                            <span style={{ fontSize: '16px', fontWeight: '800', color: '#2563eb' }}>{item.rata_rata}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* PER LEVEL ADAPTIF */}
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e5e7eb', padding: '28px' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#111827', margin: '0 0 16px 0' }}>Rata-rata per Tingkat Kesulitan</h2>
                            {perLevel.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '20px 0', color: '#94a3b8', fontSize: '13px' }}>Belum ada data nilai.</div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {perLevel.map((item, idx) => {
                                        const badge = badgeColorForLevel(item.level_adaptif);
                                        return (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{ backgroundColor: badge.bg, color: badge.text, padding: '4px 12px', borderRadius: '99px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>
                                                        {item.level_adaptif || 'Tidak Diketahui'}
                                                    </span>
                                                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>({item.jumlah_data} data)</span>
                                                </div>
                                                <span style={{ fontSize: '16px', fontWeight: '800', color: '#2563eb' }}>{item.rata_rata}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* PER JENIS UJIAN */}
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e5e7eb', padding: '36px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', margin: '0 0 20px 0' }}>Rata-rata per Jenis Ujian</h2>

                        {perJenis.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontWeight: '500' }}>
                                Belum ada data nilai.
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                                {perJenis.map((item, idx) => (
                                    <div key={idx} style={{ border: '1px solid #e5e7eb', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
                                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>{item.jenis_ujian}</span>
                                        <span style={{ fontSize: '28px', fontWeight: '800', color: '#2563eb', display: 'block', marginBottom: '4px' }}>{item.rata_rata}</span>
                                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>{item.jumlah_data} data</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default AnalitikKepsek;