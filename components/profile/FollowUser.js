import { Button } from '@material-ui/core';
import { followUser, unfollowUser } from '../../lib/api';

export const FollowUser = ({ isFollowing, toggleFollowing }) => {
  const request = isFollowing ? unfollowUser : followUser;

  return (
    <Button
      variant='contained'
      color={isFollowing ? 'secondary' : 'primary'}
      onClick={() => toggleFollowing(request)}>
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  );
};
