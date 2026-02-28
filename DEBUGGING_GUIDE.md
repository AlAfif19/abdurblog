# Portfolio Debugging Guide

## Common Issues and Solutions

### Issue 1: Portfolio page shows nothing or blank screen

**Possible Causes:**
- Database tables not created
- API server not running
- Missing portfolio data
- Frontend errors

**Solutions:**

#### 1. Check if API server is running
```bash
# Test API health
curl http://localhost:3001/api/health

# Should return: {"status":"ok","timestamp":"..."}
```

#### 2. Check database tables exist
```bash
cd apps/api
npx prisma studio
```

Open Prisma Studio in your browser (usually http://localhost:5555) and check if the portfolio tables exist:
- PortfolioHero
- PortfolioProject
- PortfolioSkill
- PortfolioEducation
- PortfolioContact
- PortfolioComment

If tables don't exist, run:
```bash
cd apps/api
npx prisma migrate dev --name add_portfolio_tables
npx prisma generate
```

#### 3. Seed portfolio data
```bash
cd apps/api
npm run seed-portfolio
```

#### 4. Check browser console for errors
Open your browser's developer tools (F12) and check the Console tab for any JavaScript errors.

### Issue 2: API returns 404 or 500 errors

**Solution:**

#### Test portfolio API endpoints directly:
```bash
# Test hero endpoint
curl http://localhost:3001/api/portfolio/hero

# Test projects endpoint
curl http://localhost:3001/api/portfolio/projects

# Test skills endpoint
curl http://localhost:3001/api/portfolio/skills
```

#### Check API server logs:
Look at the terminal where the API server is running for any error messages.

### Issue 3: Frontend component errors

**Common Component Issues:**

1. **MotionDiv component not found**
   - Ensure `components/motion/MotionDiv.vue` exists
   - Check import statement in `pages/portfolio.vue`

2. **UI components missing**
   - Check that all UI components are in `components/ui/`
   - Verify each component has an `index.ts` export file

3. **Missing icons**
   - Ensure `lucide-vue-next` is installed
   - Check icon imports in the portfolio page

### Issue 4: Styles not loading

**Solution:**

#### Check Tailwind CSS is configured
- Verify `tailwind.config.ts` exists
- Ensure `@nuxtjs/tailwindcss` is installed
- Check that CSS variables are defined

#### Clear Nuxt cache
```bash
cd apps/web
rm -rf .nuxt
npm run dev
```

## Step-by-Step Debugging

### Step 1: Verify API Server
```bash
# Start API server
cd apps/api
npm run dev

# In another terminal, test the API
curl http://localhost:3001/api/health
```

Expected output:
```json
{"status":"ok","timestamp":"2024-01-01T12:00:00.000Z"}
```

### Step 2: Verify Database
```bash
cd apps/api
npx prisma studio
```

Check that all portfolio tables exist and have data.

### Step 3: Seed Data (if needed)
```bash
cd apps/api
npm run seed-portfolio
```

### Step 4: Start Web Server
```bash
cd apps/web
npm run dev
```

### Step 5: Test Portfolio Page
Navigate to: `http://localhost:3000/portfolio`

### Step 6: Check Browser Console
Open developer tools (F12) and look for errors.

## Quick Fixes

### Fix 1: Reset Database
```bash
cd apps/api
npx prisma migrate reset
npm run seed-portfolio
```

### Fix 2: Clear Caches
```bash
# Clear Nuxt cache
cd apps/web
rm -rf .nuxt

# Clear Node modules (if needed)
rm -rf node_modules package-lock.json
npm install
```

### Fix 3: Restart Servers
```bash
# Kill all Node processes
pkill -f "node"

# Start fresh
./start-full.bat
```

## Common Error Messages

### "Module not found"
**Solution:** Install missing dependencies
```bash
cd apps/web
npm install lucide-vue-next
```

### "Cannot read property of undefined"
**Solution:** Check that API responses match expected interface
- Verify API returns data
- Check data structure matches TypeScript interfaces

### "Network error"
**Solution:**
- Ensure API server is running
- Check CORS configuration
- Verify API URL in runtime config

### "Hydration mismatch"
**Solution:**
- Clear Nuxt cache
- Check for conditional rendering issues
- Verify server and client data consistency

## Testing Checklist

Before reporting issues, check:

- [ ] API server is running (`http://localhost:3001`)
- [ ] Web server is running (`http://localhost:3000`)
- [ ] Database tables exist
- [ ] Portfolio data is seeded
- [ ] No console errors in browser
- [ ] API endpoints return correct data
- [ ] All UI components are imported correctly
- [ ] Styles are loading properly

## Getting Help

If issues persist:

1. Check this guide first
2. Review console errors
3. Check server logs
4. Verify API responses
5. Test with a simple page

Create an issue with:
- Error messages
- Steps to reproduce
- Screenshots
- Console logs
- Server logs
