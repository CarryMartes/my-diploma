import { useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import { alpha } from '@mui/material/styles';
import { Button, Box, Divider, MenuItem, Typography, Avatar, IconButton } from '@mui/material';
// components
import Iconify from '../../components/Iconify';
import MenuPopover from '../../components/MenuPopover';
//
import account from '../../_mocks_/account';
import { useDispatch, useSelector } from 'react-redux';
import { changeAuth } from 'src/shared/store/users/actions';
import store from 'src/shared/api/config/storage';
import { userLogout } from 'src/shared/api/request/users';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
    linkTo: '/'
  },
  // {
  //   label: 'Profile',
  //   icon: 'eva:person-fill',
  //   linkTo: '#'
  // },
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
    linkTo: '#'
  }
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const dispatch = useDispatch();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const userProfile = useSelector((state) => state.user['userProfile']);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const logout = () => {
    userLogout({
      refresh: store.get('refresh_token')
    }).then(() => {
      dispatch(changeAuth(false));
      store.remove('token');
      store.remove('refresh_token');
      navigate('/login');
    });
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
            }
          })
        }}
      >
        <Avatar src={account.photoURL} alt="photoURL" />
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 220 }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          {userProfile && (
            <>
              <Typography variant="subtitle1" noWrap>
                {userProfile.nickname}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {userProfile.email}
              </Typography>
            </>
          )}
        </Box>

        <Divider sx={{ my: 1 }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem
            key={option.label}
            to={option.linkTo}
            component={RouterLink}
            onClick={handleClose}
            sx={{ typography: 'body2', py: 1, px: 2.5 }}
          >
            <Iconify
              icon={option.icon}
              sx={{
                mr: 2,
                width: 24,
                height: 24
              }}
            />

            {option.label}
          </MenuItem>
        ))}

        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button fullWidth color="inherit" variant="outlined" onClick={logout}>
            Logout
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}
