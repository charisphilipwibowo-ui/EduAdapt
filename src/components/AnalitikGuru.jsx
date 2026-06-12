import { useState, useEffect } from 'react';
import API from '../api';

const AnalitikGuru = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await API.get('/analitik/guru');
                setData(res.data);
            } catch (err) {
                console.error("Gagal memuat analitik guru:", err);
                setError("Gagal memuat data analitik. Pastikan backend server aktif.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const perMapel = data?.per_mapel || [];
    const perLevel = data?.per_level || [];
    const perSiswa = data?.per_siswa || [];

    const badgeColorForLevel = (level) => {
        switch ((level || '').toLowerCase()) {
            case 'sedang': return { bg: '#fff7ed', text: '#c2410c' };
            case 'sulit': return { bg: '#fef2f2', text: '#b91c1c' };
            default: return { bg: '#ecfdf5', text: '#047857' };
        }
    };

    return (
        <div style={{ boxSizing: 'border-box', backgroundColor: '#f0f5ff', minHeight: '100vh', width: '100%', padding: '32px', textAlign: 'left' }}>

            {/* BANNER */}
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
                    <h1 style={{ fontSize: '26px', fontWeight: '800', margin: '0 0 6px 0', letterSpacing: '-0.02em', color: '#ffffff' }}>
                        Analitik Kelas 📈
                    </h1>
                    <p style={{ margin: 0, fontSize: '14px', color: '#bfdbfe', fontWeight: '500' }}>
                        Pantau performa siswa berdasarkan mata pelajaran dan tingkat kesulitan.
                    </p>
                </div>
                <div style={{ fontSize: '54px' }}>👨‍🏫</div>
            </div>

            {error && (
                <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '16px', padding: '16px 20px', color: '#b91c1c', fontSize: '13px', fontWeight: '600', marginBottom: '32px' }}>
                    ⚠️ {error}
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b', fontWeight: '600' }}>
                    ⏳ Memuat data analitik...
                </div>
            ) : (
                <>
                    {/* GRID: PER MAPEL & PER LEVEL */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
                        {/* PER MATA PELAJARAN */}
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '28px' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0 0 16px 0' }}>Rata-rata per Mata Pelajaran</h2>
                            {perMapel.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '20px 0', color: '#94a3b8', fontSize: '13px' }}>Belum ada data nilai.</div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {perMapel.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                                            <div>
                                                <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{item.nama_mapel || 'Tanpa Nama'}</span>
                                                <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '8px' }}>({item.jumlah_data} data)</span>
                                            </div>
                                            <span style={{ fontSize: '16px', fontWeight: '800', color: '#2563eb' }}>{item.rata_rata}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* PER LEVEL ADAPTIF */}
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '28px' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0 0 16px 0' }}>Rata-rata per Tingkat Kesulitan</h2>
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

                    {/* TABEL PERFORMA SISWA */}
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '36px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 20px 0' }}>Performa per Siswa</h2>

                        {perSiswa.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontWeight: '500' }}>
                                Belum ada data siswa.
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                                            <th style={{ padding: '12px', fontSize: '12px', fontWeight: '800', color: '#475569' }}>NAMA SISWA</th>
                                            <th style={{ padding: '12px', fontSize: '12px', fontWeight: '800', color: '#475569', textAlign: 'center' }}>LEVEL ADAPTIF</th>
                                            <th style={{ padding: '12px', fontSize: '12px', fontWeight: '800', color: '#475569', textAlign: 'center' }}>JUMLAH UJIAN</th>
                                            <th style={{ padding: '12px', fontSize: '12px', fontWeight: '800', color: '#475569', textAlign: 'right' }}>RATA-RATA</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {perSiswa.map((siswa, idx) => {
                                            const badge = badgeColorForLevel(siswa.level_adaptif);
                                            return (
                                                <tr key={siswa.siswa_id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                    <td style={{ padding: '14px 12px', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{siswa.nama_lengkap || 'Tidak Ada Nama'}</td>
                                                    <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                                                        <span style={{ backgroundColor: badge.bg, color: badge.text, padding: '4px 14px', borderRadius: '99px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>
                                                            {siswa.level_adaptif || '-'}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '14px 12px', textAlign: 'center', fontSize: '14px', color: '#64748b' }}>{siswa.jumlah_ujian || 0}</td>
                                                    <td style={{ padding: '14px 12px', textAlign: 'right', fontSize: '16px', fontWeight: '800', color: '#2563eb' }}>{siswa.rata_rata ?? '-'}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default AnalitikGuru;