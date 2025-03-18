const axios = require("axios");
const envVars = require("../../config/server.config");
const ApiError = require("../../errors/ApiErrors");
const { logger } = require("./logger.utils");

const INTEGRATED_NUMBER = "919039034972"; // Your WhatsApp API number
const API_URL = "https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/";

const sendWhatsAppMessage = async ({ phoneNumber, documentUrl, filename }) => {
  try {
    const payload = {
      integrated_number: INTEGRATED_NUMBER,
      content_type: "template",
      payload: {
        messaging_product: "whatsapp",
        type: "template",
        template: {
          name: "krishi_paramarsh1",
          language: {
            code: "hi",
            policy: "deterministic",
          },
          namespace: null, //unique namespace
          to_and_components: [
            {
              to: [phoneNumber],
              // components: [
              // {
              //   type: "header",
              //   parameters: [
              //     {
              //       type: "document",
              //       document: {
              //         link: documentUrl,
              //         filename: filename,
              //       },
              //     },
              //   ],
              // },
              // ],
              components: {
                header_1: {
                  type: "document",
                  value: documentUrl,
                  filename: filename,
                },
              },
            },
          ],
        },
      },
    };

    const response = await axios.post(API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        authkey: envVars.MSG91_AUTH_KEY,
      },
    });

    logger.info("WhatsApp Message Sent:", response.data);
    return response.data;
  } catch (error) {
    logger.error("Error Sending WhatsApp Message:", error.response?.data || error.message);
    throw new ApiError(500, "Failed to send WhatsApp message.");
  }
};

module.exports = { sendWhatsAppMessage };
