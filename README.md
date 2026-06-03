# WavyGo Frontend

A production-quality frontend prototype for **WavyGo**, an EV and bike rental platform. Built with React and Vite, the project focuses on responsive design, smooth user experience, and a backend-ready architecture that allows seamless API integration with minimal frontend changes.

## Project Overview

WavyGo enables users to discover, browse, and rent vehicles through a modern and intuitive interface. This version is a frontend-only implementation using mock data, designed specifically for backend handoff and future REST API integration.

## Key Features

### User Experience

* Fully responsive design (Mobile, Tablet, Desktop)
* Mobile-first UI with touch-friendly interactions
* Smooth page transitions and micro-animations
* Scroll reveal effects
* Interactive navigation and routing
* Loading skeleton states
* Toast notifications for user feedback

### Authentication

* Login page with validation
* Signup page with password strength indicator
* Terms & Conditions acceptance flow
* JWT-ready authentication utilities

### Vehicle Management

* Vehicle listing page
* Category-based filtering
* Availability indicators
* Loading states using skeleton cards

### Dashboard

* User profile overview
* Ride statistics
* Environmental impact metrics
* Empty booking states
* Animated counters

## Backend Integration Ready

This project was intentionally structured to minimize future backend integration effort.

### Centralized Mock Data

All temporary data is stored in:

```text
src/data/mockData.js
```

Backend developers can replace mock exports with API responses without modifying UI components.

### Dedicated Service Layer

```text
src/services/
├── apiClient.js
├── authService.js
├── vehicleService.js
└── userService.js
```

All future API communication is isolated in the service layer.

### Environment Configuration

```text
src/config/env.js
```

Supports:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_USE_MOCK_DATA=true
```

### JWT Authentication Ready

Authentication utilities are prepared for JWT integration:

```text
src/utils/auth.js
```

Supports:

* Token storage
* Token retrieval
* Logout handling
* Protected route checks

## Tech Stack

| Layer         | Technology      |
| ------------- | --------------- |
| Framework     | React + Vite    |
| Routing       | React Router v6 |
| Styling       | Vanilla CSS     |
| Animations    | Framer Motion   |
| Icons         | Lucide React    |
| Notifications | react-hot-toast |
| HTTP Client   | Axios           |
| Fonts         | Syne + DM Sans  |

## Project Structure

```text
wavygo-frontend/
├── public/
├── src/
│   ├── components/
│   ├── config/
│   ├── data/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── package.json
└── vite.config.js
```

## Available Routes

| Route      | Description        |
| ---------- | ------------------ |
| /          | Homepage           |
| /vehicles  | Vehicle Listings   |
| /login     | User Login         |
| /signup    | User Registration  |
| /terms     | Terms & Conditions |
| /dashboard | User Dashboard     |

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd wavygo-frontend
```

Install dependencies:

```bash
npm install
```

Create environment variables:

```bash
cp .env.example .env
```

Start development server:

```bash
npm run dev
```

## Production Build

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Backend Handoff Notes

Backend integration should only require modifications inside:

```text
src/services/
src/data/mockData.js
```

No component rewrites should be necessary.

Each service contains API integration placeholders and TODO comments indicating expected endpoints.

## Verification Checklist

* Responsive on 320px, 768px, and 1440px screens
* All routes accessible
* Navigation fully functional
* Form validation implemented
* Vehicle filtering operational
* Scroll animations working
* No hardcoded business data inside components
* Environment configuration included
* API integration layer prepared

## Future Enhancements

* Real-time vehicle availability
* Booking system integration
* Payment gateway support
* Vendor dashboard
* Ride history and analytics
* Notifications and reminders
* Location-based vehicle discovery
