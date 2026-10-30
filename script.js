"use strict";
/* ============ CONFIGURATION (edit only this section) ============
   CONFIRMED from your Google listing screenshot: address, phone number.
   NOT SHOWN in the screenshot (left empty, so hidden): WhatsApp number, email, social links, ratings, reviews, hours.
   WhatsApp format: country code + number, digits only, e.g. "919648477743". */
const BUSINESS = {
  name: "BB Interiors",
  phone: "096484 77743",
  whatsappNumber: "",
  email: "",
  address: "Infront of Shiva hospital, Bargaon, police chowki, Gonda, Uttar Pradesh 271002",
  googleMapsUrl: "", // paste the exact Google Maps "Share" link here when you have it
  socialLinks: { instagram: "", facebook: "", pinterest: "" },
  tagline: "Thoughtfully designed. Beautifully lived."
};
/* Reviews: add only real ones, e.g. { author: "Name", rating: 5, text: "Exact review text" }. Empty = section hidden. */
const REVIEWS = { source: "", items: [] };
const SERVICES = [
  { id: "Complete Home Interiors", text: "One coordinated design for every room: layout, materials, lighting, furniture and finishing, planned together.", tag: "Whole home" },
  { id: "Living Room Design", text: "Seating, storage, lighting and focal walls arranged so the room works for family evenings and for guests.", tag: "Living" },
  { id: "Bedroom Interiors", text: "Calm, comfortable bedrooms with considered wardrobes, bed walls and soft layered lighting.", tag: "Bedroom" },
  { id: "Kitchen Interiors", text: "Efficient kitchen layouts with practical storage and durable, easy-to-clean finishes.", tag: "Kitchen" },
  { id: "Space Planning and Furniture Layout", text: "Better movement and better use of every square foot, before anything is built or bought.", tag: "Planning" },
  { id: "Renovation and Redesign", text: "Refresh an existing home by reworking layouts, surfaces and lighting, without starting from zero.", tag: "Renovation" },
  { id: "Interior Styling and Finishing", text: "Curtains, accessories, art and decor that bring a finished room together.", tag: "Styling" }
];
/* PLACEHOLDER filenames: no interior photos were attached. Save your photos in /images with these names,
   or change src, alt, caption and category below. Images that fail to load are hidden automatically. */
const PORTFOLIO = [
  { src: "./hero-interior.jpg", alt: "Contemporary living space with sofa and feature wall", caption: "Contemporary living space", category: "Living Rooms", tall: true },
  { src: "./living-room.jpg", alt: "Living room seating area", caption: "Living room", category: "Living Rooms" },
  { src: "./bedroom.jpg", alt: "Bedroom with upholstered bed and wood panelling", caption: "Bedroom retreat", category: "Bedrooms" },
  { src: "./kitchen.jpg", alt: "Modern kitchen interior", caption: "Kitchen interior", category: "Kitchens" },
  { src: "./dining.jpg", alt: "Dining area interior", caption: "Dining area", category: "Dining Areas" },
  { src: "./detail.jpg", alt: "Interior design detail", caption: "Material and lighting detail", category: "Other Interiors", tall: true }
];
const PRINCIPLES = [
  ["Space planning", "Rooms arranged so everyday movement feels easy."],
  ["Material harmony", "Colour, wood, stone and fabric chosen to sit together."],
  ["Light and balance", "Layered lighting that shapes mood through the day."],
  ["Practical storage", "Storage planned into the design, not added later."]
];
/* ================================================================ */

const $ = (s, r = document) => r.querySelector(s);
const h = (t, a = {}, ...c) => {
  const e = document.createElement(t);
  for (const [k, v] of Object.entries(a)) {
    if (v == null || v === false) continue;
    if (k === "class") e.className = v;
    else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v === true ? "" : v);
  }
  e.append(...c.flat().filter(x => x != null && x !== false));
  return e;
};
const lnk = (href, text, cls = "btn") => h("a", { href, class: cls }, text, h("span", { class: "ar", "aria-hidden": "true" }, "›"));
const sec = (cls, ...c) => h("section", { class: "sec " + cls }, h("div", { class: "wrap" }, ...c));
const head = (t, p) => h("div", { class: "head", "data-in": 1 }, h("h2", {}, t), p && h("p", {}, p));
const digits = s => (s || "").replace(/\D/g, "");
const telHref = () => { let d = digits(BUSINESS.phone); if (d.startsWith("0")) d = "91" + d.slice(1); return d ? "tel:+" + d : ""; };
const waNum = () => { const d = digits(BUSINESS.whatsappNumber); return d.length >= 10 ? d : ""; };
const mapsLink = () => BUSINESS.googleMapsUrl || (BUSINESS.address ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(BUSINESS.name + " " + BUSINESS.address) : "");

let io = null;
const reveal = root => {
  if (io) io.disconnect();
  const els = root.querySelectorAll("[data-in]");
  if (!("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("in")); return; }
  io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }), { rootMargin: "0px 0px -8% 0px" });
  els.forEach((e, i) => { e.style.transitionDelay = Math.min(i % 4, 3) * 70 + "ms"; io.observe(e); });
};

/* ---------- lightbox ---------- */
let openLb = () => {};
const initLightbox = () => {
  const d = h("dialog", { class: "lb", "aria-label": "Image viewer" }), img = h("img", { alt: "" }), cap = h("p");
  const prev = h("button", { type: "button", "aria-label": "Previous image", "data-d": -1 }, "‹");
  const next = h("button", { type: "button", "aria-label": "Next image", "data-d": 1 }, "›");
  d.append(h("button", { class: "lb-x", type: "button", "aria-label": "Close image viewer", onclick: () => d.close() }, "×"), prev, h("div", { class: "lb-i" }, img, cap), next);
  let list = [], i = 0;
  const show = n => { i = (n + list.length) % list.length; const p = list[i]; img.src = p.src; img.alt = p.alt; cap.textContent = p.caption; };
  d.addEventListener("click", e => { const b = e.target.closest("[data-d]"); if (b) show(i + Number(b.dataset.d)); else if (e.target === d) d.close(); });
  d.addEventListener("keydown", e => { if (e.key === "ArrowRight") show(i + 1); if (e.key === "ArrowLeft") show(i - 1); });
  d.addEventListener("close", () => document.documentElement.classList.remove("lock"));
  document.body.append(d);
  openLb = (l, n) => { list = l; prev.hidden = next.hidden = l.length < 2; show(n); document.documentElement.classList.add("lock"); d.showModal(); };
};
const figs = [];
const figure = (p, group) => {
  const img = h("img", { src: p.src, alt: p.alt, loading: "lazy", width: p.tall ? 900 : 1200, height: p.tall ? 1200 : 900 });
  const f = h("figure", { class: "ph" + (p.tall ? " tall" : ""), "data-in": 1 },
    h("button", { class: "ph-b", type: "button", "aria-label": "View larger: " + p.caption, onclick: () => { const v = group.filter(x => !x.f.hidden && !x.f.classList.contains("out")); openLb(v.map(x => x.p), v.findIndex(x => x.f === f)); } }, img),
    h("figcaption", { class: "glass" }, p.caption));
  img.addEventListener("error", () => { f.hidden = true; group.onchange && group.onchange(); });
  group.push({ p, f });
  return f;
};

/* ---------- pages ---------- */
const serviceCards = () => SERVICES.map(s => h("a", { class: "card", href: "#/contact?service=" + encodeURIComponent(s.id), "data-in": 1 },
  h("span", { class: "xp", "aria-hidden": "true" }, "↗"), h("span", { class: "chip" }, s.tag), h("h3", {}, s.id), h("p", {}, s.text)));

const pages = {
  home() {
    const hero = PORTFOLIO[0], g = [];
    const img = h("img", { src: hero.src, alt: hero.alt, width: 900, height: 1125, fetchpriority: "high" });
    img.addEventListener("error", () => img.remove());
    const rev = REVIEWS.items.length && sec("", head("What clients say", REVIEWS.source && "Source: " + REVIEWS.source),
      h("div", { class: "grid c3" }, REVIEWS.items.map(r => h("blockquote", { class: "card", "data-in": 1 }, h("p", {}, r.text), h("b", {}, r.author + (r.rating ? " · " + r.rating + "/5" : ""))))));
    return [
      h("section", { class: "hero" }, h("div", { class: "ribbon", "aria-hidden": "true" }), h("div", { class: "wrap" },
        h("div", {}, h("h1", {}, "Interiors that feel like ", h("em", {}, "you.")),
          h("p", { class: "lead" }, "BB Interiors plans living rooms, bedrooms, kitchens and complete homes in Gonda, with layouts, light and materials chosen around how you live."),
          h("div", { class: "cta-row" }, lnk("#/contact", "Discuss your project"), lnk("#/portfolio", "Explore our work", "btn ghost"))),
        h("div", { class: "frame" }, img, h("div", { class: "badge glass" }, h("b", {}, "Gonda, Uttar Pradesh"), BUSINESS.tagline)))),
      sec("", head("Recent interiors", "A selection of our photography."), h("div", { class: "gal", id: "feat" }, PORTFOLIO.slice(0, 3).map(p => figure(p, g))), h("p", { style: "margin-top:1.4rem" }, lnk("#/portfolio", "See the full portfolio", "btn ghost"))),
      sec("", head("What we design", "Choose a service to start an enquiry for it."), h("div", { class: "grid c3" }, serviceCards().slice(0, 6))),
      h("section", { class: "sec band" }, h("div", { class: "wrap" }, head("Design that works as well as it looks"), h("div", { class: "pr", "data-in": 1 }, PRINCIPLES.map(([a, b]) => h("div", {}, h("h3", {}, a), h("p", {}, b)))))),
      rev,
      sec("", h("div", { class: "cta", "data-in": 1 }, h("h2", {}, "Let's design a space that feels like home."), h("p", {}, "Tell us about your room, your budget and your timeline. We'll take it from there."), lnk("#/contact", "Start your enquiry")))
    ];
  },
  services() {
    return [sec("", h("div", { style: "padding-top:5rem" }, head("Services", "Every project starts with a conversation about your space. Pick a service and we will pre-fill your enquiry.")),
      SERVICES.map(s => h("article", { class: "svc", "data-in": 1 }, h("h3", {}, s.id), h("p", {}, s.text), lnk("#/contact?service=" + encodeURIComponent(s.id), "Enquire about this"))))];
  },
  portfolio() {
    const g = [], cats = ["All", ...new Set(PORTFOLIO.map(p => p.category))];
    const empty = h("div", { class: "empty", hidden: true }, h("p", {}, "No photos to show here yet. Add images to the images folder and list them in PORTFOLIO in script.js."));
    const gal = h("div", { class: "gal" }, PORTFOLIO.map(p => figure(p, g)));
    const sync = () => { empty.hidden = g.some(x => !x.f.hidden && !x.f.classList.contains("out")); };
    g.onchange = sync;
    const bar = h("div", { class: "filters", role: "group", "aria-label": "Filter by room" }, cats.map((c, i) => h("button", { type: "button", "aria-pressed": i === 0, onclick: e => {
      bar.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b === e.currentTarget));
      g.forEach(x => x.f.classList.toggle("out", c !== "All" && x.p.category !== c)); sync(); } }, c)));
    return [sec("", h("div", { style: "padding-top:5rem" }, head("Portfolio", "Tap any photograph to view it larger.")), bar, gal, empty)];
  },
  about() {
    return [sec("", h("div", { style: "padding-top:5rem" }, head("About BB Interiors", "BB Interiors is an interior design studio in Gonda, Uttar Pradesh, creating homes that are comfortable, practical and good to look at.")),
      h("div", { class: "grid c2" }, h("div", { class: "card", "data-in": 1 }, h("h3", {}, "Our approach"), h("p", {}, "We begin with how you use each room, then plan the layout, lighting, materials and storage around it. The finish comes last, once the foundations work.")),
        h("div", { class: "card", "data-in": 1 }, h("h3", {}, "Why design matters"), h("p", {}, "A well-planned interior saves effort every day. Furniture fits, light is comfortable, and storage is where you need it."))),
      h("div", { style: "margin-top:1rem", class: "band card", "data-in": 1 }, h("div", { class: "pr" }, PRINCIPLES.map(([a, b]) => h("div", {}, h("h3", {}, a), h("p", {}, b)))))),
      sec("", h("div", { class: "cta", "data-in": 1 }, h("h2", {}, "Planning a new interior?"), lnk("#/contact", "Talk to us")))];
  },
  contact(q) {
    const wa = waNum(), pre = new URLSearchParams(q || "").get("service") || "";
    const err = h("p", { class: "status", role: "status" });
    const f = (id, label, ctl) => h("div", { class: "f" }, h("label", { for: id }, label), ctl, h("p", { class: "err", id: id + "-e" }));
    const inp = (id, type, extra = {}) => h("input", { id, name: id, type, autocomplete: extra.ac, inputmode: extra.im, "aria-describedby": id + "-e", ...extra.a });
    const sel = (id, opts, v) => h("select", { id, name: id }, opts.map(o => h("option", { value: o, selected: o === v }, o)));
    const form = h("form", { novalidate: true, "aria-label": "Project enquiry", onsubmit: e => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(form)), er = {}, ph = d.phone.replace(/[\s\-()]/g, "");
      if (!d.name.trim()) er.name = "Enter your name.";
      if (!ph && !d.email.trim()) er.phone = "Enter a phone number or an email address.";
      else { if (ph && !/^\+?\d{8,15}$/.test(ph)) er.phone = "Enter a valid phone number."; if (d.email.trim() && !/^\S+@\S+\.\S+$/.test(d.email.trim())) er.email = "Enter a valid email address."; }
      ["name", "phone", "email"].forEach(k => { $("#" + k + "-e", form).textContent = er[k] || ""; $("#" + k, form).setAttribute("aria-invalid", !!er[k]); });
      const bad = Object.keys(er)[0];
      if (bad) { err.textContent = "Please fix the highlighted fields."; $("#" + bad, form).focus(); return; }
      const L = (k, v) => (v && v.trim() ? k + ": " + v.trim() : null);
      const msg = ["Hello BB Interiors, I'd like to discuss a project.", "", L("Name", d.name), L("Phone", d.phone), L("Email", d.email), L("Space", d.space), L("Service", d.service), L("Budget", d.budget), L("Location", d.location), L("Preferred contact", d.method), L("Details", d.notes)].filter(x => x !== null).join("\n");
      if (e.submitter && e.submitter.dataset.act === "mail") {
        location.href = "mailto:" + BUSINESS.email + "?subject=" + encodeURIComponent("Project enquiry: " + d.service) + "&body=" + encodeURIComponent(msg);
        err.textContent = "Your email app should open with the message. Nothing is sent until you send it there.";
      } else {
        window.open("https://wa.me/" + wa + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
        err.textContent = "WhatsApp is opening with your message. Press send there to deliver it.";
      }
    } },
      f("name", "Full name", inp("name", "text", { ac: "name", a: { required: true } })),
      h("div", { class: "two" }, f("phone", "Phone", inp("phone", "tel", { ac: "tel", im: "tel" })), f("email", "Email", inp("email", "email", { ac: "email" }))),
      h("p", { class: "note" }, "Provide a phone number or an email address."),
      h("div", { class: "two" }, f("space", "Type of space", sel("space", ["Apartment", "Independent house", "Single room", "Other"])), f("service", "Service of interest", sel("service", SERVICES.map(s => s.id), pre))),
      h("div", { class: "two" }, f("budget", h("span", {}, "Approx. budget ", h("small", {}, "(optional)")), inp("budget", "text", { a: { placeholder: "e.g. ₹5 lakh" } })), f("location", h("span", {}, "Project location ", h("small", {}, "(optional)")), inp("location", "text"))),
      f("method", "Preferred contact method", sel("method", ["WhatsApp", "Phone call", "Email"])),
      f("notes", h("span", {}, "Project details ", h("small", {}, "(optional)")), h("textarea", { id: "notes", name: "notes" })),
      h("div", { class: "cta-row" }, wa && h("button", { class: "btn", type: "submit", "data-act": "wa" }, "Send on WhatsApp"), BUSINESS.email && h("button", { class: "btn ghost", type: "submit", "data-act": "mail" }, "Email instead")),
      !wa && !BUSINESS.email && h("p", { class: "note" }, "Online sending is not set up yet. Please call us using the number on this page."),
      h("p", { class: "note" }, "This form does not store or send anything by itself. WhatsApp or your email app opens with your message, and it is delivered only when you press send."), err);
    const q2 = encodeURIComponent(BUSINESS.address), tel = telHref(), ml = mapsLink();
    const mapBox = h("div", { class: "map" });
    const loadBtn = h("button", { class: "btn ghost", type: "button", onclick: () => { mapBox.replaceChildren(h("iframe", { title: "Map showing " + BUSINESS.name, loading: "lazy", referrerpolicy: "no-referrer-when-downgrade", src: "https://www.google.com/maps?q=" + q2 + "&output=embed" })); } }, "Load map here");
    mapBox.append(h("div", {}, h("p", { style: "margin:0 auto 1rem" }, BUSINESS.address), loadBtn));
    const social = Object.entries(BUSINESS.socialLinks).filter(([, v]) => v).map(([k, v]) => h("a", { class: "line", href: v, target: "_blank", rel: "noopener" }, k[0].toUpperCase() + k.slice(1)));
    return [sec("", h("div", { style: "padding-top:5rem" }, head("Discuss your project", "Share a few details about your space. Calls, WhatsApp and visits are all welcome.")),
      h("div", { class: "cols" }, form, h("div", { class: "info" },
        tel && h("a", { class: "line", href: tel }, "Call " + BUSINESS.phone),
        wa && h("a", { class: "line", href: "https://wa.me/" + wa, target: "_blank", rel: "noopener" }, "Chat on WhatsApp"),
        BUSINESS.email && h("a", { class: "line", href: "mailto:" + BUSINESS.email }, BUSINESS.email),
        social, ml && h("a", { class: "line", href: ml, target: "_blank", rel: "noopener" }, "Open in Google Maps"),
        BUSINESS.address && mapBox)))];
  }
};

/* ---------- shell: footer, floating button, theme, menu, router ---------- */
const buildFooter = () => {
  const tel = telHref(), wa = waNum(), ml = mapsLink(), li = c => h("li", {}, c);
  const links = [["#/", "Home"], ["#/services", "Services"], ["#/portfolio", "Portfolio"], ["#/about", "About"], ["#/contact", "Contact"]];
  const ext = (href, text) => h("a", { href, target: "_blank", rel: "noopener" }, text);
  $("#footer").append(h("div", { class: "wrap" },
    h("div", { class: "fb" }, h("h2", {}, BUSINESS.name), h("p", {}, "Interior design in Gonda, Uttar Pradesh. " + BUSINESS.tagline)),
    h("nav", { "aria-label": "Footer" }, h("ul", {},
      links.map(([a, b]) => li(h("a", { href: a }, b))),
      SERVICES.slice(0, 5).map(s => li(h("a", { href: "#/contact?service=" + encodeURIComponent(s.id) }, s.id))))),
    h("ul", { "aria-label": "Contact details" },
      tel && li(h("a", { href: tel }, "Call " + BUSINESS.phone)),
      wa && li(ext("https://wa.me/" + wa, "Chat on WhatsApp")),
      BUSINESS.email && li(h("a", { href: "mailto:" + BUSINESS.email }, BUSINESS.email)),
      BUSINESS.address && li(h("span", {}, BUSINESS.address)),
      ml && li(ext(ml, "Get directions on Google Maps")),
      Object.entries(BUSINESS.socialLinks).filter(([, v]) => v).map(([k, v]) => li(ext(v, k[0].toUpperCase() + k.slice(1)))),
      li(h("span", { class: "copy" }, "© " + new Date().getFullYear() + " " + BUSINESS.name)))));
  if (waNum()) document.body.append(h("a", { class: "wa", href: "https://wa.me/" + waNum(), target: "_blank", rel: "noopener", "aria-label": "Chat with BB Interiors on WhatsApp" },
    h("svg", { viewBox: "0 0 24 24", width: 28, height: 28, fill: "currentColor", "aria-hidden": "true" }, h("path", { d: "M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.2 14.1c-.2.6-1.300 1.200-1.800 1.200-.5.100-1 .200-3.300-.700-2.800-1.100-4.600-4-4.700-4.200-.1-.2-1.100-1.500-1.100-2.800s.7-2 1-2.200c.2-.3.500-.3.700-.3h.5c.2 0 .4 0 .6.500l.8 1.900c.1.200.1.300 0 .5l-.4.500c-.1.200-.3.300-.1.600.2.300.8 1.300 1.700 2.100 1.100 1 2.100 1.300 2.400 1.400.3.200.5.100.6-.1l.8-1c.2-.3.400-.2.600-.1l1.800.9c.3.100.4.200.5.300.1.200.1.800-.2 1.500Z" }))));
};
const setTheme = t => { document.documentElement.dataset.theme = t; try { localStorage.setItem("bb-theme", t); } catch (e) { /* storage unavailable */ } $("#theme").setAttribute("aria-label", "Switch to " + (t === "dark" ? "light" : "dark") + " theme"); };
const setMenu = open => { $("#menu").classList.toggle("open", open); const b = $("#burger"); b.setAttribute("aria-expanded", open); b.setAttribute("aria-label", open ? "Close menu" : "Open menu"); };

const TITLES = { home: "BB Interiors | Interior Design in Gonda, Uttar Pradesh", services: "Interior Design Services | BB Interiors", portfolio: "Portfolio | BB Interiors", about: "About | BB Interiors", contact: "Contact and Enquiries | BB Interiors" };
const route = () => {
  const [path, qs] = location.hash.replace(/^#/, "").split("?"), key = path.replace(/^\/|\/$/g, "") || "home", ok = key in pages, k = ok ? key : "home";
  const main = $("#main"); figs.length = 0;
  main.replaceChildren(...[!ok && h("div", { class: "wrap", style: "padding-top:6rem" }, h("p", { class: "status" }, "That page doesn't exist. Here is our home page.")), ...pages[k](qs)].filter(Boolean));
  document.title = TITLES[k];
  document.querySelectorAll("#menu a").forEach(a => a.dataset.r === k ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
  setMenu(false); reveal(main); window.scrollTo(0, 0); main.focus({ preventScroll: true });
};

const init = () => {
  initLightbox(); buildFooter();
  $("#theme").addEventListener("click", () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));
  setTheme(document.documentElement.dataset.theme || "light");
  $("#burger").addEventListener("click", () => setMenu(!$("#menu").classList.contains("open")));
  document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
  addEventListener("hashchange", route);
  route();
};
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", init) : init();
