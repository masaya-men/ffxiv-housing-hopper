// netlify/functions/twitter.js

const fetch = require('node-fetch');  // Netlify Functions で fetch を使うため、node-fetch を利用

// ツイートURLからツイートIDを抽出する関数
function extractTweetId(postUrl) {
  // 例: https://twitter.com/username/status/1234567890
  const regex = /status\/(\d+)/;
  const match = postUrl.match(regex);
  if (match && match[1]) {
    return match[1];
  }
  return null;
}

module.exports = {
  handler: async function(event, context) {
    // クエリパラメーターから投稿URLを取得
    const queryParams = event.queryStringParameters || {};
    const postUrl = queryParams.postUrl;
    
    if (!postUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "postUrl parameter is required" }),
      };
    }
    
    // ツイートIDを抽出
    const tweetId = extractTweetId(postUrl);
    if (!tweetId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid Twitter post URL" }),
      };
    }
    
    // Twitter API のエンドポイント
    const endpoint = `https://api.twitter.com/2/tweets/${tweetId}?expansions=attachments.media_keys&media.fields=url`;
    
    // Bearer Token を環境変数から取得（Netlify の環境変数に設定してください）
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;
    if (!bearerToken) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Twitter API credentials not set" }),
      };
    }
    
    try {
      // Twitter API にリクエストを送る
      const apiResponse = await fetch(endpoint, {
        headers: {
          "Authorization": `Bearer ${bearerToken}`
        }
      });
      
      if (!apiResponse.ok) {
        const errText = await apiResponse.text();
        return {
          statusCode: apiResponse.status,
          body: JSON.stringify({ error: "Twitter API error", details: errText }),
        };
      }
      
      const tweetData = await apiResponse.json();
      
      // 画像のURLを抽出（ツイートに添付された画像情報が含まれている場合）
      let imageUrls = [];
      if (tweetData && tweetData.includes && tweetData.includes.media) {
        imageUrls = tweetData.includes.media.map(media => media.url).filter(url => url);
      }
      
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: "Successfully retrieved tweet data",
          tweetId: tweetId,
          imageUrls: imageUrls,
          rawData: tweetData  // 必要に応じて、後でデバッグ用に残すか削除してください
        })
      };
    } catch (error) {
      console.error("Error fetching Twitter API:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Internal server error", details: error.toString() }),
      };
    }
  }
};
