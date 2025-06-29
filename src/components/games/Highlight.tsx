import { useState, useEffect, useCallback, WheelEvent } from 'react';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography
} from 'react-simple-maps';
import ReactTooltip from 'react-tooltip';
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CircularProgress,
  List,
  ListItemButton,
  Typography
} from '@mui/material';
import { Answer, DataType, Question } from '../../helpers/types/index';
import data from '../../data/world-50m.json';
import gameModes from '../../constants/GameContent';
import { CountryType } from '../../helpers/types/CountryType';
import MediaQuery from 'react-responsive';
import { Add, Public, Remove } from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { keyframes } from '@mui/system';

interface CustomAnswerProps {
  answers: Answer[];
  checkAnswer: (e: React.MouseEvent<HTMLDivElement>, answer: Answer) => void;
  options: { [key: number]: React.CSSProperties };
  loading: boolean;
  otherOptions: React.CSSProperties;
}

// Add the shake animation keyframes
const shakeAnimation = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
`;

// Add the bouncy grow animation keyframes
const bouncyGrowAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;
const CustomAnswer = ({
  answers,
  checkAnswer,
  options,
  loading,
  otherOptions
}: CustomAnswerProps) => (
  <List
    sx={{
      padding: '5px',
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      maxWidth: '600px',
      margin: '0 auto'
    }}
  >
    {loading ? (
      <CircularProgress />
    ) : (
      answers.map((answer) => (
        <List
          sx={{
            width: '45%',
            padding: '10px',
            boxSizing: 'border-box'
          }}
          key={answer.id}
        >
          <ListItemButton
            role="button"
            tabIndex={0}
            onClick={(e) => checkAnswer(e, answer)}
            component={Card}
            sx={{
              ...otherOptions,
              backgroundColor:
                answer.correct === 2
                  ? 'initial'
                  : options[answer.correct].backgroundColor,
              '&:hover': {
                backgroundColor:
                  answer.correct === 2
                    ? 'initial'
                    : options[answer.correct].backgroundColor
              },
              height: '60px',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              animation:
                answer.correct === 1
                  ? `${shakeAnimation} 0.5s ease-in-out`
                  : answer.correct === 0
                  ? `${bouncyGrowAnimation} 0.5s ease-in-out`
                  : 'none'
            }}
          >
            {answer.name}
            {answer.correct === 0 && (
              <CheckCircleIcon
                sx={{
                  position: 'absolute',
                  right: 8,
                  color: 'white'
                }}
              />
            )}
            {answer.correct === 1 && (
              <CancelIcon
                sx={{
                  position: 'absolute',
                  right: 8,
                  color: 'white'
                }}
              />
            )}
          </ListItemButton>
        </List>
      ))
    )}
  </List>
);
interface HighlightProps {
  data: DataType;
  isStarted: boolean;
  saved: boolean;
  gameOver: boolean;
  handlePoints: (questions: Question[]) => void;
  handleOpen: () => void;
  updateScore: (score: number) => void;
  startGame: () => void;
  mapVisible: string;
  changeMapView: () => void;
  mode: keyof typeof gameModes;
}
const Highlight = (props: HighlightProps) => {
  const [currentCountry, setCurrentCountry] = useState<CountryType | null>(
    null
  );
  const [currentCountryId, setCurrentCountryId] = useState<number | null>(null);
  const [guesses, setGuesses] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [usedCountry, setUsedCountry] = useState<number[]>([]);
  const [center, setCenter] = useState<[number, number]>([0, 0]);
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [points, setPoints] = useState<number>(2);

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

  const otherOptions = {
    marginTop: '10px',
    margin: '10px 8px none',
    padding: '10px',
    borderRadius: '3px',
    display: 'flex'
  };
  const options = {
    0: {
      ...otherOptions,
      backgroundColor: 'green'
    },
    1: {
      ...otherOptions,
      backgroundColor: 'red'
    },
    2: {
      ...otherOptions,
      backgroundColor: 'initial'
    }
  };
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
  const handleText = useCallback((str: string) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z\s]/gi, '');
  }, []);
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
  const handleWheel = (event: WheelEvent) => {
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
    let int;
    do {
      int = getRandomInt(0, worldData.length);
    } while (usedCountry.includes(int));
    setCurrentCountryId(int);
    const country = worldData[int];
    const usedArray = usedCountry;
    usedArray.push(int);
    setUsedCountry(usedArray);
    return { country, int };
  };
  const randomExcluded = (min: number, max: number, excluded: number) => {
    let n = Math.floor(Math.random() * (max - min) + min);
    if (n >= excluded) n += 1;
    return n;
  };

  const getAnswers = (
    currentCountry: CountryType,
    currentCountryId: number
  ) => {
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
    const fetchanswers: Answer[] = [];
    if (currentCountry) {
      fetchanswers.push({
        name: currentCountry.name.split(';')[0],
        id: 0,
        correct: 2,
        clicked: false
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
        clicked: false
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
  const getCountryInfo = useCallback(
    (country: CountryType) => {
      let nodes = [
        ...(document.getElementsByClassName(
          'gameCountry'
        ) as HTMLCollectionOf<HTMLElement>)
      ];
      if (currentCountry && country) {
        nodes = nodes.filter((node) => {
          if (node.dataset.shortname && node.dataset.longname) {
            return (
              handleText(country.name) === handleText(node.dataset.longname) ||
              handleText(country.name) === handleText(node.dataset.shortname)
            );
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
    },
    [currentCountry, handleText]
  );

  const takeTurn = () => {
    if (!isStarted) {
      startGame();
    }
    const { country, int } = getRandomCountry();
    setGuesses((prevGuess) => prevGuess + 1);
    setCurrentCountry(country);
    getAnswers(country, int);
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
    setLoading(false);
  };

  const checkAnswer = (e: React.MouseEvent<HTMLDivElement>, answer: Answer) => {
    e.stopPropagation();
    if (!isStarted) return;
    if (!currentCountry) return;
    const checkquestion = questions.find(
      (question) => question.country === currentCountry.name
    );
    if (!checkquestion) {
      return;
    }
    let checkguesses = guesses;
    const updatedAnswers = answers.map((a) => ({
      ...a,
      correct: a.id === answer.id ? (answer.id === 0 ? 0 : 1) : a.correct
    }));
    setAnswers(updatedAnswers);

    if (
      answer.name === currentCountry.name ||
      answer.name === currentCountry.name
    ) {
      updateScore(points);
      if (guesses === 1) {
        checkquestion.correct = true;
      }
      checkguesses = 0;
      setGuesses(checkguesses);
      handlePoints(questions);
      setTimeout(() => {
        setAnswers(answers.map((a) => ({ ...a, correct: 2 })));
        setPoints(2);
        setTimeout(() => {
          takeTurn();
        }, 100);
      }, 1900);
    } else {
      checkquestion.correct = false;
      checkguesses += 1;
      setGuesses(checkguesses);
      setPoints(Math.max(0, points - 1));
    }
  };
  useEffect(() => {
    handlePoints(questions);
  }, [handlePoints, questions]);
  useEffect(() => {
    endGame();
  }, [saved, gameOver]);

  useEffect(() => {
    if (currentCountry) {
      getCountryInfo(currentCountry);
    }
  }, [currentCountry, getCountryInfo]);

  useEffect(() => {
    endGame();
  }, [saved, gameOver]);

  const directions = (
    <Box className="directions">
      <Typography variant="h5">Directions</Typography>
      <Typography variant="body1">{gameModes[mode].directions}</Typography>
      <Box sx={{ margin: '10px' }}>
        <Button
          disabled={worldData?.length === 0}
          variant="contained"
          color="success"
          onClick={() => takeTurn()}
        >
          Start Game
        </Button>
      </Box>
    </Box>
  );
  return (
    <Box sx={{ marginBottom: '5px', marginRight: '5px' }}>
      {!isStarted && directions}
      {isStarted && answers && (
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          {guesses > 0 && (
            <Typography variant="body1">
              {guesses} {guesses === 1 ? 'guess' : 'guesses'} - For {points}{' '}
              {points === 1 ? 'point' : 'points'}
            </Typography>
          )}
          {answers.some((a) => a.correct === 0) && (
            <Typography
              variant="body1"
              sx={{ color: 'green', fontWeight: 'bold' }}
            >
              Correct! You earned {points} {points === 1 ? 'point' : 'points'}!
            </Typography>
          )}
          {answers.some((a) => a.correct === 1) &&
            answers.every((a) => a.correct !== 0) && (
              <Typography variant="body1" sx={{ color: 'red' }}>
                Not quite - try again, you've got this!
              </Typography>
            )}
        </Box>
      )}
      <MediaQuery minWidth={576}>
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
              <Remove />
            </Button>
            <Button
              variant="contained"
              className="btn btn-info"
              onClick={() => handleZoomIn()}
            >
              <Add />
            </Button>
          </ButtonGroup>
          <Button
            variant="contained"
            onClick={() => changeMapView()}
            startIcon={<Public sx={{ marginRight: '5px' }} />}
          >
            {mapVisible === 'Show' ? 'Hide ' : 'Show '}
            Map
          </Button>
        </Box>
      </MediaQuery>
      <hr />
      {answers && !loading && answers.length > 0 && (
        <CustomAnswer
          answers={answers}
          options={options}
          checkAnswer={checkAnswer}
          loading={loading}
          otherOptions={otherOptions}
        />
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
                {({ geographies }) =>
                  geographies.map((geo, i) => (
                    <Geography
                      data-idkey={i}
                      data-longname={handleText(geo.properties.NAME_LONG)}
                      data-shortname={geo.properties.NAME}
                      data-continent={geo.properties.CONTINENT}
                      data-subregion={geo.properties.SUBREGION}
                      // onMouseEnter={(() => onRegionHover(geo))}
                      // onMouseLeave={(() => onRegionLeave(geo))}
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
  );
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
