import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Snackbar from '@material-ui/core/Snackbar';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import AccountBox from '@material-ui/icons/AccountBox';
import Link from 'next/link';
import Router from 'next/router';
import { followUser, getUserFeed } from '../../lib/api';

class UserFeed extends React.Component {
  state = {
    users: [],
    openSuccess: false,
    followingMessage: '',
  };

  componentDidMount() {
    const { auth } = this.props;

    getUserFeed(auth.user._id).then((users) => {
      this.setState({ users });
    });
  }

  handleFollow = (user, userIndex) => {
    followUser(user._id).then((user) => {
      // const updatedUsers = [
      //   ...this.state.users.slice(0, userIndex),
      //   ...this.state.users.slice(userIndex + 1),
      // ];
      this.setState({
        ...this.state,
        // users: updatedUsers,
        users: this.state.users.filter((u) => u._id !== user._id),
        openSuccess: true,
        followingMessage: `Following ${user.name}`,
      });
      setTimeout(() => {
        Router.reload();
      }, 3000);
    });
  };

  handleClose = () => this.setState({ openSuccess: false });

  render() {
    const { classes } = this.props;
    const { users, openSuccess, followingMessage } = this.state;
    return (
      <div>
        <Typography type='title' variant='h6' component='h2' align='center'>
          Browse Users
        </Typography>
        <Divider />

        {/* users list */}
        <List>
          {users.map((user, i) => (
            <span key={user._id}>
              <ListItem>
                <ListItemAvatar className={classes.avatar}>
                  <Avatar src={user.avatar} />
                </ListItemAvatar>
                <ListItemText primary={user.name} />
                <ListItemSecondaryAction className={classes.follow}>
                  <Link href={`/profile/${user._id}`}>
                    <IconButton
                      variant='contained'
                      color='secondary'
                      className={classes.viewButton}>
                      <AccountBox />
                    </IconButton>
                  </Link>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => this.handleFollow(user, i)}>
                    Follow
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            </span>
          ))}
        </List>

        {/* Follow User Snackbar */}
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={openSuccess}
          onClose={this.handleClose}
          autoHideDuration={6000}
          message={<span className={classes.snack}>{followingMessage}</span>}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  root: {
    padding: theme.spacing(1),
  },
  avatar: {
    marginRight: theme.spacing(1),
  },
  follow: {
    right: theme.spacing(2),
  },
  snack: {
    color: theme.palette.primary.light,
  },
  viewButton: {
    verticalAlign: 'middle',
  },
});

export default withStyles(styles)(UserFeed);
