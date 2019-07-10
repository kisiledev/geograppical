import React from 'react';

class Choice extends React.Component {
    state = {
        currentCountry: null,
        correctClick: null,
        capitals: [],
        answers: null,
        questions:10,
        correct: 0,
        incorrect: 0,
        pointsLost: 0
    }
    componentDidUpdate(){
        this.getRandomCountry();
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
        let country = this.props.data[this.getRandomInt(0, this.props.data.length)];
        return country;
    }
    getAnswers = (currentCountry) => {
        let answers = [];
        console.log(currentCountry);
        currentCountry && answers.push(currentCountry.government.capital.name.split(';')[0]);
        console.log(answers);
        answers.length > 0 && console.log(answers);
        for (let x = 0; x < 3; x++) {
            let capital = this.props.data[this.getRandomInt(0, this.props.data.length)].government.capital.name.split(';')[0];
            answers.push(capital);
            this.shuffle(answers);
            console.log(answers)
            this.setState({answers: answers})
        }
    }
    takeTurn = () => {
            !this.props.isStarted && this.props.startGame();
            let country = this.getRandomCountry();
            console.log(country);
            this.setState(prevState => ({questions: prevState.questions -1, currentCountry: country}),this.getAnswers(country));
    }
    
    checkAnswer = (e,) => {
        console.log(e.target)
        if(this.state.currentCountry.government.capital.name.split(';')[0] === e.target.textContent.split(';')[0]){
            alert('Correct! ' + this.state.questions + ' left');
            this.setState(prevState => ({correct: prevState.correct + 1, correctClickId: true}))
            this.props.updateScore(2);
            this.takeTurn();    
        } else {
            alert('sorry try again')
            this.setState(prevState => ({incorrect: prevState.incorrect + 1}))
        }
    }
    render(){
        return(
            <div>
                <h5>Directions</h5>
                <p>A statement will be shown with four choices. Select the correct answer for the maximum number of points. Incorrect answers will receive less points and make two incorrect choices will yield no points. Select all incorrect answers and you will LOSE a point. Good luck!</p>
                {!this.props.isStarted && <button className="btn btn-lg btn-success" onClick={() => this.takeTurn()}>Start Game</button>}
                {this.props.isStarted && <div>What is the capital of {this.state.currentCountry && this.state.currentCountry.name}?</div>}
                {this.state.answers && this.state.answers.length > 0 && 
                    <ul className="px-0">{this.state.answers.map(answer => 
                        <li onClick={(e) => this.checkAnswer(e, answer)}className="possible card mt-3" key={answer}>{answer}</li>)}
                    </ul>}
            </div>

        )
    }
}

export default Choice;