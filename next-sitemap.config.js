/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://signify-fe.vercel.app/",
  generateRobotsTxt: true,
};
