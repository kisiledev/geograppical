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
  Box,
  Grid2
} from '@mui/material';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  addDoc,
  collection,
  getFirestore,
  Timestamp
} from 'firebase/firestore';
import { firebaseApp } from '../../firebase/firebase';
import * as ROUTES from '../../constants/Routes';
import { DataType, Question } from '../../helpers/types/index';
import Highlight from './Highlight';
import Find from './Find';
import Scoreboard from './Scoreboard';
import Choice from './Choice';
import { User } from 'firebase/auth';

interface Modal {
  title: string;
  body: string;
  primaryButton: JSX.Element;
}
interface GameProps {
  changeMapView: () => void;
  mapVisible: string;
  data: DataType;
  getCountryInfo: (country: string) => void;
  user: User | null;
  handleOpen: () => void;
  setStateModal: (modal: Modal) => void;
  login: () => void;
}

interface BundledPropsType {
  isStarted: boolean;
  gameOver: boolean;
  correct: number;
  incorrect: number;
  mapVisible: string;
  changeMapView: () => void;
  getCountryInfo: (country: string) => void;
  startGame: () => void;
  endGame: () => void;
  updateScore: (int: number) => void;
  saved: boolean;
  handlePoints: (q: Question[]) => void;
  handleOpen: () => void;
  data: DataType;
}
interface GameModeProps {
  gameMode: 'choice' | 'find' | 'highlight' | null;
  props: BundledPropsType;
}
const GameMode = ({ gameMode, props }: GameModeProps) => {
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

const Game = (props: GameProps) => {
  const [loadingState, setLoadingState] = useState(false);
  const [questions, setQuestions] = useState(0);
  const [questionsSet, setQuestionsSet] = useState<Question[]>([]);
  const [score, setScore] = useState<number>(0);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [gameMode, setGameMode] = useState<
    'choice' | 'find' | 'highlight' | null
  >(null);
  const [isStarted, setIsStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [scoreChecked, setScoreChecked] = useState(true);
  const [timeChecked, setTimeChecked] = useState(true);
  const [currentCount, setCurrentCount] = useState<number>(60);
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

  const intervalRef = useRef<number | null>(null);

  const tick = useCallback(() => {
    if (gameOver || !timeChecked) return;
    if (timeMode === 'cd' && currentCount === 0) {
      setGameOver(true);
    } else {
      setCurrentCount((curC) => (timeMode === 'cd' ? curC - 1 : curC + 1));
    }
  }, [gameOver, timeChecked, timeMode, currentCount]);

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
      intervalRef.current = window.setInterval(() => tick(), 1000);
    }
  }, [tick, timeChecked]);

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
    setQuestions(0);
    setScore(0);
    setCorrect(0);
    setGameOver(true);
    stop();
    reset();
  };
  const endGameModal = useCallback(() => {
    if (isStarted && currentCount === 0) setShow(true);
  }, [isStarted, currentCount]);

  useEffect(() => {
    endGameModal();
  }, [gameOver, currentCount, endGameModal]);

  const handleModalClose = () => {
    setShow(false);
    endGame();
  };
  const handlePointsQuestions = (q: Question[]) => {
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
  const updateScore = (int: number) => {
    setScore(score + int);
  };

  const titleCase = (str: string): string => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  const resetMode = () => {
    setQuestions(0);
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
  const toggleMode = (e: React.ChangeEvent) => {
    e.persist();
    if (timeChecked) {
      setTimeMode((e.target as HTMLInputElement).value);
    }
  };
  const handleTimeCheck = (e: React.ChangeEvent) => {
    const isChecked = (e.target as HTMLInputElement).checked;
    setCurrentCount(!timeChecked ? 60 : 0);
    setTimeChecked(isChecked);
  };
  const handleModalUse = useCallback(() => {
    const ModalText = `Congrats! You've reached the end of the game. You answered ${correct} questions correctly and ${incorrect} incorrectly.\n Thanks for playing`;
    const timeExpired = 'Sorry, time expired! Try again';
    setModalBody(gameComplete ? ModalText : timeExpired);
  }, [correct, incorrect, gameComplete]);
  const handleScoreCheck = (e: React.ChangeEvent) => {
    if (score === null) {
      setScore(0);
      setCorrect(0);
      setIncorrect(0);
    } else {
      setScore(0);
    }
    const isChecked = (e.target as HTMLInputElement).checked;
    setScoreChecked(isChecked);
  };

  useEffect(() => {
    handleModalUse();
  }, [questions, handleModalUse]);
  const saveScore = async () => {
    if (!user) {
      const modal = {
        title: 'Not Logged In',
        body: 'You need to sign in to favorite countries',
        primaryButton: (
          <Button variant="contained" onClick={login}>
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
          collection(db, `users/${user.uid}/scores`),
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
          <Button variant="contained" onClick={() => handleModalClose()}>
            Close
          </Button>
          {saved ? (
            <Button color="success">
              <Link to={ROUTES.ACCOUNT}>
                {loadingState ? (
                  <FontAwesomeIcon icon={faSpinner} spin size="3x" />
                ) : (
                  'View Score'
                )}
              </Link>
            </Button>
          ) : (
            <Button color="primary" onClick={() => saveScore()}>
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
        <Grid2 size={{ md: 8, lg: 12 }} sx={{ textAlign: 'center' }}>
          <GameMode props={bundledProps} gameMode={gameMode} />
        </Grid2>
        {!isStarted && (
          <Stack
            sx={{ justifyContent: 'center', display: 'flex', flexWrap: 'wrap' }}
          >
            <Grid2
              sx={{
                justifyContent: 'center',
                display: 'flex',
                flexWrap: 'wrap'
              }}
              size={{ xs: 12 }}
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
            </Grid2>
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
export default Game;
