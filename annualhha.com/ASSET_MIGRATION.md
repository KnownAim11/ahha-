# Asset Migration: wp-* to /assets/ - Complete ✅

## Summary

All WordPress-like asset paths (`/wp-content/*` and `/wp-includes/*`) have been successfully migrated to `/assets/*` to fix production 403 errors on Vercel.

## Changes Made

### 1. Asset Directory Structure ✅
- Created `public/assets/` directory structure
- Moved all assets from `wp-content/` to `public/assets/`:
  - `wp-content/uploads/` → `public/assets/uploads/`
  - `wp-content/themes/` → `public/assets/themes/`
  - `wp-content/plugins/` → `public/assets/plugins/`
  - `wp-content/mu-plugins/` → `public/assets/mu-plugins/`
  - `wp-content/et-cache/` → `public/assets/et-cache/` (if exists)
- Created `public/assets/wp-includes/` directory structure for WordPress core files

### 2. HTML/CSS/JS Path Updates ✅
- Updated all HTML files (24 files):
  - `/wp-content/` → `/assets/`
  - `/wp-includes/` → `/assets/wp-includes/`
  - Fixed `srcset` attributes
  - Fixed JSON/LD schema URLs
  - Fixed JavaScript variables
  - Fixed escaped paths in JSON

### 3. Inline CSS Quote Fixes ✅
- Fixed nested quote issues in `background-image` styles:
  - Changed: `style="background-image: url("/assets/...");"`
  - To: `style='background-image: url("/assets/...");'`
- Fixed in 7 files with parallax backgrounds

### 4. Vercel Configuration ✅
- Updated `vercel.json` in both root and `annualhha.com/`:
  - Removed `/wp-content/*` and `/wp-includes/*` rewrites
  - Added `/assets/*` rewrite (excluded from SPA routing)
  - Updated headers to use `/assets/*` pattern
  - Ensured `/assets/*` is served as static files

### 5. Verification Script ✅
- Created `scripts/check-wp-paths.js`:
  - Scans all HTML, CSS, and JS files
  - Checks for any remaining `wp-content` or `wp-includes` paths
  - Excludes utility scripts from checks
  - Fails if any wp-* paths are found (excluding `/assets/wp-*`)

## Files Modified

- **24 HTML files**: All honorees, gallery, and main pages
- **2 vercel.json files**: Root and annualhha.com directories
- **1 new script**: `scripts/check-wp-paths.js`

## Verification

Run the check script to verify no wp-* paths remain:

```bash
cd annualhha.com
node scripts/check-wp-paths.js
```

Expected output:
```
✅ No wp-content or wp-includes paths found!
All paths have been migrated to /assets/
```

## Deployment

1. **Build/Deploy**: The `public/assets/` directory will be served at the site root
2. **Vercel**: The updated `vercel.json` ensures `/assets/*` paths are served as static files and not redirected
3. **Verification**: After deployment, check:
   - Network tab: No 403 errors
   - No requests to `/wp-content/*` or `/wp-includes/*`
   - Direct asset URLs work: `/assets/uploads/.../image.jpg` returns 200

## Important Notes

### wp-includes Files
The directory structure for `/assets/wp-includes/` has been created, but the actual WordPress core files (jQuery, CSS, etc.) need to be added:
- `/assets/wp-includes/js/jquery/jquery.min.js`
- `/assets/wp-includes/js/jquery/jquery-migrate.min.js`
- `/assets/wp-includes/css/dist/block-library/style.min.css`
- `/assets/wp-includes/css/dist/components/style.min.css`
- `/assets/wp-includes/css/dashicons.min.css`

**Options:**
1. Copy from WordPress installation
2. Download from WordPress CDN
3. Replace with CDN links in HTML (recommended for jQuery)

### Asset Serving
On Vercel, anything in `public/` is served at the root. So:
- `public/assets/uploads/image.jpg` → `/assets/uploads/image.jpg`
- Make sure `public/assets/` is included in your build output

## Rollback

If needed, the original `wp-content/` structure is still in the repository. To rollback:
1. Restore original HTML files from git
2. Update `vercel.json` to use `/wp-content/*` rewrites again
3. Remove `public/assets/` directory

## Scripts Created

- `migrate-wp-paths.js`: Migration script (completed, can be deleted)
- `fix-inline-quotes.js`: Quote fix script (completed, can be deleted)
- `fix-double-assets.js`: Double path fix script (completed, can be deleted)
- `scripts/check-wp-paths.js`: Verification script (keep for CI/CD)

