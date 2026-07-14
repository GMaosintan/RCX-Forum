const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const config = require('./config');

const app = express();
app.use(cors({ origin: config.server.corsOrigin }));
app.use(express.json());

// ===== 数据库持久化 =====
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const DB = {
    file(name) { return path.join(DATA_DIR, `${name}.json`); },
    read(name) {
        try { return JSON.parse(fs.readFileSync(this.file(name), 'utf8')); }
        catch { return null; }
    },
    write(name, data) {
        fs.writeFileSync(this.file(name), JSON.stringify(data, null, 2), 'utf8');
    }
};

// 初始化数据库文件
if (!DB.read('users')) DB.write('users', []);
if (!DB.read('posts')) DB.write('posts', []);
if (!DB.read('mail_logs')) DB.write('mail_logs', []);
if (!DB.read('smtp_config')) DB.write('smtp_config', config.smtp);

// 从数据库加载 SMTP 配置
const savedSmtp = DB.read('smtp_config');
if (savedSmtp) Object.assign(config.smtp, savedSmtp);

// 验证码存储 { email: { code, expireAt, lastSent, failCount } }
const verifyCodes = {};

// 邮件日志操作
function getMailLogs() { return DB.read('mail_logs') || []; }
function addMailLog(entry) {
    const logs = getMailLogs();
    logs.push(entry);
    DB.write('mail_logs', logs);
}

// 开发模式由环境变量控制
const isDev = process.env.NODE_ENV !== 'production';

// 创建邮件传输器
let transporter = null;
if (!isDev || config.smtp.auth.user !== 'your_email@qq.com') {
    try {
        transporter = nodemailer.createTransport(config.smtp);
    } catch (err) {
        console.error('邮件服务初始化失败:', err.message);
    }
}

// API 鉴权中间件（仅保护管理类端点）
const apiKeyAuth = (req, res, next) => {
    const key = req.headers['x-api-key'] || req.query.api_key;
    if (key !== config.apiKey) {
        return res.status(401).json({ success: false, message: '未授权访问' });
    }
    next();
};

// POST /api/send-code - 发送验证码
app.post('/api/send-code', async (req, res) => {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.json({ success: false, message: '邮箱格式不正确' });
    }

    // 检查冷却时间
    const now = Date.now();
    const record = verifyCodes[email];
    if (record && (now - record.lastSent) < config.verify.cooldownTime) {
        const remainSec = Math.ceil((config.verify.cooldownTime - (now - record.lastSent)) / 1000);
        return res.json({ success: false, message: `请${remainSec}秒后再试` });
    }

    // 生成验证码
    const code = String(Math.floor(100000 + Math.random() * 900000)).substring(0, config.verify.codeLength);

    // 存储验证码
    verifyCodes[email] = {
        code,
        expireAt: now + config.verify.expireTime,
        lastSent: now,
        failCount: 0
    };

    // 发送邮件
    if (transporter) {
        try {
            await transporter.sendMail({
                from: `"RCX论坛" <${config.smtp.auth.user}>`,
                to: email,
                subject: '注册验证码',
                html: `
                    <div style="max-width: 480px; margin: 0 auto; padding: 32px; background: #0f0f1a; border-radius: 16px; font-family: 'Inter', -apple-system, sans-serif;">
                        <h2 style="color: #f1f5f9; margin-bottom: 16px;">邮箱验证码</h2>
                        <p style="color: #94a3b8; margin-bottom: 24px;">你正在注册RCX论坛账户，请输入以下验证码完成注册：</p>
                        <div style="background: linear-gradient(135deg, #6366f1, #ec4899); padding: 16px 32px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
                            <span style="font-size: 32px; font-weight: 700; color: #fff; letter-spacing: 8px;">${code}</span>
                        </div>
                        <p style="color: #64748b; font-size: 14px;">验证码 ${Math.floor(config.verify.expireTime / 60000)} 分钟内有效，请勿泄露给他人。</p>
                        <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 24px 0;">
                        <p style="color: #64748b; font-size: 12px;">此邮件由系统自动发送，请勿回复。</p>
                    </div>
                `
            });
            console.log(`验证码已发送至: ${email}`);

            // 记录邮件日志
            addMailLog({
                id: Date.now(),
                to: email,
                code: isDev ? code : '***',
                sentAt: new Date().toISOString(),
                status: 'sent'
            });

            return res.json({ success: true, message: '验证码已发送' });
        } catch (err) {
            console.error('邮件发送失败:', err.message);
            return res.json({ success: false, message: '邮件发送失败，请检查SMTP配置' });
        }
    } else {
        // 无 SMTP 配置时，开发模式下返回验证码（方便测试）
        console.log(`[开发模式] 验证码: ${code} -> ${email}`);

        // 记录邮件日志
        addMailLog({
            id: Date.now(),
            to: email,
            code: code,
            sentAt: new Date().toISOString(),
            status: 'dev_mode'
        });

        return res.json({ success: true, message: '验证码已生成', devCode: code });
    }
});

// POST /api/verify-code - 验证验证码
app.post('/api/verify-code', (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.json({ success: false, message: '参数不完整' });
    }

    const record = verifyCodes[email];
    if (!record) {
        return res.json({ success: false, message: '请先获取验证码' });
    }

    if (Date.now() > record.expireAt) {
        delete verifyCodes[email];
        return res.json({ success: false, message: '验证码已过期，请重新获取' });
    }

    if (record.code !== code) {
        // 暴力破解防护：记录失败次数
        record.failCount = (record.failCount || 0) + 1;
        if (record.failCount >= 5) {
            delete verifyCodes[email];
            return res.json({ success: false, message: '验证失败次数过多，请重新获取验证码' });
        }
        return res.json({ success: false, message: '验证码错误' });
    }

    // 验证成功，重置失败次数并删除已用的验证码
    delete verifyCodes[email];
    return res.json({ success: true, message: '验证成功' });
});

// GET /api/mail-logs - 获取邮件日志（仅开发模式）
if (isDev) {
    app.get('/api/mail-logs', apiKeyAuth, (req, res) => {
        const logs = getMailLogs();
        res.json({ logs: logs.slice(-50) });
    });
}

// ===== SMTP 配置管理 API =====

// GET /api/smtp-config - 获取当前 SMTP 配置（脱敏）
app.get('/api/smtp-config', apiKeyAuth, (req, res) => {
    const { host, port, secure } = config.smtp;
    const user = config.smtp.auth.user;
    const masked = user.includes('@') ? user.substring(0, 2) + '***' + user.split('@')[1] : '***';
    res.json({ host, port, secure, user: masked, configured: user !== 'your_email@qq.com' });
});

// POST /api/smtp-config - 更新 SMTP 配置
app.post('/api/smtp-config', apiKeyAuth, (req, res) => {
    const { host, port, secure, user, pass } = req.body;
    if (host) config.smtp.host = host;
    if (port) config.smtp.port = parseInt(port);
    if (secure !== undefined) config.smtp.secure = secure;
    if (user) config.smtp.auth.user = user;
    if (pass) config.smtp.auth.pass = pass;

    // 持久化 SMTP 配置到数据库
    DB.write('smtp_config', config.smtp);

    // 重新创建 transporter
    try {
        transporter = nodemailer.createTransport(config.smtp);
        res.json({ success: true, message: '配置已更新' });
    } catch (err) {
        res.json({ success: false, message: '配置无效: ' + err.message });
    }
});

// POST /api/test-email - 发送测试邮件
app.post('/api/test-email', apiKeyAuth, async (req, res) => {
    const { to } = req.body;
    if (!transporter) return res.json({ success: false, message: 'SMTP 未配置' });
    if (!to) return res.json({ success: false, message: '请输入收件邮箱' });

    try {
        await transporter.sendMail({
            from: `"极简论坛" <${config.smtp.auth.user}>`,
            to,
            subject: '邮件配置测试',
            html: `<div style="padding:32px;background:#0f0f1a;border-radius:16px;font-family:sans-serif;color:#f1f5f9;">
                <h2 style="margin-bottom:16px;">邮件配置测试成功</h2>
                <p style="color:#94a3b8;">如果你收到这封邮件，说明 SMTP 配置正确。</p>
                <p style="color:#64748b;font-size:14px;margin-top:24px;">发送时间: ${new Date().toLocaleString('zh-CN')}</p>
            </div>`
        });
        res.json({ success: true, message: '测试邮件已发送' });
    } catch (err) {
        res.json({ success: false, message: '发送失败: ' + err.message });
    }
});

// ===== 数据同步 API =====

// POST /api/sync/users - 同步用户数据
app.post('/api/sync/users', apiKeyAuth, (req, res) => {
    const { users } = req.body;
    if (!Array.isArray(users)) return res.status(400).json({ success: false, message: '无效数据' });
    DB.write('users', users);
    res.json({ success: true, message: `已同步 ${users.length} 个用户` });
});

// POST /api/sync/posts - 同步帖子数据
app.post('/api/sync/posts', apiKeyAuth, (req, res) => {
    const { posts } = req.body;
    if (!Array.isArray(posts)) return res.status(400).json({ success: false, message: '无效数据' });
    DB.write('posts', posts);
    res.json({ success: true, message: `已同步 ${posts.length} 个帖子` });
});

// GET /api/sync/users - 获取用户数据
app.get('/api/sync/users', (req, res) => {
    const users = DB.read('users') || [];
    // 返回时脱敏密码
    const safe = users.map(u => ({ ...u, password: '***' }));
    res.json({ users: safe });
});

// GET /api/sync/posts - 获取帖子数据
app.get('/api/sync/posts', (req, res) => {
    const posts = DB.read('posts') || [];
    res.json({ posts });
});

// GET /api/health - 健康检查
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', smtp: !!transporter, time: new Date().toISOString() });
});

app.listen(config.server.port, () => {
    console.log(`========================================`);
    console.log(`  RCX论坛邮件服务已启动`);
    console.log(`  地址: http://localhost:${config.server.port}`);
    console.log(`  模式: ${isDev ? '开发' : '生产'}`);
    console.log(`  SMTP: ${config.smtp.host}:${config.smtp.port}`);
    console.log(`  邮件: ${config.smtp.auth.user}`);
    console.log(`  数据: ${DATA_DIR}`);
    console.log(`========================================`);
});
