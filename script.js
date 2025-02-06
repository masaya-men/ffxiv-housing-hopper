document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM fully loaded");

  // --- 現在のユーザー情報（認証結果に応じて設定してください） ---
  const currentUser = "YourUserName";  // 例: ログインしているユーザー名
  const isAdmin = (currentUser === "YourAdminName"); // サイト管理者の場合は true にする

  // 全削除ボタンの処理
  const deleteAllBtn = document.getElementById('deleteAllBtn');
  deleteAllBtn.addEventListener('click', function() {
    const worksGrid = document.getElementById('works-grid');
    if (isAdmin) {
      worksGrid.innerHTML = '';
    } else {
      const items = worksGrid.getElementsByClassName('grid-item-wrapper');
      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        const nameEl = item.querySelector('.reg-name');
        if (nameEl && nameEl.textContent === currentUser) {
          item.remove();
        }
      }
    }
  });

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

  // blockNumberSelect の変更イベント
  blockNumberSelect.addEventListener('change', function() {
    if (this.value === "Apartment 1" || this.value === "Apartment 2") {
      roomNumberContainer.style.display = 'block';
      roomNumberSelect.setAttribute('required', 'true');
    } else {
      roomNumberContainer.style.display = 'none';
      roomNumberSelect.removeAttribute('required');
    }
  });

  // ★ここから：冒険者居住区の変更に応じた blockNumberSelect のオプション更新処理 ★
  const residenceNameSelect = document.getElementById('residenceName');
  // residenceMapping は既に定義されていると仮定します
  const residenceMapping = {
    "Mist": "Topmast",
    "The Lavender Beds": "Lily Hills",
    "The Goblet": "Sultana's Breath",
    "Shirogane": "Kobai Goten",
    "Empyreum": "イングルサイド"
  };
  residenceNameSelect.addEventListener('change', function() {
    const mappingValue = residenceMapping[this.value];
    // blockNumberSelect のオプション更新
    const options = blockNumberSelect.options;
    if (options.length >= 3 && mappingValue) {
      // options[0] は「選択してください」のまま、次の2つを更新
      options[1].textContent = mappingValue + " 1";
      options[2].textContent = mappingValue + " 2";
    }
  });
  // ★ここまで：冒険者居住区の変更に応じた処理の追加★

  // モーダルを開く
  openModalBtn.addEventListener('click', function() {
    registrationForm.reset();
    errorOverlay.style.display = 'none';
    registerModal.style.display = 'flex';
    mainContent.classList.add('blur-background');
    header.classList.add('blur-background');
  });

  function closeModal() {
    registerModal.style.display = 'none';
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
    // ★ここから追加：冒険者居住区の変更に応じた blockNumberSelect の更新処理
    // const residenceNameSelect = document.getElementById('residenceName');
    residenceNameSelect.addEventListener('change', function() {
      const mappingValue = residenceMapping[this.value];
      const options = blockNumberSelect.options;
      if (options.length >= 3 && mappingValue) {
        options[1].textContent = mappingValue + " 1";
        options[2].textContent = mappingValue + " 2";
      }
    });
    // ★ここまで追加
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
    
    // Apartmentの場合は、部屋番号も必須
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
        const roomNumber = roomNumberSelect.value;
        const apartmentNumber = block.replace("Apartment ", ""); // "1" or "2"
        addressData = `${residenceName} ${district} ${residenceMapping[residenceName]} ${apartmentNumber}-${roomNumber}`;
      } else {
        addressData = `${residenceName} ${district} - ${block}`;
      }
      
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
    // 既存の登録内容は残すため innerHTML のクリアは削除

    const wrapper = document.createElement('div');
    wrapper.className = 'grid-item-wrapper';

    // 情報エリア（上段）
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

    // ハートアイコン（既存）
    const heart = document.createElement('button');
    heart.className = 'heart-btn';
    heart.innerHTML = '&#9825;';
    heart.addEventListener('click', function(e) {
      e.stopPropagation();
      heart.classList.toggle('liked');
      heart.innerHTML = heart.classList.contains('liked') ? '&#10084;' : '&#9825;';
    });
    thumbDiv.appendChild(heart);

    // --- 削除ボタンの追加 ---
    if (isAdmin || regInfo.registrantName === currentUser) {
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = "削除";
      deleteBtn.className = "delete-btn";
      deleteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        wrapper.remove();
      });
      infoDiv.appendChild(deleteBtn);
    }

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
      // 固定幅指定は削除し、CSSでサイズ管理する
      fullImageContainer.appendChild(img);
    });
    fullImageModal.style.display = 'flex';
    header.classList.add('blur-background');
    mainContent.classList.add('blur-background');
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












// document.addEventListener('DOMContentLoaded', function() {
//   console.log("DOM fully loaded");

//   // 定数とグローバル変数の定義
//   const CONSTANTS = {
//     DISPLAY_DURATION: 3000,
//     DEFAULT_SELECT_TEXT: "選択してください",
//     APARTMENT_PREFIX: "Apartment"
//   };

//   // 現在のユーザー情報を環境変数や設定から取得することを推奨
//   const currentUser = "YourUserName";
//   const isAdmin = (currentUser === "YourAdminName");

//   // マッピングデータ
//   const residenceMapping = {
//     "Mist": "Topmast",
//     "The Lavender Beds": "Lily Hills",
//     "The Goblet": "Sultana's Breath",
//     "Shirogane": "Kobai Goten",
//     "Empyreum": "イングルサイド"
//   };

//   const worldMapping = {
//     "Elemental": ["Aegis", "Atomos", "Carbuncle", "Garuda", "Gungnir", "Kujata", "Tonberry", "Typhon"],
//     "Gaia": ["Alexander", "Bahamut", "Durandal", "Fenrir", "Ifrit", "Ridill", "Tiamat", "Ultima"],
//     "Mana": ["Anima", "Asura", "Chocobo", "Hades", "Ixion", "Masamune", "Pandemonium", "Titan"],
//     "Meteor": ["Belias", "Mandragora", "Ramuh", "Shinryu", "Unicorn", "Valefor", "Yojimbo", "Zeromus"],
//     "Aether": ["Adamantoise", "Cactuar", "Faerie", "Gilgamesh", "Jenova", "Midgardsormr", "Sargatanas", "Siren"],
//     "Primal": ["Behemoth", "Excalibur", "Exodus", "Famfrit", "Hyperion", "Lamia", "Leviathan", "Ultros"],
//     "Crystal": ["Balmung", "Brynhildr", "Coeurl", "Diabolos", "Goblin", "Malboro", "Mateus", "Zalera"],
//     "Dynamis": ["Halicarnassus", "Maduin", "Marilith", "Seraph", "Cuchulainn", "Golem", "Kraken", "Rafflesia"],
//     "Chaos": ["Cerberus", "Louisoix", "Moogle", "Omega", "Ragnarok", "Sagittarius", "Phantom"],
//     "Light": ["Lich", "Odin", "Phoenix", "Shiva", "Zodiark", "Alpha", "Raiden"],
//     "Shadow": ["Innocence", "Pixie", "Titania", "Tycoon"],
//     "Materia": ["Bismarck", "Ravana", "Sephirot", "Sophia", "Zurvan"]
//   };

//   // DOM要素の参照をまとめて管理
//   const elements = {
//     deleteAllBtn: document.getElementById('deleteAllBtn'),
//     worksGrid: document.getElementById('works-grid'),
//     openModalBtn: document.getElementById('openRegistrationModalBtn'),
//     registerModal: document.getElementById('registerModal'),
//     cancelRegistrationBtn: document.getElementById('cancelRegistrationBtn'),
//     registrationForm: document.getElementById('registrationForm'),
//     errorOverlay: document.getElementById('errorOverlay'),
//     loadingOverlay: document.getElementById('loadingOverlay'),
//     mainContent: document.getElementById('mainContent'),
//     header: document.querySelector('.site-header'),
//     blockNumberSelect: document.getElementById('blockNumberSelect'),
//     roomNumberContainer: document.getElementById('roomNumberContainer'),
//     roomNumberSelect: document.getElementById('roomNumberSelect'),
//     residenceNameSelect: document.getElementById('residenceName'),
//     dataCenterSelect: document.getElementById('dataCenterSelect'),
//     worldSelect: document.getElementById('worldSelect'),
//     fullImageModal: document.getElementById('fullImageModal'),
//     fullImageContainer: document.getElementById('fullImageContainer'),
//     closeFullImageModalBtn: document.getElementById('closeFullImageModalBtn')
//   };

//   // エラーハンドリング
//   class RegistrationError extends Error {
//     constructor(message, fields) {
//       super(message);
//       this.name = 'RegistrationError';
//       this.fields = fields;
//     }
//   }

//   // ユーティリティ関数
//   const utils = {
//     validateFormData(formData) {
//       const missingFields = [];
//       const requiredFields = {
//         dataCenter: "論理データセンター",
//         world: "ワールド",
//         residenceName: "冒険者居住区名",
//         district: "住所（区）",
//         block: "番地またはアパート",
//         registrantName: "登録者名/作品名",
//         postUrl: "Twitter投稿URL"
//       };

//       Object.entries(requiredFields).forEach(([key, label]) => {
//         if (!formData[key]) missingFields.push(label);
//       });

//       if (formData.block?.startsWith(CONSTANTS.APARTMENT_PREFIX) && !formData.roomNumber) {
//         missingFields.push("部屋番号");
//       }

//       if (missingFields.length > 0) {
//         throw new RegistrationError("必須フィールドが未入力です", missingFields);
//       }
//     },

//     async fetchTweetData(url) {
//       const response = await fetch(`/.netlify/functions/twitter?postUrl=${encodeURIComponent(url)}`);
//       if (!response.ok) {
//         throw new Error(`Twitter APIエラー: ${response.status}`);
//       }
//       return response.json();
//     },

//     formatAddress(formData) {
//       const { residenceName, district, block, roomNumber } = formData;
//       if (block.startsWith(CONSTANTS.APARTMENT_PREFIX)) {
//         const apartmentNumber = block.replace(`${CONSTANTS.APARTMENT_PREFIX} `, "");
//         return `${residenceName} ${district} ${residenceMapping[residenceName]} ${apartmentNumber}-${roomNumber}`;
//       }
//       return `${residenceName} ${district} - ${block}`;
//     },

//     updateWorldSelect(dataCenter) {
//       elements.worldSelect.innerHTML = "";
//       const defaultOpt = document.createElement('option');
//       defaultOpt.value = "";
//       defaultOpt.textContent = dataCenter ? CONSTANTS.DEFAULT_SELECT_TEXT : "まず論理データセンターを選択してください";
//       elements.worldSelect.appendChild(defaultOpt);

//       if (worldMapping[dataCenter]) {
//         worldMapping[dataCenter].forEach(world => {
//           const opt = document.createElement('option');
//           opt.value = world;
//           opt.textContent = world;
//           elements.worldSelect.appendChild(opt);
//         });
//       }
//     }
//   };

//   // モーダル制御
//   function showErrorOverlay(message) {
//     elements.errorOverlay.textContent = message;
//     elements.errorOverlay.style.display = 'flex';
//     setTimeout(() => {
//       elements.errorOverlay.style.display = 'none';
//     }, CONSTANTS.DISPLAY_DURATION);
//   }

//   function openModal() {
//     elements.registrationForm.reset();
//     elements.errorOverlay.style.display = 'none';
//     elements.registerModal.style.display = 'flex';
//     elements.mainContent.classList.add('blur-background');
//     elements.header.classList.add('blur-background');
//   }

//   function closeModal() {
//     elements.registerModal.style.display = 'none';
//     elements.mainContent.classList.remove('blur-background');
//     elements.header.classList.remove('blur-background');
//   }

//   // グリッド更新関数
//   function updateGrid(tweetData, regInfo) {
//     const wrapper = document.createElement('div');
//     wrapper.className = 'grid-item-wrapper';

//     // 情報エリア（上段）
//     const infoDiv = document.createElement('div');
//     infoDiv.className = 'work-item-info';
    
//     const infoElements = {
//       name: { class: 'reg-name', text: regInfo.registrantName },
//       dataCenter: { class: 'data-center', text: regInfo.dataCenter },
//       world: { class: 'world', text: regInfo.world },
//       address: { class: 'address-info', text: regInfo.addressData }
//     };

//     Object.entries(infoElements).forEach(([key, value]) => {
//       const element = document.createElement('div');
//       element.className = value.class;
//       element.textContent = value.text;
//       infoDiv.appendChild(element);
//     });

//     // URLリンク
//     const urlEl = document.createElement('div');
//     urlEl.className = 'sns-url';
//     const urlLink = document.createElement('a');
//     urlLink.href = regInfo.postUrl;
//     urlLink.target = '_blank';
//     urlLink.textContent = "ポストを見にいく";
//     urlEl.appendChild(urlLink);
//     infoDiv.appendChild(urlEl);

//     // サムネイルエリア
//     const thumbDiv = document.createElement('div');
//     thumbDiv.className = 'work-thumbnail';

//     if (tweetData.imageUrls?.length > 0) {
//       const img = document.createElement('img');
//       img.src = tweetData.imageUrls[0];
//       thumbDiv.appendChild(img);
//     } else {
//       const placeholder = document.createElement('div');
//       placeholder.textContent = "No Image";
//       placeholder.style.textAlign = "center";
//       placeholder.style.padding = "20px";
//       thumbDiv.appendChild(placeholder);
//     }

//     // ハートボタン
//     const heart = document.createElement('button');
//     heart.className = 'heart-btn';
//     heart.innerHTML = '&#9825;';
//     heart.addEventListener('click', function(e) {
//       e.stopPropagation();
//       heart.classList.toggle('liked');
//       heart.innerHTML = heart.classList.contains('liked') ? '&#10084;' : '&#9825;';
//     });
//     thumbDiv.appendChild(heart);

//     // 削除ボタン
//     if (isAdmin || regInfo.registrantName === currentUser) {
//       const deleteBtn = document.createElement('button');
//       deleteBtn.textContent = "削除";
//       deleteBtn.className = "delete-btn";
//       deleteBtn.addEventListener('click', function(e) {
//         e.stopPropagation();
//         wrapper.remove();
//       });
//       infoDiv.appendChild(deleteBtn);
//     }

//     wrapper.appendChild(infoDiv);
//     wrapper.appendChild(thumbDiv);
//     elements.worksGrid.appendChild(wrapper);

//     // サムネイルクリックイベント
//     thumbDiv.addEventListener('click', () => openFullImageModal(tweetData.imageUrls));
//   }

//   // フルイメージモーダル
//   function openFullImageModal(imageUrls) {
//     elements.fullImageContainer.innerHTML = '';
//     imageUrls.forEach(url => {
//       const img = document.createElement('img');
//       img.src = url;
//       elements.fullImageContainer.appendChild(img);
//     });
//     elements.fullImageModal.style.display = 'flex';
//     elements.header.classList.add('blur-background');
//     elements.mainContent.classList.add('blur-background');
//   }

//   // イベントハンドラー
//   const handlers = {
//     async handleFormSubmit(e) {
//       e.preventDefault();
//       const formData = Object.fromEntries(new FormData(e.target));

//       try {
//         utils.validateFormData(formData);
//         elements.loadingOverlay.style.display = 'flex';
        
//         const tweetData = await utils.fetchTweetData(formData.postUrl);
//         const addressData = utils.formatAddress(formData);
        
//         const regInfo = {
//           registrantName: formData.registrantName,
//           dataCenter: formData.dataCenter,
//           world: formData.world,
//           addressData,
//           postUrl: formData.postUrl,
//           roomNumber: formData.roomNumber
//         };

//         updateGrid(tweetData, regInfo);
//         closeModal();
//       } catch (error) {
//         console.error("登録エラー:", error);
//         if (error instanceof RegistrationError) {
//           showErrorOverlay("未入力: " + error.fields.join(", "));
//         } else {
//           showErrorOverlay("登録に失敗しました");
//         }
//       } finally {
//         elements.loadingOverlay.style.display = 'none';
//       }
//     },

//     handleDeleteAll() {
//       if (isAdmin) {
//         elements.worksGrid.innerHTML = '';
//       } else {
//         Array.from(elements.worksGrid.getElementsByClassName('grid-item-wrapper'))
//           .filter(item => item.querySelector('.reg-name')?.textContent === currentUser)
//           .forEach(item => item.remove());
//       }
//     },

//     handleBlockNumberChange() {
//       const isApartment = this.value === "Apartment 1" || this.value === "Apartment 2";
//       elements.roomNumberContainer.style.display = isApartment ? 'block' : 'none';
//       if (isApartment) {
//         elements.roomNumberSelect.setAttribute('required', 'true');
//       } else {
//         elements.roomNumberSelect.removeAttribute('required');
//       }
//     },

//     handleResidenceNameChange() {
//       const mappingValue = residenceMapping[this.value];
//       const options = elements.blockNumberSelect.options;
//       if (options.length >= 3 && mappingValue) {
//         options[1].textContent = mappingValue + " 1";
//         options[2].textContent = mappingValue + " 2";
//       }
//     },

//     handleDataCenterChange() {
//       utils.updateWorldSelect(this.value);
//     }
//   };

//   // イベントリスナーの設定
//   function setupEventListeners() {
//     elements.deleteAllBtn.addEventListener('click', handlers.handleDeleteAll);
//     elements.registrationForm.addEventListener('submit', handlers.handleFormSubmit);
//     elements.blockNumberSelect.addEventListener('change', handlers.handleBlockNumberChange);
//     elements.residenceNameSelect.addEventListener('change', handlers.handleResidenceNameChange);
//     elements.dataCenterSelect.addEventListener('change', handlers.handleDataCenterChange);
    
//     // モーダル関連
//     elements.openModalBtn.addEventListener('click', openModal);
//     elements.cancelRegistrationBtn.addEventListener('click', closeModal);
//     elements.registerModal.addEventListener('click', e => {
//       if (e.target === elements.registerModal) closeModal();
//     });
    
//     // フルイメージモーダル関連
//     elements.fullImageModal.addEventListener('click', e => {
//       if (e.target === elements.fullImageModal) {
//         elements.fullImageModal.style.display = 'none';
//         elements.header.classList.remove('blur-background');
//         elements.mainContent.classList.remove('blur-background');
//       }
//     });
//     elements.closeFullImageModalBtn.addEventListener('click', () => {
//       elements.fullImageModal.style.display = 'none';
//       elements.header.classList.remove('blur-background');
//       elements.mainContent.classList.remove('blur-background');
//     });
//   }

//   // アプリケーションの初期化
//   function initializeApp() {
//     // イベントリスナーの設定
//     setupEventListeners();
    
//     // 初期状態のワールドセレクトの設定
//     utils.updateWorldSelect('');
    
//     // 部屋番号コンテナの初期状態を非表示に
//     elements.roomNumberContainer.style.display = 'none';
//   }

//   // アプリケーションの起動
//   initializeApp();
// });