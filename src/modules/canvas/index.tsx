import * as React from 'react';
import { CanvasBackend as Canvas, GitlabBackend as GL } from '../../api';
import { FormControlStatic } from 'react-bootstrap';


var data = [''];

const CanvasAPI = new Canvas({
    canvas_url: 'https://mst.instructure.com',
    canvas_token: ''
  });

CanvasAPI.getClasses().then(function(result) {
    data.pop()
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