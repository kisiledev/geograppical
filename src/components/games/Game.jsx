/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Checkbox,
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  DialogActions,
  Stack,
  ButtonGroup,
  Grid,
  FormControlLabel,
  Radio,
  Card,
  Box
} from '@mui/material';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import {
  addDoc,
  collection,
  getFirestore,
  Timestamp
} from 'firebase/firestore';
import { firebaseApp } from '../../firebase/firebase';
import * as ROUTES from '../../constants/Routes';
import { dataType, userType } from '../../helpers/types/index';
import Highlight from './Highlight';
import Find from './Find';
import Scoreboard from './Scoreboard';
import Choice from './Choice';

const GameMode = ({ gameMode, props }) => {
  switch (gameMode) {
    case 'choice': {
      return <Choice {...props} mode={gameMode} />;
    }
    case 'find': {
      return <Find {...props} mode={gameMode} />;
    }
    case 'highlight': {
      return <Highlight {...props} mode={gameMode} />;
    }
    default:
      return null;
  }
};

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

  const {
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
      return;
    }
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
    setGameOver(false);
    if (timeChecked) {
      start();
    }
  };
  const endGame = () => {
    if (timeChecked) {
      stop();
      reset();
    }
    setIsStarted(false);
    setScore(0);
    setCorrect(0);
    setIncorrect(0);
    setSaved(false);
    setCurrentCount(60);
    setQuestions(null);
    setScore(0);
    setCorrect(0);
    setGameOver(true);
    stop();
    reset();
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
        setGameOver(true);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const bundledProps = {
    isStarted,
    gameOver,
    correct,
    incorrect,
    mapVisible,
    changeMapView,
    getCountryInfo,
    startGame,
    endGame,
    updateScore,
    saved,
    handlePoints: handlePointsQuestions,
    handleOpen: handleGameOpen,
    data
  };
  const back = !isStarted && gameMode !== null && (
    <Button variant="contained" color="primary" onClick={() => resetMode()}>
      Go Back
    </Button>
  );
  const timeButtons = timeChecked && (
    <Grid
      sx={{ justifyContent: 'center', display: 'flex', flexWrap: 'wrap' }}
      item
      xs={12}
    >
      <FormControlLabel
        control={
          <Radio
            value="et"
            checked={timeMode === 'et'}
            onChange={(e) => toggleMode(e)}
          />
        }
        label="Elapsed Time"
      />
      <FormControlLabel
        control={
          <Radio
            value="cd"
            checked={timeMode === 'cd'}
            onChange={(e) => toggleMode(e)}
          />
        }
        label="Countdown"
      />
    </Grid>
  );

  return (
    <>
      <Dialog
        open={show}
        onClose={() => {
          resetMode();
          handleModalClose();
        }}
      >
        <DialogTitle>
          <Typography>Game Over</Typography>
        </DialogTitle>
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
            <Button variant="primary" onClick={() => saveScore()}>
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
      <Card sx={{ margin: '20px', padding: '20px' }} elevation={4}>
        {back}
        <Typography
          sx={{ textAlign: 'center', fontWeight: 600 }}
          textAlign="center"
          variant="h4"
        >
          {gameMode
            ? `Game Mode: ${titleCase(gameMode)}`
            : 'Choose a Game Mode'}
        </Typography>
        {!gameMode && (
          <Stack
            sx={{ width: '800px', alignItems: 'center', margin: '0 auto' }}
          >
            <ButtonGroup orientation="vertical" className="px-0 text-center">
              <Button variant="outlined" onClick={() => setGameMode('choice')}>
                Questions
              </Button>
              <Button variant="outlined" onClick={() => setGameMode('find')}>
                Find Country on Map
              </Button>
              <Button
                variant="outlined"
                onClick={() => setGameMode('highlight')}
              >
                Select Highlighted Country
              </Button>
            </ButtonGroup>
          </Stack>
        )}
        <Grid item md={8} lg={12} sx={{ textAlign: 'center' }}>
          <GameMode props={bundledProps} gameMode={gameMode} />
        </Grid>
        {!isStarted && (
          <Stack
            sx={{ justifyContent: 'center', display: 'flex', flexWrap: 'wrap' }}
            xs={6}
          >
            <Grid
              sx={{
                justifyContent: 'center',
                display: 'flex',
                flexWrap: 'wrap'
              }}
              item
              xs={12}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    id="timeCheck"
                    checked={timeChecked}
                    onChange={(e) => handleTimeCheck(e)}
                  />
                }
                label="Keep Time"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    id="scoreCheck"
                    checked={scoreChecked}
                    onChange={(e) => handleScoreCheck(e)}
                  />
                }
                label="Keep Score"
              />
            </Grid>
            {timeChecked && timeButtons}
          </Stack>
        )}
        {isStarted && (
          <Box sx={{ margin: '15px auto 9px', textAlign: 'center' }}>
            <Button
              type="button"
              variant="contained"
              color="error"
              sx={{ justifyContent: 'center' }}
              onClick={() => endGame()}
            >
              End Game
            </Button>
          </Box>
        )}
      </Card>
    </>
  );
};
Game.defaultProps = {
  user: null
};
Game.propTypes = {
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
