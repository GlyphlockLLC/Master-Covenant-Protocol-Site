import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function TechnologyMarquee() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  /* =========================
     LOGO DATA WITH CATEGORIES
     ========================= */

  const row1 = [
    { name: "AWS", logo: "https://www.vectorlogo.zone/logos/amazon_aws/amazon_aws-ar21.svg", type: "cloud" },
    { name: "Google Cloud", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg", type: "cloud" },
    { name: "Microsoft Azure", logo: "https://www.vectorlogo.zone/logos/microsoft_azure/microsoft_azure-ar21.svg", type: "cloud" },
    { name: "Docker", logo: "https://www.vectorlogo.zone/logos/docker/docker-ar21.svg", type: "dev" },
    { name: "Kubernetes", logo: "https://www.vectorlogo.zone/logos/kubernetes/kubernetes-ar21.svg", type: "dev" },
    { name: "Terraform", logo: "https://www.vectorlogo.zone/logos/terraformio/terraformio-ar21.svg", type: "dev" },
    { name: "PostgreSQL", logo: "https://www.vectorlogo.zone/logos/postgresql/postgresql-ar21.svg", type: "dev" },
    { name: "MongoDB", logo: "https://www.vectorlogo.zone/logos/mongodb/mongodb-ar21.svg", type: "dev" },
    { name: "Redis", logo: "https://www.vectorlogo.zone/logos/redis/redis-ar21.svg", type: "dev" },
    { name: "OpenAI", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg", type: "ai" },
    { name: "Anthropic", logo: "https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg", type: "ai" },
    { name: "Hugging Face", logo: "https://huggingface.co/front/assets/huggingface_logo.svg", type: "ai" },
    { name: "NVIDIA", logo: "https://www.vectorlogo.zone/logos/nvidia/nvidia-ar21.svg", type: "ai" },
    { name: "Cloudflare", logo: "https://www.vectorlogo.zone/logos/cloudflare/cloudflare-ar21.svg", type: "security" },
    { name: "CrowdStrike", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/CrowdStrike_logo.svg", type: "security" },
    { name: "Palo Alto", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Palo_Alto_Networks_logo.svg", type: "security" },
    { name: "Fortinet", logo: "https://upload.wikimedia.org/wikipedia/commons/6/62/Fortinet_logo.svg", type: "security" },
    { name: "Zscaler", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Zscaler_logo.svg", type: "security" }
  ];

  const row2 = [
    { name: "Stripe", logo: "https://logo.clearbit.com/stripe.com", type: "finance" },
    { name: "Square", logo: "https://logo.clearbit.com/squareup.com", type: "finance" },
    { name: "PayPal", logo: "https://www.vectorlogo.zone/logos/paypal/paypal-ar21.svg", type: "finance" },
    { name: "Visa", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg", type: "finance" },
    { name: "Mastercard", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg", type: "finance" },
    { name: "Coinbase", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Coinbase.svg", type: "finance" },
    { name: "Binance", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Binance_Logo.svg", type: "finance" },
    { name: "Plaid", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Plaid_logo.svg", type: "finance" }
  ];

  const row3 = [
    { name: "Apple", logo: "https://www.vectorlogo.zone/logos/apple/apple-ar21.svg", type: "corp" },
    { name: "Microsoft", logo: "https://www.vectorlogo.zone/logos/microsoft/microsoft-ar21.svg", type: "corp" },
    { name: "Google", logo: "https://www.vectorlogo.zone/logos/google/google-ar21.svg", type: "corp" },
    { name: "Amazon", logo: "https://www.vectorlogo.zone/logos/amazon/amazon-ar21.svg", type: "corp" },
    { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg", type: "corp" },
    { name: "Tesla", logo: "https://www.vectorlogo.zone/logos/tesla/tesla-ar21.svg", type: "corp" },
    { name: "SpaceX", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/SpaceX_logo_black.svg", type: "corp" }
  ];

  const repeat = (arr) => [...arr, ...arr, ...arr, ...arr];

  return (
    <div ref={containerRef} className="w-full max-w-7xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9 }}
        className="space-y-4"
      >
        {[row1, row2, row3].map((row, i) => (
          <div key={i} className="marquee-container">
            <div
              className={`marquee ${i % 2 ? "right" : "left"}`}
              style={{ animationDuration: `${90 + i * 20}s` }}
            >
              {repeat(row).map((c, idx) => (
                <div key={`${c.name}-${idx}`} className={`logo-item ${c.type}`}>
                  <img src={c.logo} alt={c.name} className="logo-img" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>

      <style>{`
        .marquee-container {
          overflow: hidden;
          mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
        }

        .marquee {
          display: flex;
          gap: 2rem;
          width: max-content;
          animation: scroll-left linear infinite;
        }

        .marquee.right {
          animation-name: scroll-right;
        }

        .logo-item {
          width: 120px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: transform 0.35s ease;
        }

        .logo-img {
          max-width: 100%;
          max-height: 100%;
          filter: brightness(0) invert(1) opacity(0.65);
          transition: filter 0.35s ease;
        }

        /* HOVER */
        .logo-item:hover {
          transform: scale(1.15) translateY(-2px);
          z-index: 10;
        }

        /* AI – pulse */
        .logo-item.ai {
          animation: ai-pulse 2.4s ease-in-out infinite;
        }

        /* FINANCE – gold */
        .logo-item.finance:hover .logo-img {
          filter: brightness(1) invert(0) opacity(1)
            drop-shadow(0 0 18px rgba(255, 215, 0, 0.9))
            drop-shadow(0 0 36px rgba(255, 215, 0, 0.6));
        }

        /* SECURITY – red */
        .logo-item.security:hover .logo-img {
          filter: brightness(1) invert(0) opacity(1)
            drop-shadow(0 0 18px rgba(255, 60, 60, 0.9))
            drop-shadow(0 0 36px rgba(255, 60, 60, 0.6));
        }

        /* DEFAULT / CLOUD / DEV / CORP */
        .logo-item:hover .logo-img {
          filter: brightness(1) invert(0) opacity(1)
            drop-shadow(0 0 18px rgba(99, 102, 241, 0.9))
            drop-shadow(0 0 36px rgba(99, 102, 241, 0.6));
        }

        @keyframes ai-pulse {
          0%, 100% { filter: drop-shadow(0 0 0 rgba(124,58,237,0)); }
          50% { filter: drop-shadow(0 0 14px rgba(124,58,237,0.6)); }
        }

        @keyframes scroll-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @keyframes scroll-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

