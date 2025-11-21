export default async function handler(req, res) {
    const { username } = req.query;
    // رقم الجروب الخاص بيك
    const GROUP_ID = "9356172"; 

    if (!username) return res.status(400).json({ error: 'Username required' });

    try {
        // 1. البحث عن اللاعب للحصول على ID
        const idResponse = await fetch(`https://users.roblox.com/v1/users/search?keyword=${username}&limit=10`);
        const idData = await idResponse.json();
        
        if (!idData.data || idData.data.length === 0) {
            return res.json({ valid: false }); 
        }

        const userId = idData.data[0].id;
        const exactName = idData.data[0].name;

        // 2. جلب صورة اللاعب (Headshot)
        const thumbResponse = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=true`);
        const thumbData = await thumbResponse.json();
        let avatarUrl = "";
        if(thumbData.data && thumbData.data.length > 0) {
             avatarUrl = thumbData.data[0].imageUrl;
        }

        // 3. التحقق من وجوده في الجروب
        const groupResponse = await fetch(`https://groups.roblox.com/v2/users/${userId}/groups/roles`);
        const groupData = await groupResponse.json();
        
        const isMember = groupData.data.some(group => group.group.id == GROUP_ID);

        return res.json({ 
            valid: true, 
            isMember: isMember,
            avatar: avatarUrl,
            username: exactName 
        });

    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch data' });
    }
}