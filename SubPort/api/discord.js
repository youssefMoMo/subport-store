export default async function handler(req, res) {
    const { username } = req.query;
    
    // جلب البيانات من Environment Variables
    const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN; 
    const GUILD_ID = process.env.DISCORD_GUILD_ID; 

    if (!username) return res.status(400).json({ error: 'Username required' });

    try {
        // البحث عن العضو داخل السيرفر
        const response = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/members/search?query=${username}&limit=1`, {
            headers: {
                Authorization: `Bot ${BOT_TOKEN}`
            }
        });

        const data = await response.json();

        if (data.length > 0) {
            const member = data[0].user;
            const avatarId = member.avatar;
            const userId = member.id;
            
            // تكوين رابط الصورة
            let avatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${avatarId}.png`;
            if(!avatarId) avatarUrl = "https://cdn.discordapp.com/embed/avatars/0.png"; 

            return res.json({ 
                valid: true, 
                username: member.username + "#" + member.discriminator,
                avatar: avatarUrl 
            });
        } else {
            return res.json({ valid: false });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Discord API Error' });
    }
}