const stockfishWorker = new Worker(chrome.runtime.getURL('engine/stockfish.js'));

stockfishWorker.postMessage("uci");
stockfishWorker.postMessage("isready");

function analyzePosition() {
  const fen = getFENFromBoard();
  if (!fen) return;

  stockfishWorker.postMessage("position fen " + fen);
  stockfishWorker.postMessage("go depth 14");
}

stockfishWorker.onmessage = e => {
  const line = e.data;

  if (line.startsWith("bestmove")) {
    const move = line.split(" ")[1];
    highlightMove(move);
    playMove(move);
  }
};

// Observe board changes (player + opponent)
const observer = new MutationObserver(() => {
  analyzePosition();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Initial run
setTimeout(analyzePosition, 2000);
