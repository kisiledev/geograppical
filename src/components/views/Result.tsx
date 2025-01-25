import React, { useState, useEffect, useCallback } from "react";
import Flag from "react-world-flags";
import { Link } from "react-router-dom";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { doc, getDoc, deleteDoc, setDoc } from "firebase/firestore";
import "../../App.css";

import { usersCollection } from "../../firebase/firebase";

import * as ROUTES from "../../constants/Routes";
import { AlertColor, Card } from "@mui/material";
import { CountryType } from "../../helpers/types/CountryType";
import { User } from "firebase/auth";

type Message = {
  link: string;
  linkContent: string;
  content: string;
  style: AlertColor;
};
interface ResultProps {
  getCountryInfo: (country: string) => void;
  filtered: CountryType;
  user: User | null;
  country: CountryType;
  name: string;
  subregion: string;
  capital: string;
  population: number;
  flagCode: string;
  setShow: (show: boolean) => void;
  setMessage: (message: Message) => void;
  message: Message;
}
const Result = (props: ResultProps) => {
  const [favorite, setFavorite] = useState(false);

  const {
    getCountryInfo,
    filtered,
    user,
    country,
    name,
    subregion,
    capital,
    population,
    flagCode,
    setShow,
    setMessage,
    message,
  } = props;

  const showFunc = () => {
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 4000);
  };
  const checkFavorite = useCallback(
    async (coun: string) => {
      if (!user) {
        return;
      }
      const docRef = doc(
        usersCollection,
        ...`${user.uid}/favorites/${coun}`.split("/")
      );

      try {
        const countryDoc = await getDoc(docRef);
        if (countryDoc.exists()) {
          setFavorite(true);
        } else {
          setFavorite(false);
        }
      } catch (error) {
        console.log("Error getting document:", error);
      }
    },
    [user]
  );
  const makeFavorite = async (coun: CountryType) => {
    console.log("adding");
    if (!user) {
      setMessage({
        style: "warning",
        content: "You need to sign in to favorite countries. Login ",
        link: ROUTES.SIGN_IN,
        linkContent: "here",
      });
    }
    if (!favorite) {
      if (!user) {
        return;
      }
      const docRef = doc(
        usersCollection,
        ...`${user.uid}/favorites/${coun.name}`.split("/")
      );

      try {
        await setDoc(docRef, coun);
        setMessage({
          ...message,
          style: "success",
          content: `Added ${coun.name} to favorites`,
        });
        setFavorite(true);
        console.log("added favorite");
        showFunc();
      } catch (error) {
        setMessage({
          ...message,
          style: "error",
          content: `Error adding ${coun.name} to favorites, ${error}`,
        });
        showFunc();
      }
    } else {
      if (!user) {
        return;
      }
      const docRef = doc(
        usersCollection,
        ...`${user.uid}/favorites/${coun.name}`.split("/")
      );

      try {
        await deleteDoc(docRef);
        setMessage({
          ...message,
          style: "warning",
          content: `Removed ${coun.name} from favorites`,
        });
        setFavorite(false);
        showFunc();
      } catch (error) {
        setMessage({
          ...message,
          style: "error",
          content: `Error adding ${coun.name} to favorites, ${error}`,
        });
        showFunc();
      }
    }
  };

  useEffect(() => {
    if (user) {
      checkFavorite(country.name);
    }
  }, [filtered, checkFavorite, user, country.name]);
  return (
    <Card raised className="mr-md-3 card mb-3">
      <div className="result media">
        <div className="media-body">
          <h4 className="title">
            {name} ({flagCode}
            )
            <br />
            <small>
              Capital: {capital?.split(";")[0]} | Pop: {population}
            </small>
          </h4>
          <p className="subregion">
            <strong>Location: </strong>
            {subregion}
          </p>
          <Link
            to={`/${name}`}
            className="btn btn-success btn-sm"
            onClick={() => getCountryInfo(name)}
          >
            Read More
          </Link>
        </div>
        {user && (
          <div className="stars">
            <FontAwesomeIcon
              onClick={() => makeFavorite(country)}
              size="2x"
              color={favorite ? "gold" : "gray"}
              icon={faStar}
            />
          </div>
        )}
        <Flag
          className="img-thumbnail"
          code={flagCode || "_unknown"}
          alt={`${name}'s Flag`}
        />
      </div>
    </Card>
  );
};

export default Result;
