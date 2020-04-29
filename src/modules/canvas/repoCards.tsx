import {
  Button, 
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
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
import baseRepoStore from '../../stores/BaseRepoStore';
import { GitLabAPI } from '../../app';

const SpacePadding = styled.div`
  margin-bottom: 20px;
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

  const classes = useStyles();
  const { baseRepo, users, course } = props;
  const color = colors[Number(baseRepo.id) % 11];
  const [open, setOpen] = React.useState(false);
  const [files, setFiles] = React.useState(false);
  const [filesNames, setFileNames] = React.useState([]);
  const [uploadConf, setUploadConf] = React.useState(false);
  const [editConf, setEditConf] = React.useState(false);
  const [deleteCheck, setDeleteCheck] = React.useState(false);
  const [uploadFiles, setUpload] = React.useState<string[]>();
  const [updateFiles, setUpdate] = React.useState<string[]>();
  const [help, setHelp] = React.useState(false);
  const [nuke, setNuke] = React.useState(false);
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
    
    if(file.files && updateFiles) {
      const files = Array.from(file.files)
        .filter(f => updateFiles.indexOf(f.name) !== -1);

      for(const f of files) {
        actionsArray.push(readerSetup(f, 'update'));
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

  const listRepoFiles = async () => {
    await GitLabAPI.listFiles(baseRepo.id)
      .then(() => console.log(`Listing files`))
      .catch(console.error);
    
    const files = JSON.parse(localStorage.getItem('filesList') || 'null');
    
    const names = files[baseRepo.id] ? files[baseRepo.id].names : [];

    setFiles(true);
    setOpen(false);
    setFileNames(names);
  };

  const listUploadFiles = () => {
    
    const file = document.getElementById('file-upload') as HTMLInputElement;
    
    if(file.files) {
      setUploadConf(true);
      setUpload(
        Array.from(file.files)
          .map(f => f.name)
      );
    }
  };

  const listUpdateFiles = () => {
    
    const file = document.getElementById('file-edit') as HTMLInputElement;
    const files = JSON.parse(localStorage.getItem('filesList') || 'null');    
    const names: string[] = files[baseRepo.id] ? files[baseRepo.id].names : [];

    if(file.files) {
      const files_in_repo = Array.from(file.files)
        .filter(f => names.indexOf(f.name) !== -1)
        .map(f => f.name);

      if(files_in_repo.length) {
        setEditConf(true);
        setUpdate(files_in_repo);
      }
    }
  };

  /**
   * @TODO - Add toasties for success / errors.
   */
  const remove = () => {
    baseRepoStore.delete(baseRepo);
    
    setDeleteCheck(false);
    setOpen(false);
  };

  const nukeAll = () => {
    baseRepoStore.nuke(baseRepo)
      .catch(console.error);

    setNuke(false);
    setOpen(false);
  };

  const handleNuke = () => {
    setNuke(false);
    setOpen(true);
  };

  const handleOpen = () => {
    setDeleteCheck(false);
    setNuke(false);
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
      <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby='form-dialog-title'>
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
            <Button className={classes.actionButton} onClick={()=> {
              setDeleteCheck(true);
              setOpen(false);
            }} variant='outlined' color='primary'>
              <Typography color='textSecondary'>Delete</Typography>
            </Button>
          </Tooltip>
          <Tooltip title='Delete the base and all student repos' placement='top'>
            <Button 
              className={classes.actionButton} 
              onClick={()=> {
                setNuke(true);
                setOpen(false);
              }} 
              variant='outlined' 
              color='primary'
            >
              <Typography color='textSecondary'>Nuke</Typography>
            </Button>
          </Tooltip>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpen(false)}
            variant='outlined' 
            color='secondary'
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteCheck}
        onClose={() => {
          setDeleteCheck(false);
          setOpen(true);
        }}
      >
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this repo?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setDeleteCheck(false);
            setOpen(true);
          }} color='primary'>
            Cancel
          </Button>
          <Button onClick={remove} color='primary'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={nuke}
        onClose={() => {
          setNuke(false);
          setOpen(true);
        }}
      >
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove this and all student repos?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNuke} color='primary'>
            Cancel
          </Button>
          <Button onClick={nukeAll} color='primary'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={files} onClose={() => {setFiles(false); setOpen(true);}} aria-labelledby='files-dialog-title'> 
       <DialogTitle id='files-dialog-title'>Files in {baseRepo.name}</DialogTitle>
       <DialogContent dividers>
        {
          filesNames.length ? 
          filesNames.map(f => (
            <div key={`${f}-div`}>
              <Typography color='textSecondary' variant='subtitle1' key={f}>{f}</Typography>
              <br/>
            </div>
          )) :
          <Typography variant='subtitle2'>No files in this repo.</Typography>
        }
        <SpacePadding></SpacePadding>
        <form>
          <input type='file' id='file-upload' multiple style={{display: 'none'}}/>
          <label htmlFor='file-upload'>
            <Button variant='contained' color='primary' component='span'>
              Choose files
            </Button>
          </label>
          <Button className={classes.actionButton} onClick={listUploadFiles} variant='outlined' color='primary'> 
            <Typography color='textSecondary'>Upload</Typography>
          </Button>
          <br/>
          <input type='file' id='file-edit' multiple style={{display: 'none'}}/>
          <label htmlFor='file-edit'>
            <Button variant='contained' color='primary' component='span'>
              Choose files
            </Button>
          </label>
          <Button 
            className={classes.actionButton} 
            onClick={listUpdateFiles} 
            variant='outlined' 
            color='primary'
          >
            <Typography color='textSecondary'>Update</Typography>
          </Button>
          <Dialog open={uploadConf} onClose={() => setUploadConf(false)}>
            <DialogTitle>{'Are you sure you want to upload these files?'}</DialogTitle>
            <DialogContent dividers>
                {
                  uploadFiles ? 
                  uploadFiles.map(f => (<Typography variant='subtitle2' key={f}>{f}</Typography>)) :
                  <div>No files to upload.</div>
                }
            </DialogContent>
            <DialogContent dividers>
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
          <Dialog open={editConf} onClose={() => setEditConf(false)}>
            <DialogTitle>{'Are you sure you want to update these files?'}</DialogTitle>
            <DialogContent dividers>
                {
                  updateFiles ? 
                  updateFiles.map(f => (<Typography variant='subtitle2' key={f}>{f}</Typography>)) :
                  <div>No files to update.</div>
                }
            </DialogContent>
            <DialogContent dividers>
              <Button 
                className={classes.actionButton} 
                onClick={convertBase64Edit} 
                variant='outlined' 
                color='primary'
              > 
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
      </Dialog>
    </Paper>
  );
}));