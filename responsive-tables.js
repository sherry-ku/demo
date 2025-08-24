/**
 * Responsive Tables JavaScript Utility
 * Handles table-to-card conversion for mobile devices
 * Automatically adds data labels for mobile card layout
 */

class ResponsiveTableManager {
  constructor() {
    this.tables = [];
    this.breakpoint = 768;
    this.isInitialized = false;
    this.resizeTimeout = null;
    
    // Bind methods
    this.handleResize = this.handleResize.bind(this);
    this.init = this.init.bind(this);
  }

  /**
   * Initialize responsive tables
   */
  init() {
    if (this.isInitialized) return;
    
    // Find all tables and convert them to responsive
    this.discoverTables();
    this.setupEventListeners();
    this.processAllTables();
    
    this.isInitialized = true;
    console.log(`ResponsiveTableManager initialized with ${this.tables.length} tables`);
  }

  /**
   * Discover all tables in the document
   */
  discoverTables() {
    const tableElements = document.querySelectorAll('table');
    
    tableElements.forEach((table, index) => {
      const tableInfo = this.analyzeTable(table, index);
      if (tableInfo) {
        this.tables.push(tableInfo);
      }
    });
  }

  /**
   * Analyze a table and extract its structure
   */
  analyzeTable(tableElement, index) {
    const thead = tableElement.querySelector('thead');
    const tbody = tableElement.querySelector('tbody');
    
    if (!thead || !tbody) return null;

    // Get headers
    const headerRow = thead.querySelector('tr');
    if (!headerRow) return null;

    const headers = Array.from(headerRow.querySelectorAll('th')).map(th => ({
      text: th.textContent.trim(),
      className: th.className || '',
      width: th.style.width || th.getAttribute('width') || 'auto'
    }));

    // Detect table type based on headers and existing classes
    const tableType = this.detectTableType(tableElement, headers);
    
    // Get card title pattern (usually first meaningful column)
    const cardTitleIndex = this.getCardTitleIndex(headers);

    return {
      element: tableElement,
      id: tableElement.id || `responsive-table-${index}`,
      headers: headers,
      type: tableType,
      cardTitleIndex: cardTitleIndex,
      isProcessed: false
    };
  }

  /**
   * Detect table type based on headers and classes
   */
  detectTableType(tableElement, headers) {
    const headerTexts = headers.map(h => h.text.toLowerCase()).join(' ');
    const className = tableElement.className.toLowerCase();

    // Check for specific table types
    if (className.includes('product') || headerTexts.includes('產品') || headerTexts.includes('專案')) {
      return 'product';
    }
    
    if (className.includes('customer') || headerTexts.includes('客戶') || headerTexts.includes('家戶')) {
      return 'customer';
    }
    
    if (className.includes('contract') || headerTexts.includes('合約')) {
      return 'contract';
    }
    
    if (className.includes('tag') || headerTexts.includes('標籤')) {
      return 'tag';
    }
    
    if (className.includes('bill') || headerTexts.includes('帳') || headerTexts.includes('繳費')) {
      return 'billing';
    }

    return 'default';
  }

  /**
   * Get index of column to use as card title
   */
  getCardTitleIndex(headers) {
    // Priority order for card titles
    const titlePriority = [
      '客戶名稱', '申請人', '合約名稱', '產品名稱', '專案名稱', '標籤名稱',
      '帳單編號', '契機編號', '工單編號', '編號', '名稱'
    ];

    for (let priority of titlePriority) {
      const index = headers.findIndex(h => h.text.includes(priority));
      if (index !== -1) return index;
    }

    // If no priority match, use first non-action column
    const nonActionIndex = headers.findIndex(h => 
      !h.text.includes('選取') && 
      !h.text.includes('編輯') && 
      !h.text.includes('查看') &&
      !h.text.includes('操作')
    );
    
    return nonActionIndex !== -1 ? nonActionIndex : 0;
  }

  /**
   * Process all discovered tables
   */
  processAllTables() {
    this.tables.forEach(tableInfo => {
      if (!tableInfo.isProcessed) {
        this.processTable(tableInfo);
      }
    });
  }

  /**
   * Process a single table for responsive behavior
   */
  processTable(tableInfo) {
    const { element, headers, type, cardTitleIndex } = tableInfo;
    
    // Add responsive classes
    this.addResponsiveClasses(element, type);
    
    // Wrap table if not already wrapped
    this.wrapTable(element);
    
    // Add data labels to cells
    this.addDataLabels(element, headers, cardTitleIndex);
    
    // Process nested/child tables
    this.processChildTables(element);
    
    tableInfo.isProcessed = true;
  }

  /**
   * Add responsive CSS classes to table
   */
  addResponsiveClasses(tableElement, type) {
    // Add base responsive class
    if (!tableElement.classList.contains('responsive-table')) {
      tableElement.classList.add('responsive-table');
    }
    
    // Add type-specific class
    if (type !== 'default') {
      tableElement.classList.add(`responsive-table--${type}`);
    }
  }

  /**
   * Wrap table with responsive wrapper if not already wrapped
   */
  wrapTable(tableElement) {
    const parent = tableElement.parentElement;
    
    // Check if already wrapped
    if (parent && parent.classList.contains('responsive-table-wrapper')) {
      return;
    }
    
    const wrapper = document.createElement('div');
    wrapper.className = 'responsive-table-wrapper';
    
    parent.insertBefore(wrapper, tableElement);
    wrapper.appendChild(tableElement);
  }

  /**
   * Add data labels to table cells for mobile card view
   */
  addDataLabels(tableElement, headers, cardTitleIndex) {
    const tbody = tableElement.querySelector('tbody');
    if (!tbody) return;

    const rows = tbody.querySelectorAll('tr:not(.child-row)');
    
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      
      // Add card title data attribute
      if (cells[cardTitleIndex]) {
        const cardTitle = cells[cardTitleIndex].textContent.trim();
        row.setAttribute('data-card-title', cardTitle);
      }
      
      // Add data labels to each cell
      cells.forEach((cell, index) => {
        if (headers[index]) {
          cell.setAttribute('data-label', headers[index].text);
          
          // Add semantic classes based on content
          this.addSemanticClasses(cell, headers[index], index);
        }
      });
    });
  }

  /**
   * Add semantic CSS classes to cells based on content type
   */
  addSemanticClasses(cell, header, index) {
    const headerText = header.text.toLowerCase();
    const cellText = cell.textContent.toLowerCase();
    
    // Status columns
    if (headerText.includes('狀態') || headerText.includes('status')) {
      cell.classList.add('cell-status');
    }
    
    // Amount/money columns
    if (headerText.includes('金額') || headerText.includes('費') || cellText.includes('$')) {
      cell.classList.add('cell-amount');
    }
    
    // Date columns
    if (headerText.includes('日期') || headerText.includes('時間') || 
        cellText.match(/\d{4}[-\/]\d{1,2}[-\/]\d{1,2}/)) {
      cell.classList.add('cell-date');
    }
    
    // ID/Code columns
    if (headerText.includes('編號') || headerText.includes('id') || headerText.includes('代碼')) {
      cell.classList.add('cell-id');
    }
    
    // Customer ID specific
    if (headerText.includes('客戶') && headerText.includes('編號')) {
      cell.classList.add('cell-customer-id');
    }
    
    // Address columns
    if (headerText.includes('地址') || headerText.includes('縣市') || headerText.includes('行政區')) {
      cell.classList.add('cell-address');
    }
    
    // Contract number
    if (headerText.includes('合約') && headerText.includes('編號')) {
      cell.classList.add('cell-contract-no');
    }
    
    // Tag content
    if (headerText.includes('跳訊') || headerText.includes('內容') || headerText.includes('說明')) {
      cell.classList.add('cell-tag-content');
    }
    
    // Due dates
    if (headerText.includes('截止') || headerText.includes('到期')) {
      cell.classList.add('cell-due-date');
    }
    
    // Action columns (usually last columns)
    if (headerText.includes('編輯') || headerText.includes('查看') || 
        headerText.includes('操作') || headerText.includes('選取')) {
      cell.classList.add('cell-actions');
    }
  }

  /**
   * Process child/nested tables
   */
  processChildTables(parentTable) {
    const childTables = parentTable.querySelectorAll('.child-table, table table');
    
    childTables.forEach(childTable => {
      if (!childTable.classList.contains('responsive-table')) {
        childTable.classList.add('responsive-table');
        
        // Child tables keep simpler styling
        const thead = childTable.querySelector('thead');
        const tbody = childTable.querySelector('tbody');
        
        if (thead && tbody) {
          const headers = Array.from(thead.querySelectorAll('th')).map(th => ({
            text: th.textContent.trim()
          }));
          
          // Add minimal data labels for child tables
          const rows = tbody.querySelectorAll('tr');
          rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, index) => {
              if (headers[index]) {
                cell.setAttribute('data-label', headers[index].text);
              }
            });
          });
        }
      }
    });
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    window.addEventListener('resize', this.handleResize);
    
    // Listen for dynamic content changes
    if (window.MutationObserver) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            const addedTables = Array.from(mutation.addedNodes)
              .filter(node => node.nodeType === 1)
              .reduce((tables, node) => {
                if (node.tagName === 'TABLE') {
                  tables.push(node);
                }
                tables.push(...node.querySelectorAll('table'));
                return tables;
              }, []);
            
            if (addedTables.length > 0) {
              this.handleNewTables(addedTables);
            }
          }
        });
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  /**
   * Handle window resize
   */
  handleResize() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      // Force recalculation if needed
      this.tables.forEach(tableInfo => {
        if (tableInfo.element) {
          tableInfo.element.classList.remove('responsive-table--loading');
        }
      });
    }, 250);
  }

  /**
   * Handle newly added tables
   */
  handleNewTables(tableElements) {
    tableElements.forEach((table, index) => {
      const tableInfo = this.analyzeTable(table, this.tables.length + index);
      if (tableInfo) {
        this.tables.push(tableInfo);
        this.processTable(tableInfo);
      }
    });
  }

  /**
   * Refresh a specific table (useful after content updates)
   */
  refreshTable(tableElement) {
    const tableInfo = this.tables.find(info => info.element === tableElement);
    if (tableInfo) {
      tableInfo.isProcessed = false;
      this.processTable(tableInfo);
    }
  }

  /**
   * Public method to add a new table manually
   */
  addTable(tableElement, options = {}) {
    const tableInfo = this.analyzeTable(tableElement, this.tables.length);
    if (tableInfo) {
      // Apply custom options
      if (options.type) tableInfo.type = options.type;
      if (options.cardTitleIndex !== undefined) tableInfo.cardTitleIndex = options.cardTitleIndex;
      
      this.tables.push(tableInfo);
      this.processTable(tableInfo);
      
      return tableInfo.id;
    }
    return null;
  }

  /**
   * Get current screen size category
   */
  getScreenSize() {
    return window.innerWidth <= this.breakpoint ? 'mobile' : 'desktop';
  }

  /**
   * Enable loading state for a table
   */
  setLoadingState(tableId, isLoading = true) {
    const tableInfo = this.tables.find(info => info.id === tableId);
    if (tableInfo && tableInfo.element) {
      if (isLoading) {
        tableInfo.element.classList.add('responsive-table--loading');
      } else {
        tableInfo.element.classList.remove('responsive-table--loading');
      }
    }
  }

  /**
   * Set empty state for a table
   */
  setEmptyState(tableId, isEmpty = true, message = '暫無資料') {
    const tableInfo = this.tables.find(info => info.id === tableId);
    if (tableInfo && tableInfo.element) {
      const tbody = tableInfo.element.querySelector('tbody');
      if (tbody) {
        if (isEmpty) {
          tbody.innerHTML = `<tr class="responsive-table--empty"><td colspan="100%">${message}</td></tr>`;
        } else {
          const emptyRow = tbody.querySelector('.responsive-table--empty');
          if (emptyRow) {
            emptyRow.remove();
          }
        }
      }
    }
  }
}

// Global instance
window.ResponsiveTableManager = ResponsiveTableManager;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const manager = new ResponsiveTableManager();
    manager.init();
    window.responsiveTableManager = manager;
  });
} else {
  const manager = new ResponsiveTableManager();
  manager.init();
  window.responsiveTableManager = manager;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ResponsiveTableManager;
}