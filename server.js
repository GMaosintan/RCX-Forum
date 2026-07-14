/**
 * RCX论坛 后端邮件服务
 * 端口: 3000
 * 启动: node server.js
 */

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { randomInt } = require('crypto');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const API_KEY = 'forum-api-key-change-me';

// ===== 中间件 =====
app.use(cors());
app.use(express.json());

// API Key 验证中间件
function verifyApiKey(req, res, next) {
    const key = req.headers['x-api-key'];
    if (key !== API_KEY) {
        return res.status(403).json({ success: false, message: '无效的API Key' });
    }
    next();
}

// ===== 数据存储 =====
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function readJSON(filename) {
    const fp = path.join(DATA_DIR, filename);
    if (fs.existsSync(fp)) {
        try { return JSON.parse(fs.readFileSync(fp, 'utf8')); } catch { return null; }
    }
    return null;
}

function writeJSON(filename, data) {
    fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2), 'utf8');
}

// SMTP配置
const SMTP_FILE = 'smtp-config.json';
const DEFAULT_SMTP = {
    host: 'smtp.163.com',
    port: 465,
    user: 'rcxvofficial@163.com',
    pass: 'XP2uMJZavsthsps7',
    secure: true,
    configured: true
};

function getSmtpConfig() {
    return readJSON(SMTP_FILE) || { ...DEFAULT_SMTP };
}

function saveSmtpConfig(config) {
    writeJSON(SMTP_FILE, config);
}

// 验证码存储
const CODES_FILE = 'codes.json';
function getCodes() { return readJSON(CODES_FILE) || {}; }
function saveCodes(codes) { writeJSON(CODES_FILE, codes); }

// 邮件日志
const LOGS_FILE = 'mail-logs.json';
function getLogs() { return readJSON(LOGS_FILE) || []; }
function saveLogs(logs) { writeJSON(LOGS_FILE, logs); }

function addLog(log) {
    const logs = getLogs();
    logs.unshift({ ...log, id: Date.now(), time: new Date().toLocaleString('zh-CN') });
    if (logs.length > 100) logs.length = 100;
    saveLogs(logs);
}

// ===== 邮件发送器 =====
function createTransport() {
    const config = getSmtpConfig();
    if (!config.host || !config.user || !config.pass) return null;
    return nodemailer.createTransport({
        host: config.host,
        port: parseInt(config.port) || 465,
        secure: config.secure !== false,
        auth: { user: config.user, pass: config.pass }
    });
}

async function sendMail(to, subject, html) {
    const transport = createTransport();
    if (!transport) return { success: false, message: 'SMTP未配置' };

    const config = getSmtpConfig();
    try {
        const info = await transport.sendMail({
            from: `"RCX论坛" <${config.user}>`,
            to,
            subject,
            html
        });
        addLog({ to, subject, status: 'success', messageId: info.messageId });
        return { success: true, message: '发送成功' };
    } catch (err) {
        addLog({ to, subject, status: 'failed', error: err.message });
        return { success: false, message: '发送失败: ' + err.message };
    }
}

// ===== API路由 =====

// SMTP配置 - GET
app.get('/api/smtp-config', verifyApiKey, (req, res) => {
    const config = getSmtpConfig();
    res.json({
        success: true,
        host: config.host,
        port: config.port,
        user: config.user,
        configured: config.configured || false
    });
});

// SMTP配置 - POST
app.post('/api/smtp-config', verifyApiKey, (req, res) => {
    const { host, port, user, pass, secure } = req.body;
    if (!host || !user) {
        return res.json({ success: false, message: '缺少必填字段' });
    }
    saveSmtpConfig({ host, port: parseInt(port) || 465, user, pass, secure: secure !== false, configured: true });
    res.json({ success: true, message: 'SMTP配置已保存' });
});

// 测试邮件
app.post('/api/test-email', verifyApiKey, async (req, res) => {
    const { to } = req.body;
    if (!to) return res.json({ success: false, message: '缺少收件人' });
    const result = await sendMail(to, 'RCX论坛 - 邮件测试', `
        <div style="font-family:monospace;padding:20px;background:#1a1a2e;color:#fff;border:2px solid #4CAF50;">
            <h2 style="color:#4CAF50;">RCX论坛</h2>
            <p>这是一封测试邮件，SMTP配置正常工作。</p>
            <p style="color:#888;font-size:12px;">此邮件由系统自动发送，请勿回复。</p>
        </div>
    `);
    res.json(result);
});

// 发送验证码
app.post('/api/send-code', async (req, res) => {
    const { email, type } = req.body;
    if (!email) return res.json({ success: false, message: '缺少邮箱地址' });

    const code = String(randomInt(100000, 999999));
    const codes = getCodes();
    codes[email] = { code, type: type || 'register', time: Date.now(), verified: false };
    saveCodes(codes);

    const result = await sendMail(email, type === 'reset' ? 'RCX论坛 - 密码重置验证码' : 'RCX论坛 - 注册验证码', `
        <div style="font-family:monospace;padding:20px;background:#1a1a2e;color:#fff;border:2px solid #4CAF50;">
            <h2 style="color:#4CAF50;">RCX论坛</h2>
            <p>你的验证码是：</p>
            <div style="font-size:32px;font-weight:bold;color:#FF9800;letter-spacing:8px;padding:16px 0;">${code}</div>
            <p style="color:#888;font-size:12px;">验证码10分钟内有效，请勿泄露给他人。</p>
            <p style="color:#888;font-size:12px;">此邮件由系统自动发送，请勿回复。</p>
        </div>
    `);
    res.json(result);
});

// 验证验证码
app.post('/api/verify-code', (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) return res.json({ success: false, message: '参数不完整' });

    const codes = getCodes();
    const record = codes[email];
    if (!record) return res.json({ success: false, message: '未找到验证码' });
    if (record.verified) return res.json({ success: false, message: '验证码已使用' });
    if (Date.now() - record.time > 600000) {
        delete codes[email];
        saveCodes(codes);
        return res.json({ success: false, message: '验证码已过期' });
    }
    if (record.code !== code) return res.json({ success: false, message: '验证码错误' });

    record.verified = true;
    saveCodes(codes);
    res.json({ success: true, message: '验证成功' });
});

// 联系表单
app.post('/api/contact', verifyApiKey, async (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) return res.json({ success: false, message: '缺少必填字段' });

    const config = getSmtpConfig();
    const result = await sendMail(config.user, `RCX论坛 - 联系反馈: ${subject || '无主题'}`, `
        <div style="font-family:monospace;padding:20px;background:#1a1a2e;color:#fff;border:2px solid #4CAF50;">
            <h2 style="color:#4CAF50;">RCX论坛 - 联系反馈</h2>
            <p><strong>姓名:</strong> ${name}</p>
            <p><strong>邮箱:</strong> ${email}</p>
            <p><strong>主题:</strong> ${subject || '无'}</p>
            <div style="margin-top:16px;padding:16px;background:#2d2d3f;border:2px solid #666;">
                <p>${message.replace(/\n/g, '<br>')}</p>
            </div>
            <p style="color:#888;font-size:12px;margin-top:16px;">此邮件由系统自动发送。</p>
        </div>
    `);
    res.json(result);
});

// 邮件日志
app.get('/api/mail-logs', verifyApiKey, (req, res) => {
    res.json({ success: true, logs: getLogs() });
});

// ===== 启动 =====
app.listen(PORT, () => {
    console.log('');
    console.log('====================================');
    console.log('  RCX论坛 后端邮件服务');
    console.log('  地址: http://localhost:' + PORT);
    console.log('  SMTP: ' + getSmtpConfig().host);
    console.log('  邮箱: ' + getSmtpConfig().user);
    console.log('====================================');
    console.log('');
});
