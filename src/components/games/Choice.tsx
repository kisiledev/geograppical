import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  List,
  ListItemButton,
  Typography
} from '@mui/material';
import { Answer, DataType, Question } from '../../helpers/types/index';
import gameModes from '../../constants/GameContent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { CountryType } from '../../helpers/types/CountryType';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { keyframes } from '@mui/system';

interface CustomAnswerProps {
  answers: Answer[];
  checkAnswer: (e: React.MouseEvent<HTMLDivElement>, answer: Answer) => void;
  options: { [key: number]: React.CSSProperties };
  loading: boolean;
  otherOptions: React.CSSProperties;
}

// Add the shake animation keyframes
const shakeAnimation = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
`;

const CustomAnswer = ({
  answers,
  checkAnswer,
  options,
  loading,
  otherOptions
}: CustomAnswerProps) => (
  <List
    sx={{
      padding: '5px',
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      maxWidth: '600px',
      margin: '0 auto'
    }}
  >
    {loading ? (
      <FontAwesomeIcon icon={faSpinner} />
    ) : (
      answers.map((answer) => (
        <List
          sx={{
            width: '45%',
            padding: '10px',
            boxSizing: 'border-box'
          }}
          key={answer.id}
        >
          <ListItemButton
            role="button"
            tabIndex={0}
            onClick={(e) => checkAnswer(e, answer)}
            component={Card}
            style={{
              ...otherOptions,
              backgroundColor:
                answer.correct === 2
                  ? 'initial'
                  : options[answer.correct].backgroundColor,
              height: '60px',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              animation:
                answer.id === 0 &&
                answers.some((a) => a.correct === 1) &&
                answers.filter((a) => a.correct === 1).length >= 3
                  ? `${shakeAnimation} 0.5s ease-in-out`
                  : 'none'
            }}
          >
            {answer.name}
            {answer.correct === 0 && (
              <CheckCircleIcon
                sx={{
                  position: 'absolute',
                  right: 8,
                  color: 'white'
                }}
              />
            )}
            {answer.correct === 1 && (
              <CancelIcon
                sx={{
                  position: 'absolute',
                  right: 8,
                  color: 'white'
                }}
              />
            )}
          </ListItemButton>
        </List>
      ))
    )}
  </List>
);

interface ChoiceProps {
  data: DataType;
  isStarted: boolean;
  saved: boolean;
  gameOver: boolean;
  handlePoints: (questions: Question[]) => void;
  handleOpen: () => void;
  endGame: () => void;
  updateScore: (score: number) => void;
  startGame: () => void;
  mode: keyof typeof gameModes;
}
const Choice = (props: ChoiceProps) => {
  const [currentCountry, setCurrentCountry] = useState<CountryType | null>(
    null
  );
  const [currentCountryId, setCurrentCountryId] = useState<number | null>(null);
  const [guesses, setGuesses] = useState<number>(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [usedCountry, setUsedCountry] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [points, setPoints] = useState<number>(2);

  const {
    handlePoints,
    handleOpen,
    saved,
    gameOver,
    data,
    isStarted,
    endGame,
    startGame,
    updateScore,
    mode
  } = props;

  const otherOptions = {
    marginTop: '10px',
    margin: '10px 8px none',
    padding: '10px',
    borderRadius: '3px',
    display: 'flex'
  };
  const options = {
    0: {
      ...otherOptions,
      backgroundColor: 'green'
    },
    1: {
      ...otherOptions,
      backgroundColor: 'red'
    },
    2: {
      ...otherOptions,
      backgroundColor: 'initial'
    }
  };
  const shuffle = (a: Answer[]) => {
    for (let i = a.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const getRandomInt = (min: number, max: number) => {
    const minCeil = Math.ceil(min);
    const maxFloor = Math.floor(max);
    return Math.floor(Math.random() * (maxFloor - minCeil)) + minCeil;
  };
  const getRandomCountry = () => {
    let int;
    do {
      int = getRandomInt(0, data.length);
    } while (usedCountry.includes(int));
    setCurrentCountryId(int);
    const country = data[int];
    const usedArray = usedCountry;
    usedArray.push(int);
    setUsedCountry(usedArray);
    return { country, int };
  };
  const randomExcluded = (min: number, max: number, excluded: number) => {
    let n = Math.floor(Math.random() * (max - min) + min);
    if (n >= excluded) {
      n += 1;
    }
    return n;
  };

  useEffect(() => {
    console.log(answers);
  }, [answers]);

  const getAnswers = (country: CountryType, currentCountryId: number) => {
    const fetchanswers: Answer[] = [];
    let answerQuestions: Question[] = [];
    if (questions) {
      answerQuestions = [...questions];
    }
    const question: Question = {
      country: '',
      answers: [],
      correct: null
    };
    question.country = country.name;
    question.correct = null;

    setAnswers([]);

    const usedCaps: number[] = [];
    if (country) {
      fetchanswers.push({
        name: country.government.capital.name
          ? country.government.capital.name.split(';')[0]
          : 'no capital',
        id: 0,
        correct: 2,
        clicked: false
      });
    }
    for (let x = 0; x < 3; x++) {
      let ran = randomExcluded(0, data.length - 1, currentCountryId);
      if (usedCaps.includes(ran) || usedCaps.includes(currentCountryId)) {
        ran = randomExcluded(0, data.length - 1, currentCountryId);
      }
      usedCaps.push(ran);
      let newName;
      if (data[ran].government.capital.name || ran < 0) {
        [newName] = data[ran].government.capital.name.split(';');
        usedCaps.push(ran);
      } else {
        ran = randomExcluded(0, data.length - 1, currentCountryId);
        if (usedCaps.includes(ran) || usedCaps.includes(currentCountryId)) {
          ran = randomExcluded(0, data.length - 1, currentCountryId);
        }
        usedCaps.push(ran);
        [newName] = data[ran].government.capital.name.split(';');
      }
      const capital = {
        name: newName,
        id: x + 1,
        correct: 2,
        clicked: false
      };
      fetchanswers.push(capital);
      shuffle(fetchanswers);
    }
    question.answers = fetchanswers;

    answerQuestions.push(question);
    setQuestions(answerQuestions);
    console.log(fetchanswers);
    setAnswers(fetchanswers);
  };
  const takeTurn = () => {
    if (!isStarted) {
      console.log('startGame');
      startGame();
    }
    console.log('takeTurn');
    const { country, int } = getRandomCountry();
    setGuesses((prevGuess) => (prevGuess !== null ? prevGuess + 1 : 1));
    setCurrentCountry(country);
    getAnswers(country, int);
    const usedCountries = [];
    usedCountries.push();
    if (questions && questions.length === 10) {
      handleOpen();
      // setState({questions: [], answers: [], guesses: null})
    }
    setLoading(false);
  };

  const checkAnswer = (e: React.MouseEvent<HTMLDivElement>, answer: Answer) => {
    e.stopPropagation();
    if (!currentCountry) return;

    const checkquestion = questions.find(
      (question) => question.country === currentCountry.name
    );
    if (!checkquestion) return;

    let checkguesses = guesses;
    const updatedAnswers = answers.map((a) => ({
      ...a,
      correct: a.id === answer.id ? (answer.id === 0 ? 0 : 1) : a.correct
    }));
    setAnswers(updatedAnswers);

    if (answer.id === 0) {
      updateScore(points);
      if (guesses === 1) {
        checkquestion.correct = true;
      }
      checkguesses = 0;
      setGuesses(checkguesses);
      handlePoints(questions);
      setTimeout(() => {
        setAnswers(answers.map((a) => ({ ...a, correct: 2 })));
        setPoints(2);
        setTimeout(() => {
          takeTurn();
        }, 100);
      }, 1900);
    } else {
      checkquestion.correct = false;
      checkguesses += 1;
      setGuesses(checkguesses);
      setPoints(Math.max(0, points - 1));
    }
  };
  useEffect(() => {
    handlePoints(questions);
  });

  useEffect(() => {
    if (gameOver) {
      setAnswers([]);
      setQuestions([]);
      setUsedCountry([]);
      endGame();
    }
  }, [saved, gameOver, endGame]);

  const directions = (
    <Box className="directions">
      <Typography variant="h5">Directions</Typography>
      <Typography variant="body1">{gameModes[mode].directions}</Typography>
      <Box sx={{ margin: '10px' }}>
        <Button
          disabled={data?.length === 0}
          variant="contained"
          color="success"
          onClick={() => takeTurn()}
        >
          Start Game
        </Button>
      </Box>
    </Box>
  );
  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto', padding: 2 }}>
      {!isStarted && directions}
      {isStarted && (
        <>
          <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>
            What is the capital of {currentCountry && currentCountry.name}?
          </Typography>

          <Box sx={{ textAlign: 'center', mb: 2 }}>
            {points}
            {guesses > 0 && (
              <Typography variant="body1">
                {guesses} {guesses === 1 ? 'guess' : 'guesses'} - For {points}{' '}
                {points === 1 ? 'point' : 'points'}
              </Typography>
            )}
            {answers.some((a) => a.correct === 0) && (
              <Typography
                variant="body1"
                sx={{ color: 'green', fontWeight: 'bold' }}
              >
                Correct! You earned {points} {points === 1 ? 'point' : 'points'}
                !
              </Typography>
            )}
            {answers.some((a) => a.correct === 1) && (
              <Typography variant="body1" sx={{ color: '#666' }}>
                Not quite - try again, you've got this!
              </Typography>
            )}
          </Box>

          {answers && !loading && answers.length > 0 && (
            <CustomAnswer
              answers={answers}
              options={options}
              checkAnswer={checkAnswer}
              loading={loading}
              otherOptions={otherOptions}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default Choice;
