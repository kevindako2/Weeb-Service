import type { NextConfig } from "next";
import {hostname} from "node:os";

const nextConfig: NextConfig = {
    images:{
        dangerouslyAllowSVG: true,
        remotePatterns:[
            {
                protocol: 'https',
                hostname: '*',
            }
        ]
    },
    experimental: {
        ppr: 'incremental'
    },
    devIndicators: {
        appIsrStatus: true,
            buildActivity: true,
            buildActivityPosition: 'bottom-right',
    }
};

export default nextConfig;
