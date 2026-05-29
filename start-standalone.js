require("dotenv").config({ path: "/var/www/alipayfast/.env" });
console.log("[ENV CHECK]", {
  NODE_ENV: process.env.NODE_ENV,
  BOT: !!process.env.TELEGRAM_BOT_TOKEN,
  MINI: !!process.env.TELEGRAM_MINI_APP_BOT_TOKEN,
  DB: !!process.env.DATABASE_URL,
});

require("/var/www/alipayfast/.next/standalone/server.js");
