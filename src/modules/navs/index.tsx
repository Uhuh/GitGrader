import * as React from 'react';
import { Typography, Box } from '@material-ui/core';

export const TabPanel = (props: any) => {
  const { children, value, index, ...other } = props;

  return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  )
}