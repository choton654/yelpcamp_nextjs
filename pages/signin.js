import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Lock from '@material-ui/icons/Lock';
import router from 'next/router';
import { signInUser } from '../lib/auth';

class Signin extends React.Component {
  state = {
    email: '',
    password: '',
    error: '',
    isLoading: false,
    openError: false,
  };

  handelSubmit = (e) => {
    const { email, password } = this.state;
    const user = { email, password };
    e.preventDefault();
    this.setState({ isLoading: true });
    signInUser(user)
      .then(() => {
        this.setState({
          isLoading: false,
          error: '',
          openSuccess: true,
        });
        router.push('/');
      })
      .catch(this.showError);
    this.setState({
      email: '',
      password: '',
    });
  };

  showError = (err) => {
    console.log(err.response.data);
    const error = (err.response && err.response.data) || err.message;
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
    const { error, openError, isLoading } = this.state;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <Lock />
          </Avatar>
          <Typography variant='h5' component='h1'>
            Sign In
          </Typography>
          <form className={classes.form} onSubmit={this.handelSubmit}>
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
              {isLoading ? 'signing in...' : 'sign in'}
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
});

export default withStyles(styles)(Signin);
