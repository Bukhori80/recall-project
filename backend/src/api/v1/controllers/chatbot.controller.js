import * as chatbotService from '../services/chatbot.service.js';

/**
 * Controller untuk menangani pesan masuk dari chatbot
 */
export const handleMessage = async (req, res, next) => {
  try {
    // Frontend akan mengirimkan { "customerId": "C00001", "message": "Halo" }
    const { customerId, message } = req.body;

    if (!customerId || !message) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'customerId dan message wajib diisi' 
      });
    }

    // Panggil "Otak" chatbot untuk memproses pesan
    const replyMessage = await chatbotService.generateReply(customerId, message);

    // Kirim balasan
    res.status(200).json({
      status: 'success',
      customerId: customerId,
      reply: replyMessage // Balasan berupa string
    });

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};