/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  List,
  ListItem,
  ListItemButton,
  Typography
} from '@mui/material';
import {
  Answer,
  DataType,
  dataType,
  Question
} from '../../helpers/types/index';
import gameModes from '../../constants/GameContent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { CountryType } from '../../helpers/types/CountryType';

interface CustomAnswerProps {
  answers: { id: number; name: string; correct: number }[];
  checkAnswer: (answer: { id: number; name: string; correct: number }) => void;
  options: { [key: number]: React.CSSProperties };
  loading: boolean;
}

const CustomAnswer = ({
  answers,
  checkAnswer,
  options,
  loading
}: CustomAnswerProps) => (
  <List
    sx={{
      padding: '5px',
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap'
    }}
  >
    {loading && <FontAwesomeIcon icon={faSpinner} />}
    {!loading &&
      answers.map((answer) => (
        <List sx={{ width: '45%', padding: '20px' }} key={answer.id}>
          <ListItemButton
            role="button"
            tabIndex={0}
            onClick={() => checkAnswer(answer)}
            component={Card}
            style={options[answer.correct]}
          >
            {answer.name}
          </ListItemButton>
        </List>
      ))}
  </List>
);

interface ChoiceProps {
  data: DataType;
  isStarted: boolean;
  saved: boolean;
  gameOver: boolean;
  handlePoints: Function;
  handleOpen: Function;
  endGame: Function;
  updateScore: Function;
  startGame: Function;
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

  const options = {
    0: {
      marginTop: '10px',
      margin: '10px 8px none',
      padding: '10px',
      borderRadius: '3px',
      display: 'flex',
      backgroundColor: 'green'
    },
    1: {
      marginTop: '10px',
      margin: '10px 8px none',
      padding: '10px',
      borderRadius: '3px',
      display: 'flex',
      backgroundColor: 'red'
    },
    2: {
      marginTop: '10px',
      margin: '10px 8px none',
      padding: '10px',
      borderRadius: '3px',
      display: 'flex',
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
    return country;
  };
  const randomExcluded = (min: number, max: number, excluded: number) => {
    let n = Math.floor(Math.random() * (max - min) + min);
    if (n >= excluded) {
      n += 1;
    }
    return n;
  };

  const getAnswers = (country: CountryType) => {
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
    const fetchanswers = [];
    const usedCaps: number[] = [];
    if (country) {
      fetchanswers.push({
        name: country.government.capital.name
          ? country.government.capital.name.split(';')[0]
          : 'no capital',
        id: 0,
        correct: 2
      });
    }
    if (!currentCountryId) {
      return;
    }
    for (let x = 0; x < 3; x += 1) {
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
        correct: 2
      };
      fetchanswers.push(capital);
      shuffle(fetchanswers);
    }

    setAnswers(fetchanswers);
    question.answers = fetchanswers;

    answerQuestions.push(question);
    setQuestions(answerQuestions);
  };
  const takeTurn = () => {
    if (!isStarted) {
      startGame();
    }
    setLoading(false);
    const country = getRandomCountry();
    setGuesses((prevGuess) => (prevGuess !== null ? prevGuess + 1 : 1));
    setCurrentCountry(country);
    getAnswers(country);
    const usedCountries = [];
    usedCountries.push();
    if (questions && questions.length === 10) {
      handleOpen();
      // setState({questions: [], answers: [], guesses: null})
    }
  };

  const checkAnswer = (answer: Answer) => {
    if (!currentCountry) {
      return;
    }
    //  if answer is correct answer (all correct answers have ID of 0)
    const checkquestions = questions;
    const checkquestion = checkquestions.find(
      (question) => question.country === currentCountry.name
    );

    if (!checkquestion) {
      return;
    }
    let checkguesses = guesses;
    if (answer.id === 0) {
      //  give score of 2
      updateScore(3 - guesses);
      //  set answer style
      answer.correct = 0;
      // alert('your answer is correct');
      //  initialize correct counter for game
      if (guesses === 1) {
        checkquestion.correct = true;
      }
      checkguesses = 0;
      setTimeout(() => {
        setLoading(true);
        takeTurn();
      }, 500);
    } else {
      answer.correct = 1;
      checkquestion.correct = false;
      checkguesses += 1;
    }
    setGuesses(checkguesses);
    handlePoints(questions);
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
  }, [saved, gameOver]);

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
  // let answerChoices;
  // if (answers && answers.length > 0) {
  //   if (questions < 0) {
  //     answerChoices = [];
  //   } else {
  //     answerChoices =
  //   }
  // }
  return (
    <div>
      {!isStarted && directions}
      {isStarted && (
        <div>
          {isStarted
            ? `What is the capital of
          ${currentCountry && currentCountry.name}
          ? `
            : 'The Game is Over'}
        </div>
      )}
      <div className="guesses">
        {isStarted && guesses && (
          <div>
            {guesses}
            {guesses === 1 ? ' guess' : ' guesses'}
          </div>
        )}
        {isStarted && guesses && (
          <div>
            {`For 
            ${3 - guesses}
            ${guesses === 2 || guesses === 4 ? ' point' : ' points'}`}
          </div>
        )}
      </div>
      {answers && !gameOver && answers.length > 0 && (
        <CustomAnswer
          answers={answers}
          options={options}
          checkAnswer={checkAnswer}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Choice;
