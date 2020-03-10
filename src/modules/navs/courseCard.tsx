import {
  Card,
  CardActionArea,
  CardContent,
  makeStyles,
  Paper,
  Typography
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import * as React from 'react';
import styled from 'styled-components';
import { ICanvasClass } from '../../api/interfaces';

const useStyles = makeStyles({
  root: {
    maxWidth: 300,
    maxHeight: 320
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

export const CourseCard = (props: {course: ICanvasClass}) => {
  const classes = useStyles();
  const color = colors[Number(props.course.id) % 11];

  return (
    <Paper elevation={3}>
      <Card className={classes.root}>
        <CardActionArea>
          <ImagePlaceholder />
          <CardContent>
            <Typography variant='h6'>{props.course.name}</Typography>
            <Typography color='textSecondary'>
              {props.course.teachers[0].display_name}
            </Typography>
            <PersonIcon></PersonIcon>
            {props.course.total_students}
          </CardContent>
        </CardActionArea>
      </Card>
    </Paper>
  );
};
