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
import { IBaseRepo, ICanvasUser } from '../../api/interfaces';

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

export const RepoCard = (props: {baseRepo: IBaseRepo}) => {
  const classes = useStyles();
  const color = colors[Number(props.baseRepo.id) % 11];
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const assign = () => {
    console.log('assign');
    handleClose();
  };
  const unlock = () => {
    console.log('unlock');
    handleClose();
  };
  const lock = () => {
    console.log('lock');
    handleClose();
  };
  const archive = () => {
    console.log('archive');
    handleClose();
  };

  return (
    <Paper elevation={3}>
      <Card className={classes.root} onClick={handleClickOpen}>
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
      <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
            <DialogTitle id='form-dialog-title'>Menu</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Select an action to act on {props.baseRepo.name}
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
              <Button onClick={handleClose} color='primary'>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
    </Paper>
  );
};
