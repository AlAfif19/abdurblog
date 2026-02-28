# Portfolio Feature Documentation

## Overview

A modern, role-based portfolio landing page with admin content management system.

## Features

### User View (Public)
- **Hero Section**: Animated landing with call-to-action button
- **Projects Section**: Card-based project showcase with GitHub links
- **Skills Section**: Organized by category with progress indicators
- **Education Section**: Timeline-style education display
- **Contact Section**: Comprehensive contact information
- **Comments Section**: Visitor comments (admin-approved)
- **Footer**: Quick links and social media connections

### Admin View (Protected)
- **Hero Management**: Customize heading, subheading, CTA, and background
- **Projects Management**: Add, edit, delete projects with tags
- **Skills Management**: Organize skills by category and level
- **Education Management**: Manage educational background
- **Contact Management**: Update contact details
- **Comments Management**: Approve or delete visitor comments

## Design System

### Components Used
- **shadcn/ui**: Core UI components (Button, Card, Input, etc.)
- **Radix UI**: Accessible primitives for Dialog, Select, Tabs, Progress
- **Custom Motion Component**: Smooth animations and transitions
- **Lucide Icons**: Consistent iconography

### Design Principles
- **Clean Structure**: Organized sections with clear hierarchy
- **Consistent Design**: Unified color system and spacing
- **Smooth Interactions**: Animated transitions and hover effects
- **Visual Hierarchy**: Clear information architecture
- **Professional Appearance**: Modern, SaaS-ready aesthetics

## Installation & Setup

### 1. Database Migration

The portfolio feature requires new database tables. Run the following:

```bash
cd apps/api
npx prisma migrate dev --name add_portfolio_tables
npx prisma generate
```

### 2. API Integration

The portfolio routes are already integrated into `apps/api/src/index.ts` and `apps/api/src/portfolio.ts`.

### 3. Frontend Components

All UI components are located in:
- `apps/web/pages/portfolio.vue` - Public landing page
- `apps/web/pages/admin/portfolio.vue` - Admin management panel
- `apps/web/components/ui/` - Reusable UI components

## API Endpoints

### Public Endpoints

```
GET /api/portfolio/hero          - Get hero section data
GET /api/portfolio/projects      - Get all projects
GET /api/portfolio/skills        - Get all skills
GET /api/portfolio/education     - Get education history
GET /api/portfolio/contact       - Get contact info
GET /api/portfolio/comments      - Get approved comments
POST /api/portfolio/comments      - Submit new comment
```

### Admin Endpoints (Requires Admin Role)

```
PUT /api/portfolio/hero                    - Update hero section
POST /api/portfolio/projects              - Create project
PUT /api/portfolio/projects/:id           - Update project
DELETE /api/portfolio/projects/:id        - Delete project
POST /api/portfolio/skills                - Create skill
PUT /api/portfolio/skills/:id             - Update skill
DELETE /api/portfolio/skills/:id          - Delete skill
POST /api/portfolio/education             - Create education entry
PUT /api/portfolio/education/:id          - Update education entry
DELETE /api/portfolio/education/:id       - Delete education entry
PUT /api/portfolio/contact                - Update contact info
PUT /api/portfolio/comments/:id/approve   - Approve comment
DELETE /api/portfolio/comments/:id        - Delete comment
```

## Usage

### Accessing the Portfolio

1. **Public View**: Navigate to `http://localhost:3000/portfolio`
2. **Admin Panel**: Login as admin, then navigate to `http://localhost:3000/admin/portfolio`

### Managing Content

1. Login as an admin user
2. Go to the Portfolio Admin page
3. Use the tabs to manage different sections:
   - **Hero**: Update landing page content
   - **Projects**: Add/remove projects with GitHub links
   - **Skills**: Organize skills by category and level
   - **Education**: Add educational background
   - **Contact**: Update contact information
   - **Comments**: Approve or delete visitor comments

### Comment System

1. Visitors can submit comments via the public portfolio page
2. Comments are initially pending approval
3. Admins can approve or delete comments from the admin panel
4. Only approved comments are visible to the public

## Styling

### Customization

The portfolio uses CSS variables for theming. Customize in your global CSS:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... more variables */
}
```

### Animations

Smooth animations are handled by the custom `MotionDiv` component:
- Scroll-triggered animations
- Smooth transitions
- Micro-interactions

## Component Reference

### MotionDiv Component

Animated container for scroll-triggered animations:

```vue
<MotionDiv
  :initial="{ opacity: 0, y: 20 }"
  :animate="{ opacity: 1, y: 0 }"
  :transition="{ duration: 0.6 }"
>
  Content here
</MotionDiv>
```

### Card Component

Standard card layout:

```vue
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
</Card>
```

### Dialog Component

Modal dialogs for forms:

```vue
<Dialog v-model:open="isOpen">
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog Description</DialogDescription>
    </DialogHeader>
    <form>
      Form content
    </form>
  </DialogContent>
</Dialog>
```

## Security

- Admin routes are protected with JWT authentication
- Admin role verification on all management endpoints
- Comment approval system prevents spam
- CORS properly configured for API communication

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design for mobile, tablet, and desktop
- Accessible with keyboard navigation and screen readers

## Future Enhancements

Potential improvements:
- Image upload integration with MinIO
- Dark mode support
- Advanced filtering and search
- Analytics integration
- Email notifications for comments
- Multi-language support

## Troubleshooting

### Database Issues
```bash
# Regenerate Prisma client
cd apps/api
npx prisma generate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Component Import Issues
Make sure all UI components are properly exported in their `index.ts` files.

### Animation Issues
Check that the `MotionDiv` component is properly imported and used.

## Support

For issues or questions, refer to the main project documentation or create an issue in the repository.
