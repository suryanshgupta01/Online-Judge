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
import { Link } from '@mui/material';

function Navbar() {
    const { logout, currentUser } = useUserContext()
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [globalUser, setGlobalUser] = React.useState({})
    const baseURL = "http://localhost:4000"
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

                    <a className="navbar-brand" href='/'>Home</a>
                    <a className="navbar-brand" href='/problemset'>ProblemSet</a>
                    <a className="navbar-brand" href='/contests'>Contests</a>

                </div>
                <form className="d-flex" role="search">
                    {!currentUser ? <>
                        <a href='/signin' className="btn btn-outline-danger" >Login</a>
                        <a href='/signup' className="btn btn-outline-primary">Signup</a>
                    </> : <span className="navbar-text">
                        <div className='makerow'>

                            {/* <img src={currentUser.photoURL} alt="profile pic" style={{ borderRadius: '50%', height: '45px', width: '45px' }} /> */}
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }} style={{ marginRight: '3.7rem', color: 'gray', fontSize: '1rem' }}>
                                <span style={{ marginRight: '0.5rem' }}>
                                    {currentUser.displayName ? currentUser.displayName : currentUser.email}
                                </span>
                                <Avatar alt="profile pic" src={currentUser.photoURL ? currentUser.photoURL : "http://www.gravatar.com/avatar/?d=mp"} />
                            </IconButton>
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
                                    {globalUser ? <Typography textAlign="center"> <a href={`/profile/${globalUser.name}`}>Profile</a>  </Typography> : <></>}
                                </MenuItem>
                                <MenuItem onClick={handleCloseUserMenu}>
                                    <Typography textAlign="center"><Link onClick={() => logout()}> Logout</Link> </Typography>
                                </MenuItem>
                                <MenuItem onClick={handleCloseUserMenu}>
                                    <Typography textAlign="center"> <a href={`/problemset`}>Problemset</a> </Typography>
                                </MenuItem>

                            </Menu>
                        </div>
                    </span>
                    }
                    {/* <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" /> */}
                    {/* <button className="btn btn-outline-success" type="submit">Search</button> */}
                </form>
            </div>
        </nav >
    );
}
export default Navbar;
