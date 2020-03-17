import { Grid, Link } from '@material-ui/core';
import {
  Card,
  CardActionArea,
  CardContent,
  makeStyles,
  Paper,
  Typography
} from '@material-ui/core';
import * as React from 'react';
import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles({
  root: {
    width: 300,
    height: 320
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
      <Link component={RouterLink} to={`/add`}>
        <Card className={classes.root}>
          <ImagePlaceholder colors={color} />
          <div className={classes.cardContent}>
            <AddIcon className={classes.cardContent} />
          </div>
        </Card>
      </Link>
    </Grid>
  );
};