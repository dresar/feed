# Original User Request

## 2026-08-20T06:41:43Z

Building a complete Multi-User Authentication, Role-Based Access Control (Admin Panel vs User Portal), Token Quota Management (10 free generation credits per user), and Commercial Public SaaS Landing Page for Insta Prompt Forge.

Working directory: c:\Users\NCN0C\Downloads\instagram\insta-prompt-forge
Integrity mode: demo

## Requirements

### R1. Authentication & Role-Based Access Control (RBAC) in Neon PostgreSQL

- Implement clean, secure Email + Password authentication with HTTP-only session cookies and bcrypt password hashing.
- Tables in Neon DB: `users` (id, email, password_hash, name, role ['admin' | 'user'], tokens_balance, created_at) and `sessions` (id, user_id, expires_at).
- The first registered user (or designated admin email) automatically receives the `admin` role. All subsequent registrations receive the `user` role with an initial balance of 10 generation tokens.
- **Admin Role**: Full 100% control over `/settings` (API key vault, AI models), `/admin/users` (viewing all registered users, editing roles, topping up tokens), visual style manager, and logo manager.
- **User Role**: Has access to all 12 prompt generation engines, personal generation history, custom visual style creator, and custom brand logo uploader. Non-admin users are strictly blocked from viewing or modifying API keys or admin settings.

### R2. Token / Credit Quota Engine (10 Free Generation Tokens)

- Each registered standard user starts with 10 free generation credits.
- Every generation request (`/api/generate-prompt` and `/api/analyze-image`) verifies the user session and deducts 1 token atomically from Neon PostgreSQL.
- When `tokens_balance <= 0`, generation is prevented, returning a clear quota exceeded status and triggering a sleek "Beli / Top-Up Token" modal in the UI.
- Admins have unlimited generations and can top-up any user's balance via the Admin Panel.
- Display a live Token Badge in the Topbar / Sidebar for logged-in users (e.g. 🪙 10 Token Tersedia).

### R3. Public Landing Page & Auth Flow

- Create a modern, high-converting public landing page (`/`) showcasing the platform's 12 AI engines, visual samples, and pricing/token tiers with a prominent "Coba Gratis (Dapatkan 10 Token)" CTA.
- Modern `/login` and `/register` pages with form validation, error handling, and instant redirection to the studio dashboard upon successful authentication.
- Provide a smooth logout button in the user profile menu.

### R4. User Asset Isolation & Security

- Standard users can create, edit, and save their own Visual Styles and Brand Logos.
- API Key Vault and system configuration endpoints are strictly secured on the server side so that client users can never inspect or scrape LLM keys.

## Acceptance Criteria

### Authentication & Access Control

- [ ] Users can register with email + password, receive 10 initial tokens, and log in securely.
- [ ] Non-admin users attempting to access `/settings` or admin management routes are redirected or shown a 403 Forbidden alert.
- [ ] Admin panel allows administrators to view all registered users, adjust token balances, and manage API keys.

### Token Quota System

- [ ] Every successful prompt generation decrements the user's token balance in Neon PostgreSQL by 1.
- [ ] Users with 0 tokens cannot generate prompts and see an upgrade/top-up modal.
- [ ] Topbar displays real-time remaining tokens for the active user.

### Public Landing & Aesthetic Consistency

- [ ] Public landing page features high-fidelity hero section, engine cards, and clear login/register navigation matching the dark studio theme.
- [ ] Standard users can upload logos and create custom visual styles without restrictions.
