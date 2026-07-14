// XSS 防护：转义 HTML 特殊字符
function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

// ===== 状态管理 =====
const state = {
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
    users: JSON.parse(localStorage.getItem('users')) || [],
    posts: JSON.parse(localStorage.getItem('posts')) || [],
    mcBindings: JSON.parse(localStorage.getItem('mcBindings')) || {},
    // 点赞和收藏记录
    likes: JSON.parse(localStorage.getItem('likes')) || {},
    favorites: JSON.parse(localStorage.getItem('favorites')) || {},
    currentFilter: 'all',
    currentPage: 'home',
    previousPage: 'home',
    searchQuery: '',
    contactMessages: JSON.parse(localStorage.getItem('contactMessages')) || [],
    currentTeamFilter: 'all',
    currentTheme: localStorage.getItem('currentTheme') || 'dark',
};

// ===== 初始化演示数据 =====
function initDemoData() {
    const now = Date.now();
    const h = 3600000;
    const d = 86400000;

    if (state.users.length === 0) {
        const demoUsers = [
            { username: '林浩宇', email: 'linhaoyu@qq.com', password: '123456', registerTime: Date.now() - 86400000 * 120 },
            { username: '苏雨桐', email: 'suyutong@163.com', password: '123456', registerTime: Date.now() - 86400000 * 95 },
            { username: '陈思远', email: 'chensiyuan@gmail.com', password: '123456', registerTime: Date.now() - 86400000 * 80 },
            { username: '王梓萱', email: 'wangzixuan@outlook.com', password: '123456', registerTime: Date.now() - 86400000 * 60 },
            { username: '赵天佑', email: 'zhaotianyou@qq.com', password: '123456', registerTime: Date.now() - 86400000 * 45 },
            { username: '刘诗涵', email: 'liushihan@163.com', password: '123456', registerTime: Date.now() - 86400000 * 30 },
            { username: '黄子墨', email: 'huangzimo@qq.com', password: '123456', registerTime: Date.now() - 86400000 * 15 },
            { username: '周雅琪', email: 'zhouyaqi@gmail.com', password: '123456', registerTime: Date.now() - 86400000 * 7 }
        ];
        state.users = demoUsers;
        saveUsers();
    }

    if (state.posts.length === 0) {
        const demoPosts = [
            {
                id: now - h * 48,
                title: '记录一下从零开始学Vue3的心路历程',
                content: '三个月前决定转行前端，选择了Vue3作为入门框架。说实话一开始连npm都装不明白，报错一屏幕直接懵了。\n\n但坚持下来后发现Vue的 composition API 写起来真的很舒服，ref和reactive的概念比之前想象的简单。推荐新手从官方文档的教程开始，不要一上来就看视频，先把文档过一遍。\n\n现在独立做了一个小项目，虽然很简陋但成就感爆棚。分享一下我的学习路线：HTML/CSS基础 → JavaScript核心 → Vue3官方教程 → 实战小项目。\n\n如果有同样在学的新手可以一起交流，互相鼓励！',
                author: '林浩宇', authorId: 'linhaoyu@qq.com',
                category: 'tech', topic: '技术学习', isOfficial: false,
                time: now - h * 48, views: 3567, likes: 289,
                comments: [
                    { id: now - h * 46, author: '苏雨桐', content: '加油！我也是转行学的Vue，现在工作半年了，坚持下来真的值得', time: now - h * 46 },
                    { id: now - h * 44, author: '刘诗涵', content: '求分享一下你的小项目链接！正好在找练手的项目参考', time: now - h * 44 },
                    { id: now - h * 40, author: '周雅琪', content: '同转行，在学React。感觉Vue确实对新手更友好一些', time: now - h * 40 }
                ]
            },
            {
                id: now - h * 36,
                title: '一个人去云南旅行了7天，分享真实感受',
                content: '刚结束一个人的云南之旅，昆明→大理→丽江→香格里拉，全程公共交通。\n\n大理古城确实商业化严重，但租个电动车环洱海那种自由感真的无法替代。特别是傍晚骑车到才村码头看日落，整个湖面都是金色的，手机根本拍不出来那种震撼。\n\n丽江古城商业化更严重，但玉龙雪山值得去。高反是真实的，提前吃红景天还是很有用的。我到4500米的时候心跳150，每走一步都喘，但看到冰川的那一刻真的值了。\n\n总花费大概3500左右（不含机票），住的都是青旅或者民宿，一个人出门安全方面要注意但也不用太紧张。',
                author: '苏雨桐', authorId: 'suyutong@163.com',
                category: 'life', topic: '旅行日记', isOfficial: false,
                time: now - h * 36, views: 8923, likes: 1204,
                comments: [
                    { id: now - h * 35, author: '王梓萱', content: '好向往！一个人旅行需要很大的勇气，我也想去但一直不敢', time: now - h * 35 },
                    { id: now - h * 30, author: '赵天佑', content: '香格里拉确实美，我去年8月去的，普达措国家公园也推荐', time: now - h * 30 },
                    { id: now - h * 28, author: '林浩宇', content: '3500七天挺省的了，能分享具体的花销明细吗？', time: now - h * 28 },
                    { id: now - h * 20, author: '黄子墨', content: '去年一个人去了川西，也是公共交通，比跟团舒服太多了', time: now - h * 20 }
                ]
            },
            {
                id: now - h * 30,
                title: '关于论坛新版规则调整的公告',
                content: '各位社区成员好，\n\n经过管理团队讨论，我们对论坛规则做了以下调整，即日起生效：\n\n1. 发帖规范：所有帖子需选择对应分类（技术/生活/创意），并添加适当的话题标签\n2. 互动规则：禁止恶意刷屏和重复发帖，违规帖子将被折叠处理\n3. 评论规范：请友善讨论，禁止人身攻击。违反者将视情节轻重给予警告或禁言\n4. 举报机制：帖子右上角新增举报按钮，遇到违规内容请及时举报\n5. 管理员权限：新增OP管理员角色，拥有最高管理权限\n\n如有任何建议或疑问，欢迎在本帖下方留言，我们会逐一回复。',
                author: 'OP管理', authorId: 'op@forum.com',
                category: 'tech', topic: '官方公告', isOfficial: true,
                time: now - h * 30, views: 12450, likes: 567,
                comments: [
                    { id: now - h * 29, author: '陈思远', content: '支持！论坛风气需要大家一起维护', time: now - h * 29 },
                    { id: now - h * 26, author: '赵天佑', content: '建议增加一个精华帖功能，方便新人查看高质量内容', time: now - h * 26 }
                ]
            },
            {
                id: now - h * 22,
                title: '分享一下我的桌面改造过程，花了不到2000块',
                content: '租房党也能拥有好看的桌面！分享一下改造前后对比。\n\n改造前：房东配的老式木桌，杂乱无章，各种线缠在一起，没有收纳。\n\n改造方案：\n- 买了一个宜家L型桌面（二手闲鱼 280块）\n- 显示器支架 89块（拼多多）\n- 桌面收纳架 65块\n- LED灯带 35块\n- 魔术贴理线器 10块\n- 仿木纹桌垫 45块\n- 小绿植 25块\n\n改造后整个桌面焕然一新，线条干净整洁，晚上开灯氛围感拉满。其实不用花很多钱，关键是规划好收纳和灯光。\n\n有空再写一篇详细的购买清单和安装教程。',
                author: '王梓萱', authorId: 'wangzixuan@outlook.com',
                category: 'life', topic: '生活分享', isOfficial: false,
                time: now - h * 22, views: 6789, likes: 945,
                comments: [
                    { id: now - h * 21, author: '黄子墨', content: '求桌面改造的详细教程！这个预算太良心了', time: now - h * 21 },
                    { id: now - h * 18, author: '周雅琪', content: '宜家二手捡漏是真的香，我上次淘到个书架才50', time: now - h * 18 }
                ]
            },
            {
                id: now - h * 16,
                title: '2026年值得关注的5个技术方向',
                content: '作为在行业待了8年的开发者，分享一些我认为今年值得关注的技术趋势：\n\n1. AI原生开发：不再是简单的AI辅助编程，而是从头开始设计AI驱动的产品。Agent框架、RAG应用会是核心方向\n2. Rust生态爆发：从后端到WebAssembly到嵌入式，Rust正在快速扩张。学习曲线陡峭但性价比极高\n3. 边缘计算与Serverless：随着5G普及，越来越多的计算会从云端下沉到边缘节点\n4. 空间计算：Apple Vision Pro打开的新赛道，虽然目前应用少但长期潜力巨大\n5. 可信计算与隐私：随着数据合规要求越来越严，TEE、零知识证明等方向需求旺盛\n\n技术选型建议：不要追新追热，选择与自己的职业规划和项目需求匹配的方向深入钻研。T型人才比全栈更有竞争力。',
                author: '陈思远', authorId: 'chensiyuan@gmail.com',
                category: 'tech', topic: '行业洞察', isOfficial: true,
                time: now - h * 16, views: 15678, likes: 2134,
                comments: [
                    { id: now - h * 15, author: '林浩宇', content: 'Rust确实值得学，最近在用Tauri替代Electron做桌面应用，包体积小了10倍', time: now - h * 15 },
                    { id: now - h * 12, author: '赵天佑', content: '补充一个：Bun作为Node替代品的性能确实很能打', time: now - h * 12 },
                    { id: now - h * 8, author: '苏雨桐', content: 'AI原生开发这块很有共鸣，最近在做的项目全是围绕LLM展开的', time: now - h * 8 }
                ]
            },
            {
                id: now - h * 10,
                title: '养了一只布偶猫两个月了，记录一下变化',
                content: '两个月前终于下定决心养了一只布偶猫，取名"团子"。\n\n刚接回来的时候团子只有3个月大，特别胆小，躲在沙发底下不肯出来。前三天基本看不见猫，只听到半夜有吃东西的声音。\n\n第一周：开始敢在房间里走了，但有人靠近就跑。用逗猫棒互动时会有反应了。\n\n第二周：开始主动跳上床睡觉了！虽然只在脚边。会用猫砂盆了，完全没教就会。\n\n第四周：开始迎接我下班了！每天开门就能看到它蹲在门口，尾巴翘得高高的。这感觉真的太治愈了。\n\n现在两个月：已经完全适应了，粘人得不行，写代码的时候非要趴在键盘前面。每天早上5点准时踩肚子叫起床。\n\n养猫真的要有耐心，每只猫适应的速度不一样。但等它信任你之后那种感觉太值了。',
                author: '刘诗涵', authorId: 'liushihan@163.com',
                category: 'life', topic: '萌宠日常', isOfficial: false,
                time: now - h * 10, views: 18234, likes: 3456,
                comments: [
                    { id: now - h * 9, author: '王梓萱', content: '啊啊啊团子太可爱了！想看照片！', time: now - h * 9 },
                    { id: now - h * 7, author: '苏雨桐', content: '布偶猫性格确实好，我家的也特别粘人', time: now - h * 7 },
                    { id: now - h * 5, author: '周雅琪', content: '5点踩肚子叫起床太真实了哈哈哈哈，猫的生物钟比闹钟准', time: now - h * 5 },
                    { id: now - h * 3, author: '黄子墨', content: '新手养猫请问有什么推荐的猫粮吗？', time: now - h * 3 }
                ]
            },
            {
                id: now - h * 6,
                title: '用Three.js做了一个太阳系模型，分享制作过程',
                content: '最近在学Three.js，做了一个可以交互的太阳系3D模型。\n\n技术方案：\n- Three.js + OrbitControls 实现旋转缩放\n- 每个星球用ShaderMaterial自定义着色，模拟真实表面纹理\n- 太阳自发光效果用PointLight + Bloom后期处理\n- 行星公转和自转用requestAnimationFrame驱动\n- 点击星球弹出信息面板（名称、直径、公转周期等）\n\n踩过的坑：\n1. Scale问题：太阳系的大小差异太大，需要对数缩放\n2. 轨道线用BufferGeometry + LineLoop绘制，不能直接用Circle\n3. 土星环用RingGeometry + 自定义材质实现透明效果\n4. 移动端触摸事件和OrbitControls冲突需要手动处理\n\n项目已部署，点击我的主页可以在线体验。代码也开源了，欢迎提PR。',
                author: '赵天佑', authorId: 'zhaotianyou@qq.com',
                category: 'tech', topic: '项目分享', isOfficial: false,
                time: now - h * 6, views: 9876, likes: 1567,
                comments: [
                    { id: now - h * 5, author: '陈思远', content: '这个效果太棒了！Three.js学习曲线确实陡，你多久学会的？', time: now - h * 5 },
                    { id: now - h * 4, author: '林浩宇', content: '求源码链接！正好在学WebGL', time: now - h * 4 },
                    { id: now - h * 2, author: '赵天佑', content: '回复楼上：大概学了两周就开始做这个项目了，边做边学效率最高', time: now - h * 2 }
                ]
            },
            {
                id: now - h * 3,
                title: '论坛功能更新日志 - V1.02',
                content: 'V1.02 版本更新内容：\n\n新增功能：\n- 帖子点赞和收藏功能\n- 帖子搜索和分类筛选\n- 个人主页：查看自己发布的帖子、点赞和收藏的帖子\n- OP管理后台新增邮箱配置面板\n- 后端数据持久化（JSON文件数据库）\n\n优化改进：\n- 全面升级苹果毛玻璃视觉效果\n- 页面切换动画优化\n- 管理后台权限分级（admin / superAdmin / opAdmin）\n- XSS安全防护\n- 帖子详情页支持返回来源页面\n\n修复问题：\n- 修复登录/注册页面切换时显示异常\n- 修复管理后台评论面板变量引用错误\n- 修复点赞计数双重来源不一致\n- 修复注册流程步骤指示器重置问题\n\n感谢各位成员的反馈和建议，我们会持续改进。',
                author: 'OP管理', authorId: 'op@forum.com',
                category: 'tech', topic: '官方公告', isOfficial: true,
                time: now - h * 3, views: 4567, likes: 234,
                comments: [
                    { id: now - h * 2, author: '刘诗涵', content: '收藏功能等好久了，终于上线了！', time: now - h * 2 },
                    { id: now - h * 1, author: '黄子墨', content: '毛玻璃效果确实好看，建议加个暗色/亮色主题切换', time: now - h * 1 }
                ]
            },
            {
                id: now - h * 1,
                title: '推荐几个适合程序员的播客频道',
                content: '通勤路上听了很多播客，分享几个觉得质量不错的：\n\n技术类：\n1. 程序人生 - 每期邀请一个资深开发者聊职业经历，最近听了一期聊字节跳动基础架构的，干货很多\n2. Late Night Coding - 两个全栈开发者闲聊，话题从技术到生活都有，适合放松时听\n3. 代码之声 - 偏向基础理论和底层原理，讲编译器、数据库实现之类的，深度很好\n\n综合类：\n4. 忽左忽右 - 硬币设计团队的播客，聊设计和科技的交叉领域\n5. 声东击西 - 虽然不是技术向但选题质量很高，能拓宽视野\n\n建议用1.5倍速听，效率高不少。通勤20分钟正好够听一期的。',
                author: '黄子墨', authorId: 'huangzimo@qq.com',
                category: 'life', topic: '日常推荐', isOfficial: false,
                time: now - h * 1, views: 3456, likes: 567,
                comments: [
                    { id: now - h * 0.5, author: '周雅琪', content: '程序人生确实好，那期聊分布式系统设计的听了三遍', time: now - h * 0.5 }
                ]
            },
            {
                id: now - h * 40,
                title: '分享一下最近读的几本书',
                content: '最近两个月读完了五本书，挑几本特别推荐：\n\n《纳瓦尔宝典》：这不是一本正经的商业书，更像是一个聪明人的碎片化思考合集。关于财富创造和幸福生活的观点很通透，适合反复翻阅。\n\n《系统设计面试》：虽然名字里有"面试"两个字，但内容对日常做架构设计也很有帮助。从负载均衡到分布式缓存讲得很系统。\n\n《置身事内》：讲中国政府与经济发展的关系，用通俗易懂的语言解释了很多政策背后的逻辑。读完对中国经济有了更清晰的理解。\n\n《被讨厌的勇气》：阿德勒心理学的通俗读物。核心观点：很多痛苦来源于人际关系中的过度在意他人评价。读完确实有释然的感觉。\n\n目前在读《芯片战争》，讲半导体产业历史的，节奏感很好，像看小说一样上头。',
                author: '周雅琪', authorId: 'zhouyaqi@gmail.com',
                category: 'life', topic: '读书笔记', isOfficial: false,
                time: now - h * 40, views: 5432, likes: 876,
                comments: [
                    { id: now - h * 38, author: '苏雨桐', content: '纳瓦尔宝典我也推荐！特别是关于杠杆的那段分析', time: now - h * 38 },
                    { id: now - h * 35, author: '陈思远', content: '系统设计面试那本确实好，比网上大多数面试攻略都系统', time: now - h * 35 },
                    { id: now - h * 30, author: '林浩宇', content: '芯片战争已经加到书单了，谢谢推荐', time: now - h * 30 }
                ]
            }
        ];
        state.posts = demoPosts;
        savePosts();

        // 迁移旧帖子的 likes 数据到 state.likes
        state.posts.forEach(post => {
            if (!state.likes[post.id] && post.likes > 0) {
                state.likes[post.id] = ['legacy'];
            }
        });
        saveLikes();
    }

    const adminEmails = ['admin@forum.com', 'super@forum.com', 'op@forum.com'];
    const hasAdmins = adminEmails.every(email => state.users.some(u => u.email === email));
    if (!hasAdmins) {
        const demoAdmins = [
            { username: '管理员小王', email: 'admin@forum.com', password: 'admin123', registerTime: Date.now() - 86400000 * 30, adminRole: 'admin' },
            { username: '高级管理', email: 'super@forum.com', password: 'super123', registerTime: Date.now() - 86400000 * 60, adminRole: 'superAdmin' },
            { username: 'OP管理', email: 'op@forum.com', password: 'op123', registerTime: Date.now() - 86400000 * 90, adminRole: 'opAdmin' }
        ];
        demoAdmins.forEach(admin => {
            if (!state.users.some(u => u.email === admin.email)) {
                state.users.push(admin);
            }
        });
        saveUsers();
    }

    // 迁移旧帖子的 likes 数据到 state.likes
    state.posts.forEach(post => {
        if (!state.likes[post.id] && post.likes > 0) {
            // 将旧数字转为模拟数据（无具体用户）
            state.likes[post.id] = ['legacy'];
        }
    });
    saveLikes();
}

function savePosts() {
    localStorage.setItem('posts', JSON.stringify(state.posts));
}

function saveUsers() {
    localStorage.setItem('users', JSON.stringify(state.users));
}

function saveCurrentUser() {
    localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
}

function saveMcBindings() {
    localStorage.setItem('mcBindings', JSON.stringify(state.mcBindings));
}

function saveLikes() { localStorage.setItem('likes', JSON.stringify(state.likes)); }
function saveFavorites() { localStorage.setItem('favorites', JSON.stringify(state.favorites)); }
function saveContactMessages() { localStorage.setItem('contactMessages', JSON.stringify(state.contactMessages)); }

// ===== MC 用户名验证规则 =====
function validateMcUsername(name) {
    const trimmed = name.trim();
    // Minecraft Java 版用户名：3-16位，仅允许字母、数字、下划线
    if (!/^[a-zA-Z0-9_]{3,16}$/.test(trimmed)) {
        return { valid: false, error: '用户名须为3-16位，仅支持英文字母、数字和下划线' };
    }
    // 检查是否已被其他人绑定
    for (const [email, binding] of Object.entries(state.mcBindings)) {
        if (binding.username === trimmed && email !== state.currentUser.email) {
            return { valid: false, error: '该 Minecraft 用户名已被其他用户绑定' };
        }
    }
    return { valid: true, name: trimmed };
}

// ===== 粒子背景动画 =====
class ParticleBackground {
    constructor() {
        this.canvas = document.getElementById('bgCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resize();
        this.init();
        this.animate();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        const count = Math.min(Math.floor(window.innerWidth / 15), 100);
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                radius: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.1
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`;
            this.ctx.fill();

            // 连线
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - dist / 150)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ===== Toast 通知系统 =====
function showToast({ title, message, type = 'info', duration = 3000 }) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3 3 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        error: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 8l-4 4m0-4l4 4m4-8l-4 4m0 0l4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
        warning: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 6v4M8 12h.01M7.073 2.56l-5.8 10A1.333 1.333 0 002.467 14.667h11.066a1.333 1.333 0 001.194-2.107l-5.8-10a1.333 1.333 0 00-2.334 0z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        info: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 7.333v4M8 4.667h.007M8 14.667A6.667 6.667 0 118 1.333a6.667 6.667 0 010 13.334z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    };

    toast.innerHTML = `
        <div class="toast-icon">${icons[type]}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            ${message ? `<div class="toast-message">${message}</div>` : ''}
        </div>
        <button class="toast-close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M10.5 3.5L3.5 10.5M3.5 3.5l7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
        </button>
    `;

    toast.querySelector('.toast-close').addEventListener('click', () => hideToast(toast));
    container.appendChild(toast);

    if (duration > 0) {
        setTimeout(() => hideToast(toast), duration);
    }
}

function hideToast(toast) {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 300);
}

// ===== 确认模态框 =====
function showConfirmModal({ title, message, onConfirm }) {
    const overlay = document.createElement('div');
    overlay.className = 'admin-modal-overlay';
    overlay.innerHTML = `
        <div class="admin-modal">
            <div class="admin-modal-header">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 6v5M10 13h.01M10 18a8 8 0 100-16 8 8 0 000 16z" stroke="#f59e0b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <h3>${title}</h3>
            </div>
            <div class="admin-modal-body">${message}</div>
            <div class="admin-modal-footer">
                <button class="btn btn-ghost admin-modal-cancel">取消</button>
                <button class="btn btn-primary admin-modal-confirm" style="background: linear-gradient(135deg, #ef4444, #dc2626); box-shadow: 0 4px 15px rgba(239,68,68,0.3);">确认删除</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    // 点击遮罩关闭
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });

    // 取消按钮
    overlay.querySelector('.admin-modal-cancel').addEventListener('click', () => {
        overlay.remove();
    });

    // 确认按钮
    overlay.querySelector('.admin-modal-confirm').addEventListener('click', () => {
        if (typeof onConfirm === 'function') onConfirm();
        overlay.remove();
    });

    return overlay;
}

// ===== 数字动画 =====
function animateNumbers() {
    const numbers = document.querySelectorAll('.stat-number');
    numbers.forEach(el => {
        const target = parseInt(el.dataset.count);
        const duration = 2000;
        const start = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);
            el.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    });
}

// ===== 页面路由 =====
function navigateTo(page) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // 显示目标页面
    const target = document.getElementById(`page-${page}`);
    if (target) {
        target.classList.add('active');
        state.currentPage = page;
    }

    // 更新导航状态
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.page === page);
    });

    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 特殊页面处理
    if (page === 'home') {
        setTimeout(animateNumbers, 300);
        renderHome();
    } else if (page === 'posts') {
        renderAllPosts();
    } else if (page === 'me') {
        if (!state.currentUser) {
            showToast({ title: '请先登录', message: '登录后才能查看个人中心', type: 'warning' });
            navigateTo('login');
            return;
        }
        renderMe();
    } else if (page === 'team') {
        renderTeam();
    } else if (page === 'contact') {
        renderContact();
    } else if (page === 'admin') {
        if (!state.currentUser || !state.currentUser.adminRole) {
            showToast({ title: '无权限访问', message: '仅管理员可进入后台', type: 'warning' });
            return;
        }
        renderAdmin();
    }

    // 更新导航栏显示
    updateNavAuth();
}

// ===== 更新导航栏认证状态 =====
function updateNavAuth() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const userMenu = document.getElementById('userMenu');
    const userAvatar = document.getElementById('userAvatar');
    const adminLink = document.getElementById('adminLink');

    if (state.currentUser) {
        loginBtn.classList.add('hidden');
        registerBtn.classList.add('hidden');
        userMenu.classList.remove('hidden');
        userAvatar.textContent = state.currentUser.username.charAt(0).toUpperCase();
        // 根据管理员角色显示/隐藏管理后台入口
        if (adminLink) {
            if (state.currentUser.adminRole) {
                adminLink.classList.remove('hidden');
            } else {
                adminLink.classList.add('hidden');
            }
        }
    } else {
        loginBtn.classList.remove('hidden');
        registerBtn.classList.remove('hidden');
        userMenu.classList.add('hidden');
        if (adminLink) adminLink.classList.add('hidden');
    }
}

// ===== 时间格式化 =====
function formatTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return new Date(timestamp).toLocaleDateString('zh-CN');
}

// ===== 渲染主页 =====
function renderHome() {
    // 更新hero标题：登录后显示用户名
    const heroTitle = document.getElementById('heroTitle');
    if (heroTitle) {
        if (state.currentUser) {
            heroTitle.textContent = `你好，${state.currentUser.username}`;
        } else {
            heroTitle.textContent = '你好，欢迎来到论坛';
        }
    }

    // 官方最新6条（两排各两个或更多）
    const officialPosts = state.posts.filter(p => p.isOfficial).sort((a,b) => b.time - a.time).slice(0, 6);
    // 用户最新5条
    const userPosts = state.posts.filter(p => !p.isOfficial).sort((a,b) => b.time - a.time).slice(0, 5);

    document.getElementById('homeOfficialList').innerHTML = officialPosts.length > 0
        ? officialPosts.map(p => createPostCard(p)).join('')
        : '<div class="empty-state"><h3>暂无官方公告</h3></div>';

    document.getElementById('homeUserList').innerHTML = userPosts.length > 0
        ? userPosts.map(p => createPostCard(p)).join('')
        : '<div class="empty-state"><h3>暂无用户帖子</h3></div>';

    bindPostCardEvents();
}

// ===== 帖子卡片渲染 =====
function createPostCard(post) {
    const badgesHtml = renderBadges(post.mcName, post.roles);
    const isOfficial = post.isOfficial === true;
    const userEmail = state.currentUser?.email || '';
    const isLiked = state.likes[post.id]?.includes(userEmail);
    const isFavorited = state.favorites[userEmail]?.includes(post.id);
    const likeCount = state.likes[post.id]?.length || 0;

    return `
    <article class="post-card ${isOfficial ? 'post-card-official' : ''}" data-post-id="${post.id}">
        <div class="post-header">
            <div class="post-avatar ${isOfficial ? 'official-avatar' : ''}">
                ${isOfficial ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="currentColor"/></svg>' : post.author.charAt(0)}
            </div>
            <div class="post-meta">
                <div class="post-author-row">
                    <span class="post-author">${escapeHtml(post.author)}</span>
                    ${isOfficial ? '<span class="official-badge">官方</span>' : ''}
                    ${badgesHtml}
                </div>
                <span class="post-time">${formatTime(post.time)}</span>
            </div>
        </div>
        <div class="post-topic-tag">${escapeHtml(post.topic || '未分类')}</div>
        <h3 class="post-title">${escapeHtml(post.title)}</h3>
        <p class="post-excerpt">${escapeHtml(post.content.substring(0, 120))}...</p>
        <div class="post-footer">
            <span class="post-stat">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3.333A6.667 6.667 0 1014.667 10 6.667 6.667 0 008 3.333zM8 5.333v4l2.667 1.333" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                ${post.views}
            </span>
            <span class="post-stat">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 10a1.333 1.333 0 01-1.333 1.333H4.667L2 14V3.333A1.333 1.333 0 013.333 2h9.334A1.333 1.333 0 0114 3.333V10z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                ${post.comments.length}
            </span>
        </div>
        <div class="post-actions">
            <button class="post-action-btn like-btn ${isLiked ? 'liked' : ''}" data-post-id="${post.id}">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="${isLiked ? 'currentColor' : 'none'}"><path d="M8 3.5c-3.5-3.5-8.5 1.5-3.5 6.5L8 13.5l3.5-3.5c5-5 0-10-3.5-6.5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <span class="like-count">${likeCount}</span>
            </button>
            <button class="post-action-btn fav-btn ${isFavorited ? 'favorited' : ''}" data-post-id="${post.id}">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="${isFavorited ? 'currentColor' : 'none'}"><path d="M8 1l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4L8 1z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                收藏
            </button>
        </div>
    </article>
    `;
}

// ===== 帖子卡片事件绑定 =====
function bindPostCardEvents() {
    // 帖子卡片点击进入详情
    document.querySelectorAll('.post-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // 排除点赞/收藏按钮的点击
            if (e.target.closest('.post-action-btn')) return;
            state.previousPage = state.currentPage; // 保存来源页面
            const postId = parseInt(card.dataset.postId);
            showPostDetail(postId);
        });
    });

    // 点赞
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const postId = parseInt(btn.dataset.postId);
            toggleLike(postId);
        });
    });

    // 收藏
    document.querySelectorAll('.fav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const postId = parseInt(btn.dataset.postId);
            toggleFavorite(postId);
        });
    });
}

function toggleLike(postId) {
    if (!state.currentUser) {
        showToast({ title: '请先登录', message: '登录后才能点赞', type: 'warning' });
        return;
    }
    const email = state.currentUser.email;
    if (!state.likes[postId]) state.likes[postId] = [];
    const idx = state.likes[postId].indexOf(email);
    if (idx === -1) {
        state.likes[postId].push(email);
    } else {
        state.likes[postId].splice(idx, 1);
    }
    saveLikes();
    // 刷新当前页面
    refreshCurrentPage();
}

function toggleFavorite(postId) {
    if (!state.currentUser) {
        showToast({ title: '请先登录', message: '登录后才能收藏', type: 'warning' });
        return;
    }
    const email = state.currentUser.email;
    if (!state.favorites[email]) state.favorites[email] = [];
    const idx = state.favorites[email].indexOf(postId);
    if (idx === -1) {
        state.favorites[email].push(postId);
        showToast({ title: '已收藏', type: 'success', duration: 1500 });
    } else {
        state.favorites[email].splice(idx, 1);
        showToast({ title: '已取消收藏', type: 'info', duration: 1500 });
    }
    saveFavorites();
    refreshCurrentPage();
}

function refreshCurrentPage() {
    const page = state.currentPage;
    if (page === 'home') renderHome();
    else if (page === 'posts') renderAllPosts();
    else if (page === 'me') renderMe();
    else if (page === 'team') renderTeam();
    else if (page === 'contact') renderContact();
}

// ===== 渲染全部帖子（帖子页面） =====
function renderAllPosts() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput && searchInput.value !== state.searchQuery) {
        searchInput.value = state.searchQuery;
    }
    const container = document.getElementById('postsAllList');
    let posts = [...state.posts];

    // 筛选
    if (state.currentFilter === 'user') posts = posts.filter(p => !p.isOfficial);
    else if (state.currentFilter === 'official') posts = posts.filter(p => p.isOfficial === true);

    // 搜索
    if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        posts = posts.filter(p => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q));
    }

    posts.sort((a, b) => b.time - a.time);

    container.innerHTML = posts.length > 0
        ? posts.map(p => createPostCard(p)).join('')
        : '<div class="empty-state"><h3>没有找到匹配的帖子</h3><p>试试其他关键词或筛选条件</p></div>';

    bindPostCardEvents();
}

// ===== 渲染个人页面 =====
function renderMe() {
    const container = document.getElementById('meContent');
    if (!state.currentUser) {
        navigateTo('login');
        return;
    }

    const user = state.currentUser;
    const userPosts = state.posts.filter(p => p.authorId === user.email);
    const favIds = state.favorites[user.email] || [];
    const favPosts = state.posts.filter(p => favIds.includes(p.id));
    const likedIds = Object.entries(state.likes).filter(([, users]) => users.includes(user.email)).map(([id]) => parseInt(id));
    const likedPosts = state.posts.filter(p => likedIds.includes(p.id));

    container.innerHTML = `
        <a href="#" class="back-btn" id="backFromMe">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15.833 10H4.167M4.167 10l5.833 5.833M4.167 10l5.833-5.833" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            返回首页
        </a>
        <div class="profile-card">
            <div class="profile-banner"></div>
            <div class="profile-info">
                <div class="profile-avatar-large">${user.username.charAt(0).toUpperCase()}</div>
                <div class="profile-details">
                    <div class="profile-name-section">
                        <h2>${escapeHtml(user.username)}</h2>
                        <p class="profile-email">${escapeHtml(user.email)}</p>
                    </div>
                </div>
            </div>
            <div class="profile-info-grid" style="padding: 0 32px 32px;">
                <div class="profile-info-item">
                    <div class="profile-info-label">论坛注册时间</div>
                    <div class="profile-info-value accent">${user.registerTime ? new Date(user.registerTime).toLocaleDateString('zh-CN') : '未知'}</div>
                </div>
                <div class="profile-info-item">
                    <div class="profile-info-label">发布帖子</div>
                    <div class="profile-info-value">${userPosts.length}</div>
                </div>
                <div class="profile-info-item">
                    <div class="profile-info-label">收藏帖子</div>
                    <div class="profile-info-value">${favPosts.length}</div>
                </div>
                <div class="profile-info-item">
                    <div class="profile-info-label">点赞帖子</div>
                    <div class="profile-info-value">${likedPosts.length}</div>
                </div>
            </div>
        </div>

        // MC绑定显示
        ${user.mcName ? `
<div style="padding: 0 32px 16px;">
    <div style="padding: 16px; background: var(--surface); border-radius: var(--radius-sm); border: 1px solid var(--glass-border); backdrop-filter: var(--blur);">
        <div style="display:flex;align-items:center;gap:10px;">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="1" width="4" height="4" rx="0.5"/><rect x="10" y="1" width="4" height="4" rx="0.5"/><rect x="2" y="7" width="4" height="4" rx="0.5"/><rect x="10" y="7" width="4" height="4" rx="0.5"/><rect x="2" y="13" width="4" height="2" rx="0.5"/><rect x="10" y="13" width="4" height="2" rx="0.5"/></svg>
            <span style="color:var(--text-secondary);font-size:0.9rem;">Minecraft: <strong style="color:var(--primary-light);">${user.mcName}</strong></span>
        </div>
    </div>
</div>
` : ''}

        // 管理员入口
        ${user.adminRole ? `
<div style="padding: 0 32px 24px;">
    <button class="btn btn-primary btn-full" id="meAdminBtn" style="max-width:280px;">
        进入管理后台
    </button>
</div>
` : ''}

        <div class="me-tabs">
            <button class="me-tab active" data-tab="my-posts">我的帖子 (${userPosts.length})</button>
            <button class="me-tab" data-tab="my-likes">点赞 (${likedPosts.length})</button>
            <button class="me-tab" data-tab="my-favs">收藏 (${favPosts.length})</button>
        </div>

        <div class="me-tab-content active" id="tab-my-posts">
            ${userPosts.length > 0 ? userPosts.map(p => createPostCard(p)).join('') : '<div class="empty-state"><h3>还没有发布帖子</h3></div>'}
        </div>
        <div class="me-tab-content" id="tab-my-likes">
            ${likedPosts.length > 0 ? likedPosts.map(p => createPostCard(p)).join('') : '<div class="empty-state"><h3>还没有点赞帖子</h3></div>'}
        </div>
        <div class="me-tab-content" id="tab-my-favs">
            ${favPosts.length > 0 ? favPosts.map(p => createPostCard(p)).join('') : '<div class="empty-state"><h3>还没有收藏帖子</h3></div>'}
        </div>
    `;

    // 绑定返回
    document.getElementById('backFromMe').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('home');
    });

    // 绑定 Tab 切换
    container.querySelectorAll('.me-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            container.querySelectorAll('.me-tab').forEach(t => t.classList.remove('active'));
            container.querySelectorAll('.me-tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
        });
    });

    const adminBtn = document.getElementById('meAdminBtn');
    if (adminBtn) {
        adminBtn.addEventListener('click', () => {
            renderAdmin();
            navigateTo('admin');
        });
    }

    bindPostCardEvents();
}

// ===== 管理人员列表 =====
function renderTeam() {
    const container = document.getElementById('teamGrid');
    const statsContainer = document.getElementById('teamStats');
    let users = [...state.users];
    
    // 只显示管理员
    users = users.filter(u => u.adminRole);
    
    // 统计
    const totalAdmins = users.length;
    const totalPosts = state.posts.length;
    const totalLikes = Object.values(state.likes).reduce((sum, arr) => sum + arr.length, 0);
    
    statsContainer.innerHTML = `
        <div class="team-stat-item"><span class="stat-number">${totalAdmins}</span><span class="stat-label">管理员</span></div>
        <div class="team-stat-item"><span class="stat-number">${totalPosts}</span><span class="stat-label">帖子</span></div>
        <div class="team-stat-item"><span class="stat-number">${totalLikes}</span><span class="stat-label">点赞</span></div>
    `;
    
    container.innerHTML = users.map(u => {
        const postCount = state.posts.filter(p => p.authorId === u.email).length;
        const adminLabel = u.adminRole === 'opAdmin' ? '超级管理员' : (u.adminRole === 'superAdmin' ? '高级管理员' : '管理员');
        
        return `
        <div class="team-card">
            <div class="team-card-avatar admin-avatar">${escapeHtml(u.username.charAt(0))}</div>
            <div class="team-card-name">${escapeHtml(u.username)}</div>
            <div class="team-card-email">${escapeHtml(u.email)}</div>
            <span class="team-card-role role-admin">${adminLabel}</span>
            ${u.mcName ? `<div style="margin-top:8px;font-size:0.78rem;color:var(--text-muted);">MC: ${escapeHtml(u.mcName)}</div>` : ''}
            <div class="team-card-stats">
                <div class="team-card-stat"><strong>${postCount}</strong>帖子</div>
                <div class="team-card-stat"><strong>${u.registerTime ? Math.floor((Date.now() - u.registerTime) / 86400000) : 0}</strong>天</div>
            </div>
        </div>`;
    }).join('');
}

// ===== 联系页面 =====
function renderContact() {
    const msgSection = document.getElementById('messagesSection');
    const msgList = document.getElementById('messagesList');
    
    // 显示历史留言
    if (state.contactMessages.length > 0) {
        msgSection.style.display = 'block';
        msgList.innerHTML = state.contactMessages.slice().reverse().map(m => `
            <div class="message-card">
                <div class="message-card-header">
                    <span class="message-card-author">${escapeHtml(m.name)} <span style="color:var(--text-muted);font-weight:400;font-size:0.78rem;">&lt;${escapeHtml(m.email)}&gt;</span></span>
                    <span class="message-card-time">${formatTime(m.time)}</span>
                </div>
                <div class="message-card-subject">${escapeHtml(m.subject)}</div>
                <div class="message-card-body">${escapeHtml(m.message)}</div>
            </div>
        `).join('');
    }
    
    // 绑定表单
    const form = document.getElementById('contactForm');
    if (form && !form._bindDone) {
        form._bindDone = true;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmailInput').value.trim();
            const subject = document.getElementById('contactSubject').value.trim();
            const message = document.getElementById('contactMessage').value.trim();
            
            if (!name || !email || !subject || !message) {
                showToast({ title: '请填写完整信息', type: 'warning' });
                return;
            }
            
            // 保存留言
            state.contactMessages.push({
                id: Date.now(),
                name, email, subject, message,
                time: Date.now()
            });
            saveContactMessages();
            
            // 尝试通过后端发送邮件（失败不影响）
            fetch('http://localhost:3000/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-API-Key': 'forum-api-key-change-me' },
                body: JSON.stringify({ name, email, subject, message })
            }).catch(() => {});
            
            form.reset();
            showToast({ title: '留言已发送', message: '感谢你的反馈！', type: 'success' });
            renderContact();
        });
    }
}

function getCategoryName(category) {
    const names = { tech: '技术', life: '生活', creative: '创意', other: '其他' };
    return names[category] || category;
}

// ===== 显示帖子详情 =====
function showPostDetail(postId, isRefresh = false) {
    const post = state.posts.find(p => p.id === postId);
    if (!post) return;

    // 仅首次进入增加浏览量，评论刷新不增加
    if (!isRefresh) {
        post.views++;
        savePosts();
    }

    const detailContainer = document.getElementById('postDetail');
    const postBadges = renderBadges(post.mcName, post.roles);
    const userEmail = state.currentUser?.email || '';
    const isLiked = state.likes[post.id]?.includes(userEmail);
    const isFavorited = state.favorites[userEmail]?.includes(post.id);
    const likeCount = state.likes[post.id]?.length || 0;
    const commentsHtml = post.comments.length > 0 ? post.comments.map(c => {
        const cBadges = renderBadges(c.mcName, c.roles);
        return `
                    <div class="comment-item">
                        <div class="comment-header">
                            <div class="post-avatar">${escapeHtml(c.author).charAt(0)}</div>
                            <div>
                                <div class="post-author">${escapeHtml(c.author)}${cBadges}</div>
                                <div class="post-time">${formatTime(c.time)}</div>
                            </div>
                        </div>
                        <div class="comment-content">${escapeHtml(c.content)}</div>
                    </div>
                `;
    }).join('') : '<p style="color: var(--text-muted); text-align: center; padding: 20px;">暂无评论，来发表第一条评论吧！</p>';

    detailContainer.innerHTML = `
        <a href="#" class="back-btn" id="backToHome">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15.833 10H4.167M4.167 10l5.833 5.833M4.167 10l5.833-5.833" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            返回列表
        </a>
        <div class="post-detail-header">
            <div class="post-topic-tag">${escapeHtml(post.topic || '未分类')}</div>
            <h1 class="post-detail-title">${escapeHtml(post.title)}</h1>
            <div class="post-detail-meta">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div class="post-avatar">${escapeHtml(post.author).charAt(0)}</div>
                    <div>
                        <div class="post-author-row">
                            <span class="post-author">${escapeHtml(post.author)}</span>
                            ${post.isOfficial ? '<span class="official-badge">官方</span>' : ''}
                            ${postBadges}
                        </div>
                        <div class="post-time">${formatTime(post.time)}</div>
                    </div>
                </div>
                <span class="post-category ${post.category}">${getCategoryName(post.category)}</span>
            </div>
        </div>
        <div class="post-detail-content">
            ${post.content.split('\n').map(p => p.trim() ? `<p>${escapeHtml(p)}</p>` : '').join('')}
        </div>
        <div class="post-actions" style="margin: 24px 0;">
            <button class="post-action-btn like-btn ${isLiked ? 'liked' : ''}" data-post-id="${post.id}">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="${isLiked ? 'currentColor' : 'none'}"><path d="M8 3.5c-3.5-3.5-8.5 1.5-3.5 6.5L8 13.5l3.5-3.5c5-5 0-10-3.5-6.5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <span class="like-count">${likeCount}</span>
            </button>
            <button class="post-action-btn fav-btn ${isFavorited ? 'favorited' : ''}" data-post-id="${post.id}">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="${isFavorited ? 'currentColor' : 'none'}"><path d="M8 1l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4L8 1z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                收藏
            </button>
        </div>
        <div class="comments-section">
            <div class="comments-header">评论 (${post.comments.length})</div>
            <div class="comment-form">
                <div class="comment-input-wrapper">
                    <textarea placeholder="写下你的评论..." id="commentInput"></textarea>
                    <button class="btn btn-primary" id="submitComment" style="height: fit-content;">发送</button>
                </div>
            </div>
            <div class="comments-list">
                ${commentsHtml}
            </div>
        </div>
    `;

    // 绑定返回按钮
    document.getElementById('backToHome').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(state.previousPage || 'posts');
    });

    // 绑定评论提交
    document.getElementById('submitComment').addEventListener('click', () => {
        const input = document.getElementById('commentInput');
        const content = input.value.trim();

        if (!content) {
            showToast({ title: '请输入评论内容', type: 'warning' });
            return;
        }

        if (!state.currentUser) {
            showToast({ title: '请先登录', message: '登录后才能发表评论', type: 'warning' });
            navigateTo('login');
            return;
        }

        const comment = {
            id: Date.now(),
            author: state.currentUser.username,
            mcName: state.currentUser.mcName || null,
            roles: state.currentUser.roles || [],
            content: content,
            time: Date.now()
        };

        post.comments.push(comment);
        savePosts();
        input.value = '';
        showToast({ title: '评论发表成功', type: 'success' });
        showPostDetail(postId, true); // 刷新详情页，不增加浏览量
    });

    // 点赞
    document.querySelectorAll('#postDetail .like-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleLike(parseInt(btn.dataset.postId));
            showPostDetail(postId, true);
        });
    });
    // 收藏
    document.querySelectorAll('#postDetail .fav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(parseInt(btn.dataset.postId));
            showPostDetail(postId, true);
        });
    });

    navigateTo('post');
}

// ===== 发布新帖 =====
function initNewPost() {
    const modal = document.getElementById('newPostModal');
    const openBtn = document.getElementById('newPostBtn');
    const closeBtn = document.getElementById('closeNewPost');
    const cancelBtn = document.getElementById('cancelNewPost');
    const form = document.getElementById('newPostForm');

    openBtn.addEventListener('click', () => {
        if (!state.currentUser) {
            showToast({ title: '请先登录', message: '登录后才能发布帖子', type: 'warning' });
            navigateTo('login');
            return;
        }
        modal.classList.add('active');
    });

    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    cancelBtn.addEventListener('click', () => modal.classList.remove('active'));

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    // 分类选择
    document.querySelectorAll('.category-option').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.category-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const topic = document.getElementById('postTopic').value.trim();
        const title = document.getElementById('postTitleInput').value.trim();
        const content = document.getElementById('postContentInput').value.trim();
        const category = form.querySelector('.category-option.active')?.dataset.category || 'tech';

        if (!title || !content) {
            showToast({ title: '请填写完整信息', type: 'warning' });
            return;
        }

        const isOfficial = !!state.currentUser.adminRole;

        const newPost = {
            id: Date.now(),
            title, content,
            author: state.currentUser.username,
            authorId: state.currentUser.email,
            mcName: state.currentUser.mcName || null,
            roles: state.currentUser.roles || [],
            category,
            topic: topic || '未分类',
            isOfficial,
            time: Date.now(),
            views: 0,
            likes: 0,
            comments: []
        };

        state.posts.unshift(newPost);
        savePosts();

        form.reset();
        document.querySelectorAll('.category-option').forEach(b => b.classList.remove('active'));
        document.querySelector('[data-category="tech"]').classList.add('active');

        modal.classList.remove('active');
        showToast({ title: '发布成功', type: 'success' });
        refreshCurrentPage();
    });
}

// ===== 登录功能 =====
function initLogin() {
    const form = document.getElementById('loginForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        btn.classList.add('loading');

        const inputs = form.querySelectorAll('input');
        const email = inputs[0].value.trim();
        const password = inputs[1].value;

        // 模拟API延迟
        setTimeout(() => {
            const user = state.users.find(u => u.email === email && u.password === password);

            if (user) {
                state.currentUser = { 
                    username: user.username, 
                    email: user.email,
                    registerTime: user.registerTime,
                    mcName: user.mcName || null,
                    roles: user.roles || [],
                    adminRole: user.adminRole || null
                };
                // 确保 currentUser 有 registerTime
                if (!state.currentUser.registerTime) state.currentUser.registerTime = Date.now();
                saveCurrentUser();
                showToast({ title: '登录成功', message: `欢迎回来，${user.username}！`, type: 'success' });
                navigateTo('home');
                form.reset();
            } else {
                showToast({ title: '登录失败', message: '邮箱或密码错误', type: 'error' });
            }

            btn.classList.remove('loading');
        }, 1500);
    });

    // 密码可见切换
    form.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.parentElement.querySelector('input');
            input.type = input.type === 'password' ? 'text' : 'password';
        });
    });
}

// ===== 注册功能（带邮箱验证）=====
// 邮件服务API地址
const EMAIL_API = 'http://localhost:3000';

function initRegister() {
    const sendCodeBtn = document.getElementById('sendCodeBtn');
    const completeBtn = document.getElementById('completeRegisterBtn');
    const resendBtn = document.getElementById('resendCodeBtn');
    const backBtn = document.getElementById('backToStep1');
    const timerSpan = document.getElementById('resendTimer');
    const emailDisplay = document.getElementById('verifyEmailDisplay');

    let regData = {}; // 暂存注册数据
    let resendTimer = null;

    // 密码可见切换
    document.querySelectorAll('#registerForm .toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.parentElement.querySelector('input');
            input.type = input.type === 'password' ? 'text' : 'password';
        });
    });

    // 发送验证码（第一步 → 第二步）
    sendCodeBtn.addEventListener('click', () => {
        const username = document.getElementById('regUsername').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        // 前端验证
        if (!username || username.length < 2) {
            showToast({ title: '请输入用户名（至少2个字符）', type: 'warning' });
            return;
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showToast({ title: '请输入正确的邮箱地址', type: 'warning' });
            return;
        }

        if (password.length < 6) {
            showToast({ title: '密码至少需要6位', type: 'warning' });
            return;
        }

        if (password !== confirmPassword) {
            showToast({ title: '两次输入的密码不一致', type: 'error' });
            return;
        }

        // 暂存数据
        regData = { username, email, password };

        sendCodeBtn.classList.add('loading');
        sendCodeBtn.textContent = '发送中...';

        // 请求后端发送验证码
        fetch(`${EMAIL_API}/api/send-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        })
        .then(res => res.json())
        .then(data => {
            sendCodeBtn.classList.remove('loading');
            sendCodeBtn.textContent = '获取验证码';

            if (data.success) {
                // 开发模式下，如果后端返回了 devCode，显示在控制台
                if (data.devCode) {
                    console.log(`[开发模式] 验证码: ${data.devCode}`);
                    showToast({ title: '验证码已生成', message: `开发模式 - 验证码: ${data.devCode}`, type: 'info', duration: 10000 });
                } else {
                    showToast({ title: '验证码已发送', message: '请查收邮箱', type: 'success' });
                }

                emailDisplay.textContent = email;
                showStep(2);
                startResendTimer();
            } else {
                showToast({ title: '发送失败', message: data.message, type: 'error' });
            }
        })
        .catch(err => {
            sendCodeBtn.classList.remove('loading');
            sendCodeBtn.textContent = '获取验证码';

            // 后端不可用时，进入离线模式（仅用于开发测试）
            console.warn('邮件服务不可用，进入离线验证模式');
            const devCode = String(Math.floor(100000 + Math.random() * 900000));
            console.log(`[离线模式] 验证码: ${devCode}`);
            regData._devCode = devCode;
            showToast({ title: '离线模式', message: `邮件服务未连接，验证码: ${devCode}`, type: 'info', duration: 15000 });

            emailDisplay.textContent = email;
            showStep(2);
            startResendTimer();
        });
    });

    // 完成注册（第二步验证）
    completeBtn.addEventListener('click', () => {
        const codeInputs = document.querySelectorAll('.code-input');
        const code = Array.from(codeInputs).map(i => i.value).join('');

        if (code.length !== 6) {
            showToast({ title: '请输入完整的6位验证码', type: 'warning' });
            return;
        }

        completeBtn.classList.add('loading');
        completeBtn.textContent = '验证中...';

        // 尝试调用后端验证
        if (!regData._devCode) {
            fetch(`${EMAIL_API}/api/verify-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: regData.email, code })
            })
            .then(res => res.json())
            .then(data => {
                completeBtn.classList.remove('loading');
                completeBtn.textContent = '完成注册';

                if (data.success) {
                    completeRegistration();
                } else {
                    showToast({ title: '验证失败', message: data.message, type: 'error' });
                    codeInputs.forEach(i => { i.classList.add('error'); setTimeout(() => i.classList.remove('error'), 400); });
                }
            })
            .catch(err => {
                completeBtn.classList.remove('loading');
                completeBtn.textContent = '完成注册';
                showToast({ title: '验证失败', message: '网络错误', type: 'error' });
            });
        } else {
            // 离线模式验证
            setTimeout(() => {
                completeBtn.classList.remove('loading');
                completeBtn.textContent = '完成注册';

                if (code === regData._devCode) {
                    completeRegistration();
                } else {
                    showToast({ title: '验证码错误', message: '请重新输入', type: 'error' });
                    codeInputs.forEach(i => { i.classList.add('error'); setTimeout(() => i.classList.remove('error'), 400); });
                }
            }, 800);
        }
    });

    // 完成注册
    function completeRegistration() {
        if (state.users.some(u => u.email === regData.email)) {
            showToast({ title: '注册失败', message: '该邮箱已被注册', type: 'error' });
            showStep(1);
            return;
        }

        const newUser = {
            username: regData.username,
            email: regData.email,
            password: regData.password,
            registerTime: Date.now()
        };

        state.users.push(newUser);
        saveUsers();

        state.currentUser = {
            username: newUser.username,
            email: newUser.email,
            registerTime: newUser.registerTime
        };
        saveCurrentUser();

        showToast({ title: '注册成功', message: `欢迎加入，${newUser.username}！`, type: 'success' });
        navigateTo('home');

        // 重置表单
        document.getElementById('regUsername').value = '';
        document.getElementById('regEmail').value = '';
        document.getElementById('regPassword').value = '';
        document.getElementById('regConfirmPassword').value = '';
        document.querySelectorAll('.code-input').forEach(i => i.value = '');
        showStep(1);
        regData = {};
    }

    // 重新发送验证码
    resendBtn.addEventListener('click', () => {
        if (resendTimer) return;

        sendCodeBtn.classList.add('loading');
        sendCodeBtn.textContent = '发送中...';

        fetch(`${EMAIL_API}/api/send-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: regData.email })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                if (data.devCode) {
                    regData._devCode = data.devCode;
                    console.log(`[开发模式] 新验证码: ${data.devCode}`);
                    showToast({ title: '验证码已刷新', message: `开发模式 - 验证码: ${data.devCode}`, type: 'info', duration: 10000 });
                } else {
                    showToast({ title: '验证码已重新发送', type: 'success' });
                }
                startResendTimer();
            } else {
                showToast({ title: '发送失败', message: data.message, type: 'error' });
            }
        })
        .catch(() => {
            const devCode = String(Math.floor(100000 + Math.random() * 900000));
            regData._devCode = devCode;
            console.log(`[离线模式] 新验证码: ${devCode}`);
            showToast({ title: '验证码已刷新', message: `离线模式 - 验证码: ${devCode}`, type: 'info', duration: 10000 });
            startResendTimer();
        });
    });

    // 返回第一步
    backBtn.addEventListener('click', () => showStep(1));

    // 步骤切换
    function showStep(step) {
        const step1 = document.getElementById('registerStep1');
        const step2 = document.getElementById('registerStep2');
        const steps = document.querySelectorAll('.register-step');
        const line = document.querySelector('.step-line');

        if (step === 1) {
            step1.classList.remove('hidden');
            step2.classList.add('hidden');
            steps[0].classList.add('active');
            steps[0].classList.remove('completed');
            steps[1].classList.remove('active');
            line.classList.remove('active');
        } else {
            step1.classList.add('hidden');
            step2.classList.remove('hidden');
            steps[0].classList.remove('active');
            steps[0].classList.add('completed');
            steps[1].classList.add('active');
            line.classList.add('active');
            // 聚焦第一个验证码输入框
            setTimeout(() => document.querySelector('.code-input').focus(), 100);
        }
    }

    // 重新发送倒计时
    function startResendTimer() {
        let seconds = 60;
        resendBtn.disabled = true;
        resendBtn.style.opacity = '0.5';
        resendBtn.style.pointerEvents = 'none';
        timerSpan.textContent = seconds;

        clearInterval(resendTimer);
        resendTimer = setInterval(() => {
            seconds--;
            timerSpan.textContent = seconds;
            if (seconds <= 0) {
                clearInterval(resendTimer);
                resendTimer = null;
                resendBtn.disabled = false;
                resendBtn.style.opacity = '1';
                resendBtn.style.pointerEvents = 'auto';
                timerSpan.textContent = '60';
            }
        }, 1000);
    }

    // 验证码输入框交互（自动跳转下一格、粘贴支持）
    const codeInputs = document.querySelectorAll('.code-input');
    codeInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            const val = e.target.value.replace(/\D/g, '');
            e.target.value = val.charAt(0) || '';
            if (val && index < 5) {
                codeInputs[index + 1].focus();
            }
            input.classList.toggle('filled', !!e.target.value);
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value && index > 0) {
                codeInputs[index - 1].focus();
                codeInputs[index - 1].value = '';
                codeInputs[index - 1].classList.remove('filled');
            }
            if (e.key === 'Enter') {
                completeBtn.click();
            }
        });

        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const paste = (e.clipboardData.getData('text') || '').replace(/\D/g, '').substring(0, 6);
            paste.split('').forEach((char, i) => {
                if (codeInputs[i]) {
                    codeInputs[i].value = char;
                    codeInputs[i].classList.add('filled');
                }
            });
            if (paste.length > 0) codeInputs[Math.min(paste.length, 5)].focus();
        });
    });
}

// ===== 退出登录 =====
function initLogout() {
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        state.currentUser = null;
        localStorage.removeItem('currentUser');
        showToast({ title: '已退出登录', type: 'success' });
        navigateTo('home');
    });
}

// ===== 过滤器 =====
function initFilters() {
    document.querySelectorAll('[data-filter]').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('[data-filter]').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            state.currentFilter = tab.dataset.filter;
            renderAllPosts();
        });
    });

    // 搜索
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let searchTimer;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(() => {
                state.searchQuery = searchInput.value.trim();
                renderAllPosts();
            }, 300);
        });
    }
}

// ===== 导航栏滚动效果 =====
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// ===== 称号/角色徽章系统 =====
const ROLE_CONFIG = {
    admin:      { label: '论坛管理', color: '#ef4444', bg: 'rgba(239,68,68,0.15)', icon: '<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4L8 1z"/></svg>' },
    premium:    { label: '正版绑定', color: '#7cb342', bg: 'rgba(124,179,66,0.15)', icon: '<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="1" width="4" height="4" rx="0.5"/><rect x="10" y="1" width="4" height="4" rx="0.5"/><rect x="2" y="7" width="4" height="4" rx="0.5"/><rect x="10" y="7" width="4" height="4" rx="0.5"/><rect x="2" y="13" width="4" height="2" rx="0.5"/><rect x="10" y="13" width="4" height="2" rx="0.5"/></svg>' },
    contributor:{ label: '贡献者', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', icon: '<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1v14M4 5l4-4 4 4M4 11l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>' },
    serverAdmin:{ label: '服务器管理', color: '#06b6d4', bg: 'rgba(6,182,212,0.15)', icon: '<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M2 4h12v8H2zM3 5v6M13 5v6M4 8h8" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>' }
};

// 管理员角色配置（用于管理权限系统，与上面的论坛身份标识不冲突）
const ADMIN_ROLE_CONFIG = {
    admin:      { label: '管理员', color: '#ef4444', bg: 'rgba(239,68,68,0.15)', icon: '<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4L8 1z"/></svg>' },
    superAdmin: { label: '高级管理', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', icon: '<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0l2.5 5h5.5l-4.5 3.5 1.5 5.5L8 11 2.5 14l1.5-5.5L0 5h5.5L8 0z"/></svg>' },
    opAdmin:    { label: 'OP管理', color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)', icon: '<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M14 4L10 8l4 4M2 4l4 4-4 4M8 2v12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>' }
};

function getMcSvg() {
    return ROLE_CONFIG.premium.icon;
}

function renderBadges(mcName, roles) {
    let html = '';
    if (mcName) {
        html += `<span class="role-badge premium-badge" title="Minecraft 玩家: ${mcName}">${getMcSvg()} <span class="role-badge-text">${mcName}</span></span>`;
    }
    if (roles && roles.length > 0) {
        roles.forEach(role => {
            // 如果已通过 mcName 展示了 MC 用户名徽章，跳过 premium 角色避免重复
            if (mcName && role === 'premium') return;
            const cfg = ROLE_CONFIG[role];
            if (cfg) {
                html += `<span class="role-badge" style="--badge-color: ${cfg.color}; --badge-bg: ${cfg.bg};" title="${cfg.label}">${cfg.icon} <span class="role-badge-text">${cfg.label}</span></span>`;
            }
        });
    }
    return html;
}

// ===== 管理员后台 =====
function renderAdmin() {
    const container = document.getElementById('adminContent');
    if (!state.currentUser || !state.currentUser.adminRole) {
        container.innerHTML = '<div class="empty-state"><h3>无权限访问</h3><p>你不在管理员列表中。</p></div>';
        return;
    }

    const role = state.currentUser.adminRole;
    const roleConfig = ADMIN_ROLE_CONFIG[role] || ADMIN_ROLE_CONFIG.admin;

    // 定义可用面板
    const panels = [];
    if (['admin', 'superAdmin', 'opAdmin'].includes(role)) {
        panels.push({ key: 'comments', label: '评论管理', icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 10a1.333 1.333 0 01-1.333 1.333H4.667L2 14V3.333A1.333 1.333 0 013.333 2h9.334A1.333 1.333 0 0114 3.333V10z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' });
    }
    if (['superAdmin', 'opAdmin'].includes(role)) {
        panels.push({ key: 'posts', label: '帖子管理', icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 2h8a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" stroke-width="1.5"/><path d="M6 6h4M6 9h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' });
        panels.push({ key: 'userdata', label: '用户数据', icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1a7 7 0 100 14A7 7 0 008 1z" stroke="currentColor" stroke-width="1.5"/><path d="M8 5v3l2 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' });
    }
    if (role === 'opAdmin') {
        panels.push({ key: 'users', label: '用户管理', icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 6a3 3 0 100-6 3 3 0 000 6zM14 14v-1a3 3 0 00-3-3H5a3 3 0 00-3 3v1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' });
        panels.push({ key: 'email-config', label: '邮箱配置', icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4l6 4 6-4M1.333 4.667v6.666c0 .737.597 1.334 1.334 1.334h10.666c.737 0 1.334-.597 1.334-1.334V4.667A1.334 1.334 0 0013.333 3.333H2.667A1.334 1.334 0 001.333 4.667z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' });
    }

    container.innerHTML = `
        <div class="admin-layout">
            <aside class="admin-sidebar">
                <div class="admin-sidebar-header">
                    <div class="admin-role-badge" style="--admin-color: ${roleConfig.color}; --admin-bg: ${roleConfig.bg};">
                        ${roleConfig.icon}
                        <span>${roleConfig.label}</span>
                    </div>
                    <div class="admin-sidebar-user">${escapeHtml(state.currentUser.username)}</div>
                </div>
                <nav class="admin-nav">
                    ${panels.map((p, i) => `
                        <a href="#" class="admin-nav-item ${i === 0 ? 'active' : ''}" data-panel="${p.key}">
                            ${p.icon}
                            <span>${p.label}</span>
                        </a>
                    `).join('')}
                </nav>
                <a href="#" class="admin-back-btn" id="adminBackHome">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    返回首页
                </a>
            </aside>
            <div class="admin-content" id="adminPanelContent">
                <!-- 面板内容动态渲染 -->
            </div>
        </div>
    `;

    // 渲染默认面板
    if (panels.length > 0) {
        renderAdminPanel(panels[0].key);
    }

    // 面板导航
    container.querySelectorAll('.admin-nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            container.querySelectorAll('.admin-nav-item').forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            renderAdminPanel(item.dataset.panel);
        });
    });

    // 返回首页
    document.getElementById('adminBackHome').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('home');
    });
}

function renderAdminPanel(panelKey) {
    const content = document.getElementById('adminPanelContent');
    if (!content) return;

    switch (panelKey) {
        case 'comments':
            renderCommentsPanel(content);
            break;
        case 'posts':
            renderPostsPanel(content);
            break;
        case 'userdata':
            renderUserDataPanel(content);
            break;
        case 'users':
            renderUsersPanel(content);
            break;
        case 'email-config':
            renderEmailConfigPanel(content);
            break;
    }
}

function truncate(text, maxLen) {
    if (!text) return '';
    return text.length > maxLen ? text.substring(0, maxLen) + '...' : text;
}

function renderCommentsPanel(container) {
    // 收集所有帖子下的评论
    const allComments = [];
    state.posts.forEach(post => {
        post.comments.forEach(c => {
            allComments.push({ ...c, postId: post.id, postTitle: post.title });
        });
    });
    allComments.sort((a, b) => b.time - a.time);

    container.innerHTML = `
        <div class="admin-header">
            <h2>评论管理</h2>
            <p class="admin-header-desc">共 ${allComments.length} 条评论</p>
        </div>
        ${allComments.length === 0 ? '<div class="empty-state"><h3>暂无评论</h3></div>' : `
        <div class="admin-table-wrapper">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>评论内容</th>
                        <th>所属帖子</th>
                        <th>评论者</th>
                        <th>时间</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    ${allComments.map(c => `
                        <tr>
                            <td class="admin-table-content">${escapeHtml(truncate(c.content, 60))}</td>
                            <td class="admin-table-post">${escapeHtml(truncate(c.postTitle, 20))}</td>
                            <td>${escapeHtml(c.author)}</td>
                            <td>${formatTime(c.time)}</td>
                            <td>
                                <button class="admin-btn-delete" data-post-id="${c.postId}" data-comment-id="${c.id}">
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4h10M5 4V3a1 1 0 011-1h2a1 1 0 011 1v1M11 4v7a1 1 0 01-1 1H4a1 1 0 01-1-1V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                    删除
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        `}`;

    // 绑定删除按钮
    container.querySelectorAll('.admin-btn-delete[data-comment-id]').forEach(btn => {
        btn.addEventListener('click', () => {
            const postId = parseInt(btn.dataset.postId);
            const commentId = parseInt(btn.dataset.commentId);
            showConfirmModal({
                title: '删除评论',
                message: '确定要删除这条评论吗？此操作不可撤销。',
                onConfirm: () => {
                    const post = state.posts.find(p => p.id === postId);
                    if (post) {
                        post.comments = post.comments.filter(c => c.id !== commentId);
                        savePosts();
                        showToast({ title: '评论已删除', type: 'success' });
                        renderCommentsPanel(container);
                    }
                }
            });
        });
    });
}

function renderPostsPanel(container) {
    const posts = [...state.posts].sort((a, b) => b.time - a.time);

    container.innerHTML = `
        <div class="admin-header">
            <h2>帖子管理</h2>
            <p class="admin-header-desc">共 ${posts.length} 篇帖子</p>
        </div>
        ${posts.length === 0 ? '<div class="empty-state"><h3>暂无帖子</h3></div>' : `
        <div class="admin-table-wrapper">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>标题</th>
                        <th>作者</th>
                        <th>分类</th>
                        <th>浏览量</th>
                        <th>评论数</th>
                        <th>发布时间</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    ${posts.map(p => `
                        <tr>
                            <td class="admin-table-content">${escapeHtml(truncate(p.title, 30))}</td>
                            <td>${escapeHtml(p.author)}</td>
                            <td><span class="post-category ${p.category}" style="font-size:0.7rem;padding:2px 8px;">${getCategoryName(p.category)}</span></td>
                            <td>${p.views}</td>
                            <td>${p.comments.length}</td>
                            <td>${formatTime(p.time)}</td>
                            <td>
                                <button class="admin-btn-delete" data-post-id="${p.id}">
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4h10M5 4V3a1 1 0 011-1h2a1 1 0 011 1v1M11 4v7a1 1 0 01-1 1H4a1 1 0 01-1-1V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                    删除
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        `}`;

    content.querySelectorAll('.admin-btn-delete[data-post-id]').forEach(btn => {
        btn.addEventListener('click', () => {
            const postId = parseInt(btn.dataset.postId);
            const post = state.posts.find(p => p.id === postId);
            showConfirmModal({
                title: '删除帖子',
                message: `确定要删除帖子「${post ? truncate(post.title, 30) : ''}」吗？该帖子下的所有评论也将被删除，此操作不可撤销。`,
                onConfirm: () => {
                    state.posts = state.posts.filter(p => p.id !== postId);
                    savePosts();
                    showToast({ title: '帖子已删除', type: 'success' });
                    renderPostsPanel(container);
                }
            });
        });
    });
}

function renderUserDataPanel(container) {
    const totalUsers = state.users.length;
    const totalPosts = state.posts.length;
    const totalComments = state.posts.reduce((sum, p) => sum + p.comments.length, 0);
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const todayUsers = state.users.filter(u => u.registerTime >= todayStart).length;

    container.innerHTML = `
        <div class="admin-header">
            <h2>用户数据</h2>
            <p class="admin-header-desc">查看论坛运营数据概览</p>
        </div>
        <div class="admin-stat-grid">
            <div class="admin-stat-card">
                <div class="admin-stat-icon" style="background: rgba(99,102,241,0.15); color: var(--primary-light);">
                    <svg width="24" height="24" viewBox="0 0 16 16" fill="none"><path d="M6 6a3 3 0 100-6 3 3 0 000 6zM14 14v-1a3 3 0 00-3-3H5a3 3 0 00-3 3v1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <div class="admin-stat-info">
                    <div class="admin-stat-number">${totalUsers}</div>
                    <div class="admin-stat-label">总用户数</div>
                </div>
            </div>
            <div class="admin-stat-card">
                <div class="admin-stat-icon" style="background: rgba(16,185,129,0.15); color: #10b981;">
                    <svg width="24" height="24" viewBox="0 0 16 16" fill="none"><path d="M8 13A5 5 0 108 3a5 5 0 000 10z" stroke="currentColor" stroke-width="1.5"/><path d="M8 6v3l2 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                </div>
                <div class="admin-stat-info">
                    <div class="admin-stat-number">${todayUsers}</div>
                    <div class="admin-stat-label">今日注册</div>
                </div>
            </div>
            <div class="admin-stat-card">
                <div class="admin-stat-icon" style="background: rgba(236,72,153,0.15); color: var(--secondary);">
                    <svg width="24" height="24" viewBox="0 0 16 16" fill="none"><path d="M4 2h8a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" stroke-width="1.5"/><path d="M6 6h4M6 9h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                </div>
                <div class="admin-stat-info">
                    <div class="admin-stat-number">${totalPosts}</div>
                    <div class="admin-stat-label">总帖子数</div>
                </div>
            </div>
            <div class="admin-stat-card">
                <div class="admin-stat-icon" style="background: rgba(6,182,212,0.15); color: var(--accent);">
                    <svg width="24" height="24" viewBox="0 0 16 16" fill="none"><path d="M14 10a1.333 1.333 0 01-1.333 1.333H4.667L2 14V3.333A1.333 1.333 0 013.333 2h9.334A1.333 1.333 0 0114 3.333V10z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <div class="admin-stat-info">
                    <div class="admin-stat-number">${totalComments}</div>
                    <div class="admin-stat-label">总评论数</div>
                </div>
            </div>
        </div>
        <div class="admin-header" style="margin-top:32px;">
            <h2>用户列表</h2>
            <p class="admin-header-desc">所有注册用户（只读）</p>
        </div>
        ${renderUserTable(state.users, false)}
    `;
}

function renderUsersPanel(container) {
    container.innerHTML = `
        <div class="admin-header">
            <h2>用户管理</h2>
            <p class="admin-header-desc">管理论坛用户，可删除用户及其所有数据</p>
        </div>
        <div class="admin-table-wrapper">
            ${renderUserTable(state.users, true)}
        </div>
    `;

    // 绑定删除用户按钮
    container.querySelectorAll('.admin-btn-delete-user').forEach(btn => {
        btn.addEventListener('click', () => {
            const userEmail = btn.dataset.userEmail;
            const user = state.users.find(u => u.email === userEmail);
            if (!user) return;

            // 禁止删除自己
            if (user.email === state.currentUser.email) {
                showToast({ title: '操作失败', message: '不能删除自己的账户', type: 'error' });
                return;
            }

            showConfirmModal({
                title: '删除用户',
                message: `确定要删除用户「${escapeHtml(user.username)}」吗？该用户的所有帖子和评论都将被删除，此操作不可撤销。`,
                onConfirm: () => {
                    const deletedUsername = user.username;
                    const deletedEmail = user.email;
                    // 删除其所有帖子
                    state.posts = state.posts.filter(p => p.authorId !== deletedEmail);
                    // 删除其在其他帖子中的评论（通过用户名匹配）
                    state.posts.forEach(p => {
                        p.comments = p.comments.filter(c => c.author !== deletedUsername);
                    });
                    // 删除用户
                    state.users = state.users.filter(u => u.email !== deletedEmail);
                    // 删除 MC 绑定
                    if (state.mcBindings[deletedEmail]) {
                        delete state.mcBindings[deletedEmail];
                        saveMcBindings();
                    }
                    saveUsers();
                    savePosts();
                    showToast({ title: '用户已删除', type: 'success' });
                    renderUsersPanel(container);
                }
            });
        });
    });
}

function renderEmailConfigPanel(container) {
    container.innerHTML = `
    <div class="admin-content">
        <div class="admin-header">
            <h2>邮箱配置</h2>
            <p style="color:var(--text-secondary);font-size:0.9rem;">配置 SMTP 邮件服务用于发送验证码</p>
        </div>
        <div class="admin-email-config">
            <div class="config-card">
                <h3>SMTP 配置</h3>
                <div class="config-status" id="smtpStatus">
                    <span class="status-dot"></span>
                    <span>检查中...</span>
                </div>
                <div class="form-group">
                    <label>SMTP 服务器</label>
                    <input type="text" id="smtpHost" class="form-input" placeholder="smtp.qq.com">
                </div>
                <div class="form-group">
                    <label>端口</label>
                    <input type="number" id="smtpPort" class="form-input" value="465">
                </div>
                <div class="form-group">
                    <label>发件邮箱</label>
                    <input type="email" id="smtpUser" class="form-input" placeholder="your_email@qq.com">
                </div>
                <div class="form-group">
                    <label>SMTP 授权码</label>
                    <input type="password" id="smtpPass" class="form-input" placeholder="SMTP 授权码（非邮箱密码）">
                </div>
                <div class="config-actions">
                    <button class="btn btn-primary" id="saveSmtpConfig">保存配置</button>
                    <button class="btn btn-ghost" id="testEmailBtn">发送测试邮件</button>
                </div>
            </div>
            <div class="config-card">
                <h3>邮件日志</h3>
                <div id="mailLogList" class="mail-log-list">
                    <div class="empty-state"><p>暂无邮件记录</p></div>
                </div>
            </div>
        </div>
    </div>`;

    // 加载当前配置
    fetch(EMAIL_API + '/api/smtp-config', {
        headers: { 'X-API-Key': 'forum-api-key-change-me' }
    })
        .then(r => r.json())
        .then(data => {
            document.getElementById('smtpHost').value = data.host || '';
            document.getElementById('smtpPort').value = data.port || 465;
            document.getElementById('smtpUser').value = data.user || '';
            const status = document.getElementById('smtpStatus');
            status.innerHTML = data.configured
                ? '<span class="status-dot online"></span><span>已配置</span>'
                : '<span class="status-dot"></span><span>未配置</span>';
        })
        .catch(() => {
            document.getElementById('smtpStatus').innerHTML = '<span class="status-dot"></span><span>服务未连接</span>';
        });

    // 保存配置
    document.getElementById('saveSmtpConfig').addEventListener('click', () => {
        fetch(EMAIL_API + '/api/smtp-config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-API-Key': 'forum-api-key-change-me' },
            body: JSON.stringify({
                host: document.getElementById('smtpHost').value,
                port: document.getElementById('smtpPort').value,
                user: document.getElementById('smtpUser').value,
                pass: document.getElementById('smtpPass').value,
                secure: true
            })
        }).then(r => r.json()).then(data => {
            showToast({ title: data.success ? '保存成功' : '保存失败', message: data.message, type: data.success ? 'success' : 'error' });
        });
    });

    // 测试邮件
    document.getElementById('testEmailBtn').addEventListener('click', () => {
        const to = state.currentUser.email;
        fetch(EMAIL_API + '/api/test-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-API-Key': 'forum-api-key-change-me' },
            body: JSON.stringify({ to })
        }).then(r => r.json()).then(data => {
            showToast({ title: data.success ? '测试邮件已发送' : '发送失败', message: data.message, type: data.success ? 'success' : 'error' });
        });
    });

    // 加载邮件日志
    fetch(EMAIL_API + '/api/mail-logs', {
        headers: { 'X-API-Key': 'forum-api-key-change-me' }
    })
        .then(r => r.json())
        .then(data => {
            const list = document.getElementById('mailLogList');
            if (!data.logs || data.logs.length === 0) {
                list.innerHTML = '<div class="empty-state"><p>暂无邮件记录</p></div>';
            } else {
                list.innerHTML = '<table class="admin-table"><thead><tr><th>收件人</th><th>验证码</th><th>状态</th><th>时间</th></tr></thead><tbody>' +
                    data.logs.reverse().map(l => `<tr><td>${escapeHtml(l.to)}</td><td>${escapeHtml(l.code)}</td><td>${escapeHtml(l.status)}</td><td>${new Date(l.sentAt).toLocaleString('zh-CN')}</td></tr>`).join('') +
                    '</tbody></table>';
            }
        })
        .catch(() => {});
}

function renderUserTable(users, canDelete) {
    if (users.length === 0) {
        return '<div class="empty-state"><h3>暂无用户</h3></div>';
    }

    return `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>用户名</th>
                    <th>邮箱</th>
                    <th>注册时间</th>
                    ${canDelete ? '<th>角色</th>' : '<th>MC绑定名</th><th>称号</th>'}
                    <th>帖子数</th>
                    ${canDelete ? '<th>操作</th>' : ''}
                </tr>
            </thead>
            <tbody>
                ${users.map(u => {
                    const userPosts = state.posts.filter(p => p.authorId === u.email);
                    const rolesStr = (u.roles || []).map(r => ROLE_CONFIG[r]?.label || r).join(', ') || '无';
                    return `
                        <tr>
                            <td>${escapeHtml(u.username)}</td>
                            <td style="color: var(--text-muted);">${escapeHtml(u.email)}</td>
                            <td>${formatTime(u.registerTime)}</td>
                            ${canDelete ? `
                                <td>${u.adminRole ? `<span class="admin-role-badge-sm" style="--admin-color: ${ADMIN_ROLE_CONFIG[u.adminRole]?.color || '#999'}; --admin-bg: ${ADMIN_ROLE_CONFIG[u.adminRole]?.bg || 'rgba(153,153,153,0.15)'};">${ADMIN_ROLE_CONFIG[u.adminRole]?.label || u.adminRole}</span>` : (rolesStr || '普通用户')}</td>
                            ` : `
                                <td>${escapeHtml(u.mcName || '-')}</td>
                                <td>${rolesStr}</td>
                            `}
                            <td>${userPosts.length}</td>
                            ${canDelete ? `
                                <td>
                                    <button class="admin-btn-delete admin-btn-delete-user" data-user-email="${u.email}" ${u.email === state.currentUser.email ? 'disabled title="不能删除自己"' : ''}>
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4h10M5 4V3a1 1 0 011-1h2a1 1 0 011 1v1M11 4v7a1 1 0 01-1 1H4a1 1 0 01-1-1V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                        删除
                                    </button>
                                </td>
                            ` : ''}
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

// ===== 导航链接 =====
function initNavLinks() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(link.dataset.page);
        });
    });

    document.getElementById('loginBtn').addEventListener('click', () => navigateTo('login'));
    document.getElementById('registerBtn').addEventListener('click', () => navigateTo('register'));

    // 主页"查看全部"链接
    document.querySelectorAll('.view-all-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const filter = link.dataset.filter;
            state.currentFilter = filter || 'all';
            navigateTo('posts');
        });
    });

    // 下拉菜单中的链接（使用事件委托）
    document.getElementById('userDropdown').addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        e.preventDefault();
        const page = link.dataset.page;
        if (page === 'profile') {
            if (!state.currentUser) {
                showToast({ title: '请先登录', message: '登录后才能查看个人中心', type: 'warning' });
                navigateTo('login');
                return;
            }
            navigateTo('me');
        } else if (page === 'settings') {
            showToast({ title: '设置', message: '设置功能即将上线', type: 'info' });
        } else if (page === 'admin') {
            renderAdmin();
            navigateTo('admin');
        }
    });
}

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    // 初始化演示数据
    initDemoData();

    // 启动粒子背景
    new ParticleBackground();

    // 初始化所有功能
    initLogin();
    initRegister();
    initLogout();
    initNewPost();
    initFilters();
    initNavbarScroll();
    initNavLinks();

    // 更新导航状态
    updateNavAuth();

    // 渲染帖子
    renderHome();

    // 首页数字动画
    setTimeout(animateNumbers, 500);

    // 欢迎提示
    if (state.currentUser) {
        setTimeout(() => {
            showToast({
                title: `欢迎回来，${state.currentUser.username}！`,
                message: '今天有什么想分享的吗？',
                type: 'info',
                duration: 5000
            });
        }, 1000);
    }
});
