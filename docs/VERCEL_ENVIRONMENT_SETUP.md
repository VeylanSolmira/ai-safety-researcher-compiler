# Vercel Environment Setup Guide

## Environment Variables

This application uses environment variables to control feature visibility and configuration between development and production environments.

### Required Environment Variables

#### 1. Database Usage (REQUIRED for production!)

```
NEXT_PUBLIC_USE_DATABASE_FOR_JOURNEY=true
NEXT_PUBLIC_USE_DATABASE_FOR_PROGRESS=true
NEXT_PUBLIC_USE_DATABASE_FOR_RESOURCES=true
```

**CRITICAL**: These MUST be set in Vercel production environment or content won't load!

#### 2. Development Tools Visibility

```
NEXT_PUBLIC_SHOW_DEV_TOOLS=true  # Local development only
```

This controls the visibility of:
- Database toggle button (bottom right corner)
- Development tools section on home page
- "(Development mode)" indicators
- View mode toggle in journey pages

**Important**: Do NOT set this in your Vercel production environment.

#### 3. Claude API (Optional)

```
ANTHROPIC_API_KEY=your-api-key-here
ANTHROPIC_MODEL=claude-3-5-haiku-20241022  # Optional, defaults to sonnet
```

### Setting Environment Variables in Vercel

1. **Go to your Vercel project dashboard**
2. **Navigate to Settings → Environment Variables**
3. **Add variables for each environment:**
   - Production: Only add `ANTHROPIC_API_KEY` if using AI features
   - Preview: You may add `NEXT_PUBLIC_SHOW_DEV_TOOLS=true` for testing
   - Development: Not needed (uses .env.local)

### Environment-Specific Configuration

| Variable | Local Dev | Preview | Production |
|----------|-----------|---------|------------|
| NEXT_PUBLIC_USE_DATABASE_FOR_JOURNEY | true | true | ✅ REQUIRED |
| NEXT_PUBLIC_USE_DATABASE_FOR_PROGRESS | true | true | ✅ REQUIRED |
| NEXT_PUBLIC_USE_DATABASE_FOR_RESOURCES | true | true | ✅ REQUIRED |
| NEXT_PUBLIC_SHOW_DEV_TOOLS | true | optional | ❌ Never |
| ANTHROPIC_API_KEY | optional | optional | optional |

### Local Development

The `.env.local` file is used for local development and is not committed to git. It should contain:

```bash
# Development Tools
NEXT_PUBLIC_SHOW_DEV_TOOLS=true

# Database Feature Flags
NEXT_PUBLIC_USE_DATABASE_FOR_JOURNEY=true
NEXT_PUBLIC_USE_DATABASE_FOR_PROGRESS=true
NEXT_PUBLIC_USE_DATABASE_FOR_RESOURCES=true

# Claude API (if needed)
ANTHROPIC_API_KEY=your-key-here
```

### Verifying Configuration

After deployment, verify that:
1. **Production**: No database toggle or dev tools visible
2. **Preview**: Dev tools visible only if explicitly enabled
3. **Local**: All dev tools available

### Security Notes

- Never commit `.env.local` to git
- API keys should only be added to Vercel's environment variables
- Use `NEXT_PUBLIC_` prefix only for client-visible variables
- Keep sensitive data in server-only variables (no prefix)