const crypto = require("crypto");
const axios = require('axios');

const portaffFunction = async (cookie, id, trackingId) => {
    const sourceTypes = ["", "620", "562", "561"];
    
    try {
      const promotionLinkRequests = sourceTypes.map(sourceType => {
        return axios.get("https://portals.aliexpress.com/tools/linkGenerate/generatePromotionLink.htm", {
          params: {
            trackId: trackingId || 'default',
            targetUrl: `https://ar.aliexpress.com/i/${id}.html`,
            sourceType: sourceType,
            aff_fcid: ''
          },
          headers: { "cookie": cookie }
        });
      });
  
      const infoRequest = axios.get(`https://alifetcher.onrender.com/info?id=${id}`);
  
      const responses = await Promise.all([...promotionLinkRequests, infoRequest]);
  
      let result = responses[3].data;
  
      result.aff = {};
  
      responses.slice(0, 3).forEach((response, index) => {
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
        }
      });
  
      return result;
    } catch (error) {
      console.log("portaffFunction ERR : ", error.code);
      return "ERR";
    }
  };

exports.portaffFunction = portaffFunction;