import React from 'react'
import { Link } from "react-router-dom";
import { Toolbar, Typography } from '@mui/material';
import { SignInOutBtn } from '../../Auth/SignInOutBtn/SignInOutBtn';
import { Auth } from '../../../context/Auth/Auth';
import './MainMenu.scss';

const MainMenu = () => {
  const { authenticated } = React.useContext(Auth);

  return (
    <Toolbar sx={{ flexWrap: 'wrap' }}>
      <Typography className="logo" variant="h6" color="white" noWrap sx={{ flexGrow: 1 }}>
        <Link to='/'>HOME</Link>
      </Typography>
      <nav className="main-navigation-wrapper">
        <ul className="main-navigation-menu">
          {authenticated ? (
            <li className='menu-item'>
              <Link to='/home'>Profile</Link>
            </li>
          ) : ( // If not logged in.
            <li className='menu-item'>
              <Link to='/register'>Register</Link>
            </li>
          )}
        </ul>
      </nav>
      <SignInOutBtn/>
    </Toolbar>
  )
}

export default MainMenu