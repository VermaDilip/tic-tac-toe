import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti'; // Import Confetti
// import { useWindowSize } from 'react-use'; // Optional: To get the window dimensions
import useWindowSize from './useWindowSize';

const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isPlayerOne, setIsPlayerOne] = useState(true);
    const [winner, setWinner] = useState(null);
    const [round, setRound] = useState(1);
    const [points, setPoints] = useState({ playerOne: 0, playerTwo: 0 });
    const [showLastRoundMessage, setShowLastRoundMessage] = useState(false);
    const [gameMode, setGameMode] = useState(null); // Single Player or Two Players
    const { width, height } = useWindowSize();
  
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], 
      [0, 3, 6], [1, 4, 7], [2, 5, 8], 
      [0, 4, 8], [2, 4, 6]
    ];
  
    const checkWinner = (newBoard) => {
      for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
          return newBoard[a];
        }
      }
      return null;
    };
  
    const handleClick = (index) => {
      if (board[index] || winner) return;
  
      const newBoard = [...board];
      newBoard[index] = isPlayerOne ? 'X' : 'O';
      setBoard(newBoard);
  
      const foundWinner = checkWinner(newBoard);
      if (foundWinner) {
        setWinner(foundWinner);
        updatePoints(foundWinner);
      } else if (newBoard.every((cell) => cell)) {
        setWinner('Tie');
      } else {
        setIsPlayerOne(!isPlayerOne);
      }
    };
  
    const updatePoints = (foundWinner) => {
      const updatedPoints = { ...points };
      if (foundWinner === 'X') {
        updatedPoints.playerOne += 1;
      } else {
        updatedPoints.playerTwo += 1;
      }
      setPoints(updatedPoints);
    };
  
    const systemMove = () => {
      const availableCells = board
        .map((cell, index) => (cell === null ? index : null))
        .filter((index) => index !== null);
  
      if (availableCells.length === 0) return;
  
      const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
      const newBoard = [...board];
      newBoard[randomIndex] = 'O';
      setBoard(newBoard);
  
      const foundWinner = checkWinner(newBoard);
      if (foundWinner) {
        setWinner(foundWinner);
        updatePoints(foundWinner);
      } else if (newBoard.every((cell) => cell)) {
        setWinner('Tie');
      } else {
        setIsPlayerOne(true);
      }
    };
  
    useEffect(() => {
      if (gameMode === 'single' && !isPlayerOne && !winner) {
        const timeout = setTimeout(systemMove, 500);
        return () => clearTimeout(timeout);
      }
    }, [isPlayerOne, winner, board, gameMode]);
  
    const resetGame = () => {
      setBoard(Array(9).fill(null));
      setWinner(null);
      setIsPlayerOne(true);
  
      if (round === 2) {
        setShowLastRoundMessage(true);
      }
      setRound(round + 1);
    };
  
    const restartMatch = () => {
      setBoard(Array(9).fill(null));
      setIsPlayerOne(true);
      setWinner(null);
      setRound(1);
      setPoints({ playerOne: 0, playerTwo: 0 });
      setShowLastRoundMessage(false);
      setGameMode(null);
    };
  
    const isMatchOver = round > 3;
  
    return (
      <div className="tic-tac-toe">
        {!gameMode && (
          <div className="card">
            <h2>Select Game Mode</h2>
            <div className="button-group">
              <button onClick={() => setGameMode('single')} className="mode-btn">
                Single Player
              </button>
              <button onClick={() => setGameMode('two')} className="mode-btn">
                Two Players
              </button>
            </div>
          </div>
        )}
  
        {gameMode && (
          <>
            {isMatchOver && <Confetti width={width} height={height} />}
            <div className="header">
              <h1>Tic Tac Toe</h1>
              <p>Round {round} / 3</p>
            </div>
  
            <div className="scoreboard">
              <h3>Scores</h3>
              <p>Player One: {points.playerOne}</p>
              <p>Player Two: {points.playerTwo}</p>
            </div>
  
            <div className="board">
              {board.map((cell, index) => (
                <div
                  key={index}
                  className={`cell ${cell ? 'filled' : ''}`}
                  onClick={() => handleClick(index)}
                >
                  {cell}
                </div>
              ))}
            </div>
  
            {winner && !isMatchOver && (
              <div className="popup">
                <div className="popup-content">
                  <h2>{winner === 'Tie' ? 'It\'s a Tie!' : `Player ${winner === 'X' ? 'One' : 'Two'} Wins!`}</h2>
                  <button onClick={resetGame} className="next-round-btn">Next Round</button>
                </div>
              </div>
            )}
  
            {isMatchOver && (
              <div className="popup">
                <div className="popup-content">
                  <h2>Final Score</h2>
                  <p>Player One: {points.playerOne} points</p>
                  <p>Player Two: {points.playerTwo} points</p>
                  <h3>{points.playerOne > points.playerTwo ? 'Player One' : 'Player Two'} is the Champion!</h3>
                  <button onClick={restartMatch} className="restart-btn">Restart Match</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };
  
  export default TicTacToe;