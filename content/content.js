// ================================
// PROOF: content script is running
// ================================
console.log("♟️ Chess Engine Assistant: content.js loaded");

// ================================
// Resolve Stockfish URL (content scripts CAN do this)
// ================================
const STOCKFISH_URL = chrome.runtime.getURL("engine/stockfish.js");

// ================================
// Inject engineWorker into PAGE context
// ================================
(function injectEngine() {
  // Pass Stockfish URL safely to page
  const dataScript = document.createElement("script");
  dataScript.textContent = `
    window.__STOCKFISH_ENGINE_URL__ = "${STOCKFISH_URL}";
  `;
  document.documentElement.appendChild(dataScript);
  dataScript.remove();

  // Inject engineWorker.js
  const engineScript = document.createElement("script");
  engineScript.src = chrome.runtime.getURL("engine/engineWorker.js");

  engineScript.onload = () => {
    console.log("♟️ engineWorker.js injected");
    engineScript.remove();
  };

  engineScript.onerror = () => {
    console.error("❌ Failed to inject engineWorker.js");
  };

  (document.head || document.documentElement).appendChild(engineScript);
})();

// ================================
// Get FEN safely (Lichess + Chess.com)
// ================================
function getFENFromPage() {
  // ----- LICHESS (100% accurate) -----
  const lichessFenInput = document.querySelector("input.fen");
  if (lichessFenInput?.value) {
    return lichessFenInput.value;
  }

  // ----- CHESS.COM (best effort) -----
  try {
    if (window.Chessboard?.game?.getFEN) {
      return window.Chessboard.game.getFEN();
    }
  } catch (e) {}

  return null;
}

// ================================
// Send FEN to Stockfish
// ================================
let lastFen = null;

function analyzePosition() {
  const fen = getFENFromPage();
  if (!fen || fen === lastFen) return;

  lastFen = fen;

  console.log("♟️ Analyzing FEN:", fen);

  window.postMessage(
    { type: "ANALYZE_FEN", fen },
    "*"
  );
}

// ================================
// Receive best move from engine
// ================================
window.addEventListener("message", (e) => {
  if (e.data?.type === "BEST_MOVE") {
    console.log("♟️ Best move received:", e.data.move);
    highlightMove(e.data.move);
  }
});

// ================================
// Highlight best move (safe, no autoplay)
// ================================
function highlightMove(move) {
  if (!move || move.length < 4) return;

  const from = move.slice(0, 2);
  const to = move.slice(2, 4);

  clearHighlights();

  [from, to].forEach(square => {
    // Lichess
    let el = document.querySelector(`[data-square="${square}"]`);

    // Chess.com fallback
    if (!el) el = document.querySelector(`.square-${square}`);
    if (!el) return;

    const overlay = document.createElement("div");
    overlay.className = "best-move-highlight";
    overlay.style.cssText = `
      position:absolute;
      inset:0;
      background:rgba(0,255,0,0.35);
      pointer-events:none;
    `;

    el.style.position = "relative";
    el.appendChild(overlay);
  });
}

function clearHighlights() {
  document
    .querySelectorAll(".best-move-highlight")
    .forEach(el => el.remove());
}

// ================================
// Trigger analysis (stable interval)
// ================================
setInterval(analyzePosition, 1200);
