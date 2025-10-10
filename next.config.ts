import type { NextConfig } from "next";
import {hostname} from "node:os";

let nextConfig: NextConfig;
nextConfig = {
    typescript: {
        "ignoreBuildErrors": true,
    },
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*',
            }
        ]
    },
    experimental: {
        ppr: 'incremental',
        after: true
    },
    devIndicators: {
        appIsrStatus: true,
        buildActivity: true,
        buildActivityPosition: 'bottom-right',
    }
};

export default nextConfig;
