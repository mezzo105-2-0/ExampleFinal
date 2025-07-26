const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const REGEX_DATA = /^\d{4}-\d{2}-\d{2}/;

function sendMessage(chatId, payload) {
  return bot.sendMessage(chatId, payload); //payload deve essere una stringa
}

function setTelegramMessage(payloadWrapper) {
  const payload = payloadWrapper.payload;
  const { ChangeEventHeader, ...fields } = payload;
  const {
    changeType,
    entityName,
    recordIds,
    changedFields = [],
  } = ChangeEventHeader;

  const emojis = {
    CREATE: "🆕",
    UPDATE: "✅",
    DELETE: "❌",
    default: "ℹ️",
  };

  const emoji = emojis[changeType] || emojis.default;
  let message = `${emoji} Azione: ${changeType} su ${entityName}\n\n recordId: ${recordIds[0]}\n\n 📝CAMPI: \n\n`;
  for (let [key, value] of Object.entries(fields)) {
    if (REGEX_DATA.test(value)) {
      const date = new Date(value);
      value = date.toLocaleDateString("it-IT");
      message += `• ${key}: ${value} \n`;
    } else {
      message += `• ${key}: ${value} \n`;
    }
  }
  return message;
}

module.exports = {
  sendMessage,
  setTelegramMessage,
};
