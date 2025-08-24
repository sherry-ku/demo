# Button Component System Documentation

## Overview
This document describes the unified button component system implemented across the customer management demo project. The system provides consistent styling, semantic naming, and accessibility features for all button elements.

## Architecture

### File Structure
- `button-components.css` - Main button component definitions
- `common.css` - Import entry point for all CSS modules
- `button-components-demo.html` - Comprehensive demo and reference

### CSS Class Hierarchy
```css
.btn                    /* Base button class (required) */
.btn--{variant}         /* Semantic variants */
.btn--{size}           /* Size modifiers */
.btn--outline-{variant} /* Outline variants */
.btn-group             /* Button grouping */
```

## Button Variants

### Base Variants
| Class | Purpose | Color | Usage |
|-------|---------|--------|-------|
| `.btn--primary` | Primary actions | Blue (#007bff) | Main CTAs, form submissions |
| `.btn--secondary` | Secondary actions | Gray (#6c757d) | Cancel, alternative actions |
| `.btn--success` | Success actions | Green (#28a745) | Save, confirm, positive actions |
| `.btn--danger` | Danger actions | Red (#dc3545) | Delete, remove, destructive actions |
| `.btn--warning` | Warning actions | Yellow (#ffc107) | Caution, temporary actions |
| `.btn--info` | Information actions | Cyan (#17a2b8) | Info, notifications, help |
| `.btn--light` | Light actions | Light gray (#f8f9fa) | Subtle actions |
| `.btn--dark` | Dark actions | Dark gray (#343a40) | High contrast actions |

### Semantic Variants
| Class | Purpose | Icon Suggestion | Usage Context |
|-------|---------|----------------|---------------|
| `.btn--save` | Save/Submit | 💾 | Form submissions, data persistence |
| `.btn--edit` | Edit/Modify | ✏️ | Edit forms, modification actions |
| `.btn--delete` | Delete/Remove | 🗑️ | Destructive actions, removal |
| `.btn--create` | Create/Add | ➕ | New item creation, additions |
| `.btn--cancel` | Cancel/Abort | ❌ | Cancel operations, abort actions |
| `.btn--back` | Back/Return | ⬅️ | Navigation, return to previous page |
| `.btn--search` | Search/Query | 🔍 | Search operations, filtering |
| `.btn--upload` | Upload/Import | 📤 | File uploads, data import |
| `.btn--download` | Download/Export | 📥 | File downloads, data export |
| `.btn--refresh` | Refresh/Reload | 🔄 | Data refresh, page reload |

### Size Variants
| Class | Dimensions | Font Size | Usage |
|-------|------------|-----------|-------|
| `.btn--xs` | 20px height | 11px | Compact tables, inline actions |
| `.btn--sm` | 28px height | 12px | Table actions, secondary buttons |
| `.btn` (default) | 36px height | 13px | Standard buttons |
| `.btn--lg` | 44px height | 14px | Prominent actions |
| `.btn--xl` | 52px height | 16px | Hero sections, major CTAs |

### Outline Variants
All semantic and base variants can be used as outline buttons:
- `.btn--outline-primary`
- `.btn--outline-secondary`
- `.btn--outline-danger`
- etc.

### Special States
| Class | Purpose |
|-------|---------|
| `.btn--loading` | Loading state with spinner |
| `.btn:disabled` | Disabled state (automatic) |
| `.btn--block` | Full-width button |

## Button Groups
Use `.btn-group` to group related buttons:

```html
<div class="btn-group">
  <button class="btn btn--primary">Save</button>
  <button class="btn btn--secondary">Cancel</button>
</div>
```

## Usage Guidelines

### Semantic Naming Priority
Always prefer semantic classes over generic color classes:

```html
<!-- ✅ Good - Semantic meaning -->
<button class="btn btn--save">保存</button>
<button class="btn btn--delete">刪除</button>

<!-- ❌ Avoid - Generic color -->
<button class="btn btn--success">保存</button>
<button class="btn btn--danger">刪除</button>
```

### Common Patterns

#### Header Buttons
```html
<div class="header-right">
  <button class="btn btn--info">訊息中心</button>
  <button class="btn btn--secondary">暫存訂單</button>
  <button class="btn btn--outline-danger">登出</button>
</div>
```

#### Form Actions
```html
<div class="form-actions">
  <button class="btn btn--cancel" type="button">取消</button>
  <button class="btn btn--save" type="submit">儲存</button>
</div>
```

#### Table Actions
```html
<td>
  <button class="btn btn--primary btn--sm">查看</button>
  <button class="btn btn--edit btn--sm">編輯</button>
  <button class="btn btn--delete btn--sm">刪除</button>
</td>
```

#### Search Forms
```html
<div class="search-actions">
  <button class="btn btn--secondary" type="reset">清除</button>
  <button class="btn btn--search" type="submit">查詢</button>
</div>
```

## Migration from Legacy Classes

### Automated Migration
Use the provided automation script:
```bash
node update-buttons-automation.js
```

### Manual Migration Mapping
| Legacy Class | New Class | Notes |
|--------------|-----------|--------|
| `.btn-primary` | `.btn--primary` | Direct replacement |
| `.btn-secondary` | `.btn--secondary` | Direct replacement |
| `.btn-success` | `.btn--success` | Direct replacement |
| `.btn-danger` | `.btn--danger` | Direct replacement |
| `.btn-warning` | `.btn--warning` | Direct replacement |
| `.btn-info` | `.btn--info` | Direct replacement |
| `.btn-mini` | `.btn--xs` | Size variant |
| `.btn-small` | `.btn--sm` | Size variant |
| `.btn-large` | `.btn--lg` | Size variant |
| `.btn-product` | `.btn--success .btn--sm` | Semantic + size |
| `.btn-view` | `.btn--primary .btn--sm` | Semantic + size |

## Accessibility Features

### Built-in Accessibility
- High contrast mode support via `prefers-contrast: high`
- Reduced motion support via `prefers-reduced-motion: reduce`
- Proper focus indicators with 2px outline
- WCAG AA compliant color contrasts
- Keyboard navigation support

### Focus Management
```css
.btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### Screen Reader Support
Use proper button text and aria-labels:

```html
<!-- ✅ Good - Clear button text -->
<button class="btn btn--save">儲存客戶資料</button>

<!-- ✅ Good - Using aria-label for icon buttons -->
<button class="btn btn--edit btn--sm" aria-label="編輯客戶資料">
  <i class="icon-edit"></i>
</button>
```

## Performance Considerations

### CSS Custom Properties
The system uses CSS custom properties for theme values:
```css
:root {
  --btn-primary-bg: #007bff;
  --btn-primary-color: #ffffff;
  --btn-padding-y: 0.375rem;
  --btn-padding-x: 0.75rem;
}
```

### Minimal CSS
- Total size: ~8KB (minified)
- No JavaScript dependencies for basic functionality
- Efficient selector specificity

## Browser Support
- Chrome/Edge 88+
- Firefox 87+
- Safari 14+
- IE 11 (with CSS custom properties polyfill)

## Testing

### Visual Regression Testing
Test button appearances across:
- Different viewport sizes (320px to 1920px)
- High contrast mode
- Different zoom levels (100% to 200%)

### Functional Testing
- Keyboard navigation (Tab, Enter, Space)
- Screen reader compatibility
- Touch/click interactions
- Loading states and disabled states

## Examples and Demos

See `button-components-demo.html` for:
- All button variants and combinations
- Interactive examples
- Accessibility demonstrations
- Real-world usage scenarios

## Maintenance

### Adding New Variants
1. Define CSS custom properties in `tokens.css`
2. Add variant classes in `button-components.css`
3. Update this documentation
4. Add examples to demo page
5. Test across supported browsers

### Color Palette Updates
Update colors in `tokens.css`:
```css
:root {
  --color-primary: #007bff;
  --color-success: #28a745;
  /* etc. */
}
```

## Migration Status

### Completed Files (Updated with new button classes)
- ✅ `common.css` - Import structure
- ✅ `button-components.css` - Component definitions
- ✅ `custom_search_fixed.html` - Main search page
- ✅ `contract_edit_step2.html` - Contract editing
- ✅ `detail-billing.html` - Billing details
- ✅ `contract_create_step1.html` - Contract creation
- ✅ `contract_create_step2.html` - Contract content
- ✅ `detail-customer.html` - Customer details
- ✅ `tag_create.html` - Tag creation
- ✅ `tag_edit.html` - Tag editing

### Remaining Files (To be updated)
- 🔄 `building_create_aio.html`
- 🔄 `building_edit_aio.html` 
- 🔄 `building_search.html`
- 🔄 `building_search_result.html`
- 🔄 `contract_address_create.html`
- 🔄 `contract_child_project.html`
- 🔄 `contract_child_project_edit.html`
- 🔄 `contract_parent_project.html`
- 🔄 `contract_parent_project_edit.html`
- 🔄 `contract_search.html`
- 🔄 `contract_search_result.html`
- 🔄 `detail-contact.html`
- 🔄 `detail-engineering.html`
- 🔄 `detail-product.html`
- 🔄 `detail_final_CA001.html`
- 🔄 `tag_priority_edit.html`
- 🔄 `tag_search_list.html`
- 🔄 `tag_upload.html`

### Automation Available
Use `update-buttons-automation.js` to automatically update remaining files.

## Support
For questions or issues with the button component system, please refer to:
1. This documentation
2. Demo page examples
3. CSS source comments
4. Migration automation script