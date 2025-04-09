# Alten E-commerce Application

This is a full-stack e-commerce application built with Angular (frontend) and Node.js (backend).

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v18 or higher)

## Project Structure

```
alten-ecommerce/
├── backend/         # Node.js backend application
└── frontend/        # Angular frontend application
```

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Build the TypeScript code:
```bash
npm run build
```

4. Start the development server:
```bash
npm run dev
```

The backend server will be running at http://localhost:3000

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

The frontend application will be running at http://localhost:4200

## Available Scripts

### Backend Scripts

- `npm run build` - Compiles TypeScript to JavaScript
- `npm run dev` - Starts the development server with hot-reload
- `npm start` - Starts the production server

### Frontend Scripts

- `ng serve` - Starts the development server
- `ng build` - Builds the application for production
- `ng test` - Runs unit tests
- `ng e2e` - Runs end-to-end tests

## Features

- User authentication (login/register)
- Product listing and details
- Shopping cart management
- Wishlist functionality
- Contact form
- Responsive design

## API Endpoints

### Authentication
- POST /api/auth/account - Register a new user
- POST /api/auth/token - Login user
- GET /api/auth/me - Get current user profile

### Products
- GET /api/products - Get all products
- GET /api/products/:id - Get product by ID
- POST /api/products - Create new product (admin only)
- PUT /api/products/:id - Update product (admin only)
- DELETE /api/products/:id - Delete product (admin only)

### Cart
- GET /api/cart - Get user's cart
- POST /api/cart - Add item to cart
- PUT /api/cart/:id - Update cart item
- DELETE /api/cart/:id - Remove item from cart

### Wishlist
- GET /api/wishlist - Get user's wishlist
- POST /api/wishlist - Add item to wishlist
- DELETE /api/wishlist/:id - Remove item from wishlist

## Environment Variables

### Backend (.env)
```
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### Frontend (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License. 