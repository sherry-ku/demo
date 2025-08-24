# 響應式表格系統使用指南

## 概述

本系統為所有 HTML 表格提供響應式處理，在小螢幕裝置（≤768px）上自動將表格轉換為卡片式佈局，提供更好的行動裝置使用體驗。

## 檔案結構

```
/
├── responsive-tables.css          # 響應式表格樣式
├── responsive-tables.js           # 響應式表格 JavaScript 功能
├── responsive-tables-demo.html    # 功能示範頁面
└── RESPONSIVE-TABLES-GUIDE.md     # 使用指南 (本文件)
```

## 快速開始

### 1. 引入檔案

在 HTML 文件的 `<head>` 區段添加：

```html
<link href="common.css" rel="stylesheet" />
<script src="responsive-tables.js"></script>
```

*注意: responsive-tables.css 已包含在 common.css 中*

### 2. HTML 標記

使用標準 HTML 表格結構：

```html
<table class="table">
  <thead>
    <tr>
      <th>欄位1</th>
      <th>欄位2</th>
      <th>欄位3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>資料1</td>
      <td>資料2</td>
      <td>資料3</td>
    </tr>
  </tbody>
</table>
```

### 3. 自動初始化

JavaScript 會在頁面載入時自動：
- 掃描所有表格
- 分析表格結構和類型
- 添加響應式類別
- 生成資料標籤用於行動版顯示

## 表格類型與樣式

系統自動識別以下表格類型並應用對應樣式：

### 客戶表格 (Customer Tables)
- **識別條件**: 包含「客戶」、「家戶」等關鍵字
- **卡片特色**: 
  - 藍色漸層標題
  - 客戶編號突出顯示
  - 地址資訊區塊化
- **適用場景**: 客戶查詢、客戶列表

```html
<table class="table responsive-table--customer">
  <!-- 自動添加 -->
</table>
```

### 產品表格 (Product Tables)
- **識別條件**: 包含「產品」、「專案」等關鍵字
- **卡片特色**: 
  - 綠色漸層標題
  - 狀態標籤群組化
  - 金額欄位突出
- **適用場景**: 產品管理、服務明細

### 合約表格 (Contract Tables)
- **識別條件**: 包含「合約」關鍵字
- **卡片特色**: 
  - 橙色漸層標題
  - 合約編號特殊樣式
  - 日期欄位突出
- **適用場景**: 合約管理、合約查詢

### 帳務表格 (Billing Tables)
- **識別條件**: 包含「帳」、「繳費」等關鍵字
- **卡片特色**: 
  - 綠色漸層標題
  - 金額大字顯示
  - 逾期日期警示
- **適用場景**: 帳務查詢、繳費記錄

### 標籤表格 (Tag Tables)
- **識別條件**: 包含「標籤」關鍵字
- **卡片特色**: 
  - 紫色漸層標題
  - 標籤內容區塊化
  - 重要性等級視覺化
- **適用場景**: 標籤管理、跳訊設定

## 響應式行為

### 桌面版 (>768px)
- 保持原有表格外觀
- 支援水平捲動
- 保留懸停效果
- 維持現有互動功能

### 行動版 (≤768px)
- 表格轉換為卡片佈局
- 每行資料成為一張卡片
- 欄位名稱作為標籤顯示
- 卡片標題突出重要資訊

## 高級功能

### 手動指定表格類型

```javascript
// 等待 DOM 載入完成
document.addEventListener('DOMContentLoaded', function() {
  const table = document.getElementById('myTable');
  window.responsiveTableManager.addTable(table, { 
    type: 'customer',
    cardTitleIndex: 2 // 使用第3欄作為卡片標題
  });
});
```

### 動態內容更新

```javascript
// 重新整理特定表格
const table = document.getElementById('myTable');
window.responsiveTableManager.refreshTable(table);

// 設定載入狀態
window.responsiveTableManager.setLoadingState('myTable', true);

// 設定空狀態
window.responsiveTableManager.setEmptyState('myTable', true, '查無資料');
```

### 巢狀表格處理

系統自動處理巢狀表格：

```html
<tr class="child-row">
  <td colspan="100%">
    <table class="child-table">
      <!-- 子表格內容 -->
    </table>
  </td>
</tr>
```

子表格在行動版：
- 保持表格形式但簡化樣式
- 使用較小字體
- 保留欄位標題
- 不轉換為卡片形式

## CSS 自定義

### 修改斷點

```css
/* 修改響應式斷點 */
@media (max-width: 992px) { /* 改為 992px */ 
  .responsive-table thead {
    display: none;
  }
  /* ... 其他行動版樣式 */
}
```

### 自定義卡片樣式

```css
/* 客製化卡片標題 */
@media (max-width: 768px) {
  .responsive-table--custom tr:before {
    background: linear-gradient(135deg, #your-color 0%, #your-color-2 100%);
    color: #your-text-color;
  }
}
```

### 自定義欄位樣式

```css
/* 特殊欄位樣式 */
@media (max-width: 768px) {
  .responsive-table .cell-custom {
    background: #f0f0f0;
    font-weight: bold;
    border-radius: 4px;
    padding: 8px;
    margin: 4px 0;
  }
}
```

## 最佳實踐

### 1. 表格設計
- 保持欄位數量合理 (建議 ≤ 12 欄)
- 使用有意義的表頭文字
- 避免過長的內容在單一欄位
- 重要操作放在最後一欄

### 2. 內容優化
- 為重要資訊設計突出樣式
- 使用狀態標籤而非純文字
- 提供簡潔而有意義的標題
- 考慮行動裝置的觸控需求

### 3. 效能考量
- 大型表格考慮分頁處理
- 使用虛擬捲動處理超大數據
- 避免在表格中嵌入過多媒體內容
- 合理使用動畫效果

### 4. 相容性
- 支援 IE11+ (需 Polyfill)
- 測試各種螢幕尺寸
- 確保鍵盤導航正常
- 提供降級方案

## 常見問題

### Q: 為什麼某些表格沒有轉換為卡片？
A: 檢查以下項目：
1. 表格是否有正確的 `<thead>` 和 `<tbody>` 結構
2. JavaScript 是否正確載入
3. 是否有 JavaScript 錯誤阻止執行
4. 表格是否為動態生成 (需手動調用 `refreshTable`)

### Q: 如何自定義卡片標題？
A: 可以通過以下方式：
```javascript
window.responsiveTableManager.addTable(table, { cardTitleIndex: 2 });
```
或在 HTML 中添加：
```html
<tr data-card-title="自定義標題">
```

### Q: 巢狀表格在行動版顯示異常？
A: 確保巢狀表格使用正確的類別：
```html
<table class="child-table">
```

### Q: 如何禁用某個表格的響應式功能？
A: 添加類別 `no-responsive`：
```html
<table class="table no-responsive">
```

## 更新日誌

### v1.0.0 (2025-01-21)
- ✅ 初始版本發布
- ✅ 支援 5 種表格類型自動識別
- ✅ 完整的卡片式佈局轉換
- ✅ 巢狀表格處理
- ✅ 動態內容支援
- ✅ 自動初始化功能

## 技術支援

如遇到問題或需要新功能，請參考：
1. `responsive-tables-demo.html` - 功能示範
2. 檢查瀏覽器控制台錯誤訊息
3. 確認 CSS 和 JS 檔案正確載入
4. 驗證 HTML 結構是否符合標準

---

*最後更新: 2025-01-21*  
*版本: 1.0.0*