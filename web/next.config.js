/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['rc-util', '@ant-design/icons']); // Transpile both 'rc-util' and '@ant-design/icons'

const nextConfig = {
  reactStrictMode: true,
  // Additional Next.js configuration here
};

module.exports = withTM(nextConfig);
