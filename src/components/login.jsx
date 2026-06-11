import { useState } from 'react';
import axios from 'axios';

const Login = () => {
    // State internal murni tanpa mengikat window.location
    const [role, setRole] = useState('siswa');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!username || !password) {
            setError('Username dan password wajib diisi!');
            return;
        }

        try {
            setLoading(true);
            
            // Mengirimkan payload murni ke server backend
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                username,
                password,
                role: role.toLowerCase() // Pastikan selalu huruf kecil murni
            });

            if (response.data.success) {
                localStorage.setItem('userToken', JSON.stringify(response.data.user));
                
                // Redirect instan menggunakan window.location.href ke halaman dashboard masing-masing
                const targetRole = response.data.user.role.toLowerCase();
                if (targetRole === 'guru') {
                    window.location.href = '/dashboard-guru';
                } else if (targetRole === 'siswa') {
                    window.location.href = '/dashboard-siswa';
                } else if (targetRole === 'orang_tua' || targetRole === 'orang_tua') {
                    window.location.href = '/dashboard-ortu';
                } else if (targetRole === 'kepala_sekolah' || targetRole === 'kepala_sekolah') {
                    window.location.href = '/dashboard-kepsek';
                }
            }
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                setError(err.response.data.message);
            } else {
                setError('Gagal masuk. Periksa kembali username, password, dan jenis akun Anda.');
            }
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        container: {
            display: 'flex',
            minHeight: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f3f4f6',
            fontFamily: 'sans-serif',
            padding: '0 20px'
        },
        card: {
            width: '100%',
            maxWidth: '450px',
            backgroundColor: '#ffffff',
            padding: '40px 30px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        },
        header: {
            textAlign: 'center',
            marginBottom: '30px'
        },
        title: {
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#2563eb',
            margin: '0 0 5px 0'
        },
        subtitle: {
            fontSize: '14px',
            color: '#6b7280',
            margin: 0
        },
        tabContainer: {
            display: 'flex',
            backgroundColor: '#f3f4f6',
            padding: '4px',
            borderRadius: '8px',
            marginBottom: '25px',
            gap: '2px'
        },
        tabBtn: (active) => ({
            flex: 1,
            padding: '10px 0',
            textAlign: 'center',
            fontSize: '13px',
            fontWeight: '600',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            // BIKIN TAB YANG AKTIF JAUH LEBIH JELAS
            backgroundColor: active ? '#2563eb' : 'transparent', 
            color: active ? '#ffffff' : '#6b7280',
            boxShadow: active ? '0 2px 4px rgba(37, 99, 235, 0.3)' : 'none',
            transition: 'all 0.2s'
        }),
        formGroup: {
            marginBottom: '20px'
        },
        label: {
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '6px'
        },
        input: {
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box'
        },
        btnSubmit: {
            width: '100%',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            padding: '12px',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            marginTop: '10px'
        },
        footer: {
            textAlign: 'center',
            fontSize: '13px',
            color: '#6b7280',
            marginTop: '25px'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h2 style={styles.title}>EduAdapt</h2>
                    <p style={styles.subtitle}>Masuk ke akun Anda</p>
                </div>

                {/* TAB SELECTION MURNI MENGUBAH STATE INTERNAL */}
                <div style={styles.tabContainer}>
                    <button
                        type="button"
                        style={styles.tabBtn(role === 'siswa')}
                        onClick={() => { setRole('siswa'); setError(''); }}
                    >
                        👤 Siswa
                    </button>
                    <button
                        type="button"
                        style={styles.tabBtn(role === 'guru')}
                        onClick={() => { setRole('guru'); setError(''); }}
                    >
                        👨‍🏫 Guru
                    </button>
                    <button
                        type="button"
                        style={styles.tabBtn(role === 'orang_tua')}
                        onClick={() => { setRole('orang_tua'); setError(''); }}
                    >
                        👪 Wali
                    </button>
                    <button
                        type="button"
                        style={styles.tabBtn(role === 'kepala_sekolah')}
                        onClick={() => { setRole('kepala_sekolah'); setError(''); }}
                    >
                        💼 Kepsek
                    </button>
                </div>

                {error && (
                    <div style={{ color: '#dc2626', backgroundColor: '#fef2f2', padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '15px', borderLeft: '4px solid #dc2626' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Username</label>
                        <input
                            type="text"
                            style={styles.input}
                            placeholder="Masukkan username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            style={styles.input}
                            placeholder="•••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" disabled={loading} style={styles.btnSubmit}>
                        {loading ? 'Memproses...' : 'Masuk'}
                    </button>
                </form>

                <div style={styles.footer}>
                    Belum punya akun? <span style={{ color: '#2563eb', cursor: 'pointer', fontWeight: '500' }}>Daftar di sini</span>
                </div>
            </div>
        </div>
    );
};

export default Login;