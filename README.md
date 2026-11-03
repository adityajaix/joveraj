# Joviraj 3D Studios — 3D Educational Game Website & Prototypes

An interactive, modern, high-performance static website and pre-launch showcase for a 3D educational game studio. Features pure **CSS 3D transforms**, mouse-tracking **parallax depth**, and two playable in-browser game prototypes: an **Educational 3D Chess Tactics Lab** and a **3D Eco-Farming Simulator**.

Built with clean web standards: **HTML5, Modern CSS (3D Transforms & Perspective), and Vanilla JavaScript** with zero external dependencies.

---

## 🌟 3D Features & Playable Games

### 1. ♟️ Playable 3D Chess Tactics Lab
- **Isometric 3D Chessboard**: Styled with pure CSS 3D (`rotateX(50deg) rotateZ(-28deg)`), depth bevels, and elevated tiles.
- **Spatial Vector Geometry**: Teaches the geometric relationships of knight jumps and tactical forks in mathematical coordinates.
- **Interactive Move Engine**: Click on pieces to display 3D elevated target squares, move pieces with authentic sound effects, and celebrate tactical victories with confetti.

### 2. 🌾 Playable 3D Eco-Farming Simulator
- **Isometric 3D Farm Field**: 3x3 interactive agricultural grid tilted in 3D perspective.
- **Educational Agricultural Science**:
  - `Plant Seeds`: Prepares aerated soil plots.
  - `Irrigate Water`: Explains capillary hydration and seed germination.
  - `Solar Photosynthesis`: Chlorophyll photosynthesis converting sunlight and CO2 into golden wheat.
  - `Harvest Crop`: Measures biomass yield and demonstrates crop rotation cycles.
- **Live Eco HUD**: Real-time metrics for Eco-Score, Harvest Yield (bushels), and Water Reserves.

### 3. 🎲 3D Visual & Parallax Effects
- **CSS 3D Cube Scene**: Continuous rotating multi-faced 3D cube in the hero section displaying game icons.
- **Mouse-Tracking 3D Tilt**: Cards, stages, and badges dynamically tilt toward mouse position in 3D perspective space.
- **Background Parallax Layers**: Ambient floating 3D game elements (chess pieces, sprouts, planets) responding to cursor movement.
- **Extruded 3D Buttons**: Buttons with tactile 3D bevels that press into the screen upon click.

### 4. 🚀 Authentic Pre-Launch Features
- **Upcoming 3D Game Universe**: Filterable cards for *Grandmaster Quest 3D*, *EcoTerra 3D Farming*, *AstroMath Odyssey 3D*, and *CyberBug 3D Matrix*.
- **3D Tech Roadmap**: Transparent 4-phase development roadmap.
- **Early Alpha Waitlist**: Clean email signup for closed playtest invitations.
- **Theme Switcher**: Instant Light / Dark Mode with persistent theme setting.

---

## 📁 File Structure

```text
learning_game/
├── index.html         # Main semantic HTML5 page with 3D sections & games
├── css/
│   └── style.css      # CSS 3D transforms, isometric grids, parallax & theme tokens
├── js/
│   └── main.js        # 3D Chess engine, 3D Eco-Farm engine, mouse parallax, Web Audio
└── README.md          # Project documentation & local preview guide
```

---

## 🏃 Running Locally

Run Python's built-in static server:
```bash
python3 -m http.server 8000
```
Then visit `http://localhost:8000` in any web browser, or open `index.html` directly.
