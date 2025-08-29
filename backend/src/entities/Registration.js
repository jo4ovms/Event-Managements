const { EntitySchema } = require('typeorm');

class Registration {
  constructor() {
    this.id = undefined;
    this.registeredAt = new Date();
  }
}

const RegistrationSchema = new EntitySchema({
  name: 'Registration',
  target: Registration,
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    registeredAt: {
      type: 'timestamp',
      createDate: true,
    },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: { name: 'user_id' },
      nullable: false,
    },
    event: {
      type: 'many-to-one',
      target: 'Event',
      joinColumn: { name: 'event_id' },
      nullable: false,
    },
  },
  uniques: [
    {
      name: 'UNIQUE_USER_EVENT',
      columns: ['user', 'event'],
    },
  ],
});

module.exports = RegistrationSchema;
