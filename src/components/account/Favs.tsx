import Flag from "react-world-flags";
import { Link as RouterLink } from "react-router-dom";
import {
  Grid2,
  IconButton,
  Link,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { FavoritePayload } from "../../helpers/types";

interface FavsProps {
  acctData: FavoritePayload;
  simplifyString: (str: string) => string;
  deleteDocument: (id: string, collection: string) => void;
}

const Favs = (props: FavsProps) => {
  const { acctData, simplifyString, deleteDocument } = props;

  return (
    <List>
      {acctData && acctData.data.length > 0 ? (
        acctData.data.map((favorite) => {
          if (favorite?.data)
            return (
              <ListItem divider key={favorite.id}>
                <Link
                  component={RouterLink}
                  sx={{ marginRight: "20px" }}
                  to={`/${simplifyString(favorite.id).toLowerCase()}`}
                >
                  <Flag
                    className="favFlag img-thumbnail"
                    code={
                      (
                        favorite.data.government.country_name.isoCode
                          ? favorite.data.government.country_name.isoCode
                          : "_unknown"
                      )
                        ? favorite.data.government.country_name.isoCode
                        : `_${favorite.data.name}`
                    }
                    width={64}
                  />
                </Link>
                <Grid2>
                  <Typography fontWeight={600}>{favorite.id}</Typography>
                  <Typography>
                    {favorite.data.government.capital.name.split(";")[0]}
                  </Typography>
                </Grid2>

                <IconButton
                  sx={{ marginLeft: "auto" }}
                  color="error"
                  onClick={() => deleteDocument(favorite.id, "favorites")}
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
