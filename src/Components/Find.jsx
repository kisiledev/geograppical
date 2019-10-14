import React, {useState, useRef, useEffect} from 'react';
import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography
  } from 'react-simple-maps';
import data from '../Data/world-50m.json';
import { geoEqualEarth } from 'd3-geo'
import ReactTooltip from 'react-tooltip';
import { faPlus, faMinus, faGlobeAfrica } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Breakpoint, { BreakpointProvider } from 'react-socks';

const Find = props => {
  const [currentCountry, setCurrentCountry] = useState(null)
  const [guesses, setGuesses] = useState(null)
  const [questions, setQuestions] = useState([])
  const [center, setCenter] = useState([0,0])
  const [zoom, setZoom] = useState(1)
  const [regions, setRegions] = useState('')
  const [continents, setContinents] = useState('')
  const [countries, setCountries] = useState('')
  // const [bypassClick, setBypassClick] = useState(false)


    const proj = () => {
      return geoEqualEarth()
      .translate([800 / 2, 400 / 2])
      .scale(150);
    }

    const handleWheel = (event) => {
      console.log("scroll detected");
      console.log(event.deltaY);
      event.deltaY > 0 ? setZoom(zoom => zoom/1.1) : setZoom(zoom => zoom * 1.1)
    }
    useEffect(() => {
      getMapNations();
      console.log(regions)
      props.handlePoints(questions)
    }, [])

    useEffect(() => {
      if(currentCountry){
        getAnswers(currentCountry)
      }
    }, [currentCountry])
    
    useEffect(() => {
      setDynamicRegions(regions);
      setLocations(regions, continents)

    }, [props.uniqueRegions])

    useEffect(() => {
      console.log('setting locations')
      console.log(regions, continents)
      setLocations(regions, continents)
    }, [countries])

    useEffect(() => {
      console.log(`ending game`)
      endGame(); 
  }, [props.saved, props.gameOver]);


  const getMapNations = () => {
    const mapCountries = [...(document.getElementsByClassName("gameCountry"))];
    const totalMapRegions = mapCountries.map(a => a.dataset.subregion.replace(/;/g, ""));
    let uniqueMapRegions = totalMapRegions.filter((v, i, a) => a.indexOf(v) === i);
    uniqueMapRegions = uniqueMapRegions.filter(Boolean);
    const totalMapContinents = mapCountries.map(a => a.dataset.continent.replace(/;/g, ""));
    let uniqueMapContinents = totalMapContinents.filter((v, i, a) => a.indexOf(v) === i);
    uniqueMapContinents = uniqueMapContinents.filter(Boolean);
    setCountries(mapCountries)
    setRegions(uniqueMapRegions)
    setContinents(uniqueMapContinents)
  }

    const getRegion = (region) => {
      let nodes = [...(document.getElementsByClassName("gameCountry"))];
      let match = nodes.filter(node => node.dataset.subregion === region);
      return match;
    }

    const getContinent = (continent) => {
      let nodes = [...(document.getElementsByClassName("gameCountry"))];
      let match = nodes.filter(node => node.dataset.continent === continent);
      return match;
    }

    const setDynamicRegions = regions => {
      if (!regions) {
          console.log('no regions')
        return;
      }
      const regionsState = {};
      regions.length > 0 && regions.forEach((region) => {
          if(regions[region] && regions[region].countries[0]){
              regionsState[region] = { visible: 5, start: 0, countries: regions[region].countries, open: false};
          } else {
              getRegion(region);
              regionsState[region] = { visible: 5, start: 0, countries: getRegion(region), open: false};
          }
      });
      setRegions({...regionsState})
  };

    const setDynamicContinents = continents => {
      if (!continents) {
        return;
      }
    
      const continentsState = {};
      console.log(continents)
      continents.length > 0 && continents.forEach((continent) => {
          if(continents[continent] && continents[continent].countries[0]){
              continentsState[continent] = {id: continent, countries: continents[continent].countries};
          } else {
              getContinent(continent);
              continentsState[continent] = {id: continent, countries: getContinent(continent)};
          }
      });
      // set state here outside the foreach function
        setContinents({...continentsState})
      //  setState({continents: {...continentsState}})
    };
    const setLocations = (regions, continents) => {
      setDynamicContinents(continents);
      setDynamicRegions(regions);
    }

    
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
    const handleZoomIn = (zoom) => {
      setZoom(zoom => zoom *2)
    }
    const handleZoomOut = (zoom) => {
      setZoom(zoom => zoom /2)
    }
    const handleText = (str) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-z\s]/ig, '');
    }
    // const handleMoveStart = newCenter => {
    //   setCenter(newCenter)
    //   setBypassClick(true)
    // };
  
    // const handleMoveEnd = newCenter => {
    //   setCenter(newCenter)
    //   setBypassClick(JSON.stringify(newCenter) !== JSON.stringify(center))   
    // };
    const handleClick = (e) => {
        // access to e.target here
        console.log(handleText(e.properties.NAME_LONG));
        console.log(currentCountry.name);
        alert(handleText(e.properties.NAME_LONG) === currentCountry.name)
    }

    
    const shuffle = (a) => {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max-min)) + min;
    }
    const getRandomCountry = () => {
        const int = getRandomInt(0, props.worldData.length);
        let country = props.worldData[int];
        return country;
    }

    const getAnswers = (currentCountry) => {
      console.log(currentCountry)
        let answerQuestions;
        if(questions){
          answerQuestions = [...questions]
        }
        let question = {};
        question['country'] = currentCountry;
        question['correct'] = null;
        let answers = [];
        currentCountry && console.log(currentCountry.name);
        console.log(currentCountry)
        currentCountry && answers.push({
            name: currentCountry.name.split(';')[0],
            correct: 2
        });
        console.log(answers)
        answerQuestions.push(question);
        setQuestions(answerQuestions)
    }
    
    const endGame = () => {
      setQuestions([])
      setGuesses(null)
      setCurrentCountry(null)
  }
  
    const takeTurn = () => {
            !props.isStarted && props.startGame();
            let country = getRandomCountry();
            console.log(country)
            setGuesses(prevGuess => prevGuess + 1)
            setCurrentCountry(country)
            console.log('setting currentCountry')
            getAnswers(country)
            let nodes = [...(document.getElementsByClassName("gameCountry"))];
            nodes.forEach( node => {
              node.removeAttribute("style")
            })
            if(questions && questions.length === 10){
                console.log('opening modal')
                props.handleOpen();
                // alert("Congrats! You've reached the end of the game. You answered " + props.correct + " questions correctly and " + props.incorrect + " incorrectly.\n Thanks for playing");
                console.log('ending game')
                props.gameOver && endGame();
                
            }
    }
    const getCountryInfo = (e, country) => {
      let nodes = (document.getElementsByClassName("gameCountry"));
      nodes = [...nodes]
      console.log(nodes)
      console.log('getting country data in Find')
      nodes = nodes.filter(e => handleText(country) === handleText(e.dataset.longname) || handleText(country) === handleText(e.dataset.shortname))
      console.log(nodes);
      this.changeStyle = (nodes) => {
        nodes.forEach( node => {
          node.style.fill =  "#FF0000";
          node.style.stroke =  "#111";
          node.style.strokeWidth =  1;
          node.style.outline =  "none"
          node.style.boxShadow = "0 0 10px #9ecaed"
          node.style.transition = "all 250ms"
        })
      }
      setTimeout(() => this.changeStyle(nodes), 300);
      
    }

    const checkAnswer = (e, country) => {
        //if answer is correct answer (all correct answers have ID of 0)
        let checkquestions = questions;
        let question = checkquestions.find(question => question.country === currentCountry);
        let checkguesses = guesses;
        console.log(e)
        console.log(country)
        console.log(currentCountry)
        if(!props.isStarted){
          return
        }
        if((country === currentCountry.name || country === currentCountry.name) || guesses === 4){
            //give score of 2
            props.updateScore(3-guesses);
            //set answer style
            // answer['correct'] = 0;
            //initialize correct counter for game
            console.log(question);
            if(guesses === 1){
                question['correct'] = true;
            }
            checkguesses = null;
            setTimeout(() => takeTurn(), 300);   
        } else {
            // answer['correct'] = 1;
            console.log(question);
            question['correct'] = false;
            checkguesses ++
            if(guesses === 3){
              console.log(currentCountry.name)
              console.log('3 guesses, time up')
              getCountryInfo(e, currentCountry.name);
            }
        }
        setGuesses(checkguesses)
        props.handlePoints(questions);
    }
    const { isStarted, changeMapView, mapVisible } = props;
    let directions = 
    <div className="directions">
        <h5>Directions</h5>
        <p>A statement will be shown with four choices. Select the correct answer for the maximum number of points. Incorrect answers will receive less points and make two incorrect choices will yield no points. Select all incorrect answers and you will LOSE a point. Good luck!</p>
        <button className="btn btn-lg btn-success" onClick={() => takeTurn()}>Start Game</button>
    </div>;
    return(
        
        <BreakpointProvider>
        <div className="mr-3 mb-3">
            {!isStarted && directions}
            {isStarted && guesses && <div>{guesses} {(guesses === 1)     ? 'guess' : 'guesses' }</div>}
            {isStarted && guesses && <div>For {3-guesses} {(guesses === 2 || guesses ===4) ? 'point' : 'points' }</div>}
          <Breakpoint small up>
          <div className="d-flex justify-content-between">
          <div className="btn-group d-inline">
            <button className="btn btn-info" onClick={() => handleZoomOut(zoom) }><FontAwesomeIcon icon={faMinus}/></button>
            <button className="btn btn-info" onClick={() => handleZoomIn(zoom) }><FontAwesomeIcon icon={faPlus}/></button>
          </div>
          <button 
            className="btn btn-info" 
            onClick={() => changeMapView() }
          >
            <FontAwesomeIcon icon={faGlobeAfrica}/>{ (mapVisible === "Show") ? "Hide" : "Show"} Map
          </button>

          </div>
          </Breakpoint>
        <hr />
        {currentCountry && <div>Find {currentCountry.name}</div>}
        {mapVisible === "Show" ?
        <ComposableMap
          width={800}
          height={400} 
          projection={proj}
          style={{
            width: "100%",
            height: "auto",
          }}  
          >
          <ZoomableGroup 
            zoom={zoom} 
            center={center}
            // onMoveStart={handleMoveStart}
            // onMoveEnd={handleMoveEnd}
          >
          <Geographies  geography={data}>
            {(geos, proj) =>
              geos.map((geo, i) =>
              <Geography
                data-idkey={i}
                data-longname={handleText(geo.properties.NAME_LONG)}
                data-shortname={geo.properties.NAME}
                data-continent ={geo.properties.CONTINENT}
                data-subregion = {geo.properties.SUBREGION}
                // onMouseEnter={(() => onRegionHover(geo))}
                // onMouseLeave={(() => onRegionLeave(geo))}
                onClick={((e) => checkAnswer(e, geo.properties.NAME_LONG))}
                key={i}
                geography={geo}
                projection={proj}
                className="gameCountry"       
              />
            )
            }
          </ Geographies>
          </ZoomableGroup>
        </ComposableMap>
        : null }
        <ReactTooltip place="top" type="dark" effect="float" />
        </div>
        </BreakpointProvider>
    )
  }
  

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