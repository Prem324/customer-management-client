# Customer Management App - Client

This is the frontend React application for the Customer Management System. It provides a user interface for managing customer information and their addresses.

## Features

- **Dashboard**: Overview of customer statistics and recent activities
- **Customer Management**: Create, view, update, and delete customer information
- **Address Management**: Add, edit, and remove customer addresses
- **Search & Filter**: Find customers by name, phone number, or city

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── AddressForm   # Form for creating/editing addresses
│   ├── AddressList   # Display list of addresses
│   ├── CustomerForm  # Form for creating/editing customers
│   ├── CustomerList  # Display list of customers
│   └── Navigation    # App navigation bar
├── pages/            # Application pages
│   ├── Dashboard     # Main dashboard view
│   ├── CustomerListPage    # List of all customers
│   ├── CustomerDetailPage  # Detailed view of a customer
│   └── CustomerFormPage    # Create/edit customer form
├── services/         # API and service functions
│   └── api.js        # API client for backend communication
└── App.js           # Main application component with routing
```

## Technologies Used

- **React**: Frontend library for building user interfaces
- **React Router**: For navigation and routing
- **Axios**: HTTP client for API requests
- **CSS**: Styling components

## API Integration

The application communicates with the backend server using RESTful API endpoints. The API service is configured in `src/services/api.js`.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm test`

Launches the test runner in interactive watch mode

### `npm run build`

Builds the app for production to the `build` folder

## Getting Started

1. Ensure you have Node.js installed
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Make sure the backend server is running
