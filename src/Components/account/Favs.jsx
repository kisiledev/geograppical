import React from 'react';
import Flag from 'react-world-flags';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Link as RouterLink } from 'react-router-dom';
import { Collapse, IconButton, Link, List, ListItem } from '@mui/material';
import PropTypes from 'prop-types';
import { countryType, acctDataType } from '../../helpers/Types/index';
import { Delete } from '@mui/icons-material';

const Favs = (props) => {
  const { acctData, simplifyString, deleteDocument } = props;
  return (
    <List>
      {acctData && acctData.data.length > 0 ? (
        acctData.data.map((favorite) => {
          console.log(favorite?.data?.government.country_name.isoCode);
          if (favorite?.data)
            return (
              <ListItem divider key={favorite.id}>
                <Link
                  component={RouterLink}
                  sx={{ marginRight: '20px' }}
                  to={`/${simplifyString(favorite.id.toLowerCase())}`}
                >
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
                    width={64}
                    shiny={false}
                  />
                </Link>
                <h5>
                  {favorite.id}-
                  <small>
                    {favorite.data.government.capital.name.split(';')[0]}
                  </small>
                </h5>
                <IconButton
                  sx={{ marginLeft: 'auto' }}
                  color="error"
                  onClick={() => deleteDocument(favorite.id, 'favorites')}
                >
                  <Delete />
                </IconButton>
              </ListItem>
            );
        })
      ) : (
        <h5>You have no favorites saved</h5>
      )}
    </List>
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
