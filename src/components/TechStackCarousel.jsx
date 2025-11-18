import React from "react";

const row1Companies = [
  { name: "OpenAI", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg", hasText: true },
  { name: "Anthropic", logo: "https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg", hasText: true },
  { name: "Google Cloud", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg", hasText: true },
  { name: "AWS", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg", hasText: true },
  { name: "Azure", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg", hasText: true },
  { name: "Stripe", logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg", hasText: true },
  { name: "MongoDB", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg", hasText: true },
  { name: "PostgreSQL", logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg", hasText: false }
];

const row2Companies = [
  { name: "React", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg", hasText: false },
  { name: "Node.js", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg", hasText: true },
  { name: "Docker", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_%28container_engine%29_logo.svg", hasText: true },
  { name: "Kubernetes", logo: "https://upload.wikimedia.org/wikipedia/commons/3/39/Kubernetes_logo_without_workmark.svg", hasText: false },
  { name: "GitHub", logo: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg", hasText: false },
  { name: "Cloudflare", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Cloudflare_Logo.svg", hasText: true },
  { name: "Vercel", logo: "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png", hasText: false },
  { name: "Redis", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Redis_Logo.svg", hasText: true }
];

export default function TechStackCarousel() {
  const duplicatedRow1 = [...row1Companies, ...row1Companies];
  const duplicatedRow2 = [...row2Companies, ...row2Companies];

  return (
    <div className="w-full py-16 overflow-hidden">
      <div className="text-center mb-12 px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Integrated World-Class Technologies
        </h2>
        <p className="text-lg text-white/70">
          Built on the most trusted platforms in the industry
        </p>
      </div>

      <div className="relative">
        <div className="marquee-row mb-8">
          <div className="marquee-content">
            {duplicatedRow1.map((company, idx) => (
              <div key={idx} className="marquee-item glass-card-dark border-blue-500/30 px-8 py-6 rounded-xl mx-3">
                <img
                  src={company.logo}
                  alt={company.name}
                  className={`h-12 object-contain ${company.hasText ? 'invert brightness-0' : 'invert brightness-0'}`}
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="marquee-row-reverse">
          <div className="marquee-content-reverse">
            {duplicatedRow2.map((company, idx) => (
              <div key={idx} className="marquee-item glass-card-dark border-blue-500/30 px-8 py-6 rounded-xl mx-3">
                <img
                  src={company.logo}
                  alt={company.name}
                  className={`h-12 object-contain ${company.hasText ? 'invert brightness-0' : 'invert brightness-0'}`}
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .marquee-row {
          display: flex;
          overflow: hidden;
          user-select: none;
          gap: 0;
        }

        .marquee-row-reverse {
          display: flex;
          overflow: hidden;
          user-select: none;
          gap: 0;
        }

        .marquee-content {
          display: flex;
          animation: scroll 40s linear infinite;
          gap: 0;
        }

        .marquee-content-reverse {
          display: flex;
          animation: scroll-reverse 40s linear infinite;
          gap: 0;
        }

        .marquee-item {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-reverse {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(0);
          }
        }

        .marquee-row:hover .marquee-content,
        .marquee-row-reverse:hover .marquee-content-reverse {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}