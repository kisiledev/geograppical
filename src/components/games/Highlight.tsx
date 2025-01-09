import React, { useState, useEffect } from 'react';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography
} from 'react-simple-maps';
import ReactTooltip from 'react-tooltip';
import {
  faPlus,
  faMinus,
  faGlobeAfrica
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Breakpoint, { BreakpointProvider } from 'react-socks';
import PropTypes from 'prop-types';
import { Box, Button, ButtonGroup, Typography } from '@mui/material';
import * as d3 from 'd3';
import {
  Answer,
  DataType,
  dataType,
  Question
} from '../../helpers/types/index';
import data from '../../data/world-50m.json';
import gameModes from '../../constants/GameContent';
import { CountryType } from '../../helpers/types/CountryType';

interface HighlightProps {
  data: DataType;
  isStarted: boolean;
  saved: boolean;
  gameOver: boolean;
  handlePoints: Function;
  handleOpen: Function;
  updateScore: Function;
  startGame: Function;
  mapVisible: string;
  changeMapView: Function;
  mode: keyof typeof gameModes;
}
const Highlight = (props: HighlightProps) => {
  const [currentCountry, setCurrentCountry] = useState<CountryType | null>(
    null
  );
  const [currentCountryId, setCurrentCountryId] = useState<number | null>(null);
  const [guesses, setGuesses] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [center, setCenter] = useState<[number, number]>([0, 0]);
  const [zoom, setZoom] = useState(1);
  const [answers, setAnswers] = useState<Answer[] | null>(null);

  console.log(props);
  const {
    isStarted,
    gameOver,
    mapVisible,
    changeMapView,
    data: worldData,
    startGame,
    updateScore,
    handlePoints,
    handleOpen,
    saved,
    mode
  } = props;

  console.log(gameModes, mode);
  const proj = d3
    .geoEqualEarth()
    .translate([800 / 2, 400 / 2])
    .scale(150);

  const endGame = () => {
    setQuestions([]);
    setGuesses(0);
    setCurrentCountry(null);
  };

  const handleZoomIn = () => {
    setZoom((prevZoom) => prevZoom * 2);
  };
  const handleZoomOut = () => {
    setZoom((prevZoom) => prevZoom / 2);
  };
  const handleText = (str: string) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z\s]/gi, '');
  };
  const handleMoveStart = ({
    coordinates
  }: {
    coordinates: [number, number];
  }) => {
    console.log(coordinates);
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
  const handleWheel = (event: React.WheelEvent) => {
    const oldZoom = zoom;
    const zoomDirectionFactor = event.deltaY > 0 ? 1 : -1;

    // Set new zoom level
    const newZoom = oldZoom + zoomDirectionFactor;
    // Ignore nonsens
    if (newZoom > 10 || newZoom < 1) {
      return null;
    }
    // const cursor = getCursorLocation(event);
    // const oldCenter = center;

    // const newCenter = [
    //   oldCenter[0] +
    //     ((cursor[0] - oldCenter[0]) / newZoom) * zoomDirectionFactor,
    //   oldCenter[1] +
    //     ((cursor[1] - oldCenter[1]) / newZoom) * zoomDirectionFactor
    // ];
    // setState({zoom: newZoom, center: newCenter})
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
    const int = getRandomInt(0, worldData.length);
    const country = worldData[int];
    setCurrentCountryId(int);
    return country;
  };
  const randomExcluded = (min: number, max: number, excluded: number) => {
    let n = Math.floor(Math.random() * (max - min) + min);
    if (n >= excluded) n += 1;
    return n;
  };

  const getAnswers = (currentCountry: CountryType) => {
    let answerQuestions: Question[] = [];
    if (questions) {
      answerQuestions = [...questions];
    }
    const question: Question = {
      country: '',
      answers: [],
      correct: null
    };
    question.country = currentCountry.name;
    question.correct = null;
    const fetchanswers = [];
    if (currentCountry) {
      fetchanswers.push({
        name: currentCountry.name.split(';')[0],
        id: 0,
        correct: 2
      });
    }
    if (!currentCountryId) {
      return;
    }
    for (let x = 0; x < 3; x += 1) {
      let ran = randomExcluded(0, worldData.length - 1, currentCountryId);
      let newName;
      if (worldData[ran].name || ran < 0) {
        [newName] = worldData[ran].name.split(';');
      } else {
        ran = randomExcluded(0, worldData.length - 1, currentCountryId);
        [newName] = worldData[ran].name.split(';');
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
    if (answerQuestions !== questions) {
      answerQuestions.push(question);
    }
    setQuestions(answerQuestions);
  };
  const getCountryInfo = (country: CountryType) => {
    let nodes = [
      ...(document.getElementsByClassName(
        'gameCountry'
      ) as HTMLCollectionOf<HTMLElement>)
    ];
    if (currentCountry && country) {
      nodes = nodes.filter((node) => {
        if (node.dataset.shortname && node.dataset.longname) {
          handleText(country.name) === handleText(node.dataset.longname) ||
            handleText(country.name) === handleText(node.dataset.shortname);
        }
      });
    }
    // highVisibility = (nodes) => {
    //   const highViz = country.name;
    //   console.log(highViz + ' - ' + currentCountry.name);
    //   nodes.forEach( (node) => {
    //     node.style.outline =  'solid red';
    //     node.style.outlineOffset = '10px';
    //   });
    // };
    const changeStyle = (nodes: HTMLElement[]) => {
      nodes.forEach((node) => {
        node.style.fill = '#FF0000';
        node.style.stroke = '#111';
        node.style.strokeWidth = '0.1';
        node.style.outline = 'solid red';
        node.style.outlineOffset = '10px';
        node.style.boxShadow = '0 0 10px #9ecaed';
        node.style.transition = 'all 250ms';
      });
    };
    if (currentCountry) {
      setTimeout(() => changeStyle(nodes), 300);
    }
  };

  const takeTurn = () => {
    if (!isStarted) {
      startGame();
    }
    const country = getRandomCountry();
    setGuesses((prevGuess) => prevGuess + 1);
    setCurrentCountry(country);
    getAnswers(country);
    if (questions && questions.length < 10) {
      getCountryInfo(country);
    }
    const nodes = [...document.getElementsByClassName('gameCountry')];
    // console.log(filterNations)
    nodes.forEach((node) => {
      node.removeAttribute('style');
    });
    if (questions && questions.length === 10) {
      handleOpen();
      // alert("Congrats! You've reached the end of the game. You answered " + correct + " questions correctly and " + incorrect + " incorrectly.\n Thanks for playing");
      const nodes = [...document.getElementsByClassName('gameCountry')];
      // console.log(filterNations)
      nodes.forEach((node) => {
        node.removeAttribute('style');
      });
    }
  };

  const checkAnswer = (country: Answer) => {
    if (!isStarted) {
      return;
    }
    if (!currentCountry) {
      return;
    }
    const checkquestions = questions;
    const checkquestion = checkquestions.find(
      (question) => question.country === currentCountry.name
    );
    if (!checkquestion) {
      return;
    }
    let checkguesses = guesses;
    if (
      country.name === currentCountry.name ||
      country.name === currentCountry.name ||
      guesses === 4
    ) {
      // give score of 2
      updateScore(3 - guesses);

      if (!checkquestion) {
        return;
      }
      // set answer style
      country.correct = 0;
      // initialize correct counter for game
      if (guesses === 1) {
        checkquestion.correct = true;
      }
      checkguesses = 0;
      setTimeout(() => takeTurn(), 300);
    } else {
      country.correct = 1;
      checkquestion.correct = false;
      checkguesses += 1;
    }
    setGuesses(checkguesses);
    handlePoints(questions);
  };
  useEffect(() => {
    handlePoints(questions);
  }, [questions]);
  useEffect(() => {
    endGame();
  }, [saved, gameOver]);

  useEffect(() => {
    if (currentCountry) {
      getCountryInfo(currentCountry);
    }
  }, [currentCountry]);

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
  let answerChoices;
  if (answers && answers.length > 0) {
    if (questions.length < 0) {
      answerChoices = [];
    } else {
      answerChoices = answers.map((answer) => {
        const navClass = 'possible card mx-1 mt-3';
        const correct = 'bg-success possible card mx-1 mt-3';
        const incorrect = 'bg-danger possible card mx-1 mt-3 disabled';
        return (
          <li
            role="button"
            onClick={() => checkAnswer(answer)}
            className={
              answer.correct === 2
                ? navClass
                : answer.correct === 1
                ? incorrect
                : correct
            }
            value={answer.id}
            key={answer.id}
          >
            {answer.name}
          </li>
        );
      });
    }
  }
  return (
    <BreakpointProvider>
      <Box sx={{ marginBottom: '5px', marginRight: '5px' }}>
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
        <Breakpoint small up>
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
        </Breakpoint>
        <hr />
        {answers && answers.length > 0 && (
          <ul className="px-0 d-flex flex-wrap">{answerChoices}</ul>
        )}
        {mapVisible === 'Show' ? (
          <div onWheel={handleWheel}>
            <ComposableMap
              width={800}
              height={400}
              projection="geoEqualEarth"
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
                <Geographies geography={data}>
                  {({ geographies, projection }) =>
                    geographies.map((geo, i) => (
                      <Geography
                        data-idkey={i}
                        data-longname={handleText(geo.properties.NAME_LONG)}
                        data-shortname={geo.properties.NAME}
                        data-continent={geo.properties.CONTINENT}
                        data-subregion={geo.properties.SUBREGION}
                        // onMouseEnter={(() => onRegionHover(geo))}
                        // onMouseLeave={(() => onRegionLeave(geo))}
                        onClick={() => checkAnswer(geo.properties.NAME_LONG)}
                        key={geo.properties.NAME}
                        geography={geo}
                        className="gameCountry"
                      />
                    ))
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          </div>
        ) : null}
        <ReactTooltip place="top" type="dark" effect="float" />
      </Box>
    </BreakpointProvider>
  );
};

Highlight.propTypes = {
  data: dataType.isRequired,
  isStarted: PropTypes.bool.isRequired,
  saved: PropTypes.bool.isRequired,
  gameOver: PropTypes.bool.isRequired,
  handlePoints: PropTypes.func.isRequired,
  handleOpen: PropTypes.func.isRequired,
  updateScore: PropTypes.func.isRequired,
  startGame: PropTypes.func.isRequired,
  mapVisible: PropTypes.string.isRequired,
  changeMapView: PropTypes.func.isRequired
};
export default Highlight;
// const BlockPageScroll = ({ children }) => {
//   const scrollRef = useRef(null);
//   useEffect(() => {
//     const scrollEl = scrollRef.current;
//     scrollEl.addEventListener('wheel', stopScroll);
//     return () => scrollEl.removeEventListener('wheel', stopScroll);
//   }, []);
//   const stopScroll = (e) => e.preventDefault();
//   return <div ref={scrollRef}>{children}</div>;
// };
