const { EntitySchema } = require('typeorm');

class Event {
  constructor() {
    this.id = undefined;
    this.name = '';
    this.description = '';
    this.eventDate = new Date();
    this.location = '';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

const EventSchema = new EntitySchema({
  name: 'Event',
  target: Event,
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    name: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    description: {
      type: 'text',
      nullable: true,
    },
    eventDate: {
      type: 'timestamp',
      nullable: false,
    },
    location: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    createdAt: {
      type: 'timestamp',
      createDate: true,
    },
    updatedAt: {
      type: 'timestamp',
      updateDate: true,
    },
  },
  relations: {
    createdBy: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: { name: 'created_by_id' },
      nullable: false,
    },
    registrations: {
      type: 'one-to-many',
      target: 'Registration',
      inverseSide: 'event',
    },
  },
});

module.exports = EventSchema;
