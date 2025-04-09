# Alten E-commerce Backend

This is the backend service for the Alten e-commerce application. It provides RESTful APIs for managing products, user authentication, shopping cart, and wishlist functionality.

## Features

- User authentication with JWT
- Product management (CRUD operations)
- Shopping cart functionality
- Wishlist management
- Role-based access control (Admin vs Regular users)

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   JWT_SECRET=your-super-secret-key-change-this-in-production
   ```

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

1. Build the application:
   ```bash
   npm run build
   ```
2. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication

- `POST /auth/account` - Register a new user
- `POST /auth/token` - Login and get JWT token

### Products

- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create a new product (Admin only)
- `PATCH /products/:id` - Update a product (Admin only)
- `DELETE /products/:id` - Delete a product (Admin only)

### Cart

- `GET /cart` - Get user's cart
- `PUT /cart` - Update cart
- `POST /cart/add` - Add item to cart
- `DELETE /cart/:productId` - Remove item from cart

### Wishlist

- `GET /wishlist` - Get user's wishlist
- `POST /wishlist/add` - Add item to wishlist
- `DELETE /wishlist/:productId` - Remove item from wishlist

## Data Structure

The application uses JSON files to store data:

- `products.json` - Product information
- `users.json` - User accounts
- `carts.json` - Shopping carts
- `wishlists.json` - User wishlists

## Security

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- CORS enabled
- Environment variables for sensitive data

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error 