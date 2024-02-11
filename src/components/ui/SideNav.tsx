import { Box, AppBar, Toolbar, Button } from '@mui/material';
import { useState, useContext, Fragment,useCallback } from 'react';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import NotesEditor from '../Notes/NotesEditor';
import SiderContainer from './SiderContainer';
import AuthContext from '../store/auth-context';
import './SideNav.css';
import { useNavigate } from 'react-router-dom';

interface SideNavProps {
  notes: any;
  onFetch: () => void;
}

const defaultDrawerWidth = 240;
const minDrawerWidth = 50;
const maxDrawerWidth = 1000;

export default function SideNav({notes,onFetch}: SideNavProps) {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const [value,setValue] = useState(null);
  const [isClicked, setIsClicked] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(defaultDrawerWidth);

  const handleMouseDown = (e) => {
    document.addEventListener("mouseup", handleMouseUp, true);
    document.addEventListener("mousemove", handleMouseMove, true);
  };

  const handleMouseUp = () => {
    document.removeEventListener("mouseup", handleMouseUp, true);
    document.removeEventListener("mousemove", handleMouseMove, true);
  };

  const handleMouseMove = useCallback(e => {
    const newWidth = e.clientX - document.body.offsetLeft;
    if (newWidth > minDrawerWidth && newWidth < maxDrawerWidth) {
      setDrawerWidth(newWidth);
    }
  }, []);

  const logoutHandler = () => {
    authCtx.logout();
    navigate('/auth');
  };

  const removeHandler = (id:number) => {
    fetch(`https://anisoft.us/mailapp/api/mail/deletenote?id=${id}`, {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': authCtx.token,
      },
    })
      .then((res) => {
        if (res.ok) {
          console.log(res);
          return res.text();
        } else {
          return res.json().then((data) => {
            let errorMessage = 'Authentication failed!';
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        console.log(data);
        onFetch();
      })
      .catch((err) => {
        console.error(err.message);
        alert(err.message);
      });
  }

  return (
    <Fragment>
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar className='nav'>
        <Typography variant="h6" noWrap component="div">
          Note Book
        </Typography>
        <Button variant="contained" sx={{color:'#2196f3' ,backgroundColor: '#fff'}} className='btn' onClick={logoutHandler}>Logout</Button>
      </Toolbar>
    </AppBar>
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        className='drawer'
        PaperProps={{ style: { width: drawerWidth } }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <div className='toolbar' />
        <div onMouseDown={e => handleMouseDown(e)} className='dragger' />
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
        <div className='btn-side'>
          <Button variant="contained" onClick={() => {
            setIsClicked(true);
            setValue(null);
          }}>+ Add Note</Button>
        </div>
          <List>
            {notes.map((note:any) => (
              <ListItem button key={note.id} sx={value === note.id && !isClicked ? { borderLeft: '0.5rem solid #2196f3'}: {}} onClick={()=>{
                setValue(note.id);
                setIsClicked(false);
                }}>
                <SiderContainer id={note.id} title={note.title} value={value ? value : !isClicked && setValue(notes[0].id)} onRemove={removeHandler} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {!isClicked && notes.filter((note:any)=> value === note.id).map((noteVal:any) => (
          <NotesEditor key={noteVal.id} title={noteVal.title} content={noteVal.content} onFetch={onFetch} />
        ))}
        {isClicked && <NotesEditor title='' content='' onFetch={onFetch} />}
      </Box>
    </Box>
    </Fragment>
  );
}
