import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import {
  addComment,
  addPost,
  deleteComment,
  deletePost,
  getPostFeed,
  likePost,
  unLikePost,
} from '../../lib/api';
import NewPost from './NewPost';
import Post from './Post';

class PostFeed extends React.Component {
  state = {
    posts: [],
    text: '',
    image: '',
    isAdding: false,
    isDeleting: false,
  };

  componentDidMount() {
    const { auth } = this.props;
    this.postData = new FormData();

    getPostFeed(auth.user._id).then((posts) => {
      this.setState({ posts });
    });
  }

  handleChange = (e) => {
    let inputValue;

    if (e.target.name === 'image') {
      inputValue = e.target.files[0];
    } else {
      inputValue = e.target.value;
    }
    this.postData.set(e.target.name, inputValue),
      this.setState({ [e.target.name]: inputValue });
  };

  handleAddPost = () => {
    const { auth } = this.props;

    this.setState({ isAdding: true });
    addPost(auth.user._id, this.postData)
      .then((postData) => {
        const updatedPosts = [postData, ...this.state.posts];
        this.setState({
          isAdding: false,
          posts: updatedPosts,
          text: '',
          image: '',
        });
        this.postData.delete('image');
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isAdding: false });
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
    const { classes, auth } = this.props;

    const { posts, text, image, isAdding, isDeleting } = this.state;

    return (
      <div className={classes.root}>
        <Typography
          variant='h4'
          component='h1'
          align='center'
          color='primary'
          className={classes.title}>
          Post Feed
        </Typography>
        <NewPost
          auth={auth}
          text={text}
          image={image}
          isAdding={isAdding}
          handleChange={this.handleChange}
          handleAddPost={this.handleAddPost}
        />

        {posts.map((post) => (
          <Post
            key={post._id}
            auth={auth}
            post={post}
            handleDeletePost={this.handleDeletePost}
            handleToggleLike={this.handleToggleLike}
            handleAddComment={this.handleAddComment}
            handleDeleteComment={this.handleDeleteComment}
            isDeleting={isDeleting}
          />
        ))}
      </div>
    );
  }
}

const styles = (theme) => ({
  root: {
    paddingBottom: theme.spacing(2),
  },
  title: {
    padding: theme.spacing(2),
  },
});

export default withStyles(styles)(PostFeed);
