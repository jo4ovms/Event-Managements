import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from '@mui/material';
import {
  Event,
  Person,
  CalendarToday,
  LocationOn,
  PersonAdd,
  PersonRemove,
  CheckCircle,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { eventsAPI, registrationsAPI } from '../../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [eventsResponse, myEventsResponse] = await Promise.all([
        eventsAPI.getAll(),
        registrationsAPI.myEvents(),
      ]);

      if (eventsResponse.success) {
        setEvents(eventsResponse.events || []);
      }

      if (myEventsResponse.success) {
        setMyEvents(myEventsResponse.registrations || []);
      }
    } catch (err) {
      setError('Erro ao carregar dados');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      const result = await registrationsAPI.register(eventId);

      if (result.success) {
        showSnackbar('Inscrição realizada com sucesso!', 'success');
        loadData();
        setSelectedEvent(null);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao se inscrever';
      showSnackbar(message, 'error');
    }
  };

  const handleUnregister = async (eventId) => {
    try {
      const result = await registrationsAPI.unregister(eventId);

      if (result.success) {
        showSnackbar('Inscrição cancelada com sucesso!', 'success');
        loadData();
        setSelectedEvent(null);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || 'Erro ao cancelar inscrição';
      showSnackbar(message, 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const isRegistered = (eventId) => {
    return myEvents.some((registration) => registration.event.id === eventId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isEventPast = (dateString) => {
    return new Date(dateString) < new Date();
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: 'calc(100vh - 72px)' }}>
      <Container maxWidth='xl' sx={{ py: 4 }}>
        <Box sx={{ mb: 6 }}>
          <Typography
            variant='h4'
            component='h1'
            gutterBottom
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              mb: 1,
            }}
          >
            Bem-vindo, {user?.name}
          </Typography>
          <Typography
            variant='h6'
            color='text.secondary'
            sx={{ fontWeight: 400 }}
          >
            Gerencie seus eventos e inscrições
          </Typography>
        </Box>

        {error && (
          <Alert severity='error' sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography variant='h4' sx={{ fontWeight: 700, mb: 0.5 }}>
                      {events.length}
                    </Typography>
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      sx={{ fontWeight: 500 }}
                    >
                      Eventos Disponíveis
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: 'primary.50',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Event sx={{ color: 'primary.main', fontSize: 24 }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'success.main',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography variant='h4' sx={{ fontWeight: 700, mb: 0.5 }}>
                      {myEvents.length}
                    </Typography>
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      sx={{ fontWeight: 500 }}
                    >
                      Minhas Inscrições
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: 'success.50',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CheckCircle sx={{ color: 'success.main', fontSize: 24 }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'warning.main',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography variant='h4' sx={{ fontWeight: 700, mb: 0.5 }}>
                      {events.filter((e) => !isEventPast(e.eventDate)).length}
                    </Typography>
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      sx={{ fontWeight: 500 }}
                    >
                      Eventos Futuros
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: 'warning.50',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CalendarToday
                      sx={{ color: 'warning.main', fontSize: 24 }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Typography
          variant='h5'
          component='h2'
          sx={{
            fontWeight: 600,
            mb: 3,
            color: 'text.primary',
          }}
        >
          Eventos Disponíveis
        </Typography>

        {events.length === 0 ? (
          <Alert severity='info'>Nenhum evento disponível no momento.</Alert>
        ) : (
          <Grid container spacing={3}>
            {events.map((event) => {
              const registered = isRegistered(event.id);
              const eventPast = isEventPast(event.eventDate);

              return (
                <Grid item xs={12} md={6} lg={4} key={event.id}>
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
                        transform: 'translateY(-4px)',
                        borderColor: 'primary.main',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: 2,
                        }}
                      >
                        <Typography variant='h6' component='h3' gutterBottom>
                          {event.name}
                        </Typography>
                        {registered && (
                          <Chip
                            label='Inscrito'
                            color='success'
                            size='small'
                            icon={<CheckCircle />}
                          />
                        )}
                        {eventPast && (
                          <Chip
                            label='Finalizado'
                            color='default'
                            size='small'
                          />
                        )}
                      </Box>

                      <Typography
                        variant='body2'
                        color='text.secondary'
                        paragraph
                      >
                        {event.description || 'Sem descrição disponível'}
                      </Typography>

                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                      >
                        <CalendarToday
                          sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }}
                        />
                        <Typography variant='body2' color='text.secondary'>
                          {formatDate(event.eventDate)}
                        </Typography>
                      </Box>

                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                      >
                        <LocationOn
                          sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }}
                        />
                        <Typography variant='body2' color='text.secondary'>
                          {event.location}
                        </Typography>
                      </Box>

                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                      >
                        <Person
                          sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }}
                        />
                        <Typography variant='body2' color='text.secondary'>
                          {event.registrationCount || 0} inscritos
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {!eventPast && (
                          <>
                            {registered ? (
                              <Button
                                variant='outlined'
                                color='error'
                                size='small'
                                startIcon={<PersonRemove />}
                                onClick={() =>
                                  setSelectedEvent({
                                    ...event,
                                    action: 'unregister',
                                  })
                                }
                              >
                                Cancelar Inscrição
                              </Button>
                            ) : (
                              <Button
                                variant='contained'
                                size='small'
                                startIcon={<PersonAdd />}
                                onClick={() =>
                                  setSelectedEvent({
                                    ...event,
                                    action: 'register',
                                  })
                                }
                              >
                                Inscrever-se
                              </Button>
                            )}
                          </>
                        )}

                        <Button
                          variant='text'
                          size='small'
                          onClick={() =>
                            setSelectedEvent({ ...event, action: 'view' })
                          }
                        >
                          Ver Detalhes
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        <Dialog
          open={Boolean(selectedEvent)}
          onClose={() => setSelectedEvent(null)}
          maxWidth='sm'
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            },
          }}
        >
          {selectedEvent && (
            <>
              <DialogTitle sx={{ p: 3, pb: 1 }}>
                <Typography variant='h5' sx={{ fontWeight: 600 }}>
                  {selectedEvent.action === 'register' && 'Confirmar Inscrição'}
                  {selectedEvent.action === 'unregister' &&
                    'Cancelar Inscrição'}
                  {selectedEvent.action === 'view' && selectedEvent.name}
                </Typography>
              </DialogTitle>

              <DialogContent sx={{ p: 3, pt: 1 }}>
                {selectedEvent.action === 'register' && (
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <PersonAdd
                      sx={{ fontSize: 48, color: 'primary.main', mb: 2 }}
                    />
                    <Typography variant='h6' sx={{ mb: 1 }}>
                      Deseja se inscrever neste evento?
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      "{selectedEvent.name}"
                    </Typography>
                  </Box>
                )}

                {selectedEvent.action === 'unregister' && (
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <PersonRemove
                      sx={{ fontSize: 48, color: 'error.main', mb: 2 }}
                    />
                    <Typography variant='h6' sx={{ mb: 1 }}>
                      Cancelar sua inscrição?
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      "{selectedEvent.name}"
                    </Typography>
                  </Box>
                )}

                {selectedEvent.action === 'view' && (
                  <Box sx={{ py: 1 }}>
                    {selectedEvent.description && (
                      <Box sx={{ mb: 3 }}>
                        <Typography
                          variant='subtitle2'
                          sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}
                        >
                          Descrição
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          {selectedEvent.description}
                        </Typography>
                      </Box>
                    )}

                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant='subtitle2'
                        sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}
                      >
                        Data e Horário
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarToday
                          sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }}
                        />
                        <Typography variant='body2' color='text.secondary'>
                          {formatDate(selectedEvent.eventDate)}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant='subtitle2'
                        sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}
                      >
                        Local
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOn
                          sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }}
                        />
                        <Typography variant='body2' color='text.secondary'>
                          {selectedEvent.location}
                        </Typography>
                      </Box>
                    </Box>

                    <Box>
                      <Typography
                        variant='subtitle2'
                        sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}
                      >
                        Participantes
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Person
                          sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }}
                        />
                        <Typography variant='body2' color='text.secondary'>
                          {selectedEvent.registrationCount || 0} pessoa(s)
                          inscrita(s)
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
              </DialogContent>

              <DialogActions sx={{ p: 3, pt: 2, gap: 1 }}>
                <Button
                  onClick={() => setSelectedEvent(null)}
                  variant='outlined'
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 3,
                  }}
                >
                  {selectedEvent.action === 'view' ? 'Fechar' : 'Cancelar'}
                </Button>

                {selectedEvent.action === 'register' && (
                  <Button
                    onClick={() => handleRegister(selectedEvent.id)}
                    variant='contained'
                    startIcon={<PersonAdd />}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 500,
                      px: 3,
                    }}
                    disableElevation
                  >
                    Confirmar Inscrição
                  </Button>
                )}

                {selectedEvent.action === 'unregister' && (
                  <Button
                    onClick={() => handleUnregister(selectedEvent.id)}
                    variant='contained'
                    color='error'
                    startIcon={<PersonRemove />}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 500,
                      px: 3,
                    }}
                    disableElevation
                  >
                    Cancelar Inscrição
                  </Button>
                )}
              </DialogActions>
            </>
          )}
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Dashboard;
