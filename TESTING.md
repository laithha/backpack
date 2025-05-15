# Backpack API Testing Documentation

This document provides instructions on how to run and understand the unit tests for the Backpack API.

## Test Setup

The tests use the following technologies:
- Jest: JavaScript testing framework
- TypeScript: For type checking
- Next.js API route testing

## Running the Tests

To run the tests, use the following command:

```bash
npm test
```

To run tests in watch mode (tests will automatically re-run when files change):

```bash
npm run test:watch
```

## Test Structure

The tests are organized into the following categories:

### Database Operations Tests
Tests for the in-memory database operations:
- `getAll`: Retrieving all backpacks
- `getById`: Retrieving a specific backpack
- `getFiltered`: Filtering backpacks based on properties
- `getSorted`: Sorting backpacks
- `addBackpack`: Adding a new backpack
- `updateBackpack`: Updating an existing backpack
- `deleteBackpack`: Deleting a backpack
- `resetDatabase`: Resetting the database to its initial state

### API Endpoint Tests
Tests for the REST API endpoints:
- `GET /api/backpacks`: Retrieving all backpacks with optional filtering and sorting
- `POST /api/backpacks`: Creating a new backpack
- `GET /api/backpacks/[id]`: Retrieving a specific backpack
- `PATCH /api/backpacks/[id]`: Updating a specific backpack
- `DELETE /api/backpacks/[id]`: Deleting a specific backpack

## Test Coverage

The tests cover:
- Successful operations
- Error handling (invalid inputs, non-existent items)
- Data validation
- Database state verification after operations

## Mocking Strategy

The tests use mocking strategies:
- `createMockRequest`: A utility function to create Next.js API requests for testing
- No external dependencies need to be mocked since we're using an in-memory database

## Adding New Tests

When adding new functionality to the API, follow these guidelines to add tests:
1. Add tests for the database operation first
2. Add tests for the API endpoint that uses the operation
3. Verify both success and error cases
4. Verify that the database state is as expected after operations 