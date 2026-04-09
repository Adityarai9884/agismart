// pages/farmer/FarmerDashboard.jsx
import React, { useState } from 'react';
import TransportCalc from '../../components/TransportCalc';
import { PRICE_PREDICTIONS, WHEAT_PRICES_30D } from '../../data/mockData';

const NAV = [
  { id:'overview',  icon:'📊', label:'Overview'       },
  { id:'addcrop',   icon:'➕', label:'Add Crop'        },
  { id:'mycrops',   icon:'🌾', label:'My Crops'        },
  { id:'transport', icon:'🚛', label:'Transport'       },
  { id:'prices',    icon:'📈', label:'Price Forecast', section:'AI Tools' },
  { id:'weather',   icon:'🌤️',label:'Weather Alert'  },
];

const MY_CROPS = [
  { name:'Wheat',   harvested:'Apr 2, 2026',  qty:45, listed:2900, ai:'₹2,840–3,100', status:'active'  },
  { name:'Mustard', harvested:'Mar 28, 2026', qty:20, listed:5200, ai:'₹5,000–5,500', status:'pending' },
  { name:'Rice',    harvested:'Mar 20, 2026', qty:60, listed:3100, ai:'₹3,000–3,200', status:'sold'    },
];

function PriceChart() {
  const prices = WHEAT_PRICES_30D;
  const max = Math.max(...prices), min = Math.min(...prices);
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:7, height:82, marginTop:14 }}>
      {prices.map((p, i) => {
        const h = Math.round(((p - min) / (max - min)) * 70 + 10);
        const isLast = i >= 28;
        return (
          <div key={i} title={`₹${p}`} style={{
            flex:1, height:h, borderRadius:'3px 3px 0 0',
            background: isLast ? 'var(--green)' : 'var(--green-pale)',
            minHeight:8, cursor:'default', transition:'height 0.4s',
          }} />
        );
      })}
    </div>
  );
}

export default function FarmerDashboard({ user, onToast, onLogout }) {
  const [panel, setPanel] = useState('overview');
  const [cropName, setCropName] = useState('Wheat');
  const [cropQty, setCropQty]   = useState('');
  const pred = PRICE_PREDICTIONS[cropName] || PRICE_PREDICTIONS.Wheat;

  const statusStyle = {
    active:  { background:'var(--green-pale)', color:'var(--green)'  },
    pending: { background:'var(--gold-light)',  color:'#6D4C00'      },
    sold:    { background:'#E8EAF6',            color:'#3949AB'      },
  };

  return (
    <div style={{ paddingTop:'var(--navbar-h)' }}>
      {/* Sub-header */}
      <div style={{
        background:'white', borderBottom:'1px solid var(--border)',
        padding:'0 32px', height:64,
        display:'flex', alignItems:'center', justifyContent:'space-between',
      }}>
        <div style={{ fontFamily:'var(--font-head)', fontSize:20, fontWeight:800 }}>🌾 Farmer Dashboard</div>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div>
            <div style={{ fontSize:14, fontWeight:600 }}>{user?.name || 'Ramesh Kumar'}</div>
            <div style={{ fontSize:13, fontWeight:700, color:'var(--green)' }}>{user?.uid || 'FRAY0001'} · Ayodhya</div>
          </div>
          <div style={{ width:36, height:36, borderRadius:'50%', background:'var(--green)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:14 }}>
            {(user?.name || 'RK').split(' ').map(w => w[0]).join('').slice(0,2)}
          </div>
          <button className="btn-secondary btn-sm" onClick={onLogout}>Logout</button>
        </div>
      </div>

      {/* Layout */}
      <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', minHeight:'calc(100vh - 128px)' }}>
        {/* Sidebar */}
        <div className="dash-sidebar">
          {NAV.map((item, i) => (
            <React.Fragment key={item.id}>
              {item.section && <div className="sidebar-section-label">{item.section}</div>}
              <div
                className={`nav-item${panel === item.id ? ' active' : ''}`}
                onClick={() => setPanel(item.id)}
              >
                <span className="nav-icon">{item.icon}</span> {item.label}
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding:32, background:'var(--bg)', overflowY:'auto' }}>

          {/* ─ OVERVIEW ─ */}
          {panel === 'overview' && (
            <div>
              <div style={{ fontFamily:'var(--font-head)', fontSize:22, fontWeight:800, marginBottom:24 }}>
                Good Morning, {(user?.name || 'Ramesh').split(' ')[0]} 🙏
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
                {[
                  { label:'Active Listings',   value:'4',     change:'↑ 1 new this week',         c:'up' },
                  { label:'Total Revenue',     value:'₹1.4L', change:'↑ +12% vs last month',       c:'up' },
                  { label:'Pending Transport', value:'1',     change:'Truck awaiting confirmation', c:'down' },
                  { label:'AI Alerts',         value:'2',     change:'⚡ Action recommended',       c:'warn' },
                ].map((s,i) => (
                  <div key={i} className="stat-card">
                    <div className="stat-label">{s.label}</div>
                    <div className="stat-value">{s.value}</div>
                    <div className={`stat-change change-${s.c}`}>{s.change}</div>
                  </div>
                ))}
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:20 }}>
                <div className="card">
                  <div className="card-head">
                    <span className="card-title">My Crop Listings</span>
                    <button className="btn-primary btn-sm" onClick={() => setPanel('addcrop')}>+ Add Crop</button>
                  </div>
                  <div className="card-body">
                    <table className="data-table">
                      <thead><tr><th>Crop</th><th>Qty (Qtl)</th><th>Base Price</th><th>Status</th></tr></thead>
                      <tbody>
                        {MY_CROPS.map((c,i) => (
                          <tr key={i}>
                            <td><div style={{ fontWeight:600 }}>{c.name}</div><div style={{ fontSize:12, color:'var(--muted)' }}>{c.harvested}</div></td>
                            <td>{c.qty}</td>
                            <td>₹{c.listed.toLocaleString()}</td>
                            <td><span className="pill" style={statusStyle[c.status]}>{c.status.charAt(0).toUpperCase()+c.status.slice(1)}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <div className="ai-insight">
                    <div className="ai-insight-head"><span className="ai-badge">GEMINI AI</span></div>
                    <div className="ai-text">🌾 <strong>Wheat prices</strong> in Ayodhya likely to rise 10% next week. <strong>Recommendation: Hold Stock.</strong></div>
                    <div className="ai-action" onClick={() => setPanel('prices')}>View Full Forecast →</div>
                  </div>
                  <div className="ai-insight" style={{ background:'linear-gradient(135deg,#0277BD,#01579B)' }}>
                    <div className="ai-insight-head"><span className="ai-badge" style={{ background:'#90CAF9', color:'#01579B' }}>WEATHER</span></div>
                    <div className="ai-text">🌧️ Heavy rain in <strong>Ayodhya on Friday</strong>. Move Mustard to Mandi by Thursday.</div>
                    <div className="ai-action" onClick={() => setPanel('weather')}>Full Weather Report →</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─ ADD CROP ─ */}
          {panel === 'addcrop' && (
            <div>
              <div style={{ fontFamily:'var(--font-head)', fontSize:22, fontWeight:800, marginBottom:24 }}>Add New Crop Listing</div>
              <div className="card">
                <div className="card-head"><span className="card-title">Crop Details</span></div>
                <div className="card-body">
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
                    <div className="form-group">
                      <label className="form-label">Crop Name</label>
                      <select className="form-select" value={cropName} onChange={e => setCropName(e.target.value)}>
                        {Object.keys(PRICE_PREDICTIONS).map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Quantity (Quintals)</label>
                      <input className="form-input" type="number" placeholder="e.g. 10" value={cropQty} onChange={e => setCropQty(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Harvest Date</label>
                      <input className="form-input" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Grade / Quality</label>
                      <select className="form-select">
                        <option>Grade A (Premium)</option><option>Grade B (Standard)</option><option>Grade C (Economy)</option>
                      </select>
                    </div>

                    {/* AI Price Prediction */}
                    <div className="form-group full">
                      <label className="form-label">AI Price Prediction</label>
                      <div style={{ background:'var(--green-pale)', border:'1px solid var(--green)', borderRadius:12, padding:18 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                          <span style={{ fontSize:13, fontWeight:700, color:'var(--green)' }}>🤖 Gemini Suggested Base Price</span>
                          <span className="ai-badge" style={{ background:'var(--green)', color:'white' }}>LIVE AI</span>
                        </div>
                        <div style={{ fontFamily:'var(--font-head)', fontSize:24, fontWeight:800, color:'var(--green)' }}>{pred.range} / qtl</div>
                        <div style={{ fontSize:12, color:'#388E3C', marginTop:4 }}>{pred.note}</div>
                        <div style={{ marginTop:8, display:'inline-block', padding:'4px 12px', background:'var(--green)', color:'white', borderRadius:6, fontSize:12, fontWeight:700 }}>
                          Action: {pred.action}
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Your Asking Price (₹/qtl)</label>
                      <input className="form-input" type="number" placeholder="Enter your price" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Book Transport?</label>
                      <select className="form-select">
                        <option>No, I'll arrange myself</option>
                        <option>Yes, suggest auto-transport</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display:'flex', gap:14, marginTop:28 }}>
                    <button className="btn-primary" style={{ flex:1, padding:14 }} onClick={() => { onToast('🌾','Crop listed! Waiting for buyer offers.'); setPanel('mycrops'); }}>
                      🌾 List Crop Now
                    </button>
                    <button className="btn-secondary" onClick={() => setPanel('mycrops')}>Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─ MY CROPS ─ */}
          {panel === 'mycrops' && (
            <div>
              <div style={{ fontFamily:'var(--font-head)', fontSize:22, fontWeight:800, marginBottom:24 }}>My Crop Listings</div>
              <div className="card">
                <div className="card-body">
                  <table className="data-table">
                    <thead><tr><th>Crop</th><th>Qty (Qtl)</th><th>Listed Price</th><th>AI Suggests</th><th>Harvest Date</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                      {MY_CROPS.map((c,i) => (
                        <tr key={i}>
                          <td><div style={{ fontWeight:600 }}>{c.name}</div></td>
                          <td>{c.qty}</td>
                          <td>₹{c.listed.toLocaleString()}</td>
                          <td style={{ fontSize:13, color:'var(--muted)' }}>{c.ai}</td>
                          <td style={{ fontSize:13 }}>{c.harvested}</td>
                          <td><span className="pill" style={statusStyle[c.status]}>{c.status.charAt(0).toUpperCase()+c.status.slice(1)}</span></td>
                          <td>
                            {c.status === 'pending'
                              ? <button className="btn-primary btn-sm" onClick={() => onToast('💬','Offer: ₹5,050 from WHMT0090')}>View Offer</button>
                              : <button style={{ background:'none', border:'1px solid var(--border)', padding:'6px 10px', borderRadius:6, cursor:'pointer', fontSize:12 }} onClick={() => onToast('✅','Crop updated!')}>Edit</button>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ─ TRANSPORT ─ */}
          {panel === 'transport' && (
            <div>
              <div style={{ fontFamily:'var(--font-head)', fontSize:22, fontWeight:800, marginBottom:24 }}>Book Transport</div>
              <div className="card">
                <div className="card-head"><span className="card-title">Smart Transport Calculator</span></div>
                <div className="card-body">
                  <TransportCalc onBook={(v, kg) => onToast('🚛', `${v.name} booked for ${kg}kg!`)} />
                </div>
              </div>
            </div>
          )}

          {/* ─ PRICES ─ */}
          {panel === 'prices' && (
            <div>
              <div style={{ fontFamily:'var(--font-head)', fontSize:22, fontWeight:800, marginBottom:24 }}>AI Price Forecast</div>
              <div className="card">
                <div className="card-head">
                  <span className="card-title">30-Day Trend · Wheat · Ayodhya</span>
                  <span className="ai-badge" style={{ background:'var(--green)', color:'white', padding:'4px 10px', borderRadius:6 }}>GEMINI POWERED</span>
                </div>
                <div className="card-body">
                  <div style={{ display:'flex', gap:32, marginBottom:20 }}>
                    {[["Today's Price","₹2,840","var(--green)"],["7-Day Forecast","₹3,120 ↑","#2E7D32"],["Recommendation","⏸ Hold Stock","var(--gold)"]].map(([l,v,c],i) => (
                      <div key={i}>
                        <div style={{ fontSize:13, color:'var(--muted)' }}>{l}</div>
                        <div style={{ fontFamily:'var(--font-head)', fontSize:i===2?20:28, fontWeight:800, color:c }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <PriceChart />
                  <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
                    <span style={{ fontSize:11, color:'var(--muted)' }}>30 days ago</span>
                    <span style={{ fontSize:11, color:'var(--muted)' }}>Today</span>
                  </div>
                  <div className="ai-insight" style={{ marginTop:20 }}>
                    <div className="ai-insight-head"><span className="ai-badge">GEMINI AI</span></div>
                    <div className="ai-text">Wheat prices in Ayodhya are likely to increase by 10% next week due to reduced supply from Agra and increased demand from Delhi wholesale markets. <strong>Recommended: Hold stock for 5–7 days.</strong></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─ WEATHER ─ */}
          {panel === 'weather' && (
            <div>
              <div style={{ fontFamily:'var(--font-head)', fontSize:22, fontWeight:800, marginBottom:24 }}>Weather Advisory · Ayodhya</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:20 }}>
                {[
                  { day:'Today',    icon:'☀️', temp:'32°C', note:'Clear · Low humidity',    bg:'linear-gradient(135deg,#0277BD,#01579B)', white:true },
                  { day:'Tomorrow', icon:'⛅', temp:'29°C', note:'Partly cloudy',           bg:'var(--card)', white:false },
                  { day:'Thursday', icon:'🌧️', temp:'24°C', note:'⚡ Heavy rain incoming!', bg:'var(--gold-light)', white:false, gold:true },
                  { day:'Friday',   icon:'⛈️', temp:'22°C', note:'Severe rain · No transport',bg:'var(--card)', white:false, red:true },
                ].map((w,i) => (
                  <div key={i} className="stat-card" style={{ background:w.bg, border:w.gold?'1px solid var(--gold)':'1px solid var(--border)' }}>
                    <div className="stat-label" style={{ color:w.white?'rgba(255,255,255,0.7)':w.gold?'#6D4C00':'var(--muted)' }}>{w.day}</div>
                    <div className="stat-value" style={{ color:w.white?'white':w.gold?'#6D4C00':'var(--text)' }}>{w.icon} {w.temp}</div>
                    <div className="stat-change" style={{ color:w.white?'rgba(255,255,255,0.7)':w.red?'var(--danger)':w.gold?'#8D6E00':'var(--muted)' }}>{w.note}</div>
                  </div>
                ))}
              </div>
              <div className="ai-insight" style={{ background:'linear-gradient(135deg,#E65100,#BF360C)' }}>
                <div className="ai-insight-head"><span className="ai-badge" style={{ background:'#FFCCBC', color:'#BF360C' }}>⚡ URGENT ADVISORY</span></div>
                <div className="ai-text"><strong>Heavy rain predicted in Ayodhya on Friday.</strong> Complete all harvesting and move Mustard crop to Mandi warehouse by Thursday evening. Risk of 15–20% crop damage if left in field.</div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
