const { EntitySchema } = require('typeorm');
const bcrypt = require('bcryptjs');

class User {
  constructor() {
    this.id = undefined;
    this.name = '';
    this.email = '';
    this.password = '';
    this.isAdmin = false;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  async validatePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

const UserSchema = new EntitySchema({
  name: 'User',
  target: User,
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
    email: {
      type: 'varchar',
      length: 255,
      nullable: false,
      unique: true,
    },
    password: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    isAdmin: {
      type: 'boolean',
      default: false,
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
    events: {
      type: 'one-to-many',
      target: 'Event',
      inverseSide: 'createdBy',
    },
    registrations: {
      type: 'one-to-many',
      target: 'Registration',
      inverseSide: 'user',
    },
  },
});

module.exports = UserSchema;
