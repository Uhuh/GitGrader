import { Tab, Tabs } from '@material-ui/core';
import * as React from 'react';
import { CanvasBackend as Canvas, GitlabBackend as GL } from '../api';
import { TabPanel } from './navs';

/**
 * Make sure to use your token for testing. Might want to use an .env file for this
 */
const GitLabAPI = new GL({
  gitlab_host: 'https://git-classes.mst.edu',
  gitlab_token: 'MV-G-edsMHNZbi9EvnGF',
  namespace: '2020-senior-test'
});

const CanvasAPI = new Canvas({
  canvas_url: 'https://mst.instructure.com',
  canvas_token: '2006~Zmq2qCmC9QkzviZoSYoYG1FzYbK2T3mg7egBn6nTiRSXYcKSVCXBK7teCQ8BMtqL'
});

/* GitLabAPI.createAssignment(
  'hw4',
  '2453',
  '001',
  '2020-SP',
  'duwtgb'
)
.then(console.log)
.catch(console.error);
 */

GitLabAPI.getUserId('duwtgb')
  .then(console.log)
  .catch(console.error);

GitLabAPI.getUserId('ddddd')
  .then(console.log)
  .catch(console.error);


CanvasAPI.getClasses()
  .then(classes => console.log(classes[1]))
  .catch(console.error);

CanvasAPI.getStudents('42771')
  .then(console.log)
  .catch(console.error);

/* GitLabAPI.lockAssignment('', '')
  .then(console.log)
  .catch(console.error); */

/* canvas.getStudents('')
  .then(console.log)
  .catch(console.error);
 */

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
        <Tab label='GitGrader' />
        <Tab label='Canvas' />
        <Tab label='Gitlab' />
      </Tabs>
      <TabPanel value={val} index={0}><p>The GitGrader tab</p></TabPanel>
      <TabPanel value={val} index={1}><p>The Canvas tab</p></TabPanel>
      <TabPanel value={val} index={2}><p>The Gitlab tab</p></TabPanel>
    </>
  );
};
