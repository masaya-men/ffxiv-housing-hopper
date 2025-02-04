// 初期のJavaScriptコード例
document.addEventListener('DOMContentLoaded', function() {
  console.log('ページが読み込まれました！');
});
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM fully loaded and parsed.");

  // フォームと入力フィールドの取得
  const postUrlForm = document.getElementById('postUrlForm');
  const postUrlInput = document.getElementById('postUrlInput');

  // フォームの送信イベントリスナーを追加
  postUrlForm.addEventListener('submit', async function(e) {
    e.preventDefault();  // フォームのデフォルトの送信を防ぐ
    const postUrl = postUrlInput.value;
    console.log("Form submitted: " + postUrl);

    try {
      // Netlify Functions のエンドポイントにリクエストを送る
      const response = await fetch(`/.netlify/functions/twitter?postUrl=${encodeURIComponent(postUrl)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Server response:", data);
      
      // ここで、サーバーから返されたデータを元に処理（例: 取得した画像URLのグリッド表示など）を行います
      // 現時点では、サンプル関数は固定のレスポンスを返すだけです
      
    } catch (error) {
      console.error("Error calling twitter function:", error);
    }
  });
});
