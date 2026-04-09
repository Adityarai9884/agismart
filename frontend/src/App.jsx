// App.jsx — Root component, handles routing and global state
import React, { useState, useCallback } from 'react';
import './styles/globals.css';
import './styles/components.css';

import Navbar               from './components/Navbar';
import AuthModal            from './components/AuthModal';
import Toast                from './components/Toast';
import AIChat               from './components/AIChat';

import Landing              from './pages/Landing';
import MarketPage           from './pages/MarketPage';
import TransportPage        from './pages/TransportPage';
import UIDPage              from './pages/UIDPage';
import FarmerDashboard      from './pages/farmer/FarmerDashboard';
import WholesalerDashboard  from './pages/wholesaler/WholesalerDashboard';
import InchargeDashboard    from './pages/incharge/InchargeDashboard';

// Demo user lookup by UID prefix
const DEMO_USERS = {
  'FR': { role:'farmer',      name:'Ramesh Kumar',   district:'Ayodhya' },
  'WH': { role:'wholesaler',  name:'Suresh Agarwal', district:'Mathura' },
  'IN': { role:'incharge',    name:'Vijay Singh',    district:'Delhi'   },
  'BY': { role:'buyer',       name:'Ankit Sharma',   district:'Agra'    },
  'AD': { role:'admin',       name:'Admin User',     district:'Delhi'   },
};

export default function App() {
  const [page,        setPage]        = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);
  const [modal,       setModal]       = useState(null);   // 'login' | 'register' | null
  const [toast,       setToast]       = useState(null);

  // ── Toast helper ──────────────────────────────
  const showToast = useCallback((icon, msg) => {
    setToast({ icon, msg });
  }, []);

  // ── Navigation ────────────────────────────────
  function navigate(target) {
    // If target is a dashboard and no user → force login
    if (['farmer','wholesaler','incharge'].includes(target) && !currentUser) {
      setModal('login');
      return;
    }
    setPage(target);
    window.scrollTo(0, 0);
  }

  // ── Auth ──────────────────────────────────────
  function handleLogin(uid) {
    const prefix = uid.slice(0, 2).toUpperCase();
    const meta   = DEMO_USERS[prefix] || { role:'farmer', name:'Farmer User', district:'Ayodhya' };
    const user   = { uid, ...meta };
    setCurrentUser(user);
    setModal(null);
    showToast('✅', `Logged in as ${uid}`);
    setPage(meta.role === 'buyer' ? 'market' : meta.role);
  }

  function handleRegister(uid, role) {
    const meta = { role, name: 'New User', district: 'Ayodhya' };
    const user = { uid, ...meta };
    setCurrentUser(user);
    setModal(null);
    showToast('🎉', `Welcome! Your AgriSmart ID: ${uid}`);
    setPage(role === 'buyer' ? 'market' : role);
  }

  function handleLogout() {
    setCurrentUser(null);
    setPage('landing');
    showToast('👋', 'Logged out successfully');
  }

  // ── Shared props ──────────────────────────────
  const commonProps = { user: currentUser, onToast: showToast, onLogout: handleLogout };

  // ── Render ────────────────────────────────────
  return (
    <>
      {/* Global Navbar (hidden on dashboard pages that have their own header) */}
      {!['farmer','wholesaler','incharge'].includes(page) && (
        <Navbar
          currentPage={page}
          currentUser={currentUser}
          onNav={navigate}
          onLogin={() => setModal('login')}
          onRegister={() => setModal('register')}
          onLogout={handleLogout}
        />
      )}

      {/* Pages */}
      {page === 'landing'     && <Landing    onRegister={() => setModal('register')} onNav={navigate} />}
      {page === 'market'      && <MarketPage onToast={showToast} />}
      {page === 'transport'   && <TransportPage onToast={showToast} onRegister={() => setModal('register')} />}
      {page === 'uid'         && <UIDPage />}

      {/* Dashboards */}
      {page === 'farmer'      && <FarmerDashboard     {...commonProps} />}
      {page === 'wholesaler'  && <WholesalerDashboard  {...commonProps} />}
      {page === 'incharge'    && <InchargeDashboard    {...commonProps} />}

      {/* Auth Modal */}
      {modal && (
        <AuthModal
          mode={modal}
          onClose={() => setModal(null)}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}

      {/* Global Toast */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Floating AI Chat */}
      <AIChat />
    </>
  );
}
