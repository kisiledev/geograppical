import { Navigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

const PrivateRoute = ({
  children,
  authenticated,
  loadingState
}: {
  children: JSX.Element;
  authenticated: boolean;
  loadingState: boolean;
}) => {
  if (loadingState) {
    return (
      <div className="mt-5 mx-auto text-center">
        <CircularProgress />
      </div>
    );
  }
  return authenticated ? children : <Navigate to="/login" />;
};
export default PrivateRoute;
