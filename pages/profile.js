import {
  Avatar,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography,
} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import Edit from '@material-ui/icons/Edit';
import Link from 'next/link';
import DeleteUser from '../components/profile/DeleteUser';
import { FollowUser } from '../components/profile/FollowUser';
import ProfileTabs from '../components/profile/ProfileTabs';
import {
  addComment,
  deleteComment,
  deletePost,
  getPostbyUser,
  getUser,
  likePost,
  unLikePost,
} from '../lib/api';
import { authInitialProps } from '../lib/auth';
class Profile extends React.Component {
  state = {
    posts: [],
    user: null,
    isLoading: true,
    isAuth: false,
    isFollowing: false,
    isDeleting: false,
  };

  componentDidMount() {
    const { auth, userId } = this.props;
    console.log(userId);
    getUser(userId)
      .then(async (user) => {
        const isAuth = auth.user._id === userId;
        const isFollowing = this.checkFollow(auth, user);
        const posts = await getPostbyUser(userId);
        this.setState({
          posts,
          user,
          isAuth,
          isFollowing,
          isLoading: false,
        });
      })
      .catch((err) => console.log(err.response));
  }

  checkFollow = (auth, user) => {
    return (
      user.followers.findIndex((follower) => follower._id === auth.user._id) >
      -1
    );
  };

  toggleFollow = (sendRequest) => {
    const { userId } = this.props;
    const { isFollowing } = this.state;
    sendRequest(userId).then(() => {
      this.setState({ isFollowing: !isFollowing });
    });
  };

  handleDeletePost = (deletedPost) => {
    deletePost(deletedPost)
      .then((postData) => {
        this.setState({
          ...this.state,
          isDeleting: false,
          posts: this.state.posts.filter((post) => post._id !== postData._id),
        });
      })
      .catch((err) => {
        this.setState({ isDeleting: false });
        console.log(err);
      });
  };

  handleToggleLike = (post) => {
    const { auth } = this.props;

    const postLiked = post.likes.includes(auth.user._id);
    const sendRequest = postLiked ? likePost : unLikePost;

    sendRequest(post._id)
      .then((postData) => {
        this.setState({
          ...this.state,
          posts: this.state.posts.map((post) =>
            post._id === postData._id ? postData : post
          ),
        });
      })
      .catch((err) => console.error(err));
  };

  handleAddComment = (postId, text) => {
    const comment = { text };

    addComment(postId, comment)
      .then((postData) => {
        this.setState({
          ...this.state,
          posts: this.state.posts.map((post) =>
            post._id === postData._id ? postData : post
          ),
        });
      })
      .catch((err) => console.error(err));
  };

  handleDeleteComment = (postId, comment) => {
    deleteComment(postId, comment)
      .then((postData) => {
        this.setState({
          ...this.state,
          posts: this.state.posts.map((post) =>
            post._id === postData._id ? postData : post
          ),
        });
      })
      .catch((err) => console.error(err));
  };

  render() {
    const {
      user,
      isLoading,
      isAuth,
      isFollowing,
      posts,
      isDeleting,
    } = this.state;
    const { classes, auth } = this.props;
    return (
      <Paper className={classes.root} elevation={4}>
        <Typography
          variant='h4'
          component='h1'
          align='center'
          className={classes.title}
          gutterBottom>
          Profile
        </Typography>
        {isLoading ? (
          <div className={classes.progressContainer}>
            <CircularProgress
              className={classes.progress}
              size={55}
              thickness={5}
            />
          </div>
        ) : (
          <List dense>
            <ListItem>
              <ListItemAvatar>
                <Avatar src={user.avatar} className={classes.bigAvatar} />
              </ListItemAvatar>
              <ListItemText primary={user.name} secondary={user.email} />

              {isAuth ? (
                <ListItemSecondaryAction>
                  <Link href='/edit-profile'>
                    <a>
                      <IconButton color='primary'>
                        <Edit />
                      </IconButton>
                    </a>
                  </Link>
                  <DeleteUser user={user} />
                </ListItemSecondaryAction>
              ) : (
                <FollowUser
                  isFollowing={isFollowing}
                  toggleFollowing={this.toggleFollow}
                />
              )}
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary={user.about}
                secondary={`Joined: ${user.createdAt}`}
              />
            </ListItem>

            {/* Display User's Posts, Following, and Followers */}
            <ProfileTabs
              auth={auth}
              posts={posts}
              user={user}
              isDeleting={isDeleting}
              handleDeletePost={this.handleDeletePost}
              handleToggleLike={this.handleToggleLike}
              handleAddComment={this.handleAddComment}
              handleDeleteComment={this.handleDeleteComment}
            />
          </List>
        )}
      </Paper>
    );
  }
}

const styles = (theme) => ({
  root: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(5),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
      width: 600,
    },
  },
  title: {
    color: theme.palette.primary.main,
  },
  progress: {
    margin: theme.spacing(2),
  },
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 10,
  },
});

Profile.getInitialProps = authInitialProps(true);

export default withStyles(styles)(Profile);
