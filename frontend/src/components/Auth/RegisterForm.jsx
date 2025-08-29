import React, { useState } from 'react';
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
  Person,
  Visibility,
  VisibilityOff,
  Event,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
    if (success) setSuccess('');
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const newFieldErrors = {};

    if (!formData.name.trim()) {
      setError('Nome é obrigatório');
      newFieldErrors.name = true;
    } else if (formData.name.trim().length < 2) {
      setError('Nome deve ter pelo menos 2 caracteres');
      newFieldErrors.name = true;
    }

    if (!formData.email.trim()) {
      setError('Email é obrigatório');
      newFieldErrors.email = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Email deve ser válido');
        newFieldErrors.email = true;
      }
    }

    if (!formData.password) {
      setError('Senha é obrigatória');
      newFieldErrors.password = true;
    } else if (formData.password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      newFieldErrors.password = true;
    }

    if (!formData.confirmPassword) {
      setError('Confirme a senha');
      newFieldErrors.confirmPassword = true;
    } else if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      newFieldErrors.confirmPassword = true;
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      setLoading(false);
      return;
    }

    try {
      const result = await register(
        formData.name,
        formData.email,
        formData.password
      );

      if (result.success) {
        setSuccess(
          'Cadastro realizado com sucesso! Você pode fazer login agora.'
        );
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch {
      setError('Erro inesperado ao fazer cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth='sm' sx={{ mt: 8 }}>
      <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: 'secondary.main',
                mb: 2,
              }}
            >
              <Event sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Typography variant='h4' component='h1' gutterBottom>
              Criar Conta
            </Typography>
            <Typography variant='body1' color='text.secondary'>
              Cadastre-se para gerenciar eventos
            </Typography>
          </Box>

          <Box component='form' onSubmit={handleSubmit} noValidate>
            {error && (
              <Alert severity='error' sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity='success' sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <TextField
              fullWidth
              name='name'
              label='Nome Completo'
              value={formData.name}
              onChange={handleChange}
              margin='normal'
              error={fieldErrors.name}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Person color='action' />
                  </InputAdornment>
                ),
              }}
            />

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
                      onClick={() => setShowPassword(!showPassword)}
                      edge='end'
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              name='confirmPassword'
              label='Confirmar Senha'
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              margin='normal'
              error={fieldErrors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Lock color='action' />
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
                'Criar Conta'
              )}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant='body2'>
                Já tem uma conta?{' '}
                <Link
                  component='button'
                  type='button'
                  onClick={() => navigate('/login')}
                  sx={{ textDecoration: 'none' }}
                >
                  Faça login aqui
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RegisterForm;
