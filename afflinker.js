const axios = require('axios');

const portaffFunction = async (cookie, id, trackingId) => {
  const sourceTypes = ["620", "562", "561","680"];

  try {
    const promotionLinkRequests = sourceTypes.map(sourceType => {
      return axios.get("https://portals.aliexpress.com/tools/linkGenerate/generatePromotionLink.htm", {
        params: {
          trackId: trackingId || 'default',
          targetUrl: `https://vi.aliexpress.com/i/${id}.html?sourceType=${sourceType == 620 ? sourceType + "&channel=coin" :sourceType }&aff_fcid=`,
        },
        headers: { "cookie": cookie }
      });
    });

    const infoRequest = axios.get(`https://afillbot.com/info?id=${id}&lang=en_DZ`);

    const responses = await Promise.all([...promotionLinkRequests, infoRequest]);

    let result = responses[4].data; // Accessing data from infoRequest
    console.log(result);

    result.aff = {};
    
    responses.slice(0, 4).forEach((response, index) => {
      switch (index) {
        case 0: // Points
          result.aff.points = response.data.data;
          break;
        case 1: // Super
          result.aff.super = response.data.data;
          break;
        case 2: // Limited
          result.aff.limited = response.data.data;
          break;
        case 3: // Limited
          result.aff.bigsave = response.data.data;
          break;
      }
    });

    return result;
  } catch (error) {
    console.log("portaffFunction ERR : ", error);
    return "ERR";
  }
};

exports.portaffFunction = portaffFunction;
