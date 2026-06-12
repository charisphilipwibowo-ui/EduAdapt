// src/components/Layout.jsx
import Sidebar from './Sidebar'; // Pastikan Sidebar.jsx ada di folder ini

const Layout = ({ children }) => (
    <div style={{ display: 'flex' }}>
        <Sidebar /> 
        <main style={{ flex: 1, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        {children}
        </main>
    </div>
);
export default Layout;