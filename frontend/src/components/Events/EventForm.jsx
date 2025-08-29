import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { eventsAPI } from '../../services/api';

const EventForm = ({ open, event, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    eventDate: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (event) {
      const eventDate = new Date(event.eventDate);

      const timeZoneOffset = eventDate.getTimezoneOffset() * 60000;
      const localDate = new Date(eventDate.getTime() - timeZoneOffset);
      const formattedDate = localDate.toISOString().slice(0, 16);

      setFormData({
        name: event.name || '',
        description: event.description || '',
        eventDate: formattedDate,
        location: event.location || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        eventDate: '',
        location: '',
      });
    }
    setError('');
  }, [event]);

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

    try {
      const newFieldErrors = {};

      if (!formData.name.trim()) {
        setError('Nome do evento é obrigatório');
        newFieldErrors.name = true;
      } else if (formData.name.trim().length < 2) {
        setError('Nome do evento deve ter pelo menos 2 caracteres');
        newFieldErrors.name = true;
      } else if (formData.name.trim().length > 255) {
        setError('Nome do evento deve ter no máximo 255 caracteres');
        newFieldErrors.name = true;
      }

      if (!formData.eventDate) {
        setError('Data do evento é obrigatória');
        newFieldErrors.eventDate = true;
      } else {
        const eventDate = new Date(formData.eventDate);
        if (isNaN(eventDate.getTime())) {
          setError('Data do evento inválida');
          newFieldErrors.eventDate = true;
        } else if (eventDate <= new Date()) {
          setError('Data do evento deve ser futura');
          newFieldErrors.eventDate = true;
        }
      }

      if (!formData.location.trim()) {
        setError('Local do evento é obrigatório');
        newFieldErrors.location = true;
      } else if (formData.location.trim().length < 2) {
        setError('Local deve ter pelo menos 2 caracteres');
        newFieldErrors.location = true;
      } else if (formData.location.trim().length > 255) {
        setError('Local deve ter no máximo 255 caracteres');
        newFieldErrors.location = true;
      }

      if (Object.keys(newFieldErrors).length > 0) {
        setFieldErrors(newFieldErrors);
        return;
      }

      // Envia a data como ISO string (o input datetime-local já está no timezone local)
      const eventData = {
        ...formData,
        eventDate: new Date(formData.eventDate).toISOString(),
      };

      let response;
      if (event) {
        response = await eventsAPI.update(event.id, eventData);
      } else {
        response = await eventsAPI.create(eventData);
      }

      if (response.success) {
        onSave();
        onClose();
      } else {
        setError(response.message || 'Erro ao salvar evento');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar evento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>{event ? 'Editar Evento' : 'Criar Novo Evento'}</DialogTitle>

      <Box component='form' onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            name='name'
            label='Nome do Evento'
            value={formData.name}
            onChange={handleChange}
            margin='normal'
            disabled={loading}
            error={fieldErrors.name}
          />

          <TextField
            fullWidth
            name='description'
            label='Descrição'
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            margin='normal'
            disabled={loading}
          />

          <TextField
            fullWidth
            name='eventDate'
            label='Data e Hora do Evento'
            type='datetime-local'
            value={formData.eventDate}
            onChange={handleChange}
            margin='normal'
            disabled={loading}
            error={fieldErrors.eventDate}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            fullWidth
            name='location'
            label='Local'
            value={formData.location}
            onChange={handleChange}
            margin='normal'
            disabled={loading}
            error={fieldErrors.location}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type='submit'
            variant='contained'
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : null}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default EventForm;
