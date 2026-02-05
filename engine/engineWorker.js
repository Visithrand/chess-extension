// ================================
// engineWorker.js (PAGE CONTEXT)
// ================================
console.log("♟️ engineWorker.js running");

// ================================
// Get Stockfish URL from content.js
// ================================
const STOCKFISH_URL = window.__STOCKFISH_ENGINE_URL__;

if (!STOCKFISH_URL) {
  console.error("❌ Stockfish URL not found");
  return;
}

// ================================
// Create Stockfish Worker
// ================================
const stockfish = new Worker(STOCKFISH_URL);

let engineReady = false;
let busy = false;

// ================================
// Engine init
// ================================
stockfish.postMessage("uci");

stockfish.onmessage = (e) => {
  const line = e.data;

  // Uncomment if you want raw engine logs
  // console.log("[SF]", line);

  if (line === "uciok") {
    stockfish.postMessage("isready");
  }

  if (line === "readyok") {
    engineReady = true;
    console.log("♟️ Stockfish ready");

    // Engine strength
    stockfish.postMessage("setoption name Threads value 4");
    stockfish.postMessage("setoption name Hash value 128");
  }

  if (line.startsWith("bestmove")) {
    busy = false;

    const move = line.split(" ")[1];
    console.log("♟️ Best move:", move);

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

  // Stable & strong
  stockfish.postMessage("go movetime 1500");
});
