import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Comment from '@material-ui/icons/Comment';
import DeleteTwoTone from '@material-ui/icons/DeleteTwoTone';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Link from 'next/link';
import Comments from './Comments';

class Post extends React.PureComponent {
  state = {
    isLiked: false,
    numLikes: 0,
    comments: [],
  };

  componentDidMount() {
    this.setState({
      isLiked: this.checkLike(this.props.post.likes),
      numLikes: this.props.post.likes.length,
      comments: this.props.post.comments,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.post.likes.length !== this.props.post.likes.length) {
      this.setState({
        isLiked: this.checkLike(this.props.post.likes),
        numLikes: this.props.post.likes.length,
      });
    }

    if (prevProps.post.comments.length !== this.props.post.comments.length) {
      this.setState({
        comments: this.props.post.comments,
      });
    }
  }

  checkLike = (likes) => likes.includes(this.props.auth.user._id);

  render() {
    const {
      classes,
      post,
      auth,
      isDeleting,
      handleDeletePost,
      handleToggleLike,
      handleAddComment,
      handleDeleteComment,
    } = this.props;

    const { isLiked, numLikes, comments } = this.state;

    const isPostCreator = auth.user._id === post.postedBy._id;

    return (
      <Card className={classes.root}>
        {/* post header */}
        <CardHeader
          avatar={<Avatar src={post.postedBy.avatar} />}
          action={
            isPostCreator && (
              <IconButton
                disabled={isDeleting}
                onClick={() => handleDeletePost(post)}>
                <DeleteTwoTone color='secondary' />
              </IconButton>
            )
          }
          title={
            <Link href={`/profile/${post.postedBy._id}`}>
              <a>{post.postedBy.name}</a>
            </Link>
          }
          subheader={post.createdAt}
          className={classes.cardHeader}
        />
        <CardContent className={classes.cardContent}>
          <Typography variant='body1' className={classes.text}>
            {post.text}
          </Typography>
          {/* Post Image */}
          {post.image && (
            <div className={classes.imageContainer}>
              <img className={classes.image} src={post.image} />
            </div>
          )}
        </CardContent>

        {/* Post Actions */}
        <CardActions>
          <IconButton
            onClick={() => handleToggleLike(post)}
            className={classes.button}>
            <Badge badgeContent={numLikes}>
              {isLiked ? (
                <Favorite className={classes.favoriteIcon} color='secondary' />
              ) : (
                <FavoriteBorder
                  className={classes.favoriteIcon}
                  color='secondary'
                />
              )}
            </Badge>
          </IconButton>
          <IconButton className={classes.button}>
            <Badge badgeContent={comments.length}>
              <Comment className={classes.commentIcon} color='primary' />
            </Badge>
          </IconButton>
        </CardActions>
        <Divider />

        {/* Comments Area */}
        <Comments
          auth={auth}
          postId={post._id}
          comments={comments}
          handleAddComment={handleAddComment}
          handleDeleteComment={handleDeleteComment}
        />
      </Card>
    );
  }
}

const styles = (theme) => ({
  card: {
    marginBottom: theme.spacing(1),
  },
  cardContent: {
    backgroundColor: 'white',
  },
  cardHeader: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    backgroundColor: 'rgba(11, 61, 130, 0.06)',
  },
  imageContainer: {
    textAlign: 'center',
    padding: theme.spacing(1),
  },
  image: {
    height: 200,
  },
  favoriteIcon: {
    color: theme.palette.favoriteIcon,
  },
  commentIcon: {
    color: theme.palette.commentIcon,
  },
});

export default withStyles(styles)(Post);
