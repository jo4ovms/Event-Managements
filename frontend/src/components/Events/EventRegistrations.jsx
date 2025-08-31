import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Person,
  Email,
  Close,
  Download,
  CalendarToday,
  LocationOn,
} from '@mui/icons-material';
import { eventsAPI } from '../../services/api';

const EventRegistrations = ({ open, event, onClose }) => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadRegistrations = React.useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await eventsAPI.getRegistrations(event.id);

      if (response.success) {
        setRegistrations(response.registrations || []);
      } else {
        setError('Erro ao carregar inscrições');
      }
    } catch {
      setError('Erro ao carregar inscrições');
    } finally {
      setLoading(false);
    }
  }, [event]);

  useEffect(() => {
    if (open && event) {
      loadRegistrations();
    }
  }, [open, event, loadRegistrations]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const exportRegistrations = () => {
    if (registrations.length === 0) return;

    const csvContent = [
      'Nome,Email,Data de Inscrição',

      ...registrations.map(
        (reg) =>
          `"${reg.user.name}","${reg.user.email}","${formatDate(
            reg.registeredAt
          )}"`
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `inscricoes_${event.name.replace(/\s+/g, '_')}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!event) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='md'
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        },
      }}
    >
      <DialogTitle sx={{ p: 3, pb: 2 }}>
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='flex-start'
        >
          <Box>
            <Typography variant='h5' sx={{ fontWeight: 600, mb: 1 }}>
              Participantes
            </Typography>
            <Typography
              variant='body1'
              color='text.secondary'
              sx={{ fontWeight: 500 }}
            >
              {event.name}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {registrations.length} pessoa(s) inscrita(s)
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {registrations.length > 0 && (
              <Tooltip title='Exportar lista (CSV)'>
                <IconButton
                  onClick={exportRegistrations}
                  sx={{
                    bgcolor: 'primary.50',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.100',
                    },
                  }}
                >
                  <Download />
                </IconButton>
              </Tooltip>
            )}
            <IconButton
              onClick={onClose}
              sx={{
                bgcolor: 'grey.100',
                '&:hover': {
                  bgcolor: 'grey.200',
                },
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3, pt: 0 }}>
        <Box
          mb={3}
          p={3}
          sx={{
            bgcolor: 'grey.50',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'grey.200',
          }}
        >
          <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 2 }}>
            Informações do Evento
          </Typography>
          <Box display='flex' alignItems='center' mb={1.5}>
            <CalendarToday
              sx={{ fontSize: 18, mr: 1.5, color: 'primary.main' }}
            />
            <Typography variant='body2' sx={{ fontWeight: 500 }}>
              {formatDate(event.eventDate)}
            </Typography>
          </Box>
          <Box display='flex' alignItems='center'>
            <LocationOn sx={{ fontSize: 18, mr: 1.5, color: 'primary.main' }} />
            <Typography variant='body2' color='text.secondary'>
              {event.location}
            </Typography>
          </Box>
        </Box>

        {loading ? (
          <Box display='flex' justifyContent='center' py={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : registrations.length === 0 ? (
          <Box textAlign='center' py={6}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'grey.100',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <Person sx={{ fontSize: 40, color: 'text.secondary' }} />
            </Box>
            <Typography variant='h6' sx={{ fontWeight: 600, mb: 1 }}>
              Nenhum participante inscrito
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Ainda não há inscrições para este evento.
            </Typography>
          </Box>
        ) : (
          <Box>
            {registrations.map((registration) => (
              <Box
                key={registration.id}
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  borderRadius: 2,
                  mb: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'primary.50',
                  },
                }}
              >
                <Box display='flex' alignItems='flex-start' gap={2}>
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      width: 44,
                      height: 44,
                      fontSize: '1rem',
                      fontWeight: 600,
                    }}
                  >
                    {registration.user.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box display='flex' alignItems='center' gap={1} mb={1}>
                      <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                        {registration.user.name}
                      </Typography>
                      {registration.user.isAdmin && (
                        <Chip
                          label='Admin'
                          size='small'
                          sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            fontSize: '0.7rem',
                            height: 20,
                          }}
                        />
                      )}
                    </Box>
                    <Box display='flex' alignItems='center' mb={0.5}>
                      <Email
                        sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }}
                      />
                      <Typography variant='body2' color='text.secondary'>
                        {registration.user.email}
                      </Typography>
                    </Box>
                    <Typography variant='caption' color='text.secondary'>
                      Inscrito em: {formatDate(registration.registeredAt)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          width='100%'
        >
          <Typography
            variant='body2'
            color='text.secondary'
            sx={{ fontWeight: 500 }}
          >
            Total: {registrations.length} participante(s)
          </Typography>
          <Button
            onClick={onClose}
            variant='contained'
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              px: 3,
            }}
            disableElevation
          >
            Fechar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EventRegistrations;
