# Absinthe

Absinthe is a points management system designed to track and distribute points across various projects and users. It provides a user-friendly interface for managing points activities, distributing points, and retrieving wallet information.

## Features

- Points Distribution: Distribute points across multiple wallets in a single transaction.
- Wallet Information: Retrieve points balance and activity for individual wallets.
- Event-based Tracking: Associate points activities with specific events.
- API Integration: Utilizes a backend API for secure data management.

## Getting Started

1. Clone the repository:

```
git clone https://github.com/venkateshSV/absinthe.git
```

2. Navigate to the project directory:

```
cd absinthe
```

3. Install dependencies:

```
npm install
```

4. Start the development server:

```
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`.

## Project Structure

The Absinthe project follows Next.js conventions:

- `app`: Contains page components and layout files.
- `components`: Reusable UI components.
- `public`: Static assets.

## Usage

1. Home Page (`/`):

   - Enter or generate an API key.
   - Redirects to the Projects page upon successful authentication.

2. Projects Page (`/projects`):

   - Displays available projects associated with the API key.

3. Points Page (`/points`):
   - View points activities.
   - Distribute points across multiple wallets.
   - Check wallet balances and event-specific points.

## Technologies Used

- Frontend: React, Next.js
- Styling: Tailwind CSS
- State Management: React hooks
- Routing: Next.js routing
- API Integration: Custom backend API

## Contributing

Contributions are welcome! Please submit pull requests with clear descriptions of changes.
