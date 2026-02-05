// ================================
// Stockfish Worker (MV3 SAFE)
// ================================
const stockfish = new Worker(
  chrome.runtime.getURL("engine/stockfish.js")
);

let engineReady = false;
let busy = false;

// ================================
// Engine init
// ================================
stockfish.postMessage("uci");

stockfish.onmessage = (e) => {
  const line = e.data;

  if (line === "uciok") {
    stockfish.postMessage("isready");
  }

  if (line === "readyok") {
    engineReady = true;

    // Engine strength settings
    stockfish.postMessage("setoption name Threads value 4");
    stockfish.postMessage("setoption name Hash value 128");
  }

  if (line.startsWith("bestmove")) {
    busy = false;

    const move = line.split(" ")[1];
    window.postMessage(
      {
        type: "BEST_MOVE",
        move
      },
      "*"
    );
  }
};

// ================================
// Listen for analysis requests
// ================================
window.addEventListener("message", (e) => {
  if (!engineReady || busy) return;
  if (e.data?.type !== "ANALYZE_FEN") return;

  busy = true;

  stockfish.postMessage("stop");
  stockfish.postMessage("position fen " + e.data.fen);

  // 🔥 Strong & stable analysis
  stockfish.postMessage("go movetime 1500");
});
