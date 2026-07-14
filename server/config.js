module.exports = {
    // API 密钥（部署时改为随机字符串）
    apiKey: 'forum-api-key-change-me',
    // SMTP 邮箱配置 - 部署时修改为你的真实配置
    smtp: {
        host: 'smtp.qq.com',        // SMTP 服务器地址（QQ邮箱用 smtp.qq.com，163用 smtp.163.com，Gmail用 smtp.gmail.com）
        port: 465,                   // SSL 端口（QQ/163: 465，Gmail: 587）
        secure: true,                // true for 465, false for 587
        auth: {
            user: 'your_email@qq.com',    // 发件邮箱地址
            pass: 'your_smtp_password'      // SMTP 授权码（不是邮箱密码！）
        }
    },
    // 服务器配置
    server: {
        port: 3000,
        // 允许跨域的前端地址（部署时改为实际域名）
        corsOrigin: '*'
    },
    // 验证码配置
    verify: {
        codeLength: 6,           // 验证码位数
        expireTime: 300000,      // 验证码过期时间（毫秒）5分钟
        cooldownTime: 60000       // 发送冷却时间（毫秒）1分钟
    }
};
