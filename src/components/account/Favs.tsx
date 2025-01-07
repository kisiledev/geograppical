import React from 'react';
import Flag from 'react-world-flags';
import { Link as RouterLink } from 'react-router-dom';
import {
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import { Delete } from '@mui/icons-material';
import { FavoritePayload } from '../../helpers/types';

interface FavsProps {
  acctData: FavoritePayload;
  simplifyString: Function;
  deleteDocument: Function;
}

const Favs = (props: FavsProps) => {
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
                  to={`/${simplifyString(favorite.id).toLowerCase()}`}
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
                <Grid>
                  <Typography fontWeight={600}>{favorite.id}</Typography>
                  <Typography>
                    {favorite.data.government.capital.name.split(';')[0]}
                  </Typography>
                </Grid>

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
export default Favs;
