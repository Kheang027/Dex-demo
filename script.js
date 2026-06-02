const screens=['s1','s2','s3','s4'];
let current=1;

function go(n){
  document.getElementById(screens[current-1]).classList.remove('active');
  document.getElementById(screens[n-1]).classList.add('active');
  current=n;
  document.querySelectorAll('.dot').forEach((d,i)=>d.classList.toggle('active',i===n-1));
  if(n===3)initBars();
}

function connectApp(app){
  const btn=document.getElementById(app+'-btn');
  const card=document.getElementById(app+'-card');
  btn.textContent='✓ Connected';
  btn.style.background='#16a34a';
  card.classList.add('connected');
}

const responses={
  revenue:{q:'Oscar: "What was our revenue last month?"',label:'Revenue — April 2026',num:'$84,320',growth:'▲ +12.4% vs Mar',source:'Xero',mcpDesc:'Growth calculated: +12.4% vs March',ragDesc:'April revenue fetched from Xero API'},
  orders:{q:'Nam: "How many orders did we process?"',label:'Orders — April 2026',num:'1,204',growth:'▲ +8.2% vs Mar',source:'Shopify',mcpDesc:'Avg order value calculated: $70.03',ragDesc:'April orders fetched from Shopify API'},
  cash:{q:'Oscar: "What is our current cash position?"',label:'Cash position — today',num:'$142,800',growth:'18 days runway',source:'Xero',mcpDesc:'Runway days computed: 18 days',ragDesc:'Cash balance fetched from Xero API'},
};

const pipelineLabels=['ASR','LLM','RAG','MCP','Reply'];

function resetPipeline(){
  for(let i=1;i<=5;i++){
    const el=document.getElementById('pstep-'+i);
    el.classList.remove('active','done');
  }
}

function animatePipeline(r,cb){
  resetPipeline();
  const descs=[
    'Speech recognised → text captured',
    'Intent detected → query '+r.source,
    r.ragDesc,
    r.mcpDesc,
    'Response delivered in Teams'
  ];
  let step=1;
  function next(){
    if(step>5){if(cb)cb();return;}
    document.getElementById('pstep-'+step).classList.add('active');
    if(step>1)document.getElementById('pstep-'+(step-1)).classList.replace('active','done');
    const desc=document.querySelector('#pstep-'+step+' .step-desc');
    if(desc)desc.textContent=descs[step-1];
    step++;
    setTimeout(next,step===5?600:400);
  }
  next();
}

function askDex(){
  const inputEl=document.getElementById('ask-input');
  const input=inputEl.value.toLowerCase();
  let r=responses.revenue;
  if(input.includes('order')||input.includes('shopify'))r=responses.orders;
  else if(input.includes('cash'))r=responses.cash;

  document.getElementById('dex-status').textContent='● Thinking...';
  document.getElementById('question-display').textContent=input?'You: "'+inputEl.value+'"':r.q;
  document.getElementById('dex-response').innerHTML='<div style="color:#7fa8cc;font-size:11px;padding:8px 0;font-family:var(--mono)">Processing...</div>';
  document.getElementById('response-box').style.opacity='.4';
  inputEl.value='';

  animatePipeline(r,()=>{
    document.getElementById('dex-status').textContent='● Responding...';
    document.getElementById('response-box').style.opacity='1';
    document.getElementById('dex-response').innerHTML=
      '<div class="metric-label">'+r.label+'</div>'+
      '<div><span class="big-num">'+r.num+'</span><span class="growth">'+r.growth+'</span></div>'+
      '<div class="mini-bars" id="bars"></div>';
    initBars();
    setTimeout(()=>{document.getElementById('dex-status').textContent='● Listening...';},2000);
  });
}

const barData=[{h:55,m:'Dec'},{h:62,m:'Jan'},{h:70,m:'Feb'},{h:68,m:'Mar'},{h:84,m:'Apr'}];
function initBars(){
  const el=document.getElementById('bars');
  if(!el)return;
  el.innerHTML=barData.map((b,i)=>`<div class="bar-wrap"><div class="bar" style="height:${b.h}%;background:${i===4?'#3b82f6':'#2a4a70'}"></div><div class="bar-label">${b.m}</div></div>`).join('');
}

document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('ask-input').addEventListener('keydown',e=>{if(e.key==='Enter')askDex();});
  initBars();
});

</body>
</html>
