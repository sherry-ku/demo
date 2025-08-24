/**
 * Inline Style Replacer Utility
 * Automatically replaces common inline styles with BEM-named CSS classes
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Define replacement patterns (ordered by priority/frequency)
const replacements = [
  // Form Actions - Most common pattern
  {
    pattern: /<div class="form-row"\s+style="justify-content:\s*flex-end;\s*gap:\s*10px;?\s*(?:margin-top:\s*\d+px;?)?">/g,
    replacement: '<div class="form-actions">',
    description: 'Form action buttons container'
  },
  {
    pattern: /<div class="form-row"\s+style="justify-content:\s*flex-end;\s*gap:\s*10px;\s*margin-top:\s*20px;">/g,
    replacement: '<div class="form-actions">',
    description: 'Form action buttons with margin'
  },
  
  // Required field labels
  {
    pattern: /<label><span style="color:\s*red;?">\uff0a<\/span>([^<]+)<\/label>/g,
    replacement: '<label class="label--required">$1</label>',
    description: 'Required field labels'
  },
  {
    pattern: /<label><span style="color:\s*red;?">\*<\/span>([^<]+)<\/label>/g,
    replacement: '<label class="label--required">$1</label>',
    description: 'Required field labels with asterisk'
  },
  
  // Disabled fields
  {
    pattern: /style="background-color:\s*#f5f5f5;?"/g,
    replacement: 'class="field--disabled"',
    description: 'Disabled field backgrounds'
  },
  {
    pattern: /readonly\s+style="background-color:\s*#f5f5f5;?"/g,
    replacement: 'readonly class="field--disabled"',
    description: 'Readonly disabled fields'
  },
  
  // Full width form groups
  {
    pattern: /<div class="form-group"\s+style="flex:\s*1\s+1\s+100%;?">/g,
    replacement: '<div class="form-group form-group--full">',
    description: 'Full width form groups'
  },
  
  // Full width textareas and inputs
  {
    pattern: /style="width:\s*100%;?"/g,
    replacement: 'class="field--full-width"',
    description: 'Full width fields'
  },
  
  // Text colors
  {
    pattern: /style="color:\s*red;?"/g,
    replacement: 'class="text--required"',
    description: 'Red text (required indicators)'
  },
  {
    pattern: /style="color:\s*gray;?"/g,
    replacement: 'class="text--disabled"',
    description: 'Gray text (disabled state)'
  },
  {
    pattern: /style="color:\s*#0066cc;?"/g,
    replacement: 'class="text--info"',
    description: 'Info blue text'
  },
  
  // Fixed widths
  {
    pattern: /style="width:\s*150px;?"/g,
    replacement: 'class="field--narrow"',
    description: 'Narrow fields (150px)'
  },
  {
    pattern: /style="width:\s*200px;?"/g,
    replacement: 'class="field--medium"',
    description: 'Medium fields (200px)'
  },
  {
    pattern: /style="width:\s*160px;?"/g,
    replacement: 'class="field--narrow"',
    description: 'Narrow fields (160px)'
  },
  
  // Form group widths  
  {
    pattern: /<div class="form-group"\s+style="width:\s*160px;?">/g,
    replacement: '<div class="form-group form-group--fixed-narrow">',
    description: 'Fixed narrow form groups'
  },
  {
    pattern: /<div class="form-group"\s+style="width:\s*200px;?">/g,
    replacement: '<div class="form-group form-group--fixed-medium">',
    description: 'Fixed medium form groups'
  },
  
  // Flex containers
  {
    pattern: /<div style="display:\s*flex;\s*gap:\s*\d+px;?\s*align-items:\s*center;?">/g,
    replacement: '<div class="flex-container">',
    description: 'Flex containers with gap and center alignment'
  },
  {
    pattern: /<div style="display:\s*flex;\s*align-items:\s*center;\s*gap:\s*\d+px;?">/g,
    replacement: '<div class="flex-container">',
    description: 'Flex containers with center alignment and gap'
  },
  
  // Date range inputs
  {
    pattern: /<input[^>]+type="date"[^>]+style="width:\s*150px;?"[^>]*>/g,
    replacement: function(match) {
      return match.replace(/style="width:\s*150px;?"/, 'class="date-range__input"');
    },
    description: 'Date range inputs'
  },
  
  // Text decorations
  {
    pattern: /style="text-decoration:\s*none;\s*color:\s*inherit;?"/g,
    replacement: 'class="text--link"',
    description: 'Link text without decoration'
  },
  
  // Icons
  {
    pattern: /style="width:\s*16px;\s*height:\s*16px;?\s*(?:vertical-align:\s*middle;?)?"/g,
    replacement: 'class="icon"',
    description: '16px icons'
  },
  {
    pattern: /style="cursor:\s*pointer;\s*width:\s*16px;\s*height:\s*16px;?"/g,
    replacement: 'class="icon icon--clickable"',
    description: 'Clickable icons'
  },
  
  // Container states
  {
    pattern: /style="display:\s*none;?"/g,
    replacement: 'class="container--hidden"',
    description: 'Hidden containers'
  },
  {
    pattern: /style="display:\s*block;?"/g,
    replacement: 'class="container--visible"',
    description: 'Visible block containers'
  },
  
  // Margins and padding
  {
    pattern: /style="margin-top:\s*10px;?"/g,
    replacement: 'class="mt-2"',
    description: '10px top margin'
  },
  {
    pattern: /style="margin-top:\s*15px;?"/g,
    replacement: 'class="mt-3"',
    description: '15px top margin'
  },
  {
    pattern: /style="margin-top:\s*20px;?"/g,
    replacement: 'class="mt-4"',
    description: '20px top margin'
  },
  {
    pattern: /style="padding:\s*10px;?"/g,
    replacement: 'class="p-2"',
    description: '10px padding'
  },
  {
    pattern: /style="padding:\s*15px;?"/g,
    replacement: 'class="p-3"',
    description: '15px padding'
  }
];

// Function to process a single file
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changeCount = 0;
    
    // Apply each replacement pattern
    replacements.forEach(({ pattern, replacement, description }) => {
      const beforeCount = (content.match(pattern) || []).length;
      
      if (typeof replacement === 'function') {
        content = content.replace(pattern, replacement);
      } else {
        content = content.replace(pattern, replacement);
      }
      
      const afterCount = (content.match(pattern) || []).length;
      const changes = beforeCount - afterCount;
      
      if (changes > 0) {
        console.log(`  ✓ ${description}: ${changes} replacements`);
        changeCount += changes;
      }
    });
    
    // Write back if changes were made
    if (changeCount > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`📝 ${path.basename(filePath)}: ${changeCount} total changes\n`);
      return changeCount;
    }
    
    return 0;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return 0;
  }
}

// Function to process all HTML files
function processAllFiles() {
  console.log('🚀 Starting inline style replacement process...\n');
  
  // Find all HTML files
  const htmlFiles = glob.sync('*.html');
  let totalChanges = 0;
  let processedFiles = 0;
  
  htmlFiles.forEach(filePath => {
    console.log(`📄 Processing: ${filePath}`);
    const changes = processFile(filePath);
    
    if (changes > 0) {
      processedFiles++;
      totalChanges += changes;
    } else {
      console.log(`  ℹ️  No changes needed\n`);
    }
  });
  
  console.log('✅ Process completed!');
  console.log(`📊 Summary:`);
  console.log(`   - Files processed: ${htmlFiles.length}`);
  console.log(`   - Files modified: ${processedFiles}`);
  console.log(`   - Total replacements: ${totalChanges}`);
  
  // Show remaining inline styles that need manual review
  console.log('\n🔍 Checking for remaining inline styles...');
  htmlFiles.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');
    const inlineStyles = content.match(/style="[^"]+"/g);
    if (inlineStyles && inlineStyles.length > 0) {
      console.log(`⚠️  ${filePath} still has ${inlineStyles.length} inline styles that need manual review:`);
      inlineStyles.slice(0, 3).forEach(style => {
        console.log(`     ${style}`);
      });
      if (inlineStyles.length > 3) {
        console.log(`     ... and ${inlineStyles.length - 3} more`);
      }
      console.log('');
    }
  });
}

// Run the process
if (require.main === module) {
  processAllFiles();
}

module.exports = { processFile, processAllFiles, replacements };