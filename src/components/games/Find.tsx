import { useState, useEffect, useCallback } from 'react';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography
} from 'react-simple-maps';
import ReactTooltip from 'react-tooltip';
import { Box, Button, ButtonGroup, Typography } from '@mui/material';
import { Answer, DataType, Question } from '../../helpers/types/index';
import data from '../../data/world-50m.json';
import gameModes from '../../constants/GameContent';
import { CountryType } from '../../helpers/types/CountryType';
import MediaQuery from 'react-responsive';
import { Add, Public, Remove, Replay } from '@mui/icons-material';
import { geoPath } from 'd3-geo';
import * as d3 from 'd3';

interface FindProps {
  isStarted: boolean;
  data: DataType;
  startGame: () => void;
  handleOpen: () => void;
  changeMapView: () => void;
  updateScore: (int: number) => void;
  handlePoints: (q: Question[]) => void;
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
  const [answer, setAnswer] = useState<{ guessed: boolean; correct: boolean }>({
    guessed: false,
    correct: false
  });
  const [points, setPoints] = useState<number>(2);
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

  const projection = () => {
    return d3
      .geoEqualEarth()
      .translate([800 / 2, 450 / 2])
      .scale(160);
  };
  const endGame = useCallback(() => {
    setQuestions([]);
    setGuesses(0);
    setCurrentCountry(null);
  }, []);
  const getRandomInt = (min: number, max: number) => {
    const minCeil = Math.ceil(min);
    const maxFloor = Math.floor(max);
    return Math.floor(Math.random() * (maxFloor - minCeil)) + minCeil;
  };
  const getRandomCountry = useCallback(() => {
    const int = getRandomInt(0, worldData.length);
    const country = worldData[int];
    return country;
  }, [worldData]);

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
    resetZoom();
    setAnswer({ guessed: false, correct: false });
    setPoints(2);
    setGuesses(0);
    if (questions && questions.length === 10) {
      handleOpen();
      if (gameOver) {
        endGame();
      }
    }
  };
  const resetZoom = () => {
    setZoom(1);
    setCenter([0, 0]);
  };
  const getCountryInfo = useCallback((country: string) => {
    let nodes = [
      ...(document.getElementsByClassName(
        'gameCountry'
      ) as HTMLCollectionOf<HTMLElement>)
    ];
    nodes = nodes.filter((y) => {
      if (y.dataset.shortname && y.dataset.longname) {
        return (
          handleText(country) === handleText(y.dataset.longname) ||
          handleText(country) === handleText(y.dataset.shortname)
        );
      }
    });
    nodes.forEach((node) => {
      if (node.dataset.geography) {
        const path = geoPath().projection(projection());
        const geo = JSON.parse(node.dataset.geography);
        const centroid = d3.geoCentroid(geo);
        setCenter(centroid);
        setZoom(6);
      }
    });
    const changeStyle = (n: HTMLElement[]) => {
      n.forEach((node) => {
        node.style.fill = '#FF0000';
        node.style.stroke = '#111';
        node.style.strokeWidth = '0.5px';
        node.style.strokeMiterlimit = '10';
        node.style.outline = 'none';
        node.style.boxShadow = '0 0 10px #9ecaed';
        node.style.transition = 'all 250ms';
        if (node.dataset.geography) {
          const path = geoPath().projection(projection());
          const area = path.area(JSON.parse(node.dataset.geography));
          if (area < 20) {
            node.style.outline = '1px solid blue';
          }
        }
      });
    };
    setTimeout(() => changeStyle(nodes), 300);
  }, []);

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
      setAnswer((prevState) => ({
        ...prevState,
        guessed: true,
        correct: true
      }));
      checkguesses = 0;
      setTimeout(() => {
        takeTurn();
      }, 1900);
    } else {
      foundquestion.correct = false;
      checkguesses += 1;
      setAnswer((prevState) => ({
        ...prevState,
        guessed: true,
        correct: false
      }));
      if (guesses === 3) {
        getCountryInfo(currentCountry.name);
      }
      setPoints(Math.max(0, points - 1));
    }
    setGuesses(checkguesses);
    handlePoints(questions);
    setReadyToCheck(false);
  };

  useEffect(() => {
    handlePoints(questions);
  }, [handlePoints, questions]);

  useEffect(() => {
    if (readyToCheck && selectedCountry) {
      checkAnswer(selectedCountry);
    }
  }, [readyToCheck, selectedCountry, currentCountry, checkAnswer]);

  useEffect(() => {
    endGame();
  }, [saved, gameOver, endGame]);

  const directions = (
    <Box className="directions">
      <Typography variant="h5">Directions</Typography>
      <Typography variant="body1">{gameModes[mode].directions}</Typography>
      <Box sx={{ margin: '10px' }}>
        <Button
          disabled={worldData?.length === 0}
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
    <Box sx={{ marginBottom: '5px', marginRight: '5px' }}>
      {!isStarted && directions}
      <MediaQuery minWidth={576}>
        <Box
          sx={{
            alignItems: 'center',
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
              <Remove />
            </Button>
            <Button
              variant="contained"
              className="btn btn-info"
              onClick={() => handleZoomIn()}
            >
              <Add />
            </Button>
            <Button
              type="button"
              className="btn btn-info"
              size="small"
              onClick={() => resetZoom()}
            >
              <Replay />
            </Button>
          </ButtonGroup>
          <Box sx={{ textAlign: 'center' }}>
            {zoom}
            {currentCountry && (
              <Typography variant="h5">{`Find ${currentCountry.name}`}</Typography>
            )}
            {isStarted && (
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                {guesses > 0 && guesses < 4 && (
                  <Typography variant="body1">
                    {guesses} {guesses === 1 ? 'guess' : 'guesses'} - For{' '}
                    {points} {points === 1 ? 'point' : 'points'}
                  </Typography>
                )}
                {answer.guessed && answer.correct && (
                  <Typography
                    variant="body1"
                    sx={{ color: 'green', fontWeight: 'bold' }}
                  >
                    Correct! You earned {points}{' '}
                    {points === 1 ? 'point' : 'points'}!
                  </Typography>
                )}
                {answer.guessed && !answer.correct && guesses !== 4 && (
                  <Typography variant="body1" sx={{ color: 'red' }}>
                    Not quite - try again, you've got this!
                  </Typography>
                )}
                {guesses === 4 && (
                  <Button
                    variant="contained"
                    onClick={() => takeTurn()}
                    sx={{ marginTop: '5px' }}
                  >
                    Next Question
                  </Button>
                )}
              </Box>
            )}
          </Box>
          <Button
            variant="contained"
            onClick={() => changeMapView()}
            startIcon={<Public sx={{ marginRight: '5px' }} />}
          >
            {mapVisible === 'Show' ? 'Hide ' : 'Show '}
            Map
          </Button>
        </Box>
      </MediaQuery>
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
            onMoveEnd={({ coordinates, zoom }) => {
              setZoom(zoom);
              setCenter(coordinates);
            }}
          >
            <Geographies
              geography={data}
              parseGeographies={(geos) => {
                return geos.map((g) => {
                  return g;
                });
              }}
            >
              {({ geographies: geos }) => {
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
                    data-geography={JSON.stringify(geo)}
                    className="gameCountry"
                  />
                ));
              }}
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      ) : null}
      <ReactTooltip place="top" type="dark" effect="float" />
    </Box>
  );
};

export default Find;
