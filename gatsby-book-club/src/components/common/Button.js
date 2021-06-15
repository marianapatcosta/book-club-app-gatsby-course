import styled from 'styled-components'

export const Button = styled.button`
  padding: 0.5rem 1rem;
  background: rebeccapurple;
  color: white;
  border-radius: 0.3rem;
  cursor: pointer;
  white-space: nowrap;
  ${props => props.block ? 'display: block; width: 100%;' : ''}
  
  &:hover {
    background: indigo;
  }
`