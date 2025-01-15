import React, { useState, useEffect } from 'react';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography
} from 'react-simple-maps';
import { geoEqualEarth } from 'd3-geo';
import * as d3 from 'd3';
import ReactTooltip from 'react-tooltip';
import {
  faPlus,
  faMinus,
  faGlobeAfrica
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import PropTypes from 'prop-types';
import { Box, Button, ButtonGroup, Typography } from '@mui/material';
import { DataType, Question } from '../../helpers/types/index';
import data from '../../data/world-50m.json';
import gameModes from '../../constants/GameContent';
import { CountryType } from '../../helpers/types/CountryType';
import MediaQuery from 'react-responsive';

interface FindProps {
  isStarted: boolean;
  data: DataType;
  startGame: Function;
  handleOpen: Function;
  changeMapView: Function;
  updateScore: Function;
  handlePoints: Function;
  gameOver: boolean;
  saved: boolean;
  mapVisible: string;
  mode: keyof typeof gameModes;
}
const Find = (props: FindProps) => {
  const [currentCountry, setCurrentCountry] = useState<CountryType | null>(
    null
  );
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [guesses, setGuesses] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [center, setCenter] = useState<[number, number]>([0, 0]);
  const [zoom, setZoom] = useState(1);
  const [readyToCheck, setReadyToCheck] = useState(false);
  // const [bypassClick, setBypassClick] = useState(false);

  const {
    isStarted,
    data: worldData,
    startGame,
    handleOpen,
    changeMapView,
    updateScore,
    handlePoints,
    gameOver,
    saved,
    mapVisible,
    mode
  } = props;

  const proj = d3
    .geoEqualEarth()
    .translate([800 / 2, 400 / 2])
    .scale(150);

  const endGame = () => {
    setQuestions([]);
    setGuesses(0);
    setCurrentCountry(null);
  };
  const getRandomInt = (min: number, max: number) => {
    const minCeil = Math.ceil(min);
    const maxFloor = Math.floor(max);
    return Math.floor(Math.random() * (maxFloor - minCeil)) + minCeil;
  };
  const getRandomCountry = () => {
    const int = getRandomInt(0, worldData.length);
    const country = worldData[int];
    return country;
  };

  const handleZoomIn = () => {
    setZoom((prevZoom) => prevZoom * 2);
  };
  const handleZoomOut = () => {
    setZoom((prevZoom) => prevZoom / 2);
  };
  const handleText = (str: string) =>
    str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z\s]/gi, '');
  const handleMoveStart = ({
    coordinates
  }: {
    coordinates: [number, number];
  }) => {
    setCenter(coordinates);
    // setBypassClick(true);
  };

  const handleMoveEnd = ({
    coordinates
  }: {
    coordinates: [number, number];
  }) => {
    setCenter(coordinates);
    // setBypassClick(JSON.stringify(newCenter) !== JSON.stringify(center));
  };

  const getAnswers = (curcountry: CountryType) => {
    let answerQuestions: Question[] = [];
    if (questions) {
      answerQuestions = [...questions];
    }
    const question: Question = {
      country: '',
      answers: [],
      correct: null
    };
    question.country = curcountry.name;
    question.correct = null;
    const answers = [];
    if (curcountry) {
      answers.push({
        name: curcountry.name.split(';')[0],
        correct: 2
      });
    }
    answerQuestions.push(question);
    setQuestions(answerQuestions);
  };

  const takeTurn = () => {
    if (!isStarted) {
      startGame();
    }
    const country = getRandomCountry();
    setGuesses((prevGuess) => (prevGuess !== null ? prevGuess + 1 : 1));
    setCurrentCountry(country);
    getAnswers(country);
    const nodes = [...document.getElementsByClassName('gameCountry')];
    nodes.forEach((node) => {
      node.removeAttribute('style');
    });
    if (questions && questions.length === 10) {
      handleOpen();
      if (gameOver) {
        endGame();
      }
    }
  };
  const getCountryInfo = (country: string) => {
    let nodes = [
      ...(document.getElementsByClassName(
        'gameCountry'
      ) as HTMLCollectionOf<HTMLElement>)
    ];
    nodes = nodes.filter((y) => {
      if (y.dataset.shortname && y.dataset.longname) {
        handleText(country) === handleText(y.dataset.longname) ||
          handleText(country) === handleText(y.dataset.shortname);
      }
    });
    const changeStyle = (n: HTMLElement[]) => {
      n.forEach((node) => {
        node.style.fill = '#FF0000';
        node.style.stroke = '#111';
        node.style.strokeWidth = '1px';
        node.style.outline = 'none';
        node.style.boxShadow = '0 0 10px #9ecaed';
        node.style.transition = 'all 250ms';
      });
    };
    setTimeout(() => changeStyle(nodes), 300);
  };

  const handleClick = (country: string) => {
    setReadyToCheck(true);
    setSelectedCountry(country);
  };
  const checkAnswer = (country: string) => {
    if (!currentCountry) {
      return;
    }

    // if answer is correct answer (all correct answers have ID of 0)
    const checkquestions = questions;
    const foundquestion = checkquestions.find(
      (question) => question.country === currentCountry.name
    );
    if (!foundquestion) {
      return;
    }
    let checkguesses = guesses;
    if (
      country === currentCountry.name ||
      country === currentCountry.name ||
      guesses === 4
    ) {
      updateScore(3 - guesses);

      if (!foundquestion) {
        return;
      }
      if (guesses === 1) {
        foundquestion.correct = true;
      }
      checkguesses = 0;
      setTimeout(() => takeTurn(), 300);
    } else {
      foundquestion.correct = false;
      checkguesses += 1;
      if (guesses === 3) {
        getCountryInfo(currentCountry.name);
      }
    }
    setGuesses(checkguesses);
    handlePoints(questions);
    setReadyToCheck(false);
  };

  useEffect(() => {
    handlePoints(questions);
  }, []);

  useEffect(() => {
    if (currentCountry) {
      getAnswers(currentCountry);
    }
  }, []);

  useEffect(() => {
    if (readyToCheck && selectedCountry) {
      checkAnswer(selectedCountry);
    }
  }, [readyToCheck, selectedCountry, currentCountry]);

  useEffect(() => {
    endGame();
  }, [saved, gameOver]);

  const directions = (
    <Box className="directions">
      <Typography variant="h5">Directions</Typography>
      <Typography variant="body1">{gameModes[mode].directions}</Typography>
      <Box sx={{ margin: '10px' }}>
        <Button variant="contained" color="success" onClick={() => takeTurn()}>
          Start Game
        </Button>
      </Box>
    </Box>
  );
  return (
    <div className="mr-3 mb-3">
      {!isStarted && directions}
      {isStarted && guesses && (
        <div>{`${guesses} ${guesses === 1 ? ' guess' : ' guesses'}`}</div>
      )}
      {isStarted && guesses && (
        <div>
          {`For ${3 - guesses} ${
            guesses === 2 || guesses === 4 ? ' point' : ' points'
          }`}
        </div>
      )}
      <MediaQuery minWidth={576}>
        <Box
          sx={{
            justifyContent: 'space-between',
            display: 'flex',
            margin: '10px 0px'
          }}
        >
          <ButtonGroup variant="contained">
            <Button
              variant="contained"
              className="btn btn-info"
              onClick={() => handleZoomOut()}
            >
              <FontAwesomeIcon icon={faMinus} />
            </Button>
            <Button
              variant="contained"
              className="btn btn-info"
              onClick={() => handleZoomIn()}
            >
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </ButtonGroup>
          <Button
            variant="contained"
            onClick={() => changeMapView()}
            startIcon={
              <FontAwesomeIcon className="mr-1" icon={faGlobeAfrica} />
            }
          >
            {mapVisible === 'Show' ? 'Hide ' : 'Show '}
            Map
          </Button>
        </Box>
      </MediaQuery>
      <hr />
      {currentCountry && <div>{`Find ${currentCountry.name}`}</div>}
      {mapVisible === 'Show' ? (
        <ComposableMap
          width={800}
          height={400}
          projection={'geoEqualEarth'}
          style={{
            width: '100%',
            height: 'auto'
          }}
        >
          <ZoomableGroup
            zoom={zoom}
            center={center}
            onMoveStart={handleMoveStart}
            onMoveEnd={handleMoveEnd}
          >
            <Geographies
              geography={data}
              parseGeographies={(geos) => {
                return geos.map((g) => {
                  return g;
                });
              }}
            >
              {({ geographies: geos, projection: proj }) => {
                return geos.map((geo, i) => (
                  <Geography
                    data-idkey={i}
                    data-longname={handleText(geo.properties.NAME_LONG)}
                    data-shortname={geo.properties.NAME}
                    data-continent={geo.properties.CONTINENT}
                    data-subregion={geo.properties.SUBREGION}
                    onClick={() => handleClick(geo.properties.NAME_LONG)}
                    key={geo.properties.NAME}
                    geography={geo}
                    className="gameCountry"
                  />
                ));
              }}
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      ) : null}
      <ReactTooltip place="top" type="dark" effect="float" />
    </div>
  );
};

export default Find;
