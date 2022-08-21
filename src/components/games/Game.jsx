/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import {
  addDoc,
  collection,
  getFirestore,
  Timestamp
} from 'firebase/firestore';
import { firebaseApp } from '../../Firebase/firebase';
import { dataType, userType } from '../../Helpers/Types/index';
import Highlight from './Highlight';
import Find from './Find';
import Scoreboard from './Scoreboard';
import Choice from './Choice';
import Checkbox from '../../Elements/Checkbox';
import Radio from '../../Elements/Radio';
import * as ROUTES from '../../Constants/Routes';
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  DialogTitle
} from '@mui/material';

const Game = (props) => {
  const [loadingState, setLoadingState] = useState(false);
  const [questions, setQuestions] = useState(null);
  const [questionsSet, setQuestionsSet] = useState(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [gameMode, setGameMode] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [scoreChecked, setScoreChecked] = useState(true);
  const [timeChecked, setTimeChecked] = useState(true);
  const [currentCount, setCurrentCount] = useState(60);
  const [gameComplete, setGameComplete] = useState(false);
  // const [isRunning, setIsRunning] = useState(false)
  const [timeMode, setTimeMode] = useState('cd');
  const [show, setShow] = useState(false);
  const [saved, setSaved] = useState(false);
  const [modalBody, setModalBody] = useState('');
  // const [intId, setIntId] = useState(null)
  // const [gameId, setGameId] = useState(null)

  const {
    simplifyString,
    changeMapView,
    mapVisible,
    data,
    getCountryInfo,
    user,
    handleOpen,
    setStateModal,
    login
  } = props;

  const db = getFirestore(firebaseApp);

  const tick = () => {
    if (gameOver || !timeChecked) return;
    if (timeMode === 'cd' && currentCount === 0) setGameOver(true);
    else setCurrentCount((curC) => (timeMode === 'cd' ? curC - 1 : curC + 1));
  };

  const intervalRef = useRef(null);

  const stop = useCallback(() => {
    if (intervalRef.current === null) {
      return;
    }
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const start = useCallback(() => {
    if (intervalRef.current !== null) {
      console.log('null');
      return;
    }
    console.log('starting');
    if (timeChecked) {
      intervalRef.current = setInterval(() => tick(), 1000);
    }
  }, []);

  const reset = useCallback(() => {
    setCurrentCount(60);
  }, []);

  useEffect(() => {
    if (timeMode === 'cd') {
      setCurrentCount(60);
    } else {
      setCurrentCount(0);
    }
  }, [timeMode]);

  const startGame = () => {
    setIsStarted(true);
    if (timeChecked) {
      start();
    }
  };
  const endGame = () => {
    if (timeChecked) {
      stop();
      reset();
    }
    if (!gameOver) return;
    setIsStarted(false);
    setGameOver(true);
    setQuestions(null);
    setScore(0);
    setCorrect(0);
    setIncorrect(0);
    setSaved(false);
    setCurrentCount(60);
  };
  const endGameModal = () => {
    if (isStarted && currentCount === 0) setShow(true);
  };

  useEffect(() => {
    endGameModal();
  }, [gameOver, currentCount]);

  const handleModalClose = () => {
    setShow(false);
    endGame();
  };
  const handlePointsQuestions = (q) => {
    const correctCount = q.filter((question) => question.correct === true);
    const incorrectCount = q.filter((question) => question.correct === false);
    const c = correctCount.length;
    const i = incorrectCount.length;
    setCorrect(c);
    setIncorrect(i);
    setQuestionsSet(q);
    setQuestions(q.length);
  };
  const handleGameOpen = () => {
    handlePointsQuestions(questionsSet);
    if (questions === 10) {
      stop();
      setGameComplete(true);
    }
    setShow(true);
  };
  const updateScore = (int) => {
    setScore(score + int);
  };

  const titleCase = (oldString) =>
    oldString
      .replace(
        /([a-z])([A-Z])/g,
        (allMatches, firstMatch, secondMatch) => `${firstMatch} ${secondMatch}`
      )
      .toLowerCase()
      .replace(
        /([ -_]|^)(.)/g,
        (allMatches, firstMatch, secondMatch) =>
          (firstMatch ? ' ' : '') + secondMatch.toUpperCase()
      );
  const resetMode = () => {
    setQuestions(null);
    setScore(0);
    setCorrect(0);
    setGameOver(false);
    setIncorrect(0);
    setGameMode(null);
    setIsStarted(false);
    setScoreChecked(true);
    setTimeChecked(true);
    setCurrentCount(60);
    setSaved(false);
    stop();
    reset();
  };
  const toggleMode = (e) => {
    e.persist();
    if (timeChecked) {
      setTimeMode(e.target.value);
    }
  };
  const handleTimeCheck = (e) => {
    setCurrentCount(!timeChecked ? 60 : null);
    setTimeChecked(e.target.checked);
  };
  const handleModalUse = () => {
    const ModalText = `Congrats! You've reached the end of the game. You answered ${correct} questions correctly and ${incorrect} incorrectly.\n Thanks for playing`;
    const timeExpired = 'Sorry, time expired! Try again';
    setModalBody(gameComplete ? ModalText : timeExpired);
  };
  const handleScoreCheck = (e) => {
    if (score === null) {
      setScore(0);
      setCorrect(0);
      setIncorrect(0);
    } else {
      setScore(null);
    }
    setScoreChecked(e.target.checked);
  };

  useEffect(() => {
    handleModalUse();
  }, [questions]);
  const saveScore = async () => {
    if (!user) {
      const modal = {
        title: 'Not Logged In',
        body: 'You need to sign in to favorite countries',
        primaryButton: (
          <Button variant="primary" onClick={login}>
            Sign In/ Sign Up
          </Button>
        )
      };
      setStateModal(modal);
      handleOpen();
    } else {
      setLoadingState(true);
      const newData = {
        userId: user.uid && user.uid,
        gameMode,
        dateCreated: Timestamp.fromDate(new Date()),
        ...(timeChecked && score && { score }),
        correct,
        incorrect,
        ...(timeChecked && { time: 60 - currentCount }),
        questions: questionsSet
      };
      try {
        const docRef = await addDoc(
          collection(db, ...`users/${user.uid}/scores`.split('/')),
          newData
        );
        console.log('Data written successfully', docRef, docRef.id);
        setSaved(true);
        setIsStarted(false);
        setLoadingState(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const back = !isStarted && (
    <Button
      variant="contained"
      className="btn btn-info mb-3"
      onClick={() => resetMode()}
    >
      Go Back
    </Button>
  );
  let returnGameMode;
  if (gameMode === 'choice') {
    returnGameMode = (
      <div>
        {back}
        <Choice
          isStarted={isStarted}
          gameOver={gameOver}
          correct={correct}
          incorrect={incorrect}
          data={data}
          getCountryInfo={getCountryInfo}
          startGame={startGame}
          endGame={endGame}
          updateScore={updateScore}
          handlePoints={handlePointsQuestions}
          handleOpen={handleGameOpen}
          saved={saved}
        />
      </div>
    );
  } else if (gameMode === 'find') {
    returnGameMode = (
      <div>
        {back}
        <Find
          simplifyString={simplifyString}
          isStarted={isStarted}
          gameOver={gameOver}
          correct={correct}
          incorrect={incorrect}
          mapVisible={mapVisible}
          changeMapView={changeMapView}
          worldData={data}
          startGame={startGame}
          endGame={endGame}
          updateScore={updateScore}
          handlePoints={handlePointsQuestions}
          handleOpen={handleGameOpen}
          saved={saved}
        />
      </div>
    );
  } else if (gameMode === 'highlight') {
    returnGameMode = (
      <div>
        {back}
        <Highlight
          simplifyString={simplifyString}
          isStarted={isStarted}
          gameOver={gameOver}
          correct={correct}
          incorrect={incorrect}
          mapVisible={mapVisible}
          changeMapView={changeMapView}
          worldData={data}
          getCountryInfo={getCountryInfo}
          startGame={startGame}
          endGame={endGame}
          updateScore={updateScore}
          handlePoints={handlePointsQuestions}
          handleOpen={handleGameOpen}
          saved={saved}
        />
      </div>
    );
  } else {
    returnGameMode = <div />;
  }
  const timeButtons = timeChecked && (
    <div className="col-12 d-flex justify-content-center flex-wrap">
      <label>
        <Radio
          value="et"
          checked={timeMode === 'et'}
          onChange={(e) => toggleMode(e)}
        />
        <span style={{ marginLeft: 8, marginRight: 8 }}>Elapsed Time</span>
      </label>
      <label>
        <Radio
          value="cd"
          checked={timeMode === 'cd'}
          onChange={(e) => toggleMode(e)}
        />
        <span style={{ marginLeft: 8, marginRight: 8 }}>Countdown</span>
      </label>
    </div>
  );

  return (
    <>
      <Dialog
        open={show}
        onExit={() => resetMode()}
        onHide={() => handleModalClose()}
      >
        <DialogTitle>Game Over</DialogTitle>
        <DialogContent>{modalBody}</DialogContent>
        <DialogActions>
          <Button variant="secondary" onClick={() => handleModalClose()}>
            Close
          </Button>
          {saved ? (
            <Button variant="success">
              <Link to={ROUTES.ACCOUNT}>
                {loadingState ? (
                  <FontAwesomeIcon icon={faSpinner} spin size="3x" />
                ) : (
                  'View Score'
                )}
              </Link>
            </Button>
          ) : (
            <Button variant="contained" onClick={() => saveScore()}>
              Save Score
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Scoreboard
        timeChecked={timeChecked}
        isStarted={isStarted}
        timeMode={timeMode}
        currentCount={currentCount}
        score={score}
        correct={correct}
        incorrect={incorrect}
        questions={questions}
      />
      <div className="card mt-5 col-md-8 mx-auto">
        <h3 className="text-center">
          {gameMode
            ? `Game Mode: ${titleCase(gameMode)}`
            : 'Choose a Game Mode'}
        </h3>
        {!gameMode && (
          <div>
            <div className="row">
              <div className="col-md-12 mx-auto">
                <ul className="px-0 text-center">
                  <li
                    className="choice list-group-item text-dark btn-info"
                    onClick={() => setGameMode('choice')}
                  >
                    Questions
                  </li>
                  <li
                    className="choice list-group-item text-dark btn-info"
                    onClick={() => setGameMode('find')}
                  >
                    Find Country on Map
                  </li>
                  <li
                    className="choice list-group-item text-dark btn-info"
                    onClick={() => setGameMode('highlight')}
                  >
                    Select Highlighted Country
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
        <div className="text-center col-md-8 col-lg-12 px-0 mx-auto">
          {returnGameMode}
        </div>
        {!isStarted && (
          <div className="col-12 d-flex justify-content-center flex-wrap">
            <label>
              <Checkbox
                checked={timeChecked}
                onChange={(e) => handleTimeCheck(e)}
              />
              <span style={{ marginLeft: 8, marginRight: 8 }}>Keep Time</span>
            </label>
            <label>
              <Checkbox
                checked={scoreChecked}
                onChange={(e) => handleScoreCheck(e)}
              />
              <span style={{ marginLeft: 8 }}>Keep Score</span>
            </label>
            {timeChecked && timeButtons}
          </div>
        )}
        {isStarted && (
          <div className="text-center mt-5 mb-3">
            <Button
              variant="contained"
              className="text-center btn bg-danger text-white"
              onClick={() => resetMode()}
            >
              End Game
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
Game.defaultProps = {
  user: null
};
Game.propTypes = {
  simplifyString: PropTypes.func.isRequired,
  changeMapView: PropTypes.func.isRequired,
  mapVisible: PropTypes.string.isRequired,
  data: dataType.isRequired,
  getCountryInfo: PropTypes.func.isRequired,
  user: userType,
  handleOpen: PropTypes.func.isRequired,
  setStateModal: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired
};
export default Game;
