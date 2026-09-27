const { useState, useEffect, useMemo, useRef, useCallback } = React;

const TODAY = new Date("2026-09-27");
const AGENT = window.AGENT;
const CLUSTERS = window.CLUSTERS;
const PROPERTIES = window.PROPERTIES;

/* ---------------------------- helpers ---------------------------- */

const formatAED = (n) =>
  new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED", maximumFractionDigits: 0 }).format(n);

const formatSize = (n) => `${n.toLocaleString()} sqft`;

const clusterName = (id) => CLUSTERS.find((c) => c.id === id)?.name || id;

const isNewListing = (dateStr) => {
  const diff = (TODAY - new Date(dateStr)) / 86400000;
  return diff <= 10;
};

/* ------------------------------ icons ----------------------------- */

const Icon = ({ path, className = "w-5 h-5", strokeWidth = 1.75 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth}
    strokeLinecap="round" strokeLinejoin="round" className={className}>
    {path}
  </svg>
);

const IconSearch = (p) => <Icon {...p} path={<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>} />;
const IconSun = (p) => <Icon {...p} path={<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>} />;
const IconMoon = (p) => <Icon {...p} path={<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />} />;
const IconMenu = (p) => <Icon {...p} path={<><path d="M3 6h18M3 12h18M3 18h18" /></>} />;
const IconX = (p) => <Icon {...p} path={<><path d="M18 6 6 18M6 6l12 12" /></>} />;
const IconBed = (p) => <Icon {...p} path={<><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6" /><path d="M3 12V6a2 2 0 0 1 2-2h4v6" /><path d="M3 18h18M17 12v-2" /></>} />;
const IconBath = (p) => <Icon {...p} path={<><path d="M4 12h16a1 1 0 0 1 1 1v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2a1 1 0 0 1 1-1Z" /><path d="M7 12V6a2 2 0 0 1 3.6-1.2M6 20v1M18 20v1" /></>} />;
const IconRuler = (p) => <Icon {...p} path={<><path d="M3 16 16 3l5 5-13 13-5-5Z" /><path d="m14.5 6.5 1 1M11.5 9.5l1 1M8.5 12.5l1 1" /></>} />;
const IconPhone = (p) => <Icon {...p} path={<path d="M6.6 10.8a15.3 15.3 0 0 0 6.6 6.6l2.2-2.2a1.5 1.5 0 0 1 1.5-.4c1.2.4 2.5.6 3.8.6a1.5 1.5 0 0 1 1.5 1.5V20a1.5 1.5 0 0 1-1.5 1.5C10.5 21.5 2.5 13.5 2.5 3.5A1.5 1.5 0 0 1 4 2h2.7a1.5 1.5 0 0 1 1.5 1.5c0 1.3.2 2.6.6 3.8a1.5 1.5 0 0 1-.4 1.5L6.6 10.8Z" />} />;
const IconMail = (p) => <Icon {...p} path={<><path d="M3.5 5.5h17v13h-17z" /><path d="m3.5 6 8.5 7 8.5-7" /></>} />;
const IconChat = (p) => <Icon {...p} path={<path d="M21 11.5a8.4 8.4 0 0 1-1 4 8.5 8.5 0 0 1-11.4 3.9L3 20l1.1-3.5A8.5 8.5 0 1 1 21 11.5Z" />} />;
const IconChevronLeft = (p) => <Icon {...p} path={<path d="M15 18l-6-6 6-6" />} />;
const IconChevronRight = (p) => <Icon {...p} path={<path d="M9 18l6-6-6-6" />} />;
const IconMapPin = (p) => <Icon {...p} path={<><path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.2" /></>} />;
const IconCheck = (p) => <Icon {...p} path={<path d="M20 6 9 17l-5-5" />} />;
const IconSparkle = (p) => <Icon {...p} path={<path d="M12 3l1.8 4.8L18.6 9l-4.8 1.8L12 15.6l-1.8-4.8L5.4 9l4.8-1.2L12 3ZM19 15l.9 2.3L22 18l-2.1.7L19 21l-.9-2.3L16 18l2.1-.7L19 15Z" />} />;
const IconArrowRight = (p) => <Icon {...p} path={<path d="M5 12h14M13 6l6 6-6 6" />} />;

/* --------------------------- theme toggle -------------------------- */

function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem("valley-theme") || "light");
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try { localStorage.setItem("valley-theme", theme); } catch (e) {}
  }, [theme]);
  return [theme, setTheme];
}

/* ----------------------------- reveal ------------------------------ */

function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${visible ? "is-visible" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* --------------------------- status badge --------------------------- */

const STATUS_STYLES = {
  Available: "bg-emerald-600/90 text-white",
  Rent: "bg-sky-600/90 text-white",
  Sold: "bg-neutral-500/90 text-white",
};

function StatusBadge({ status }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${STATUS_STYLES[status] || "bg-neutral-500 text-white"}`}>
      {status === "Rent" ? "For Rent" : status}
    </span>
  );
}

/* ------------------------------ navbar ------------------------------ */

function Navbar({ theme, setTheme, onNavigate }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { id: "listings", label: "Listings" },
    { id: "clusters", label: "Clusters" },
    { id: "agent", label: "About" },
    { id: "contact", label: "Contact" },
  ];

  const go = (id) => { setOpen(false); onNavigate(id); };

  return (
    <header className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${scrolled ? "bg-sand/90 dark:bg-ink/90 glass shadow-sm" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 md:h-20 flex items-center justify-between">
        <button onClick={() => go("home")} className="flex items-center gap-2 group">
          <span className="text-2xl md:text-3xl font-serif font-semibold tracking-tight gold-gradient-text">The Valley</span>
          <span className="hidden sm:inline text-xs uppercase tracking-[0.2em] text-ink/50 dark:text-sand/50 border-l border-ink/20 dark:border-sand/20 pl-2 ml-1">
            with {AGENT.name.split(" ")[0]} {AGENT.name.split(" ")[1]}
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <button key={l.id} onClick={() => go(l.id)}
              className="text-sm font-medium text-ink/70 dark:text-sand/70 hover:text-gold dark:hover:text-goldlight transition-colors">
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 rounded-full flex items-center justify-center border border-ink/15 dark:border-sand/20 hover:border-gold transition-colors"
          >
            {theme === "dark" ? <IconSun className="w-4 h-4" /> : <IconMoon className="w-4 h-4" />}
          </button>
          <button onClick={() => go("listings")} className="hidden sm:inline-flex items-center gap-1.5 bg-ink dark:bg-gold text-sand dark:text-ink text-sm font-semibold px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
            View Listings
          </button>
          <button className="md:hidden w-9 h-9 flex items-center justify-center" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <IconX className="w-5 h-5" /> : <IconMenu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-sand dark:bg-ink border-t border-ink/10 dark:border-sand/10 px-5 py-4 flex flex-col gap-3 fade-in">
          {links.map((l) => (
            <button key={l.id} onClick={() => go(l.id)} className="text-left text-base font-medium py-1.5">
              {l.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

/* ------------------------------- hero -------------------------------- */

function Hero({ onExplore }) {
  return (
    <section className="relative min-h-[92vh] flex items-end">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2000&auto=format&fit=crop"
          alt="The Valley by Emaar"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pb-16 md:pb-24 pt-40 w-full text-sand">
        <Reveal>
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <IconSparkle className="w-3.5 h-3.5" /> Exclusive Valley Portfolio
          </span>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl leading-[1.05] font-semibold max-w-3xl">
            Discover Life at <span className="gold-gradient-text">The Valley</span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-6 max-w-xl text-base md:text-lg text-sand/85 leading-relaxed">
            A premium Emaar residential destination of family-first clusters, resort-style amenities and
            green open space — curated and represented by {AGENT.name}, dedicated Valley Specialist.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <button onClick={onExplore}
              className="inline-flex items-center gap-2 bg-gold hover:bg-goldlight text-ink font-semibold px-6 py-3.5 rounded-full transition-colors">
              Explore Listings <IconArrowRight className="w-4 h-4" />
            </button>
            <a href={`https://wa.me/${AGENT.whatsapp}`} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 border border-white/30 hover:border-white/60 text-sand font-medium px-6 py-3.5 rounded-full transition-colors">
              <IconChat className="w-4 h-4" /> Speak to {AGENT.name.split(" ")[0]}
            </a>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <div className="mt-14 grid grid-cols-3 max-w-md divide-x divide-white/20 border-t border-white/20 pt-6">
            <div><div className="text-2xl md:text-3xl font-serif font-semibold">{PROPERTIES.length}</div><div className="text-xs text-sand/70 mt-1">Homes Listed</div></div>
            <div className="pl-6"><div className="text-2xl md:text-3xl font-serif font-semibold">{CLUSTERS.length}</div><div className="text-xs text-sand/70 mt-1">Clusters</div></div>
            <div className="pl-6"><div className="text-2xl md:text-3xl font-serif font-semibold">5★</div><div className="text-xs text-sand/70 mt-1">Amenities</div></div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------- filter bar ----------------------------- */

function FilterBar({ filters, setFilters, resultCount }) {
  const { search, cluster, type, status, sort } = filters;
  const update = (patch) => setFilters((f) => ({ ...f, ...patch }));

  return (
    <div className="sticky top-16 md:top-20 z-30 bg-sand/95 dark:bg-ink/95 glass border-b border-ink/10 dark:border-sand/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1">
            <IconSearch className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40 dark:text-sand/40" />
            <input
              value={search}
              onChange={(e) => update({ search: e.target.value })}
              placeholder="Search by property name or cluster…"
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white dark:bg-white/5 border border-ink/15 dark:border-sand/15 text-sm placeholder:text-ink/40 dark:placeholder:text-sand/40 focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <select value={type} onChange={(e) => update({ type: e.target.value })}
              className="text-sm rounded-full bg-white dark:bg-white/5 border border-ink/15 dark:border-sand/15 px-3.5 py-2.5 focus:outline-none focus:border-gold">
              <option value="all">All Types</option>
              <option value="Villa">Villa</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Apartment">Apartment</option>
            </select>

            <select value={status} onChange={(e) => update({ status: e.target.value })}
              className="text-sm rounded-full bg-white dark:bg-white/5 border border-ink/15 dark:border-sand/15 px-3.5 py-2.5 focus:outline-none focus:border-gold">
              <option value="all">All Status</option>
              <option value="Available">Available</option>
              <option value="Rent">For Rent</option>
              <option value="Sold">Sold</option>
            </select>

            <select value={sort} onChange={(e) => update({ sort: e.target.value })}
              className="text-sm rounded-full bg-white dark:bg-white/5 border border-ink/15 dark:border-sand/15 px-3.5 py-2.5 focus:outline-none focus:border-gold">
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="size-desc">Size: Largest First</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar">
          {["all", ...CLUSTERS.map((c) => c.id)].map((id) => (
            <button
              key={id}
              onClick={() => update({ cluster: id })}
              className={`whitespace-nowrap text-xs font-semibold uppercase tracking-wide px-4 py-2 rounded-full border transition-colors ${
                cluster === id
                  ? "bg-ink dark:bg-gold text-sand dark:text-ink border-transparent"
                  : "border-ink/15 dark:border-sand/20 text-ink/60 dark:text-sand/60 hover:border-gold"
              }`}
            >
              {id === "all" ? "All Clusters" : clusterName(id)}
            </button>
          ))}
          <span className="ml-auto pl-3 text-xs text-ink/50 dark:text-sand/50 whitespace-nowrap">
            {resultCount} {resultCount === 1 ? "result" : "results"}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ cluster banner ------------------------------ */

function ClusterBanner({ cluster }) {
  if (!cluster) return null;
  return (
    <Reveal className="max-w-7xl mx-auto px-5 sm:px-8 pt-6">
      <div className="rounded-3xl overflow-hidden grid md:grid-cols-2 border border-ink/10 dark:border-sand/10">
        <div className="relative h-56 md:h-full">
          <img src={cluster.heroImage} alt={cluster.name} className="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div className="p-6 md:p-8 bg-white dark:bg-white/5">
          <div className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">Cluster Spotlight</div>
          <h3 className="font-serif text-3xl mt-2">{cluster.name}</h3>
          <p className="text-sm text-ink/60 dark:text-sand/60 mt-1">{cluster.tagline}</p>
          <p className="text-sm mt-4 leading-relaxed text-ink/80 dark:text-sand/80">{cluster.description}</p>

          <div className="mt-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-ink/50 dark:text-sand/50 mb-2">Amenities</div>
            <div className="flex flex-wrap gap-2">
              {cluster.amenities.map((a) => (
                <span key={a} className="text-xs bg-ink/5 dark:bg-sand/10 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <IconCheck className="w-3 h-3 text-gold" /> {a}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-ink/50 dark:text-sand/50 mb-2">Nearby</div>
            <ul className="text-sm space-y-1 text-ink/70 dark:text-sand/70">
              {cluster.nearby.map((n) => (
                <li key={n} className="flex items-center gap-2"><IconMapPin className="w-3.5 h-3.5 text-gold shrink-0" /> {n}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ------------------------------ property card ------------------------------ */

function PropertyCard({ property, onOpen, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <button onClick={() => onOpen(property)} className="text-left w-full group">
        <div className="rounded-2xl overflow-hidden bg-white dark:bg-white/5 border border-ink/10 dark:border-sand/10 card-hover h-full flex flex-col">
          <div className="relative h-52 img-zoom">
            <img src={property.images[0]} alt={property.name} className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3 flex gap-2">
              <StatusBadge status={property.status} />
              {property.featured && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gold text-ink flex items-center gap-1">
                  <IconSparkle className="w-3 h-3" /> Featured
                </span>
              )}
              {isNewListing(property.listedDate) && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-ink/80 text-sand">New</span>
              )}
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col">
            <div className="flex items-center gap-1.5 text-xs text-gold font-semibold uppercase tracking-wide">
              <IconMapPin className="w-3.5 h-3.5" /> {clusterName(property.cluster)} · {property.type}
            </div>
            <h3 className="font-serif text-xl mt-1.5">{property.name}</h3>

            <div className="flex items-center gap-4 mt-3 text-sm text-ink/60 dark:text-sand/60">
              <span className="flex items-center gap-1.5"><IconBed className="w-4 h-4" /> {property.bedrooms}</span>
              <span className="flex items-center gap-1.5"><IconBath className="w-4 h-4" /> {property.bathrooms}</span>
              <span className="flex items-center gap-1.5"><IconRuler className="w-4 h-4" /> {formatSize(property.size)}</span>
            </div>

            <div className="mt-4 pt-4 border-t border-ink/10 dark:border-sand/10 flex items-center justify-between">
              <span className="font-serif text-lg font-semibold">{formatAED(property.price)}</span>
              <span className="text-xs font-semibold text-gold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Details <IconArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </button>
    </Reveal>
  );
}

/* ------------------------------ featured row ------------------------------ */

function FeaturedRow({ properties, onOpen }) {
  const featured = properties.filter((p) => p.featured);
  if (!featured.length) return null;
  return (
    <Reveal className="max-w-7xl mx-auto px-5 sm:px-8 pt-10">
      <div className="flex items-center gap-2 mb-4">
        <IconSparkle className="w-4 h-4 text-gold" />
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/60 dark:text-sand/60">Featured This Week</h2>
      </div>
      <div className="flex gap-5 overflow-x-auto no-scrollbar pb-2">
        {featured.map((p) => (
          <div key={p.id} className="min-w-[280px] sm:min-w-[320px]">
            <PropertyCard property={p} onOpen={onOpen} />
          </div>
        ))}
      </div>
    </Reveal>
  );
}

/* ------------------------------ property modal ------------------------------ */

function PropertyModal({ property, onClose }) {
  const [imgIdx, setImgIdx] = useState(0);
  useEffect(() => { setImgIdx(0); }, [property]);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setImgIdx((i) => (property ? (i + 1) % property.images.length : i));
      if (e.key === "ArrowLeft") setImgIdx((i) => (property ? (i - 1 + property.images.length) % property.images.length : i));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [property, onClose]);

  if (!property) return null;
  const cluster = CLUSTERS.find((c) => c.id === property.cluster);
  const whatsappMsg = encodeURIComponent(`Hi ${AGENT.name.split(" ")[0]}, I'm interested in ${property.name} (${property.id}) in ${clusterName(property.cluster)}.`);
  const mailSubject = encodeURIComponent(`Inquiry: ${property.name} (${property.id})`);
  const mailBody = encodeURIComponent(`Hi ${AGENT.name.split(" ")[0]},\n\nI'd like more information about ${property.name} in ${clusterName(property.cluster)} (${formatAED(property.price)}).\n\nThanks!`);

  return (
    <div className="fixed inset-0 z-50 fade-in" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 overflow-y-auto py-6 md:py-10 px-4">
        <div className="relative max-w-4xl mx-auto bg-sand dark:bg-ink rounded-3xl overflow-hidden border border-ink/10 dark:border-sand/10 shadow-2xl">
          <button onClick={onClose} aria-label="Close"
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-ink/60 text-sand flex items-center justify-center hover:bg-ink/80">
            <IconX className="w-4 h-4" />
          </button>

          <div className="relative h-64 md:h-96 bg-ink">
            <img src={property.images[imgIdx]} alt={property.name} className="w-full h-full object-cover" />
            {property.images.length > 1 && (
              <>
                <button onClick={() => setImgIdx((i) => (i - 1 + property.images.length) % property.images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center">
                  <IconChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => setImgIdx((i) => (i + 1) % property.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center">
                  <IconChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
                  {property.images.map((_, i) => (
                    <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === imgIdx ? "bg-white" : "bg-white/40"}`} />
                  ))}
                </div>
              </>
            )}
            <div className="absolute top-4 left-4 flex gap-2">
              <StatusBadge status={property.status} />
              {property.featured && <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gold text-ink">Featured</span>}
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-gold font-semibold flex items-center gap-1.5">
                  <IconMapPin className="w-3.5 h-3.5" /> {clusterName(property.cluster)} · {property.type} · {property.id}
                </div>
                <h2 className="font-serif text-3xl md:text-4xl mt-1.5">{property.name}</h2>
              </div>
              <div className="font-serif text-2xl md:text-3xl font-semibold text-right">{formatAED(property.price)}</div>
            </div>

            <div className="flex items-center gap-6 mt-5 py-4 border-y border-ink/10 dark:border-sand/10">
              <span className="flex items-center gap-2 text-sm"><IconBed className="w-4.5 h-4.5" /> {property.bedrooms} Beds</span>
              <span className="flex items-center gap-2 text-sm"><IconBath className="w-4.5 h-4.5" /> {property.bathrooms} Baths</span>
              <span className="flex items-center gap-2 text-sm"><IconRuler className="w-4.5 h-4.5" /> {formatSize(property.size)}</span>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-ink/80 dark:text-sand/80">{property.description}</p>

            <div className="mt-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-ink/50 dark:text-sand/50 mb-2">Key Features</div>
              <div className="flex flex-wrap gap-2">
                {property.features.map((f) => (
                  <span key={f} className="text-xs bg-ink/5 dark:bg-sand/10 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <IconCheck className="w-3 h-3 text-gold" /> {f}
                  </span>
                ))}
              </div>
            </div>

            {cluster && (
              <div className="mt-6 rounded-2xl bg-ink/5 dark:bg-sand/5 p-5">
                <div className="text-xs font-semibold uppercase tracking-wide text-ink/50 dark:text-sand/50 mb-1">About {cluster.name}</div>
                <p className="text-sm text-ink/70 dark:text-sand/70 leading-relaxed">{cluster.tagline} — {cluster.description}</p>
              </div>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              <a href={`https://wa.me/${AGENT.whatsapp}?text=${whatsappMsg}`} target="_blank" rel="noreferrer"
                className="flex-1 min-w-[180px] inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-3 rounded-full transition-colors">
                <IconChat className="w-4 h-4" /> WhatsApp Inquiry
              </a>
              <a href={`mailto:${AGENT.email}?subject=${mailSubject}&body=${mailBody}`}
                className="flex-1 min-w-[180px] inline-flex items-center justify-center gap-2 border border-ink/20 dark:border-sand/20 hover:border-gold font-semibold px-5 py-3 rounded-full transition-colors">
                <IconMail className="w-4 h-4" /> Email Inquiry
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ clusters section ------------------------------ */

function ClustersSection({ onSelectCluster }) {
  return (
    <section id="clusters" className="max-w-7xl mx-auto px-5 sm:px-8 py-20 md:py-28">
      <Reveal>
        <div className="text-xs uppercase tracking-[0.2em] text-gold font-semibold text-center">The Valley Clusters</div>
        <h2 className="font-serif text-4xl md:text-5xl text-center mt-2">Three Ways to Live Here</h2>
        <p className="text-center text-ink/60 dark:text-sand/60 max-w-2xl mx-auto mt-4 text-sm md:text-base">
          Each cluster in The Valley has its own character — from garden-front townhomes to flagship family villas.
        </p>
      </Reveal>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        {CLUSTERS.map((c, i) => (
          <Reveal key={c.id} delay={i * 100}>
            <button onClick={() => onSelectCluster(c.id)} className="text-left w-full group">
              <div className="rounded-2xl overflow-hidden border border-ink/10 dark:border-sand/10 card-hover">
                <div className="relative h-48 img-zoom">
                  <img src={c.heroImage} alt={c.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                  <div className="absolute bottom-4 left-5 text-sand">
                    <div className="font-serif text-2xl">{c.name}</div>
                    <div className="text-xs text-sand/80">{c.tagline}</div>
                  </div>
                </div>
                <div className="p-5 bg-white dark:bg-white/5">
                  <p className="text-sm text-ink/70 dark:text-sand/70 line-clamp-3">{c.description}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-gold">
                    View {c.name} homes <IconArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </button>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ agent section ------------------------------ */

function AgentSection() {
  return (
    <section id="agent" className="bg-white dark:bg-white/[0.03] py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 grid md:grid-cols-[220px_1fr] gap-10 items-center">
        <Reveal>
          <img src={AGENT.photo} alt={AGENT.name}
            className="w-40 h-40 md:w-full md:h-56 object-cover rounded-2xl mx-auto shadow-lg" />
        </Reveal>
        <Reveal delay={100}>
          <div className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">Your Valley Specialist</div>
          <h2 className="font-serif text-3xl md:text-4xl mt-2">{AGENT.name}</h2>
          <p className="text-sm text-ink/60 dark:text-sand/60 mt-1">{AGENT.title} · {AGENT.brokerage}</p>
          <p className="mt-4 text-sm md:text-base leading-relaxed text-ink/80 dark:text-sand/80">{AGENT.bio}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`https://wa.me/${AGENT.whatsapp}`} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors">
              <IconChat className="w-4 h-4" /> WhatsApp
            </a>
            <a href={`tel:${AGENT.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 border border-ink/20 dark:border-sand/20 hover:border-gold text-sm font-semibold px-5 py-2.5 rounded-full transition-colors">
              <IconPhone className="w-4 h-4" /> {AGENT.phone}
            </a>
            <a href={`mailto:${AGENT.email}`}
              className="inline-flex items-center gap-2 border border-ink/20 dark:border-sand/20 hover:border-gold text-sm font-semibold px-5 py-2.5 rounded-full transition-colors">
              <IconMail className="w-4 h-4" /> Email
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------ footer ------------------------------ */

function Footer() {
  return (
    <footer id="contact" className="bg-ink text-sand py-14">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid md:grid-cols-3 gap-10">
        <div>
          <div className="text-2xl font-serif gold-gradient-text">The Valley</div>
          <p className="text-sm text-sand/60 mt-3 leading-relaxed max-w-xs">
            An independent listings portfolio for The Valley by Emaar, curated by {AGENT.name}, {AGENT.title} at {AGENT.brokerage}.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-sand/50 font-semibold mb-3">Contact</div>
          <ul className="space-y-2 text-sm text-sand/80">
            <li className="flex items-center gap-2"><IconPhone className="w-4 h-4 text-gold" /> {AGENT.phone}</li>
            <li className="flex items-center gap-2"><IconMail className="w-4 h-4 text-gold" /> {AGENT.email}</li>
            <li className="flex items-center gap-2"><IconChat className="w-4 h-4 text-gold" /> WhatsApp available</li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-sand/50 font-semibold mb-3">Clusters</div>
          <ul className="space-y-2 text-sm text-sand/80">
            {CLUSTERS.map((c) => <li key={c.id}>{c.name}</li>)}
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 mt-10 pt-6 border-t border-sand/10 text-xs text-sand/40 flex flex-wrap gap-2 justify-between">
        <span>© {TODAY.getFullYear()} {AGENT.name}. All listing data shown is sample/demo content.</span>
        <span>Built for The Valley clients.</span>
      </div>
    </footer>
  );
}

/* -------------------------------- app -------------------------------- */

function App() {
  const [theme, setTheme] = useTheme();
  const [filters, setFilters] = useState({ search: "", cluster: "all", type: "all", status: "all", sort: "newest" });
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
  }, [selected]);

  const filtered = useMemo(() => {
    let list = PROPERTIES.filter((p) => {
      const q = filters.search.trim().toLowerCase();
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || clusterName(p.cluster).toLowerCase().includes(q);
      const matchesCluster = filters.cluster === "all" || p.cluster === filters.cluster;
      const matchesType = filters.type === "all" || p.type === filters.type;
      const matchesStatus = filters.status === "all" || p.status === filters.status;
      return matchesSearch && matchesCluster && matchesType && matchesStatus;
    });

    switch (filters.sort) {
      case "price-asc": list = [...list].sort((a, b) => a.price - b.price); break;
      case "price-desc": list = [...list].sort((a, b) => b.price - a.price); break;
      case "size-desc": list = [...list].sort((a, b) => b.size - a.size); break;
      default: list = [...list].sort((a, b) => new Date(b.listedDate) - new Date(a.listedDate));
    }
    return list;
  }, [filters]);

  const activeCluster = filters.cluster !== "all" ? CLUSTERS.find((c) => c.id === filters.cluster) : null;

  const navigate = (id) => {
    if (id === "home") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Navbar theme={theme} setTheme={setTheme} onNavigate={navigate} />
      <Hero onExplore={() => navigate("listings")} />

      <FeaturedRow properties={PROPERTIES} onOpen={setSelected} />

      <section id="listings" className="pt-16">
        <FilterBar filters={filters} setFilters={setFilters} resultCount={filtered.length} />
        <ClusterBanner cluster={activeCluster} />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
          {filtered.length === 0 ? (
            <div className="text-center py-24 text-ink/50 dark:text-sand/50">
              <p className="text-lg font-serif">No properties match your filters.</p>
              <button onClick={() => setFilters({ search: "", cluster: "all", type: "all", status: "all", sort: "newest" })}
                className="mt-4 text-sm font-semibold text-gold underline">Reset filters</button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p, i) => (
                <PropertyCard key={p.id} property={p} onOpen={setSelected} delay={(i % 3) * 90} />
              ))}
            </div>
          )}
        </div>
      </section>

      <ClustersSection onSelectCluster={(id) => { setFilters((f) => ({ ...f, cluster: id })); navigate("listings"); }} />
      <AgentSection />
      <Footer />

      <PropertyModal property={selected} onClose={() => setSelected(null)} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
