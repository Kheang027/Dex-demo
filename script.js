var screens = ['s1', 's2', 's3', 's4'];
var current = 1;

function go(n) {
  document.getElementById(screens[current - 1]).classList.remove('active');
  document.getElementById(screens[n - 1]).classList.add('active');
  current = n;
  document.querySelectorAll('.dot').forEach(function(d, i) {
    d.classList.toggle('active', i === n - 1);
  });
  if (n === 3) initBars();
}

function connectApp(app) {
  var btn = document.getElementById(app + '-btn');
  var card = document.getElementById(app + '-card');
  btn.textContent = '✓ Connected';
  btn.style.background = '#16a34a';
  card.classList.add('connected');
}

var responses = {
  revenue: {
    q: 'Oscar: "What was our revenue last month?"',
    label: 'Revenue — April 2026',
    num: '$84,320',
    growth: '▲ +12.4% vs Mar',
    source: 'Xero',
    ragDesc: 'April revenue fetched from Xero API',
    mcpDesc: 'Growth calculated: +12.4% vs March'
  },
  orders: {
    q: 'Nam: "How many orders did we process?"',
    label: 'Orders — April 2026',
    num: '1,204',
    growth: '▲ +8.2% vs Mar',
    source: 'Shopify',
    ragDesc: 'April orders fetched from Shopify API',
    mcpDesc: 'Avg order value calculated: $70.03'
  },
  cash: {
    q: 'Oscar: "What is our current cash position?"',
    label: 'Cash position — today',
    num: '$142,800',
    growth: '18 days runway',
    source: 'Xero',
    ragDesc: 'Cash balance fetched from Xero API',
    mcpDesc: 'Runway days computed: 18 days'
  }
};

function resetPipeline() {
  for (var i = 1; i <= 5; i++) {
    var el = document.getElementById('pstep-' + i);
    el.classList.remove('ps-active', 'ps-done');
  }
}

function animatePipeline(r, cb) {
  resetPipeline();
  var descs = [
    'Speech recognised → text captured',
    'Intent detected → query ' + r.source,
    r.ragDesc,
    r.mcpDesc,
    'Response delivered in Teams'
  ];
  var step = 1;
  function next() {
    if (step > 5) { if (cb) cb(); return; }
    var el = document.getElementById('pstep-' + step);
    el.classList.add('ps-active');
    var desc = el.querySelector('.ps-desc');
    if (desc) desc.textContent = descs[step - 1];
    if (step > 1) {
      var prev = document.getElementById('pstep-' + (step - 1));
      prev.classList.remove('ps-active');
      prev.classList.add('ps-done');
    }
    step++;
    setTimeout(next, step === 6 ? 500 : 400);
  }
  next();
}

function askDex() {
  var inputEl = document.getElementById('ask-input');
  var input = inputEl.value.toLowerCase();
  var r = responses.revenue;
  if (input.indexOf('order') !== -1 || input.indexOf('shopify') !== -1) r = responses.orders;
  else if (input.indexOf('cash') !== -1) r = responses.cash;

  document.getElementById('dex-status').textContent = '● Thinking...';
  document.getElementById('question-display').textContent = input
    ? 'You: "' + inputEl.value + '"'
    : r.q;
  document.getElementById('dex-response').innerHTML =
    '<div style="color:#7fa8cc;font-size:11px;padding:8px 0;font-family:monospace">Processing...</div>';
  document.getElementById('response-box').style.opacity = '0.4';
  inputEl.value = '';

  animatePipeline(r, function() {
    document.getElementById('dex-status').textContent = '● Responding...';
    document.getElementById('response-box').style.opacity = '1';
    document.getElementById('dex-response').innerHTML =
      '<div class="metric-label">' + r.label + '</div>' +
      '<div><span class="big-num">' + r.num + '</span><span class="growth-tag">' + r.growth + '</span></div>' +
      '<div class="mini-bars" id="bars"></div>';
    initBars();
    setTimeout(function() {
      document.getElementById('dex-status').textContent = '● Listening...';
      var last = document.getElementById('pstep-5');
      if (last) { last.classList.remove('ps-active'); last.classList.add('ps-done'); }
    }, 1500);
  });
}

var barData = [
  { h: 55, m: 'Dec' },
  { h: 62, m: 'Jan' },
  { h: 70, m: 'Feb' },
  { h: 68, m: 'Mar' },
  { h: 84, m: 'Apr' }
];

function initBars() {
  var el = document.getElementById('bars');
  if (!el) return;
  el.innerHTML = barData.map(function(b, i) {
    return '<div class="bar-wrap"><div class="bar" style="height:' + b.h + '%;background:' +
      (i === 4 ? '#3b82f6' : '#2a4a70') + '"></div><div class="bar-label">' + b.m + '</div></div>';
  }).join('');
}

document.addEventListener('DOMContentLoaded', function() {
  var input = document.getElementById('ask-input');
  if (input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') askDex();
    });
  }
  initBars();
});
