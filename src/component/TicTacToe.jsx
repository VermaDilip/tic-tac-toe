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
  const [showLastRoundMessage, setShowLastRoundMessage] = useState(false); // Track last round message

  const { width, height } = useWindowSize(); // Use custom hook for Confetti size

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6],            // Diagonals
  ];

  const checkWinner = (newBoard) => {
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        return newBoard[a]; // 'X' or 'O' is the winner
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (board[index] || winner) return; // Ignore if cell is filled or winner exists

    const newBoard = [...board];
    newBoard[index] = isPlayerOne ? 'X' : 'O';
    setBoard(newBoard);

    const foundWinner = checkWinner(newBoard);
    if (foundWinner) {
      setWinner(foundWinner);
      const updatedPoints = { ...points };
      if (foundWinner === 'X') {
        updatedPoints.playerOne += 1;
      } else {
        updatedPoints.playerTwo += 1;
      }
      setPoints(updatedPoints);
    } else if (newBoard.every((cell) => cell)) {
      setWinner('Tie');
    } else {
      setIsPlayerOne(!isPlayerOne);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsPlayerOne(true);

    if (round === 2) {
      setShowLastRoundMessage(true); // Show last round message before the final round
    }
    setRound(round + 1);
  };

  const restartMatch = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerOne(true);
    setWinner(null);
    setRound(1);
    setPoints({ playerOne: 0, playerTwo: 0 });
    setShowLastRoundMessage(false); // Reset last round message
  };

  const isMatchOver = round > 3; // Check if all rounds are complete

  useEffect(() => {
    if (round === 3) {
      setShowLastRoundMessage(false); // Hide the last round message when the final round starts
    }
  }, [round]);

  return (
    <div className="tic-tac-toe">
      {isMatchOver && <Confetti width={width} height={height} />} {/* Show Confetti after the final round */}

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

      {showLastRoundMessage && !isMatchOver && (
        <div className="popup">
          <div className="popup-content">
            <h2>Get Ready for the Final Round!</h2>
            <p>This is the last round – give it your best shot!</p>
            <button onClick={() => setShowLastRoundMessage(false)} className="continue-btn">
              Continue to Final Round
            </button>
          </div>
        </div>
      )}

      {winner && !isMatchOver && (
        <div className="popup">
          <div className="popup-content">
            <h2>
              {winner === 'Tie' ? 'It\'s a Tie!' : `Player ${winner === 'X' ? 'One' : 'Two'} Wins!`}
            </h2>
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
            <h3>
              {points.playerOne > points.playerTwo ? 'Player One' : 'Player Two'} is the Champion!
            </h3>
            <button onClick={restartMatch} className="restart-btn">Restart Match</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicTacToe;