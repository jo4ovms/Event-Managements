import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Event, LocationOn, Person, Cancel } from '@mui/icons-material';
import { registrationsAPI } from '../../services/api';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelDialog, setCancelDialog] = useState({
    open: false,
    registration: null,
  });
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    try {
      setLoading(true);
      const response = await registrationsAPI.myEvents();
      if (response.success) {
        setRegistrations(response.registrations);
      } else {
        setError('Erro ao carregar suas inscrições');
      }
    } catch {
      setError('Erro ao carregar suas inscrições');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async () => {
    try {
      setCancelLoading(true);
      const response = await registrationsAPI.unregister(
        cancelDialog.registration.event.id
      );

      if (response.success) {
        setRegistrations(
          registrations.filter(
            (reg) => reg.event.id !== cancelDialog.registration.event.id
          )
        );
        setCancelDialog({ open: false, registration: null });
      } else {
        setError(response.message || 'Erro ao cancelar inscrição');
      }
    } catch {
      setError('Erro ao cancelar inscrição');
    } finally {
      setCancelLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEventStatus = (eventDate) => {
    const now = new Date();
    const event = new Date(eventDate);

    if (event < now) {
      return { label: 'Finalizado', color: 'default' };
    } else {
      return { label: 'Confirmado', color: 'success' };
    }
  };

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: 'calc(100vh - 72px)' }}>
      <Container maxWidth='lg' sx={{ py: 4 }}>
        {error && (
          <Alert severity='error' sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Box mb={4}>
          <Typography
            variant='h4'
            component='h1'
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              mb: 1,
            }}
          >
            Minhas Inscrições
          </Typography>
          <Typography
            variant='h6'
            color='text.secondary'
            sx={{ fontWeight: 400 }}
          >
            Eventos nos quais você está inscrito
          </Typography>
        </Box>

        {registrations.length === 0 ? (
          <Box textAlign='center' mt={4}>
            <Typography variant='h6' color='text.secondary' gutterBottom>
              Você não está inscrito em nenhum evento
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Explore os eventos disponíveis e faça sua inscrição!
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {registrations.map((registration) => {
              const event = registration.event;
              const status = getEventStatus(event.eventDate);
              const isPastEvent = new Date(event.eventDate) < new Date();

              return (
                <Grid item xs={12} md={6} lg={4} key={registration.id}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 3,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: 'success.main',
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box
                        display='flex'
                        justifyContent='space-between'
                        alignItems='flex-start'
                        mb={2}
                      >
                        <Typography variant='h6' component='h2' gutterBottom>
                          {event.name}
                        </Typography>
                        <Chip
                          label={status.label}
                          color={status.color}
                          size='small'
                        />
                      </Box>

                      {event.description && (
                        <Typography
                          variant='body2'
                          color='text.secondary'
                          paragraph
                        >
                          {event.description}
                        </Typography>
                      )}

                      <Box display='flex' alignItems='center' mb={1}>
                        <Event
                          sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }}
                        />
                        <Typography variant='body2' color='text.secondary'>
                          {formatDate(event.eventDate)}
                        </Typography>
                      </Box>

                      <Box display='flex' alignItems='center' mb={1}>
                        <LocationOn
                          sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }}
                        />
                        <Typography variant='body2' color='text.secondary'>
                          {event.location}
                        </Typography>
                      </Box>

                      <Box display='flex' alignItems='center' mb={2}>
                        <Person
                          sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }}
                        />
                        <Typography variant='body2' color='text.secondary'>
                          Organizador: {event.createdBy.name}
                        </Typography>
                      </Box>

                      <Typography
                        variant='caption'
                        color='text.secondary'
                        display='block'
                      >
                        Inscrito em: {formatDate(registration.registeredAt)}
                      </Typography>
                    </CardContent>

                    {!isPastEvent && (
                      <Box sx={{ p: 2, pt: 0 }}>
                        <Button
                          fullWidth
                          variant='outlined'
                          color='error'
                          startIcon={<Cancel />}
                          onClick={() =>
                            setCancelDialog({ open: true, registration })
                          }
                        >
                          Cancelar Inscrição
                        </Button>
                      </Box>
                    )}
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        <Dialog
          open={cancelDialog.open}
          onClose={() => setCancelDialog({ open: false, registration: null })}
        >
          <DialogTitle>Cancelar Inscrição</DialogTitle>
          <DialogContent>
            <Typography>
              Tem certeza que deseja cancelar sua inscrição no evento "
              {cancelDialog.registration?.event.name}"?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() =>
                setCancelDialog({ open: false, registration: null })
              }
              disabled={cancelLoading}
            >
              Manter Inscrição
            </Button>
            <Button
              onClick={handleCancelRegistration}
              color='error'
              variant='contained'
              disabled={cancelLoading}
              startIcon={cancelLoading ? <CircularProgress size={16} /> : null}
            >
              {cancelLoading ? 'Cancelando...' : 'Cancelar Inscrição'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default MyRegistrations;
