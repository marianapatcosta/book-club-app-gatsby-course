import React from "react"
import styled from "styled-components"
import { GatsbyImage } from "gatsby-plugin-image"

const StyledBookItemWrapper = styled.section`
  border: 0.0625rem solid #ddd;
  padding: 0.5rem;
  background: white;
  margin-bottom: 0.5rem;
  display: flex;

  h2 {
    small {
      font-size: 0.9rem;
      padding-left: 0.5rem;
      font-weight: normal;
    }
  }
`

const BookItemImageWrapper = styled.div`
  max-width: 12.5rem;

  img {
    max-width: 12.5rem;
  }
`

const BookItemContentWrapper = styled.div`
  flex-grow: 1;
  padding-left: 0.5rem;
`

const BookItem = ({
  authorName,
  bookTitle,
  bookSummary,
  bookCover,
  children,
}) => {
  // const image = getImage(bookCover)
  return (
    <StyledBookItemWrapper>
      <BookItemImageWrapper>
        <GatsbyImage image={bookCover} alt={bookTitle} />
      </BookItemImageWrapper>
      <BookItemContentWrapper>
        <h2>
          {bookTitle}
          <small>{authorName}</small>
        </h2>
        <p>{bookSummary}</p>
        <div>{children}</div>
      </BookItemContentWrapper>
    </StyledBookItemWrapper>
  )
}

export default BookItem
