import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import React, { Component } from 'react';
import { deleteUser } from '../../lib/api';
import { signOutUser } from '../../lib/auth';

export class DeleteUser extends Component {
  state = {
    open: false,
    isDeleting: false,
  };

  handelDeleteUser = () => {
    const { user } = this.props;

    this.setState({ isDeleting: true });
    deleteUser(user._id)
      .then(() => {
        signOutUser();
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isDeleting: false });
      });
  };

  handelOpen = () => this.setState({ open: true });

  handelClose = () => this.setState({ open: false });

  render() {
    const { open, isDeleting } = this.state;

    return (
      <div>
        <IconButton onClick={this.handelOpen} color='secondary'>
          <Delete />
        </IconButton>

        <Dialog open={open} onClose={this.handelClose}>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Confirm to delete your account
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handelClose} color='primary'>
              Cancel
            </Button>
            <Button
              onClick={this.handelDeleteUser}
              color='secondary'
              disabled={isDeleting}>
              {isDeleting ? 'Deleting' : 'Confirm'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default DeleteUser;
