import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText, 
  DialogTitle, 
  makeStyles, 
  Paper, 
  Typography
} from '@material-ui/core';
import * as React from 'react';
import styled from 'styled-components';
import { GitLabAPI } from '..';
import { IBaseRepo, ICanvasNamespace, ICanvasUser, IGitUser } from '../../api/interfaces';

const SpacePadding = styled.div`
  margin-bottom: 20px;
`;

const useStyles = makeStyles({
  actionButton: {
    color: 'white'
  }
});

const colors = [
  { l: '#D38312', r: '#A83279' },
  { l: '#70E1F5', r: '#FFD194' },
  { l: '#9D50BB', r: '#6E48AA' },
  { l: '#B3FFAB', r: '#12FFF7' },
  { l: '#AAFFA9', r: '#11FFBD' },
  { l: '#FBD3E9', r: '#BB377D' },
  { l: '#C9FFBF', r: '#C9FFBF' },
  { l: '#B993D6', r: '#8CA6DB' },
  { l: '#00d2ff', r: '#3a7bd5' },
  { l: '#33ccff', r: '#ff99cc' },
  { l: '#ff758c', r: '#ff7eb3' }
];

interface IProps {
  colors: {
    l: string;
    r: string;
  };
}

const ImagePlaceholder = styled.div<IProps>`
  background-image: linear-gradient(-70deg, ${p => p.colors.l}, ${p => p.colors.r});
  width: 100%;
  height: 140px;
`;

export const RepoCard = (props: {baseRepo: IBaseRepo, users: IGitUser[], course: ICanvasNamespace }) => {
  const classes = useStyles();
  const { baseRepo, users, course } = props;
  const color = colors[Number(props.baseRepo.id) % 11];
  const [open, setOpen] = React.useState(false);
  const year = new Date().getFullYear();

  const assign = async () => {
    for (const user of users) {
      await GitLabAPI.createAssignment(baseRepo, course.section, `${year}-SP`, user.username)
        .then(repo => {
          GitLabAPI.assignAssignment(repo.id, user.id)
            .then(() => {
              console.log(`Created repo ${repo.name} for ${user.username}`);
            })
            .catch(console.error);
        })
        .catch(console.error);
    }
    setOpen(false);
  };
  const unlock = () => {
    for (const user of users) {
      GitLabAPI.unlockAssignment(baseRepo.id, user.id)
        .then(() => console.log(`Unlocked ${baseRepo.name}`))
        .catch(console.error);
    }
    setOpen(false);
  };
  const lock = () => {
    for (const user of users) {
      GitLabAPI.lockAssignment(baseRepo.id, user.id)
        .then(() => console.log(`Locked ${baseRepo.name}`))
        .catch(console.error);
    }
    setOpen(false);
  };
  const archive = () => {
    GitLabAPI.archiveAssignment(baseRepo.id)
      .then(() => console.log(`Archived ${baseRepo.name}`))
      .catch(console.error);
    setOpen(false);
  };
  const upload = (file_name: string, file_content: string) => {
    GitLabAPI.uploadFile(baseRepo.id, file_name, file_content)
      .then(() => console.log(`Uploaded file`))
      .catch(console.error);
    setOpen(false);
  };

  const convertBase64 = () => {
    const reader = new FileReader();
    const file = document.getElementById('file-upload') as HTMLInputElement;
    const file_content = file.files;
    
    let file_name = file.value as string;
    //let content = 'Upload error.';
    let base64content = 'VXBsb2FkIGVycm9y';
    
    reader.onloadend = () => {
      file_name = file_name.replace('C:\\fakepath\\', '');
      //content = reader.result as string;
      //console.log(file_name);
      //console.log(content);
      //upload(file_name, content);
      base64content = reader.result as string;
      base64content = base64content.split(',')[1];
      console.log(base64content);
      upload(file_name, base64content);
    };

    if(file_content) {
      //reader.readAsText(file_content[0]);
      reader.readAsDataURL(file_content[0]);
    }
  };

  return (
    <Paper elevation={3}>
      <Card onClick={() => setOpen(true)}>
        <CardActionArea>
          <ImagePlaceholder colors={color} />
          <CardContent>
            <Typography variant='h6'>{props.baseRepo.name}</Typography>
            <Typography color='textSecondary'>
              Created: {baseRepo.created_at}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>{baseRepo.name} actions</DialogTitle>
        <DialogContent>
          <Button className={classes.actionButton} onClick={assign} variant='outlined' color='primary'>
            <Typography color='textSecondary'>Assign</Typography>
          </Button>
          <Button className={classes.actionButton} onClick={unlock} variant='outlined' color='primary'>
            <Typography color='textSecondary'>Unlock</Typography>
          </Button>
          <Button className={classes.actionButton} onClick={lock} variant='outlined' color='primary'>
            <Typography color='textSecondary'>Lock</Typography>
          </Button>
          <Button className={classes.actionButton} onClick={archive} variant='outlined' color='primary'> 
            <Typography color='textSecondary'>Archive</Typography>
          </Button>

          <SpacePadding></SpacePadding>
          <form>
            <input type='file' id='file-upload'/>
          </form>
          <Button className={classes.actionButton} onClick={convertBase64} variant='outlined' color='primary'> 
            Upload
          </Button>

        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpen(false)}
            variant='outlined' 
            color='secondary'
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
