import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  CircularProgress,
  Typography
} from '@mui/material';

import { ExpandMore } from '@mui/icons-material';
import Favs from './Favs';
import Scores from './Scores';
import {
  AccountDataType,
  FavoritePayload,
  ScorePayload
} from '../../helpers/types/index';

interface AccountDataProps {
  acctData: ScorePayload | FavoritePayload;
  deleteDocument: (name: string, id: string) => void;
  simplifyString: (string: string) => string;
  capitalize: (string: string) => string;
  name: AccountDataType;
  toggleData: (name: AccountDataType) => void;
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
                <CircularProgress />
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
