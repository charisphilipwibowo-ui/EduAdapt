import { useState, useEffect } from 'react';
import API from '../api';

const AnalitikWali = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userData = JSON.parse(localStorage.getItem('userToken') || '{}');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await API.get(`/analitik/wali/${userData.id}`);
                setData(res.data);
            } catch (err) {
                console.error("Gagal memuat analitik wali:", err);
                setError("Gagal memuat data analitik anak. Pastikan data wali sudah terhubung dengan siswa di database.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userData.id]);

    const anak = data?.anak || {};
    const summary = data?.summary || {};
    const riwayat = data?.riwayat || [];

    const badgeColorFor = (skor) => {
        if (skor >= 80) return { bg: '#ecfdf5', text: '#047857' };
        if (skor >= 60) return { bg: '#fff7ed', text: '#c2410c' };
        return { bg: '#fef2f2', text: '#b91c1c' };
    };

    const badgeColorForLevel = (level) => {
        switch ((level || '').toLowerCase()) {
            case 'sedang': return { bg: '#fff7ed', text: '#c2410c' };
            case 'sulit': return { bg: '#fef2f2', text: '#b91c1c' };
            default: return { bg: '#ecfdf5', text: '#047857' };
        }
    };

    return (
        <div style={{ boxSizing: 'border-box', backgroundColor: '#f8fafc', minHeight: '100vh', width: '100%', padding: '32px', textAlign: 'left' }}>

            {/* BANNER */}
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
                        Analitik Perkembangan Anak 📊
                    </h1>
                    <p style={{ margin: 0, fontSize: '14px', color: '#ccfbf1', fontWeight: '500' }}>
                        Pantau riwayat dan capaian nilai ujian putra/putri Anda.
                    </p>
                </div>
                <div style={{ fontSize: '54px' }}>👪</div>
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
                    {/* INFO ANAK */}
                    {anak.nama_siswa && (
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '24px 28px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                            <div>
                                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>{anak.nama_siswa}</h2>
                                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Putra/Putri dari {anak.nama_wali}</p>
                            </div>
                            {anak.level_adaptif && (() => {
                                const badge = badgeColorForLevel(anak.level_adaptif);
                                return (
                                    <span style={{ backgroundColor: badge.bg, color: badge.text, padding: '6px 16px', borderRadius: '99px', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' }}>
                                        Level {anak.level_adaptif}
                                    </span>
                                );
                            })()}
                        </div>
                    )}

                    {/* KARTU SUMMARY */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Total Ujian</span>
                            <span style={{ fontSize: '32px', fontWeight: '800', color: '#0f766e', display: 'block' }}>{summary.total_ujian || 0}</span>
                        </div>
                        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Rata-rata Skor</span>
                            <span style={{ fontSize: '32px', fontWeight: '800', color: '#0f766e', display: 'block' }}>{summary.rata_rata ?? '-'}</span>
                        </div>
                        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Skor Tertinggi</span>
                            <span style={{ fontSize: '32px', fontWeight: '800', color: '#047857', display: 'block' }}>{summary.skor_tertinggi ?? '-'}</span>
                        </div>
                        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Skor Terendah</span>
                            <span style={{ fontSize: '32px', fontWeight: '800', color: '#b91c1c', display: 'block' }}>{summary.skor_terendah ?? '-'}</span>
                        </div>
                    </div>

                    {/* TABEL RIWAYAT */}
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '36px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 20px 0' }}>Riwayat Ujian Anak</h2>

                        {riwayat.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontWeight: '500' }}>
                                Belum ada riwayat ujian yang tercatat.
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                                            <th style={{ padding: '12px', fontSize: '12px', fontWeight: '800', color: '#475569' }}>MATA PELAJARAN</th>
                                            <th style={{ padding: '12px', fontSize: '12px', fontWeight: '800', color: '#475569' }}>JENIS UJIAN</th>
                                            <th style={{ padding: '12px', fontSize: '12px', fontWeight: '800', color: '#475569', textAlign: 'center' }}>SKOR</th>
                                            <th style={{ padding: '12px', fontSize: '12px', fontWeight: '800', color: '#475569', textAlign: 'right' }}>TANGGAL</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {riwayat.map((item) => {
                                            const badge = badgeColorFor(item.skor);
                                            return (
                                                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                    <td style={{ padding: '14px 12px', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{item.nama_mapel || '-'}</td>
                                                    <td style={{ padding: '14px 12px', fontSize: '13px', color: '#64748b', textTransform: 'capitalize' }}>{item.jenis_ujian}</td>
                                                    <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                                                        <span style={{ backgroundColor: badge.bg, color: badge.text, padding: '4px 14px', borderRadius: '99px', fontSize: '13px', fontWeight: '800' }}>
                                                            {item.skor}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '14px 12px', textAlign: 'right', fontSize: '13px', color: '#64748b' }}>
                                                        {new Date(item.tanggal_kerja).toLocaleDateString('id-ID')}
                                                    </td>
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

export default AnalitikWali;