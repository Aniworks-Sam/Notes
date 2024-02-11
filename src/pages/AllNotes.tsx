import { useState, useEffect, useContext, useCallback, Fragment } from 'react';
import AuthContext from '../components/store/auth-context';
import SideNav from '../components/ui/SideNav';

const AllNotes = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedNotes, setLoadedNotes] = useState<any>([]);
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;

  const fetchData = useCallback(() => {
    setIsLoading(true);
    fetch('https://anisoft.us/mailapp/api/mail/getnotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': token,
      },
      body: JSON.stringify({}),
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        const notes: any = [];
        for (const key in data) {
          const note: any = {
            id: key,
            ...data[key],
          };
          notes.push(note);
        }
        setIsLoading(false);
        setLoadedNotes(notes);
        console.log(notes);
      });
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Fragment>
    {!isLoading && <SideNav notes={loadedNotes} onFetch={fetchData} />}
    {isLoading && <p>Loading...</p>}
    </Fragment>
  );
};

export default AllNotes;
