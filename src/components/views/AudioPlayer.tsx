import { Card, CardMedia } from '@mui/material';
import { useState, useEffect } from 'react';
import { CountryType } from '../../helpers/types/CountryType';

interface AudioPlayerProps {
  nation: CountryType;
}
const AudioPlayer = ({ nation }: AudioPlayerProps) => {
  const {
    government: {
      national_anthem: { audio_url: audioUrl, name: anthemName }
    },
    name
  } = nation;
  const [active, setActive] = useState(false);

  const getResponse = async () => {
    const response = await fetch(audioUrl, { mode: 'no-cors' });
    if (response.status === 200 && audioUrl !== undefined) {
      setActive(true);
      // The url exists
    } else {
      // The url does not exist
      setActive(false);
    }
  };
  useEffect(() => {
    getResponse();
  }, [nation]);

  return active ? (
    <Card raised className="card align-self-start my-3">
      <p>{`${name}'s National Anthem, ${anthemName}`}</p>
      <CardMedia component="audio" src={audioUrl} />
    </Card>
  ) : null;
};
export default AudioPlayer;
