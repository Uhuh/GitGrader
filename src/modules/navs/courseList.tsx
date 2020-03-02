import { Grid } from '@material-ui/core';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { CourseCard } from './courseCard';

export const CourseList = (courses: any) => {
    console.log(courses);
    return(
        <Grid 
            container
            justify='center'
            alignItems='center'
            spacing={3}
            style={{ minHeight: '100vh'}}
        >
            {courses.courses.map((course:any) => (
                <Grid item xs={3} key={course.name}>
                    <Link to={`/${course.name}`}>
                        <CourseCard course={course} />
                    </Link>
                </Grid>
            ))}
        </Grid>
    )
}