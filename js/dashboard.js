/* global Plotly */
let rawData = [];           // all rows
let filtered = [];          // rows after session filter

const sessionSelect = document.getElementById('sessionSelect');
const csvInput        = document.getElementById('csvFile');
const resetBtn        = document.getElementById('resetZoom');

csvInput.addEventListener('change', handleFile, false);
sessionSelect.addEventListener('change', applyFilter);
resetBtn.addEventListener('click', () => Plotly.relayout('lapTimePlot',{xaxis:{autorange:true},yaxis:{autorange:true}}));

/* -------- file drag-drop ---------- */
window.addEventListener('dragover', e => e.preventDefault());
window.addEventListener('drop', e => {
  e.preventDefault();
  const f = e.dataTransfer.files[0];
  if (f && f.name.endsWith('.csv')) parseCSV(f);
});

function handleFile(e){
  parseCSV(e.target.files[0]);
}

function parseCSV(file){
  const reader = new FileReader();
  reader.onload = () => {
    rawData = csvToObjs(reader.result);
    populateSessions();
    applyFilter();
  };
  reader.readAsText(file);
}

function csvToObjs(text){
  const [head,...rows] = text.trim().split('\n').map(r=>r.split(',').map(v=>v.trim()));
  return rows.map(r=>Object.fromEntries(head.map((h,i)=>[h, isNaN(r[i])? r[i]: +r[i]])));
}

function populateSessions(){
  const sess = [...new Set(rawData.map(r=>r.Session||'S1'))].sort();
  sessionSelect.innerHTML='<option>All</option>'+sess.map(s=>`<option>${s}</option>`).join('');
}

function applyFilter(){
  const sel = sessionSelect.value;
  filtered = sel==='All' ? rawData : rawData.filter(r=>(r.Session||'S1')===sel);
  drawCharts();
}

function drawCharts(){
  const lap = {x:[],y:[],name:'Lap Time',type:'scatter',mode:'lines+markers'};
  const spd = {x:[],y:[],name:'Speed (km/h)',yaxis:'y2',type:'scatter',mode:'lines',line:{color:'#00ff99'}};
  const thr = {x:[],y:[],name:'Throttle %',yaxis:'y3',type:'scatter',mode:'lines',line:{color:'#ff9900'}};

  filtered.forEach((r,i)=>{
    lap.x.push(i+1); lap.y.push(r.LapTime);
    spd.x.push(i+1); spd.y.push(r.Speed);
    thr.x.push(i+1); thr.y.push(r.Throttle);
  });

  Plotly.newPlot('lapTimePlot',[lap],{
    title:'Lap Times over Run',
    xaxis:{title:'Lap #'},
    yaxis:{title:'Time (s)'},
    hovermode:'x unified',
    template:'plotly_dark'
  },{responsive:true});

  Plotly.newPlot('speedPlot',[spd],{
    title:'Speed Trace',
    xaxis:{title:'Lap #'},
    yaxis:{title:'km/h'},
    template:'plotly_dark'
  },{responsive:true});

  Plotly.newPlot('throttlePlot',[thr],{
    title:'Throttle Position',
    xaxis:{title:'Lap #'},
    yaxis:{title:'%'},
    template:'plotly_dark'
  },{responsive:true});

  /* ---- car set-up table ---- */
  const setup = filtered.length ? filtered[0] : {};
  const ignore = ['LapTime','Speed','Throttle','Session'];
  const rows = Object.keys(setup).filter(k=>!ignore.includes(k)).map(k=>`<tr><td>${k}</td><td>${setup[k]}</td></tr>`).join('');
  document.getElementById('setupTable').innerHTML = `<h4>Car Set-up</h4><table style="width:100%;border-collapse:collapse;"><thead><tr><th>Parameter</th><th>Value</th></tr></thead><tbody>${rows}</tbody></table>`;
}
