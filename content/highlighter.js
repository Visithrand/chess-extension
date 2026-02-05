/**
 * Highlight a Stockfish best move (e2e4)
 * Works on Lichess & Chess.com
 */

function highlightMove(move) {
  if (!move || move.length < 4) return;

  clearHighlights();

  const from = move.slice(0, 2);
  const to = move.slice(2, 4);

  highlightSquare(from);
  highlightSquare(to);
}

/**
 * Highlight a single square
 */
function highlightSquare(square) {
  // =========================
  // LICHESS
  // =========================
  let el = document.querySelector(`[data-square="${square}"]`);

  // =========================
  // CHESS.COM fallback
  // =========================
  if (!el) {
    el = document.querySelector(`.square-${square}`);
  }

  if (!el) return;

  el.classList.add("engine-highlight");
}

/**
 * Remove all highlights
 */
function clearHighlights() {
  document
    .querySelectorAll(".engine-highlight")
    .forEach(el => el.classList.remove("engine-highlight"));
}
