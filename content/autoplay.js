let autoPlayEnabled = false;

function playMove(move) {
  if (!autoPlayEnabled) return;

  const from = move.slice(0, 2);
  const to = move.slice(2, 4);

  const fromEl = document.querySelector(`[data-square="${from}"]`);
  const toEl = document.querySelector(`[data-square="${to}"]`);

  if (!fromEl || !toEl) return;

  fromEl.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
  toEl.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
}

// Toggle autoplay with keyboard
document.addEventListener("keydown", e => {
  if (e.key === "E") {
    autoPlayEnabled = !autoPlayEnabled;
    console.log("Autoplay:", autoPlayEnabled);
  }
});
