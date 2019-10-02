import React, {Component, useRef, useEffect} from 'react';
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

class Highlight extends Component {
    state = {
        center: [0, 0],
        zoom: 1,
        currentCountry: null,
        currentCountryId: null,
        bypassClick: false,
        capitals: [],
        guesses: null,
        answers: null,
        questions:[],
        ran: null,
        countries: [],
        regions: [],
        continents: []
    }
    proj = () => {
      return geoEqualEarth()
      .translate([800 / 2, 400 / 2])
      .scale(150);
    }
    // getCursorLocation = (event) => {
    //   const zoom = this.state.zoom;
  
    //   console.log("Zoom: " + zoom);
  
    //   const { width, height } = this.props;
    //   const projection = this.projection();
    //   const box = this._wrapper.querySelector("svg").getBoundingClientRect();
    //   const { top, left } = box;
  
    //   const resizeFactorX = box.width / width;
    //   const resizeFactorY = box.height / height;
  
    //   // position cursor as position within width and height of composableMap
    //   const clientX = (event.clientX - left) / resizeFactorX;
    //   const clientY = (event.clientY - top) / resizeFactorY;
  
    //   const originalCenter = [width / 2, height / 2];
  
    //   // position in Composable map that current center has when map is centered
    //   const currentCenter = projection(this.state.center);
    //   console.log(currentCenter);
  
    //   // compensation in "Composable map units" needed due to being off-center(panned)
    //   const offsetX = currentCenter[0] - originalCenter[0];
    //   const offsetY = currentCenter[1] - originalCenter[1];
  
    //   console.log("offsetX: " + offsetX + " - offsetY: " + offsetY);
  
    //   // position in Composable map that cursor would have been if the map was centered at this zoom level???
    //   let x = clientX + offsetX;
    //   let y = clientY + offsetY;
  
    //   console.log("Corrected x: " + x + " - Corrected y: " + y);
    //   // let xTodo,
    //   //   yTodo = 0;
    //   // if (x > 400) {
    //   //   xTodo = 400 - x;
    //   //   x = 400;
    //   // }
    //   // if (x < 0) {
    //   //   xTodo = 0 + x;
    //   //   x = 0;
    //   // }
    //   // if (y > 250) {
    //   //   yTodo = 250 - y;
    //   //   y = 250;
    //   // }
    //   // if (y < 0) {
    //   //   yTodo = 0 + y;
    //   //   y = 0;
    //   // }
  
    //   const uncompensatedCursor = projection.invert([x, y]);
  
    //   const cursor = [
    //     this.state.center[0] +
    //       (uncompensatedCursor[0] - this.state.center[0]) / zoom,
    //     this.state.center[1] +
    //       (uncompensatedCursor[1] - this.state.center[1]) / zoom
    //   ];
  
    //   return cursor;
    // }
    componentDidMount(){
      this.getMapNations();
      this.props.handlePoints(this.state.questions);
  }
  
  componentDidUpdate(prevProps) {
    // only update chart if the data has changed
    if (prevProps.uniqueRegions !== this.props.uniqueRegions && this.props.uniqueRegions.length > 0) {
      this.setDynamicRegions(this.state.regions)
    }
    if(this.props.gameOver && this.props.gameOver !== prevProps.gameOver){
      this.endGame();
    }
  };

  getMapNations = () => {
    const mapCountries = [...(document.getElementsByClassName("gameCountry"))];
    const totalMapRegions = mapCountries.map(a => a.dataset.subregion.replace(/;/g, ""));
    let uniqueMapRegions = totalMapRegions.filter((v, i, a) => a.indexOf(v) === i);
    uniqueMapRegions = uniqueMapRegions.filter(Boolean);
    const totalMapContinents = mapCountries.map(a => a.dataset.continent.replace(/;/g, ""));
    let uniqueMapContinents = totalMapContinents.filter((v, i, a) => a.indexOf(v) === i);
    uniqueMapContinents = uniqueMapContinents.filter(Boolean);
    this.setState({
      countries: mapCountries,
      regions: uniqueMapRegions,
      continents: uniqueMapContinents
    }, () => {this.setLocations(this.state.regions, this.state.continents)})
  }

    getRegion = (region) => {
      let nodes = [...(document.getElementsByClassName("gameCountry"))];
      let match = nodes.filter(node => node.dataset.subregion === region);
      return match;
    }

    getContinent = (continent) => {
      let nodes = [...(document.getElementsByClassName("gameCountry"))];
      let match = nodes.filter(node => node.dataset.continent === continent);
      return match;
    }

    setDynamicRegions = regions => {
      if (!regions) {
        return;
      }
    
      const regionsState = {};
      regions.forEach((region) => {
          if(this.state[region] && this.state[region].countries[0]){
              regionsState[region] = {id: region, countries: this.state[region].countries};
          } else {
              this.getRegion(region);
              regionsState[region] = {id: region, countries: this.getRegion(region)};
          }
      });
      // set state here outside the foreach function
       this.setState({regions: {...regionsState}})
    };

    setDynamicContinents = continents => {
      if (!continents) {
        return;
      }
    
      const continentsState = {};
      continents.forEach((continent) => {
          if(this.state[continent] && this.state[continent].countries[0]){
              continentsState[continent] = {id: continent, countries: this.state[continent].countries};
          } else {
              this.getContinent(continent);
              continentsState[continent] = {id: continent, countries: this.getContinent(continent)};
          }
      });
      // set state here outside the foreach function
       this.setState({continents: {...continentsState}})
    };
    setLocations = (regions, continents) => {
      this.setDynamicContinents(continents);
      this.setDynamicRegions(regions);
    }

    
    // onRegionHover = (geo) => {
    //   let regions = Object.values(this.state.regions);
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
    //   let regions = Object.values(this.state.regions);
    //   let match = regions.filter(region => region.id === geo.properties.SUBREGION)[0];
    //   match = match.countries;
    //   match.forEach( node => {
    //     node.removeAttribute('style');
    //   })
    // }
    handleZoomIn = (zoom) => {
        this.setState(prevState => ({zoom: prevState.zoom * 2}))
    }
    handleZoomOut = (zoom) => {
        this.setState(prevState => ({zoom: prevState.zoom / 2}))
    }
    handleText = (str) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-z\s]/ig, '');
    }
    handleMoveStart = newCenter => {
      this.setState({
        center: newCenter,
        bypassClick: true
      });
    };
  
    handleMoveEnd = newCenter => {
      this.setState({
        center: newCenter,
        bypassClick:
          JSON.stringify(newCenter) !== JSON.stringify(this.state.center)
      });
    };
    handleClick = (e) => {
        // access to e.target here
        console.log(this.handleText(e.properties.NAME_LONG));
        console.log(this.state.currentCountry.name);
        alert(this.handleText(e.properties.NAME_LONG) === this.state.currentCountry.name)
    }
    handleWheel = event => {
      const oldZoom = this.state.zoom;
      const zoomDirectionFactor = event.deltaY > 0 ? 1 : -1;
  
      // Set new zoom level
      const newZoom = oldZoom + zoomDirectionFactor;
      // Ignore nonsens
      if (newZoom > 10 || newZoom < 1) {
        return;
      }
      // const cursor = this.getCursorLocation(event);
      // const oldCenter = this.state.center;

      // const newCenter = [
      //   oldCenter[0] +
      //     ((cursor[0] - oldCenter[0]) / newZoom) * zoomDirectionFactor,
      //   oldCenter[1] +
      //     ((cursor[1] - oldCenter[1]) / newZoom) * zoomDirectionFactor
      // ];
      // this.setState({zoom: newZoom, center: newCenter})
    }
    
    shuffle = (a) => {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
    getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max-min)) + min;
    }
    getRandomCountry = () => {
        const int = this.getRandomInt(0, this.props.worldData.length);
        this.setState({currentCountryId: int})
        let country = this.props.worldData[int];
        return country;
    }
    randomExcluded = (min, max, excluded) => {
        let n = Math.floor(Math.random() * (max-min) + min);
        if (n >= excluded) n++;
        return n;
    }

    getAnswers = (currentCountry) => {
        let questions = [...this.state.questions]
        let question = {};
        question['country'] = currentCountry;
        question['correct'] = null;
        let answers = [];
        console.log(currentCountry.name);
        console.log(currentCountry)
        currentCountry && answers.push({
            name: currentCountry.name.split(';')[0],
            id: 0,
            correct: 2
        });
        for (let x = 0; x < 3; x++) {
            let ran = this.randomExcluded(0, this.props.worldData.length -1, this.state.currentCountryId);
            this.setState({ran: ran})
            let newName;
            if(this.props.worldData[ran].name || ran < 0){
                newName = this.props.worldData[ran].name.split(';')[0]
            } else {
                ran = this.randomExcluded(0, this.props.worldData.length-1, this.state.currentCountryId);
                newName = this.props.worldData[ran].name.split(';')[0]
            }
            let capital = {
                name: newName,
                id: x + 1, 
                correct: 2}
            answers.push(capital);
            this.shuffle(answers);
            console.log(answers)
            this.setState({answers: answers})
        }
        console.log(answers)
        questions.push(question);
        this.setState({questions});
    }
    takeTurn = () => {
            !this.props.isStarted && this.props.startGame();
            let country = this.getRandomCountry();
            this.setState(prevState => ({guesses: prevState.guesses +1, currentCountry: country, currentIncorrect: 0}),this.getAnswers(country));
            if(this.state.questions && this.state.questions.length < 10){
            this.getCountryInfo(country);
            }
            let nodes = [...(document.getElementsByClassName("gameCountry"))];
            // console.log(this.state.filterNations)
            nodes.forEach( node => {
              node.removeAttribute("style")
            })
            if(this.state.questions && this.state.questions.length > 10){
                this.props.handleOpen();
                // alert("Congrats! You've reached the end of the game. You answered " + this.props.correct + " questions correctly and " + this.props.incorrect + " incorrectly.\n Thanks for playing");
                let nodes = [...(document.getElementsByClassName("gameCountry"))];
            // console.log(this.state.filterNations)
            nodes.forEach( node => {
              node.removeAttribute("style")
            })
            }
    }

    endGame = () => {
        
      this.setState({
          answers: null,
          questions: null,
          guesses: null,
          currentCountry: null,
          score: 0,
          correct: 0,
          incorrect: 0

      });
    }

    getCountryInfo = (country, e) => {
        console.log(country)
        console.log(this.state.currentCountry)
      let nodes = (document.getElementsByClassName("gameCountry"));
      nodes = [...nodes]
      console.log(nodes.map(node => node.dataset.longname))
      console.log('getting country data in Find')
      nodes = nodes.filter(
        node => this.handleText(country.name) === this.handleText(node.dataset.longname) 
        || this.handleText(country.name) === this.handleText(node.dataset.shortname))
        console.log(nodes)
      this.highVisibility = (nodes) => {
          let highViz = country.name;
          console.log(highViz + " - " + this.state.currentCountry.name)
          nodes.forEach( node => {
            node.style.outline =  "solid red";            
            node.style.outlineOffset = "10px"
          })
      }
      this.changeStyle = (nodes) => {
        nodes.forEach( node => {
          node.style.fill =  "#FF0000";
          node.style.stroke =  "#111";
          node.style.strokeWidth =  1;
          node.style.outline =  "solid red"
          node.style.outlineOffset = "10px"
          node.style.boxShadow = "0 0 10px #9ecaed"
          node.style.transition = "all 250ms"
        })
      }
      setTimeout(() => this.changeStyle(nodes), 300);
      
    }

    checkAnswer = (country) => {
        //if answer is correct answer (all correct answers have ID of 0)
        if(!this.props.isStarted){
          return
        }
        let correct, incorrect;
        let questions = this.state.questions;
        let question = questions.find(question => question.country === this.state.currentCountry);
        let guesses = this.state.guesses;
        console.log(country)
        console.log(this.state.currentCountry)
        if((country.name === this.state.currentCountry.name || country.name === this.state.currentCountry.name) || this.state.guesses === 4){
            //give score of 2
            this.props.updateScore(3-this.state.guesses);
            //set answer style
            country['correct'] = 0;
            //initialize correct counter for game
            console.log(question);
            if(this.state.guesses === 1){
                question['correct'] = true;
            }
            guesses = null;
            setTimeout(() => this.takeTurn(), 300);   
        } else {
            country['correct'] = 1;
            console.log(question);
            question['correct'] = false;
            guesses ++
            if(this.state.guesses === 3){
              console.log(this.state.currentCountry.name)
              console.log('3 guesses, time up')
            }
        }
        this.setState({correct, incorrect, guesses}, () => {this.props.handlePoints(this.state.questions)})
    }
  render() {
    let directions = 
    <div className="directions">
        <h5>Directions</h5>
        <p>The map will show a highlighted country. Select the correct answer from the choices below for the maximum number of points. Incorrect answers will receive less points and make two incorrect choices will yield no points. Select all incorrect answers and you will LOSE a point. Good luck!</p>
        <button className="btn btn-lg btn-success" onClick={() => this.takeTurn()}>Start Game</button>
    </div>;
    let answerChoices;
    if(this.state.answers && this.state.answers.length > 0){
        if(this.state.questions < 0){
            answerChoices = []
        } else {
            answerChoices = this.state.answers.map((answer) => {
                let navClass = "possible card mx-1 mt-3";
                let correct = "bg-success possible card mx-1 mt-3"
                let incorrect = "bg-danger possible card mx-1 mt-3 disabled"
                return <li role="button" onClick={() => this.checkAnswer(answer)}className={answer.correct === 2 ? navClass : (answer.correct === 1 ? incorrect : correct)} value={answer.id} key={answer.id}>{answer.name}</li>
            })
        }
    }
    return(
        
        <BreakpointProvider>
        <div className="mr-3 mb-3">
            {!this.props.isStarted && directions}
            {this.props.isStarted && this.state.guesses && <div>{this.state.guesses} {(this.state.guesses === 1)     ? 'guess' : 'guesses' }</div>}
            {this.props.isStarted && this.state.guesses && <div>For {3-this.state.guesses} {(this.state.guesses === 2 || this.state.guesses ===4) ? 'point' : 'points' }</div>}
          <Breakpoint small up>
          <div className="d-flex justify-content-between">
          <div className="btn-group d-inline">
            <button className="btn btn-info" onClick={() => this.handleZoomOut(this.state.zoom) }><FontAwesomeIcon icon={faMinus}/></button>
            <button className="btn btn-info" onClick={() => this.handleZoomIn(this.state.zoom) }><FontAwesomeIcon icon={faPlus}/></button>
          </div>    
          <button 
            className="btn btn-info" 
            onClick={() => this.props.mapView() }
          >
            <FontAwesomeIcon icon={faGlobeAfrica}/>{ (this.props.mapVisible === "Show") ? "Hide" : "Show"} Map
          </button>

          </div>
          </Breakpoint>
        <hr />
        {this.state.answers && this.state.answers.length > 0 && <ul className="px-0 d-flex flex-wrap">{answerChoices}</ul>}
        {this.props.mapVisible === "Show" ?
        <BlockPageScroll>
          <div 
            ref={wrapper => (this._wrapper = wrapper)}
            onWheel={this.handleWheel}

          >
        <ComposableMap
          width={800}
          height={400} 
          projection={this.proj}
          style={{
            width: "100%",
            height: "auto",
          }}  
          >
          <ZoomableGroup 
            zoom={this.state.zoom} 
            center={this.state.center}
            onMoveStart={this.handleMoveStart}
            onMoveEnd={this.handleMoveEnd}
          >
          <Geographies  geography={data}>
            {(geos, proj) =>
              geos.map((geo, i) =>
              <Geography
                data-idkey={i}
                data-longname={this.handleText(geo.properties.NAME_LONG)}
                data-shortname={geo.properties.NAME}
                data-continent ={geo.properties.CONTINENT}
                data-subregion = {geo.properties.SUBREGION}
                // onMouseEnter={(() => this.onRegionHover(geo))}
                // onMouseLeave={(() => this.onRegionLeave(geo))}
                onClick={((e) => this.checkAnswer(e, geo.properties.NAME_LONG))}
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
        </div>
        </BlockPageScroll>
        : null }
        <ReactTooltip place="top" type="dark" effect="float" />
        </div>
        </BreakpointProvider>
    )
  }
  }
  

    export default Highlight;
    const BlockPageScroll = ({ children }) => {
      const scrollRef = useRef(null);
      useEffect(() => {
        const scrollEl = scrollRef.current;
        scrollEl.addEventListener("wheel", stopScroll);
        return () => scrollEl.removeEventListener("wheel", stopScroll);
      }, []);
      const stopScroll = e => e.preventDefault();
      return <div ref={scrollRef}>{children}</div>;
    };