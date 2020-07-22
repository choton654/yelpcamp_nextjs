import {
  Button,
  FormControl,
  Input,
  InputLabel,
  Slide,
  Snackbar,
} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Gavel from '@material-ui/icons/Gavel';
import VerifiedUserTwoTone from '@material-ui/icons/VerifiedUserTwoTone';
import Link from 'next/link';
import { signUpUser } from '../lib/auth';

function Transition(props) {
  return <Slide direction='up' {...props} />;
}

class Signup extends React.Component {
  state = {
    createdUser: null,
    name: '',
    email: '',
    password: '',
    error: '',
    isLoading: false,
    openSuccess: false,
    openError: false,
  };

  handelSubmit = (e) => {
    const { name, email, password } = this.state;
    const user = { name, email, password };
    e.preventDefault();
    this.setState({ isLoading: true });
    signUpUser(user)
      .then((createdUser) => {
        this.setState({
          createdUser,
          isLoading: false,
          error: '',
          openSuccess: true,
        });
      })
      .catch(this.showError);
    this.setState({
      name: '',
      email: '',
      password: '',
    });
  };

  showError = (err) => {
    console.log(err.response.data.errors[0]);
    const error =
      (err.response && err.response.data.errors[0].msg) || err.message;
    this.setState({ error, openError: true, isLoading: false });
  };

  handleClose = () => {
    this.setState({ openError: false });
  };

  handelChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { classes } = this.props;
    const {
      error,
      openError,
      openSuccess,
      createdUser,
      isLoading,
    } = this.state;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <Gavel />
          </Avatar>
          <Typography variant='h5' component='h1'>
            Sign Up
          </Typography>
          <form className={classes.form} onSubmit={this.handelSubmit}>
            <FormControl margin='normal' required fullWidth>
              <InputLabel htmlFor='name'>Name</InputLabel>
              <Input
                value={this.state.name}
                name='name'
                type='text'
                onChange={this.handelChange}
              />
            </FormControl>
            <FormControl margin='normal' required fullWidth>
              <InputLabel htmlFor='email'>Email</InputLabel>
              <Input
                value={this.state.email}
                name='email'
                type='email'
                onChange={this.handelChange}
              />
            </FormControl>
            <FormControl margin='normal' required fullWidth>
              <InputLabel htmlFor='password'>Password</InputLabel>
              <Input
                value={this.state.password}
                name='password'
                type='text'
                onChange={this.handelChange}
              />
            </FormControl>
            <Button
              type='submit'
              fullWidth
              className={classes.submit}
              variant='contained'
              color='primary'
              disabled={isLoading}>
              {isLoading ? 'signing Up...' : 'sign up'}
            </Button>
          </form>

          {/* on error */}
          {error && (
            <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              open={openError}
              message={<span className={classes.snack}>{error}</span>}
              autoHideDuration={6000}
              onClose={this.handleClose}
            />
          )}
        </Paper>

        {/* on success */}
        {createdUser && (
          <Dialog
            open={openSuccess}
            disableBackdropClick={true}
            TransitionComponent={Transition}>
            <DialogTitle id=''>
              <VerifiedUserTwoTone className={classes.icon} />
              New Account
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                User {createdUser.name} successfully created!
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button color='primary' variant='contained'>
                <Link href='/signin'>
                  <a className={classes.signinLink}>Sign In</a>
                </Link>
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </div>
    );
  }
}

const styles = (theme) => ({
  root: {
    width: 'auto',
    display: 'block',
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  signinLink: {
    textDecoration: 'none',
    color: 'white',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    marginTop: theme.spacing(2),
  },
  snack: {
    color: theme.palette.secondary.light,
  },
  icon: {
    padding: '0px 2px 2px 0px',
    verticalAlign: 'middle',
    color: 'green',
  },
});

export default withStyles(styles)(Signup);
