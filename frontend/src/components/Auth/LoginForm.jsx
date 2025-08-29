import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Link,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Event,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const newFieldErrors = {};

    if (!formData.email.trim()) {
      setError('Email é obrigatório');
      newFieldErrors.email = true;
      setLoading(false);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email.trim() && !emailRegex.test(formData.email)) {
      setError('Email deve ser válido');
      newFieldErrors.email = true;
      setLoading(false);
    }

    if (!formData.password) {
      setError('Senha é obrigatória');
      newFieldErrors.password = true;
      setLoading(false);
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } catch {
      setError('Erro inesperado ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'grey.50',
      }}
    >
      <Container maxWidth='sm'>
        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          }}
        >
          <CardContent sx={{ p: 6 }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 64,
                  height: 64,
                  borderRadius: 3,
                  bgcolor: 'primary.main',
                  mb: 3,
                }}
              >
                <Event sx={{ fontSize: 32, color: 'white' }} />
              </Box>
              <Typography
                variant='h3'
                component='h1'
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: 'text.primary',
                }}
              >
                Bem-vindo
              </Typography>
              <Typography
                variant='h6'
                color='text.secondary'
                sx={{ fontWeight: 400 }}
              >
                Entre na sua conta para continuar
              </Typography>
            </Box>

            <Box component='form' onSubmit={handleSubmit} noValidate>
              {error && (
                <Alert severity='error' sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                fullWidth
                name='email'
                label='Email'
                type='email'
                value={formData.email}
                onChange={handleChange}
                margin='normal'
                error={fieldErrors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Email color='action' />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                name='password'
                label='Senha'
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                margin='normal'
                error={fieldErrors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Lock color='action' />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={handleTogglePassword}
                        edge='end'
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type='submit'
                fullWidth
                variant='contained'
                size='large'
                disabled={loading}
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                {loading ? (
                  <CircularProgress size={24} color='inherit' />
                ) : (
                  'Entrar'
                )}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant='body2'>
                  Não tem uma conta?{' '}
                  <Link
                    component='button'
                    type='button'
                    onClick={() => navigate('/register')}
                    sx={{ textDecoration: 'none' }}
                  >
                    Cadastre-se aqui
                  </Link>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginForm;
