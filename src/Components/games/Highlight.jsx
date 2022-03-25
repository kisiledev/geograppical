import React, { useState, useEffect } from 'react';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from 'react-simple-maps';
import { geoEqualEarth } from 'd3-geo';
import ReactTooltip from 'react-tooltip';
import { faPlus, faMinus, faGlobeAfrica } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Breakpoint, { BreakpointProvider } from 'react-socks';
import PropTypes from 'prop-types';
import {
  dataType,
} from '../../helpers/Types/index';
import data from '../../data/world-50m.json';

const Highlight = (props) => {
  const [currentCountry, setCurrentCountry] = useState(null);
  const [currentCountryId, setCurrentCountryId] = useState(null);
  const [guesses, setGuesses] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [center, setCenter] = useState([0, 0]);
  const [zoom, setZoom] = useState(1);
  const [regions, setRegions] = useState('');
  const [continents, setContinents] = useState('');
  const [countries, setCountries] = useState('');
  // const [bypassClick, setBypassClick] = useState(false);
  const [answers, setAnswers] = useState(null);

  const {
    isStarted,
    gameOver,
    mapVisible,
    changeMapView,
    worldData,
    startGame,
    updateScore,
    handlePoints,
    handleOpen,
    saved,
  } = props;

  const proj = () => {
    return geoEqualEarth()
      .translate([800 / 2, 400 / 2])
      .scale(150);
  };

  const endGame = () => {
    setQuestions([]);
    setGuesses(null);
    setCurrentCountry(null);
  };

  const getMapNations = () => {
    const mapCountries = [...(document.getElementsByClassName('gameCountry'))];
    const totalMapRegions = mapCountries.map((a) => a.dataset.subregion.replace(/;/g, ''));
    let uniqueMapRegions = totalMapRegions.filter((v, i, a) => a.indexOf(v) === i);
    uniqueMapRegions = uniqueMapRegions.filter(Boolean);
    const totalMapContinents = mapCountries.map((a) => a.dataset.continent.replace(/;/g, ''));
    let uniqueMapContinents = totalMapContinents.filter((v, i, a) => a.indexOf(v) === i);
    uniqueMapContinents = uniqueMapContinents.filter(Boolean);
    setCountries(mapCountries);
    setRegions(uniqueMapRegions);
    setContinents(uniqueMapContinents);
  };

  const getRegion = (region) => {
    const nodes = [...(document.getElementsByClassName('gameCountry'))];
    const match = nodes.filter((node) => node.dataset.subregion === region);
    return match;
  };

  const getContinent = (continent) => {
    const nodes = [...(document.getElementsByClassName('gameCountry'))];
    const match = nodes.filter((node) => node.dataset.continent === continent);
    return match;
  };

  const setDynamicRegions = (regs) => {
    if (!regs) {
      return;
    }
    const regionsState = {};
    if (regions.length > 0) {
      regions.forEach((region) => {
        if (regions[region] && regions[region].countries[0]) {
          regionsState[region] = {
            visible: 5,
            start: 0,
            countries: regions[region].countries,
            open: false,
          };
        } else {
          getRegion(region);
          regionsState[region] = {
            visible: 5,
            start: 0,
            countries: getRegion(region),
            open: false,
          };
        }
      });
    }
    setRegions({ ...regionsState });
  };

  const setDynamicContinents = (conts) => {
    if (!conts) {
      return;
    }

    const continentsState = {};
    if (conts.length > 0) {
      conts.forEach((continent) => {
        if (conts[continent] && conts[continent].countries[0]) {
          continentsState[continent] = { id: continent, countries: conts[continent].countries };
        } else {
          getContinent(continent);
          continentsState[continent] = { id: continent, countries: getContinent(continent) };
        }
      });
    }
    // set state here outside the foreach function
    setContinents({ ...continentsState });
    //  setState({continents: {...continentsState}})
  };
  const setLocations = (regs, conts) => {
    setDynamicContinents(conts);
    setDynamicRegions(regs);
  };
  const handleZoomIn = () => {
    setZoom((prevZoom) => prevZoom * 2);
  };
  const handleZoomOut = () => {
    setZoom((prevZoom) => prevZoom / 2);
  };
  const handleText = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z\s]/ig, '');
  };
  const handleMoveStart = (newCenter) => {
    setCenter(newCenter);
    // setBypassClick(true);
  };

  const handleMoveEnd = (newCenter) => {
    setCenter(newCenter);
    // setBypassClick(JSON.stringify(newCenter) !== JSON.stringify(center));
  };
  const handleWheel = (event) => {
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
    const int = getRandomInt(0, worldData.length);
    const country = worldData[int];
    setCurrentCountryId(int);
    return country;
  };
  const randomExcluded = (min, max, excluded) => {
    let n = Math.floor(Math.random() * (max - min) + min);
    if (n >= excluded) n += 1;
    return n;
  };

  const getAnswers = (currentCountry) => {
    let answerQuestions;
    if (questions) {
      answerQuestions = [...questions];
    }
    const question = {};
    question.country = currentCountry.name;
    question.correct = null;
    const fetchanswers = [];
    if (currentCountry) {
      fetchanswers.push({
        name: currentCountry.name.split(';')[0],
        id: 0,
        correct: 2,
      });
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
        correct: 2,
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
  const getCountryInfo = (country) => {
    let nodes = (document.getElementsByClassName('gameCountry'));
    nodes = [...nodes];
    if (currentCountry && country) {
      nodes = nodes.filter(
        (node) => handleText(country.name) === handleText(node.dataset.longname)
        || handleText(country.name) === handleText(node.dataset.shortname),
      );
    }
    // highVisibility = (nodes) => {
    //   const highViz = country.name;
    //   console.log(highViz + ' - ' + currentCountry.name);
    //   nodes.forEach( (node) => {
    //     node.style.outline =  'solid red';
    //     node.style.outlineOffset = '10px';
    //   });
    // };
    const changeStyle = (nodes) => {
      nodes.forEach((node) => {
        node.style.fill = '#FF0000';
        node.style.stroke = '#111';
        node.style.strokeWidth = 0.1;
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
    const nodes = [...(document.getElementsByClassName('gameCountry'))];
    // console.log(filterNations)
    nodes.forEach((node) => {
      node.removeAttribute('style');
    });
    if (questions && questions.length === 10) {
      handleOpen();
      // alert("Congrats! You've reached the end of the game. You answered " + correct + " questions correctly and " + incorrect + " incorrectly.\n Thanks for playing");
      const nodes = [...(document.getElementsByClassName('gameCountry'))];
      // console.log(filterNations)
      nodes.forEach((node) => {
        node.removeAttribute('style');
      });
    }
  };

  const checkAnswer = (country) => {
    if (!isStarted) {
      return;
    }
    const checkquestions = questions;
    const checkquestion = checkquestions.find((question) => question.country === currentCountry.name);
    let checkguesses = guesses;
    if ((country.name === currentCountry.name || country.name === currentCountry.name) || guesses === 4) {
      // give score of 2
      updateScore(3 - guesses);
      // set answer style
      country.correct = 0;
      // initialize correct counter for game
      if (guesses === 1) {
        checkquestion.correct = true;
      }
      checkguesses = null;
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
    getMapNations();
  }, []);

  useEffect(() => {
    if (currentCountry) {
      getCountryInfo(currentCountry);
    }
  }, [currentCountry]);

  useEffect(() => {
    setDynamicRegions(regions);
    setLocations(regions, continents);

  }, []);

  useEffect(() => {
    setLocations(regions, continents);
  }, [countries]);

  useEffect(() => {
    endGame();
  }, [saved, gameOver]);

  const directions = (
    <div className="directions">
      <h5>Directions</h5>
      <p>The map will show a highlighted country. Select the correct answer from the choices below for the maximum number of points. Incorrect answers will receive less points and make two incorrect choices will yield no points. Select all incorrect answers and you will LOSE a point. Good luck!</p>
      <button
        className="btn btn-lg btn-success"
        onClick={() => takeTurn()}
        type="button"
      >
        Start Game
      </button>
    </div>
  );
  let answerChoices;
  if (answers && answers.length > 0) {
    if (questions < 0) {
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
            className={answer.correct === 2 ? navClass : (answer.correct === 1 ? incorrect : correct)}
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
      <div className="mr-3 mb-3">
        {!isStarted && directions}
        {isStarted && guesses && (
        <div>
          {`${guesses} ${(guesses === 1) ? ' guess' : ' guesses'}`}
        </div>
        )}
        {isStarted && guesses && (
        <div>
          {`For ${3 - guesses} ${(guesses === 2 || guesses === 4) ? ' point' : ' points'}`}
        </div>
        )}
        <Breakpoint small up>
          <div className="d-flex justify-content-between">
            <div className="btn-group d-inline">
              <button
                className="btn btn-info"
                type="button"
                onClick={() => handleZoomOut(zoom)}
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <button
                type="button"
                className="btn btn-info"
                onClick={() => handleZoomIn(zoom)}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            <button
              type="button"
              className="btn btn-info"
              onClick={() => changeMapView()}
            >
              <FontAwesomeIcon icon={faGlobeAfrica} />
              { (mapVisible === 'Show') ? 'Hide' : 'Show'}
              Map
            </button>
          </div>
        </Breakpoint>
        <hr />
        {answers && answers.length > 0 && <ul className="px-0 d-flex flex-wrap">{answerChoices}</ul>}
        {mapVisible === 'Show'
          ? (
            <div
              onWheel={handleWheel}
            >
              <ComposableMap
                width={800}
                height={400}
                projection={proj}
                style={{
                  width: '100%',
                  height: 'auto',
                }}
              >
                <ZoomableGroup
                  zoom={zoom}
                  center={center}
                  onMoveStart={handleMoveStart}
                  onMoveEnd={handleMoveEnd}
                >
                  <Geographies geography={data}>
                    {(geos, proj) => geos.map((geo, i) => (
                      <Geography
                        data-idkey={i}
                        data-longname={handleText(geo.properties.NAME_LONG)}
                        data-shortname={geo.properties.NAME}
                        data-continent={geo.properties.CONTINENT}
                        data-subregion={geo.properties.SUBREGION}
                        // onMouseEnter={(() => onRegionHover(geo))}
                        // onMouseLeave={(() => onRegionLeave(geo))}
                        onClick={((e) => checkAnswer(e, geo.properties.NAME_LONG))}
                        key={geo.properties.NAME}
                        geography={geo}
                        projection={proj}
                        className="gameCountry"
                      />
                    ))}
                  </Geographies>
                </ZoomableGroup>
              </ComposableMap>
            </div>
          )
          : null }
        <ReactTooltip place="top" type="dark" effect="float" />
      </div>
    </BreakpointProvider>
  );
};

Highlight.propTypes = {
  worldData: dataType.isRequired,
  isStarted: PropTypes.bool.isRequired,
  saved: PropTypes.bool.isRequired,
  gameOver: PropTypes.bool.isRequired,
  handlePoints: PropTypes.func.isRequired,
  handleOpen: PropTypes.func.isRequired,
  updateScore: PropTypes.func.isRequired,
  startGame: PropTypes.func.isRequired,
  mapVisible: PropTypes.string.isRequired,
  changeMapView: PropTypes.func.isRequired,
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
