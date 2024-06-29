import * as React from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useUserContext } from '../useCustomContext';
// import { Link } from '@mui/material';
import { Link } from 'react-router-dom';

function Navbar() {
    const { logout, currentUser } = useUserContext()
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [globalUser, setGlobalUser] = React.useState({})
    const baseURL = "https://online-judge-2.onrender.com"
    useEffect(() => {
        if (currentUser) {
            axios.post(`${baseURL}/user/userinfo`, {
                "uid": currentUser.uid
            }).then((res) => {
                setGlobalUser(res.data)
            })
        }
    }, [currentUser]);
    console.log(globalUser)
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <nav className="navbar bg-dark border-bottom border-body" data-bs-theme="dark" >
            <div className="container-fluid">
                <div>

                    <Link className="navbar-brand" to='/'>Home</Link>

                </div>
                <div>



                    {!currentUser ? <>
                        <Link className="navbar-brand" to='/problemset'>Problemset</Link>
                        <Link className="navbar-brand" to='/contests'>Contests</Link>
                        <Link to='/signin' className="btn btn-outline-danger" style={{ marginRight: '0.5rem' }}>Login</Link>
                        <Link to='/signup' className="btn btn-outline-primary">Signup</Link>
                    </> : <span className="navbar-text">
                        <div className='makerow' >
                            {/* <img src={currentUser.photoURL} alt="profile pic" style={{ borderRadius: '50%', height: '45px', width: '45px' }} /> */}
                            <Link className="navbar-brand" to='/problemset'>Problemset</Link>
                            <Link className="navbar-brand" to='/contests'>Contests</Link>
                            <div style={{ marginRight: '1rem', color: 'gray', fontSize: '1rem' }}>
                                {globalUser.isAdmin ? <span ><Link to='/admin' style={{ textDecoration: 'none' }}>🟢Admin</Link></span> : <></>}
                                <span style={{ marginRight: '0.5rem', marginLeft: '1rem' }}>
                                    {currentUser.displayName ? currentUser.displayName : currentUser.email}
                                </span>
                                <IconButton sx={{ p: 0 }} >
                                    <Avatar onClick={handleOpenUserMenu} alt="profile pic" src={globalUser.profile_pic ? globalUser.profile_pic : "http://www.gravatar.com/avatar/?d=mp"} />
                                </IconButton>
                            </div>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem onClick={handleCloseUserMenu}>
                                    {globalUser ? <Typography textAlign="center"> <Link to={`/profile/${globalUser.name}`}>Profile</Link>  </Typography> : <></>}
                                </MenuItem>
                                <MenuItem onClick={handleCloseUserMenu}>
                                    <Typography textAlign="center">
                                        <Link onClick={() => logout()}> Logout</Link>
                                    </Typography>
                                </MenuItem>
                                <MenuItem onClick={handleCloseUserMenu}>
                                    <Typography textAlign="center"> <Link to={`/problemset`}>Problemset</Link> </Typography>
                                </MenuItem>

                            </Menu>
                        </div>
                    </span>
                    }
                    {/* <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" /> */}
                    {/* <button className="btn btn-outline-success" type="submit">Search</button> */}
                </div>

            </div>
        </nav >
    );
}
export default Navbar;
