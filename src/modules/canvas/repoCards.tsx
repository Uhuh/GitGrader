import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText, 
  DialogTitle, 
  makeStyles, 
  Paper,
  Tooltip, 
  Typography
} from '@material-ui/core';
import * as React from 'react';
import styled from 'styled-components';
import { GitLabAPI } from '..';
import { IBaseRepo, ICanvasNamespace, ICanvasUser, IGitUser } from '../../api/interfaces';

const useStyles = makeStyles({
  actionButton: {
    color: 'white',
    margin: '7px'
  }
});

const colors = [
  { l: '#D38312', r: '#A83279' },
  { l: '#70E1F5', r: '#FFD194' },
  { l: '#9D50BB', r: '#6E48AA' },
  { l: '#B3FFAB', r: '#12FFF7' },
  { l: '#AAFFA9', r: '#11FFBD' },
  { l: '#FBD3E9', r: '#BB377D' },
  { l: '#C9FFBF', r: '#C9FFBF' },
  { l: '#B993D6', r: '#8CA6DB' },
  { l: '#00d2ff', r: '#3a7bd5' },
  { l: '#33ccff', r: '#ff99cc' },
  { l: '#ff758c', r: '#ff7eb3' }
];

interface IProps {
  colors: {
    l: string;
    r: string;
  };
}

const ImagePlaceholder = styled.div<IProps>`
  background-image: linear-gradient(-70deg, ${p => p.colors.l}, ${p => p.colors.r});
  width: 100%;
  height: 140px;
`;

export const RepoCard = (props: {baseRepo: IBaseRepo, users: IGitUser[], course: ICanvasNamespace }) => {
  const classes = useStyles();
  const { baseRepo, users, course } = props;
  const color = colors[Number(props.baseRepo.id) % 11];
  const [open, setOpen] = React.useState(false);
  const [deleteCheck, setDeleteCheck] = React.useState(false);
  const year = new Date().getFullYear();

  const assign = async () => {
    for (const user of users) {
      await GitLabAPI.createAssignment(baseRepo, course.section, `${year}-SP`, user.username)
        .then(repo => {
          GitLabAPI.assignAssignment(repo.id, user.id)
            .then(() => {
              console.log(`Created repo ${repo.name} for ${user.username}`);
            })
            .catch(console.error);
        })
        .catch(console.error);
    }
    setDeleteCheck(false);
    setOpen(false);
  };
  const unlock = () => {
    for (const user of users) {
      GitLabAPI.unlockAssignment(baseRepo.id, user.id)
        .then(() => console.log(`Unlocked ${baseRepo.name}`))
        .catch(console.error);
    }
    setDeleteCheck(false);
    setOpen(false);
  };
  const lock = () => {
    for (const user of users) {
      GitLabAPI.lockAssignment(baseRepo.id, user.id)
        .then(() => console.log(`Locked ${baseRepo.name}`))
        .catch(console.error);
    }
    setDeleteCheck(false);
    setOpen(false);
  };
  const archive = () => {
    GitLabAPI.archiveAssignment(baseRepo.id)
      .then(() => console.log(`Archived ${baseRepo.name}`))
      .catch(console.error);
    setDeleteCheck(false);
    setOpen(false);
  };
  const remove = () => {
    GitLabAPI.removeAssignment(baseRepo.id)
      .then(() => console.log(`Removed ${baseRepo.name}`))
      .catch(console.error);
    setDeleteCheck(false);
    setOpen(false);
  };

  const handleClose = () => {
    setDeleteCheck(false);
    setOpen(false);
  };

  const handleOpen = () => {
    setDeleteCheck(false);
    setOpen(true);
  };

  return (
    <Paper elevation={3}>
      <Card onClick={handleOpen}>
        <CardActionArea>
          <ImagePlaceholder colors={color} />
          <CardContent>
            <Typography variant='h6'>{props.baseRepo.name}</Typography>
            <Typography color='textSecondary'>
              Created: {baseRepo.created_at}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>{baseRepo.name} actions</DialogTitle>
        <DialogContent>
          <Tooltip title='Give students access to this assignment' placement='top'>
            <Button className={classes.actionButton} onClick={assign} variant='outlined' color='primary'>
              <Typography color='textSecondary'>Assign</Typography>
            </Button>
          </Tooltip>
          <Tooltip title='Unlock all student repo to' placement='top'>
          <Button className={classes.actionButton} onClick={unlock} variant='outlined' color='primary'>
            <Typography color='textSecondary'>Unlock</Typography>
          </Button>
          </Tooltip>
          <Tooltip title='Lock all student repo' placement='top'>
          <Button className={classes.actionButton} onClick={lock} variant='outlined' color='primary'>
            <Typography color='textSecondary'>Lock</Typography>
          </Button>
          </Tooltip>
          <Tooltip title='Archive base repo' placement='top'>
          <Button className={classes.actionButton} onClick={archive} variant='outlined' color='primary'>
            <Typography color='textSecondary'>Archive</Typography>
          </Button>
          </Tooltip>
          <Tooltip title='Delete the base repo' placement='top'>
          <Button className={classes.actionButton} onClick={()=> setDeleteCheck(true)} variant='outlined' color='primary'>
            <Typography color='textSecondary'>Delete</Typography>
            <Dialog
              open={deleteCheck}
            >
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to delete this repo?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color='primary'>
                  Cancel
                </Button>
                <Button onClick={remove} color='primary'>
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </Button>
          </Tooltip>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleClose}
            variant='outlined' 
            color='secondary'
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
