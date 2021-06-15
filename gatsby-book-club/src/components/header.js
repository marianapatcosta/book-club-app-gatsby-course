import { Link, navigate } from "gatsby"
import PropTypes from "prop-types"
import React, { Fragment, useContext } from "react"
import { FirebaseContext } from "./Firebase"
import styled from "styled-components"

const StyledLogoutLink = styled.span`
  color: white;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

const StyledHeaderWrapper = styled.header`
  background: rebeccapurple;
  margin-bottom: 1.45rem;
`

const StyledHeaderContent = styled.div`
  margin: 0 auto;
  max-width: 60rem;
  padding: 1.45rem 1.0875rem;
  display: flex;

  > h1 {
    margin: 0;
    flex-grow: 1;

    > a {
      color: white;
      text-decoration: none;
    }
  }
  > div {
    margin: auto 0;
  }
`

const StyledUserInfo = styled.div`
  text-align: right;
  color: white;
`

const StyledLoginLink = styled.div`
  margin: auto 0;
  a {
    color: white;
  }
`

const Divider = styled.span`
  margin: 0 0.5rem;
  padding-right: 0.0625rem;
  background: #ddd;
`

const AdminLink = styled.span`
  a {
    color: white;
  }
`

const Header = ({ siteTitle }) => {
  const { firebase, user } = useContext(FirebaseContext)

  const handleLogoutClick = () => firebase.logout().then(() => navigate("/login"))

  return (
    <StyledHeaderWrapper>
      <StyledHeaderContent>
        <h1>
          <Link to="/">{siteTitle}</Link>
        </h1>
        <div>
          {!!user && !!user.email && (
            <StyledUserInfo>
              Hello, {user.username || user.email}
              <div>
                {!!user.isAdmin && (
                  <Fragment>
                    <AdminLink>
                      <Link to="/add-author">Add author</Link>
                    </AdminLink>
                    <Divider />
                    <AdminLink>
                      <Link to="/add-book">Add book</Link>
                    </AdminLink>
                    <Divider />
                  </Fragment>
                )}
                <StyledLogoutLink onClick={handleLogoutClick}>Logout</StyledLogoutLink>
              </div>
            </StyledUserInfo>
          )}
          {(!user || !user.email) && (
            <StyledLoginLink>
              <Link to="/login">Login</Link>
              <Divider />
              <Link to="/register">Register</Link>
            </StyledLoginLink>
          )}
        </div>
      </StyledHeaderContent>
    </StyledHeaderWrapper>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
