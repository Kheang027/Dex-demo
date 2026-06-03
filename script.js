var cur = 1;

function go(n) {
  document.getElementById('p' + cur).classList.remove('active');
  document.getElementById('p' + n).classList.add('active');
  cur = n;
  window.scrollTo(0, 0);

  var ndbar = document.getElementById('ndbar');
  var nds   = ndbar.querySelectorAll('.nd');

  /* On app pages (3–5), hide the sign-up dot so it can't be navigated back to */
  var inApp = n >= 3;
  nds.forEach(function(d, i) {
    d.style.display = (inApp && i === 1) ? 'none' : '';
    d.classList.toggle('on', i === n - 1);
  });

  if (n === 4) {
    ndbar.classList.add('hide');
    var mds = document.querySelectorAll('.m-ndbar .nd');
    mds.forEach(function(d, i) {
      d.style.display = (i === 1) ? 'none' : '';
      d.classList.toggle('on', i === n - 1);
    });
    startTimer();
  } else {
    ndbar.classList.remove('hide');
    stopTimer();
  }
}

/* ─── Integration selector ─── */
var selectedSources = [];

function toggleSource(id) {
  var opt  = document.getElementById('ms-' + id);
  var tick = document.getElementById('tick-' + id);
  var idx  = selectedSources.indexOf(id);

  if (idx === -1) {
    selectedSources.push(id);
    opt.classList.add('selected');
    tick.textContent = '✓';
  } else {
    selectedSources.splice(idx, 1);
    opt.classList.remove('selected');
    tick.textContent = '';
  }

  var hint = document.getElementById('ms-hint');
  var btn  = document.getElementById('start-meet-btn');

  if (selectedSources.length === 0) {
    hint.textContent  = 'Select at least one data source before starting your meeting.';
    hint.style.color  = '';
    if (btn) {
      btn.style.opacity      = '.45';
      btn.style.pointerEvents = 'none';
    }
  } else {
    var labels = selectedSources.map(function(s) {
      return s.charAt(0).toUpperCase() + s.slice(1);
    });
    hint.textContent  = '✓ Dex will query ' + labels.join(' + ') + ' live during your meeting.';
    hint.style.color  = 'var(--green)';
    if (btn) {
      btn.style.opacity      = '1';
      btn.style.pointerEvents = '';
    }
  }
}

/* ─── Meeting timer ─── */
var timerInterval = null;
var timerSecs     = 0;

function startTimer() {
  timerSecs = 0;
  clearInterval(timerInterval);
  timerInterval = setInterval(function() {
    timerSecs++;
    var h = Math.floor(timerSecs / 3600);
    var m = Math.floor((timerSecs % 3600) / 60);
    var s = timerSecs % 60;
    document.getElementById('meet-timer').textContent =
      pad(h) + ':' + pad(m) + ':' + pad(s);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}

/* ─── AI responses ─── */
var RESP = {
  revenue: {
    q:      'Oscar: "What was our revenue last month?"',
    hdr:    '⚡ Dex — Live from Xero',
    label:  'Revenue — April 2026',
    num:    '$84,320',
    growth: '▲ +12.4% vs Mar',
    d1: 'Speech captured → text transcribed',
    d2: 'Intent: revenue query → route to Xero',
    d3: 'April revenue fetched from Xero API',
    d4: 'Growth calculated: +12.4% vs March',
    d5: 'Response delivered in Teams'
  },
  orders: {
    q:      'Nam: "How many orders did we process?"',
    hdr:    '⚡ Dex — Live from Shopify',
    label:  'Orders — April 2026',
    num:    '1,204',
    growth: '▲ +8.2% vs Mar',
    d1: 'Speech captured → text transcribed',
    d2: 'Intent: order count → route to Shopify',
    d3: 'April orders fetched from Shopify API',
    d4: 'Avg order value computed: $70.03',
    d5: 'Response delivered in Teams'
  },
  cash: {
    q:      'Oscar: "What is our current cash position?"',
    hdr:    '⚡ Dex — Live from Xero',
    label:  'Cash position — today',
    num:    '$142,800',
    growth: '18 days runway',
    d1: 'Speech captured → text transcribed',
    d2: 'Intent: cash position → route to Xero',
    d3: 'Bank balance fetched from Xero API',
    d4: 'Runway days computed: 18 days',
    d5: 'Response delivered in Teams'
  }
};

function resetPipeline() {
  for (var i = 1; i <= 5; i++) {
    document.getElementById('ps' + i).classList.remove('ps-active', 'ps-done');
  }
}

function animatePipeline(r, cb) {
  resetPipeline();
  var descs = [r.d1, r.d2, r.d3, r.d4, r.d5];
  var step  = 1;

  function next() {
    if (step > 5) {
      if (cb) cb();
      return;
    }
    var el = document.getElementById('ps' + step);
    el.classList.add('ps-active');
    document.getElementById('pd' + step).textContent = descs[step - 1];

    if (step > 1) {
      var prev = document.getElementById('ps' + (step - 1));
      prev.classList.remove('ps-active');
      prev.classList.add('ps-done');
    }
    step++;
    setTimeout(next, 420);
  }

  next();
}

function askDex() {
  var inp = document.getElementById('ask-inp');
  var val = inp.value.toLowerCase().trim();
  var r   = RESP.revenue;

  if (val.indexOf('order') !== -1 || val.indexOf('shopify') !== -1) {
    r = RESP.orders;
  } else if (val.indexOf('cash') !== -1 || val.indexOf('runway') !== -1) {
    r = RESP.cash;
  }

  var displayQ = val ? 'You: "' + inp.value + '"' : r.q;

  document.getElementById('dex-st').textContent     = '● Thinking...';
  document.getElementById('dex-status').textContent  = '● Thinking...';
  document.getElementById('q-disp').textContent      = displayQ;
  document.getElementById('resp-box').style.opacity  = '0.4';
  document.getElementById('resp-body').innerHTML     =
    '<div style="color:#4b6a8a;font-size:13px;padding:4px 0;font-family:monospace">Processing your question...</div>';
  inp.value = '';

  animatePipeline(r, function() {
    document.getElementById('dex-st').textContent    = '● Responding...';
    document.getElementById('dex-status').textContent = '● Responding...';
    document.getElementById('resp-box').style.opacity = '1';
    document.querySelector('.resp-box-hdr').textContent = r.hdr;

    document.getElementById('resp-body').innerHTML =
      '<div class="r-metric">' + r.label + '</div>' +
      '<div style="display:flex;align-items:baseline;flex-wrap:wrap;gap:8px">' +
        '<span class="r-num">' + r.num + '</span>' +
        '<span class="r-gr">'  + r.growth + '</span>' +
      '</div>' +
      '<div class="mini-bars" id="bars"></div>';

    initBars();

    var last = document.getElementById('ps5');
    if (last) {
      last.classList.remove('ps-active');
      last.classList.add('ps-done');
    }

    setTimeout(function() {
      document.getElementById('dex-st').textContent    = '● Listening...';
      document.getElementById('dex-status').textContent = '● Listening...';
    }, 1800);
  });
}

/* ─── Mini bar chart ─── */
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
    var bg = i === 4 ? '#3b82f6' : '#1a3d60';
    return '<div class="b-wrap">' +
      '<div class="bar" style="height:' + b.h + '%;background:' + bg + ';transition:height .5s ease"></div>' +
      '<div class="b-lbl">' + b.m + '</div>' +
    '</div>';
  }).join('');
}

document.addEventListener('DOMContentLoaded', function() {
  var inp = document.getElementById('ask-inp');
  if (inp) {
    inp.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') askDex();
    });
  }
});
