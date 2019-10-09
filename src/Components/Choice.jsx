import React, {useState, useEffect} from 'react';

const Choice = props => {

    const [currentCountry, setCurrentCountry] = useState(null)
    const [currentCountryId, setCurrentCountryId] = useState(null)
    const [guesses, setGuesses] = useState(null)
    const [answers, setAnswers] = useState(null)
    const [questions, setQuestions] = useState([])
    // const [ran, setRan] = useState(null)

    useEffect(() => {
        props.handlePoints(questions);
    }, [])
    useEffect(() => {
        console.log(`ending game`)
        endGame(); 
    }, [props.saved, props.gameOver]);

    const endGame = () => {
        setAnswers(null)
        setQuestions([])
        setGuesses(null)
        setCurrentCountry(null)
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
        const int = getRandomInt(0, props.data.length);
        setCurrentCountryId(int)
        let country = props.data[int];
        return country;
    }
    const randomExcluded = (min, max, excluded) => {
        let n = Math.floor(Math.random() * (max-min) + min);
        if (n >= excluded) n++;
        return n;
    }

    const getAnswers = (currentCountry) => {
        let answerQuestions;
        if(questions){
          answerQuestions = [...questions]
        }
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
            let ran = randomExcluded(0, props.data.length -1, currentCountryId);
            let newName;
            if(props.data[ran].government.capital.name || ran < 0){
                newName = props.data[ran].government.capital.name.split(';')[0]
            } else {
                ran = randomExcluded(0, props.data.length-1, currentCountryId);
                newName = props.data[ran].government.capital.name.split(';')[0]
            }
            let capital = {
                name: newName,
                id: x + 1, 
                correct: 2}
            answers.push(capital);
            shuffle(answers);
            setAnswers(answers)
        }
        question['answers'] = answers;
        
        answerQuestions.push(question);
        setQuestions(answerQuestions)
    }
    const takeTurn = () => {
            !props.isStarted && props.startGame();
            let country = getRandomCountry();
            setGuesses(prevGuess => prevGuess + 1)
            setCurrentCountry(country)
            getAnswers(country)
            if(questions && questions.length === 10){
                console.log(`number of completed questions: ${questions.length}`)
                console.log('showing scores')
                props.handleOpen();
                // setState({questions: [], answers: [], guesses: null})   
                
            }
    }
    
    const checkAnswer = (answer) => {
        //if answer is correct answer (all correct answers have ID of 0)
        let checkquestions = questions;
        let question = checkquestions.find(question => question.country === currentCountry);
        let checkguesses = guesses;
        if(answer.id === 0){
            //give score of 2
            props.updateScore(3-guesses);
            //set answer style
            answer['correct'] = 0;
            //initialize correct counter for game
            if(guesses === 1){
                question['correct'] = true;
            }
            checkguesses = null;
            setTimeout(() => takeTurn(), 300);   
        } else {
            answer['correct'] = 1;
            question['correct'] = false;
            checkguesses ++
        }
        setGuesses(checkguesses)
        props.handlePoints(questions);
    }
        const { isStarted } = props;
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
                {answers && answers.length > 0 && <ul className="px-0 d-flex justify-content-center flex-wrap">{answerChoices}</ul>}
            </div>

        )
}

export default Choice;