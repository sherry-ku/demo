// 客戶資訊頭部組件 - 共用組件
const customerInfoHeaderHTML = `
  <div class="customer-info-header" id="customerInfoHeader">
    <!-- 第一排：家戶基本資訊（固定顯示） -->
    <div class="customer-row fixed-row">
      <div class="household-basic-info" onclick="toggleCustomerInfo()">
        <span class="collapse-indicator" id="collapseIcon">▼</span>
        <span class="info-item">
          <span class="info-label">家戶編號：</span>
          <span class="info-value">CA0001</span>
        </span>
        <span class="info-item">
          <span class="info-label">申請人姓名：</span>
          <span class="info-value">李曉明</span>
        </span>
        <span class="info-item">
          <span class="info-label">裝機地址：</span>
          <span class="info-value">忠孝東路四段12巷1弄5樓101號</span>
        </span>
          <span class="tag tag-warning">黑名單-合約內M6欠費拆</span>
          <span class="tag tag-warning">立流A</span>
  <span class="tag tag-success">有效</span>
      </div>

      <div class="header-actions">
        <a class="btn-back" href="custom_search_fixed.html">
          <span class="back-icon">←</span>
          回到查詢結果
        </a>
      </div>
    </div>

    <!-- 可縮合的內容區域 -->
    <div class="customer-info-content" id="customerInfoContent">
     
    
    <!-- 第2排：用戶狀態與服務狀態（左右排列） -->
<div class="customer-row">
  <div class="status-card">
    <div class="customer-identity">
      <div class="customer-name">
        <span class="section-label">家戶特殊身分</span>
      </div>
      <div class="customer-tags">
        <span class="tag tag-vip">VIP-里長</span>
        <div class="rejection-tags">
          <span class="tag tag-warning">拒絕行銷</span>
          <span class="tag tag-warning">拒絕開機廣告</span>
        </div>
      </div>
    </div>
  </div>

  <div class="status-card">
    <div class="services-section">
      <span class="section-label">有效服務與標籤</span>
      <div class="service-indicators">
        <div class="service-with-projects">
          <span class="service-dot active">INTERNET</span>
          <div class="project-tags">
            <span class="tag tag-project mini" onclick="event.stopPropagation(); openTagModal('CP-001')" title="MKT促案">升速</span>
          </div>
        </div>
        <div class="service-with-projects">
          <span class="service-dot active">CATV</span>
          <div class="project-tags">
            <span class="tag tag-project mini" onclick="event.stopPropagation(); openTagModal('CP-002')" title="高風險">不滿</span>
            <span class="tag tag-project mini" onclick="event.stopPropagation(); openTagModal('CP-003')" title="品質不滿">品質</span>
          </div>
        </div>
        <div class="service-with-projects">
          <span class="service-dot active">OTT</span>
        </div>
      </div>
    </div>
  </div>
</div>
`;

// 切換客戶資訊顯示/隱藏的函數
function toggleCustomerInfo() {
  const content = document.getElementById('customerInfoContent');
  const icon = document.getElementById('collapseIcon');

  if (content.classList.contains('collapsed')) {
    content.classList.remove('collapsed');
    icon.classList.remove('collapsed-icon');
    icon.textContent = '▼';
  } else {
    content.classList.add('collapsed');
    icon.classList.add('collapsed-icon');
    icon.textContent = '▶';
  }
}