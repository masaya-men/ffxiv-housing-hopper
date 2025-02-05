// netlify/functions/twitter.js

async function getFetch() {
  const fetchModule = await import('node-fetch');
  return fetchModule.default;
}

function extractTweetId(postUrl) {
  const regex = /status\/(\d+)/;
  const match = postUrl.match(regex);
  if (match && match[1]) {
    return match[1];
  }
  return null;
}

module.exports = {
  handler: async function(event, context) {
    const queryParams = event.queryStringParameters || {};
    const postUrl = queryParams.postUrl;
    if (!postUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "postUrl parameter is required" }),
      };
    }
    
    const tweetId = extractTweetId(postUrl);
    if (!tweetId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid Twitter post URL" }),
      };
    }
    
    const endpoint = `https://api.twitter.com/2/tweets/${tweetId}?expansions=attachments.media_keys&media.fields=url`;
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;
    if (!bearerToken) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Twitter API credentials not set" }),
      };
    }
    
    try {
      const fetch = await getFetch();
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
      let imageUrls = [];
      if (tweetData && tweetData.includes && tweetData.includes.media) {
        imageUrls = tweetData.includes.media
          .filter(media => media.url)
          .map(media => media.url);
      }
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Successfully retrieved tweet data",
          tweetId: tweetId,
          imageUrls: imageUrls,
          rawData: tweetData
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
