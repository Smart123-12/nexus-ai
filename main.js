/* ============================================================
   NEXUS AI — Global JavaScript Utilities
   API: https://nexus-ai-backend-lb6o.onrender.com
   ============================================================ */

// ── Backend API URL ──
const API_BASE = 'https://nexus-ai-backend-lb6o.onrender.com';

// ── Real Gemini AI Chat (with fallback to demo) ──
async function sendToGemini(message, history=[]) {
  try {
    const res = await fetch(API_BASE + '/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history })
    });
    const data = await res.json();
    return data.reply || data.error;
  } catch(e) {
    return null; // fallback to local demo response
  }
}

// ── Real Contact Form Submission ──
async function submitContact(formData) {
  try {
    const res = await fetch(API_BASE + '/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    return await res.json();
  } catch(e) {
    return { success: false, error: e.message };
  }
}

// ── Real File Upload ──
async function uploadFile(file) {
  try {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch(API_BASE + '/api/upload', { method: 'POST', body: fd });
    return await res.json();
  } catch(e) {
    return { success: false, error: e.message };
  }
}

// ── Real AI Analysis ──
async function analyzeWithAI(uploadId, businessData) {
  try {
    const res = await fetch(API_BASE + '/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uploadId, businessData })
    });
    return await res.json();
  } catch(e) {
    return { success: false, error: e.message };
  }
}

// ── Generate Report via backend ──
async function generateReportAPI(type, businessName, industry) {
  try {
    const res = await fetch(API_BASE + '/api/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, businessName, industry })
    });
    return await res.json();
  } catch(e) {
    return { success: false, error: e.message };
  }
}

// ── Navbar scroll effect ──
(function(){
  const nb = document.querySelector('.navbar');
  if(!nb) return;
  window.addEventListener('scroll',()=>{
    nb.classList.toggle('scrolled', window.scrollY > 20);
  });
})();

// ── Hamburger mobile menu ──
(function(){
  const btn = document.querySelector('.hamburger');
  const links = document.querySelector('.nav-links');
  if(!btn||!links) return;
  btn.addEventListener('click',()=>{
    links.style.display = links.style.display==='flex' ? 'none' : 'flex';
    links.style.flexDirection = 'column';
    links.style.position = 'absolute';
    links.style.top = '68px';
    links.style.left = '0';
    links.style.right = '0';
    links.style.background = 'rgba(255,255,255,0.97)';
    links.style.padding = '1rem 2rem';
    links.style.borderBottom = '1px solid var(--border)';
  });
})();

// ── Sidebar mobile toggle ──
function toggleSidebar(){
  const sb = document.querySelector('.sidebar');
  if(sb) sb.classList.toggle('open');
}

// ── Toast notifications ──
function showToast(msg, type='info', duration=3500){
  let container = document.querySelector('.toast-container');
  if(!container){
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = {success:'✅',error:'❌',info:'ℹ️',warning:'⚠️'};
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type]||'ℹ️'}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(()=>{
    toast.style.opacity='0'; toast.style.transform='translateX(20px)';
    setTimeout(()=>toast.remove(), 350);
  }, duration);
}

// ── Animate numbers (count-up) ──
function animateNumber(el, target, duration=1200, prefix='', suffix=''){
  let start=0, startTime=null;
  const step = timestamp=>{
    if(!startTime) startTime=timestamp;
    const progress = Math.min((timestamp-startTime)/duration,1);
    const eased = 1-Math.pow(1-progress,3);
    const val = Math.round(eased*target);
    el.textContent = prefix + val.toLocaleString() + suffix;
    if(progress<1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ── Observe elements for count-up on scroll ──
function initCountUp(){
  document.querySelectorAll('[data-count]').forEach(el=>{
    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix||'';
    const suffix = el.dataset.suffix||'';
    const obs = new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting){
        animateNumber(el,target,1400,prefix,suffix);
        obs.disconnect();
      }
    },{threshold:0.5});
    obs.observe(el);
  });
}
document.addEventListener('DOMContentLoaded', initCountUp);

// ── Active nav link detection ──
(function(){
  const links = document.querySelectorAll('.nav-links a, .sidebar-nav a');
  const page = window.location.pathname.split('/').pop()||'index.html';
  links.forEach(a=>{
    const href = a.getAttribute('href');
    if(href && (href===page || href===('./'+page))) a.classList.add('active');
  });
})();

// ── Tab switching ──
function initTabs(){
  document.querySelectorAll('.tab-nav').forEach(nav=>{
    nav.querySelectorAll('.tab-btn').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const target = btn.dataset.tab;
        nav.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        const parent = nav.closest('[data-tabs]') || document;
        parent.querySelectorAll('.tab-content').forEach(c=>{
          c.classList.toggle('active', c.dataset.tabContent===target);
        });
      });
    });
  });
}
document.addEventListener('DOMContentLoaded', initTabs);

// ── File upload drag & drop ──
function initUploadZone(zoneId, inputId, onFiles){
  const zone = document.getElementById(zoneId);
  const input = document.getElementById(inputId);
  if(!zone) return;
  ['dragenter','dragover'].forEach(e=>zone.addEventListener(e,ev=>{ev.preventDefault();zone.classList.add('dragover');}));
  ['dragleave','drop'].forEach(e=>zone.addEventListener(e,ev=>{ev.preventDefault();zone.classList.remove('dragover');}));
  zone.addEventListener('drop',ev=>{ if(onFiles) onFiles(ev.dataTransfer.files); });
  zone.addEventListener('click',()=>input&&input.click());
  if(input) input.addEventListener('change',()=>{ if(onFiles) onFiles(input.files); });
}

// ── Demo data ──
const DEMO = {
  revenue: [42000,51000,47000,63000,58000,72000,68000,81000,75000,92000,88000,105000],
  expenses:[28000,31000,27000,38000,34000,41000,39000,44000,40000,49000,47000,55000],
  months:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  kpis:{
    revenue:'₹1.05M', revenue_change:'+18.4%', revenue_up:true,
    customers:4289, customers_change:'+12.1%', customers_up:true,
    conversions:'6.8%', conversions_change:'+0.9%', conversions_up:true,
    churn:'2.1%', churn_change:'-0.4%', churn_up:false
  },
  campaigns:[
    {name:'Google Ads',spend:28000,clicks:14200,ctr:4.2,cpc:1.97,conversions:482,roas:6.8},
    {name:'Facebook Ads',spend:19000,clicks:22100,ctr:2.8,cpc:0.86,conversions:311,roas:4.9},
    {name:'Instagram Ads',spend:12000,clicks:18400,ctr:3.5,cpc:0.65,conversions:224,roas:5.3},
    {name:'Bing Ads',spend:6500,clicks:5900,ctr:3.1,cpc:1.10,conversions:98,roas:3.2},
  ],
  products:[
    {name:'Pro Plan',revenue:42000,units:210,growth:'+22%'},
    {name:'Starter Plan',revenue:18000,units:720,growth:'+8%'},
    {name:'Enterprise',revenue:35000,units:14,growth:'+41%'},
    {name:'Add-ons',revenue:8500,units:380,growth:'+5%'},
  ],
  aiInsights:[
    {icon:'📈',title:'Revenue Surge Detected',desc:'Q4 revenue up 18.4% — driven by Enterprise upsells and Google Ads performance.', type:'success'},
    {icon:'⚠️',title:'Churn Risk in Starter',desc:'Starter plan churn increased 0.4% this month. Consider a re-engagement campaign.',type:'warning'},
    {icon:'💡',title:'Opportunity: Instagram ROI',desc:'Instagram Ads show highest CPC efficiency ($0.65). Recommend 30% budget reallocation.',type:'info'},
    {icon:'🎯',title:'Enterprise Growth Trend',desc:'Enterprise segment grew 41% — ideal to launch a premium tier or dedicated CSM.',type:'success'},
  ]
};

// ── Chart defaults ──
if(window.Chart){
  Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";
  Chart.defaults.color = '#8DA9C4';
  Chart.defaults.plugins.legend.labels.boxWidth = 10;
  Chart.defaults.plugins.legend.labels.padding = 16;
}

// ── Helper: format currency ──
function fmtCurrency(n){ return '₹'+n.toLocaleString(); }
function fmtPct(n){ return n.toFixed(1)+'%'; }

// ── Page fade-in ──
document.addEventListener('DOMContentLoaded',()=>{
  document.body.classList.add('page-fade');
});
