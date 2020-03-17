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
import { IBaseRepo } from '../../api/interfaces';

const useStyles = makeStyles({
  root: {
    width: 345,
    height: 280
  },
  media: {
    height: 140
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

  return (
    <Paper elevation={3}>
      <Card className={classes.root}>
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
    </Paper>
  );
};
