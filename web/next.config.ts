
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,


  experimental: {
    serverActions: {
      allowedOrigins: [
        "laughing-couscous-qjgwx44rp473xq7j-3000.app.github.dev",
        "localhost:3000",
      ],
    },
  },


  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
