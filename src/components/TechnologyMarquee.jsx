<section className="relative w-full overflow-hidden bg-black py-32">

  {/* ===== HEADER LINE ===== */}
  <div className="relative z-10 text-center mb-8 px-6">
    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
      Built on the Infrastructure That Runs the World
    </h2>
  </div>

  {/* ===== EEE CTA ===== */}
  <div className="relative z-10 text-center mb-24 px-6">
    <div className="flex flex-wrap items-center justify-center gap-10 mb-10">
      <span className="eee-pill e1">Enterprise</span>
      <span className="eee-divider">•</span>
      <span className="eee-pill e2">Engineering</span>
      <span className="eee-divider">•</span>
      <span className="eee-pill e3">Ecosystem</span>
    </div>

    <p className="eee-subtext">
      Cloud, security, finance, AI, and platform leaders powering modern digital civilization
    </p>

    <div className="eee-underline" />
  </div>

  {/* ===== FULL-WIDTH MARQUEE ===== */}
  <div className="relative w-screen left-1/2 -translate-x-1/2">
    <div className="marquee-container">
      <div className="marquee-track">
        {[
          /* ===== ALL COMPANIES ===== */
          { name: "AWS", logo: "https://www.vectorlogo.zone/logos/amazon_aws/amazon_aws-ar21.svg" },
          { name: "Google Cloud", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg" },
          { name: "Microsoft Azure", logo: "https://www.vectorlogo.zone/logos/microsoft_azure/microsoft_azure-ar21.svg" },
          { name: "Vercel", logo: "https://www.vectorlogo.zone/logos/vercel/vercel-ar21.svg" },
          { name: "Docker", logo: "https://www.vectorlogo.zone/logos/docker/docker-ar21.svg" },
          { name: "Kubernetes", logo: "https://www.vectorlogo.zone/logos/kubernetes/kubernetes-ar21.svg" },
          { name: "Terraform", logo: "https://www.vectorlogo.zone/logos/terraformio/terraformio-ar21.svg" },
          { name: "PostgreSQL", logo: "https://www.vectorlogo.zone/logos/postgresql/postgresql-ar21.svg" },
          { name: "MongoDB", logo: "https://www.vectorlogo.zone/logos/mongodb/mongodb-ar21.svg" },
          { name: "Redis", logo: "https://www.vectorlogo.zone/logos/redis/redis-ar21.svg" },
          { name: "OpenAI", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg" },
          { name: "Anthropic", logo: "https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg" },
          { name: "NVIDIA", logo: "https://www.vectorlogo.zone/logos/nvidia/nvidia-ar21.svg" },
          { name: "Hugging Face", logo: "https://huggingface.co/front/assets/huggingface_logo.svg" },
          { name: "GitHub", logo: "https://www.vectorlogo.zone/logos/github/github-ar21.svg" },
          { name: "Cloudflare", logo: "https://www.vectorlogo.zone/logos/cloudflare/cloudflare-ar21.svg" },
          { name: "Stripe", logo: "https://www.vectorlogo.zone/logos/stripe/stripe-ar21.svg" },
          { name: "Square", logo: "https://www.vectorlogo.zone/logos/squareup/squareup-ar21.svg" },
          { name: "PayPal", logo: "https://www.vectorlogo.zone/logos/paypal/paypal-ar21.svg" },
          { name: "Visa", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" },
          { name: "Mastercard", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" },
          { name: "American Express", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" },
          { name: "Plaid", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Plaid_logo.svg" },
          { name: "Coinbase", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Coinbase.svg" },
          { name: "CrowdStrike", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/CrowdStrike_logo.svg" },
          { name: "Palo Alto Networks", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Palo_Alto_Networks_logo.svg" },
          { name: "Fortinet", logo: "https://upload.wikimedia.org/wikipedia/commons/6/62/Fortinet_logo.svg" },
          { name: "Zscaler", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Zscaler_logo.svg" },
          { name: "Okta", logo: "https://www.vectorlogo.zone/logos/okta/okta-ar21.svg" },
          { name: "Cisco", logo: "https://www.vectorlogo.zone/logos/cisco/cisco-ar21.svg" },
          { name: "Datadog", logo: "https://www.vectorlogo.zone/logos/datadoghq/datadoghq-ar21.svg" },
          { name: "Grafana", logo: "https://www.vectorlogo.zone/logos/grafana/grafana-ar21.svg" },
          { name: "Netlify", logo: "https://www.vectorlogo.zone/logos/netlify/netlify-ar21.svg" },
          { name: "DigitalOcean", logo: "https://www.vectorlogo.zone/logos/digitalocean/digitalocean-ar21.svg" },
          { name: "GoDaddy", logo: "https://upload.wikimedia.org/wikipedia/commons/3/36/GoDaddy_logo.svg" },
          { name: "Base44", logo: "https://avatars.githubusercontent.com/u/145019558?s=200&v=4" }
        ]
          .flatMap((c) => [c, c, c, c]) /* repeat without tapering */
          .map((c, i) => (
            <div className="logo-item" key={`${c.name}-${i}`}>
              <img
                src={c.logo}
                alt={c.name}
                className="logo-img"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.style.visibility = "hidden";
                }}
              />
            </div>
          ))}
      </div>
    </div>
  </div>

  {/* ===== STYLES ===== */}
  <style>{`
    .eee-pill {
      padding: 0.75rem 1.75rem;
      border-radius: 999px;
      font-size: 1.2rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      background: rgba(255,255,255,0.06);
      backdrop-filter: blur(10px);
    }

    .e1 { color:#60a5fa; box-shadow:0 0 26px rgba(96,165,250,.6); }
    .e2 { color:#a78bfa; box-shadow:0 0 26px rgba(167,139,250,.6); }
    .e3 { color:#34d399; box-shadow:0 0 26px rgba(52,211,153,.6); }

    .eee-divider {
      font-size: 2rem;
      color: rgba(255,255,255,.5);
    }

    .eee-subtext {
      max-width: 980px;
      margin: 0 auto;
      font-size: 1.15rem;
      color: rgba(255,255,255,.75);
    }

    .eee-underline {
      width: 380px;
      height: 3px;
      margin: 24px auto 0;
      background: linear-gradient(90deg, transparent,#60a5fa,#a78bfa,#34d399,transparent);
      box-shadow: 0 0 30px rgba(124,58,237,.8);
    }

    .marquee-container {
      overflow: hidden;
      mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
    }

    .marquee-track {
      display: flex;
      gap: 3.5rem;
      width: max-content;
      animation: marquee-scroll 160s linear infinite;
      padding: 2rem 0;
    }

    .logo-item {
      width: 210px;
      height: 100px;
      display:flex;
      align-items:center;
      justify-content:center;
    }

    .logo-img {
      max-width:100%;
      max-height:100%;
      object-fit:contain;
      filter: brightness(0) invert(1) opacity(.9);
      transition: transform .35s ease, filter .35s ease;
    }

    .logo-item:hover .logo-img {
      transform: scale(1.15);
      filter: brightness(1) invert(0) opacity(1)
        drop-shadow(0 0 26px rgba(99,102,241,.9))
        drop-shadow(0 0 52px rgba(99,102,241,.6));
    }

    @keyframes marquee-scroll {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }
  `}</style>
</section>

