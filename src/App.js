import {useState, useEffect} from 'react';
import './App.css';


function Square({value, onSquareClick}){
  return(
    <button className='square' onClick={onSquareClick}>
      {value}
    </button>
  );
}

//  main function to handle board
export default function Board(){
  const[xIsNext, setxIsNext] = useState(true);
  const[squares, setSquares] = useState(Array(9).fill(null));
   function resetGame(){
      setSquares(Array(9).fill(null));
      setxIsNext(true);
    }

  // Animating bot moves
  useEffect(() =>{
    const winner = calculateWinner(squares);
    const isDraw = squares.every(square => square!==null);

    if(!xIsNext && !winner && !isDraw){
      const emptyIndexes = squares
      .map((value,index)=>(value == null ? index: null))
      .filter(index => index!==null);

      const botTimeout=setTimeout(()=>{
        const bestMove = getBestMove(squares);
        handleClicks(bestMove);
      }, 1400
    );
      return () => clearTimeout(botTimeout);
    }

  }, [xIsNext, squares]);

  // what happens when a square is clicked
  function handleClicks(i){
    if(squares[i] || calculateWinner(squares)){
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X":"O";
    setSquares(nextSquares);
    setxIsNext(!xIsNext);
  }

  const winner = calculateWinner(squares);
  let status;
  if(winner){
    status = "Winner: " + winner;
  }
  else if(squares.every(square=> square!== null)){
    status = "Draw";

  }
  else{
    status = "Next Player: " + (xIsNext? "X" : "O");
  }

  return(
    <>
      <div className='status'>{status}</div>
      <div className='board-row'>
        <Square value = {squares[0]} onSquareClick={()=>handleClicks(0)}/>
        <Square value ={squares[1]} onSquareClick={()=>handleClicks(1)}/>
        <Square value ={squares[2]} onSquareClick={()=>handleClicks(2)}/>
      </div>
      <div className='board-row'>
        <Square value = {squares[3]} onSquareClick={()=>handleClicks(3)}/>
        <Square value ={squares[4]} onSquareClick={()=>handleClicks(4)}/>
        <Square value ={squares[5]} onSquareClick={()=>handleClicks(5)}/>
      </div>
      <div className='board-row'>
        <Square value = {squares[6]} onSquareClick={()=>handleClicks(6)}/>
        <Square value ={squares[7]} onSquareClick={()=>handleClicks(7)}/>
        <Square value ={squares[8]} onSquareClick={()=>handleClicks(8)}/>
      </div>

      <>
      <button onClick={resetGame}>Restart the game!!</button>
      
      </>
    </>
  )

}

//  function to declare a winner
function calculateWinner(squares){
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,4,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [2,4,6],
  ];
  for(let i = 0; i<lines.length;i++){
    const [a,b,c] = lines[i];
    if(
      squares[a] && squares[a] === squares[b] && squares[a]===squares[c]
    ){
      return squares[a];
    } 
  }
  return null;
}

function getBestMove(squares){
  let bestScore = -Infinity;
  let move = null;

  for(let i = 0; i < squares.length; i++){
    if(squares[i] === null){
      squares[i] = 'O';
      let score = minimax(squares, 0, false, -Infinity, Infinity);
      squares[i] = null;

      if(score > bestScore){
        bestScore = score;
        move = i;
      }
    }
  }

  return move;

  function minimax(board, depth, isMaximizing, alpha, beta){
    const winner = calculateWinner(board);
    if(winner === 'O') return 10 - depth;
    if(winner === 'X') return depth - 10;
    if(board.every(square => square !== null)) return 0;

    if(isMaximizing){
      let maxEval = -Infinity;
      for(let i = 0; i < board.length; i++){
        if(board[i] === null){
          board[i] = 'O';
          let score = minimax(board, depth + 1, false, alpha, beta);
          board[i] = null;
          maxEval = Math.max(maxEval, score);
          alpha = Math.max(alpha, score);
          if(beta <= alpha) break;
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for(let i = 0; i < board.length; i++){
        if(board[i] === null){
          board[i] = 'X';
          let score = minimax(board, depth + 1, true, alpha, beta);
          board[i] = null;
          minEval = Math.min(minEval, score);
          beta = Math.min(beta, score);
          if(beta <= alpha) break;
        }
      }
      return minEval;
    }
  }
   

}
