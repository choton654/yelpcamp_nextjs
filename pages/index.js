// import CircularProgress from "@material-ui/core/CircularProgress";
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Router from 'next/router';
import PostFeed from '../components/index/PostFeed';
import UserFeed from '../components/index/UserFeed';
import { authInitialProps } from '../lib/auth';

const Index = ({ classes, auth }) => {
  return (
    <main className={classes.root}>
      {auth.user && auth.user._id ? (
        // Auth user page
        <Grid container>
          <Grid item xs={12} sm={12} md={7}>
            <PostFeed auth={auth} />
          </Grid>
          <Grid item className={classes.drawerContainer}>
            <Drawer
              className={classes.drawer}
              variant='permanent'
              anchor='right'
              classes={{
                paper: classes.drawerPaper,
              }}>
              <UserFeed auth={auth} />
            </Drawer>
          </Grid>
        </Grid>
      ) : (
        // splash page
        <Grid
          justify='center'
          alignItems='center'
          direction='row'
          container
          className={classes.heroContent}>
          <Typography
            component='h1'
            variant='h2'
            align='center'
            color='textPrimary'
            gutterBottom>
            A Better Social Network
          </Typography>
          <Typography
            variant='h6'
            align='center'
            color='textSecondary'
            component='p'>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maxime
            nesciunt suscipit voluptas harum commodi fugiat ab, rem facilis
            alias veritatis labore totam nihil! Distinctio veniam consectetur
            vitae magni. Dolorem, necessitatibus.
          </Typography>
          <Button
            className={classes.fabButton}
            variant='contained'
            color='primary'
            onClick={() => Router.push('/signup')}>
            Get Started
          </Button>
        </Grid>
      )}
    </main>
  );
};

const styles = (theme) => ({
  root: {
    paddingTop: theme.spacing(10),
    paddingLeft: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
      paddingRight: theme.spacing(5),
    },
  },
  progressContainer: {
    height: '80vh',
  },
  progress: {
    margin: theme.spacing(2),
    color: theme.palette.secondary.light,
  },
  drawerContainer: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  drawer: {
    width: 350,
  },
  drawerPaper: {
    marginTop: 70,
    width: 350,
  },
  fabButton: {
    margin: theme.spacing(3),
  },
  heroContent: {
    maxWidth: 600,
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(6),
    margin: '0 auto',
  },
});

Index.getInitialProps = authInitialProps();

export default withStyles(styles)(Index);
