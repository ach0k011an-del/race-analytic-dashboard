# Interactive Race Dashboard

1. Clone or download this repo.
2. Open `index.html` in any browser **or** push to GitHub Pages (free hosting).
3. Drag-and-drop your own CSV (must contain at least columns: `LapTime,Speed,Throttle`).
   - Add extra columns (gear, brake, tire temps, fuel, wing angle, etc.) – they auto-appear.
4. Use the **Session** dropdown to compare stints or set-up changes.
5. Hover / zoom on any Plotly graph; hit **Reset Zoom** to return.

## CSV format hint
```csv
Session,Lap,Speed,Throttle,LapTime,TireFL,TireFR,DiffPreload,WingAngle
S1,1,180,95,92.3,22.1,22.3,60,8
...
