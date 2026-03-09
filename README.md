# API Gestão TI - Node.js Backend

A Node.js backend application built with Express.js and Sequelize ORM for relational database management.

## Features

- **Express.js** framework for routing and middleware
- **Sequelize ORM** for database abstraction and migrations
- **PostgreSQL** support (configurable for MySQL)
- **Error handling** middleware
- **CORS** support for cross-origin requests
- **Security headers** with Helmet
- **Environment configuration** with dotenv

## Project Structure

```
src/
├── config/
│   └── database.js          # Database connection configuration
├── controllers/
│   └── UserController.js    # Business logic for User model
├── middleware/
│   └── errorHandler.js      # Error handling middleware
├── models/
│   └── User.js              # User database model
├── routes/
│   └── index.js             # API route definitions
└── server.js                # Application entry point
```

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher) or MySQL
- npm or yarn

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Edit `.env` file with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=gestao_ti_db
   PORT=3000
   NODE_ENV=development
   ```

3. **Create database:**
   ```bash
   # Using PostgreSQL
   createdb gestao_ti_db
   ```

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Health Check
- `GET /health` - Check server status

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### User Request Body (POST/PUT)
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

## Database Configuration

The application uses Sequelize ORM with the following configuration options:

- **Database**: PostgreSQL (configurable)
- **Host**: Localhost or remote server
- **Models**: Auto-sync on server start
- **Timestamps**: Automatic created/updated tracking

### Adding New Models

1. Create a new file in `src/models/`
2. Define the model using Sequelize DataTypes
3. Sync automatically on server start

Example:
```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
  },
}, {
  tableName: 'products',
  timestamps: true,
});

module.exports = Product;
```

## Dependencies

- **express** - Web framework
- **sequelize** - ORM for database
- **pg** - PostgreSQL driver
- **cors** - Cross-origin resource sharing
- **helmet** - Security headers
- **dotenv** - Environment variables

### Development Dependencies

- **nodemon** - Auto-reload on file changes

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists

### Port Already in Use
- Change PORT in `.env`
- Or kill existing process on that port

### Module Not Found
- Run `npm install` again
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

## Next Steps

1. Extend models for your business requirements
2. Add more controllers and routes
3. Implement input validation
4. Add authentication/authorization
5. Configure database migrations
6. Add logging and monitoring

## License

MIT
