import React from 'react';
import { auth } from '../Firebase/firebase';

const withAuthProtection = redirectPath => WrappedComponent => {
    class WithAuthProtection extends React.Component {
      componentDidMount = () => {
        const {history} = this.props;
        console.log(history)
        console.log(redirectPath)
        if(!auth.currentUser){
          return history.push(redirectPath);
        }
      }
      componentWillReceiveProps = (nextProps) => {
        const {user, history} = this.props;
        console.log(user);
        console.log(history)
        const {user: nextUser} = nextProps;
        if(user && nextUser){
            console.log(history)
          history.push(redirectPath)
        }
      }

      render() {
          const {user} = this.props;
          if (!user) {
              return null;
          }
          return <WrappedComponent { ...this.props} />
      }
    }
    return WithAuthProtection;
  }

  export default withAuthProtection;