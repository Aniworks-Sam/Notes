import {Tooltip,IconButton} from '@mui/material';
import { Fragment} from 'react';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';

interface SiderContainerProps {
  id: number;
  title: string;
  value:any;
  onRemove: (id:number) => void;
}

const text = {
  fontWeight: "900"
};

const SiderContainer = ({ title, value, id, onRemove}: SiderContainerProps) => {
  return (
    <Fragment>
      <ListItemText primaryTypographyProps={value === id ? { style: text }: {}} primary={title} />
      {value === id && 
        <Tooltip title="Delete" onClick={() => onRemove(id)}>
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      }
    </Fragment>
  )
};

export default SiderContainer;
