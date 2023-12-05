import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner,
  faAngleUp,
  faAngleDown
} from '@fortawesome/free-solid-svg-icons';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  Box,
  Card,
  Chip,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import Favs from './Favs';
import Scores from './Scores';
import { acctDataType } from '../../helpers/types/index';

const AccountData = (props) => {
  const {
    capitalize,
    simplifyString,
    deleteDocument,
    name,
    toggleData,
    loadingState,
    acctData,
    boolean
  } = props;

  console.log(acctData);
  return (
    <Accordion onClick={() => toggleData(name)}>
      <AccordionSummary
        sx={{ justifyContent: 'space-evenly' }}
        expandIcon={<ExpandMore />}
      >
        <Typography variant="h6">{capitalize(name)}</Typography>
        <Box
          sx={{
            margin: '0 10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Chip
            label={
              loadingState ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                acctData && acctData.data.length > 0 && acctData.data.length
              )
            }
            sx={{
              margin: '0 10px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            color="primary"
            variant="contained"
            size="small"
          />
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {loadingState
          ? null
          : acctData &&
            (name === 'favorites' ? (
              <Favs
                acctData={acctData}
                simplifyString={simplifyString}
                deleteDocument={deleteDocument}
              />
            ) : (
              <Scores acctData={acctData} deleteDocument={deleteDocument} />
            ))}
      </AccordionDetails>
    </Accordion>
  );
};
AccountData.propTypes = {
  boolean: PropTypes.bool.isRequired,
  acctData: acctDataType.isRequired,
  deleteDocument: PropTypes.func.isRequired,
  simplifyString: PropTypes.func.isRequired,
  capitalize: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  toggleData: PropTypes.func.isRequired,
  loadingState: PropTypes.bool.isRequired
};
export default AccountData;
