function loadAddress(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`找不到 ID 為 ${containerId} 的元素`);
    return;
  }

  container.innerHTML = `
    <div class="form-row address-fields">
      <div class="form-group">
          <label>縣(市)</label>
          <select id="${containerId}-city" class="form-control">
              <option value="">縣市</option>
          </select>
      </div>
      <div class="form-group">
          <label>行政區</label>
          <select id="${containerId}-district" class="form-control">
              <option value="">請先選擇縣市</option>
          </select>
      </div>
      <div class="form-group">
          <label>里別</label>
          <select id="${containerId}-village" class="form-control">
              <option value="">請先選擇行政區</option>
          </select>
      </div>
      <div class="form-group">
          <label>路(街)</label>
          <select id="${containerId}-road" class="form-control">
              <option value="">請先選擇行政區</option>
          </select>
      </div>
    </div>

<div class="form-row address-inline">
  <div class="form-group"><label>巷</label><input class="form-control" type="text" /></div>

  <div class="form-group">
    <label>弄</label>
    <div style="display:flex; gap:4px; align-items:center;">
      <input class="form-control" type="text" style="width:80px;" />
      <span>-</span>
      <input class="form-control" type="text" style="width:80px;" />
    </div>
  </div>

  <div class="form-group"><label>衖</label><input class="form-control" type="text" /></div>

  <div class="form-group">
    <label>號</label>
    <div style="display:flex; gap:4px; align-items:center;">
      <input class="form-control" type="text" style="width:80px;" />
      <span>-</span>
      <input class="form-control" type="text" style="width:80px;" />
    </div>
  </div>

  <div class="form-group"><label>樓</label><input class="form-control" type="text"  /></div>
  <div class="form-group"><label>樓之</label><input class="form-control" type="text"  /></div>
  <div class="form-group"><label>室</label><input class="form-control" type="text" /></div>
</div>


  `;

  // 縣市與行政區資料
  const cityDistrictData = {
    "台北市": ["中正區", "大同區", "中山區", "松山區", "大安區", "萬華區", "信義區", "士林區", "北投區", "內湖區", "南港區", "文山區"],
    "新北市": ["板橋區", "三重區", "中和區", "永和區", "新莊區", "新店區", "土城區", "樹林區", "鶯歌區", "三峽區", "淡水區", "汐止區", "瑞芳區", "五股區", "泰山區", "林口區", "八里區", "深坑區", "石碇區", "坪林區", "三芝區", "石門區", "金山區", "萬里區", "烏來區"],
    "桃園市": ["桃園區", "中壢區", "平鎮區", "八德區", "楊梅區", "蘆竹區", "龜山區", "龍潭區", "大溪區", "大園區", "觀音區", "新屋區", "復興區"],
    "台中市": ["中區", "東區", "南區", "西區", "北區", "北屯區", "西屯區", "南屯區", "太平區", "大里區", "霧峰區", "烏日區", "豐原區", "后里區", "石岡區", "東勢區", "和平區", "新社區", "潭子區", "大雅區", "神岡區", "大肚區", "沙鹿區", "龍井區", "梧棲區", "清水區", "大甲區", "外埔區", "大安區"],
    "台南市": ["中西區", "東區", "南區", "北區", "安平區", "安南區", "永康區", "歸仁區", "新化區", "左鎮區", "玉井區", "楠西區", "南化區", "仁德區", "關廟區", "龍崎區", "官田區", "麻豆區", "佳里區", "西港區", "七股區", "將軍區", "學甲區", "北門區", "新營區", "後壁區", "白河區", "東山區", "六甲區", "下營區", "柳營區", "鹽水區", "善化區", "大內區", "山上區", "新市區", "安定區"],
    "高雄市": ["新興區", "前金區", "苓雅區", "鹽埕區", "鼓山區", "旗津區", "前鎮區", "三民區", "楠梓區", "小港區", "左營區", "仁武區", "大社區", "東沙群島", "南沙群島", "岡山區", "路竹區", "阿蓮區", "田寮區", "燕巢區", "橋頭區", "梓官區", "彌陀區", "永安區", "湖內區", "鳳山區", "大寮區", "林園區", "鳥松區", "大樹區", "旗山區", "美濃區", "六龜區", "甲仙區", "杉林區", "內門區", "茂林區", "桃源區", "那瑪夏區"]
  };

  const citySelect = document.getElementById(`${containerId}-city`);
  const districtSelect = document.getElementById(`${containerId}-district`);
  const villageSelect = document.getElementById(`${containerId}-village`);
  const roadSelect = document.getElementById(`${containerId}-road`);

  // 填充縣市
  Object.keys(cityDistrictData).forEach(city => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    citySelect.appendChild(option);
  });

  // 當縣市變更時更新行政區
  citySelect.addEventListener("change", function () {
    districtSelect.innerHTML = '<option value="">請選擇行政區</option>';
    villageSelect.innerHTML = '<option value="">請先選擇行政區</option>';
    roadSelect.innerHTML = '<option value="">請先選擇行政區</option>';

    const districts = cityDistrictData[this.value] || [];
    districts.forEach(d => {
      const option = document.createElement("option");
      option.value = d;
      option.textContent = d;
      districtSelect.appendChild(option);
    });
  });

  // 當行政區變更時更新里別與路名
  districtSelect.addEventListener("change", function () {
    villageSelect.innerHTML = '';
    roadSelect.innerHTML = '';

    // 模擬資料
    const villages = ["第一里", "第二里", "第三里"];
    const roads = ["中正路", "民生路", "和平街"];

    villageSelect.innerHTML = villages.map(v => `<option value="${v}">${v}</option>`).join('');
    roadSelect.innerHTML = roads.map(r => `<option value="${r}">${r}</option>`).join('');
  });
}
