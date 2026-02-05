// ================================
// Inject engineWorker into page
// ================================
(function injectEngine() {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("engine/engineWorker.js");
  script.onload = () => script.remove();
  (document.head || document.documentElement).appendChild(script);
})();

// ================================
// Get FEN safely (Chess.com + Lichess)
// ================================
function getFENFromPage() {
  // --- LICHESS ---
  const lichessFenInput = document.querySelector("input.fen");
  if (lichessFenInput && lichessFenInput.value) {
    return lichessFenInput.value;
  }

  // --- CHESS.COM (best effort) ---
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

  window.postMessage(
    {
      type: "ANALYZE_FEN",
      fen
    },
    "*"
  );
}

// ================================
// Receive best move
// ================================
window.addEventListener("message", (e) => {
  if (e.data?.type === "BEST_MOVE") {
    const move = e.data.move; // e2e4
    highlightMove(move);
  }
});

// ================================
// Highlight move (simple overlay)
// ================================
function highlightMove(move) {
  if (!move || move.length < 4) return;

  const from = move.substring(0, 2);
  const to = move.substring(2, 4);

  console.log("Best Move:", from, "→", to);

  // You can replace this with arrows / SVG overlays
  document.querySelectorAll(".best-move-highlight").forEach(e => e.remove());

  [from, to].forEach(square => {
    const el = document.querySelector(`[data-square='${square}']`);
    if (!el) return;

    const overlay = document.createElement("div");
    overlay.className = "best-move-highlight";
    overlay.style.position = "absolute";
    overlay.style.inset = "0";
    overlay.style.background = "rgba(0, 255, 0, 0.35)";
    overlay.style.pointerEvents = "none";

    el.style.position = "relative";
    el.appendChild(overlay);
  });
}

// ================================
// Trigger analysis
// ================================
setInterval(analyzePosition, 1200);
