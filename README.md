# Product List API

A comprehensive e-commerce API built with Node.js, Express, TypeScript, and MongoDB. This API provides full functionality for product management, user authentication, shopping cart, and order processing.

## Features

- **User Authentication**: JWT-based authentication with registration and login
- **Product Management**: Create, read, update, and delete products with pagination and filtering
- **Shopping Cart**: Add/remove products, update quantities, and bulk operations
- **Order Management**: Create orders from cart, view order history, and update order status
- **Validation**: Joi-based input validation for all endpoints
- **Security**: Password hashing, JWT tokens, and authentication middleware

## Tech Stack

- **Backend**: Node.js, Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Password Security**: bcryptjs

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get authenticated user's profile

### Products

- `GET /api/products` - Get all products (supports pagination, filtering, search)
- `GET /api/products/:id` - Get a specific product
- `POST /api/products` - Create a new product
- `PUT /api/products` - Update a product
- `DELETE /api/products` - Delete a product

### Cart

- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add product to cart
- `POST /api/cart/bulk-add` - Add multiple products to cart
- `POST /api/cart/remove` - Remove product from cart
- `PUT /api/cart/update` - Update product quantity
- `DELETE /api/cart/clear` - Clear entire cart

### Orders

- `POST /api/orders` - Create order from cart
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get specific order
- `PUT /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id/cancel` - Cancel order

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB instance
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```
   DB_URL
   JWT_SECRET
   PORT
   ```

4. Build the project:

   ```bash
   npm run build
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. For production:
   ```bash
   npm start
   ```

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── interfaces/      # TypeScript interfaces
├── middleware/      # Express middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions
├── validation/      # Joi validation schemas
├── app.ts           # Express app configuration
└── server.ts        # Server entry point
```

## Environment Variables

- `DB_URL` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token generation
- `PORT` - Server port (default: 3000)

## Validation

All endpoints use Joi validation schemas to ensure data integrity. Validation errors are returned with descriptive messages and appropriate HTTP status codes.

## Authentication

Most endpoints require authentication via JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

The API provides consistent error responses with:

- Appropriate HTTP status codes
- Descriptive error messages
- Consistent JSON response format

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
