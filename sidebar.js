var sidebarHTML = `
<ul>
  <li onclick="location.href='index.html'" class="sidebar-icon" title="首頁">
    <span class="menu-icon">&#127968;</span>
    <span class="menu-label">首頁</span>
  </li>
  <li class="has-submenu" title="客戶管理">
    <span class="menu-toggle">
      <span class="menu-icon">&#128100;</span>
      <span class="menu-label">客戶管理</span>
      <span class="arrow">&#9654;</span>
    </span>
    <ul class="submenu">
      <li onclick="location.href='customer_search_input_fixed.html'">客戶資料查詢</li>
      <li onclick="location.href='customer_create.html'">客戶主檔新增</li>
      <li onclick="location.href='customer_tag_manage.html'">客戶標籤管理</li>
      <li onclick="location.href='customer_popup_manage.html'">客戶跳訊管理</li>
    </ul>
  </li>
  <li class="has-submenu" title="合約管理">
    <span class="menu-toggle">
      <span class="menu-icon">&#128221;</span>
      <span class="menu-label">合約管理</span>
      <span class="arrow">&#9654;</span>
    </span>
    <ul class="submenu">
      <li onclick="location.href='contract_search.html'">合約查詢</li>
      <li onclick="location.href='contract_create_step1.html'">建立合約</li>
    </ul>
  </li>
  <li class="has-submenu" title="建物管理">
    <span class="menu-toggle">
      <span class="menu-icon">&#127970;</span>
      <span class="menu-label">建物管理</span>
      <span class="arrow">&#9654;</span>
    </span>
    <ul class="submenu">
      <li onclick="location.href='building_search.html'">建物查詢</li>
      <li onclick="location.href='building_create_aio.html'">建立建物</li>
    </ul>
  </li>
  <li class="has-submenu" title="標籤管理">
    <span class="menu-toggle">
      <span class="menu-icon">&#128278;</span>
      <span class="menu-label">標籤管理</span>
      <span class="arrow">&#9654;</span>
    </span>
    <ul class="submenu">
      <li onclick="location.href='tag_search_list.html'">標籤管理</li>
      <li onclick="location.href='tag_upload_search_list.html'">貼標管理</li>
    </ul>
  </li>
  <li class="sidebar-icon" title="訂單管理">
    <span class="menu-icon">&#128179;</span>
    <span class="menu-label">訂單管理</span>
  </li>
  <li class="sidebar-icon" title="申裝作業">
    <span class="menu-icon">&#128295;</span>
    <span class="menu-label">申裝作業</span>
  </li>
</ul>
`;

document.addEventListener('DOMContentLoaded', function () {
  var sidebar = document.querySelector('.sidebar');
  var toggleBtn = document.createElement('button');
  toggleBtn.className = 'sidebar-toggle-btn';
  toggleBtn.style.width = '100%';
  toggleBtn.style.height = '40px';
  toggleBtn.style.border = 'none';
  toggleBtn.style.background = 'transparent';
  toggleBtn.style.cursor = 'pointer';
  toggleBtn.innerHTML = '<span style="font-size:20px;">&#9776;</span>'; // 漢堡 icon
  sidebar.prepend(toggleBtn);

  toggleBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    sidebar.classList.toggle('sidebar-collapsed');
    // 切換 icon-only/label 顯示
    if (sidebar.classList.contains('sidebar-collapsed')) {
      sidebar.querySelectorAll('.menu-label').forEach(function (el) {
        el.style.display = 'none';
      });
    } else {
      sidebar.querySelectorAll('.menu-label').forEach(function (el) {
        el.style.display = '';
      });
    }
  });

  // 預設收合時隱藏 label
  if (sidebar.classList.contains('sidebar-collapsed')) {
    sidebar.querySelectorAll('.menu-label').forEach(function (el) {
      el.style.display = 'none';
    });
  }

  document.querySelectorAll('.sidebar .has-submenu').forEach(function (li) {
    li.classList.remove('open');
    var toggle = li.querySelector('.menu-toggle');
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (!sidebar.classList.contains('sidebar-collapsed')) {
        li.classList.toggle('open');
      }
    });
  });
});
