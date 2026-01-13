# ReportAI Sign-In Page

A modern, responsive sign-in page built with React, TypeScript, and Tailwind CSS, inspired by LeetCode's design.

## Features

- 🎨 **Modern UI Design** - Clean, professional interface matching LeetCode's aesthetic
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices
- 🌙 **Dark Mode Support** - Built-in dark mode styling
- ✅ **Form Validation** - Client-side validation with error messages
- 🔐 **Password Visibility Toggle** - Show/hide password functionality
- 🔗 **Social Login Options** - Google, GitHub, and Facebook integration ready
- 🧩 **Component-Based Architecture** - Modular, reusable React components

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── Navbar.tsx      # Navigation bar with logo, links, and search
│   │   ├── SignIn.tsx      # Sign-in form component
│   │   └── Footer.tsx       # Footer with links and copyright
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles and Tailwind imports
├── STRUCTURE_ANALYSIS.md   # Detailed analysis of the original HTML structure
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.ts          # Vite build configuration
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Components

### Navbar
- Responsive navigation bar
- Logo and brand name
- Navigation links (Explore, Problems, Contest, Discuss)
- Dropdown menus (Interview, Store)
- Search bar (desktop)
- Mobile hamburger menu
- Premium button

### SignIn
- Username/Email input field
- Password input with visibility toggle
- Form validation
- Sign In button
- Forgot Password and Sign Up links
- Social login buttons (Google, GitHub, Facebook)

### Footer
- Copyright information
- Navigation links
- Region selector

## Styling

The project uses Tailwind CSS for styling with custom colors matching the LeetCode design:

- **Brand Orange**: `#FFA116`
- **Text Colors**: Primary and secondary text colors
- **Backgrounds**: Layer and overlay colors
- **Dark Mode**: Full dark mode support

## Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:

```javascript
colors: {
  'brand-orange': '#FFA116',
  // Add your custom colors
}
```

### Components
All components are in `src/components/` and can be easily modified or extended.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is for educational purposes.

## Notes

- The form currently logs to console on submit. Connect it to your authentication API.
- Social login links point to example URLs. Update them with your actual OAuth endpoints.
- Cloudflare Turnstile integration is not included but can be added if needed.
