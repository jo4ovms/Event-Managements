import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
} from '@mui/material';
import {
  AccountCircle,
  Event,
  ExitToApp,
  Person,
  Dashboard,
  Group,
  Assignment,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleClose();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <AppBar
      position='static'
      elevation={0}
      sx={{
        bgcolor: 'white',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ minHeight: '72px' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            '&:hover': { opacity: 0.8 },
          }}
          onClick={() => navigate('/dashboard')}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 2,
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
            }}
          >
            <Event sx={{ color: 'white', fontSize: 18 }} />
          </Box>
          <Typography
            variant='h6'
            component='div'
            sx={{
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            Events
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={
                window.location.pathname === '/dashboard' ? 'contained' : 'text'
              }
              onClick={() => navigate('/dashboard')}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                px: 3,
              }}
              disableElevation
            >
              Dashboard
            </Button>

            <Button
              variant={
                window.location.pathname === '/events' ? 'contained' : 'text'
              }
              onClick={() => navigate('/events')}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                px: 3,
              }}
              disableElevation
            >
              Eventos
            </Button>

            <Button
              variant={
                window.location.pathname === '/my-registrations'
                  ? 'contained'
                  : 'text'
              }
              onClick={() => navigate('/my-registrations')}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                px: 3,
              }}
              disableElevation
            >
              Minhas Inscrições
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user?.isAdmin && (
            <Typography
              variant='caption'
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                px: 2,
                py: 0.5,
                borderRadius: 10,
                fontSize: '0.75rem',
                fontWeight: 600,
                display: { xs: 'none', sm: 'block' },
              }}
            >
              ADMIN
            </Typography>
          )}

          <Typography
            variant='body2'
            sx={{
              display: { xs: 'none', sm: 'block' },
              fontWeight: 500,
              color: 'text.secondary',
            }}
          >
            {user?.name}
          </Typography>

          <IconButton
            aria-label='menu do usuário'
            aria-controls='menu-usuario'
            aria-haspopup='true'
            onClick={handleMenu}
            sx={{
              padding: 0.5,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'primary.main',
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>

          <Menu
            id='menu-usuario'
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{
              '& .MuiPaper-root': {
                borderRadius: 3,
                minWidth: 220,
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                border: '1px solid',
                borderColor: 'divider',
                mt: 1,
              },
            }}
          >
            <Box sx={{ p: 2, pb: 1 }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                {user?.name}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {user?.email}
              </Typography>
              {user?.isAdmin && (
                <Typography
                  variant='caption'
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    mt: 0.5,
                    display: 'block',
                  }}
                >
                  Administrador
                </Typography>
              )}
            </Box>
            <Divider />
            <MenuItem
              onClick={handleLogout}
              sx={{
                py: 1.5,
                px: 2,
                color: 'error.main',
                borderRadius: 1,
                mx: 1,
                mb: 1,
                '&:hover': {
                  bgcolor: 'error.50',
                },
              }}
            >
              <ExitToApp sx={{ mr: 2 }} />
              <Typography variant='body2'>Sair</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
