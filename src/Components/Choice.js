import React from 'react';

class Choice extends React.Component {
    state = {
        currentCountry: null,
        currentCountryId: null,
        capitals: [],
        guesses: null,
        answers: null,
        questions:10,
        correct: 0,
        ran: null,
        incorrect: 0,
        currentIncorrect: 0,
        pointsLost: 0
    }
    componentDidMount(){
        this.props.handlePoints(this.state.correct, this.state.incorrect, this.state.questions);
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
    }
    takeTurn = (answers) => {
            !this.props.isStarted && this.props.startGame();
            let country = this.getRandomCountry();
            this.setState(prevState => ({guesses: prevState.guesses +1, currentCountry: country, currentIncorrect: 0}),this.getAnswers(country));
            if(this.state.questions === 0){
                alert("Congrats! You've reached the end of the game. You answered " + this.state.correct + " questions correctly and " + this.state.incorrect + " incorrectly");
                this.setState({questions: 10, answers: [], guesses: null})
                this.props.endGame();
                
            }
    }
    
    checkAnswer = (answer) => {
        //if answer is correct answer (all correct answers have ID of 0)
        if(answer.id === 0){
            //give score of 2
            this.props.updateScore(3-this.state.guesses);
            answer['correct'] = 0;
            let correct = 0;
            if(this.state.guesses === 1){
                correct = 1;
            }
            this.setState(prevState => ({correct: prevState.correct + correct, questions: prevState.questions - 1, guesses: null}), () => {this.props.handlePoints(correct, this.state.incorrect, this.state.questions)}
            )
            setTimeout(() => this.takeTurn(), 300);   
        } else {
            let rand = this.state.ran;
            if(rand === this.state.ran){
                answer['correct'] = 1;
                let incorrect = 1;
                this.setState(prevState =>({guesses: prevState.guesses + 1, currentIncorrect: 1, incorrect: prevState.incorrect + incorrect}), () => {
                this.props.handlePoints(this.state.correct, this.state.incorrect, this.state.questions)
            });
            ;    
            }
        }
    }
    render(){
        let answerChoices;
        if(this.state.answers && this.state.answers.length > 0){
            if(this.state.questions < 0){
                answerChoices = []
            } else {
                answerChoices = this.state.answers.map((answer) => {
                    let navClass = "possible card mt-3";
                    let correct = "bg-success possible card mt-3"
                    let incorrect = "bg-danger possible card mt-3"
                    return <li onClick={() => this.checkAnswer(answer)}className={answer.correct === 2 ? navClass : (answer.correct === 1 ? incorrect : correct)} value={answer.id} key={answer.id}>{answer.name}</li>
                })
            }
        }
        return(
            <div>
                <h5>Directions</h5>
                <p>A statement will be shown with four choices. Select the correct answer for the maximum number of points. Incorrect answers will receive less points and make two incorrect choices will yield no points. Select all incorrect answers and you will LOSE a point. Good luck!</p>
                {!this.props.isStarted && <button className="btn btn-lg btn-success" onClick={() => this.takeTurn()}>Start Game</button>}
                {this.props.isStarted && <div>What is the capital of {this.state.currentCountry && this.state.currentCountry.name}?</div>}
                {this.props.isStarted && this.state.guesses && <div>{this.state.guesses} guesses</div>}
                {this.props.isStarted && this.state.guesses && <div>For {3-this.state.guesses} {(this.state.guesses === 2 || this.state.guesses ===4) ? 'point' : 'points' }</div>}
                {this.state.answers && this.state.answers.length > 0 && <ul className="px-0">{answerChoices}</ul>}
            </div>

        )
    }
}

export default Choice;