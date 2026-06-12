// ============================================================
// AnalitikKepsek.jsx
// Lokasi : src/components/AnalitikKepsek.jsx
// Route  : /analitik-kepsek
// Deps   : npm install axios
// ============================================================

import { useState, useEffect } from "react";
import axios from "axios";

// ── helpers ───────────────────────────────────────────────────
const scoreColor = (v) => {
    const n = Number(v);
    if (n >= 80) return "#16a34a";
    if (n >= 60) return "#d97706";
    return "#dc2626";
    };

    const pctLulus = (lulus, total) =>
    total ? Math.round((Number(lulus) / Number(total)) * 100) : 0;

    const kelulusanColor = (lulus, total) => {
    const pct = pctLulus(lulus, total);
    if (pct >= 75) return { bg: "#dcfce7", color: "#16a34a" };
    if (pct >= 50) return { bg: "#fef3c7", color: "#d97706" };
    return { bg: "#fee2e2", color: "#dc2626" };
    };

    const formatBulan = (b) => {
    if (!b) return "";
    const [y, m] = b.split("-");
    const names = ["","Jan","Feb","Mar","Apr","Mei","Jun","Jul","Ags","Sep","Okt","Nov","Des"];
    return `${names[parseInt(m)]} ${y.slice(2)}`;
    };

    const LEVEL_STYLE = {
    mudah:  { bg: "#dcfce7", color: "#16a34a" },
    sedang: { bg: "#fef3c7", color: "#d97706" },
    sulit:  { bg: "#fee2e2", color: "#dc2626" },
    };

    // ── sub-komponen ──────────────────────────────────────────────
    function KpiCard({ icon, label, value, bg, valueColor }) {
    return (
        <div style={{ background: bg, borderRadius: 12, padding: "18px 12px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
        <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: valueColor || "#1e3a5f" }}>{value ?? "-"}</div>
        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4, textTransform: "uppercase", fontWeight: 600 }}>{label}</div>
        </div>
    );
    }

    function Card({ children, style }) {
    return (
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,.06)", marginBottom: 20, ...style }}>
        {children}
        </div>
    );
    }

    function CardHead({ children, style }) {
    return (
        <div style={{ fontWeight: 700, fontSize: 15, color: "#1e3a5f", marginBottom: 14, paddingBottom: 10, borderBottom: "2px solid #e5e7eb", ...style }}>
        {children}
        </div>
    );
    }

    function Empty({ children }) {
    return (
        <p style={{ textAlign: "center", padding: 20, color: "#9ca3af", fontStyle: "italic", fontSize: 13 }}>
        {children}
        </p>
    );
    }

    function BarWrap({ value, color, height = 8 }) {
    const pct = Math.min(100, Math.max(0, Number(value) || 0));
    return (
        <div style={{ background: "#e5e7eb", borderRadius: 8, overflow: "hidden", height }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 8, transition: "width .6s" }} />
        </div>
    );
    }

    // ── komponen utama ────────────────────────────────────────────
    export default function AnalitikKepsek() {
    const [status, setStatus] = useState("idle");
    const [data,   setData]   = useState(null);
    const [errMsg, setErrMsg] = useState("");

    async function fetchData() {
        setStatus("loading");
        setErrMsg("");
        try {
        const res = await axios.get("/api/analitik/kepsek");
        if (res.data.success) {
            setData(res.data.data);
            setStatus("ok");
        } else {
            setErrMsg(res.data.message || "Gagal memuat data.");
            setStatus("error");
        }
        } catch (e) {
        console.error("[AnalitikKepsek]", e);
        setErrMsg("Tidak dapat terhubung ke server.");
        setStatus("error");
        }
    }

    // Avoid calling setState synchronously during effect execution by deferring the fetch.
    useEffect(() => {
        const t = setTimeout(() => { fetchData(); }, 0);
        return () => clearTimeout(t);
    }, []);

    const isLoading = status === "loading";
    const isOk      = status === "ok" && data;
    const isError   = status === "error";

    const trendMax = data?.trendBulanan?.length
        ? Math.max(...data.trendBulanan.map((t) => Number(t.rata_rata)))
        : 100;

    return (
        <div style={sc.wrapper}>
        <style>{`@keyframes ks-spin{to{transform:rotate(360deg)}}`}</style>

        {/* ── Header ── */}
        <div style={sc.header}>
            <div>
            <h1 style={sc.h1}>🏫 Analitik Sekolah</h1>
            <p style={sc.sub}>Ringkasan menyeluruh performa akademik seluruh sekolah</p>
            </div>
            <button
            style={{ ...sc.btn, opacity: isLoading ? 0.6 : 1, cursor: isLoading ? "not-allowed" : "pointer" }}
            onClick={fetchData}
            disabled={isLoading}
            >
            {isLoading ? "⏳ Memuat..." : "🔄 Refresh"}
            </button>
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
            <Card style={{ borderLeft: "4px solid #dc2626" }}>
            <p style={{ margin: "0 0 12px", color: "#dc2626" }}>⚠️ {errMsg}</p>
            <button style={sc.btn} onClick={fetchData}>🔄 Coba Lagi</button>
            </Card>
        )}

        {/* ── Data ── */}
        {isOk && (
            <>
            {/* KPI Utama */}
            <div style={sc.kpiGrid}>
                <KpiCard icon="👥"   label="Total Siswa"           value={data.ringkasanTotal?.total_siswa}            bg="#dbeafe" />
                <KpiCard icon="👨‍🏫" label="Total Guru"            value={data.ringkasanTotal?.total_guru}             bg="#dcfce7" />
                <KpiCard icon="🏫"   label="Total Kelas"           value={data.ringkasanTotal?.total_kelas}            bg="#fef3c7" />
                <KpiCard icon="📚"   label="Mata Pelajaran"        value={data.ringkasanTotal?.total_mapel}            bg="#f3e8ff" />
                <KpiCard icon="📊"   label="Rata-rata Nilai"       value={data.ringkasanTotal?.rata_nilai_keseluruhan} bg="#ccfbf1"
                valueColor={scoreColor(data.ringkasanTotal?.rata_nilai_keseluruhan)} />
                <KpiCard icon="📝"   label="Total Pengerjaan Soal" value={data.ringkasanTotal?.total_pengerjaan}       bg="#f3f4f6" />
            </div>

            {/* Distribusi Level + Reward & Keaktifan Guru */}
            <div style={sc.twoCol}>
                {/* Distribusi Level */}
                <Card style={{ marginBottom: 0 }}>
                <CardHead>🎯 Distribusi Level Adaptif Siswa</CardHead>
                {data.distribusiLevel?.length ? (
                    data.distribusiLevel.map((item) => {
                    const lvl = item.level_adaptif;
                    const ls  = LEVEL_STYLE[lvl] || LEVEL_STYLE.sedang;
                    return (
                        <div key={lvl} style={{ marginBottom: 16 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                            <span style={{ background: ls.bg, color: ls.color, padding: "2px 10px", borderRadius: 10, fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>
                            {lvl}
                            </span>
                            <span style={{ flex: 1, fontSize: 13, color: "#374151" }}>{item.jumlah} siswa</span>
                            <span style={{ fontWeight: 700, color: "#374151" }}>{item.persentase}%</span>
                        </div>
                        <BarWrap value={item.persentase} color={ls.color} height={12} />
                        </div>
                    );
                    })
                ) : <Empty>Belum ada siswa terdaftar.</Empty>}
                </Card>

                {/* Reward + Keaktifan Guru */}
                <Card style={{ marginBottom: 0 }}>
                <CardHead>🎖️ Statistik Reward Sekolah</CardHead>
                {data.distribusiReward && (
                    <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
                    {[
                        { bg: "#f3e8ff", val: data.distribusiReward.total_reward,              label: "Total Reward Diberikan" },
                        { bg: "#dbeafe", val: data.distribusiReward.siswa_dapat_reward,         label: "Siswa Penerima" },
                        { bg: "#dcfce7", val: `${data.distribusiReward.persentase_dapat_reward}%`, label: "% Siswa Berprestasi" },
                    ].map(({ bg, val, label }) => (
                        <div key={label} style={{ flex: 1, textAlign: "center", padding: "16px 8px", borderRadius: 12, background: bg }}>
                        <div style={{ fontSize: 26, fontWeight: 800, color: "#1e3a5f" }}>{val}</div>
                        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>{label}</div>
                        </div>
                    ))}
                    </div>
                )}

                <CardHead style={{ marginTop: 20 }}>👨‍🏫 Keaktifan Guru</CardHead>
                {data.keaktifanGuru?.length ? (
                    <table style={sc.table}>
                    <thead>
                        <tr>
                        {["Nama Guru", "Materi", "Soal"].map((h) => <th key={h} style={sc.th}>{h}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {data.keaktifanGuru.map((g) => (
                        <tr key={g.nama_guru}>
                            <td style={{ ...sc.td, fontWeight: 600 }}>{g.nama_guru}</td>
                            <td style={sc.td}>
                            <span style={sc.chipBlue}>{g.total_materi}</span>
                            </td>
                            <td style={sc.td}>
                            <span style={sc.chipGreen}>{g.jumlah_soal}</span>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                ) : <Empty>Belum ada data guru.</Empty>}
                </Card>
            </div>

            {/* Performa per Kelas */}
            <Card>
                <CardHead>🏫 Performa per Kelas</CardHead>
                {data.performaKelas?.length ? (
                <div style={sc.kelasGrid}>
                    {data.performaKelas.map((kelas) => {
                    const total = (Number(kelas.level_mudah) + Number(kelas.level_sedang) + Number(kelas.level_sulit)) || 1;
                    return (
                        <div key={kelas.kelas} style={sc.kelasCard}>
                        <div style={sc.kelasNama}>{kelas.kelas || "Kelas -"}</div>
                        <div style={{ fontSize: 32, fontWeight: 800, color: scoreColor(kelas.rata_rata_nilai) }}>
                            {kelas.rata_rata_nilai || "-"}
                        </div>
                        <div style={sc.kelasSiswa}>{kelas.total_siswa} siswa</div>
                        {/* level bar */}
                        <div style={{ display: "flex", borderRadius: 6, overflow: "hidden", height: 10 }}>
                            <div style={{ flex: Number(kelas.level_mudah) / total, background: "#16a34a", minWidth: 2 }} title={`Mudah: ${kelas.level_mudah}`} />
                            <div style={{ flex: Number(kelas.level_sedang) / total, background: "#d97706", minWidth: 2 }} title={`Sedang: ${kelas.level_sedang}`} />
                            <div style={{ flex: Number(kelas.level_sulit) / total, background: "#dc2626", minWidth: 2 }} title={`Sulit: ${kelas.level_sulit}`} />
                        </div>
                        <div style={sc.kelasLegend}>
                            <span style={sc.dotGreen} />{kelas.level_mudah}
                            <span style={sc.dotOrange} />{kelas.level_sedang}
                            <span style={sc.dotRed} />{kelas.level_sulit}
                        </div>
                        </div>
                    );
                    })}
                </div>
                ) : <Empty>Belum ada data kelas.</Empty>}
            </Card>

            {/* Performa per Mapel */}
            <Card>
                <CardHead>📚 Performa per Mata Pelajaran</CardHead>
                {data.performaMapel?.length ? (
                <table style={sc.table}>
                    <thead>
                    <tr>
                        {["Mata Pelajaran","Siswa Aktif","Rata-rata","Lulus","Tidak Lulus","% Kelulusan"].map((h) => (
                        <th key={h} style={sc.th}>{h}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {data.performaMapel.map((mp) => {
                        const total = Number(mp.jumlah_lulus) + Number(mp.jumlah_tidak_lulus);
                        const kc    = kelulusanColor(mp.jumlah_lulus, total);
                        return (
                        <tr key={mp.mata_pelajaran}>
                            <td style={{ ...sc.td, fontWeight: 600 }}>{mp.mata_pelajaran}</td>
                            <td style={sc.td}>{mp.jumlah_siswa}</td>
                            <td style={{ ...sc.td, color: scoreColor(mp.rata_rata), fontWeight: 700 }}>{mp.rata_rata || "-"}</td>
                            <td style={{ ...sc.td, color: "#16a34a" }}>{mp.jumlah_lulus}</td>
                            <td style={{ ...sc.td, color: "#dc2626" }}>{mp.jumlah_tidak_lulus}</td>
                            <td style={sc.td}>
                            <span style={{ background: kc.bg, color: kc.color, padding: "2px 8px", borderRadius: 10, fontWeight: 700, fontSize: 12 }}>
                                {pctLulus(mp.jumlah_lulus, total)}%
                            </span>
                            </td>
                        </tr>
                        );
                    })}
                    </tbody>
                </table>
                ) : <Empty>Belum ada data mata pelajaran.</Empty>}
            </Card>

            {/* Tren Bulanan */}
            {data.trendBulanan?.length > 0 && (
                <Card>
                <CardHead>📈 Tren Nilai Bulanan (6 Bulan Terakhir)</CardHead>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 160 }}>
                    {data.trendBulanan.map((item) => {
                    const val = Number(item.rata_rata);
                    const h   = trendMax > 0 ? Math.round((val / trendMax) * 100) : val;
                    return (
                        <div key={item.bulan} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" }}>
                        <div style={{ textAlign: "center", marginBottom: 4 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#374151" }}>{val}</div>
                            <div style={{ fontSize: 10, color: "#9ca3af" }}>{item.siswa_aktif} aktif</div>
                        </div>
                        <div style={{ width: "100%", maxWidth: 48, borderRadius: "6px 6px 0 0", minHeight: 4, height: `${h}%`, background: scoreColor(val), transition: "height .4s ease" }} />
                        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6, fontWeight: 600 }}>
                            {formatBulan(item.bulan)}
                        </div>
                        </div>
                    );
                    })}
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
    h1:          { fontSize: 24, margin: "0 0 4px", color: "#1e3a5f", fontWeight: 700 },
    sub:         { color: "#666", margin: 0, fontSize: 14 },
    btn:         { background: "#1e3a5f", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600 },
    kpiGrid:     { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 14, marginBottom: 24 },
    twoCol:      { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, marginBottom: 20 },
    table:       { width: "100%", borderCollapse: "collapse", fontSize: 13 },
    th:          { background: "#f9fafb", padding: "8px 10px", textAlign: "left", fontSize: 12, color: "#6b7280", borderBottom: "1px solid #e5e7eb" },
    td:          { padding: 10, borderBottom: "1px solid #f3f4f6", verticalAlign: "middle" },
    chipBlue:    { padding: "2px 8px", borderRadius: 10, fontWeight: 700, fontSize: 12, background: "#dbeafe", color: "#1d4ed8" },
    chipGreen:   { padding: "2px 8px", borderRadius: 10, fontWeight: 700, fontSize: 12, background: "#dcfce7", color: "#16a34a" },
    kelasGrid:   { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 },
    kelasCard:   { background: "#f9fafb", borderRadius: 12, padding: 16, textAlign: "center" },
    kelasNama:   { fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 4 },
    kelasSiswa:  { fontSize: 12, color: "#9ca3af", margin: "4px 0 10px" },
    kelasLegend: { display: "flex", justifyContent: "center", gap: 8, fontSize: 11, color: "#6b7280", marginTop: 6, alignItems: "center" },
    dotGreen:    { display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#16a34a", marginRight: 2 },
    dotOrange:   { display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#d97706", marginRight: 2 },
    dotRed:      { display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#dc2626", marginRight: 2 },
    spinner:     { width: 40, height: 40, border: "4px solid #e5e7eb", borderTopColor: "#1e3a5f", borderRadius: "50%", animation: "ks-spin .8s linear infinite", margin: "0 auto 16px" },
};