/**
 * Get the current position as a VALID FEN string
 * Priority:
 * 1. Lichess (100% accurate)
 * 2. Chess.com internal game object (best available)
 * 3. DOM fallback (least accurate, but valid)
 */

function getFENFromBoard() {
  // =========================
  // 1️⃣ LICHESS (PERFECT)
  // =========================
  const lichessFenInput = document.querySelector("input.fen");
  if (lichessFenInput && lichessFenInput.value) {
    return lichessFenInput.value;
  }

  // =========================
  // 2️⃣ CHESS.COM (BEST)
  // =========================
  try {
    if (window.Chessboard?.game?.getFEN) {
      return window.Chessboard.game.getFEN();
    }
  } catch (e) {
    // ignore
  }

  // =========================
  // 3️⃣ DOM FALLBACK (SAFE)
  // =========================
  return getFENFromDOM();
}

/**
 * LAST RESORT – DOM based extraction
 * Produces a LEGAL FEN (castling disabled)
 */
function getFENFromDOM() {
  if (typeof Chess === "undefined") return null;

  const chess = new Chess();
  chess.clear();

  const pieces = document.querySelectorAll(".piece");
  if (!pieces.length) return null;

  pieces.forEach(piece => {
    const classes = piece.className.split(" ");

    const pieceClass = classes.find(c => /^[wb][prnbqk]$/.test(c));
    const square = classes.find(c => /^[a-h][1-8]$/.test(c));

    if (!pieceClass || !square) return;

    chess.put(
      {
        type: pieceClass[1], // p r n b q k
        color: pieceClass[0] // w or b
      },
      square
    );
  });

  // =========================
  // Force valid FEN fields
  // =========================
  const boardFen = chess.fen().split(" ")[0];

  // Guess side to move (best effort)
  const turn =
    document.querySelector(".clock-bottom, .clock-white") ? "w" : "b";

  // Disable castling + en-passant (safer than wrong info)
  return `${boardFen} ${turn} - - 0 1`;
}
