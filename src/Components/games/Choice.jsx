/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, List, ListItem, ListItemButton } from '@mui/material';
import { dataType } from '../../helpers/types/index';

const Choice = (props) => {
  const [currentCountry, setCurrentCountry] = useState(null);
  const [currentCountryId, setCurrentCountryId] = useState(null);
  const [guesses, setGuesses] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [usedCountry, setUsedCountry] = useState([]);

  const {
    handlePoints,
    handleOpen,
    saved,
    gameOver,
    data,
    isStarted,
    endGame,
    startGame,
    updateScore
  } = props;
  // const [ran, setRan] = useState(null)

  const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const getRandomInt = (min, max) => {
    const minCeil = Math.ceil(min);
    const maxFloor = Math.floor(max);
    return Math.floor(Math.random() * (maxFloor - minCeil)) + minCeil;
  };
  const getRandomCountry = () => {
    const int = getRandomInt(0, data.length);
    setCurrentCountryId(int);
    const country = data[int];
    const usedArray = usedCountry;
    usedArray.push(int);
    setUsedCountry(usedArray);
    return country;
  };
  const randomExcluded = (min, max, excluded) => {
    let n = Math.floor(Math.random() * (max - min) + min);
    if (n >= excluded) {
      n += 1;
    }
    return n;
  };

  const getAnswers = (country) => {
    let answerQuestions;
    if (questions) {
      answerQuestions = [...questions];
    }
    const question = {};
    question.country = country.name;
    question.correct = null;
    const fetchanswers = [];
    const usedCaps = [];
    if (country) {
      fetchanswers.push({
        name: country.government.capital.name
          ? country.government.capital.name.split(';')[0]
          : 'no capital',
        id: 0,
        correct: 2
      });
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
      setAnswers(fetchanswers);
    }
    question.answers = fetchanswers;

    answerQuestions.push(question);
    setQuestions(answerQuestions);
  };
  const takeTurn = () => {
    if (!isStarted) {
      startGame();
    }
    const country = getRandomCountry();
    setGuesses((prevGuess) => prevGuess + 1);
    setCurrentCountry(country);
    getAnswers(country);
    if (questions && questions.length === 10) {
      handleOpen();
      // setState({questions: [], answers: [], guesses: null})
    }
  };

  const checkAnswer = (answer) => {
    //  if answer is correct answer (all correct answers have ID of 0)
    const checkquestions = questions;
    const checkquestion = checkquestions.find(
      (question) => question.country === currentCountry.name
    );
    let checkguesses = guesses;
    if (answer.id === 0) {
      //  give score of 2
      updateScore(3 - guesses);
      //  set answer style
      answer.correct = 0;
      //  initialize correct counter for game
      if (guesses === 1) {
        checkquestion.correct = true;
      }
      checkguesses = null;
      setTimeout(() => takeTurn(), 1000);
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
    setAnswers([]);
    setQuestions([]);
    endGame();
  }, [saved, gameOver]);

  const directions = (
    <div className="directions">
      <h5>Directions</h5>
      <p>
        `A statement will be shown with four choices. Select the correct answer
        for the maximum number of points. Incorrect answers will receive less
        points and make two incorrect choices will yield no points. Select all
        incorrect answers and you will LOSE a point. Good luck!`
      </p>
      <Button
        variant="contained"
        className="btn btn-lg btn-success"
        onClick={() => takeTurn()}
      >
        Start Game
      </Button>
    </div>
  );
  let answerChoices;
  if (answers && answers.length > 0) {
    if (questions < 0) {
      answerChoices = [];
    } else {
      answerChoices = answers.map((answer) => {
        return (
          <ListItemButton
            onClick={() => checkAnswer(answer)}
            value={answer.id}
            key={answer.id}
            sx={{
              marginTop: '10px',
              margin: '10px 8px none',
              padding: '10px',
              borderRadius: '3px',
              backgroundColor: answer.correct === 0 ? 'green' : 'blue'
            }}
            component={Card}
            disabled={answer.correct === 1}
          >
            {answer.name}
          </ListItemButton>
        );
      });
    }
  }
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
      {answers && answers.length > 0 ? (
        <List className="px-0 d-flex justify-content-center flex-wrap">
          {answerChoices}
        </List>
      ) : null}
    </div>
  );
};

Choice.propTypes = {
  data: dataType.isRequired,
  isStarted: PropTypes.bool.isRequired,
  saved: PropTypes.bool.isRequired,
  gameOver: PropTypes.bool.isRequired,
  handlePoints: PropTypes.func.isRequired,
  handleOpen: PropTypes.func.isRequired,
  endGame: PropTypes.func.isRequired,
  updateScore: PropTypes.func.isRequired,
  startGame: PropTypes.func.isRequired
};

export default Choice;
