import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import {
  Avatar,
  Button,
  Card,
  Grid2,
  IconButton,
  Typography,
} from "@mui/material";
import { ArrowBack, Edit } from "@mui/icons-material";
import userImg from "../../img/user.png";
import { FavoriteData, ScoreData } from "../../helpers/types";
import { User } from "firebase/auth";

interface AcctHeaderProps {
  loadingState: boolean;
  favorites: FavoriteData;
  scores: ScoreData;
  user: User | null;
  edit: boolean;
  setEdit: (edit: boolean) => void;
}
const AcctHeader = (props: AcctHeaderProps) => {
  const { loadingState, favorites, scores, user, edit, setEdit } = props;
  const [hover, setHover] = useState(false);
  return (
    <Card
      sx={{
        marginBottom: "50px",
        padding: "20px",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        fontSize: 16,
      }}
    >
      <Grid2
        container
        sx={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Grid2
          size={{ sm: 12 }}
          sx={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <Avatar
            sx={{
              width: 96,
              height: 96,
              border: "2px solid #000",
              opacity: edit && hover ? 0.5 : 1,
              backgroundColor: "#000",
            }}
            src={user?.photoURL || userImg}
            alt={user?.displayName || "User"}
          />
          {edit && hover && (
            <IconButton
              sx={{
                position: "absolute",
                margin: "0 auto",
                padding: "40%",
              }}
              component="label"
            >
              <Edit sx={{ color: "#f4a" }} titleAccess="Click to edit" />
              <input type="file" id="upload-img" hidden />
            </IconButton>
          )}
        </Grid2>
        <Grid2
          size={{ sm: 12 }}
          sx={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography component="h5" variant="h5" sx={{ marginTop: "5px" }}>
            {user?.displayName}
          </Typography>
          {user?.metadata?.creationTime && (
            <Typography component="p" variant="body1">
              {`User since ${new Date(
                user.metadata.creationTime
              ).toLocaleDateString()}`}
            </Typography>
          )}
          <Typography component="p" variant="body1" sx={{ fontWeight: 600 }}>
            {user?.email}
          </Typography>
          <Typography component="p" variant="body1">
            {user?.phoneNumber || "No phone number added"}
          </Typography>
          {loadingState ? (
            <FontAwesomeIcon className="my-5" icon={faSpinner} spin size="2x" />
          ) : (
            <>
              <Typography
                component="h6"
                variant="h6"
                sx={{ marginTop: "25px", fontWeight: 600 }}
              >
                Stats
              </Typography>
              <Typography>
                {favorites?.length === 0
                  ? "No Favorites"
                  : `${favorites?.length} Favorite${
                      favorites?.length > 1 && "s"
                    }`}
              </Typography>
              <Typography>
                {scores?.length === 0
                  ? "No Scores"
                  : `${scores?.length} Score${scores?.length > 1 && "s"}`}
              </Typography>
            </>
          )}
        </Grid2>
        <Grid2 size={{ sm: 12 }}>
          <Button
            variant="contained"
            color="success"
            onClick={() => setEdit(!edit)}
            startIcon={!edit ? <Edit /> : <ArrowBack />}
            sx={{ marginTop: "20px" }}
          >
            {edit ? "Back to Account" : "Edit Account"}
          </Button>
        </Grid2>
      </Grid2>
    </Card>
  );
};

export default AcctHeader;
