import { useState, useRef, useEffect } from 'react'

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --gold: #C9A84C;
    --gold-light: #E8D5A3;
    --gold-dim: #8a6f30;
    --dark: #1a1814;
    --dark-2: #242118;
    --dark-3: #2e2b24;
    --dark-4: #3a3630;
    --cream: #F5F0E8;
    --cream-dim: #b8b0a0;
    --muted: #7a7468;
    --radius: 12px;
    --font-display: 'Cormorant Garamond', serif;
    --font-body: 'DM Sans', sans-serif;
  }
  body { font-family: var(--font-body); background: var(--dark); color: var(--cream); min-height: 100vh; }
  .nav { display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; border-bottom: 1px solid rgba(201,168,76,0.15); }
  .nav-brand { font-family: var(--font-display); font-size: 22px; font-weight: 500; color: var(--gold); letter-spacing: 0.04em; }
  .nav-tabs { display: flex; gap: 4px; background: var(--dark-3); border-radius: 8px; padding: 4px; }
  .tab { padding: 7px 18px; border-radius: 6px; font-size: 13px; cursor: pointer; border: none; background: transparent; color: var(--muted); transition: all 0.2s; font-family: var(--font-body); }
  .tab.active { background: var(--dark-4); color: var(--cream); }
  .tab:hover:not(.active) { color: var(--cream-dim); }
  .panel { display: none; height: calc(100vh - 57px); }
  .panel.active { display: flex; }
  .chat-panel { flex-direction: column; max-width: 480px; margin: 0 auto; width: 100%; }
  .chat-header { padding: 20px 24px 16px; border-bottom: 1px solid rgba(201,168,76,0.12); text-align: center; }
  .hotel-name { font-family: var(--font-display); font-size: 20px; font-weight: 500; color: var(--gold); }
  .hotel-sub { font-size: 12px; color: var(--muted); margin-top: 2px; letter-spacing: 0.06em; text-transform: uppercase; }
  .chat-messages { flex: 1; overflow-y: auto; padding: 20px 16px; display: flex; flex-direction: column; gap: 12px; }
  .chat-messages::-webkit-scrollbar { width: 4px; }
  .chat-messages::-webkit-scrollbar-thumb { background: var(--dark-4); border-radius: 2px; }
  .msg { display: flex; gap: 10px; max-width: 85%; }
  .msg.guest { align-self: flex-end; flex-direction: row-reverse; }
  .msg.bot { align-self: flex-start; }
  .msg-avatar { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 500; flex-shrink: 0; }
  .bot .msg-avatar { background: var(--dark-3); border: 1px solid rgba(201,168,76,0.3); color: var(--gold); font-family: var(--font-display); }
  .guest .msg-avatar { background: var(--gold-dim); color: var(--dark); font-size: 11px; }
  .msg-bubble { padding: 10px 14px; border-radius: var(--radius); font-size: 14px; line-height: 1.5; }
  .bot .msg-bubble { background: var(--dark-3); color: var(--cream); border-bottom-left-radius: 4px; }
  .guest .msg-bubble { background: var(--gold); color: var(--dark); border-bottom-right-radius: 4px; }
  .msg-time { font-size: 10px; color: var(--muted); margin-top: 3px; padding: 0 4px; }
  .bot .msg-time { text-align: left; }
  .guest .msg-time { text-align: right; }
  .typing { display: flex; align-items: center; gap: 4px; padding: 4px 0; }
  .typing span { width: 6px; height: 6px; background: var(--muted); border-radius: 50%; animation: bounce 1.2s infinite; display: inline-block; }
  .typing span:nth-child(2) { animation-delay: 0.2s; }
  .typing span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
  .chat-input-area { padding: 12px 16px 16px; border-top: 1px solid rgba(201,168,76,0.12); display: flex; gap: 10px; align-items: flex-end; }
  .chat-input { flex: 1; background: var(--dark-3); border: 1px solid rgba(201,168,76,0.2); border-radius: 10px; padding: 10px 14px; font-family: var(--font-body); font-size: 14px; color: var(--cream); resize: none; outline: none; min-height: 42px; max-height: 100px; line-height: 1.4; transition: border-color 0.2s; }
  .chat-input::placeholder { color: var(--muted); }
  .chat-input:focus { border-color: rgba(201,168,76,0.5); }
  .send-btn { width: 42px; height: 42px; border-radius: 10px; background: var(--gold); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0; }
  .send-btn:hover { background: var(--gold-light); }
  .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .admin-panel { flex-direction: row; width: 100%; }
  .admin-sidebar { width: 220px; flex-shrink: 0; border-right: 1px solid rgba(201,168,76,0.12); padding: 20px 0; display: flex; flex-direction: column; gap: 2px; }
  .sidebar-item { padding: 9px 20px; font-size: 13px; cursor: pointer; color: var(--muted); display: flex; align-items: center; gap: 10px; transition: all 0.15s; border-left: 2px solid transparent; border: none; background: transparent; font-family: var(--font-body); width: 100%; text-align: left; border-left: 2px solid transparent; }
  .sidebar-item:hover { color: var(--cream); background: rgba(255,255,255,0.03); }
  .sidebar-item.active { color: var(--gold); border-left-color: var(--gold); background: rgba(201,168,76,0.06); }
  .admin-content { flex: 1; overflow-y: auto; padding: 28px 32px; }
  .section-title { font-family: var(--font-display); font-size: 24px; font-weight: 500; color: var(--gold); margin-bottom: 6px; }
  .section-sub { font-size: 13px; color: var(--muted); margin-bottom: 24px; }
  .requests-list { display: flex; flex-direction: column; gap: 10px; }
  .request-card { background: var(--dark-2); border: 1px solid rgba(201,168,76,0.12); border-radius: var(--radius); padding: 14px 16px; }
  .req-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .req-room { font-size: 12px; font-weight: 500; color: var(--gold); background: rgba(201,168,76,0.12); padding: 3px 10px; border-radius: 20px; }
  .req-time { font-size: 11px; color: var(--muted); }
  .req-text { font-size: 14px; color: var(--cream); margin-bottom: 10px; line-height: 1.5; }
  .req-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px; }
  .req-tag { font-size: 11px; padding: 2px 8px; border-radius: 20px; }
  .tag-room_service { background: rgba(59,109,17,0.2); color: #97C459; }
  .tag-maintenance { background: rgba(186,117,23,0.2); color: #EF9F27; }
  .tag-booking { background: rgba(24,95,165,0.2); color: #85B7EB; }
  .tag-other { background: rgba(100,100,100,0.2); color: #aaa; }
  .tag-urgent { background: rgba(226,75,74,0.15); color: #F09595; }
  .tag-high { background: rgba(186,117,23,0.15); color: #EF9F27; }
  .req-actions { display: flex; gap: 8px; }
  .req-btn { padding: 5px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; border: none; font-family: var(--font-body); transition: all 0.15s; }
  .btn-done { background: rgba(59,109,17,0.2); color: #97C459; }
  .btn-done:hover { background: rgba(59,109,17,0.35); }
  .btn-dismiss { background: var(--dark-3); color: var(--muted); }
  .btn-dismiss:hover { color: var(--cream); }
  .status-done { font-size: 11px; padding: 3px 10px; border-radius: 20px; background: rgba(59,109,17,0.2); color: #97C459; display: inline-block; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-group.full { grid-column: 1 / -1; }
  .form-label { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; }
  .form-input, .form-textarea { background: var(--dark-3); border: 1px solid rgba(201,168,76,0.2); border-radius: 8px; padding: 9px 12px; font-family: var(--font-body); font-size: 13px; color: var(--cream); outline: none; transition: border-color 0.2s; width: 100%; }
  .form-input:focus, .form-textarea:focus { border-color: rgba(201,168,76,0.5); }
  .form-textarea { resize: vertical; min-height: 80px; line-height: 1.5; }
  .save-btn { margin-top: 20px; padding: 10px 24px; background: var(--gold); border: none; border-radius: 8px; font-family: var(--font-body); font-size: 13px; font-weight: 500; color: var(--dark); cursor: pointer; transition: all 0.2s; }
  .save-btn:hover { background: var(--gold-light); }
  .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 28px; }
  .stat-card { background: var(--dark-2); border: 1px solid rgba(201,168,76,0.12); border-radius: var(--radius); padding: 16px; }
  .stat-num { font-family: var(--font-display); font-size: 32px; font-weight: 500; color: var(--gold); }
  .stat-label { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .empty-state { text-align: center; padding: 60px 20px; color: var(--muted); font-size: 14px; }
  .toast { position: fixed; bottom: 24px; right: 24px; background: var(--dark-3); border: 1px solid rgba(201,168,76,0.3); border-radius: 10px; padding: 12px 18px; font-size: 13px; color: var(--cream); opacity: 0; transition: opacity 0.3s; pointer-events: none; z-index: 100; }
  .toast.show { opacity: 1; }
  .privacy-note { font-size: 11px; color: var(--muted); text-align: center; padding: 6px 16px 0; }
`

const DEFAULT_INFO = {
  name: 'Grand Bellevue Hotel',
  checkin: '15:00 / 11:00',
  restaurant: 'Breakfast 7–10, Lunch 12–14, Dinner 18–22, Bar until midnight',
  services: 'Room service (7–23), Spa (9–20, book at reception), Pool (7–21), Gym (24h), Laundry (same-day if before 9am), Airport shuttle (book 24h ahead)',
  wifi: 'Wi-Fi: BellevueGuest, password: welcome2024. Parking CHF 25/night.',
  local: '5 min walk to lake. Recommend: Restaurant Strandhotel (lakeside), hiking trail starts behind hotel. Zurich 35 min by train.'
}

function getTime() {
  return new Date().toLocaleTimeString('en-CH', { hour: '2-digit', minute: '2-digit' })
}

function parseRequest(text) {
  const match = text.match(/BELLFLOW_REQUEST:(\{[^}]+\})/)
  if (!match) return null
  try { return JSON.parse(match[1]) } catch { return null }
}

function buildSystemPrompt(info) {
  return `You are the AI concierge assistant for ${info.name}. You help hotel guests with requests and questions through a chat interface accessed via QR code in their room.

HOTEL INFORMATION:
- Check-in: ${info.checkin.split('/')[0]?.trim()}, Check-out: ${info.checkin.split('/')[1]?.trim()}
- Food & Drink: ${info.restaurant}
- Services: ${info.services}
- Practical: ${info.wifi}
- Local area: ${info.local}

BEHAVIOUR:
- Be warm, concise, and professional. Max 3 sentences per reply.
- Always ask for the guest's room number if they make a service request and haven't provided it.
- When a guest makes a concrete request (room service, maintenance, extra items, booking), confirm it clearly, then output a JSON block at the very end of your message in this exact format:
  BELLFLOW_REQUEST:{"room":"101","type":"room_service","summary":"2 extra pillows and a bottle of still water","priority":"normal"}
- Types: room_service, maintenance, booking, information, other
- Priority: urgent (safety/broken), high (affecting comfort), normal (standard requests)
- For pure information questions, do NOT output any JSON.
- Never mention the JSON or that you are logging anything.`
}

export default function App() {
  const [activeTab, setActiveTab] = useState('guest')
  const [activeAdmin, setActiveAdmin] = useState('requests')
  const [messages, setMessages] = useState([])
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')
  const [toast, setToast] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const [info, setInfo] = useState(DEFAULT_INFO)
  const [savedInfo, setSavedInfo] = useState(DEFAULT_INFO)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const requestCounter = useRef(0)

  useEffect(() => {
    setSavedInfo(s => s)
    setMessages([{
      role: 'assistant',
      content: `Welcome to ${savedInfo.name}! I'm your AI concierge, available around the clock. How can I help you today?`,
      time: getTime()
    }])
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function showToast(msg) {
    setToast(msg)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 3000)
  }

  async function sendMessage() {
    if (!input.trim() || loading) return
    const userMsg = { role: 'user', content: input.trim(), time: getTime() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: buildSystemPrompt(savedInfo),
          messages: apiMessages
        })
      })
      const data = await resp.json()
      const raw = data.content?.[0]?.text || 'I apologize, I had trouble responding. Please try again.'
      const req = parseRequest(raw)
      const display = raw.replace(/BELLFLOW_REQUEST:\{[^}]+\}/g, '').trim()

      setMessages(prev => [...prev, { role: 'assistant', content: raw, display, time: getTime() }])

      if (req) {
        requestCounter.current += 1
        const entry = { id: requestCounter.current, ...req, time: getTime(), status: 'open' }
        setRequests(prev => [entry, ...prev])
        showToast(`New request logged — Room ${req.room || '?'}`)
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I\'m having trouble connecting. Please try again.', time: getTime() }])
    }
    setLoading(false)
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  function markDone(id) {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'done' } : r))
  }

  function dismissReq(id) {
    setRequests(prev => prev.filter(r => r.id !== id))
  }

  function saveInfo() {
    setSavedInfo({ ...info })
    setMessages([{
      role: 'assistant',
      content: `Welcome to ${info.name}! I'm your AI concierge, available around the clock. How can I help you today?`,
      time: getTime()
    }])
    showToast('Hotel info saved — concierge updated')
  }

  const open = requests.filter(r => r.status === 'open').length
  const done = requests.filter(r => r.status === 'done').length

  return (
    <>
      <style>{STYLES}</style>

      <nav className="nav">
        <div className="nav-brand">BellFlow</div>
        <div className="nav-tabs">
          <button className={`tab ${activeTab === 'guest' ? 'active' : ''}`} onClick={() => setActiveTab('guest')}>Guest View</button>
          <button className={`tab ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => setActiveTab('admin')}>Admin</button>
        </div>
      </nav>

      {/* GUEST CHAT */}
      <div className={`panel ${activeTab === 'guest' ? 'active' : ''}`}>
        <div className="chat-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="chat-header">
            <div className="hotel-name">{savedInfo.name}</div>
            <div className="hotel-sub">Concierge Assistant · 24 / 7</div>
          </div>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role === 'user' ? 'guest' : 'bot'}`}>
                <div className="msg-avatar">{m.role === 'user' ? 'G' : 'B'}</div>
                <div>
                  <div className="msg-bubble">{m.display || m.content}</div>
                  <div className="msg-time">{m.time}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="msg bot">
                <div className="msg-avatar">B</div>
                <div className="msg-bubble">
                  <div className="typing"><span /><span /><span /></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="privacy-note">Your conversation is processed to handle your request.</div>
          <div className="chat-input-area">
            <textarea
              ref={inputRef}
              className="chat-input"
              placeholder="Ask anything or make a request..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
            />
            <button className="send-btn" onClick={sendMessage} disabled={loading || !input.trim()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1a1814"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* ADMIN */}
      <div className={`panel admin-panel ${activeTab === 'admin' ? 'active' : ''}`}>
        <div className="admin-sidebar">
          {[['requests','📋','Requests'],['info','🏨','Hotel Info'],['stats','📊','Overview']].map(([key, icon, label]) => (
            <button key={key} className={`sidebar-item ${activeAdmin === key ? 'active' : ''}`} onClick={() => setActiveAdmin(key)}>
              <span>{icon}</span> {label}
            </button>
          ))}
        </div>

        <div className="admin-content">

          {activeAdmin === 'requests' && (
            <>
              <div className="section-title">Guest Requests</div>
              <div className="section-sub">Incoming requests from the AI concierge</div>
              <div className="requests-list">
                {requests.length === 0
                  ? <div className="empty-state">No requests yet. They'll appear here as guests chat.</div>
                  : requests.map(r => (
                    <div key={r.id} className="request-card">
                      <div className="req-header">
                        <span className="req-room">Room {r.room || '?'}</span>
                        <span className="req-time">{r.time}</span>
                      </div>
                      <div className="req-text">{r.summary}</div>
                      <div className="req-tags">
                        <span className={`req-tag tag-${r.type}`}>{r.type?.replace('_', ' ')}</span>
                        {r.priority === 'urgent' && <span className="req-tag tag-urgent">urgent</span>}
                        {r.priority === 'high' && <span className="req-tag tag-high">high priority</span>}
                      </div>
                      {r.status === 'done'
                        ? <span className="status-done">Completed</span>
                        : <div className="req-actions">
                            <button className="req-btn btn-done" onClick={() => markDone(r.id)}>Mark done</button>
                            <button className="req-btn btn-dismiss" onClick={() => dismissReq(r.id)}>Dismiss</button>
                          </div>
                      }
                    </div>
                  ))
                }
              </div>
            </>
          )}

          {activeAdmin === 'info' && (
            <>
              <div className="section-title">Hotel Information</div>
              <div className="section-sub">This information is fed directly to the AI concierge</div>
              <div className="info-grid">
                {[
                  ['name', 'Hotel Name', 'input'],
                  ['checkin', 'Check-in / Check-out', 'input'],
                  ['restaurant', 'Restaurant & Bar Hours', 'input', 'full'],
                  ['services', 'Services Available', 'textarea', 'full'],
                  ['wifi', 'Wi-Fi & Practicalities', 'input', 'full'],
                  ['local', 'Local Tips & Nearby', 'textarea', 'full'],
                ].map(([key, label, type, span]) => (
                  <div key={key} className={`form-group ${span || ''}`}>
                    <label className="form-label">{label}</label>
                    {type === 'textarea'
                      ? <textarea className="form-textarea" value={info[key]} onChange={e => setInfo(i => ({ ...i, [key]: e.target.value }))} />
                      : <input className="form-input" value={info[key]} onChange={e => setInfo(i => ({ ...i, [key]: e.target.value }))} />
                    }
                  </div>
                ))}
              </div>
              <button className="save-btn" onClick={saveInfo}>Save & Update Concierge</button>
            </>
          )}

          {activeAdmin === 'stats' && (
            <>
              <div className="section-title">Overview</div>
              <div className="section-sub">Activity summary for today</div>
              <div className="stats-grid">
                <div className="stat-card"><div className="stat-num">{requests.length}</div><div className="stat-label">Total requests</div></div>
                <div className="stat-card"><div className="stat-num">{open}</div><div className="stat-label">Open</div></div>
                <div className="stat-card"><div className="stat-num">{done}</div><div className="stat-label">Completed</div></div>
              </div>
            </>
          )}

        </div>
      </div>

      <div className={`toast ${toastVisible ? 'show' : ''}`}>{toast}</div>
    </>
  )
}
