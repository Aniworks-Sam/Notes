import React, { Fragment, useState, useContext,useRef } from 'react';
import classes from './NotesEditor.module.css';
import AuthContext from '../store/auth-context';
import { Editor } from '@tinymce/tinymce-react';

interface notesEditorProps {
  title: string;
  content:string;
  onFetch: () => void;
}

const NotesEditor = ({ title,content,onFetch }: notesEditorProps) => {
  const authContext = useContext(AuthContext);
  const { token } = authContext;
  const [enteredTitle, setEnteredTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>();
  const editorRef = useRef<any>(null);
  let contentText:any;

  const titleChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredTitle(event.target.value);
  };

  const clickHandler = () => {
    const title = enteredTitle;
    console.log(title);
    if (editorRef.current) {
      contentText = editorRef.current.getContent();
      console.log(editorRef.current.getContent());
    }
    
    if(title){
      setIsLoading(true);
    fetch('https://anisoft.us/mailapp/api/mail/savenote', {
      method: 'POST',
      body: JSON.stringify({
        id: 0,
        title: title,
        content: contentText,
        typeid: 1,
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': token,
      },
    })
      .then((res) => {
        setIsLoading(false);
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
    else{
      setIsLoading(false);
    }
  };
  return (
    <Fragment>
      <div className={classes.control}>
        <input
          type="text"
          id="title"
          placeholder="Your Title"
          required
          value={title ? title: enteredTitle}
          onChange={titleChangeHandler}
        />
      </div>
        {/* <Rooster /> */}
        <Editor
        apiKey="qdsf5dbrpsp23nykdqpl1v31tm86o14x3xb611uk8te5qhy0"
        onInit={(evt, editor) => editorRef.current = editor}
        initialValue={content ? content:''}
        init={{
          height: '50vh',
          menubar: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
          ],
          toolbar: 'undo redo | formatselect | ' +
          'bold italic backcolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
        onBlur={content ? ()=>{} : clickHandler }
      />
      <div className={classes.btn}>
        {isLoading && <p>Sending request...</p>}
      </div>
    </Fragment>
  );
};

export default NotesEditor;
