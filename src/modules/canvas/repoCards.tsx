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
  Typography
} from '@material-ui/core';
import * as React from 'react';
import styled from 'styled-components';
import { GitLabAPI } from '..';
import { IBaseRepo, ICanvasNamespace, ICanvasUser, IGitUser } from '../../api/interfaces';

const useStyles = makeStyles({
  root: {
    width: 345,
    height: 280
  },
  media: {
    height: 140
  },
  actionButton: {
    color: 'white'
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

export const RepoCard = (props: {baseRepo: IBaseRepo, students: ICanvasUser[], course: ICanvasNamespace }) => {
  const classes = useStyles();
  const { baseRepo, students, course } = props;
  const color = colors[Number(props.baseRepo.id) % 11];
  const [open, setOpen] = React.useState(false);
  const [users, setUsers] = React.useState<IGitUser[]>([]);
  const year = new Date().getFullYear();

  React.useEffect(() => {
    // Need to get all the student's gitlab ids to set up assignments.
    GitLabAPI.getUser(students)
    .then(u => {
      setUsers(
        Array.isArray(u) ? u : [u]
      );
    })
    // Need to log users that don't have gitlab accounts or tell the user a list somehow.
    .catch(console.error);
  }, []);

  const assign = () => {
    for (const user of users) {
      GitLabAPI.createAssignment(baseRepo, course.section, `${year}-SP`, user.username)
        .then(repo => {
          GitLabAPI.assignAssignment(repo.id, user.id)
            .then(() => {
              console.log(`Created repo ${repo.name} for ${user.username}`);
            })
            .catch(console.error);
        })
        .catch(console.error);
    }

    setOpen(false);
  };
  const unlock = () => {
    for (const user of users) {
      GitLabAPI.unlockAssignment(baseRepo.id, user.id)
        .then(() => console.log(`Unlocked ${baseRepo.name}`))
        .catch(console.error);
    }
    setOpen(false);
  };
  const lock = () => {
    for (const user of users) {
      GitLabAPI.lockAssignment(baseRepo.id, user.id)
        .then(() => console.log(`Locked ${baseRepo.name}`))
        .catch(console.error);
    }
    setOpen(false);
  };
  const archive = () => {
    GitLabAPI.archiveAssignment(baseRepo.id)
      .then(() => console.log(`Archived ${baseRepo.name}`))
      .catch(console.error);
    setOpen(false);
  };

  return (
    <Paper elevation={3}>
      <Card className={classes.root} onClick={() => setOpen(true)}>
        <CardActionArea>
          <ImagePlaceholder colors={color} />
          <CardContent>
            <Typography variant='h6'>{props.baseRepo.name}</Typography>
            <Typography color='textSecondary'>
              {props.baseRepo.id}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>Menu</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select an action to act on {baseRepo.name}
          </DialogContentText>
          <Button className={classes.actionButton} onClick={assign} color='primary'>
            Assign
          </Button>
          <Button className={classes.actionButton} onClick={unlock} color='primary'>
            Unlock
          </Button>
          <Button className={classes.actionButton} onClick={lock} color='primary'>
            Lock
          </Button>
          <Button className={classes.actionButton} onClick={archive} color='primary'>
            Archive
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color='primary'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
