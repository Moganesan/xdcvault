/** @type {import('next').NextConfig} */
const nextConfig = {
  compilerOptions: {
    noEmit: true, // Prevents TypeScript from generating JavaScript output
    skipLibCheck: true, // Skip type checking of declaration files
    // ...
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
