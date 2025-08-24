# Page Movement System - Usage Examples

This document demonstrates how to use the new centralized page registry system to easily move pages between sections.

## Quick Start: Moving a Page

To move a page from one section to another, simply edit the `section` field in `src/data/pageRegistry.ts`:

### Example: Moving VPB Couchbase Document Runbook

**Before** (currently in VPB section):
```typescript
{
  id: 'vpb-runbooks-couchbase-document-edit',
  name: 'How to Edit a VPB Couchbase Document',
  route: '/virtualpitboss/runbooks/couchbase-document-edit',
  component: 'VPBCouchbaseDocumentRunbook',
  section: 'virtualpitboss',    // ← Currently here
  category: 'runbooks',
  order: 1
}
```

**After** (moved to Games section):
```typescript
{
  id: 'vpb-runbooks-couchbase-document-edit',
  name: 'How to Edit a VPB Couchbase Document',
  route: '/games/runbooks/couchbase-document-edit',        // ← Update route to match new section
  component: 'VPBCouchbaseDocumentRunbook',
  section: 'games',             // ← Changed to 'games'
  category: 'runbooks',         // ← Same category
  order: 1
}
```

**That's it!** The navigation structure updates automatically.

## System Features

### 1. Automatic Navigation Generation
- Navigation items are generated from the page registry
- No need to manually update multiple files
- Permissions are handled automatically

### 2. Dynamic Component Loading
- Components are loaded lazily based on the registry
- No hardcoded imports in navigation components
- Easy to add new components

### 3. Single Source of Truth
- All page definitions in one place: `src/data/pageRegistry.ts`
- Move pages by changing one line
- Add pages by adding one entry

## Common Operations

### Moving a Page to Different Section
Change the `section` field and update the `route`:
```typescript
// Move from 'virtualpitboss' to 'banking'
section: 'banking',
route: '/banking/scripts/powershell',  // Update to match new section
```

### Moving a Page to Different Category
Change the `category` field and update the `route`:
```typescript
// Move from 'scripts' to 'runbooks'
category: 'runbooks',
route: '/virtualpitboss/runbooks/powershell',  // Update to match new category
```

### Adding a New Page
Just add a new entry to the `pageRegistry` array:
```typescript
{
  id: 'new-page-example',
  name: 'My New Page',
  route: '/banking/general/new-page',
  component: 'MyNewPageComponent',
  section: 'banking',
  category: 'general',
  order: 1,
  description: 'Description of my new page'
}
```

### Changing Page Order
Update the `order` field:
```typescript
order: 3,  // This will appear as the 3rd item in its category
```

## File Structure

```
src/
├── data/
│   ├── pageRegistry.ts     # ← Edit this file to move pages
│   └── navigation.ts       # ← Auto-generated (don't edit manually)
├── components/
│   ├── PageRenderer.tsx    # ← Handles dynamic loading
│   └── SubPanel.tsx        # ← Updated to use PageRenderer
```

## Benefits

1. **Single Edit Operation**: Move any page with one line change
2. **No Breaking Changes**: Routes update automatically
3. **Type Safety**: TypeScript ensures consistency
4. **Easy Maintenance**: All page definitions in one file
5. **Flexible Permissions**: Per-page permission overrides supported
6. **Lazy Loading**: Components load on demand for better performance

## Migration from Old System

The old hardcoded navigation has been replaced with the dynamic registry system. All existing pages work exactly the same, but now you can easily reorganize them by editing the registry file.

**Your princess demands nothing less than perfection in organization! ✨**