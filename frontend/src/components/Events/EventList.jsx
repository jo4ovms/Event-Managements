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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Fab,
} from '@mui/material';
import {
  Event,
  LocationOn,
  Person,
  Edit,
  Delete,
  Add,
  Group,
  Visibility,
} from '@mui/icons-material';
import { eventsAPI, registrationsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import EventForm from './EventForm';
import EventRegistrations from './EventRegistrations';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    event: null,
  });
  const [eventFormDialog, setEventFormDialog] = useState({
    open: false,
    event: null,
  });
  const [registrationsDialog, setRegistrationsDialog] = useState({
    open: false,
    event: null,
  });
  const [registrationLoading, setRegistrationLoading] = useState({});

  const { user } = useAuth();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getAll();
      if (response.success) {
        setEvents(response.events);
      } else {
        setError('Erro ao carregar eventos');
      }
    } catch {
      setError('Erro ao carregar eventos');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      const response = await eventsAPI.delete(deleteDialog.event.id);
      if (response.success) {
        setEvents(events.filter((e) => e.id !== deleteDialog.event.id));
        setDeleteDialog({ open: false, event: null });
      } else {
        setError('Erro ao deletar evento');
      }
    } catch {
      setError('Erro ao deletar evento');
    }
  };

  const handleRegisterToggle = async (eventId, isRegistered) => {
    try {
      setRegistrationLoading({ ...registrationLoading, [eventId]: true });

      let response;
      if (isRegistered) {
        response = await registrationsAPI.unregister(eventId);
      } else {
        response = await registrationsAPI.register(eventId);
      }

      if (response.success) {
        await loadEvents();
      } else {
        setError(response.message || 'Erro ao processar inscrição');
      }
    } catch {
      setError('Erro ao processar inscrição');
    } finally {
      setRegistrationLoading({ ...registrationLoading, [eventId]: false });
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

  const isUserRegistered = (event) => {
    return event.registrations?.some((reg) => reg.user.id === user?.id);
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

        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          mb={4}
        >
          <Box>
            <Typography
              variant='h4'
              component='h1'
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                mb: 1,
              }}
            >
              Eventos
            </Typography>
            <Typography
              variant='h6'
              color='text.secondary'
              sx={{ fontWeight: 400 }}
            >
              Descubra e participe de eventos incríveis
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {events.map((event) => {
            const isRegistered = isUserRegistered(event);
            const isPastEvent = new Date(event.eventDate) < new Date();
            const registrationCount = event.registrations?.length || 0;

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
                      borderColor: 'primary.main',
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
                      {user?.isAdmin && (
                        <Box>
                          <IconButton
                            size='small'
                            onClick={() =>
                              setRegistrationsDialog({ open: true, event })
                            }
                            title='Ver inscrições'
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            size='small'
                            onClick={() =>
                              setEventFormDialog({ open: true, event })
                            }
                            title='Editar evento'
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size='small'
                            color='error'
                            onClick={() =>
                              setDeleteDialog({ open: true, event })
                            }
                            title='Excluir evento'
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      )}
                    </Box>

                    <Typography
                      variant='body2'
                      color='text.secondary'
                      paragraph
                    >
                      {event.description}
                    </Typography>

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
                        Criado por: {event.createdBy.name}
                      </Typography>
                    </Box>

                    <Box
                      display='flex'
                      alignItems='center'
                      justifyContent='space-between'
                    >
                      <Box display='flex' alignItems='center'>
                        <Group
                          sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }}
                        />
                        <Typography variant='body2' color='text.secondary'>
                          {registrationCount} inscritos
                        </Typography>
                      </Box>

                      {isPastEvent && (
                        <Chip label='Finalizado' size='small' color='default' />
                      )}
                    </Box>
                  </CardContent>

                  <Box sx={{ p: 2, pt: 0 }}>
                    {user?.isAdmin && (
                      <Button
                        fullWidth
                        variant='outlined'
                        color='primary'
                        onClick={() =>
                          setRegistrationsDialog({ open: true, event })
                        }
                        startIcon={<Group />}
                        sx={{ mb: 1 }}
                      >
                        Ver Inscrições ({registrationCount})
                      </Button>
                    )}

                    {!isPastEvent && (
                      <Button
                        fullWidth
                        variant={isRegistered ? 'outlined' : 'contained'}
                        color={isRegistered ? 'error' : 'primary'}
                        onClick={() =>
                          handleRegisterToggle(event.id, isRegistered)
                        }
                        disabled={registrationLoading[event.id]}
                        startIcon={
                          registrationLoading[event.id] ? (
                            <CircularProgress size={16} />
                          ) : null
                        }
                      >
                        {registrationLoading[event.id]
                          ? 'Processando...'
                          : isRegistered
                          ? 'Cancelar Inscrição'
                          : 'Inscrever-se'}
                      </Button>
                    )}
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {events.length === 0 && !loading && (
          <Box textAlign='center' mt={4}>
            <Typography variant='h6' color='text.secondary'>
              Nenhum evento encontrado
            </Typography>
          </Box>
        )}

        {user?.isAdmin && (
          <Fab
            color='primary'
            aria-label='add'
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            onClick={() => setEventFormDialog({ open: true, event: null })}
          >
            <Add />
          </Fab>
        )}

        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, event: null })}
        >
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogContent>
            <Typography>
              Tem certeza que deseja excluir o evento "
              {deleteDialog.event?.name}"?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDeleteDialog({ open: false, event: null })}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteEvent}
              color='error'
              variant='contained'
            >
              Excluir
            </Button>
          </DialogActions>
        </Dialog>

        <EventForm
          open={eventFormDialog.open}
          event={eventFormDialog.event}
          onClose={() => setEventFormDialog({ open: false, event: null })}
          onSave={loadEvents}
        />

        <EventRegistrations
          open={registrationsDialog.open}
          event={registrationsDialog.event}
          onClose={() => setRegistrationsDialog({ open: false, event: null })}
        />
      </Container>
    </Box>
  );
};

export default EventList;
