import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner, faAngleUp, faAngleDown,
} from '@fortawesome/free-solid-svg-icons';
import { Badge } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Favs from './Favs';
import Scores from './Scores';
import {
  acctDataType,
} from '../Helpers/Types/index';

const AccountData = (props) => {

  const {
    capitalize,
    simplifyString,
    deleteFavorite,
    deleteScore,
    name,
    toggleData,
    loadingState,
    acctData,
    boolean,
  } = props;
  return (
    <div className="col-sm-12 col-lg-5 card datacard mx-auto my-1">
      <h5
        className="list-group-item d-flex align-items-center"
        onClick={() => toggleData(name)}
        role="button"
      >
        {capitalize(name)}
        <Badge variant="primary">
          {loadingState ? <FontAwesomeIcon icon={faSpinner} spin />
            : acctData && acctData.data.length > 0 && acctData.data.length}
        </Badge>
        {acctData && <FontAwesomeIcon className="align-text-top" icon={boolean ? faAngleUp : faAngleDown} />}
      </h5>
      {loadingState ? null
        : (
          acctData && (
            name === 'favorites'
              ? (
                <Favs
                  acctData={acctData}
                  simplifyString={simplifyString}
                  deleteFavorite={deleteFavorite}
                />
              )
              : (
                <Scores
                  acctData={acctData}
                  deleteScore={deleteScore}
                />
              )
          )
        )}
    </div>
  );
};
AccountData.propTypes = {
  boolean: PropTypes.bool.isRequired,
  acctData: acctDataType.isRequired,
  deleteFavorite: PropTypes.func.isRequired,
  deleteScore: PropTypes.func.isRequired,
  simplifyString: PropTypes.func.isRequired,
  capitalize: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  toggleData: PropTypes.func.isRequired,
  loadingState: PropTypes.bool.isRequired,
};
export default AccountData;
