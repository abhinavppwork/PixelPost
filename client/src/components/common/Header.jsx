import React from 'react'
import { Link } from 'react-router-dom'
import { useClerk, useUser } from '@clerk/clerk-react'
import { useContext } from 'react'
import { userAuthorContextObj } from '../../contexts/userAuthorContext'
import { useNavigate } from 'react-router-dom'

function Header() {
  const { signOut } = useClerk();
  const { isSignedIn, user, isLoaded } = useUser();
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj)
  const navigate = useNavigate();

  async function handleSignout() {
    await signOut();
    setCurrentUser(null);
    navigate('/')
  }

  return (
    <div>
      <nav className='navbar navbar-expand-lg navbar-light bg-light px-4 d-flex justify-content-between align-items-center'>
        <div>
          <Link to="/" className="navbar-brand fw-bold">LOGO</Link>
        </div>
        <ul className='navbar-nav d-flex flex-row gap-3 align-items-center'>
          {
            !isSignedIn ?
              <div className='d-flex gap-3'>
                <li className="nav-item">
                  <Link to="/" className="nav-link">Home</Link>
                </li>
                <li className="nav-item">
                  <Link to="/signin" className="nav-link">Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/signup" className="nav-link">Signup</Link>
                </li>
              </div> :
              <div className='d-flex align-items-center gap-3'>
                <div style={{ position: "relative" }} className='d-flex align-items-center'>
                  <img src={user.imageUrl} width="40px" className="rounded-circle" alt="" />
                  <p className='role position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary'></p>
                </div>
                <p className='mb-0 fw-semibold'>{user.firstName}</p>
                <button className="btn btn-sm btn-danger" onClick={handleSignout}>Sign Out</button>
              </div>
          }
        </ul>
      </nav>
    </div>
  )
}

export default Header
