# Resource Exchange Portal

A comprehensive React application for managing resource requests and exchanges within an organization. Built with modern technologies including Azure AD SSO authentication, dynamic theming, and responsive design.

## Features

- **Azure AD SSO Authentication**: Secure login with Microsoft Azure Active Directory
- **Dynamic Theming**: Automatic dark/light mode switching based on time + manual toggle
- **Responsive Design**: Mobile-first approach with collapsible sidebar
- **Resource Management**: Dynamic forms for different resource types (Rope, Crane, Scaffolding, Manpower)
- **Workflow Management**: Request submission and action tracking system
- **Master Data Management**: Configuration and maintenance of system data

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Authentication**: MSAL.js (Microsoft Authentication Library)
- **Icons**: React Icons (Feather Icons)
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Routing**: React Router DOM

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Azure AD application registration (currently disabled for development)
- API backend (for authentication verification and data operations)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd resource-exchange-portal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables:
   ```env
   VITE_AZURE_CLIENT_ID=your-azure-client-id
   VITE_AZURE_TENANT_ID=your-azure-tenant-id
   VITE_AZURE_REDIRECT_URI=http://localhost:5173
   VITE_API_BASE_URL=https://your-api-endpoint.com
   ```
   
   **Note**: Azure AD configuration is currently commented out for development. The app will use a mock authentication system.

5. Start the development server:
   ```bash
   npm run dev
   ```

## Azure AD Setup

**Currently Disabled for Development**

1. Register a new application in Azure AD
2. Configure redirect URI: `http://localhost:5173` (for development)
3. Enable ID tokens in authentication settings
4. Note down the Client ID and Tenant ID
5. Configure API permissions if needed

## Application Structure

```
src/
├── components/
│   ├── Layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   └── ProtectedRoute.tsx
├── context/
│   ├── AuthContext.tsx
│   ├── ThemeContext.tsx
│   └── SidebarContext.tsx
├── pages/
│   ├── Login.tsx
│   ├── Home.tsx
│   ├── Request.tsx
│   ├── MyAction.tsx
│   └── MDM.tsx
├── types/
│   └── request.ts
└── config/
    └── msalConfig.ts
```

## Key Features

### Authentication Flow
- Azure AD SSO integration
- Automatic token refresh
- Secure API communication with JWT tokens
- Auto-login for returning users

**Development Mode**: Currently using mock authentication with a simulated user account for easier development and testing.

### Theme System
- Automatic dark mode after 7 PM
- Manual theme toggle
- Tata Steel blue (#00529B) color scheme
- Responsive design with proper contrast ratios

### Request Management
- Dynamic resource forms with add/remove rows
- Form validation and error handling
- Resource-specific column configurations
- Submission with toast notifications

### Action Management
- Filter and search functionality
- Modal-based action submission
- Status tracking with visual indicators
- Overdue request highlighting

## API Endpoints

The application expects the following API endpoints:

- `POST /api/auth/verify` - Verify Azure AD user and return JWT
- `POST /api/request/submit` - Submit new resource request
- `GET /api/request/my-actions` - Fetch user's assigned actions
- `POST /api/request/action-submit` - Submit action response

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Customization

1. **Colors**: Modify the Tailwind config for custom color schemes
2. **Resource Types**: Update `resourceColumns` in `Request.tsx`
3. **Workflows**: Extend the action flow in `MyAction.tsx`
4. **Authentication**: Modify MSAL config for different Azure AD setups

## Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Configure environment variables for production
3. Deploy the `dist` folder to your hosting platform
4. Update Azure AD redirect URIs for production domain

## Contributing

1. Follow the existing code structure
2. Maintain TypeScript strict mode
3. Use Tailwind CSS for styling
4. Write meaningful commit messages
5. Test authentication flows thoroughly

## License

This project is proprietary and confidential.