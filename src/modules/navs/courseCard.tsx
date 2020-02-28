import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  makeStyles,
  Typography
} from '@material-ui/core';
import * as React from 'react';

const useStyles = makeStyles({
  root: {
    maxWidth: 345
  },
  media: {
    height: 140
  }
});

export const CourseCard = (course: any) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia className={classes.media}></CardMedia>
        <CardContent>
          <Typography>{course.course.name}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
