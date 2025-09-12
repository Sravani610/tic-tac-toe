import { useState } from "react";
import "./index.css";

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  // winner and winning line
  const { winner, line } = calculateWinner(board);

  function handleClick(index) {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  }

  function resetGame() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  }

  return (
    <div>
      <h1>Tic Tac Toe 🎮</h1>
      <div className="board">
        {board.map((cell, i) => (
          <button
            key={i}
            className={`cell ${line && line.includes(i) ? "winner" : ""}`}
            onClick={() => handleClick(i)}
          >
            {cell || i}
          </button>
        ))}
      </div>
      <p className="status">
        {winner ? `🎉 Winner: ${winner}` : `Next Player: ${xIsNext ? "X" : "O"}`}
      </p>
      <button className="restart-btn" onClick={resetGame}>Restart</button>
    </div>
  );
}

// calculateWinner now returns the winning line as well
function calculateWinner(squares) {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  for (let [a,b,c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a,b,c] };
    }
  }
  return { winner: null, line: null };
}
