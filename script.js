document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM fully loaded");

  /* --- モーダル制御 --- */
  const openModalBtn = document.getElementById('openRegistrationModalBtn');
  const registerModal = document.getElementById('registerModal');
  const cancelRegistrationBtn = document.getElementById('cancelRegistrationBtn');
  const registrationForm = document.getElementById('registrationForm');
  const errorOverlay = document.getElementById('errorOverlay');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const mainContent = document.getElementById('mainContent');
  const header = document.querySelector('.site-header');
  const blockNumberSelect = document.getElementById('blockNumberSelect');
  const roomNumberContainer = document.getElementById('roomNumberContainer');
  const roomNumberSelect = document.getElementById('roomNumberSelect');

  blockNumberSelect.addEventListener('change', function() {
    // "Apartment 1" または "Apartment 2" が選択された場合
    if (this.value === "Apartment 1" || this.value === "Apartment 2") {
      roomNumberContainer.style.display = 'block';
      // 部屋番号入力欄を必須に設定
      roomNumberSelect.setAttribute('required', 'true');
    } else {
      roomNumberContainer.style.display = 'none';
      // 必須属性を削除
      roomNumberSelect.removeAttribute('required');
    }
  });
  

  // モーダルを開くとき：フォームリセット、エラークリア、モーダル表示、背景ぼかし適用（mainContentとheader）
  openModalBtn.addEventListener('click', function() {
    registrationForm.reset();
    errorOverlay.style.display = 'none';
    registerModal.style.display = 'flex';
    mainContent.classList.add('blur-background');
    header.classList.add('blur-background');
  });

  // モーダルを閉じる処理
  function closeModal() {
    registerModal.style.display = 'none';
    removeBlur();
  }
  function removeBlur() {
    mainContent.classList.remove('blur-background');
    header.classList.remove('blur-background');
  }
  cancelRegistrationBtn.addEventListener('click', closeModal);
  registerModal.addEventListener('click', function(e) {
    if (e.target === registerModal) {
      closeModal();
    }
  });

  /* --- エラーオーバーレイ表示 --- */
  function showErrorOverlay(message) {
    errorOverlay.textContent = message;
    errorOverlay.style.display = 'flex';
    setTimeout(() => {
      errorOverlay.style.display = 'none';
    }, 3000);
  }

  /* --- ワールドリスト連動 --- */
  const dataCenterSelect = document.getElementById('dataCenterSelect');
  const worldSelect = document.getElementById('worldSelect');
  const worldMapping = {
    "Elemental": ["Aegis", "Atomos", "Carbuncle", "Garuda", "Gungnir", "Kujata", "Tonberry", "Typhon"],
    "Gaia": ["Alexander", "Bahamut", "Durandal", "Fenrir", "Ifrit", "Ridill", "Tiamat", "Ultima"],
    "Mana": ["Anima", "Asura", "Chocobo", "Hades", "Ixion", "Masamune", "Pandemonium", "Titan"],
    "Meteor": ["Belias", "Mandragora", "Ramuh", "Shinryu", "Unicorn", "Valefor", "Yojimbo", "Zeromus"],
    "Aether": ["Adamantoise", "Cactuar", "Faerie", "Gilgamesh", "Jenova", "Midgardsormr", "Sargatanas", "Siren"],
    "Primal": ["Behemoth", "Excalibur", "Exodus", "Famfrit", "Hyperion", "Lamia", "Leviathan", "Ultros"],
    "Crystal": ["Balmung", "Brynhildr", "Coeurl", "Diabolos", "Goblin", "Malboro", "Mateus", "Zalera"],
    "Dynamis": ["Halicarnassus", "Maduin", "Marilith", "Seraph", "Cuchulainn", "Golem", "Kraken", "Rafflesia"],
    "Chaos": ["Cerberus", "Louisoix", "Moogle", "Omega", "Ragnarok", "Sagittarius", "Phantom"],
    "Light": ["Lich", "Odin", "Phoenix", "Shiva", "Zodiark", "Alpha", "Raiden"],
    "Shadow": ["Innocence", "Pixie", "Titania", "Tycoon"],
    "Materia": ["Bismarck", "Ravana", "Sephirot", "Sophia", "Zurvan"]
  };

  dataCenterSelect.addEventListener('change', function() {
    const selected = this.value;
    worldSelect.innerHTML = "";
    const defaultOpt = document.createElement('option');
    defaultOpt.value = "";
    defaultOpt.textContent = selected ? "選択してください" : "まず論理データセンターを選択してください";
    worldSelect.appendChild(defaultOpt);
    if (worldMapping[selected]) {
      worldMapping[selected].forEach(world => {
        const opt = document.createElement('option');
        opt.value = world;
        opt.textContent = world;
        worldSelect.appendChild(opt);
      });
    }
  });
  
  const residenceMapping = {
    "Mist": "Topmast",
    "The Lavender Beds": "Lily Hills",
    "The Goblet": "Sultana's Breath",
    "Shirogane": "Kobai Goten",
    "Empyreum": "イングルサイド"
  };
  
  /* --- 登録フォーム送信 --- */
  registrationForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const dataCenter = document.getElementById('dataCenterSelect').value;
    const world = document.getElementById('worldSelect').value;
    const residenceName = document.getElementById('residenceName').value;
    const district = document.getElementById('districtSelect').value;
    const block = document.getElementById('blockNumberSelect').value;
    const registrantName = document.getElementById('registrantName').value;
    const postUrl = document.getElementById('postUrlInput').value;
    
    let missingFields = [];
    if (!dataCenter) missingFields.push("論理データセンター");
    if (!world) missingFields.push("ワールド");
    if (!residenceName) missingFields.push("冒険者居住区名");
    if (!district) missingFields.push("住所（区）");
    if (!block) missingFields.push("番地またはアパート");
    if (!registrantName) missingFields.push("登録者名/作品名");
    if (!postUrl) missingFields.push("Twitter投稿URL");
    
    // Apartmentの場合は、部屋番号も必須とする
    if ((block === "Apartment 1" || block === "Apartment 2") && !roomNumberSelect.value) {
      missingFields.push("部屋番号");
    }
    
    if (missingFields.length > 0) {
      showErrorOverlay("未入力: " + missingFields.join(", "));
      return;
    }
    
    try {
      loadingOverlay.style.display = 'flex';
      const response = await fetch(`/.netlify/functions/twitter?postUrl=${encodeURIComponent(postUrl)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const tweetData = await response.json();
      console.log("Server response:", tweetData);
      let addressData;
      if (block === "Apartment 1" || block === "Apartment 2") {
        const roomNumber = document.getElementById('roomNumberSelect').value;
        // "Apartment 1" → "1", "Apartment 2" → "2" を抽出
        const apartmentNumber = block.replace("Apartment ", "");
        addressData = `${residenceName} ${district} ${residenceMapping[residenceName]} ${apartmentNumber}-${roomNumber}`;
      } else {
        addressData = `${residenceName} ${district} - ${block}`;
      }
      
            
      // regInfo に部屋番号も追加（Apartmentの場合）
      const regInfo = { registrantName, dataCenter, world, addressData, postUrl };
      if (block === "Apartment 1" || block === "Apartment 2") {
        regInfo.roomNumber = roomNumberSelect.value;
      }
      
      updateGrid(tweetData, regInfo);
      closeModal();
    } catch (error) {
      console.error("Error during registration:", error);
      showErrorOverlay("登録に失敗しました");
    } finally {
      loadingOverlay.style.display = 'none';
    }
  });
  

/* --- グリッド表示エリアの更新 --- */
function updateGrid(tweetData, regInfo) {
  const worksGrid = document.getElementById('works-grid');
  // ※ 既存の登録内容を残すため、innerHTML のクリアは行わない

  // グリッドアイテム全体のラッパーを生成
  const wrapper = document.createElement('div');
  wrapper.className = 'grid-item-wrapper';

  // 情報エリア（上段、左詰め）
  const infoDiv = document.createElement('div');
  infoDiv.className = 'work-item-info';
  const nameEl = document.createElement('div');
  nameEl.className = 'reg-name';
  nameEl.textContent = regInfo.registrantName;
  const dataCenterEl = document.createElement('div');
  dataCenterEl.className = 'data-center';
  dataCenterEl.textContent = regInfo.dataCenter;
  const worldEl = document.createElement('div');
  worldEl.className = 'world';
  worldEl.textContent = regInfo.world;
  const addressEl = document.createElement('div');
  addressEl.className = 'address-info';
  addressEl.textContent = regInfo.addressData;
  const urlEl = document.createElement('div');
  urlEl.className = 'sns-url';
  const urlLink = document.createElement('a');
  urlLink.href = regInfo.postUrl;
  urlLink.target = '_blank';
  urlLink.textContent = "ポストを見にいく";
  urlEl.appendChild(urlLink);
  
  infoDiv.appendChild(nameEl);
  infoDiv.appendChild(dataCenterEl);
  infoDiv.appendChild(worldEl);
  infoDiv.appendChild(addressEl);
  infoDiv.appendChild(urlEl);

  // サムネイルエリア（下段）：枠線で囲む
  const thumbDiv = document.createElement('div');
  thumbDiv.className = 'work-thumbnail';
  if (tweetData.imageUrls && tweetData.imageUrls.length > 0) {
    const img = document.createElement('img');
    img.src = tweetData.imageUrls[0];
    thumbDiv.appendChild(img);
  } else {
    const placeholder = document.createElement('div');
    placeholder.textContent = "No Image";
    placeholder.style.textAlign = "center";
    placeholder.style.padding = "20px";
    thumbDiv.appendChild(placeholder);
  }

  // ハートアイコン（サムネイル内右下）
  const heart = document.createElement('button');
  heart.className = 'heart-btn';
  heart.innerHTML = '&#9825;';
  heart.addEventListener('click', function(e) {
    e.stopPropagation();
    heart.classList.toggle('liked');
    heart.innerHTML = heart.classList.contains('liked') ? '&#10084;' : '&#9825;';
  });
  thumbDiv.appendChild(heart);

  wrapper.appendChild(infoDiv);
  wrapper.appendChild(thumbDiv);
  worksGrid.appendChild(wrapper);

  // サムネイルクリックで Full Image Modal を開く
  thumbDiv.addEventListener('click', function() {
    openFullImageModal(tweetData.imageUrls);
  });
}

  /* --- Full Image Modal --- */
  const fullImageModal = document.getElementById('fullImageModal');
  const fullImageContainer = document.getElementById('fullImageContainer');
  const closeFullImageModalBtn = document.getElementById('closeFullImageModalBtn');

  function openFullImageModal(imageUrls) {
    fullImageContainer.innerHTML = '';
    imageUrls.forEach(url => {
      const img = document.createElement('img');
      img.src = url;
      // 画像の固定幅指定を削除し、CSSで管理する
      fullImageContainer.appendChild(img);
    });
    fullImageModal.style.display = 'flex';
    // Full Image Modalはぼかさず、背景（headerとmainContent）にぼかしを適用
    header.classList.add('blur-background');
    mainContent.classList.add('blur-background');
    // モーダル外クリックで閉じる処理を追加（Full Image Modal用）
    fullImageModal.addEventListener('click', function(e) {
      if (e.target === fullImageModal) {
        fullImageModal.style.display = 'none';
        header.classList.remove('blur-background');
        mainContent.classList.remove('blur-background');
      }
    });
  }
  
  
  closeFullImageModalBtn.addEventListener('click', function() {
    fullImageModal.style.display = 'none';
    header.classList.remove('blur-background');
    mainContent.classList.remove('blur-background');
  });
});
