import * as React from 'react';
import { CanvasBackend as Canvas, GitlabBackend as GL } from '../../api';

var data: string[];
data = [];

const CanvasAPI = new Canvas({
    canvas_url: 'https://mst.instructure.com',
    canvas_token: '2006~rBsdDmvmuKgD629IaBL9zKZ3Xe1ggXHhcFWJH4eEiAgE62LUWemgbVrabrx116Rq'
  });

CanvasAPI.getClasses().then(function(result) {

    for(let i=0; i<result.length; i++){
        data.push(result[i].name);
    }
    
});


export const CanvasPage = () => {

    return (
        <ol>
           {data.map(data => 
            <li key={data.toString()}>   
                {data} 
            </li>)} 
       </ol>
      );
};