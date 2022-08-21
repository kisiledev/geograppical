import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner,
  faAngleUp,
  faAngleDown
} from '@fortawesome/free-solid-svg-icons';
import { Badge, Chip } from '@mui/material';
import PropTypes from 'prop-types';
import Favs from './Favs';
import Scores from './Scores';
import { acctDataType } from '../../Helpers/Types/index';

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
    <div className="col-sm-12 col-lg-5 card datacard mx-auto my-1">
      <h5
        className="list-group-item d-flex align-items-center"
        onClick={() => toggleData(name)}
        role="button"
      >
        {capitalize(name)}
        <Chip
          label={
            loadingState ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              acctData && acctData.data.length > 0 && acctData.data.length
            )
          }
          variant="contained"
        />
        {acctData && (
          <FontAwesomeIcon
            className="align-text-top"
            icon={boolean ? faAngleUp : faAngleDown}
          />
        )}
      </h5>
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
    </div>
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
