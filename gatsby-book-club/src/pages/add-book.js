import React, { useContext, useEffect, useState } from 'react';
import { FirebaseContext } from '../components/Firebase';
import  {Form, Input, Button } from '../components/common';
import styled from 'styled-components';

const StyledFormField = styled.div`
  margin-bottom: 1.2rem;
`

let fileReader;
if (typeof window !== 'undefined'){
  fileReader = new FileReader();
}

const AddBook = () => {
  const {firebase} = useContext(FirebaseContext);
  const [authors, setAuthors] = useState([]);
  const [bookCover, setBookCover] = useState('');
  const [bookName, setBookName] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [summary, setSummary] = useState('');
  const [success, setSuccess] = useState(false);

  let isMounted = true;

  useEffect(() => {
    return () => isMounted = false;
  }, [])

  useEffect(() => {
    fileReader.addEventListener('load', () => {
      setBookCover(fileReader.result);
    })
  }, []);

  useEffect(() => {
    // query all available authors
    if (firebase) {
      firebase.getAuthors().then(snapshot => {
        if (isMounted) {
          const availableAuthors = snapshot.map(doc => ( 
           {
              id: doc.id,
              ...doc.data()
            })
          )
          setAuthorId(availableAuthors[0].id);
          setAuthors(availableAuthors);
        }
      })
    }
  }, [firebase])

  return (
    <Form onSubmit={(e) => {
      e.preventDefault();
      firebase.createBook({
        bookCover,
        bookName,
        authorId,
        summary
      }).then(() => {
        if (isMounted) {
          setSuccess(true)
        }
      })
    }}>
      <StyledFormField>
        <Input placeholder="book name" value={bookName} onChange={e => {
          setSuccess(false);
          setBookName(e.target.value)
        }} />
      </StyledFormField>
      <StyledFormField>
        <strong>
          Author
        </strong>
        <div>
          <select value={authorId} onChange={e => {
            setSuccess(false);
            setAuthorId(e.target.value)
          }}>
            {authors.map(a => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </StyledFormField>
      <StyledFormField>
        <strong>
          Book cover
        </strong>
        <Input type="file" onChange={e => {
          setSuccess(false);
          fileReader.readAsDataURL(e.target.files[0])
        }} />
      </StyledFormField>
      <StyledFormField>
        <strong>
          Summary
        </strong>
        <Input placeholder="book summary" value={summary}
          onChange={e => {
            setSuccess(false);
            setSummary(e.target.value)
          }}/>
      </StyledFormField>
      {!!success &&
        <span>
          New book added successfully!
        </span>
      }
      <Button block type="submit">
        Add new book
      </Button>
    </Form>
  );
}

export default AddBook;