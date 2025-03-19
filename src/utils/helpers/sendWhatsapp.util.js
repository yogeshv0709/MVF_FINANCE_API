const axios = require("axios");
const envVars = require("../../config/server.config");
const ApiError = require("../../errors/ApiErrors");
const { logger } = require("./logger.utils");
const constant = require("../constants/constant");

const INTEGRATED_NUMBER = constant.WHATSAPP_INTEGRATED_NUMBER;
const API_URL = constant.WHATSAPP_API_URL;

const sendWhatsAppMessage = async ({ phoneNumber, documentUrl, filename, name, fieldId }) => {
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
          namespace: null,
          to_and_components: [
            {
              to: [phoneNumber],
              components: {
                header_1: {
                  filename: filename,
                  type: "document",
                  value: documentUrl,
                },
                body_1: {
                  type: "Farmer Name",
                  value: name,
                },
                body_2: {
                  type: "Field Id",
                  value: fieldId,
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
    console.log(error);
    logger.error("Error Sending WhatsApp Message:", error.response?.data || error.message);
    throw new ApiError(500, "Failed to send WhatsApp message.");
  }
};

module.exports = { sendWhatsAppMessage };
