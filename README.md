# Student Assignment Dashboard

A web application I built for managing student assignments with separate interfaces for students and professors. This was created as part of my internship application to demonstrate my frontend development skills.

## What it does

The dashboard has two main views:

**Student View:**
- See all your assignments in one place
- Track your progress with visual indicators  
- Submit assignments with a confirmation process (to avoid accidental submissions)
- Check due dates and assignment details
- Works great on mobile and desktop

**Professor View:**
- Create new assignments with Google Drive integration
- See which students have submitted their work
- Track class progress with charts and statistics
- Manage assignment details and deadlines

## How I built it

I used React with Vite because it's fast and modern. For styling, I went with Tailwind CSS since it lets me create custom designs quickly. The app uses React's Context API to manage state - no external libraries needed.

**Tech stack:**
- React 18 + Vite
- Tailwind CSS for styling
- Lucide React for icons
- Local storage for demo data persistence

## Project structure

```
src/
├── components/           # All React components
│   ├── Header.jsx       # Navigation bar with user switching
│   ├── StudentDashboard.jsx    # Main student interface
│   ├── AdminDashboard.jsx      # Professor interface  
│   ├── SubmissionModal.jsx     # Assignment submission popup
│   ├── CreateAssignmentModal.jsx  # New assignment form
│   └── LoadingSpinner.jsx      # Loading animation
├── context/
│   └── AppContext.jsx   # State management and mock data
├── App.jsx              # Main app component
├── main.jsx            # App entry point
└── index.css           # Global styles and Tailwind setup
```

## Running the project

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:5173 in your browser

## Demo features

Since this is a demo, I added some helpful features:

- **User switching**: Click on your profile in the header to switch between student and professor accounts
- **Sample data**: Pre-loaded with realistic assignments and submissions
- **Persistent state**: Your selected user stays the same when you refresh the page

## Design decisions

I focused on making the interface clean and intuitive. The color scheme uses blues and grays for a professional look, with green for success states and red for urgent items. 

The submission process has two confirmation steps to prevent accidental submissions - something I thought would be important in a real academic setting.

For responsiveness, I used a mobile-first approach. The layout adapts nicely from phone screens to large desktop monitors.


---

Thanks for checking out my project! I tried to make it both functional and visually appealing while keeping the code clean and maintainable.