import styled from 'styled-components';

export const Input = styled.input`
  display: block;
  width: 100%;
  padding: 0.5rem;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  border-radius: 0.3rem;
  border: 0.0625rem solid #ddd;
  box-shadow: none;
  
  &:focus, &:active{
    border: 0.625rem solid rebeccapurple;
  }
`