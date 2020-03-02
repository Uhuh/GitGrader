import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  makeStyles,
  Paper,
  Typography
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import * as React from 'react';
import styled from 'styled-components';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    maxHeight: 380
  },
  media: {
    height: 140
  }
});

const ImagePlaceholder = styled.div`
    background-image: linear-gradient(-70deg, #9999ff, #66ffcc );
    width: 100%;
    height: 140px;
`;

export const CourseCard = (course: any) => {
  const classes = useStyles();

  return (
    <Paper elevation={3}>
        <Card className={classes.root}>
            <CardActionArea>
                <ImagePlaceholder/>
                <CardContent>
                <Typography variant='h6'>{course.course.name}</Typography>
                <Typography color='textSecondary'>{course.course.teacher}</Typography>
                <PersonIcon></PersonIcon>{course.course.students}
                </CardContent>
            </CardActionArea>
        </Card>
    </Paper>
  );
};
