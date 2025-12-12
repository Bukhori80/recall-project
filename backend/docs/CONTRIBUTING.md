# Contributing Guide

Thank you for considering contributing to RECALL Backend! This document provides guidelines and instructions for contributing to the project.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style Guide](#code-style-guide)
- [Git Workflow](#git-workflow)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)

---

## Code of Conduct

### Our Standards

- **Be Respectful:** Treat all contributors with respect
- **Be Collaborative:** Work together towards common goals
- **Be Professional:** Maintain professional behavior in all interactions
- **Be Inclusive:** Welcome contributions from developers of all skill levels

### Unacceptable Behavior

- Harassment or discriminatory language
- Personal attacks or trolling
- Publishing others' private information
- Unprofessional conduct

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (Atlas recommended)
- Git
- Code editor (VS Code recommended)

### Development Setup

1. **Fork the Repository**
```bash
# Click "Fork" on GitHub
git clone https://github.com/YOUR_USERNAME/recall-backend.git
cd recall-backend/backend
```

2. **Install Dependencies**
```bash
npm install
```

3. **Setup Environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start Development Server**
```bash
npm run dev
```

5. **Seed Database** (optional)
```bash
node seeder.js
```

---

## Development Workflow

### Branch Strategy

We use **Git Flow** model:

```
main (production-ready)
  ↑
develop (integration branch)
  ↑
feature/* (new features)
bugfix/* (bug fixes)
hotfix/* (urgent production fixes)
```

### Creating a Feature

1. **Create Branch from `develop`**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

2. **Make Changes**
- Write code
- Add tests
- Update documentation

3. **Commit Changes**
```bash
git add .
git commit -m "feat: add customer geolocation feature"
```

4. **Push to Your Fork**
```bash
git push origin feature/your-feature-name
```

5. **Create Pull Request**
- Go to GitHub
- Create PR from your branch to `develop`
- Fill in PR template

---

## Code Style Guide

### JavaScript Style

We follow **Airbnb JavaScript Style Guide** with ES Modules.

#### Naming Conventions

```javascript
// Variables and functions: camelCase
const customerData = {...};
function getCustomerById(id) {...}

// Classes and Constructors: PascalCase
class CustomerService {...}

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;

// Private properties: _prefixed (by convention)
const _privateMethod = () => {...};

// File names: kebab-case or camelCase
// customer.service.js or customerService.js
```

#### Code Formatting

**Indentation:** 2 spaces (no tabs)

**Quotes:** Single quotes for strings
```javascript
const message = 'Hello world';
```

**Semicolons:** Use semicolons
```javascript
const result = await getCustomer();
```

**Arrow Functions:** Prefer arrow functions for callbacks
```javascript
customers.map(customer => customer.id);
```

**Async/Await:** Prefer async/await over promises
```javascript
// Good
const data = await fetchData();

// Avoid
fetchData().then(data => {...});
```

**Destructuring:** Use when appropriate
```javascript
// Good
const { username, email } = customer;

// Avoid
const username = customer.username;
const email = customer.email;
```

#### Imports

**Order:**
1. Node built-ins
2. External packages
3. Internal modules

```javascript
// Node built-ins
import path from 'path';
import fs from 'fs';

// External packages
import express from 'express';
import mongoose from 'mongoose';

// Internal modules
import Customer from '../models/Customer.js';
import { protect } from '../middlewares/auth.middleware.js';
```

### ESLint Configuration (Recommended)

Create `.eslintrc.json` in backend root:
```json
{
  "env": {
    "node": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "indent": ["error", 2],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "no-unused-vars": "warn",
    "no-console": "off"
  }
}
```

Install ESLint:
```bash
npm install --save-dev eslint
```

Run linting:
```bash
npx eslint src/
```

---

## Git Workflow

### Commit Message Format

Follow **Conventional Commits** specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

**Examples:**
```bash
feat(customer): add geolocation tracking

- Added location field to Customer model
- Implemented nearby customers query
- Created 2dsphere index for geospatial queries

Closes #123
```

```bash
fix(auth): resolve JWT expiration issue

- Fixed token expiration calculation
- Updated JWT_EXPIRES_IN handling

Fixes #456
```

```bash
docs(api): update authentication documentation

- Added cURL examples for all auth endpoints
- Clarified JWT token format
```

### Branch Naming

```bash
feature/customer-geolocation
bugfix/jwt-expiration-error
hotfix/critical-security-patch
docs/update-api-documentation
refactor/simplify-recommendation-logic
```

---

## Testing Guidelines

### Manual Testing

Before submitting PR, test:

1. **Start Server**
```bash
npm run dev
```

2. **Test API Endpoints**
   - Use Swagger UI: http://localhost:3001/api-docs
   - Or use Postman/Insomnia
   - Or use cURL

3. **Test New Features**
   - Happy path (success scenarios)
   - Error cases (invalid input, missing auth, etc.)
   - Edge cases

### Writing Tests (Future)

When we add automated testing, follow these patterns:

**Test Structure:**
```javascript
// customer.test.js
import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';

describe('Customer API', () => {
  describe('GET /customers', () => {
    it('should return all customers', async () => {
      const res = await request(app)
        .get('/api/v1/customers')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal('success');
    });

    it('should return 401 without auth token', async () => {
      const res = await request(app).get('/api/v1/customers');
      expect(res.status).to.equal(401);
    });
  });
});
```

**Coverage:**
- Unit tests: Test individual functions
- Integration tests: Test API endpoints
- E2E tests: Test complete workflows

---

## Documentation

### Code Comments

**When to Comment:**
- Complex logic that isn't immediately clear
- Business rules or domain knowledge
- Workarounds or hacks (with explanation)
- Public API functions (JSDoc)

**JSDoc Example:**
```javascript
/**
 * Find customers within a specified radius
 * @param {number} longitude - Center point longitude
 * @param {number} latitude - Center point latitude
 * @param {number} maxDistance - Maximum distance in meters
 * @returns {Promise<Array>} Array of nearby customers
 */
export const findNearbyCustomers = async (longitude, latitude, maxDistance) => {
  // Implementation
};
```

**Avoid:**
- Obvious comments
```javascript
// Bad: Comment states the obvious
const total = price + tax; // Add price and tax

// Good: Comment explains WHY
const total = price + tax; // Tax is included to comply with regulation XYZ
```

### Updating Documentation

When adding features, update:

1. **README.md** - If adding major feature
2. **API_DOCUMENTATION.md** - For new endpoints
3. **ARCHITECTURE.md** - For architectural changes
4. **Swagger spec** - For API changes

---

## Pull Request Process

### Before Submitting PR

- [ ] Code follows style guide
- [ ] All new endpoints are tested
- [ ] Documentation is updated
- [ ] Commit messages follow convention
- [ ] No merge conflicts with `develop`
- [ ] Sensitive data is not committed (keys, passwords)

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
How was this tested?

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows project style
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No console errors

## Related Issues
Closes #issue_number
```

### PR Review Process

1. **Automated Checks** (future)
   - Linting passes
   - Tests pass
   - Build succeeds

2. **Code Review**
   - At least 1 approval required
   - Address reviewer comments
   - Update PR as needed

3. **Merge**
   - Squash and merge (for clean history)
   - Delete branch after merge

---

## Issue Reporting

### Bug Reports

Use this template:

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g. Windows 11]
- Node Version: [e.g. 18.16.0]
- Browser (if applicable): [e.g. Chrome 120]

## Screenshots
If applicable

## Additional Context
Any other relevant information
```

### Feature Requests

```markdown
## Feature Description
Clear description of the proposed feature

## Use Case
Why is this feature needed?

## Proposed Solution
How would you implement this?

## Alternatives Considered
Other approaches you've thought of

## Additional Context
Any other relevant information
```

---

## Project Structure

When adding new files, follow this structure:

```
backend/
├── src/
│   ├── api/v1/
│   │   ├── controllers/    # Add new controller here
│   │   ├── services/       # Add new service here
│   │   ├── routes/         # Add new routes here
│   │   └── middlewares/    # Add new middleware here
│   ├── models/             # Add new models here
│   ├── utils/              # Add utilities here
│   └── config/             # Configuration files
├── docs/                   # Documentation
├── tests/                  # Test files (future)
└── README.md
```

---

## Best Practices

### Security

- **Never Commit Secrets:** Use `.env` for sensitive data
- **Validate Input:** Always validate and sanitize user input
- **Use Parameterized Queries:** Prevent SQL/NoSQL injection
- **Rate Limiting:** Implement to prevent abuse (future)
- **HTTPS Only:** In production, reject HTTP requests

### Performance

- **Pagination:** Always paginate large datasets
- **Indexing:** Use database indexes for frequently queried fields
- **Caching:** Cache static or rarely-changing data (future)
- **Async Operations:** Use async/await for I/O operations
- **Lean Queries:** Use `.lean()` for read-only queries

### Error Handling

```javascript
// Good: Specific error messages
if (!customer) {
  throw new Error('Customer not found');
}

// Bad: Generic error
if (!customer) {
  throw new Error('Error');
}
```

```javascript
// Good: Try-catch for async operations
try {
  const customer = await Customer.findById(id);
  return customer;
} catch (error) {
  console.error('Error fetching customer:', error);
  throw error;
}
```

---

## Communication

### Getting Help

- **Documentation:** Check README, API docs, Architecture docs
- **Issues:** Search existing issues before creating new
- **Discussions:** Use GitHub Discussions for questions

### Asking Questions

**Good Question:**
```
I'm trying to implement geolocation for customers. I've added the 
location field to the model, but the 2dsphere index isn't working. 
Here's my code: [code snippet]. What am I missing?
```

**Unclear Question:**
```
Geolocation doesn't work. Help!
```

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort!

For questions or clarifications, feel free to:
- Open an issue
- Start a discussion
- Contact the maintainers

---

**Last Updated:** December 2025
