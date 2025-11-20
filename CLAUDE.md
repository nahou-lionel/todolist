# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native todo list application built with Expo. The app features user authentication and todo list management, connecting to a GraphQL API backend at `http://graphql.unicaen.fr:4000`.

## Development Commands

**Note**: All commands require `NODE_OPTIONS=--openssl-legacy-provider` environment variable due to legacy OpenSSL compatibility requirements.

```bash
# Start development server
npm start

# Start on specific platforms
npm run android
npm run ios
npm run web
```

## Architecture

### State Management
The application uses React Context API for global state management:
- **TokenContext**: Stores authentication token (null when logged out)
- **UsernameContext**: Stores the current user's username

Both contexts are defined in `Context/Context.js` and provided at the root level in `App.js`.

### Navigation Pattern
The app uses conditional navigation based on authentication state (`Navigation/Navigation.js`):

- **Unauthenticated** (token === null): Bottom tab navigator with SignIn and SignUp screens
- **Authenticated** (token !== null): Bottom tab navigator with Home, TodoLists, and SignOut screens

The navigation component consumes `TokenContext` to determine which navigation flow to display.

### GraphQL Integration
API calls are made to a GraphQL backend using fetch with POST requests. Example pattern from `components/SignIn.js`:

```javascript
fetch(API_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: GRAPHQL_QUERY_STRING,
    variables: { /* variables object */ }
  })
})
```

Error handling extracts errors from `jsonResponse.errors[0]` if present.

### Directory Structure
- `Screen/`: Screen components (one per route)
- `components/`: Reusable components and API interaction logic
- `Navigation/`: Navigation configuration
- `Context/`: Global state contexts
- `styles/`: Centralized style files and theme configuration
- `assets/`: Images and static resources

### Style Architecture
The application uses a modular style system with separation of concerns:

#### Theme System (`styles/theme.js`)
Centralized theme configuration containing:
- **Colors**:
  - Primary: `#5886fe` (buttons, active states)
  - Background: `#FFFFFF` (light theme)
  - Text: `#292929` (main text color)
  - Text Secondary: `#888` (subtitles)
  - Placeholder: `#AAAAAA`
  - Border: `#E8E8E8`
  - Error: `#ff6b6b`

- **Spacing**: Predefined spacing values (xs, sm, md, lg, xl, xxl)
- **Font Sizes**: Typography scale (small, regular, medium, large, xlarge, title)
- **Border Radius**: Consistent border radius values
- **Shadows**: Reusable shadow configurations
- **Common Styles**: Shared style objects for container, title, subtitle, input, button, etc.

#### Screen-Specific Styles
Each screen has its own style file in `styles/` directory:
- `SignInScreen.styles.js`
- `SignUpScreen.styles.js`
- `HomeScreen.styles.js`
- `TodoListsScreen.styles.js`
- `SignOutScreen.styles.js`
- `Navigation.styles.js`

These files import from `theme.js` to maintain consistency across the app.

#### Design Principles
- **Minimalist**: Clean, uncluttered interface
- **Light Theme**: White backgrounds with subtle borders
- **Consistent**: Reusable components and styles
- **No Headers**: Navigation uses `headerShown: false` for cleaner look
- **Styled Bottom Tabs**: Custom tab bar styling with primary color accents

## Key Implementation Details

1. Authentication flow is managed entirely through the `TokenContext` - setting token to non-null authenticates the user, setting to null logs them out
2. The API endpoint is hardcoded in component files (e.g., `components/SignIn.js:1`)
3. GraphQL queries are defined as template strings in the same files where they're used
4. Styles are externalized in the `styles/` directory and imported into screen components
5. To change the global theme, modify values in `styles/theme.js`
