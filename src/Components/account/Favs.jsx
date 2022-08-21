import React from 'react';
import Flag from 'react-world-flags';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { countryType, acctDataType } from '../../helpers/Types/index';

const Favs = (props) => {
  const { acctData, simplifyString, deleteDocument } = props;
  return (
    <Collapse in={acctData.isOpen}>
      <ul className="list-group list-group-flush">
        {acctData && acctData.data.length > 0 ? (
          acctData.data.map((favorite) => (
            <li className="list-group-item" key={favorite.id}>
              <h5>
                {favorite.id}-
                <small>
                  {favorite.data.government.capital.name.split(';')[0]}
                </small>
              </h5>
              <div className="d-flex justify-content-between">
                <Link to={`/${simplifyString(favorite.id.toLowerCase())}`}>
                  <Flag
                    className="favFlag img-thumbnail"
                    code={
                      (
                        favorite.data.government.country_name.isoCode
                          ? favorite.data.government.country_name.isoCode
                          : '_unknown'
                      )
                        ? favorite.data.government.country_name.isoCode
                        : `_${favorite.data.name}`
                    }
                    format="svg"
                    pngSize={64}
                    shiny={false}
                    alt={`${favorite.data.name}'s Flag`}
                    basePath="/img/flags"
                  />
                </Link>
                <FontAwesomeIcon
                  className="align-self-center"
                  onClick={() => deleteDocument(favorite.id, 'favorites')}
                  icon={faTrashAlt}
                  size="2x"
                  color="darkred"
                />
              </div>
            </li>
          ))
        ) : (
          <h5>You have no favorites saved</h5>
        )}
      </ul>
    </Collapse>
  );
};

Favs.propTypes = {
  acctData: PropTypes.arrayOf([
    PropTypes.oneOfType([
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        data: countryType.isRequired,
        isOpen: PropTypes.bool.isRequired
      }).isRequired,
      acctDataType.isRequired
    ]).isRequired
  ]).isRequired,
  deleteDocument: PropTypes.func.isRequired,
  simplifyString: PropTypes.func.isRequired
};
export default Favs;
