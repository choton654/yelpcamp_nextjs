import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ShareOutlined from '@material-ui/icons/ShareOutlined';
import { signOutUser } from '../lib/auth';
import ActiveLink from './ActiveLink';

const Navbar = ({ classes, router, pageProps: { auth } }) => {
  const { user = {} } = auth || {};
  // console.log('navbar user', user);
  return (
    <div>
      <AppBar
        className={classes.appBar}
        position={router.pathname === '/' ? 'fixed' : 'static'}>
        <Toolbar>
          <ActiveLink href='/'>
            <ShareOutlined className={classes.icon} />
          </ActiveLink>
          <Typography
            variant='h5'
            component='h1'
            className={classes.toolbarTitle}>
            <ActiveLink href='/'>Yelpcamp</ActiveLink>
          </Typography>
          {user._id ? (
            // Auth Navigation
            <div>
              <Button>
                <ActiveLink href={`/profile/${user._id}`}>Profile</ActiveLink>
              </Button>
              <Button onClick={signOutUser} variant='outlined'>
                Sign out
              </Button>
            </div>
          ) : (
            // UnAuth Navigation
            <div>
              <Button>
                <ActiveLink href='/signin'>Sign in</ActiveLink>
              </Button>
              <Button>
                <ActiveLink href='/signup'>Sign up</ActiveLink>
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

const styles = (theme) => ({
  appBar: {
    // z-index 1 higher than the fixed drawer in home page to clip it under the navigation
    zIndex: theme.zIndex.drawer + 1,
  },
  toolbarTitle: {
    flex: 1,
  },
  icon: {
    marginRight: theme.spacing(1),
  },
});

export default withStyles(styles)(Navbar);
