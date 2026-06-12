import { useState, useEffect } from 'react';
import API from '../api';

const KatalogMateriGuru = () => {
    const [dataMateri, setDataMateri] = useState([]);
    const [mapelList, setMapelList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        mapel_id: '',
        judul_materi: '',
        konten_teks: '',
        url_media: '',
        tingkat_kesulitan: 'mudah'
    });

    const fetchMateri = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.get('/materi');
            setDataMateri(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Gagal memuat materi:", err);
            setError("Gagal memuat daftar materi. Pastikan backend server aktif.");
            setDataMateri([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchMapel = async () => {
        try {
            const res = await API.get('/mata-pelajaran');
            setMapelList(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Gagal memuat daftar mata pelajaran:", err);
            setMapelList([]);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await fetchMateri();
            await fetchMapel();
        };
        loadData();
    }, []);

    const resetForm = () => {
        setForm({ mapel_id: '', judul_materi: '', konten_teks: '', url_media: '', tingkat_kesulitan: 'mudah' });
        setEditingId(null);
        setShowForm(false);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.mapel_id || !form.judul_materi.trim()) {
            alert('Mata pelajaran dan judul materi wajib diisi!');
            return;
        }

        try {
            if (editingId) {
                await API.put(`/materi/${editingId}`, {
                    mapel_id: form.mapel_id,
                    judul_materi: form.judul_materi,
                    konten_teks: form.konten_teks,
                    url_media: form.url_media,
                    tingkat_kesulitan: form.tingkat_kesulitan
                });
            } else {
                await API.post('/materi', {
                    mapel_id: form.mapel_id,
                    judul_materi: form.judul_materi,
                    konten_teks: form.konten_teks,
                    url_media: form.url_media,
                    tingkat_kesulitan: form.tingkat_kesulitan
                });
            }
            resetForm();
            fetchMateri();
        } catch (err) {
            console.error("Gagal menyimpan materi:", err);
            alert(err.response?.data?.message || 'Gagal menyimpan materi.');
        }
    };

    const handleEdit = (materi) => {
        setForm({
            mapel_id: materi.mapel_id || '',
            judul_materi: materi.judul_materi || '',
            konten_teks: materi.konten_teks || '',
            url_media: materi.url_media || '',
            tingkat_kesulitan: materi.tingkat_kesulitan || 'mudah'
        });
        setEditingId(materi.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus materi ini?')) return;

        try {
            await API.delete(`/materi/${id}`);
            fetchMateri();
        } catch (err) {
            console.error("Gagal menghapus materi:", err);
            alert(err.response?.data?.message || 'Gagal menghapus materi.');
        }
    };

    const badgeColorFor = (level) => {
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
                boxSizing: 'border-box',
                flexWrap: 'wrap',
                gap: '16px'
            }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 6px 0', letterSpacing: '-0.02em', color: '#ffffff' }}>
                        Katalog Materi 📚
                    </h1>
                    <p style={{ margin: 0, fontSize: '14px', color: '#bfdbfe', fontWeight: '500' }}>
                        Kelola materi pembelajaran adaptif untuk siswa Anda.
                    </p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowForm(!showForm); }}
                    style={{
                        backgroundColor: showForm ? '#ffffff' : '#1d4ed8',
                        color: showForm ? '#1d4ed8' : '#ffffff',
                        border: '2px solid #ffffff',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '700',
                        cursor: 'pointer'
                    }}
                >
                    {showForm ? '✕ Tutup Form' : '+ Tambah Materi'}
                </button>
            </div>

            {error && (
                <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '16px', padding: '16px 20px', color: '#b91c1c', fontSize: '13px', fontWeight: '600', marginBottom: '32px' }}>
                    ⚠️ {error}
                </div>
            )}

            {/* FORM TAMBAH / EDIT MATERI */}
            {showForm && (
                <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '32px', marginBottom: '32px', boxSizing: 'border-box' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 20px 0' }}>
                        {editingId ? 'Edit Materi' : 'Tambah Materi Baru'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Mata Pelajaran *</label>
                                <select
                                    name="mapel_id"
                                    value={form.mapel_id}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#ffffff' }}
                                >
                                    <option value="">-- Pilih Mata Pelajaran --</option>
                                    {mapelList.map((mp) => (
                                        <option key={mp.id} value={mp.id}>{mp.nama_mapel}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Tingkat Kesulitan *</label>
                                <select
                                    name="tingkat_kesulitan"
                                    value={form.tingkat_kesulitan}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#ffffff' }}
                                >
                                    <option value="mudah">Mudah</option>
                                    <option value="sedang">Sedang</option>
                                    <option value="sulit">Sulit</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Judul Materi *</label>
                            <input
                                type="text"
                                name="judul_materi"
                                value={form.judul_materi}
                                onChange={handleChange}
                                placeholder="Contoh: Pengenalan Aljabar"
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Link Media (URL)</label>
                            <input
                                type="url"
                                name="url_media"
                                value={form.url_media}
                                onChange={handleChange}
                                placeholder="https://youtube.com/... atau https://drive.google.com/..."
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Konten / Penjelasan Materi</label>
                            <textarea
                                name="konten_teks"
                                value={form.konten_teks}
                                onChange={handleChange}
                                placeholder="Tuliskan isi materi atau penjelasan singkat di sini"
                                rows={4}
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                type="submit"
                                style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '12px 28px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
                            >
                                {editingId ? 'Simpan Perubahan' : 'Tambah Materi'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                style={{ backgroundColor: '#f1f5f9', color: '#475569', border: 'none', padding: '12px 28px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
                            >
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* DAFTAR MATERI */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '36px', boxSizing: 'border-box' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 24px 0' }}>
                    Daftar Materi
                </h2>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b', fontWeight: '600' }}>
                        ⏳ Memuat daftar materi...
                    </div>
                ) : dataMateri.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontWeight: '500' }}>
                        Belum ada materi yang ditambahkan. Klik "+ Tambah Materi" untuk mulai.
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                        {dataMateri.map((materi) => {
                            const badge = badgeColorFor(materi.tingkat_kesulitan);
                            return (
                                <div key={materi.id} style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                        {materi.nama_mapel && (
                                            <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '4px 12px', borderRadius: '99px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>
                                                {materi.nama_mapel}
                                            </span>
                                        )}
                                        <span style={{ backgroundColor: badge.bg, color: badge.text, padding: '4px 12px', borderRadius: '99px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>
                                            {materi.tingkat_kesulitan}
                                        </span>
                                    </div>
                                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '4px 0' }}>
                                        {materi.judul_materi}
                                    </h3>
                                    {materi.konten_teks && (
                                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.5' }}>
                                            {materi.konten_teks}
                                        </p>
                                    )}
                                    {materi.url_media && (
                                        <a
                                            href={materi.url_media}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ fontSize: '13px', color: '#2563eb', fontWeight: '700', textDecoration: 'none', marginTop: '4px', wordBreak: 'break-all' }}
                                        >
                                            🔗 Buka Media
                                        </a>
                                    )}

                                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                                        <button
                                            onClick={() => handleEdit(materi)}
                                            style={{ flex: 1, backgroundColor: '#f1f5f9', color: '#475569', border: 'none', padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(materi.id)}
                                            style={{ flex: 1, backgroundColor: '#fef2f2', color: '#b91c1c', border: 'none', padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                                        >
                                            🗑️ Hapus
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default KatalogMateriGuru;