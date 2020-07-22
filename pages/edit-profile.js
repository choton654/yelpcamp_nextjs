import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import CloudUpload from '@material-ui/icons/CloudUpload';
import EditSharp from '@material-ui/icons/EditSharp';
import FaceTwoTone from '@material-ui/icons/FaceTwoTone';
import VerifiedUserTwoTone from '@material-ui/icons/VerifiedUserTwoTone';
import router from 'next/router';
import { getAuthUser, updateUser } from '../lib/api';
import { authInitialProps } from '../lib/auth';

class EditProfile extends React.Component {
  state = {
    _id: '',
    name: '',
    avatar: '',
    email: '',
    about: '',
    avatarPreview: '',
    updatedUser: '',
    isLoading: true,
    openSuccess: false,
    openError: false,
    isSaving: false,
    error: '',
  };

  componentDidMount() {
    const { auth } = this.props;

    this.userData = new FormData();
    getAuthUser(auth.user._id)
      .then((user) => {
        this.setState({ ...user, isLoading: false });
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        console.log(err);
      });
  }

  handleChange = (e) => {
    let inputValue;

    if (e.target.name === 'avatar') {
      inputValue = e.target.files[0];
      this.setState({ avatarPreview: this.createPreviewImage(inputValue) });
    } else {
      inputValue = e.target.value;
    }
    this.userData.set(e.target.name, inputValue),
      this.setState({ [e.target.name]: inputValue });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ isSaving: true });
    updateUser(this.state._id, this.userData)
      .then((updatedUser) => {
        this.setState({ updatedUser, openSuccess: true }, () => {
          setTimeout(() => {
            router.push(`/profile/${this.state._id}`);
          }, 6000);
        });
      })
      .catch(this.showError);
  };

  createPreviewImage = (file) => URL.createObjectURL(file);

  handleClose = () => this.setState({ openError: false });

  showError = (err) => {
    const error = (err.response && err.response.data) || err.message;
    this.setState({ error, openError: true, isSaving: false });
  };

  render() {
    const { classes } = this.props;

    const {
      isLoading,
      avatar,
      email,
      name,
      about,
      avatarPreview,
      isSaving,
      updatedUser,
      openError,
      openSuccess,
      error,
    } = this.state;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <EditSharp />
          </Avatar>
          <Typography variant='h5' component='h1'>
            Edit Profile
          </Typography>

          {/* Edit Profile Form */}
          <form className={classes.form} onSubmit={this.handleSubmit}>
            {isLoading ? (
              <Avatar className={classes.bigAvatar}>
                <FaceTwoTone />
              </Avatar>
            ) : (
              <Avatar
                src={avatarPreview || avatar}
                className={classes.bigAvatar}
              />
            )}
            <input
              type='file'
              name='avatar'
              id='avatar'
              accept='image/*'
              onChange={this.handleChange}
              className={classes.input}
            />
            <label htmlFor='avatar' className={classes.uploadButton}>
              <Button variant='contained' color='secondary' component='span'>
                Upload Image <CloudUpload />
              </Button>
            </label>
            <span className={classes.filename}>{avatar && avatar.name}</span>
            <FormControl margin='normal' required>
              <InputLabel htmlFor='name'>Name</InputLabel>
              <Input
                type='text'
                name='name'
                value={name}
                onChange={this.handleChange}
              />
            </FormControl>
            <FormControl margin='normal'>
              <InputLabel htmlFor='about'>About</InputLabel>
              <Input
                type='text'
                name='about'
                value={about}
                onChange={this.handleChange}
              />
            </FormControl>
            <FormControl margin='normal' required fullWidth>
              <InputLabel htmlFor='email'>Email</InputLabel>
              <Input
                type='email'
                name='email'
                value={email}
                onChange={this.handleChange}
              />
            </FormControl>
            <Button
              type='submit'
              fullWidth
              disabled={isSaving || isLoading}
              variant='contained'
              color='primary'
              className={classes.submit}>
              {isSaving ? 'saving' : 'save'}
            </Button>
          </form>
        </Paper>

        {/* Error Snackbar */}
        {error && (
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            open={openError}
            onClose={this.handleClose}
            autoHideDuration={6000}
            message={<span className={classes.snack}>{error}</span>}
          />
        )}

        {/* Success Dialog */}
        <Dialog open={openSuccess} disableBackdropClick={true}>
          <DialogTitle>
            <VerifiedUserTwoTone className={classes.icon} />
            Profile Updated
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              User {updatedUser && updatedUser.name} was successfully updated!
            </DialogContentText>
          </DialogContent>
        </Dialog>
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
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 'auto',
  },
  uploadButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0.25em',
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
  input: {
    display: 'none',
  },
});

EditProfile.getInitialProps = authInitialProps(true);

export default withStyles(styles)(EditProfile);
