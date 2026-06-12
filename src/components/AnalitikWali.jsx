// ============================================================
// AnalitikWali.jsx
// Lokasi : src/components/AnalitikWali.jsx
// Route  : /analitik-wali
// Deps   : npm install axios
// ============================================================

import { useState, useEffect, useRef } from "react";
import axios from "axios";

// ── helpers ───────────────────────────────────────────────────
const scoreColor = (v) => {
    const n = Number(v);
    if (n >= 80) return "#16a34a";
    if (n >= 60) return "#d97706";
    return "#dc2626";
    };

    const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

    const levelEmoji = (l) =>
    l === "mudah" ? "🟢" : l === "sedang" ? "🟡" : "🔴";

    const levelStyle = {
    mudah:  { background: "#dcfce7", color: "#16a34a" },
    sedang: { background: "#fef3c7", color: "#d97706" },
    sulit:  { background: "#fee2e2", color: "#dc2626" },
    };

    const fmtDate = (d) =>
    d
        ? new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
        : "-";

    const fmtDay = (d) =>
    d
        ? new Date(d).toLocaleDateString("id-ID", { weekday: "short", day: "2-digit" })
        : "-";

    const HARI = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

    // Isi 7 slot aktivitas, sisa kosong (null)
    function padAktivitas(list = []) {
    const result = Array(7).fill(null);
    list.forEach((a, i) => {
        if (i < 7) result[6 - (list.length - 1 - i)] = a;
    });
    return result;
    }

    // ── sub-komponen ──────────────────────────────────────────────
    function StatCard({ icon, label, value, color }) {
    return (
        <div style={sc.statCard}>
        <div style={{ fontSize: 26, marginBottom: 6 }}>{icon}</div>
        <div style={sc.statLabel}>{label}</div>
        <div style={{ ...sc.statValue, color }}>{value ?? "-"}</div>
        </div>
    );
    }

    function Card({ children, style }) {
    return <div style={{ ...sc.card, ...style }}>{children}</div>;
    }

    function CardHead({ children }) {
    return <div style={sc.cardHead}>{children}</div>;
    }

    function Empty({ children }) {
    return (
        <p style={{ textAlign: "center", padding: 24, color: "#9ca3af", fontStyle: "italic", fontSize: 13 }}>
        {children}
        </p>
    );
    }

    // ── komponen utama ────────────────────────────────────────────
    export default function AnalitikWali() {
    const [status, setStatus] = useState("idle");
    const [data,   setData]   = useState(null);
    const [errMsg, setErrMsg] = useState("");

    const userId = useRef(localStorage.getItem("user_id") || 1);

    async function fetchData() {
        setStatus("loading");
        setErrMsg("");
        try {
        const res = await axios.get(`/api/analitik/wali/${userId.current}`);
        if (res.data.success) {
            setData(res.data.data);
            setStatus("ok");
        } else {
            setErrMsg(res.data.message || "Gagal memuat data.");
            setStatus("error");
        }
        } catch (e) {
        console.error("[AnalitikWali]", e);
        setErrMsg("Tidak dapat terhubung ke server.");
        setStatus("error");
        }
    }

    useEffect(() => {
        let active = true;
        Promise.resolve().then(() => {
        if (active) fetchData();
        });
        return () => { active = false; };
    }, []);

    const isLoading = status === "loading";
    const isOk      = status === "ok" && data;
    const isError   = status === "error";

    const slots = padAktivitas(data?.aktivitas ?? []);

    return (
        <div style={sc.wrapper}>
        <style>{`@keyframes ot-spin{to{transform:rotate(360deg)}}`}</style>

        {/* ── Header ── */}
        <div style={sc.pageHeader}>
            <h1 style={sc.h1}>👨‍👩‍👧 Perkembangan Anak Saya</h1>
            <p style={sc.sub}>Pantau aktivitas dan hasil belajar anak secara real-time</p>
        </div>

        {/* ── Loading ── */}
        {isLoading && (
            <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>
            <div style={sc.spinner} />
            <p style={{ margin: 0 }}>Memuat data...</p>
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
            {/* Banner Anak */}
            {data.dataAnak && (() => {
                const lvl = data.dataAnak.level_adaptif;
                const lvlStyle = levelStyle[lvl] || levelStyle.sedang;
                return (
                <div style={sc.banner}>
                    <div style={{ fontSize: 48 }}>🎒</div>
                    <div style={{ flex: 1 }}>
                    <div style={sc.anakNama}>{data.dataAnak.nama}</div>
                    <div style={sc.anakMeta}>
                        Kelas {data.dataAnak.kelas || "-"} · NISN: {data.dataAnak.nisn || "-"}
                    </div>
                    </div>
                    <div style={{ ...sc.levelBadge, ...lvlStyle }}>
                    {levelEmoji(lvl)} {capitalize(lvl)}
                    <span style={sc.levelSub}>Level Adaptif</span>
                    </div>
                </div>
                );
            })()}

            {/* Ringkasan */}
            {data.ringkasan && (
                <div style={sc.statsGrid}>
                <StatCard
                    icon="📊" label="Rata-rata Keseluruhan"
                    value={data.ringkasan.rata_rata_keseluruhan}
                    color={scoreColor(data.ringkasan.rata_rata_keseluruhan)}
                />
                <StatCard icon="✅" label="Soal Diselesaikan"  value={data.ringkasan.total_dikerjakan}  color="#2563eb" />
                <StatCard icon="🏅" label="Skor Terbaik"       value={data.ringkasan.skor_terbaik}       color="#16a34a" />
                <StatCard icon="🎯" label="Jumlah Lulus (≥75)" value={data.ringkasan.jumlah_lulus}       color="#d97706" />
                </div>
            )}

            {/* Nilai per Mapel */}
            <Card style={{ marginBottom: 20 }}>
                <CardHead>📚 Nilai Anak per Mata Pelajaran</CardHead>
                {data.nilaiAnak?.length ? (
                data.nilaiAnak.map((item) => {
                    const rata = Number(item.rata_rata);
                    const col  = scoreColor(rata);
                    return (
                    <div key={item.mata_pelajaran} style={sc.mapelRow}>
                        <div style={{ flex: 1 }}>
                        <div style={sc.mapelNama}>{item.mata_pelajaran}</div>
                        <div style={sc.mapelSub}>
                            {item.total_dikerjakan}× dikerjakan · Tertinggi: {item.tertinggi}
                        </div>
                        </div>
                        <div style={sc.mapelRight}>
                        <div style={{ fontSize: 24, fontWeight: 700, color: col }}>{rata}</div>
                        <div style={sc.barWrap}>
                            <div style={{ ...sc.barFill, width: `${rata}%`, background: col }} />
                        </div>
                        <div style={{ fontSize: 12 }}>
                            {rata >= 75
                            ? <span style={{ color: "#16a34a" }}>✅ Baik</span>
                            : rata >= 60
                            ? <span style={{ color: "#d97706" }}>⚠️ Cukup</span>
                            : <span style={{ color: "#dc2626" }}>❌ Perlu Bimbingan</span>}
                        </div>
                        </div>
                    </div>
                    );
                })
                ) : (
                <Empty>Anak belum mengerjakan soal apapun.</Empty>
                )}
            </Card>

            {/* Aktivitas 7 Hari */}
            <Card style={{ marginBottom: 20 }}>
                <CardHead>📅 Aktivitas Belajar 7 Hari Terakhir</CardHead>
                {data.aktivitas?.length ? (
                <div style={sc.aktivitasGrid}>
                    {slots.map((item, i) => (
                    <div
                        key={i}
                        style={{
                        ...sc.hariCard,
                        ...(item ? sc.hariCardActive : {}),
                        }}
                    >
                        <div style={sc.hariLabel}>
                        {item ? fmtDay(item.tanggal) : HARI[i % 7]}
                        </div>
                        {item ? (
                        <>
                            <div style={{ fontSize: 22, fontWeight: 700, color: scoreColor(item.rata_rata) }}>
                            {item.rata_rata}
                            </div>
                            <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 4 }}>
                            {item.jumlah_soal} soal
                            </div>
                        </>
                        ) : (
                        <div style={{ fontSize: 20, color: "#d1d5db" }}>-</div>
                        )}
                    </div>
                    ))}
                </div>
                ) : (
                <Empty>Tidak ada aktivitas dalam 7 hari terakhir.</Empty>
                )}
            </Card>

            {/* Reward */}
            <Card style={{ marginBottom: 20 }}>
                <CardHead>🌟 Reward Terbaru Anak</CardHead>
                {data.rewards?.length ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {data.rewards.map((r) => (
                    <div key={r.id} style={sc.rewardItem}>
                        <span style={{ fontSize: 28 }}>🏆</span>
                        <div>
                        <div style={sc.rewardNama}>{r.nama_reward || "Reward Prestasi"}</div>
                        <div style={sc.rewardTgl}>{fmtDate(r.tanggal)}</div>
                        </div>
                    </div>
                    ))}
                </div>
                ) : (
                <Empty>Anak belum mendapat reward. Semangat terus! 💪</Empty>
                )}
            </Card>
            </>
        )}

        {status === "idle" && <Empty>Tidak ada data untuk ditampilkan.</Empty>}
        </div>
    );
    }

    // ── styles ────────────────────────────────────────────────────
    const sc = {
    wrapper:       { padding: 24, fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#f0f4f8", minHeight: "100vh" },
    pageHeader:    { marginBottom: 20 },
    h1:            { fontSize: 24, margin: "0 0 4px", color: "#1e3a5f", fontWeight: 700 },
    sub:           { color: "#666", margin: 0, fontSize: 14 },
    btn:           { background: "#059669", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 },

    // Banner
    banner:        { background: "linear-gradient(135deg,#059669,#10b981)", borderRadius: 16, padding: 24, color: "#fff", display: "flex", alignItems: "center", gap: 20, marginBottom: 20, flexWrap: "wrap" },
    anakNama:      { fontSize: 22, fontWeight: 700 },
    anakMeta:      { fontSize: 13, opacity: 0.8, marginTop: 4 },
    levelBadge:    { padding: "10px 18px", borderRadius: 20, fontWeight: 700, fontSize: 15, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, flexShrink: 0 },
    levelSub:      { fontSize: 10, fontWeight: 400, opacity: 0.8 },

    // Stats
    statsGrid:     { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 16, marginBottom: 20 },
    statCard:      { background: "#fff", borderRadius: 12, padding: 18, textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,.06)" },
    statLabel:     { fontSize: 12, color: "#888", textTransform: "uppercase", marginBottom: 4 },
    statValue:     { fontSize: 26, fontWeight: 700 },

    // Card
    card:          { background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,.06)" },
    cardHead:      { fontWeight: 700, fontSize: 15, color: "#1e3a5f", marginBottom: 16, paddingBottom: 10, borderBottom: "2px solid #e5e7eb" },

    // Mapel
    mapelRow:      { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #f3f4f6", gap: 20 },
    mapelNama:     { fontWeight: 600, color: "#374151", fontSize: 15 },
    mapelSub:      { fontSize: 12, color: "#9ca3af", marginTop: 2 },
    mapelRight:    { width: 180, textAlign: "right" },
    barWrap:       { background: "#e5e7eb", borderRadius: 6, height: 6, overflow: "hidden", margin: "6px 0" },
    barFill:       { height: "100%", borderRadius: 6, transition: "width .5s ease" },

    // Aktivitas
    aktivitasGrid: { display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 8 },
    hariCard:      { background: "#f9fafb", borderRadius: 10, padding: "12px 8px", textAlign: "center", minHeight: 90, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
    hariCardActive:{ background: "#f0fdf4", border: "1px solid #bbf7d0" },
    hariLabel:     { fontSize: 11, color: "#6b7280", marginBottom: 6, fontWeight: 600 },

    // Reward
    rewardItem:    { display: "flex", alignItems: "center", gap: 14, padding: 12, background: "#faf5ff", borderRadius: 10 },
    rewardNama:    { fontWeight: 600, color: "#7c3aed" },
    rewardTgl:     { fontSize: 12, color: "#9ca3af", marginTop: 2 },

    // Spinner
    spinner:       { width: 40, height: 40, border: "4px solid #e5e7eb", borderTopColor: "#059669", borderRadius: "50%", animation: "ot-spin .8s linear infinite", margin: "0 auto 16px" },
};