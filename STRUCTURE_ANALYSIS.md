# LeetCode Sign-In Page Structure Analysis

## Overview
The LeetCode sign-in page consists of three main sections: Navbar, Sign-In Form, and Footer.

## Component Breakdown

### 1. Navbar Component
**Location**: Top of the page, fixed position
**Features**:
- LeetCode logo (SVG, responsive with dark mode variants)
- Navigation links:
  - Explore
  - Problems
  - Contest
  - Discuss
  - Interview (dropdown with: Online Interview, Assessment)
  - Store (dropdown with: Redeem, Premium)
- Search bar (expandable on larger screens)
- Premium button
- Mobile hamburger menu
- Responsive design (desktop/mobile variants)

**Key Classes**:
- `navbar-container`: Main container
- `display-none md:flex`: Hidden on mobile, visible on desktop
- `md:display-none`: Visible on mobile only

### 2. Sign-In Section
**Location**: Center of the page
**Components**:

#### Sign-In Form Container
- Centered layout with placeholder spacing
- Logo image
- Form wrapper

#### Form Fields
1. **Username/Email Input**
   - Placeholder: "Username or E-mail"
   - Autocomplete: "username"
   - Data attribute: `data-cy="username"`
   - Error message container below

2. **Password Input**
   - Type: password
   - Placeholder: "Password"
   - Autocomplete: "password"
   - Data attribute: `data-cy="password"`
   - Show/Hide password toggle button (eye icon)
   - Error message container below

3. **Cloudflare Turnstile** (hidden input)
   - Bot protection widget
   - Hidden input field with response token

4. **Sign In Button**
   - Primary button style
   - Data attribute: `data-cy="sign-in-btn"`
   - Text: "Sign In"

#### Actions Section
- "Forgot Password?" link
- "Sign Up" link (with data-cy attribute)

#### Social Login Section
- Text: "or you can sign in with"
- Icons/links for:
  - Google (SVG icon)
  - GitHub (SVG icon)
  - Facebook (SVG icon)
  - More options dropdown

### 3. Footer Component
**Location**: Bottom of the page
**Content**:
- Copyright: "Copyright © 2026 LeetCode"
- Navigation links:
  - Help Center
  - Jobs
  - Bug Bounty
  - Online Interview
  - Students
  - Terms
  - Privacy Policy
- Region selector (United States flag and text)

## Styling Patterns

### Color Scheme
- Primary brand color: `#FFA116` (orange)
- Text colors: `text-text-primary`, `text-text-secondary`
- Dark mode support: `dark:` prefix classes
- Background: `bg-layer-01`, `bg-overlay-3`

### Layout Patterns
- Constrained width containers: `max-w-[1200px]`
- Flexbox layouts: `flex items-center`
- Responsive spacing: Tailwind utility classes
- Fixed navbar: `fixed left-0 right-0 top-0`

### Form Styling
- Input fields: Rounded borders, padding
- Error messages: Conditional display with `data-is-error` attribute
- Button: Primary style with hover effects

## Responsive Breakpoints
- Mobile: Default (< 768px)
- Tablet/Desktop: `md:` prefix (≥ 768px)
- Large screens: `lg:` prefix (≥ 1024px)
- Extra large: `[@media(min-width:1180px)]` custom breakpoint

## Accessibility Features
- ARIA labels on buttons and links
- Semantic HTML structure
- Form autocomplete attributes
- Keyboard navigation support

## Interactive Elements
- Dropdown menus with hover states
- Password visibility toggle
- Form validation (error states)
- Social login buttons
- Mobile menu toggle
