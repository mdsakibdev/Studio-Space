# StudioSpace

A creative-space discovery and booking platform that connects creators with studio owners.

<p align="center">
  <img src="https://i.ibb.co/KjjNK7Ks/Studio-Spac.png" alt="StudioSpace Website Banner" width="100%" />
</p>

<p align="center">
  <a href="https://studio-spach.vercel.app/">
    <strong>View Live Website</strong>
  </a>
</p>

## About the Project

StudioSpace helps photographers, filmmakers, musicians, podcasters, and other creators discover creative spaces that fit their projects.

Users can explore studios, compare their details, and submit booking requests. Studio owners can list their spaces and manage their studio information and bookings.

**Live Demo:** https://studio-spach.vercel.app/

## Key Features

### Studio Discovery
- Browse available creative studios.
- Explore studios by category:
  - Photo Studios
  - Sound Stages
  - Podcast Rooms
  - Music Suites
  - Art Workshops
- View studio details, images, location, pricing, capacity, amenities, equipment, and availability.

### Booking
- Select a studio and provide booking details.
- View personal bookings.
- Cancel eligible bookings.

### Host Dashboard
- Add a new studio listing.
- Edit and manage personal studio listings.
- Add a cover image and gallery image URLs.
- Configure hourly rates and security deposits.
- Set maximum capacity and minimum booking duration.
- Add location, amenities, and equipment.
- Configure available days and opening/closing times.
- Set cancellation policies and studio rules.
- Add space highlights.
- Enable or disable instant booking.

### User Experience
- Responsive design for desktop, tablet, and mobile.
- Light and dark theme support.
- Toast notifications for user feedback.
- Reusable UI components.
- Protected account features.

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js (App Router) | Frontend Framework |
| React | UI Development |
| TypeScript | Type Safety |
| Tailwind CSS | Styling |
| Better Auth | Authentication |
| Express.js | Backend API |
| MongoDB | Database |
| JWT / JOSE | API Authentication |
| Sonner | Toast Notifications |
| Lucide React | Icons |
| Vercel | Deployment |

## Project Architecture

StudioSpace uses a separate frontend and backend architecture.

- **Frontend:** Next.js application.
- **Backend:** Express.js API.
- **Database:** MongoDB.
- **Authentication:** Better Auth.
- **Token Verification:** JWT with JOSE and JWKS.

Protected backend operations use the authenticated user's identity from the verified token. Ownership checks are enforced by the backend rather than trusting identity details sent by the client.

## Main Pages

- Home
- Explore Studios
- Studio Details
- How It Works
- About Us
- Add New Studio
- Edit Studio
- My Studios
- Booking Flow
- My Bookings

## Environment Variables

Create a `.env.local` file in the frontend project root:

```env
NEXT_PUBLIC_API_URL=YOUR_BACKEND_API_BASE_URL