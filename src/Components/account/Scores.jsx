import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Collapse } from 'react-bootstrap';
import PropTypes from 'prop-types';
import {
  countryType,
  acctDataType,
  scoreType,
} from '../Helpers/Types/index';

const Scores = (props) => {
  const {
    acctData,
    deleteScore,
  } = props;
  console.log(acctData);
  return (
    <Collapse in={acctData.isOpen}>
      <ul className="list-group list-group-flush">
        {acctData && acctData.data.length > 0 ? acctData.data.map((score) => {
          const milliseconds = score.data.dateCreated.seconds * 1000;
          const currentDate = new Date(milliseconds);
          const dateTime = currentDate.toGMTString();
          return (
            <li className="list-group-item" key={score.id}>
              <div className="d-flex justify-content-between">
                <div className="d-flex flex-column">
                  <h6>
                    <strong>{dateTime}</strong>
                  </h6>
                  {score.data.gameMode
                    && (
                      <h6>
                        {`Mode - ${score.data.gameMode}`}
                      </h6>
                    )}
                  {score.data.score
                    && (
                      <h6>
                        {`Score - ${score.data.score}`}
                      </h6>
                    )}
                  <h6>
                    {`Correct - ${score.data.correct}`}
                  </h6>
                  <h6>
                    {`Incorrect - ${score.data.incorrect}`}
                  </h6>
                </div>
                <FontAwesomeIcon className="align-self-center" onClick={() => deleteScore(score.id)} icon={faTrashAlt} size="2x" color="darkred" />
              </div>
            </li>
          );
        }) : <h5>You have no scores saved</h5>}
      </ul>
    </Collapse>
  );
};

Scores.propTypes = {
  acctData: scoreType.isRequired,
  deleteScore: PropTypes.func.isRequired,
};
export default Scores;
