// ============================================================
// AnalitikGuru.jsx
// Lokasi : src/pages/guru/AnalitikGuru.jsx
// Route  : /analitik-guru
// Deps   : npm install axios
// ============================================================

import { useState, useEffect, useCallback } from "react";
import axios from "axios";

// ── helpers ──────────────────────────────────────────────────
const getScoreColor = (val) => {
    if (val >= 80) return "#16a34a";
    if (val >= 60) return "#d97706";
    return "#dc2626";
    };

    const fmtShort = (d) =>
    d ? new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short" }) : "-";

    const fmtFull = (d) =>
    d
        ? new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
        : "-";

    // ── sub-komponen ──────────────────────────────────────────────
    function StatCard({ icon, label, value, color }) {
    return (
        <div style={{ ...s.card, borderTop: `3px solid ${color}`, textAlign: "center" }}>
        <div style={{ fontSize: 28, marginBottom: 6 }}>{icon}</div>
        <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
            {label}
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, color }}>{value}</div>
        </div>
    );
    }

    function ProgressBar({ value, color = "#2563eb" }) {
    const pct = Math.min(100, Math.max(0, value));
    return (
        <div style={{ background: "#e5e7eb", borderRadius: 6, height: 8, overflow: "hidden" }}>
        <div
            style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: 6,
            transition: "width .5s ease",
            }}
        />
        </div>
    );
    }

    function Badge({ level }) {
    const map = {
        mudah:  { bg: "#dcfce7", color: "#15803d" },
        sedang: { bg: "#fef9c3", color: "#a16207" },
        sulit:  { bg: "#fee2e2", color: "#b91c1c" },
    };
    const style = map[level?.toLowerCase()] || map.mudah;
    return (
        <span
        style={{
            background: style.bg,
            color: style.color,
            padding: "2px 10px",
            borderRadius: 12,
            fontSize: 11,
            fontWeight: 700,
            textTransform: "capitalize",
        }}
        >
        {level}
        </span>
    );
    }

    function RankBadge({ n }) {
    const colors = {
        1: { bg: "#fbbf24", color: "#fff" },
        2: { bg: "#9ca3af", color: "#fff" },
        3: { bg: "#b45309", color: "#fff" },
    };
    const c = colors[n] || { bg: "#e5e7eb", color: "#374151" };
    return (
        <span
        style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 24,
            height: 24,
            borderRadius: "50%",
            fontWeight: 700,
            fontSize: 12,
            background: c.bg,
            color: c.color,
        }}
        >
        {n}
        </span>
    );
    }

    function SectionTitle({ children }) {
    return (
        <div
        style={{
            fontWeight: 700,
            fontSize: 11,
            color: "#6b7280",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 12,
            marginTop: 8,
        }}
        >
        {children}
        </div>
    );
    }

    function Card({ children, style = {} }) {
    return (
        <div
        style={{
            background: "#fff",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 1px 4px rgba(0,0,0,.07)",
            ...style,
        }}
        >
        {children}
        </div>
    );
    }

    function CardHeader({ children }) {
    return (
        <div
        style={{
            fontWeight: 700,
            fontSize: 14,
            color: "#1e3a5f",
            marginBottom: 16,
            paddingBottom: 10,
            borderBottom: "1.5px solid #e5e7eb",
        }}
        >
        {children}
        </div>
    );
    }

    function EmptyState({ children }) {
    return (
        <p style={{ textAlign: "center", padding: 20, color: "#9ca3af", fontStyle: "italic", fontSize: 13 }}>
        {children}
        </p>
    );
    }

    function Spinner() {
    return (
        <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>
        <style>{`@keyframes gu-spin{to{transform:rotate(360deg)}}`}</style>
        <div
            style={{
            width: 36,
            height: 36,
            border: "3px solid #e5e7eb",
            borderTopColor: "#2563eb",
            borderRadius: "50%",
            animation: "gu-spin .8s linear infinite",
            margin: "0 auto 14px",
            }}
        />
        <p style={{ margin: 0 }}>Memuat data analitik…</p>
        </div>
    );
    }

    // ── komponen utama ────────────────────────────────────────────
    export default function AnalitikGuru() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    // Ambil guru_id dari localStorage — sesuaikan dengan sistem auth kamu
    const guruId = localStorage.getItem("guru_id") || 1;

    const fetchData = useCallback(async () => {
        try {
            const res = await axios.get(`/api/analitik/guru/${guruId}`);
            if (res.data.success) {
                setData(res.data.data);
            } else {
                setError(res.data.message || "Gagal memuat data.");
            }
        } catch (e) {
            console.error(e);
            setError("Tidak dapat terhubung ke server.");
        } finally {
            setLoading(false);
        }
    }, [guruId]);

    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        await fetchData();
    }, [fetchData]);

    useEffect(() => {
        const initialize = async () => {
            setLoading(true);
            setError(null);
            await fetchData();
        };

        initialize();
    }, [fetchData]);

    const getLevelCount = (key) =>
        data?.levelSummary?.find((l) => l.level_adaptif === key)?.jumlah_siswa ?? 0;

    const totalSiswa = data?.levelSummary?.reduce((s, l) => s + Number(l.jumlah_siswa), 0) ?? 0;

    const trendMax = data?.trendHarian?.length
        ? Math.max(...data.trendHarian.map((t) => t.rata_rata_harian))
        : 100;

    return (
        <div style={s.wrapper}>
        {/* ── Header ── */}
        <div style={s.pageHeader}>
            <div>
            <h1 style={s.h1}>📊 Analitik Kelas</h1>
            <p style={s.subtitle}>
                Data performa siswa berdasarkan hasil kuis adaptif
            </p>
            </div>
            <button
            style={{
                ...s.btnRefresh,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
            }}
            onClick={loadData}
            disabled={loading}
            >
            {loading ? "⏳ Memuat…" : "🔄 Refresh"}
            </button>
        </div>

        {/* ── Loading ── */}
        {loading && <Spinner />}

        {/* ── Error ── */}
        {!loading && error && (
            <Card style={{ borderLeft: "4px solid #dc2626" }}>
            <p style={{ margin: 0, color: "#dc2626" }}>⚠️ {error}</p>
            <button style={{ ...s.btnRefresh, marginTop: 12 }} onClick={loadData}>
                🔄 Coba Lagi
            </button>
            </Card>
        )}

        {/* ── Data ── */}
        {!loading && data && (
            <>
            {/* Distribusi Level */}
            <SectionTitle>Distribusi Level Adaptif Siswa</SectionTitle>
            <div style={s.statsGrid}>
                <StatCard icon="🟢" label="Level Mudah"  value={`${getLevelCount("mudah")} Siswa`}  color="#16a34a" />
                <StatCard icon="🟡" label="Level Sedang" value={`${getLevelCount("sedang")} Siswa`} color="#d97706" />
                <StatCard icon="🔴" label="Level Sulit"  value={`${getLevelCount("sulit")} Siswa`}  color="#dc2626" />
                <StatCard icon="👥" label="Total Siswa"  value={totalSiswa}                          color="#2563eb" />
            </div>

            {/* Rata-rata per Mapel + Distribusi Jenis */}
            <div style={s.twoCol}>
                {/* Rata-rata per Mapel */}
                <Card>
                <CardHeader>📚 Rata-rata Nilai per Mata Pelajaran</CardHeader>
                {data.avgPerMapel?.length ? (
                    data.avgPerMapel.map((item) => {
                    const rata = Number(item.rata_rata);
                    return (
                        <div key={item.mata_pelajaran} style={{ marginBottom: 18 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontWeight: 600, fontSize: 14, color: "#374151" }}>
                            {item.mata_pelajaran}
                            </span>
                            <span style={{ fontWeight: 700, fontSize: 15, color: getScoreColor(rata) }}>
                            {rata}
                            </span>
                        </div>
                        <ProgressBar value={rata} color={getScoreColor(rata)} />
                        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
                            {item.total_pengerjaan}× dikerjakan · Min: {item.skor_min} · Max: {item.skor_max}
                        </div>
                        </div>
                    );
                    })
                ) : (
                    <EmptyState>Belum ada data nilai mata pelajaran.</EmptyState>
                )}
                </Card>

                {/* Distribusi Jenis Ujian */}
                <Card>
                <CardHeader>🧪 Distribusi Jenis Ujian</CardHeader>
                {data.distribusiJenis?.length ? (
                    data.distribusiJenis.map((item) => {
                    const lulusPct = item.total > 0 ? (item.lulus / item.total) * 100 : 0;
                    return (
                        <div key={item.jenis_ujian} style={{ marginBottom: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                            <span
                            style={{
                                background: "#dbeafe",
                                color: "#1d4ed8",
                                padding: "2px 10px",
                                borderRadius: 12,
                                fontSize: 12,
                                fontWeight: 700,
                            }}
                            >
                            {item.jenis_ujian.toUpperCase()}
                            </span>
                            <span style={{ fontSize: 12, color: "#6b7280" }}>{item.total} pengerjaan</span>
                        </div>
                        <div style={{ display: "flex", gap: 16, fontSize: 12, marginBottom: 6 }}>
                            <span style={{ color: "#16a34a" }}>✅ Lulus: {item.lulus}</span>
                            <span style={{ color: "#dc2626" }}>❌ Tidak lulus: {item.tidak_lulus}</span>
                            <span style={{ color: "#2563eb" }}>📊 Rata: {item.rata_rata}</span>
                        </div>
                        <ProgressBar value={lulusPct} color="#16a34a" />
                        </div>
                    );
                    })
                ) : (
                    <EmptyState>Belum ada data ujian.</EmptyState>
                )}
                </Card>
            </div>

            {/* Tren Harian */}
            {data.trendHarian?.length > 0 && (
                <Card style={{ marginBottom: 20 }}>
                <CardHeader>📈 Tren Rata-rata Nilai (30 Hari Terakhir)</CardHeader>
                <div
                    style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 6,
                    height: 130,
                    overflowX: "auto",
                    paddingBottom: 4,
                    }}
                >
                    {data.trendHarian.map((item, i) => {
                    const val = Number(item.rata_rata_harian);
                    const heightPct = trendMax > 0 ? (val / trendMax) * 100 : val;
                    return (
                        <div
                        key={i}
                        style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 34 }}
                        title={`${item.tanggal} — Rata: ${val}, ${item.jumlah_pengerjaan}×`}
                        >
                        <div
                            style={{
                            width: 22,
                            borderRadius: "4px 4px 0 0",
                            minHeight: 4,
                            height: `${heightPct}%`,
                            background: getScoreColor(val),
                            transition: "height .4s ease",
                            }}
                        />
                        <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 4, whiteSpace: "nowrap" }}>
                            {fmtShort(item.tanggal)}
                        </div>
                        </div>
                    );
                    })}
                </div>
                </Card>
            )}

            {/* Top Siswa + Perhatian */}
            <div style={s.twoCol}>
                {/* Top 5 */}
                <Card>
                <CardHeader>🏆 Top 5 Siswa Terbaik</CardHeader>
                {data.topSiswa?.length ? (
                    <table style={s.table}>
                    <thead>
                        <tr>
                        {["#", "Nama", "Level", "Rata-rata", "Dikerjakan"].map((h) => (
                            <th key={h} style={s.th}>{h}</th>
                        ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.topSiswa.map((siswa, i) => (
                        <tr key={siswa.siswa_id ?? siswa.nama}>
                            <td style={s.td}><RankBadge n={i + 1} /></td>
                            <td style={{ ...s.td, fontWeight: 600 }}>{siswa.nama}</td>
                            <td style={s.td}><Badge level={siswa.level_adaptif} /></td>
                            <td style={{ ...s.td, color: getScoreColor(siswa.rata_rata), fontWeight: 700 }}>
                            {siswa.rata_rata}
                            </td>
                            <td style={s.td}>{siswa.total_soal_dikerjakan}×</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                ) : (
                    <EmptyState>Belum ada data siswa.</EmptyState>
                )}
                </Card>

                {/* Siswa Perlu Perhatian */}
                <Card>
                <CardHeader>⚠️ Siswa Perlu Perhatian (Skor &lt; 60)</CardHeader>
                {data.siswaPerhatian?.length ? (
                    <table style={s.table}>
                    <thead>
                        <tr>
                        {["Nama", "Level", "Rata-rata", "Terakhir Aktif"].map((h) => (
                            <th key={h} style={s.th}>{h}</th>
                        ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.siswaPerhatian.map((siswa) => (
                        <tr key={siswa.siswa_id ?? siswa.nama}>
                            <td style={{ ...s.td, fontWeight: 600 }}>{siswa.nama}</td>
                            <td style={s.td}><Badge level={siswa.level_adaptif} /></td>
                            <td style={{ ...s.td, color: "#dc2626", fontWeight: 700 }}>{siswa.rata_rata}</td>
                            <td style={{ ...s.td, fontSize: 12, color: "#6b7280" }}>{fmtFull(siswa.terakhir_aktif)}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                ) : (
                    <tr>
                    <td colSpan={4}>
                        <EmptyState>✅ Semua siswa performa baik!</EmptyState>
                    </td>
                    </tr>
                )}
                </Card>
            </div>

            {/* Reward */}
            {data.statsReward && (
                <Card>
                <CardHeader>🎖️ Ringkasan Reward</CardHeader>
                <div style={{ display: "flex", gap: 40 }}>
                    <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 36, fontWeight: 700, color: "#7c3aed" }}>
                        {data.statsReward.total_reward}
                    </div>
                    <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>Total Reward Diberikan</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 36, fontWeight: 700, color: "#7c3aed" }}>
                        {data.statsReward.siswa_dapat_reward}
                    </div>
                    <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>Siswa Penerima Reward</div>
                    </div>
                </div>
                </Card>
            )}
            </>
        )}

        {!loading && !data && !error && (
            <EmptyState>Tidak ada data untuk ditampilkan.</EmptyState>
        )}
        </div>
    );
    }

    // ── styles ────────────────────────────────────────────────────
    const s = {
    wrapper:    { padding: 24, fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#f0f4f8", minHeight: "100vh" },
    pageHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 },
    h1:         { fontSize: 22, margin: "0 0 4px", color: "#1e3a5f", fontWeight: 700 },
    subtitle:   { color: "#6b7280", margin: 0, fontSize: 13 },
    btnRefresh: { background: "#2563eb", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 },
    statsGrid:  { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 24 },
    twoCol:     { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, marginBottom: 20 },
    card:       { background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,.07)" },
    table:      { width: "100%", borderCollapse: "collapse", fontSize: 13 },
    th:         { background: "#f9fafb", padding: "8px 10px", textAlign: "left", fontSize: 11, color: "#6b7280", borderBottom: "1px solid #e5e7eb", textTransform: "uppercase", letterSpacing: 0.3 },
    td:         { padding: "10px 10px", borderBottom: "1px solid #f3f4f6", verticalAlign: "middle" },
};