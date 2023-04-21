/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
};

module.exports = nextConfig;

module.exports = {
  env: {
    OPENAI_API_KEY: "YOUR_OPEN_AI_API_KEY",
    MYSQL_USER: "legalgpt",
    MYSQL_PASSWORD: "Your sql password, the same you've chosen in schema.sql file",
    MYSQL_DATABASE: "gpt_lawyer",
    JWT_PRIVATE_TOKEN: "oLlTZQlhzKDatlPWD6U71nmAtcf4YjXR",
  },
};
