import { CourseCard } from './courseCard';
import { CourseList } from './courseList';
import { Button } from '@material-ui/core';
import * as React from 'react';

export const Navigation = () => {
    return (
      <div>
        <Button href="#/courses">
          Courses
        </Button>
        <Button href="#/setup">
          Settings
        </Button>
      </div>
    )
  }

export { CourseList };
