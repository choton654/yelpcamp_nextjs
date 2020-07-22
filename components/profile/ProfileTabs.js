import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import Post from '../index/Post';
import FollowTab from './FollowTab';
class ProfileTabs extends React.Component {
  state = {
    tab: 0,
  };

  handleTabChange = (e, value) => {
    this.setState({ tab: value });
  };

  render() {
    const {
      auth,
      user,
      posts,
      isDeleting,
      handleDeletePost,
      handleToggleLike,
      handleAddComment,
      handleDeleteComment,
    } = this.props;
    const { tab } = this.state;
    return (
      <div>
        {' '}
        <AppBar position='static' color='default'>
          <Tabs
            value={tab}
            onChange={this.handleTabChange}
            indicatorColor='secondary'
            textColor='secondary'
            fullWidth>
            <Tab label='Posts' />
            <Tab label='Following' />
            <Tab label='Followers' />
          </Tabs>
        </AppBar>
        {tab === 0 && (
          <TabContainer>
            {posts.map((post) => (
              <Post
                key={post._id}
                auth={auth}
                post={post}
                handleDeletePost={handleDeletePost}
                handleToggleLike={handleToggleLike}
                handleAddComment={handleAddComment}
                handleDeleteComment={handleDeleteComment}
                isDeleting={isDeleting}
              />
            ))}
          </TabContainer>
        )}
        {tab === 1 && (
          <TabContainer>
            <FollowTab users={user.following} />
          </TabContainer>
        )}
        {tab === 2 && (
          <TabContainer>
            <FollowTab users={user.followers} />
          </TabContainer>
        )}
      </div>
    );
  }
}

const TabContainer = ({ children }) => (
  <Typography component='div' style={{ padding: '1em' }}>
    {children}
  </Typography>
);

export default ProfileTabs;
