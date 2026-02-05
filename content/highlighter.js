function highlightMove(move) {
  clearHighlights();

  const from = move.slice(0, 2);
  const to = move.slice(2, 4);

  highlightSquare(from);
  highlightSquare(to);
}

function highlightSquare(square) {
  const el = document.querySelector(`[data-square="${square}"]`);
  if (el) el.classList.add("engine-highlight");
}

function clearHighlights() {
  document
    .querySelectorAll(".engine-highlight")
    .forEach(el => el.classList.remove("engine-highlight"));
}
