import React, { useState } from "react";
import "./App.css";

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]); // highlight line

  const [mode, setMode] = useState(null); // "human" | "computer"
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState(""); // or "Computer"
  const [namesSet, setNamesSet] = useState(false);

  const [difficulty, setDifficulty] = useState("easy");
  const [humanSymbol, setHumanSymbol] = useState("X");

  // Handle move
  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = xIsNext ? "X" : "O";
    setBoard(newBoard);

    const win = calculateWinner(newBoard);
    if (win) {
      setWinner(win.symbol === humanSymbol ? player1 : player2);
      setWinningLine(win.line);
    } else if (newBoard.every((cell) => cell)) {
      setWinner("Draw");
    } else {
      setXIsNext(!xIsNext);

      if (
        mode === "computer" &&
        !winner &&
        (xIsNext ? "O" : "X") === getComputerSymbol()
      ) {
        setTimeout(() => computerMove(newBoard), 500);
      }
    }
  };

  // Computer move
  const computerMove = (newBoard) => {
    let move;
    if (difficulty === "easy") {
      const available = newBoard
        .map((val, i) => (val ? null : i))
        .filter((v) => v !== null);
      move = available[Math.floor(Math.random() * available.length)];
    } else if (difficulty === "medium") {
      move =
        findWinningMove(newBoard, getComputerSymbol()) ??
        findWinningMove(newBoard, humanSymbol) ??
        randomMove(newBoard);
    } else {
      move = minimax(newBoard, getComputerSymbol()).index;
    }

    if (move !== null) {
      const updated = [...newBoard];
      updated[move] = getComputerSymbol();
      setBoard(updated);

      const win = calculateWinner(updated);
      if (win) {
        setWinner(win.symbol === humanSymbol ? player1 : player2);
        setWinningLine(win.line);
      } else if (updated.every((cell) => cell)) {
        setWinner("Draw");
      } else {
        setXIsNext(true);
      }
    }
  };

  // Reset
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setWinningLine([]);
    setNamesSet(false);
    setMode(null);
    setPlayer1("");
    setPlayer2("");
  };

  // Helpers
  const getComputerSymbol = () => (humanSymbol === "X" ? "O" : "X");

  const renderSquare = (i) => (
    <button
      className={`square ${winningLine.includes(i) ? "winner-square" : ""}`}
      onClick={() => handleClick(i)}
    >
      {board[i]}
    </button>
  );

  const startGame = () => {
    if (mode === "human" && player1.trim() && player2.trim()) {
      setNamesSet(true);
    } else if (mode === "computer" && player1.trim()) {
      setPlayer2("Computer");
      setNamesSet(true);
      if (humanSymbol === "O") {
        computerMove(Array(9).fill(null)); // computer starts
      }
    } else {
      alert("Please fill in all required fields!");
    }
  };

  return (
    <div className="game">
      {!mode ? (
        <div className="setup">
          <h2>Select Mode</h2>
          <button onClick={() => setMode("human")}>👥 Human vs Human</button>
          <button onClick={() => setMode("computer")}>
            🤖 Human vs Computer
          </button>
        </div>
      ) : !namesSet ? (
        <div className="name-inputs">
          {mode === "human" ? (
            <>
              <h2>Enter Player Names</h2>
              <input
                type="text"
                placeholder="Player 1 (X)"
                value={player1}
                onChange={(e) => setPlayer1(e.target.value)}
              />
              <input
                type="text"
                placeholder="Player 2 (O)"
                value={player2}
                onChange={(e) => setPlayer2(e.target.value)}
              />
            </>
          ) : (
            <>
              <h2>Enter Your Name</h2>
              <input
                type="text"
                placeholder="Your Name"
                value={player1}
                onChange={(e) => setPlayer1(e.target.value)}
              />

              <h3>Choose Your Symbol</h3>
              <div className="choice-buttons">
                <button
                  className={humanSymbol === "X" ? "active-choice" : ""}
                  onClick={() => setHumanSymbol("X")}
                >
                  X
                </button>
                <button
                  className={humanSymbol === "O" ? "active-choice" : ""}
                  onClick={() => setHumanSymbol("O")}
                >
                  O
                </button>
              </div>

              <h3>Choose Difficulty</h3>
              <div className="choice-buttons">
                {["easy", "medium", "hard"].map((level) => (
                  <button
                    key={level}
                    className={difficulty === level ? "active-choice" : ""}
                    onClick={() => setDifficulty(level)}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </>
          )}
          <button onClick={startGame}>Start Game</button>
        </div>
      ) : (
        <div>
          <div className="board">
            <div className="board-row">
              {renderSquare(0)}
              {renderSquare(1)}
              {renderSquare(2)}
            </div>
            <div className="board-row">
              {renderSquare(3)}
              {renderSquare(4)}
              {renderSquare(5)}
            </div>
            <div className="board-row">
              {renderSquare(6)}
              {renderSquare(7)}
              {renderSquare(8)}
            </div>
          </div>

          <div className="status">
            {winner
              ? winner === "Draw"
                ? "🤝 It's a Draw!"
                : `🎉 ${winner} Wins! 🎉`
              : `Next Turn: ${xIsNext ? "X" : "O"} (${
                  xIsNext ? player1 : player2
                })`}
          </div>
          <button onClick={resetGame}>Reset Game</button>
        </div>
      )}
    </div>
  );
}

// ✅ Helpers
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { symbol: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

function findWinningMove(board, symbol) {
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      const copy = [...board];
      copy[i] = symbol;
      if (calculateWinner(copy)?.symbol === symbol) return i;
    }
  }
  return null;
}

function randomMove(board) {
  const available = board.map((val, i) => (val ? null : i)).filter((v) => v !== null);
  return available[Math.floor(Math.random() * available.length)];
}

// Minimax
function minimax(newBoard, player) {
  const availSpots = newBoard.map((v, i) => (v ? null : i)).filter((v) => v !== null);
  const winner = calculateWinner(newBoard);
  if (winner?.symbol === "X") return { score: -10 };
  if (winner?.symbol === "O") return { score: 10 };
  if (availSpots.length === 0) return { score: 0 };

  const moves = [];
  for (let i of availSpots) {
    const move = { index: i };
    newBoard[i] = player;

    if (player === "O") {
      const result = minimax(newBoard, "X");
      move.score = result.score;
    } else {
      const result = minimax(newBoard, "O");
      move.score = result.score;
    }

    newBoard[i] = null;
    moves.push(move);
  }

  let bestMove;
  if (player === "O") {
    let bestScore = -Infinity;
    moves.forEach((m, idx) => {
      if (m.score > bestScore) {
        bestScore = m.score;
        bestMove = idx;
      }
    });
  } else {
    let bestScore = Infinity;
    moves.forEach((m, idx) => {
      if (m.score < bestScore) {
        bestScore = m.score;
        bestMove = idx;
      }
    });
  }
  return moves[bestMove];
}

export default App;
