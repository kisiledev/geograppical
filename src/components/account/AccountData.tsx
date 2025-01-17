import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Typography
} from '@mui/material';

import { ExpandMore } from '@mui/icons-material';
import Favs from './Favs';
import Scores from './Scores';
import {
  FavoriteData,
  FavoritePayload,
  ScoreData,
  ScorePayload
} from '../../helpers/types/index';

interface AccountDataProps {
  acctData: ScorePayload | FavoritePayload;
  deleteDocument: Function;
  simplifyString: (string: string) => string;
  capitalize: Function;
  name: string;
  toggleData: Function;
  loadingState: boolean;
}
const AccountData = (props: AccountDataProps) => {
  const {
    capitalize,
    simplifyString,
    deleteDocument,
    name,
    toggleData,
    loadingState,
    acctData
  } = props;

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
            variant="filled"
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
                acctData={acctData as FavoritePayload}
                simplifyString={simplifyString}
                deleteDocument={deleteDocument}
              />
            ) : (
              <Scores
                acctData={acctData as ScorePayload}
                deleteDocument={deleteDocument}
              />
            ))}
      </AccordionDetails>
    </Accordion>
  );
};
export default AccountData;
