import { Box } from '@material-ui/core';
import * as React from 'react';
import { CanvasBackend as Canvas, GitlabBackend as GL } from '../../api';
import { ICanvasUser } from '../../api/interfaces';

const CanvasAPI = new Canvas({
  canvas_url: 'https://mst.instructure.com',
  canvas_token: '2006~rBsdDmvmuKgD629IaBL9zKZ3Xe1ggXHhcFWJH4eEiAgE62LUWemgbVrabrx116Rq'
});

/**
 * We should be able to pass the course as well.
 * @todo this takes quite some time to load. Need to find a way to make it vrooom
 * @param props courseId - Canvas course id
 */
export const CanvasPage = (props: { courseId: string }) => {
	const { courseId } = props;
	const [students, setStudents] = React.useState<ICanvasUser[]>();

	React.useEffect(() => {
		CanvasAPI.getStudents(courseId)
			.then(s => {
				setStudents(s);
			})
			.catch(console.error);
	}, [courseId]);

	return (
		<Box>
			{students && students.map(s => {
				return (
					<div>
						<p>{s.sis_user_id}</p>
					</div>
				);
			})}
		</Box>
	);
};