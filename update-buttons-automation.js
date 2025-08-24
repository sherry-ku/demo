/**
 * Button Component System Migration Automation Script
 * 
 * This script automates the migration from legacy button classes to the new
 * unified button component system across all HTML files in the project.
 * 
 * Usage:
 * 1. Install Node.js if not already installed
 * 2. Run: node update-buttons-automation.js
 * 3. Review the changes made in the generated migration report
 * 
 * The script performs the following transformations:
 * - Updates header buttons to use semantic variants
 * - Converts form buttons to appropriate semantic types
 * - Replaces legacy button classes with new component classes
 * - Maintains functionality while improving consistency
 */

const fs = require('fs');
const path = require('path');

// Button mapping configuration
const BUTTON_MAPPINGS = {
  // Header buttons
  '訊息中心': 'btn--info',
  '暫存訂單': 'btn--secondary', 
  '登出': 'btn--outline-danger',
  
  // Action buttons
  '查詢': 'btn--primary',
  '搜尋': 'btn--primary',
  '儲存': 'btn--save',
  '保存': 'btn--save',
  '新增': 'btn--create',
  '建立': 'btn--create',
  '編輯': 'btn--edit',
  '修改': 'btn--edit',
  '刪除': 'btn--delete',
  '移除': 'btn--delete',
  '取消': 'btn--cancel',
  '返回': 'btn--back',
  '上一步': 'btn--back',
  '下一步': 'btn--primary',
  '送出': 'btn--save',
  '提交': 'btn--save',
  '確定': 'btn--primary',
  '清除': 'btn--secondary',
  '重置': 'btn--secondary',
  
  // View buttons
  '查看': 'btn--primary btn--sm',
  '詳細': 'btn--info btn--sm',
  '明細': 'btn--success btn--sm',
  '產品明細': 'btn--success btn--sm',
  '公告': 'btn--info btn--sm',
  
  // Status buttons
  '關閉': 'btn--secondary',
  '展開': 'btn--secondary',
  '收合': 'btn--secondary',
};

// Legacy class replacements
const LEGACY_REPLACEMENTS = {
  'btn-primary': 'btn--primary',
  'btn-secondary': 'btn--secondary', 
  'btn-success': 'btn--success',
  'btn-info': 'btn--info',
  'btn-warning': 'btn--warning',
  'btn-danger': 'btn--danger',
  'btn-mini': 'btn--xs',
  'btn-small': 'btn--sm',
  'btn-large': 'btn--lg',
  'btn-product': 'btn--success btn--sm',
  'btn-view': 'btn--primary btn--sm',
  'btn-info': 'btn--info btn--sm',
};

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changes = [];
    let modified = false;

    // Process button text-based mappings
    for (const [text, className] of Object.entries(BUTTON_MAPPINGS)) {
      const regex = new RegExp(`<button\\s+class="btn"([^>]*)>\\s*${text}\\s*</button>`, 'g');
      const replacement = `<button class="btn ${className}"$1>${text}</button>`;
      
      if (content.match(regex)) {
        content = content.replace(regex, replacement);
        changes.push(`Updated "${text}" button to use ${className}`);
        modified = true;
      }
    }

    // Process legacy class replacements
    for (const [oldClass, newClass] of Object.entries(LEGACY_REPLACEMENTS)) {
      const regex = new RegExp(`class="([^"]*\\s)?${oldClass}(\\s[^"]*)?`, 'g');
      
      if (content.includes(oldClass)) {
        content = content.replace(regex, (match, before = '', after = '') => {
          return `class="${before.trim()} ${newClass} ${after.trim()}".trim()`;
        });
        changes.push(`Replaced legacy class ${oldClass} with ${newClass}`);
        modified = true;
      }
    }

    // Clean up extra spaces in class attributes
    content = content.replace(/class="([^"]*)"/g, (match, classes) => {
      const cleanClasses = classes.split(/\s+/).filter(c => c.trim()).join(' ');
      return `class="${cleanClasses}"`;
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      return { filePath, changes, success: true };
    }

    return { filePath, changes: [], success: true, skipped: true };

  } catch (error) {
    return { filePath, error: error.message, success: false };
  }
}

function generateReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: results.length,
      modified: results.filter(r => r.success && !r.skipped).length,
      skipped: results.filter(r => r.skipped).length,
      errors: results.filter(r => !r.success).length
    },
    details: results
  };

  const reportPath = path.join(__dirname, 'button-migration-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log('=== Button Component Migration Report ===');
  console.log(`Total files processed: ${report.summary.totalFiles}`);
  console.log(`Files modified: ${report.summary.modified}`);
  console.log(`Files skipped: ${report.summary.skipped}`);
  console.log(`Errors: ${report.summary.errors}`);
  console.log(`Report saved to: ${reportPath}`);

  if (report.summary.errors > 0) {
    console.log('\\nErrors encountered:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  ${r.filePath}: ${r.error}`);
    });
  }
}

function main() {
  const htmlFiles = fs.readdirSync(__dirname)
    .filter(file => file.endsWith('.html'))
    .map(file => path.join(__dirname, file));

  console.log(`Found ${htmlFiles.length} HTML files to process...`);
  
  const results = htmlFiles.map(processFile);
  generateReport(results);
  
  console.log('\\nButton component migration completed!');
  console.log('Please review the changes and test the updated files.');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { processFile, BUTTON_MAPPINGS, LEGACY_REPLACEMENTS };