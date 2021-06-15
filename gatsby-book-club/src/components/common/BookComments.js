import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { Button } from "./Button"
import { Input } from "./Input"
import moment from "moment"

const StyledCommentForm = styled.form`
  display: flex;
  margin-top: 2rem;

  ${Input} {
    margin-right: 0.5rem;
    margin-top: auto;
    margin-bottom: auto;
  }

  ${Button} {
    margin: auto 0;
  }
`

const StyledCommentListItem = styled.div`
  > strong {
    font-size: 80%;
    color: #666;
  }

  border-bottom: 0.0625rem solid #ddd;
  padding: 0.3rem 0;
`

export const BookComments = ({ firebase, bookId }) => {
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState("")

  useEffect(() => {
    const unsubscribe = firebase.subscribeToBookComments({
      bookId,
      onSnapshot: snapshot => {
        const snapshotComments = snapshot.map(doc => ({
            id: doc.id,
            ...doc.data(), 
          })
        )
        setComments(snapshotComments)
      },
    })

    return () => !!unsubscribe && unsubscribe() 
  }, [])

  const handlePostCommentSubmit = (e) => {
    e.preventDefault()
    firebase.postComment({
      text: commentText,
      bookId,
    })
  }

  return (
    <div>
      <StyledCommentForm onSubmit={handlePostCommentSubmit}>
        <Input
          value={commentText}
          onChange={e => {
            setCommentText(e.target.value)
          }}
        />
        <Button type="submit">Post comment</Button>
      </StyledCommentForm>
      {comments.map(comment => (
        <StyledCommentListItem key={comment.id}>
          <strong>
            {comment.username} -{" "}
            {moment(comment.dateCreated.toDate()).format("HH:mm Do MMM YYYY")}
          </strong>
          <div>{comment.text}</div>
        </StyledCommentListItem>
      ))}
    </div>
  )
}
