import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import AddAPhoto from '@material-ui/icons/AddAPhoto';

const NewPost = ({
  classes,
  auth,
  text,
  image,
  handleChange,
  handleAddPost,
  isAdding,
}) => (
  <Card className={classes.card}>
    <CardHeader
      avatar={<Avatar src={auth.user.avatar} />}
      title={
        <Typography variant='h6' component='h2'>
          {auth.user.name}
        </Typography>
      }
      className={classes.cardHeader}
    />
    <CardContent className={classes.cardContent}>
      <TextField
        label='Add a status'
        value={text}
        name='text'
        multiline
        row='2'
        placeholder={`What's on your mind, ${auth.user.name}?`}
        fullWidth
        margin='normal'
        onChange={handleChange}
        variant='outlined'
        InputLabelProps={{
          shrink: true,
        }}
      />
      <input
        accept='image/*'
        name='image'
        id='image'
        onChange={handleChange}
        className={classes.input}
        type='file'
      />
      <label htmlFor='image'>
        <IconButton color='secondary' component='span'>
          <AddAPhoto />
        </IconButton>
      </label>
      <span>{image && image.name}</span>
    </CardContent>
    <CardActions className={classes.cardActions}>
      <Button
        color='primary'
        variant='contained'
        disabled={!text}
        className={classes.submit}
        onClick={handleAddPost}>
        {isAdding ? 'Sending' : 'Post'}
      </Button>
    </CardActions>
  </Card>
);

const styles = (theme) => ({
  card: {
    marginBottom: theme.spacing(3),
    backgroundColor: theme.palette.primary.light,
  },
  cardContent: {
    backgroundColor: 'white',
  },
  input: {
    display: 'none',
  },
  cardActions: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },
});

export default withStyles(styles)(NewPost);
