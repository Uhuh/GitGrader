import {
  Card,
  Grid,
  CardActionArea,
  CardContent,
  makeStyles,
  Paper,
  Typography
} from '@material-ui/core';
import * as React from 'react';
import styled from 'styled-components';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles({
  root: {
    width: 280,
    height: 310
  },
  media: {
    height: 140
  },
  addIcon: {
    height: 100,
    width: 100,
  },
  cardContent: {
    display: 'block',
    margin: 'auto',
    height: '75%',
    width: '75%',
  }
});

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

export const AddCard = () => {
  const classes = useStyles();
  const color = { l: '#667eea', r: '#764ba2' };

  return (
    <Grid item>
        <Card className={classes.root}>
          <ImagePlaceholder colors={color} />
          <div className={classes.cardContent}>
            <AddIcon className={classes.cardContent} />
          </div>
        </Card>
    </Grid>
  );
};