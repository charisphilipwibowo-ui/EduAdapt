    // ============================================================
    // AnalitikGuru.jsx
    // Lokasi : src/components/AnalitikGuru.jsx
    // Route  : /analitik-guru
    // Deps   : npm install axios
    // ============================================================

    import { useState, useEffect, useRef } from "react";
    import axios from "axios";

    // ── helpers ───────────────────────────────────────────────────
    const scoreColor = (v) => (v >= 80 ? "#16a34a" : v >= 60 ? "#d97706" : "#dc2626");

    const fmtShort = (d) =>
    d ? new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short" }) : "-";

    const fmtFull = (d) =>
    d
        ? new Date(d).toLocaleDateString("id-ID", {
            day: "2-digit", month: "short", year: "numeric",
        })
        : "-";

    // ── sub-komponen ──────────────────────────────────────────────
    function StatCard({ icon, label, value, color }) {
    return (
        <div style={{ ...sc.card, borderTop: `3px solid ${color}`, textAlign: "center" }}>
        <div style={{ fontSize: 26, marginBottom: 6 }}>{icon}</div>
        <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
            {label}
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color }}>{value}</div>
        </div>
    );
    }

    function Bar({ value, color = "#2563eb" }) {
    const pct = Math.min(100, Math.max(0, Number(value) || 0));
    return (
        <div style={{ background: "#e5e7eb", borderRadius: 6, height: 8, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 6, transition: "width .5s ease" }} />
        </div>
    );
    }

    function LevelBadge({ level }) {
    const cfg = {
        mudah:  { bg: "#dcfce7", color: "#15803d" },
        sedang: { bg: "#fef9c3", color: "#a16207" },
        sulit:  { bg: "#fee2e2", color: "#b91c1c" },
    };
    const c = cfg[(level || "").toLowerCase()] || cfg.sedang;
    return (
        <span style={{ background: c.bg, color: c.color, padding: "2px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700, textTransform: "capitalize" }}>
        {level}
        </span>
    );
    }

    function Rank({ n }) {
    const cfg = {
        1: { bg: "#fbbf24", color: "#fff" },
        2: { bg: "#9ca3af", color: "#fff" },
        3: { bg: "#b45309", color: "#fff" },
    };
    const c = cfg[n] || { bg: "#e5e7eb", color: "#374151" };
    return (
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "50%", fontWeight: 700, fontSize: 12, background: c.bg, color: c.color }}>
        {n}
        </span>
    );
    }

    function Card({ children, style }) {
    return <div style={{ ...sc.card, ...style }}>{children}</div>;
    }

    function CardHead({ children }) {
    return (
        <div style={{ fontWeight: 700, fontSize: 14, color: "#1e3a5f", marginBottom: 16, paddingBottom: 10, borderBottom: "1.5px solid #e5e7eb" }}>
        {children}
        </div>
    );
    }

    function Empty({ children }) {
    return <p style={{ textAlign: "center", padding: 20, color: "#9ca3af", fontStyle: "italic", fontSize: 13 }}>{children}</p>;
    }

    // ── komponen utama ────────────────────────────────────────────
    export default function AnalitikGuru() {
    const [status, setStatus]   = useState("idle"); // "idle" | "loading" | "ok" | "error"
    const [data,   setData]     = useState(null);
    const [errMsg, setErrMsg]   = useState("");

    // Stable ref — tidak perlu masuk dependency array useEffect
    const guruId = useRef(localStorage.getItem("guru_id") || 1);

    // Fetch function — TIDAK disimpan sebagai state/callback agar tidak trigger re-render loop
    async function fetchData() {
        setStatus("loading");
        setErrMsg("");
        try {
        const res = await axios.get(`/api/analitik/guru/${guruId.current}`);
        if (res.data.success) {
            setData(res.data.data);
            setStatus("ok");
        } else {
            setErrMsg(res.data.message || "Gagal memuat data.");
            setStatus("error");
        }
        } catch (e) {
        console.error("[AnalitikGuru]", e);
        setErrMsg("Tidak dapat terhubung ke server. Pastikan API berjalan.");
        setStatus("error");
        }
    }

    // Panggil fetch hanya sekali saat mount — tidak ada dependency yg bisa berubah
    useEffect(() => {
        const timer = setTimeout(fetchData, 0);
        return () => clearTimeout(timer);
    }, []);

    // ── computed ──────────────────────────────────────────────
    const levelCount = (key) =>
        data?.levelSummary?.find((l) => l.level_adaptif === key)?.jumlah_siswa ?? 0;

    const totalSiswa = data?.levelSummary?.reduce((s, l) => s + Number(l.jumlah_siswa), 0) ?? 0;

    const trendMax = data?.trendHarian?.length
        ? Math.max(...data.trendHarian.map((t) => Number(t.rata_rata_harian)))
        : 100;

    const isLoading = status === "loading";
    const isError   = status === "error";
    const isOk      = status === "ok" && data;

    // ── render ────────────────────────────────────────────────
    return (
        <div style={sc.wrapper}>
        {/* keyframe spinner */}
        <style>{`@keyframes gu-spin{to{transform:rotate(360deg)}}`}</style>

        {/* ── Header ── */}
        <div style={sc.header}>
            <div>
            <h1 style={sc.h1}>📊 Analitik Kelas</h1>
            <p style={sc.sub}>Data performa siswa berdasarkan hasil kuis adaptif</p>
            </div>
            <button style={{ ...sc.btn, opacity: isLoading ? 0.7 : 1 }} onClick={fetchData} disabled={isLoading}>
            {isLoading ? "⏳ Memuat…" : "🔄 Refresh"}
            </button>
        </div>

        {/* ── Loading ── */}
        {isLoading && (
            <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>
            <div style={{ width: 36, height: 36, border: "3px solid #e5e7eb", borderTopColor: "#2563eb", borderRadius: "50%", animation: "gu-spin .8s linear infinite", margin: "0 auto 14px" }} />
            <p style={{ margin: 0 }}>Memuat data analitik…</p>
            </div>
        )}

        {/* ── Error ── */}
        {isError && (
            <Card style={{ borderLeft: "4px solid #dc2626", marginBottom: 20 }}>
            <p style={{ margin: "0 0 12px", color: "#dc2626" }}>⚠️ {errMsg}</p>
            <button style={sc.btn} onClick={fetchData}>🔄 Coba Lagi</button>
            </Card>
        )}

        {/* ── Data ── */}
        {isOk && (
            <>
            {/* Distribusi Level */}
            <div style={sc.sectionLabel}>Distribusi Level Adaptif Siswa</div>
            <div style={sc.statsGrid}>
                <StatCard icon="🟢" label="Level Mudah"  value={`${levelCount("mudah")} Siswa`}  color="#16a34a" />
                <StatCard icon="🟡" label="Level Sedang" value={`${levelCount("sedang")} Siswa`} color="#d97706" />
                <StatCard icon="🔴" label="Level Sulit"  value={`${levelCount("sulit")} Siswa`}  color="#dc2626" />
                <StatCard icon="👥" label="Total Siswa"  value={totalSiswa}                        color="#2563eb" />
            </div>

            {/* Rata-rata Mapel + Jenis Ujian */}
            <div style={sc.twoCol}>
                <Card>
                <CardHead>📚 Rata-rata Nilai per Mata Pelajaran</CardHead>
                {data.avgPerMapel?.length ? data.avgPerMapel.map((item) => {
                    const rata = Number(item.rata_rata);
                    return (
                    <div key={item.mata_pelajaran} style={{ marginBottom: 18 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontWeight: 600, fontSize: 14, color: "#374151" }}>{item.mata_pelajaran}</span>
                        <span style={{ fontWeight: 700, fontSize: 15, color: scoreColor(rata) }}>{rata}</span>
                        </div>
                        <Bar value={rata} color={scoreColor(rata)} />
                        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
                        {item.total_pengerjaan}× dikerjakan · Min: {item.skor_min} · Max: {item.skor_max}
                        </div>
                    </div>
                    );
                }) : <Empty>Belum ada data nilai mata pelajaran.</Empty>}
                </Card>

                <Card>
                <CardHead>🧪 Distribusi Jenis Ujian</CardHead>
                {data.distribusiJenis?.length ? data.distribusiJenis.map((item) => {
                    const lulusPct = item.total > 0 ? (Number(item.lulus) / Number(item.total)) * 100 : 0;
                    return (
                    <div key={item.jenis_ujian} style={{ marginBottom: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 700 }}>
                            {item.jenis_ujian.toUpperCase()}
                        </span>
                        <span style={{ fontSize: 12, color: "#6b7280" }}>{item.total} pengerjaan</span>
                        </div>
                        <div style={{ display: "flex", gap: 16, fontSize: 12, marginBottom: 6 }}>
                        <span style={{ color: "#16a34a" }}>✅ Lulus: {item.lulus}</span>
                        <span style={{ color: "#dc2626" }}>❌ Tidak: {item.tidak_lulus}</span>
                        <span style={{ color: "#2563eb" }}>📊 Rata: {item.rata_rata}</span>
                        </div>
                        <Bar value={lulusPct} color="#16a34a" />
                    </div>
                    );
                }) : <Empty>Belum ada data ujian.</Empty>}
                </Card>
            </div>

            {/* Tren Harian */}
            {data.trendHarian?.length > 0 && (
                <Card style={{ marginBottom: 20 }}>
                <CardHead>📈 Tren Rata-rata Nilai (30 Hari Terakhir)</CardHead>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 130, overflowX: "auto", paddingBottom: 4 }}>
                    {data.trendHarian.map((item, i) => {
                    const val = Number(item.rata_rata_harian);
                    const h   = trendMax > 0 ? Math.round((val / trendMax) * 100) : val;
                    return (
                        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 34 }}
                        title={`${item.tanggal} — Rata: ${val}, ${item.jumlah_pengerjaan}×`}>
                        <div style={{ width: 22, borderRadius: "4px 4px 0 0", minHeight: 4, height: `${h}%`, background: scoreColor(val), transition: "height .4s ease" }} />
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
            <div style={sc.twoCol}>
                <Card>
                <CardHead>🏆 Top 5 Siswa Terbaik</CardHead>
                {data.topSiswa?.length ? (
                    <table style={sc.table}>
                    <thead>
                        <tr>{["#","Nama","Level","Rata-rata","Dikerjakan"].map((h) => <th key={h} style={sc.th}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                        {data.topSiswa.map((s, i) => (
                        <tr key={s.siswa_id ?? s.nama}>
                            <td style={sc.td}><Rank n={i + 1} /></td>
                            <td style={{ ...sc.td, fontWeight: 600 }}>{s.nama}</td>
                            <td style={sc.td}><LevelBadge level={s.level_adaptif} /></td>
                            <td style={{ ...sc.td, color: scoreColor(s.rata_rata), fontWeight: 700 }}>{s.rata_rata}</td>
                            <td style={sc.td}>{s.total_soal_dikerjakan}×</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                ) : <Empty>Belum ada data siswa.</Empty>}
                </Card>

                <Card>
                <CardHead>⚠️ Siswa Perlu Perhatian (Skor &lt; 60)</CardHead>
                {data.siswaPerhatian?.length ? (
                    <table style={sc.table}>
                    <thead>
                        <tr>{["Nama","Level","Rata-rata","Terakhir Aktif"].map((h) => <th key={h} style={sc.th}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                        {data.siswaPerhatian.map((s) => (
                        <tr key={s.siswa_id ?? s.nama}>
                            <td style={{ ...sc.td, fontWeight: 600 }}>{s.nama}</td>
                            <td style={sc.td}><LevelBadge level={s.level_adaptif} /></td>
                            <td style={{ ...sc.td, color: "#dc2626", fontWeight: 700 }}>{s.rata_rata}</td>
                            <td style={{ ...sc.td, fontSize: 12, color: "#6b7280" }}>{fmtFull(s.terakhir_aktif)}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                ) : <Empty>✅ Semua siswa performa baik!</Empty>}
                </Card>
            </div>

            {/* Reward */}
            {data.statsReward && (
                <Card style={{ marginBottom: 20 }}>
                <CardHead>🎖️ Ringkasan Reward</CardHead>
                <div style={{ display: "flex", gap: 40 }}>
                    {[
                    { val: data.statsReward.total_reward,        label: "Total Reward Diberikan" },
                    { val: data.statsReward.siswa_dapat_reward,  label: "Siswa Penerima Reward"  },
                    ].map(({ val, label }) => (
                    <div key={label} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 36, fontWeight: 700, color: "#7c3aed" }}>{val}</div>
                        <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{label}</div>
                    </div>
                    ))}
                </div>
                </Card>
            )}
            </>
        )}

        {status === "idle" && <Empty>Tidak ada data untuk ditampilkan.</Empty>}
        </div>
    );
    }

    // ── styles ────────────────────────────────────────────────────
    const sc = {
    wrapper:     { padding: 24, fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#f0f4f8", minHeight: "100vh" },
    header:      { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 },
    h1:          { fontSize: 22, margin: "0 0 4px", color: "#1e3a5f", fontWeight: 700 },
    sub:         { color: "#6b7280", margin: 0, fontSize: 13 },
    btn:         { background: "#2563eb", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 },
    sectionLabel:{ fontWeight: 700, fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 },
    statsGrid:   { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 24 },
    twoCol:      { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, marginBottom: 20 },
    card:        { background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,.07)" },
    table:       { width: "100%", borderCollapse: "collapse", fontSize: 13 },
    th:          { background: "#f9fafb", padding: "8px 10px", textAlign: "left", fontSize: 11, color: "#6b7280", borderBottom: "1px solid #e5e7eb", textTransform: "uppercase", letterSpacing: 0.3 },
    td:          { padding: "10px 10px", borderBottom: "1px solid #f3f4f6", verticalAlign: "middle" },
};