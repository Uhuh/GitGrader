import {
  Button, 
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles, 
  Paper,
  Tooltip, 
  Typography,
  DialogContentText
} from '@material-ui/core';
import * as React from 'react';
import styled from 'styled-components';
import { ICanvasNamespace, IGitUser } from '../../api/interfaces';
import { inject, observer } from 'mobx-react';
import BaseRepo from '../../stores/BaseRepo';
import { GitLabAPI } from '../index';

const SpacePadding = styled.div`
  margin-bottom: 20px;
`;

const Centered = styled.div`
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
`;

const useStyles = makeStyles({
  actionButton: {
    color: 'white',
    margin: '7px'
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

export const RepoCard = 
  inject('BaseRepoStore')
  (observer((props: {
    baseRepo: BaseRepo, 
    users: IGitUser[], 
    course: ICanvasNamespace }
  ) => {

  let filesList = '';
  let uploadFilesList: string[] = [];
  let editFilesList: string[] = [];
  let uploadFiles: string = '';
  let editFiles: string = '';
  
  const classes = useStyles();
  const { baseRepo, users, course } = props;
  const color = colors[Number(baseRepo.id) % 11];
  const [open, setOpen] = React.useState(false);
  const [files, setFiles] = React.useState(false);
  const [uploadConf, setUploadConf] = React.useState(false);
  const [editConf, setEditConf] = React.useState(false);
  const [deleteCheck, setDeleteCheck] = React.useState(false);
  const year = new Date().getFullYear();

  const upload = (actions: Array<{
    action: string, file_path: string, content: string, encoding: string
    }>) => {
    GitLabAPI.uploadFile(baseRepo.id, actions)
      .then(() => console.log(`Uploaded file(s)`))
      .catch(console.error);
    setOpen(false);
  };
  const edit = (actions: Array<{
    action: string, file_path: string, content: string, encoding: string
    }>) => {
    GitLabAPI.editFile(baseRepo.id, actions)
      .then(() => console.log(`Updated file(s)`))
      .catch(console.error);
    setOpen(false);
  };

  const convertBase64Upload = () => {
    const file = document.getElementById('file-upload') as HTMLInputElement;
    const actionsArray: {
      action: string, file_path: string, content: string, encoding: string
      }[] = [];
    
    if(file.files) {
      for(let i = 0; i < file.files.length; i++) {
        if(file.files.item(i)) { 
          const file_item = file.files.item(i) as File;
          actionsArray.push(readerSetup(file_item, 'create'));
        }
      }
    }

    setTimeout(() => {
      console.log(actionsArray);
      upload(actionsArray);
    }, 2000);

    setUploadConf(false);
  };

  const convertBase64Edit = () => {
    const file = document.getElementById('file-edit') as HTMLInputElement;
    const actionsArray: {
      action: string, file_path: string, content: string, encoding: string
      }[] = [];
    
    if(file.files) {
      for(let i = 0; i < file.files.length; i++) {
        if(file.files.item(i)) { 
          const file_item = file.files.item(i) as File;
          actionsArray.push(readerSetup(file_item, 'update'));
        }
      }
    }

    setTimeout(() => {
      console.log(actionsArray);
      edit(actionsArray);
    }, 2000);

    setEditConf(false);
  };

  const readerSetup = (file: File, choice: string) => {
    const action = {
      action: `${choice}`,
      file_path: '',
      content: '',
      encoding: 'base64'
    };

    if(file) {
      const reader = new FileReader();
      const file_name = file.name;
      let base64content = 'VXBsb2FkIGVycm9y';
      
      reader.onloadend = () => {
        base64content = reader.result as string;
        base64content = base64content.split(',')[1];
        action.file_path = file_name;
        action.content = base64content;
      };
      
      if(file) {
        reader.readAsDataURL(file);
      }
    }
    
    return action;
  };

  const listRepoFiles = () => {
    setFiles(true);

    GitLabAPI.listFiles(baseRepo.id)
      .then(() => console.log(`Listing files`))
      .catch(console.error);

    const files = JSON.parse(localStorage.getItem('filesList') || 'null');
    
    for(const f of files) {
      console.log(f);
    }

    filesList = files.join(', ');
    console.log(filesList);
  };

  const listUploadFiles = () => {
    setUploadConf(true);
    uploadFilesList = [];
    uploadFiles = '';

    const file = document.getElementById('file-upload') as HTMLInputElement;
    let file_item;
    let file_name: string;

    if(file.files) {
      for(let i = 0; i < file.files.length; i++) {
        if(file.files.item(i)) { 
          file_item = file.files.item(i);
          if(file_item) {
            file_name = file_item.name;
            uploadFilesList.push(file_name);
          }
        }
      }
    }

    uploadFiles = uploadFilesList.join(', ');
  };

  const listUpdateFiles = () => {
    setEditConf(true);
    editFilesList = [];
    editFiles = '';

    const file = document.getElementById('file-edit') as HTMLInputElement;
    let file_item;
    let file_name: string;

    if(file.files) {
      for(let i = 0; i < file.files.length; i++) {
        if(file.files.item(i)) { 
          file_item = file.files.item(i);
          if(file_item) {
            file_name = file_item.name;
            editFilesList.push(file_name);
          }
        }
      }
    }

    editFiles = editFilesList.join(', ');
  };

  const remove = () => {
    GitLabAPI.removeAssignment(baseRepo.id)
      .then(() => console.log(`Removed ${baseRepo.name}`))
      .catch(console.error);
    setDeleteCheck(false);
    setOpen(false);
  };

  const handleClose = () => {
    setDeleteCheck(false);
    setOpen(false);
  };

  const handleOpen = () => {
    setDeleteCheck(false);
    setOpen(true);
  };

  return (
    <Paper elevation={3}>
      <Card onClick={handleOpen}>
        <CardActionArea>
          <ImagePlaceholder colors={color} />
          <CardContent>
            <Typography variant='h6'>{baseRepo.name}</Typography>
            <Typography color='textSecondary'>
              Created: {baseRepo.created_at}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>{baseRepo.name} actions</DialogTitle>
        <DialogContent>
          <Button 
            className={classes.actionButton} 
            onClick={async () => {
              // If we DON'T await this, then there's a possibility of failing to create.
              for(const u of users) {
                await baseRepo.createAssignment(course.section, `${year}-SP`, u.username);
              }
            }} 
            variant='outlined' 
            color='primary'
          >
            <Typography color='textSecondary'>Create</Typography>
          </Button>
          <Button 
            className={classes.actionButton} 
            onClick={() => {
              // Currently assigns all students.
              baseRepo.assign()
                .catch(console.error);
            }} 
            variant='outlined' 
            color='primary'
          >
            <Typography color='textSecondary'>Assign</Typography>
          </Button>
          <Button 
            className={classes.actionButton} 
            onClick={() => {
              for(const u of users) {
                baseRepo.unlock(u.id);
              }
            }}
            variant='outlined' 
            color='primary'
          >
            <Typography color='textSecondary'>Unlock</Typography>
          </Button>
          <Button 
            className={classes.actionButton} 
            onClick={() => {
              for(const u of users) {
                baseRepo.lock(u.id);
              }
            }} 
            variant='outlined' 
            color='primary'
          >
            <Typography color='textSecondary'>Lock</Typography>
          </Button>
          <Button 
            className={classes.actionButton} 
            onClick={() => {
              baseRepo.archive();
            }} 
            variant='outlined' 
            color='primary'
          >
            <Typography color='textSecondary'>Archive</Typography>
          </Button>
          <Tooltip title='Show repo files and actions' placement='top'>
          <Button className={classes.actionButton} onClick={listRepoFiles} variant='outlined' color='primary'>
            <Typography color='textSecondary'>Files</Typography>
          </Button>
          </Tooltip>
          <Tooltip title='Delete the base repo' placement='top'>
          <Button className={classes.actionButton} onClick={()=> setDeleteCheck(true)} variant='outlined' color='primary'>
            <Typography color='textSecondary'>Delete</Typography>
            <Dialog
              open={deleteCheck}
            >
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to delete this repo?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color='primary'>
                  Cancel
                </Button>
                <Button onClick={remove} color='primary'>
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </Button>
          </Tooltip>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleClose}
            variant='outlined' 
            color='secondary'
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={files} onClose={() => setFiles(false)} aria-labelledby='files-dialog-title'> 
       <DialogTitle id='files-dialog-title'>{baseRepo.name} Files</DialogTitle>
       <DialogContent>
        <Typography variant='subtitle2'>{filesList}</Typography>
        <SpacePadding></SpacePadding>
        <form>
          <input type='file' id='file-upload' multiple/>
          <Button className={classes.actionButton} onClick={listUploadFiles} variant='outlined' color='primary'> 
            Upload
          </Button>
          <Dialog open={uploadConf} onClose={() => setUploadConf(false)}>
            <DialogContent>
              <Typography variant='subtitle2'>
                Upload {uploadFiles} to {baseRepo.name}?
              </Typography>
              <Button 
                className={classes.actionButton} 
                onClick={convertBase64Upload} 
                variant='outlined' 
                color='primary'
              > 
                Yes
              </Button>
              &nbsp;&nbsp;
              <Button 
                onClick={() => setUploadConf(false)}
                variant='outlined' 
                color='secondary'
              >
                No
              </Button>
            </DialogContent>
          </Dialog>
        </form>
        <SpacePadding></SpacePadding>
        <form>
          <input type='file' id='file-edit' multiple/>
          <Button className={classes.actionButton} onClick={listUpdateFiles} variant='outlined' color='primary'> 
            Update
          </Button>
          <Dialog open={editConf} onClose={() => setEditConf(false)}>
            <DialogContent>
              <Typography variant='subtitle2'>
                Update {editFiles} in {baseRepo.name}?
              </Typography>
              <Button className={classes.actionButton} onClick={convertBase64Edit} variant='outlined' color='primary'> 
                Yes
              </Button>
              &nbsp;&nbsp;
              <Button 
                onClick={() => setEditConf(false)}
                variant='outlined' 
                color='secondary'
              >
                No
              </Button>
            </DialogContent>
          </Dialog>
        </form>
       </DialogContent>
       <DialogActions>
        <Button 
          onClick={() => setFiles(false)}
          variant='outlined' 
          color='secondary'
        >
          Close
        </Button>
       </DialogActions>
      </Dialog>
    </Paper>
  );
}));