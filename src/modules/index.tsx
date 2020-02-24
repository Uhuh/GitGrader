import * as React from 'react';
import { Tab, Tabs } from '@material-ui/core';
import { TabPanel } from './navs'

export const App = () => {
  const [val, setVal] = React.useState(0);

  const handleChange = (event: any, newVal: any) => {
    setVal(newVal);
  };

  return (
    <>
      <Tabs
        value={val}
        onChange={handleChange}
      >
        <Tab label="GitGrader" />
        <Tab label="Canvas" />
        <Tab label="Gitlab" />
      </Tabs>
      <TabPanel value={val} index={0}><p>The GitGrader tab</p></TabPanel>
      <TabPanel value={val} index={1}><p>The Canvas tab</p></TabPanel>
      <TabPanel value={val} index={2}><p>The Gitlab tab</p></TabPanel>
    </>
  );
};
