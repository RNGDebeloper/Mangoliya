// next.config.js
module.exports = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "avt.mkklcdnv6temp.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "mn2.mkklcdnv6temp.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "s4.anilist.co",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "cdn.myanimelist.net",
                port: "",
                pathname: "/**",
            },
        ],
    },
    webpack: (config, { isServer }) => {
        // Ignore source maps for production
        if (!isServer) {
            config.module.rules.push({
                test: /\.map$/,
                use: "ignore-loader",
            });
        }
        return config;
    },
};
