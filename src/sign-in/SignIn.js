import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from './components/CustomIcons';
import axios from 'axios'; // For making API calls
import { useNavigate } from 'react-router-dom'; // Add this for navigation

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function SignIn(props) {
  const navigate = useNavigate(); // Hook for navigation
  const [formData, setFormData] = React.useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = React.useState({
    username: false,
    password: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: false }); // Clear error when user starts typing
  };

  const validateInputs = () => {
    let isValid = true;

    if (!formData.username || formData.username.length < 3) {
      setErrors((prev) => ({ ...prev, username: true }));
      isValid = false;
    }

    if (!formData.password || formData.password.length < 6) {
      setErrors((prev) => ({ ...prev, password: true }));
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateInputs()) {
      return;
    }

    try {
      const response = await axios.post('https://fares147.pythonanywhere.com/api/accounts/login/', formData);

      // Extract user data, token, and redirect information from the backend response
      const { user, token, redirect_to } = response.data;

      // Store user data and token in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      alert(response.data.message); // Show success message

      // Redirect based on the `redirect_to` field
      if (redirect_to === '/DashboardAdmin') {
        navigate('/DashboardAdmin');
      } else if (redirect_to === '/user-dashboard/') {
        navigate(`/Dashboardcosn/user/${user.id}`);
      }
    } catch (error) {
      console.error(error.response?.data);
      alert('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <Card variant="outlined">
          <SitemarkIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            {/* Username Field */}
            <FormControl>
              <FormLabel htmlFor="username">Username</FormLabel>
              <TextField
                error={errors.username}
                helperText={errors.username ? 'Username must be at least 3 characters long.' : ''}
                id="username"
                type="text"
                name="username"
                placeholder="Enter your username"
                autoComplete="username"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={errors.username ? 'error' : 'primary'}
                value={formData.username}
                onChange={handleChange}
              />
            </FormControl>

            {/* Password Field */}
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={errors.password}
                helperText={errors.password ? 'Password must be at least 6 characters long.' : ''}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={errors.password ? 'error' : 'primary'}
                value={formData.password}
                onChange={handleChange}
              />
            </FormControl>

            {/* Remember Me Checkbox */}
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />

            {/* Submit Button */}
            <Button type="submit" fullWidth variant="contained">
              Sign in
            </Button>

            {/* Forgot Password Link */}
            <Link
              component="button"
              type="button"
              onClick={() => alert('Forgot password functionality not implemented yet.')}
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              Forgot your password?
            </Link>
          </Box>

          {/* Social Login Options */}
          <Divider>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign in with Google')}
              startIcon={<GoogleIcon />}
            >
              Sign in with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign in with Facebook')}
              startIcon={<FacebookIcon />}
            >
              Sign in with Facebook
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Don&apos;t have an account?{' '}
              <Link
                href="/material-ui/getting-started/templates/sign-in/"
                variant="body2"
                sx={{ alignSelf: 'center' }}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
