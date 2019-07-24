import React, {Component} from 'react';
import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography,
  } from 'react-simple-maps';
import data from '../Data/world-50m.json';
import ReactTooltip from 'react-tooltip';
import { faPlus, faMinus, faGlobeAfrica } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Breakpoint, { BreakpointProvider } from 'react-socks';

class Find extends Component {
    state = {
        center: [0, 20],
        zoom: 1,
        currentCountry: null,
        currentCountryId: null,
        capitals: [],
        guesses: null,
        answers: null,
        questions:[],
        ran: null
    }

    handleZoomIn = (zoom) => {
        this.setState(prevState => ({zoom: prevState.zoom * 2}))
    }
    handleZoomOut = (zoom) => {
        this.setState(prevState => ({zoom: prevState.zoom / 2}))
    }
    handleText = (str) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-z\s]/ig, '');
    }
    handleClick = (e) => {
        // access to e.target here
        console.log(this.handleText(e.properties.NAME_LONG));
        console.log(this.state.currentCountry.name);
        alert(this.handleText(e.properties.NAME_LONG) === this.state.currentCountry.name)
    }
    componentDidMount(){
        this.props.handlePoints(this.state.questions);
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
            correct: 2
        });
        // for (let x = 0; x < 3; x++) {
        //     let ran = this.randomExcluded(0, this.props.worldData.length -1, this.state.currentCountryId);
        //     this.setState({ran: ran})
        //     let newName;
        //     if(this.props.worldData[ran].name || ran < 0){
        //         newName = this.props.worldData[ran].name.split(';')[0]
        //     } else {
        //         ran = this.randomExcluded(0, this.props.worldData.length-1, this.state.currentCountryId);
        //         newName = this.props.worldData[ran].name.split(';')[0]
        //     }
        //     let capital = {
        //         name: newName,
        //         id: x + 1, 
        //         correct: 2}
        //     answers.push(capital);
        //     this.shuffle(answers);
        //     this.setState({answers: answers})
        // }
        questions.push(question);
        this.setState({questions});
    }
    takeTurn = () => {
            !this.props.isStarted && this.props.startGame();
            let country = this.getRandomCountry();
            this.setState(prevState => ({guesses: prevState.guesses +1, currentCountry: country, currentIncorrect: 0}),this.getAnswers(country));
            let nodes = [...(document.getElementsByClassName("gameCountry"))];
            // console.log(this.state.filterNations)
            nodes.forEach( node => {
              node.removeAttribute("style")
            })
            if(this.state.questions && this.state.questions.length > 10){
                alert("Congrats! You've reached the end of the game. You answered " + this.props.correct + " questions correctly and " + this.props.incorrect + " incorrectly.\n Thanks for playing");
                this.setState({questions: [], answers: [], guesses: null})
                this.props.endGame();
                
            }
    }
    getCountryInfo = (e, country) => {
      let nodes = (document.getElementsByClassName("gameCountry"));
      nodes = [...nodes]
      console.log(nodes)
      nodes = nodes.filter(e => this.handleText(country) === this.handleText(e.dataset.longname) || this.handleText(country) === this.handleText(e.dataset.shortname))
      console.log(nodes);
      this.changeStyle = (nodes) => {
        nodes.forEach( node => {
          node.style.fill =  "#FF0000";
          node.style.stroke =  "#111";
          node.style.strokeWidth =  5;
          node.style.outline =  "none"
        })
      }
      setTimeout(() => this.changeStyle(nodes), 300);
      
    }

    checkAnswer = (e, country) => {
        //if answer is correct answer (all correct answers have ID of 0)
        let correct, incorrect;
        let questions = this.state.questions;
        let question = questions.find(question => question.country === this.state.currentCountry);
        let guesses = this.state.guesses;
        console.log(e)
        console.log(country)
        console.log(this.state.currentCountry)
        if((country === this.state.currentCountry.name || country === this.state.currentCountry.name) || this.state.guesses === 4){
            //give score of 2
            this.props.updateScore(3-this.state.guesses);
            //set answer style
            // answer['correct'] = 0;
            //initialize correct counter for game
            console.log(question);
            if(this.state.guesses === 1){
                question['correct'] = true;
            }
            guesses = null;
            setTimeout(() => this.takeTurn(), 300);   
        } else {
            // answer['correct'] = 1;
            console.log(question);
            question['correct'] = false;
            guesses ++
            if(this.state.guesses === 3){
              console.log(this.state.currentCountry.name)
              console.log('3 guesses, time up')
              this.getCountryInfo(e, this.state.currentCountry.name);
            }
        }
        this.setState({correct, incorrect, guesses}, () => {this.props.handlePoints(this.state.questions)})
    }
  render() {
    let directions = 
    <div className="directions">
        <h5>Directions</h5>
        <p>A statement will be shown with four choices. Select the correct answer for the maximum number of points. Incorrect answers will receive less points and make two incorrect choices will yield no points. Select all incorrect answers and you will LOSE a point. Good luck!</p>
        <button className="btn btn-lg btn-success" onClick={() => this.takeTurn()}>Start Game</button>
    </div>;
    return(
        <BreakpointProvider>
        <div className="card mr-3 mb-3">
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
        {this.state.currentCountry && <div>Find {this.state.currentCountry.name}</div>}
        {this.props.mapVisible === "Show" ?
        <ComposableMap 
          projection="robinson"
          width={980}
          height={551}
          style={{
            width: "100%",
            height: "auto",
          }}  
          >
          <ZoomableGroup zoom={this.state.zoom} center={this.state.center}>
          <Geographies  geography={data}>
            {(geographies, projection) =>
              geographies.map((geography, i) =>
              <Geography
                data-idkey={i}
                data-longname={this.handleText(geography.properties.NAME_LONG)}
                data-shortname={geography.properties.NAME}
                onClick={((e) => this.checkAnswer(e, geography.properties.NAME_LONG))}
                key={i}
                geography={geography}
                projection={projection}
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
  }

    export default Find;