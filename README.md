# 🏋️ Iron Notes

A minimal, dark-themed Arabic workout tracker built for the browser. No accounts, no servers, no fluff — just open the file and log your lifts.

> Built as a personal gift for a friend who wanted a simple way to track his gym progress.

---

## Features

- **Arabic UI** with full RTL layout and the Tajawal typeface
- **Add exercises** with a name, number of sets, and number of reps
- **Duplicate detection** — adding an exercise that already exists shows an inline warning that auto-dismisses after 3 seconds
- **Inline editing** — click any sets or reps cell in the table to edit it in place
- **Persistent storage** — everything is saved to `localStorage` and survives page refreshes and browser restarts
- **Delete information** — wipe sets and reps values while keeping exercise names, leaving cells clickable and ready to be re-filled
- **Delete table** — remove all data and reset to a clean blank state
- **Keyboard friendly** — press `Enter` in any input to add an exercise; `Enter` or `Escape` while inline editing to confirm or cancel
- **Zero dependencies** — plain HTML, CSS, and vanilla JavaScript with no build step, no npm, no bundler

---

## File Structure

```
iron-notes/
│
├── index.html            # Page structure and markup
├── styles/
│   └── style.css         # All visual styles + Tajawal font import
├── scripts/
│   └── script.js         # All application logic
└── README.md             # You are here
```

---

## Getting Started

### Quick Start

You can access the website directly [here](https://jasseramir.github.io/iron-notes).

### Local Start

No installation or setup required. Just open `index.html` in any modern browser:

```bash
# Option 1 — double-click index.html in your file manager

# Option 2 — open from the terminal
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

That's it. The app is fully self-contained.

> **Tip:** Because Iron Notes uses `localStorage`, your data is tied to the browser and device you open it on. Use the same browser each session to keep your data intact.

---

## How to Use

### Adding an Exercise

1. Type the **exercise name** in the first field — this is the only required field.
2. Optionally enter the number of **sets** and **reps**.
3. Click **إضافة** or press `Enter`.

The exercise appears instantly in the table. If you try to add an exercise with a name that already exists, a warning appears below the form and disappears automatically after 3 seconds.

### Editing Sets or Reps

Click directly on any number in the **Sets** or **Reps** column. The cell turns into an input field. Type your new value, then:

- Press `Enter` to save
- Press `Escape` to cancel

Cells that are empty show a `—` dash. Clicking it opens the same inline editor so you can fill it in at any time.

### Deleting Information

Click **حذف المعلومات**. This clears all sets and reps values across every row and resets them to `—`. Exercise names are kept. Every cell becomes editable again so you can start a fresh session without rebuilding your full exercise list.

### Deleting the Table

Click **حذف الجدول**. This permanently wipes all data from `localStorage` and resets Iron Notes to its empty state. The action buttons disappear until a new exercise is added.

---

## Data Format

All data lives in `localStorage` under the key `workout_log_ar`. Each exercise is stored as a plain JSON object:

```json
[
  { "name": "بنش برس", "sets": "4", "reps": "10" },
  { "name": "سكوات",   "sets": "3", "reps": "12" },
  { "name": "ديدليفت", "sets": "",  "reps": ""   }
]
```

Empty strings for `sets` and `reps` mean the value hasn't been filled in yet. The app renders these as `—` and keeps them editable.

---

## Design Tokens

| Token | Value | Role |
|---|---|---|
| `--bg` | `#0e0e0e` | Page background |
| `--surface` | `#181818` | Input backgrounds |
| `--border` | `#2a2a2a` | Borders and dividers |
| `--accent` | `#c8f135` | Highlights, values, headings |
| `--accent2` | `#ff4e4e` | Danger actions |
| `--text` | `#f0f0f0` | Primary text |
| `--muted` | `#666` | Placeholders and secondary text |

**Font:** Tajawal (Google Fonts) — loaded via `@import` in `style.css`.

---

## Browser Support

Works in all modern browsers with support for `localStorage` and CSS custom properties:

| Browser | Minimum Version |
|---|---|
| Chrome / Edge | 80+ |
| Firefox | 75+ |
| Safari | 13.1+ |

---

## License

MIT License — free to use, modify, and share.
