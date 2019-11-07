/* eslint-disable no-shadow */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
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
} from '../Helpers/Types/index';
import data from '../Data/world-50m.json';

const Find = (props) => {
  const [currentCountry, setCurrentCountry] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [guesses, setGuesses] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [center, setCenter] = useState([0, 0]);
  const [zoom, setZoom] = useState(1);
  const [regions, setRegions] = useState('');
  const [continents, setContinents] = useState('');
  const [countries, setCountries] = useState('');
  const [readyToCheck, setReadyToCheck] = useState(false);
  // const [bypassClick, setBypassClick] = useState(false);

  const {
    isStarted,
    worldData,
    startGame,
    handleOpen,
    changeMapView,
    updateScore,
    handlePoints,
    gameOver,
    saved,
    mapVisible,
  } = props;

  const proj = () => {
    return geoEqualEarth()
      .translate([800 / 2, 400 / 2])
      .scale(150);
  };

  // const handleWheel = (event) => {
  //   console.log('scroll detected');
  //   console.log(event.deltaY);
  //   if (event.deltaY > 0) {
  //     setZoom((z) => z / 1.1);
  //   } else {
  //     setZoom((z) => z * 1.1);
  //   }
  // };

  const endGame = () => {
    setQuestions([]);
    setGuesses(null);
    setCurrentCountry(null);
  };
  const getRandomInt = (min, max) => {
    const minCeil = Math.ceil(min);
    const maxFloor = Math.floor(max);
    return Math.floor(Math.random() * (maxFloor - minCeil)) + minCeil;
  };
  const getRandomCountry = () => {
    const int = getRandomInt(0, worldData.length);
    const country = worldData[int];
    return country;
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
      console.log('no regions');
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
    console.log(conts);
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


  // onRegionHover = (geo) => {
  //   let regions = Object.values(regions);
  //   let match = regions.filter(region => region.id === geo.properties.SUBREGION)[0];
  //   match = match.countries;
  //   match.forEach( node => {
  //     node.style.fill =  "#ee0a43";
  //     node.style.stroke =  "#111";
  //     node.style.strokeWidth =  1;
  //     node.style.outline =  "solid black"
  //     node.style.outlineOffset = "1px"
  //   })
  // }
  // onRegionLeave = (geo) => {
  //   let regions = Object.values(regions);
  //   let match = regions.filter(region => region.id === geo.properties.SUBREGION)[0];
  //   match = match.countries;
  //   match.forEach( node => {
  //     node.removeAttribute('style');
  //   })
  // }
  const handleZoomIn = () => {
    setZoom((prevZoom) => prevZoom * 2);
  };
  const handleZoomOut = () => {
    setZoom((prevZoom) => prevZoom / 2);
  };
  const handleText = (str) => {
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z\s]/ig, '');
  };
  const handleMoveStart = (newCenter) => {
    setCenter(newCenter);
    // setBypassClick(true);
  };

  const handleMoveEnd = (newCenter) => {
    setCenter(newCenter);
    // setBypassClick(JSON.stringify(newCenter) !== JSON.stringify(center));
  };

  const getAnswers = (curcountry) => {
    console.log(curcountry);
    let answerQuestions;
    if (questions) {
      answerQuestions = [...questions];
    }
    const question = {};
    question.country = curcountry;
    question.correct = null;
    const answers = [];
    if (curcountry) {
      answers.push({
        name: curcountry.name.split(';')[0],
        correct: 2,
      });
    }
    console.log(answers);
    answerQuestions.push(question);
    setQuestions(answerQuestions);
  };

  const takeTurn = () => {
    if (!isStarted) {
      console.log('starting game');
      startGame();
    }
    const country = getRandomCountry();
    console.log(country);
    setGuesses((prevGuess) => prevGuess + 1);
    setCurrentCountry(country);
    console.log('setting currentCountry');
    getAnswers(country);
    const nodes = [...(document.getElementsByClassName('gameCountry'))];
    nodes.forEach((node) => {
      node.removeAttribute('style');
    });
    if (questions && questions.length === 10) {
      console.log('opening modal');
      handleOpen();
      console.log('ending game');
      if (gameOver) {
        endGame();
      }
    }
  };
  const getCountryInfo = (country) => {
    let nodes = (document.getElementsByClassName('gameCountry'));
    nodes = [...nodes];
    console.log(nodes);
    console.log('getting country data in Find');
    nodes = nodes.filter((y) => handleText(country) === handleText(y.dataset.longname) || handleText(country) === handleText(y.dataset.shortname));
    console.log(nodes);
    const changeStyle = (n) => {
      n.forEach((node) => {
        node.style.fill = '#FF0000';
        node.style.stroke = '#111';
        node.style.strokeWidth = 1;
        node.style.outline = 'none';
        node.style.boxShadow = '0 0 10px #9ecaed';
        node.style.transition = 'all 250ms';
      });
    };
    setTimeout(() => changeStyle(nodes), 300);

  };

  const handleClick = (country) => {
    setReadyToCheck(true);
    setSelectedCountry(country);
  };
  const checkAnswer = (country) => {
    // if answer is correct answer (all correct answers have ID of 0)
    const checkquestions = questions;
    const foundquestion = checkquestions.find((question) => question.country === currentCountry);
    let checkguesses = guesses;
    console.log(country);
    console.log(currentCountry);
    console.log(isStarted);
    if (isStarted === false) {
      console.log('game has not started');
    }
    console.log(currentCountry);
    if ((country === currentCountry.name || country === currentCountry.name) || guesses === 4) {
      // give score of 2
      updateScore(3 - guesses);
      // set answer style
      // answer['correct'] = 0;
      // initialize correct counter for game
      console.log(foundquestion);
      if (guesses === 1) {
        foundquestion.correct = true;
      }
      checkguesses = null;
      setTimeout(() => takeTurn(), 300);
    } else {
      // answer['correct'] = 1;
      console.log(foundquestion);
      foundquestion.correct = false;
      checkguesses += 1;
      if (guesses === 3) {
        console.log(currentCountry.name);
        console.log('3 guesses, time up');
        getCountryInfo(currentCountry.name);
      }
    }
    setGuesses(checkguesses);
    handlePoints(questions);
    setReadyToCheck(false);
  };

  useEffect(() => {
    getMapNations();
    console.log(regions);
    handlePoints(questions);
  }, []);

  useEffect(() => {
    if (currentCountry) {
      console.log(currentCountry);
      getAnswers(currentCountry);
    }
  }, []);

  useEffect(() => {
    if (readyToCheck) {
      checkAnswer(selectedCountry);
    }
  }, [readyToCheck, selectedCountry, currentCountry]);

  useEffect(() => {
    setDynamicRegions(regions);
    setLocations(regions, continents);

  }, []);

  useEffect(() => {
    console.log('setting locations');
    console.log(regions, continents);
    setLocations(regions, continents);
  }, [countries]);

  useEffect(() => {
    console.log('ending game');
    endGame();
  }, [saved, gameOver]);


  const directions = (
    <div className="directions">
      <h5>Directions</h5>
      <p>A statement will be shown with four choices. Select the correct answer for the maximum number of points. Incorrect answers will receive less points and make two incorrect choices will yield no points. Select all incorrect answers and you will LOSE a point. Good luck!</p>
      <button type="button" className="btn btn-lg btn-success" onClick={() => takeTurn()}>Start Game</button>
    </div>
  );
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
                type="button"
                aria-label="Zoom out"
                className="btn btn-info"
                onClick={() => handleZoomOut(zoom)}
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <button
                type="button"
                aria-label="Zoom in"
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
              {(mapVisible === 'Show') ? 'Hide' : 'Show'}
              Map
            </button>
          </div>
        </Breakpoint>
        <hr />
        {currentCountry && (
          <div>
            Find
            {currentCountry.name}
          </div>
        )}
        {mapVisible === 'Show' ? (
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
                    onClick={(() => handleClick(geo.properties.NAME_LONG))}
                    key={geo.properties.NAME}
                    geography={geo}
                    projection={proj}
                    className="gameCountry"
                  />
                ))}
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        )
          : null }
        <ReactTooltip place="top" type="dark" effect="float" />
      </div>
    </BreakpointProvider>
  );
};
Find.propTypes = {
  mapVisible: PropTypes.string.isRequired,
  worldData: dataType.isRequired,
  isStarted: PropTypes.bool.isRequired,
  saved: PropTypes.bool.isRequired,
  gameOver: PropTypes.bool.isRequired,
  handlePoints: PropTypes.func.isRequired,
  handleOpen: PropTypes.func.isRequired,
  updateScore: PropTypes.func.isRequired,
  startGame: PropTypes.func.isRequired,
  changeMapView: PropTypes.func.isRequired,
};

export default Find;
// const BlockPageScroll = ({ children }) => {
//   const scrollRef = useRef(null);
//   useEffect(() => {
//     const scrollEl = scrollRef.current;
//     scrollEl.addEventListener("wheel", stopScroll);
//     return () => scrollEl.removeEventListener("wheel", stopScroll);
//   }, []);
//   const stopScroll = e => e.preventDefault();
//   return <div ref={scrollRef}>{children}</div>;
// };
