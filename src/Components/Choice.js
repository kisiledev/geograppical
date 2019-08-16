import React from 'react';

class Choice extends React.Component {
    state = {
        currentCountry: null,
        currentCountryId: null,
        capitals: [],
        guesses: null,
        answers: null,
        questions:[],
        ran: null
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
        const int = this.getRandomInt(0, this.props.data.length);
        this.setState({currentCountryId: int})
        let country = this.props.data[int];
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
        currentCountry && answers.push({
            name: currentCountry.government.capital.name.split(';')[0],
            id: 0,
            correct: 2
        });
        for (let x = 0; x < 3; x++) {
            let ran = this.randomExcluded(0, this.props.data.length -1, this.state.currentCountryId);
            this.setState({ran: ran})
            let newName;
            if(this.props.data[ran].government.capital.name || ran < 0){
                newName = this.props.data[ran].government.capital.name.split(';')[0]
            } else {
                ran = this.randomExcluded(0, this.props.data.length-1, this.state.currentCountryId);
                newName = this.props.data[ran].government.capital.name.split(';')[0]
            }
            let capital = {
                name: newName,
                id: x + 1, 
                correct: 2}
            answers.push(capital);
            this.shuffle(answers);
            this.setState({answers: answers})
        }
        question['answers'] = answers;
        
        questions.push(question);
        this.setState({questions});
    }
    takeTurn = () => {
            !this.props.isStarted && this.props.startGame();
            let country = this.getRandomCountry();
            this.setState(prevState => ({guesses: prevState.guesses +1, currentCountry: country, currentIncorrect: 0}),this.getAnswers(country));
            if(this.state.questions && this.state.questions.length > 10){
                console.log('showing scores')
                this.props.handleOpen();
                // this.setState({questions: [], answers: [], guesses: null})   
                
            }
    }
    
    checkAnswer = (answer) => {
        //if answer is correct answer (all correct answers have ID of 0)
        let questions = this.state.questions;
        let question = questions.find(question => question.country === this.state.currentCountry);
        let guesses = this.state.guesses;
        if(answer.id === 0){
            //give score of 2
            this.props.updateScore(3-this.state.guesses);
            //set answer style
            answer['correct'] = 0;
            //initialize correct counter for game
            if(this.state.guesses === 1){
                question['correct'] = true;
            }
            guesses = null;
            setTimeout(() => this.takeTurn(), 300);   
        } else {
            answer['correct'] = 1;
            question['correct'] = false;
            guesses ++
        }
        this.setState({guesses}, () => {this.props.handlePoints(this.state.questions)})
    }
    render(){
        const { isStarted } = this.props;
        const { guesses, currentCountry, answers, questions} = this.state;
        const { takeTurn, checkAnswer} = this;
        let directions = 
        <div className="directions">
            <h5>Directions</h5>
            <p>A statement will be shown with four choices. Select the correct answer for the maximum number of points. Incorrect answers will receive less points and make two incorrect choices will yield no points. Select all incorrect answers and you will LOSE a point. Good luck!</p>
            <button className="btn btn-lg btn-success" onClick={() => takeTurn()}>Start Game</button>
        </div>;
        let answerChoices;
        if(answers && answers.length > 0){
            if(questions < 0){
                answerChoices = []
            } else {
                answerChoices = answers.map((answer) => {
                    let navClass = "possible card mx-1 mt-3";
                    let correct = "bg-success possible card mx-1 mt-3"
                    let incorrect = "bg-danger possible card mx-1 mt-3 disabled"
                    return <li role="button" onClick={() => checkAnswer(answer)}className={answer.correct === 2 ? navClass : (answer.correct === 1 ? incorrect : correct)} value={answer.id} key={answer.id}>{answer.name}</li>
                })
            }
        }
        return(
            <div>
                {!isStarted && directions}
                {isStarted && <div>What is the capital of {currentCountry && currentCountry.name}?</div>}
                <div className="guesses">
                    {isStarted && guesses && <div>{guesses} {(guesses === 1)     ? 'guess' : 'guesses' }</div>}
                    {isStarted && guesses && <div>For {3-guesses} {(guesses === 2 || guesses ===4) ? 'point' : 'points' }</div>}
                </div>
                {answers && answers.length > 0 && <ul className="px-0 d-flex flex-wrap">{answerChoices}</ul>}
            </div>

        )
    }
}

export default Choice;