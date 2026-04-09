// pages/wholesaler/WholesalerDashboard.jsx
import React, { useState } from 'react';
import { CROPS } from '../../data/mockData';

const NAV = [
  { id:'overview', icon:'📊', label:'Overview' },
  { id:'browse',   icon:'🔍', label:'Browse Market' },
  { id:'orders',   icon:'📦', label:'My Orders' },
  { id:'demand',   icon:'📈', label:'Demand Alerts', section:'Analytics' },
];

const ORDERS = [
  { id:'#ORD-001', crop:'Wheat',   farmer:'FRAY0001', qty:'100 Qtl', amount:'₹2.84L', status:'completed' },
  { id:'#ORD-002', crop:'Rice',    farmer:'FRAY0034', qty:'50 Qtl',  amount:'₹1.55L', status:'pending'   },
  { id:'#ORD-003', crop:'Mustard', farmer:'FRAY0089', qty:'30 Qtl',  amount:'₹1.56L', status:'transit'   },
];

const statusStyle = {
  completed: { background:'var(--green-pale)', color:'var(--green)'  },
  pending:   { background:'var(--gold-light)',  color:'#6D4C00'      },
  transit:   { background:'#FBE9E7',            color:'#BF360C'      },
};
const statusLabel = { completed:'Completed', pending:'Payment Pending', transit:'Transport En Route' };

export default function WholesalerDashboard({ user, onToast, onLogout }) {
  const [panel, setPanel]   = useState('overview');
  const [search, setSearch] = useState('');

  const filtered = CROPS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ paddingTop:'var(--navbar-h)' }}>
      {/* Sub-header */}
      <div style={{ background:'white', borderBottom:'1px solid var(--border)', padding:'0 32px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ fontFamily:'var(--font-head)', fontSize:20, fontWeight:800 }}>🏪 Wholesaler Dashboard</div>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div>
            <div style={{ fontSize:14, fontWeight:600 }}>{user?.name || 'Suresh Agarwal'}</div>
            <div style={{ fontSize:13, fontWeight:700, color:'var(--green)' }}>{user?.uid || 'WHMT0512'} · Mathura</div>
          </div>
          <div style={{ width:36, height:36, borderRadius:'50%', background:'#0277BD', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:14 }}>SA</div>
          <button className="btn-secondary btn-sm" onClick={onLogout}>Logout</button>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', minHeight:'calc(100vh - 128px)' }}>
        {/* Sidebar */}
        <div className="dash-sidebar">
          {NAV.map((item, i) => (
            <React.Fragment key={item.id}>
              {item.section && <div className="sidebar-section-label">{item.section}</div>}
              <div className={`nav-item${panel === item.id ? ' active' : ''}`} onClick={() => setPanel(item.id)}>
                <span className="nav-icon">{item.icon}</span> {item.label}
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding:32, background:'var(--bg)' }}>

          {panel === 'overview' && (
            <div>
              <div style={{ fontFamily:'var(--font-head)', fontSize:22, fontWeight:800, marginBottom:24 }}>Welcome, Suresh 🙏</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:22 }}>
                {[
                  { label:'Open Orders',     value:'7',      change:'↑ 2 new today',      c:'up'  },
                  { label:'Total Purchases', value:'₹8.2L',  change:'↑ This month',        c:'up'  },
                  { label:'Pending Payment', value:'₹1.4L',  change:'3 transactions',       c:'down'},
                  { label:'Crops Tracked',   value:'12',     change:'',                     c:''   },
                ].map((s,i) => (
                  <div key={i} className="stat-card">
                    <div className="stat-label">{s.label}</div>
                    <div className="stat-value">{s.value}</div>
                    {s.change && <div className={`stat-change change-${s.c}`}>{s.change}</div>}
                  </div>
                ))}
              </div>

              <div className="ai-insight" style={{ marginBottom:20 }}>
                <div className="ai-insight-head"><span className="ai-badge">DEMAND ALERT</span></div>
                <div className="ai-text">🔥 <strong>Mustard demand surge detected</strong> — 12 buyers searching in Mathura. 8 farmers have listed stock. <strong>Act now before prices rise.</strong></div>
                <div className="ai-action" onClick={() => setPanel('browse')}>Browse Mustard Listings →</div>
              </div>

              <div className="card">
                <div className="card-head"><span className="card-title">Recent Orders</span></div>
                <div className="card-body">
                  <table className="data-table">
                    <thead><tr><th>Crop</th><th>Farmer ID</th><th>Qty</th><th>Amount</th><th>Status</th></tr></thead>
                    <tbody>
                      {ORDERS.slice(0,2).map((o,i) => (
                        <tr key={i}>
                          <td style={{ fontWeight:600 }}>{o.crop}</td>
                          <td style={{ fontFamily:'var(--font-head)', color:'var(--green)', fontWeight:700 }}>{o.farmer}</td>
                          <td>{o.qty}</td>
                          <td style={{ fontWeight:600 }}>{o.amount}</td>
                          <td><span className="pill" style={statusStyle[o.status]}>{statusLabel[o.status]}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {panel === 'browse' && (
            <div>
              <div style={{ fontFamily:'var(--font-head)', fontSize:22, fontWeight:800, marginBottom:20 }}>Browse Market Listings</div>
              <div style={{ display:'flex', gap:12, marginBottom:24 }}>
                <input className="form-input" style={{ flex:1 }} placeholder="Search crop name..." value={search} onChange={e => setSearch(e.target.value)} />
                <select className="form-select" style={{ width:170 }}>
                  <option>All Districts</option><option>Ayodhya</option><option>Mathura</option><option>Agra</option>
                </select>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
                {filtered.map(c => (
                  <div key={c.id} className="market-card">
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                      <div style={{ fontFamily:'var(--font-head)', fontSize:18, fontWeight:700 }}>{c.name}</div>
                      <span style={{ fontSize:11, fontWeight:700, color:c.up?'#2E7D32':'var(--danger)' }}>{c.trend}</span>
                    </div>
                    <div style={{ fontSize:12, color:'var(--muted)', marginBottom:12 }}>🌾 {c.farmer} · {c.district}</div>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
                      <span style={{ fontSize:14, color:'var(--muted)' }}>{c.qty} available</span>
                      <div style={{ textAlign:'right' }}>
                        <div style={{ fontFamily:'var(--font-head)', fontSize:20, fontWeight:800, color:'var(--green)' }}>₹{c.price.toLocaleString()}</div>
                        <div style={{ fontSize:11, color:'var(--muted)' }}>per qtl</div>
                      </div>
                    </div>
                    <button className="btn-primary" style={{ width:'100%', marginTop:14, padding:10, fontSize:13 }} onClick={() => onToast('🛒',`Request sent to ${c.farmer}!`)}>
                      Request to Buy
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {panel === 'orders' && (
            <div>
              <div style={{ fontFamily:'var(--font-head)', fontSize:22, fontWeight:800, marginBottom:20 }}>Order Tracking</div>
              <div className="card">
                <div className="card-body">
                  <table className="data-table">
                    <thead><tr><th>Order ID</th><th>Crop</th><th>Farmer</th><th>Qty</th><th>Amount</th><th>Status</th></tr></thead>
                    <tbody>
                      {ORDERS.map((o,i) => (
                        <tr key={i}>
                          <td style={{ fontFamily:'var(--font-head)', fontSize:13, fontWeight:700 }}>{o.id}</td>
                          <td style={{ fontWeight:600 }}>{o.crop}</td>
                          <td style={{ color:'var(--green)', fontWeight:700, fontFamily:'var(--font-head)' }}>{o.farmer}</td>
                          <td>{o.qty}</td>
                          <td style={{ fontWeight:600 }}>{o.amount}</td>
                          <td><span className="pill" style={statusStyle[o.status]}>{statusLabel[o.status]}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {panel === 'demand' && (
            <div>
              <div style={{ fontFamily:'var(--font-head)', fontSize:22, fontWeight:800, marginBottom:20 }}>Demand Alerts</div>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <div className="ai-insight">
                  <div className="ai-insight-head"><span className="ai-badge">HOT 🔥</span></div>
                  <div className="ai-text"><strong>Mustard</strong> — 12 buyers searching in Mathura. 8 farmer listings available. Average ask: ₹5,200/qtl.</div>
                </div>
                <div className="ai-insight" style={{ background:'linear-gradient(135deg,#1565C0,#0D47A1)' }}>
                  <div className="ai-insight-head"><span className="ai-badge" style={{ background:'#BBDEFB', color:'#0D47A1' }}>WATCH</span></div>
                  <div className="ai-text"><strong>Sugarcane</strong> — Supply predicted to drop 20% in Agra next week. Stock up before price spike.</div>
                </div>
                <div className="ai-insight" style={{ background:'linear-gradient(135deg,#4A148C,#6A1B9A)' }}>
                  <div className="ai-insight-head"><span className="ai-badge" style={{ background:'#E1BEE7', color:'#4A148C' }}>TRENDING</span></div>
                  <div className="ai-text"><strong>Cotton</strong> — Delhi buyers aggressively purchasing. 35 Qtl available from FRAY0056. Price: ₹7,200/qtl.</div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
