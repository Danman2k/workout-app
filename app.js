// Vanilla JS PWA with per-set checkboxes and inputs.
const PROGRAM = [
  {
    id: "D1",
    title: "Day 1 — Upper (Push)",
    focus: "Chest/Shoulders/Triceps",
    exercises: [
      { name: "Bench Press (BB/DB)", sets: 4, reps: "6–8", notes: "Heavy, focus on form" },
      { name: "Overhead Press (BB/DB)", sets: 3, reps: "8–10", notes: "Brace core" },
      { name: "Incline DB Press", sets: 3, reps: "8–10", notes: "Slow eccentric" },
      { name: "DB Lateral Raise", sets: 3, reps: "12–15", notes: "Light, strict form" },
      { name: "Triceps Rope Pushdown", sets: 3, reps: "10–12", notes: "Controlled" },
    ],
  },
  {
    id: "D2",
    title: "Day 2 — Lower (Glute Focus)",
    focus: "Glutes/Hams",
    exercises: [
      { name: "Barbell Hip Thrust", sets: 4, reps: "8–10", notes: "Squeeze at top" },
      { name: "Bulgarian Split Squat", sets: 3, reps: "8–10/leg", notes: "Hold DBs" },
      { name: "Romanian Deadlift", sets: 3, reps: "8–10", notes: "Long hamstring stretch" },
      { name: "Cable Kickback", sets: 3, reps: "12–15", notes: "Slow, controlled" },
      { name: "Walking Lunge", sets: 2, reps: "12 steps/leg", notes: "Finisher" },
    ],
  },
  {
    id: "D3",
    title: "Day 3 — Upper (Pull)",
    focus: "Back/Biceps",
    exercises: [
      { name: "Pull-ups or Assisted", sets: 4, reps: "6–8", notes: "Full range" },
      { name: "Row (BB/DB)", sets: 4, reps: "8–10", notes: "Flat back" },
      { name: "Lat Pulldown (wide)", sets: 3, reps: "10–12", notes: "Control" },
      { name: "Face Pull", sets: 3, reps: "12–15", notes: "High rope pull" },
      { name: "DB Biceps Curl", sets: 3, reps: "10–12", notes: "Slow negatives" },
    ],
  },
  {
    id: "D4",
    title: "Day 4 — Lower (Strength)",
    focus: "Squat/Deadlift/Glutes",
    exercises: [
      { name: "Back Squat", sets: 4, reps: "5–6", notes: "Heavy" },
      { name: "Deadlift", sets: 3, reps: "4–6", notes: "Full rest" },
      { name: "Glute-Bias Leg Press", sets: 3, reps: "8–10", notes: "Feet high/wide" },
      { name: "Step-up (DB)", sets: 3, reps: "10/leg", notes: "Control" },
      { name: "Standing Calf Raise", sets: 3, reps: "12–15", notes: "Pause top/bottom" },
    ],
  },
];

function isoWeekNumber(date = new Date()) {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7; // Mon=0
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const weekNo =
    1 +
    Math.round(
      ((target.getTime() - firstThursday.getTime()) / 86400000 - 3 + ((firstThursday.getDay() + 6) % 7)) / 7
    );
  return weekNo;
}

function kWeek(w) { return `rr-strength-vanilla::week-${w}`; }
function kNotes(w) { return `rr-strength-vanilla::notes-${w}`; }

let currentDay = 0;
let currentWeek = isoWeekNumber();

const $ = (sel) => document.querySelector(sel);

function loadState() { try { return JSON.parse(localStorage.getItem(kWeek(currentWeek))||\"{}\"); } catch { return {}; } }
function saveState(s) { try { localStorage.setItem(kWeek(currentWeek), JSON.stringify(s)); } catch {} }

function render() {
  $(\"#weekLabel\").textContent = `Week ${currentWeek}`;
  document.querySelectorAll(\".tab\").forEach((t, i) => t.classList.toggle(\"active\", i === currentDay));

  const day = PROGRAM[currentDay];
  $(\"#dayTitle\").textContent = day.title;
  $(\"#dayFocus\").textContent = `Focus: ${day.focus}`;

  const container = $(\"#exercises\");
  container.innerHTML = \"\";

  const state = loadState();
  day.exercises.forEach((ex, exIdx) => {
    const exState = (state[day.id] && state[day.id][exIdx]) || { sets: {}, w: \"\", r: \"\", note: \"\" };

    const card = document.createElement(\"div\"); card.className = \"card\";
    const head = document.createElement(\"div\"); head.className = \"ex-head\";
    const left = document.createElement(\"div\");
    const nm = document.createElement(\"div\"); nm.className = \"ex-name\"; nm.textContent = ex.name;
    const sub = document.createElement(\"div\"); sub.className = \"ex-sub\"; sub.textContent = `${ex.reps} • ${ex.notes}`;
    left.appendChild(nm); left.appendChild(sub);
    const right = document.createElement(\"div\"); right.className = \"ex-sub\"; right.textContent = `${Object.values(exState.sets).filter(Boolean).length}/${ex.sets} sets`;
    head.appendChild(left); head.appendChild(right); card.appendChild(head);

    const setRow = document.createElement(\"div\"); setRow.className = \"set-row\";
    Array.from({ length: ex.sets }).forEach((_, sIdx) => {
      const b = document.createElement(\"button\"); b.type = \"button\";
      b.className = \"check\" + (exState.sets[sIdx] ? \" done\" : \"\"); b.textContent = exState.sets[sIdx] ? \"✓\" : \"\";
      b.addEventListener(\"click\", () => { const st = loadState(); st[day.id] = st[day.id] || {}; st[day.id][exIdx] = st[day.id][exIdx] || { sets: {}, w: \"\", r: \"\", note: \"\" }; st[day.id][exIdx].sets[sIdx] = !st[day.id][exIdx].sets[sIdx]; saveState(st); render(); });
      setRow.appendChild(b);
    });
    card.appendChild(setRow);

    const grid = document.createElement(\"div\"); grid.className = \"grid3\";
    const w = document.createElement(\"input\"); w.className = \"input\"; w.placeholder = \"Weight\"; w.inputMode = \"decimal\"; w.value = exState.w || \"\"; w.addEventListener(\"input\", (e)=>{ const st=loadState(); st[day.id]=st[day.id]||{}; st[day.id][exIdx]=st[day.id][exIdx]||{sets:{},w:\"\",r:\"\",note:\"\"}; st[day.id][exIdx].w=e.target.value; saveState(st); });\n    const r = document.createElement(\"input\"); r.className = \"input\"; r.placeholder = \"Reps\"; r.inputMode = \"numeric\"; r.value = exState.r || \"\"; r.addEventListener(\"input\", (e)=>{ const st=loadState(); st[day.id]=st[day.id]||{}; st[day.id][exIdx]=st[day.id][exIdx]||{sets:{},w:\"\",r:\"\",note:\"\"}; st[day.id][exIdx].r=e.target.value; saveState(st); });\n    const n = document.createElement(\"input\"); n.className = \"input\"; n.placeholder = \"RPE/Notes\"; n.value = exState.note || \"\"; n.addEventListener(\"input\", (e)=>{ const st=loadState(); st[day.id]=st[day.id]||{}; st[day.id][exIdx]=st[day.id][exIdx]||{sets:{},w:\"\",r:\"\",note:\"\"}; st[day.id][exIdx].note=e.target.value; saveState(st); });\n\n    grid.appendChild(w); grid.appendChild(r); grid.appendChild(n); card.appendChild(grid);\n\n    container.appendChild(card);\n  });\n\n  const notesEl = document.getElementById(\"weekNotes\");\n  notesEl.value = localStorage.getItem(kNotes(currentWeek)) || \"\";\n  notesEl.oninput = (e) => localStorage.setItem(kNotes(currentWeek), e.target.value);\n}\n\ndocument.querySelectorAll(\".tab\").forEach((t) => {\n  t.addEventListener(\"click\", () => { currentDay = parseInt(t.dataset.tab, 10); render(); });\n});\ndocument.getElementById(\"prevWeek\").addEventListener(\"click\", () => { currentWeek = Math.max(1, currentWeek - 1); render(); });\ndocument.getElementById(\"nextWeek\").addEventListener(\"click\", () => { currentWeek += 1; render(); });\ndocument.getElementById(\"resetDay\").addEventListener(\"click\", () => {\n  const day = PROGRAM[currentDay]; if (!confirm(\"Reset this day for the current week?\")) return; const st = loadState(); delete st[day.id]; saveState(st); render();\n});\ndocument.getElementById(\"resetWeek\").addEventListener(\"click\", () => { if (!confirm(\"Reset entire week’s progress?\")) return; saveState({}); localStorage.removeItem(kNotes(currentWeek)); render(); });\n\ncurrentWeek = isoWeekNumber();\nrender();\n