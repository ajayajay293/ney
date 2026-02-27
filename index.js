const { Telegraf, Input } = require('telegraf');
const axios = require('axios');

const bot = new Telegraf('8672832381:AAGVVEryDFfUrl5AuLTR_2OHDY0NOjd-fQ0');

bot.start((ctx) => {
    ctx.reply('Halo! Kirimkan link MediaFire, saya akan download dan kirimkan filenya langsung.');
});

bot.on('text', async (ctx) => {
    const messageText = ctx.message.text;

    if (messageText.includes('mediafire.com')) {
        const loadingMsg = await ctx.reply('⋘ 𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑑𝑎𝑡𝑎... ⋙\n█████▒▒▒▒▒50%');

        try {
            // Step 1: Ambil data dari API
            const apiUrl = `https://api.fikmydomainsz.xyz/download/mediafire?url=${encodeURIComponent(messageText)}`;
            const response = await axios.get(apiUrl);
            const res = response.data.result;

            if (response.data.status && res) {
                // Update Progress 80%
                await ctx.telegram.editMessageText(ctx.chat.id, loadingMsg.message_id, null, '⋘ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡... ⋙\n████████▒▒80%');

                // Step 2: Kirim File Langsung
                // Menggunakan URL download langsung dari hasil API
                await ctx.replyWithDocument(
                    { url: res.url, filename: res.filename },
                    { 
                        caption: `✅ **Berhasil di-download!**\n\n📄 Nama: \`${res.filename}\`\n📦 Ukuran: ${res.filesizeH}\n👤 Owner: ${res.owner}`,
                        parse_mode: 'Markdown'
                    }
                );

                // Update Progress 100%
                await ctx.telegram.editMessageText(ctx.chat.id, loadingMsg.message_id, null, '██████████100%\n⋘ ᴛʀʏ ʟᴀᴛᴇʀ... ⋙');

            } else {
                throw new Error('API Error');
            }

        } catch (error) {
            console.error(error);
            await ctx.telegram.editMessageText(ctx.chat.id, loadingMsg.message_id, null, '❌ Gagal memproses file. Pastikan link valid.');
        }
    }
});

bot.launch().then(() => console.log('Bot Download Berjalan...'));
