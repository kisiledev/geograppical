import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: ['sofia-pro-soft', 'sans-serif'].join(',')
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: ['sofia-pro-soft'],
          textTransform: 'inherit',
          fontSize: 16
        }
      }
    }
  }
});

export default theme;
