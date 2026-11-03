(function () {
  "use strict";
  var W = window.WEDDING;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var el = function (tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  /* ---------- Date helpers (Pakistan time, UTC+5, no DST) ---------- */
  function eventStart(ev) {
    return new Date(ev.date + "T" + ev.time + ":00+05:00");
  }
  function eventEnd(ev) {
    return new Date(eventStart(ev).getTime() + (ev.durationHours || 3) * 3600000);
  }
  function fmtDay(ev) {
    return eventStart(ev).toLocaleDateString("en-GB", { weekday: "long", timeZone: W.timezone });
  }
  function fmtDate(ev) {
    return eventStart(ev).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: W.timezone });
  }
  function fmtTime(ev) {
    var p = ev.time.split(":"), h = +p[0], m = p[1];
    var ap = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return h + ":" + m + " " + ap;
  }
  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function utcStamp(d) {
    return d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + "T" +
      pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + "00Z";
  }

  /* ---------- Guest name from link: ?to=Ahmed+Khan ---------- */
  var params = new URLSearchParams(location.search);
  var guest = (params.get("to") || params.get("guest") || "").trim().slice(0, 60);
  if (guest) {
    $("#guestName").textContent = guest;
    $("#guestLine").hidden = false;
  }

  /* ---------- Couple ---------- */
  function person(p, role) {
    var card = el("article", "person reveal");
    var photo = el("div", "photo");
    var img = new Image();
    img.alt = p.fullName;
    img.onload = function () { photo.innerHTML = ""; photo.appendChild(img); };
    img.onerror = function () { /* keep monogram */ };
    img.src = p.photo;
    photo.appendChild(el("span", "monogram script", esc(p.firstName.charAt(0))));
    card.appendChild(photo);
    card.appendChild(el("p", "eyebrow", role));
    card.appendChild(el("h3", "pname script", esc(p.fullName)));
    card.appendChild(el("p", "rel", esc(p.relation) + "<br><b>" + esc(p.parent) + "</b>"));
    if (p.instagram) {
      var a = el("a", "ig", "Instagram");
      a.href = p.instagram; a.target = "_blank"; a.rel = "noopener";
      card.appendChild(a);
    }
    return card;
  }
  var grid = $("#coupleGrid");
  grid.appendChild(person(W.groom, "The Groom"));
  grid.appendChild(el("div", "amp script reveal", "&amp;"));
  grid.appendChild(person(W.bride, "The Bride"));

  /* ---------- Diary + About ---------- */
  (function () {
    var d = W.groomDiary, c = $("#diaryCard");
    c.innerHTML = '<div class="tape"></div><p class="eyebrow">' + esc(d.heading) + "</p>" +
      d.lines.map(function (l, i) { return '<p class="' + (i === 0 ? "dear" : "") + '">' + esc(l) + "</p>"; }).join("") +
      '<p class="sign">&mdash; ' + esc(d.signature) + "</p>";
    var b = W.brideAbout, a = $("#aboutCard");
    a.innerHTML = '<p class="eyebrow">' + esc(b.heading) + '</p><h3 class="script role">' + esc(b.profession) +
      "</h3><p>" + esc(b.text) + '</p><div class="code-line" aria-hidden="true"><i></i><i></i><i></i><code>love.commit(&ldquo;forever&rdquo;)</code></div>';
  })();

  /* ---------- Events ---------- */
  function googleCalUrl(ev) {
    var title = ev.title + " | Usama & Maheen's Wedding";
    var loc = [ev.venue, ev.address].filter(Boolean).join(", ");
    return "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent(title) +
      "&dates=" + utcStamp(eventStart(ev)) + "/" + utcStamp(eventEnd(ev)) +
      "&details=" + encodeURIComponent("You are invited to the " + ev.title + " of Usama Javed & Maheen Asghar.") +
      (loc ? "&location=" + encodeURIComponent(loc) : "");
  }
  function downloadIcs(ev) {
    var loc = [ev.venue, ev.address].filter(Boolean).join(", ").replace(/,/g, "\\,");
    var ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Usama and Maheen//Wedding//EN", "BEGIN:VEVENT",
      "UID:" + ev.id + "-2026@usama-maheen-wedding",
      "DTSTAMP:" + utcStamp(new Date()),
      "DTSTART:" + utcStamp(eventStart(ev)),
      "DTEND:" + utcStamp(eventEnd(ev)),
      "SUMMARY:" + ev.title + " | Usama & Maheen's Wedding",
      "DESCRIPTION:You are invited to the " + ev.title + " of Usama Javed & Maheen Asghar.",
      loc ? "LOCATION:" + loc : "",
      "END:VEVENT", "END:VCALENDAR"
    ].filter(Boolean).join("\r\n");
    var blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = ev.id + "-usama-maheen.ics";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
  }

  var eg = $("#eventsGrid");
  W.events.forEach(function (ev, i) {
    var c = el("article", "event reveal");
    c.style.setProperty("--d", i * 120 + "ms");
    var hasVenue = !!(ev.venue || ev.address);
    c.innerHTML =
      '<p class="num">0' + (i + 1) + "</p>" +
      "<h3 class=\"script\">" + esc(ev.title) + "</h3>" +
      '<p class="tag">' + esc(ev.tagline) + "</p>" +
      '<div class="when"><div><small>' + esc(fmtDay(ev)) + "</small><b>" + esc(fmtDate(ev).replace(/ 2026$/, "")) + "</b><span>2026</span></div>" +
      '<div class="sep"></div><div><small>Time</small><b>' + esc(fmtTime(ev)) + "</b><span>Pakistan time</span></div></div>" +
      '<div class="where">' + (hasVenue
        ? (ev.venue ? "<b>" + esc(ev.venue) + "</b>" : "") + (ev.address ? "<span>" + esc(ev.address) + "</span>" : "")
        : '<span class="soon">Venue details will be shared soon</span>') + "</div>";
    var actions = el("div", "actions");
    if (ev.mapsUrl) {
      var m = el("a", "btn btn-solid sm", "Get Directions");
      m.href = ev.mapsUrl; m.target = "_blank"; m.rel = "noopener";
      actions.appendChild(m);
    }
    var g = el("a", "btn btn-ghost sm", "Google Calendar");
    g.href = googleCalUrl(ev); g.target = "_blank"; g.rel = "noopener";
    var ic = el("button", "btn btn-ghost sm", "Apple / Outlook");
    ic.type = "button";
    ic.addEventListener("click", function () { downloadIcs(ev); });
    actions.appendChild(g); actions.appendChild(ic);
    c.appendChild(actions);
    eg.appendChild(c);
  });

  /* ---------- Gallery + Lightbox ---------- */
  var galleryItems = [];
  if (W.gallery && W.gallery.length) {
    $("#gallery").hidden = false;
    var gg = $("#galleryGrid");
    W.gallery.forEach(function (src, i) {
      var f = el("figure", "reveal");
      f.style.setProperty("--d", (i % 3) * 120 + "ms");
      f.tabIndex = 0; f.setAttribute("role", "button"); f.setAttribute("aria-label", "Open photo " + (i + 1));
      var im = new Image();
      im.loading = "lazy"; im.alt = "Wedding moment " + (i + 1); im.src = src;
      im.onload = function () { im.classList.add("loaded"); };
      im.onerror = function () { f.remove(); };
      f.appendChild(im); gg.appendChild(f);
      galleryItems.push(src);
      var open = function () { openLightbox(galleryItems.indexOf(src)); };
      f.addEventListener("click", open);
      f.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    });
  }
  var lb = $("#lightbox"), lbImg = $("#lbImg"), lbIdx = 0, touchX = null;
  function showLb(i) {
    lbIdx = (i + galleryItems.length) % galleryItems.length;
    lbImg.style.animation = "none"; void lbImg.offsetWidth; lbImg.style.animation = "";
    lbImg.src = galleryItems[lbIdx];
  }
  function openLightbox(i) { lb.hidden = false; document.body.classList.add("locked"); showLb(i); }
  function closeLightbox() { lb.hidden = true; document.body.classList.remove("locked"); }
  $(".lb-close").addEventListener("click", closeLightbox);
  $(".lb-prev").addEventListener("click", function () { showLb(lbIdx - 1); });
  $(".lb-next").addEventListener("click", function () { showLb(lbIdx + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showLb(lbIdx - 1);
    if (e.key === "ArrowRight") showLb(lbIdx + 1);
  });
  lb.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (touchX == null) return;
    var dx = e.changedTouches[0].clientX - touchX; touchX = null;
    if (Math.abs(dx) > 50) showLb(lbIdx + (dx < 0 ? 1 : -1));
  });

  /* ---------- Banner quote ---------- */
  $("#bannerQuote").textContent = W.bannerQuote || "";

  /* ---------- RSVP via WhatsApp ---------- */
  if (W.whatsapp && /^\d{8,15}$/.test(W.whatsapp)) {
    $("#rsvp").hidden = false;
    if (W.rsvpDeadline) $("#rsvpSub").textContent += " Kindly reply by " + W.rsvpDeadline + ".";
    var pick = $("#eventPick");
    W.events.forEach(function (ev) {
      var l = el("label", "chip");
      l.innerHTML = '<input type="checkbox" value="' + esc(ev.title) + '" checked><span>' + esc(ev.title) + "</span>";
      pick.appendChild(l);
    });
    $("#rsvpForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var name = $("#rsvpName").value.trim();
      if (!name) { $("#rsvpHint").textContent = "Please enter your name."; $("#rsvpName").focus(); return; }
      var att = $("input[name=att]:checked").value === "yes";
      var evs = Array.prototype.map.call(pick.querySelectorAll("input:checked"), function (i) { return i.value; });
      var msg = "Assalamu Alaikum! This is " + name + ".\n";
      if (att) {
        msg += "I will InshaAllah attend" + (evs.length ? " the " + evs.join(", ") : "") + ".\n";
        msg += "Number of guests: " + $("#rsvpGuests").value + "\n";
      } else {
        msg += "Unfortunately I won't be able to attend, but you are in my duas.\n";
      }
      var note = $("#rsvpMsg").value.trim();
      if (note) msg += "\n" + note + "\n";
      msg += "\n- Usama & Maheen's Wedding RSVP";
      window.open("https://wa.me/" + W.whatsapp + "?text=" + encodeURIComponent(msg), "_blank");
      $("#rsvpHint").textContent = "WhatsApp will open with your reply ready to send.";
    });
  }

  /* ---------- Footer ---------- */
  $("#families").textContent = "With love, " + W.hostFamilies;

  /* ---------- Countdown (to first event) ---------- */
  var first = eventStart(W.events[0]);
  var last = eventEnd(W.events[W.events.length - 1]);
  function setCd(sel, val) {
    var n = $(sel);
    if (n.textContent !== val) {
      n.textContent = val;
      n.classList.remove("tick"); void n.offsetWidth; n.classList.add("tick");
    }
  }
  function tick() {
    var now = new Date(), diff = first - now;
    if (diff <= 0) {
      $("#countdown").style.display = "none";
      $("#cdNote").textContent = now < last ? "Alhamdulillah, the celebrations have begun!" : "Alhamdulillah, thank you for your love & duas.";
      return;
    }
    var s = Math.floor(diff / 1000);
    setCd("#cdD", pad(Math.floor(s / 86400)));
    setCd("#cdH", pad(Math.floor(s % 86400 / 3600)));
    setCd("#cdM", pad(Math.floor(s % 3600 / 60)));
    setCd("#cdS", pad(s % 60));
  }
  tick(); setInterval(tick, 1000);

  /* ---------- Music (YouTube or mp3) ---------- */
  var audio = null, yt = null, ytReady = false, wantPlay = false, playing = false;
  var musicBtn = $("#musicBtn");
  function setMusicUI(on) { playing = on; musicBtn.classList.toggle("on", on); }
  function playMusic() {
    wantPlay = true;
    if (yt && ytReady) { try { yt.playVideo(); setMusicUI(true); } catch (e) {} }
    else if (audio) { audio.play().then(function () { setMusicUI(true); }).catch(function () {}); }
  }
  function pauseMusic() {
    wantPlay = false;
    if (yt && ytReady) { try { yt.pauseVideo(); } catch (e) {} }
    if (audio) audio.pause();
    setMusicUI(false);
  }
  if (W.youtubeMusic) {
    musicBtn.hidden = false;
    window.onYouTubeIframeAPIReady = function () {
      yt = new YT.Player("ytPlayer", {
        width: "200", height: "200", videoId: W.youtubeMusic,
        playerVars: { autoplay: 0, controls: 0, loop: 1, playlist: W.youtubeMusic, playsinline: 1, rel: 0, modestbranding: 1 },
        events: {
          onReady: function () { ytReady = true; if (wantPlay) playMusic(); },
          onError: function () { musicBtn.hidden = true; setMusicUI(false); },
          onStateChange: function (e) {
            if (e.data === 1) setMusicUI(true);
            if (e.data === 2) setMusicUI(false);
            if (e.data === 0) { try { yt.playVideo(); } catch (x) {} }
          }
        }
      });
    };
    var tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api"; tag.async = true;
    document.head.appendChild(tag);
  } else if (W.music) {
    audio = new Audio(W.music); audio.loop = true; audio.preload = "none";
    audio.addEventListener("error", function () { musicBtn.hidden = true; audio = null; });
    musicBtn.hidden = false;
  }
  musicBtn.addEventListener("click", function () { playing ? pauseMusic() : playMusic(); });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden && playing) { if (yt && ytReady) yt.pauseVideo(); if (audio) audio.pause(); }
    else if (!document.hidden && wantPlay) { if (yt && ytReady) yt.playVideo(); if (audio) audio.play().catch(function () {}); }
  });

  /* ---------- Falling petals + sparkle burst ---------- */
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var cv = $("#petals"), cx = cv.getContext("2d"), petals = [], sparks = [], running = false, DPR = Math.min(window.devicePixelRatio || 1, 2);
  var COLORS = ["rgba(217,214,242,.9)", "rgba(185,200,240,.85)", "rgba(244,214,226,.85)", "rgba(216,194,154,.8)"];
  function sizeCanvas() { cv.width = innerWidth * DPR; cv.height = innerHeight * DPR; cx.setTransform(DPR, 0, 0, DPR, 0, 0); }
  function newPetal(initial) {
    return { x: Math.random() * innerWidth, y: initial ? Math.random() * innerHeight : -20,
      r: 5 + Math.random() * 7, vy: .35 + Math.random() * .7, vx: -.2 + Math.random() * .5,
      rot: Math.random() * 6.28, vr: (Math.random() - .5) * .03, sw: Math.random() * 6.28,
      c: COLORS[(Math.random() * COLORS.length) | 0] };
  }
  function frame() {
    if (!running) return;
    cx.clearRect(0, 0, innerWidth, innerHeight);
    petals.forEach(function (p) {
      p.y += p.vy; p.sw += .018; p.x += p.vx + Math.sin(p.sw) * .45; p.rot += p.vr;
      if (p.y > innerHeight + 20 || p.x < -30 || p.x > innerWidth + 30) Object.assign(p, newPetal(false));
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot); cx.fillStyle = p.c;
      cx.beginPath(); cx.ellipse(0, 0, p.r, p.r * .55, 0, 0, 6.283); cx.fill(); cx.restore();
    });
    sparks = sparks.filter(function (k) { return k.life > 0; });
    sparks.forEach(function (k) {
      k.x += k.vx; k.y += k.vy; k.vy += .06; k.vx *= .99; k.life -= 1;
      cx.globalAlpha = Math.max(k.life / 70, 0); cx.fillStyle = k.c;
      cx.beginPath(); cx.arc(k.x, k.y, k.s, 0, 6.283); cx.fill();
    });
    cx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }
  function startPetals() {
    if (reduce || running) return;
    sizeCanvas(); var n = innerWidth < 600 ? 14 : 24;
    for (var i = 0; i < n; i++) petals.push(newPetal(true));
    running = true; requestAnimationFrame(frame);
  }
  function burst(x, y) {
    if (reduce) return;
    var cols = ["#d8c29a", "#f1deb2", "#b08d57", "#ffffff", "#b9b4e3"];
    for (var i = 0; i < 46; i++) {
      var a = Math.random() * 6.283, v = 2 + Math.random() * 5;
      sparks.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 2, s: 1.5 + Math.random() * 2.2, life: 55 + Math.random() * 25, c: cols[(Math.random() * cols.length) | 0] });
    }
  }
  addEventListener("resize", function () { if (running) sizeCanvas(); });
  document.addEventListener("visibilitychange", function () {
    if (!running) return;
    if (document.hidden) running = false;
    else { running = true; requestAnimationFrame(frame); }
  });

  /* ---------- Scroll progress + parallax ---------- */
  var bar = $("#progress"), bannerBg = $("#bannerBg"), banner = $("#banner"), ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      var h = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = "scaleX(" + (h > 0 ? Math.min(scrollY / h, 1) : 0) + ")";
      if (!reduce) {
        var r = banner.getBoundingClientRect();
        if (r.bottom > 0 && r.top < innerHeight) {
          var p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
          bannerBg.style.transform = "translate3d(0," + (p * -70) + "px,0)";
        }
      }
      ticking = false;
    });
  }
  addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Open invitation ---------- */
  $("#openBtn").addEventListener("click", function (e) {
    var r = e.currentTarget.getBoundingClientRect();
    document.body.classList.remove("locked");
    $("#cover").classList.add("gone");
    $("#site").removeAttribute("aria-hidden");
    window.scrollTo(0, 0);
    playMusic();
    startPetals();
    burst(r.left + r.width / 2, r.top + r.height / 2);
    setTimeout(function () { burst(innerWidth * .25, innerHeight * .4); burst(innerWidth * .75, innerHeight * .4); }, 350);
    setTimeout(function () { $("#cover").style.display = "none"; }, 1400);
    observe();
    onScroll();
  });

  /* ---------- Scroll reveal ---------- */
  function observe() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { items.forEach(function (i) { i.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    items.forEach(function (i) { io.observe(i); });
  }

  /* Smooth anchor scroll */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var t = $(a.getAttribute("href"));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: "smooth" }); }
  });
})();
