import { useState, useEffect } from "react";
import "./App.css";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TrashTalks } from "./TrashTalks";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function checkIfLastTurn(board) {
  const emptyCount = board.filter((sq) => sq === null).length;
  return emptyCount === 1;
}


export default function Board() {
  const [taunt, setTaunt] = useState("");
  const [xIsNext, setxIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function resetGame() {
    setSquares(Array(9).fill(null));
    setxIsNext(true);
    toast("Alright, let's go again ;P")
  }

  // Bot move logic + draw taunt detection
  useEffect(() => {
    const winner = calculateWinner(squares);
    const isDraw = squares.every((square) => square !== null);

    if (checkIfLastTurn(squares)) {
      return;
    }

    if (!xIsNext && !winner && !isDraw) {
      const botTimeout = setTimeout(() => {
        const bestMove = getBestMove(squares);

        // Bot makes move
        if (!squares[bestMove] && !calculateWinner(squares)) {
          const nextSquares = squares.slice();
          nextSquares[bestMove] = "O";
          setSquares(nextSquares);
          setxIsNext(true);

          const newWinner = calculateWinner(nextSquares);
          if (newWinner === "O") {
            toast(
              TrashTalks.winTrashTalks[Math.floor(Math.random() * TrashTalks.winTrashTalks.length)]
            );
          } else if (willBlockPlayer(squares, bestMove)) {
            toast(
              TrashTalks.blockTrashTalks[
                Math.floor(Math.random() * TrashTalks.blockTrashTalks.length)
              ]
            );
          }
        }
      }, 1400);

      return () => clearTimeout(botTimeout);
    }

    // If board full and no winner, it's a draw
    if (isDraw && !winner) {
      toast(
        TrashTalks.drawTrashTalks[Math.floor(Math.random() * TrashTalks.drawTrashTalks.length)]);
    }
  }, [xIsNext, squares]);

  // Handle clicks for both user and bot
  function handleClicks(i) {
      if (squares[i] || calculateWinner(squares)) {
        return;
      }

      const nextSquares = squares.slice();
      nextSquares[i] = xIsNext ? "X" : "O";
      setSquares(nextSquares);
      setxIsNext(!xIsNext);

    if (xIsNext) {
      const emptySquares = nextSquares.filter((sq) => sq === null).length;
      if (emptySquares > 1) {
        toast(TrashTalks.respondTaunts[Math.floor(Math.random() * TrashTalks.respondTaunts.length)]);
  }
}
  setSquares(nextSquares);
  setxIsNext(!xIsNext);

}

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (squares.every((square) => square !== null)) {
    status = "Draw";
  } else {
    status = "Next Player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClicks(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClicks(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClicks(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClicks(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClicks(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClicks(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClicks(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClicks(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClicks(8)} />
      </div>
      <button onClick={resetGame}>Restart the game!!</button>
      
      <ToastContainer 
        position="top-center"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function getBestMove(squares) {
  let bestScore = -Infinity;
  let move = null;

  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      squares[i] = "O";
      let score = minimax(squares, 0, false, -Infinity, Infinity);
      squares[i] = null;

      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  return move;

  function minimax(board, depth, isMaximizing, alpha, beta) {
    const winner = calculateWinner(board);
    if (winner === "O") return 10 - depth;
    if (winner === "X") return depth - 10;
    if (board.every((square) => square !== null)) return 0;

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = "O";
          let score = minimax(board, depth + 1, false, alpha, beta);
          board[i] = null;
          maxEval = Math.max(maxEval, score);
          alpha = Math.max(alpha, score);
          if (beta <= alpha) break;
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = "X";
          let score = minimax(board, depth + 1, true, alpha, beta);
          board[i] = null;
          minEval = Math.min(minEval, score);
          beta = Math.min(beta, score);
          if (beta <= alpha) break;
        }
      }
      return minEval;
    }
  }
}

function willBlockPlayer(oldSquares, moveIndex) {
  // Simulate if the player would win if not blocked
  const temp = oldSquares.slice();
  temp[moveIndex] = "O";
  for (let i = 0; i < temp.length; i++) {
    if (temp[i] === null) {
      temp[i] = "X";
      if (calculateWinner(temp) === "X") {
        return true;
      }
      temp[i] = null;
    }
  }
  return false;
}
