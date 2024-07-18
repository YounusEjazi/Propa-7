
# React Dashboard Application

This project is a React-based dashboard application designed to manage user and admin interfaces, display exercises, and track user progress. The application leverages several custom components and integrates with a backend server to fetch and manipulate data.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Components](#components)
  - [App](#app)
  - [Dashboard](#dashboard)
  - [UserDetails](#userdetails)
  - [UserHome](#userhome)
  - [AdminHome](#adminhome)
  - [Footer](#footer)
  - [CircularDeterminate](#circulardeterminate)
  - [Selectable](#selectable)
  - [SetDeadline](#setdeadline)
  - [Sidebar](#sidebar)
  - [Navbar](#navbar)
  - [Login](#login)
  - [ImageUpload](#imageupload)
  - [FeedbackPage](#feedbackpage)
  - [Feedback](#feedback)
  - [Materials](#materials)
  - [Help](#help)
  - [Exercises](#exercises)
  - [AddMaterialForm](#addmaterialform)
- [API Endpoints](#api-endpoints)
- [Backend Setup](#backend-setup)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:

   \```bash
   git clone https://github.com/your-username/react-dashboard-app.git
   cd react-dashboard-app
   \```

2. Install the dependencies:

   \```bash
   npm install
   \```

3. Start the development server:

   \```bash
   npm start
   \```

## Usage

Open your browser and navigate to `http://localhost:3000` to view the application.

## Components

### App

Located in `src/App.js`.

The `App` component is the root component that sets up the routing for the application and manages the navigation bar and sidebar visibility.

### Dashboard

Located in `src/components/dashboard.js`.

The `Dashboard` component is the main interface for users to view their progress, complete exercises, and access various sections such as the quiz and feedback.

### UserDetails

Located in `src/components/UserDetails.js`.

The `UserDetails` component fetches and displays detailed information about the user and provides a link to the `UserHome` component.

### UserHome

Located in `src/components/userHome.js`.

The `UserHome` component allows users to view and edit their profile information, including updating their profile picture.

### AdminHome

Located in `src/components/adminHome.js`.

The `AdminHome` component provides admin users with functionalities to search, view, and delete user records. It also includes a modal for confirming user deletions.

### Footer

Located in `src/components/Footer.jsx`.

The `Footer` component displays the footer section of the application.

### CircularDeterminate

Located in `src/components/CircularDeterminate.jsx`.

The `CircularDeterminate` component displays a circular progress indicator to show the completion status of exercises.

### Selectable

Located in `src/components/selectable.jsx`.

The `Selectable` component allows users to select various options.

### SetDeadline

Located in `src/components/setDeadline.jsx`.

The `SetDeadline` component allows users to set deadlines for their tasks or exercises.

### Sidebar

Located in `src/components/sidebar.jsx`.

The `Sidebar` component displays the sidebar navigation menu for the application.

### Navbar

Located in `src/components/navbar.jsx`.

The `Navbar` component displays the navigation bar for the application.

### Login

Located in `src/components/login_component.js`.

The `Login` component provides the login interface for users to authenticate themselves.

### ImageUpload

Located in `src/components/imageUpload.js`.

The `ImageUpload` component allows users to upload images and view uploaded images.

### FeedbackPage

Located in `src/components/feedbackPage.jsx`.

The `FeedbackPage` component provides the interface for users to view and submit feedback.

### Feedback

Located in `src/components/feedback.jsx`.

The `Feedback` component displays the feedback provided by users.

### Materials

Located in `src/components/Materials.js`.

The `Materials` component displays a list of supporting materials and allows users to add new materials.

### Help

Located in `src/components/Help.jsx`.

The `Help` component provides a help section for users.

### Exercises

Located in `src/components/Exercises.jsx`.

The `Exercises` component displays a list of exercises for users to complete.

### AddMaterialForm

Located in `src/components/AddMaterialForm.js`.

The `AddMaterialForm` component allows users to add new supporting materials.

## API Endpoints

The application communicates with a backend server to fetch and manipulate data. Below are some of the endpoints used:

- `POST /userData`: Fetches user data.
- `GET /get-exercises`: Fetches the list of exercises.
- `GET /getAllUser`: Fetches all users (for admin).
- `POST /deleteUser`: Deletes a user.
- `POST /update-user`: Updates user information.
- `POST /upload-profile-picture`: Uploads a new profile picture.
- `POST /login-user`: Authenticates a user.
- `GET /get-materials`: Fetches the list of supporting materials.
- `POST /add-materials`: Adds new supporting materials.
- `DELETE /delete-material`: Deletes a supporting material.
- `POST /upload-image`: Uploads an image.
- `POST /add-feedback`: Adds user feedback.
- `GET /get-feedback`: Fetches user feedback.
- `POST /add-predefined-area`: Adds a predefined area for exercises.
- `GET /get-predefined-areas/:exerciseId`: Fetches predefined areas for a specific exercise.
- `POST /add-deadline`: Adds a deadline for an exercise.
- `GET /get-deadlines`: Fetches all deadlines.

## Backend Setup

1. Navigate to the backend directory:

   \```bash
   cd backend
   \```

2. Install the backend dependencies:

   \```bash
   npm install
   \```

3. Create a `.env` file in the root of the backend directory and add the following environment variables:

   \```env
   PORT=3000
   MONGO_URL=your_mongodb_connection_string
   SECRET_KEY=your_jwt_secret_key
   ADMIN_SECRET_KEY=your_admin_secret_key
   \```

4. Start the backend server:

   \```bash
   node index.js
   \```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with your changes.

## License

