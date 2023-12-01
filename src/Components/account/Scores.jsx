import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import PropTypes from 'prop-types';
import {
  countryType,
  acctDataType,
  scoreType
} from '../../helpers/types/index';
import { Box, Collapse, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';

const Scores = (props) => {
  const { acctData, deleteDocument } = props;
  return (
    <ul className="list-group list-group-flush">
      {acctData && acctData.data.length > 0 ? (
        acctData.data.map((score) => {
          const milliseconds = score.data.dateCreated.seconds * 1000;
          const currentDate = new Date(milliseconds);
          const dateTime = currentDate.toGMTString();
          return (
            <li className="list-group-item" key={score.id}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div className="d-flex flex-column">
                  <h6>
                    <strong>{dateTime}</strong>
                  </h6>
                  {score.data.gameMode && (
                    <h6>{`Mode - ${score.data.gameMode}`}</h6>
                  )}
                  {score.data.score && <h6>{`Score - ${score.data.score}`}</h6>}
                  <h6>{`Correct - ${score.data.correct}`}</h6>
                  <h6>{`Incorrect - ${score.data.incorrect}`}</h6>
                </div>
                <IconButton
                  sx={{ marginLeft: 'auto' }}
                  size="large"
                  color="error"
                  onClick={() => deleteDocument(score.id, 'scores')}
                >
                  <Delete />
                </IconButton>
              </Box>
            </li>
          );
        })
      ) : (
        <h5>You have no scores saved</h5>
      )}
    </ul>
  );
};

Scores.propTypes = {
  acctData: scoreType.isRequired,
  deleteDocument: PropTypes.func.isRequired
};
export default Scores;
