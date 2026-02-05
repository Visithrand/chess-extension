function getFENFromBoard() {
  const chess = new Chess();
  const pieces = document.querySelectorAll(".piece");

  if (!pieces.length) return null;

  pieces.forEach(piece => {
    const classes = piece.className.split(" ");
    const pieceClass = classes.find(c => /^[wb][prnbqk]$/.test(c));
    const square = classes.find(c => /^[a-h][1-8]$/.test(c));

    if (!pieceClass || !square) return;

    chess.put(
      {
        type: pieceClass[1],
        color: pieceClass[0]
      },
      square
    );
  });

  return chess.fen();
}
