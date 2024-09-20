import React, { useState, useEffect } from 'react';
import './styles.css';

interface Song {
  composer: string;
  title: string;
  music_link: string;
  image_link: string;
  fun_fact: string;
}

const classicalMusicQuiz: Song[] = [
  {
    composer: "Wolfgang Amadeus Mozart",
    title: "Die Zauberflöte",
    music_link: "https://raw.githubusercontent.com/mariolambe/classical-music-quiz/main/src/music/mozart.mp3",
    image_link: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Wolfgang-amadeus-mozart_1.jpg",
    fun_fact: "Mozart began composing at the age of 5 and wrote over 600 pieces of music!"
  },
  {
    composer: "Antonio Vivaldi",
    title: "The Four Seasons - Summer",
    music_link: "https://raw.githubusercontent.com/mariolambe/classical-music-quiz/main/src/music/vivaldi.mp3",
    image_link: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Vivaldi.jpg",
    fun_fact: "Vivaldi wrote over 500 concertos, with about 230 of them for violin!"
  },
  {
    composer: "Johann Sebastian Bach",
    title: "Cello Suite No. 1 in G",
    music_link: "https://raw.githubusercontent.com/mariolambe/classical-music-quiz/main/src/music/bach.mp3",
    image_link: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Johann_Sebastian_Bach.jpg",
    fun_fact: "Bach had 20 children and many of them became musicians too!"
  },
  {
    composer: "Giuseppe Verdi",
    title: "Requiem",
    music_link: "https://raw.githubusercontent.com/mariolambe/classical-music-quiz/main/src/music/verdi.mp3",
    image_link: "https://upload.wikimedia.org/wikipedia/commons/1/19/Verdi_by_Giovanni_Boldini.jpg",
    fun_fact: "Giuseppe Verdi was so passionate about gardening that he once said if he hadn't been a composer, he would have been a farmer!"
  },
  {
    composer: "Frédéric Chopin",
    title: "Nocturne in E-flat major, Op. 9, No. 2",
    music_link: "https://raw.githubusercontent.com/mariolambe/classical-music-quiz/main/src/music/chopin.mp3",
    image_link: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Frederic_Chopin_photo.jpeg",
    fun_fact: "Chopin's heart is buried in Warsaw, while the rest of him is buried in Paris!"
  }
];

export default function App(): JSX.Element {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [score, setScore] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [questionNumber, setQuestionNumber] = useState<number>(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerChecked, setAnswerChecked] = useState<boolean>(false);
  const [usedSongs, setUsedSongs] = useState<Song[]>([]);
  const [audioError, setAudioError] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const getNewSong = (): Song | null => {
    const availableSongs = classicalMusicQuiz.filter(song => !usedSongs.includes(song));
    if (availableSongs.length === 0) {
      return null;
    }
    const newSong = availableSongs[Math.floor(Math.random() * availableSongs.length)];
    setUsedSongs([...usedSongs, newSong]);
    return newSong;
  };

  const startNewGame = (): void => {
    const newSong = getNewSong();
    setCurrentSong(newSong);
    setScore(0);
    setTotalQuestions(0);
    setQuestionNumber(1);
    setSelectedOption(null);
    setAnswerChecked(false);
    setUsedSongs(newSong ? [newSong] : []);
    setAudioError(false);
    setShowModal(false);
  };

  const checkAnswer = (): void => {
    if (!answerChecked && selectedOption) {
      setAnswerChecked(true);
      setTotalQuestions(totalQuestions + 1);
      if (selectedOption === currentSong?.composer) {
        setScore(score + 1);
      }
    }
  };

  const nextQuestion = (): void => {
    const newSong = getNewSong();
    if (newSong) {
      setCurrentSong(newSong);
      setAnswerChecked(false);
      setQuestionNumber(questionNumber + 1);
      setSelectedOption(null);
      setAudioError(false);
    } else {
      setShowModal(true);
    }
  };

  const handleAudioError = () => {
    setAudioError(true);
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const uniqueComposers = Array.from(new Set(classicalMusicQuiz.map(song => song.composer)));

  return (
    <div className="App">
      <h1>🎵 Music Quiz 🎹</h1>
      
      <div className="game-area">
        <div className="main-content">
          <div className="question-score">
            <p className="medium-font">Who composed this music?</p>
            <p className="medium-font">Score: {score}/{totalQuestions}</p>
          </div>
          
          <div className="options">
            {uniqueComposers.map((composer, index) => {
              const composerData = classicalMusicQuiz.find(song => song.composer === composer);
              return (
                <label key={index} className={`option ${selectedOption === composer ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="composer"
                    value={composer}
                    checked={selectedOption === composer}
                    onChange={(e) => setSelectedOption(e.target.value)}
                  />
                  <img src={composerData?.image_link} alt={composer} className="composer-image" />
                  <span className="composer-name">{composer}</span>
                </label>
              );
            })}
          </div>
          
          <div className="control-area">
            {currentSong && (
              <div className="music-player">
                {audioError ? (
                  <p className="error">Error loading audio. Please try again.</p>
                ) : (
                  <audio 
                    controls 
                    src={currentSong.music_link}
                    onError={handleAudioError}
                  ></audio>
                )}
              </div>
            )}
            
            <div className="button-group">
              <button onClick={checkAnswer} disabled={!selectedOption || answerChecked}>Check Answer</button>
              <button onClick={nextQuestion} disabled={!answerChecked}>Next Question</button>
              <button onClick={startNewGame}>Start New Game</button>
            </div>
          </div>
          
          {answerChecked && currentSong && (
            <div className="feedback-area">
              <p className="medium-font">Title: {currentSong.title}</p>
              {selectedOption === currentSong.composer ? (
                <p className="success">Correct! 🎉</p>
              ) : (
                <p className="error">Oops! The correct answer was {currentSong.composer}.</p>
              )}
              <p className="info">Fun Fact: {currentSong.fun_fact}</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Game Over!</h2>
            <p>Your final score: {score}/{totalQuestions}</p>
            <button onClick={startNewGame}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}
