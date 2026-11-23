/* Abalone Queen — pieces, runway, viewer, liquid pearl and sound */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- the pieces: each one opens its own Etsy listing ---------- */
  const url = p => "https://www.etsy.com/listing/" + p.listing;
  const cut = p => `assets/etsy/cut/${p.id}.webp?3`;
  const photo = p => `assets/etsy/thumb/${p.id}-${p.photo}.jpg`;

  /* runway: one piece to a screen */
  $("#runway").innerHTML = RUNWAY.map((id, n) => { const p = PIECES.find(x => x.id === id); return p ? `
    <a class="look" href="${url(p)}" target="_blank" rel="noopener" aria-label="${p.title}. Opens on Etsy.">
      <span class="look-piece"><img src="${cut(p)}" alt="${p.title}" loading="lazy"></span>
      <span class="look-words"><span class="look-no">N° ${String(n + 1).padStart(2, "0")}</span><span class="look-name">${p.name}</span><span class="look-title">${p.title}</span><span class="look-view">View on Etsy</span></span>
    </a>` : ""; }).join("");
  const seen = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); }), { threshold: .35 });
  $$(".look").forEach(l => seen.observe(l));

  /* the whole collection: the cut-out, and on hover the photograph it came from */
  const grid = $("#grid");
  grid.innerHTML = PIECES.map((p, i) => `
    <a class="tile" href="${url(p)}" target="_blank" rel="noopener" data-i="${i}" data-kind="${p.kind}" aria-label="${p.title}. Opens on Etsy.">
      <span class="frame"><img src="${cut(p)}" alt="${p.title}" loading="lazy" decoding="async"><img class="real" src="${photo(p)}" alt="" loading="lazy" decoding="async"></span>
      <span class="name">${p.name}</span><span class="epi">${p.kind}</span>
    </a>`).join("");
  $$(".etsy").forEach(a => a.href = ETSY);
  $("#yr").textContent = new Date().getFullYear();

  function filter(f) {
    $$(".chip").forEach(x => x.classList.toggle("on", x.dataset.f === f));
    $$(".tile").forEach(t => { t.hidden = !(f === "all" || t.dataset.kind === f); });
    Sound.chime(2);
  }
  $$(".chip").forEach(c => c.addEventListener("click", () => filter(c.dataset.f)));

  /* pearl light follows the pointer across a tile */
  if (!calm) grid.addEventListener("pointermove", e => {
    const f = e.target.closest(".tile")?.firstElementChild; if (!f) return;
    const r = f.getBoundingClientRect();
    f.style.setProperty("--mx", (e.clientX - r.left) / r.width * 100 + "%"); f.style.setProperty("--my", (e.clientY - r.top) / r.height * 100 + "%");
  });
  /* hover: a short ripple of colour, and a soft note */
  let lastHover = null;
  document.addEventListener("pointerenter", e => {
    if (e.pointerType !== "mouse" || !e.target.matches?.(".tile, .look")) return;
    const c = e.target;
    if (!calm) { c.classList.remove("spell"); void c.offsetWidth; c.classList.add("spell"); setTimeout(() => c.classList.remove("spell"), 620); }
    if (c !== lastHover) { lastHover = c; Sound.chime(Math.floor(Math.random() * 7), .35); }
  }, true);

  /* ---------- liquid mother-of-pearl, drawn live behind the title ---------- */
  (function nacre() {
    const cv = $("#nacre"), gl = cv.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return; /* without WebGL the dark gradient behind the canvas shows instead */
    const vs = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";
    const fs = `precision highp float;
uniform vec2 r;uniform float t;uniform vec2 m;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return s;}
float field(vec2 p){
  vec2 q=vec2(fbm(p+t*.035),fbm(p+vec2(5.2,1.3)-t*.03));
  vec2 w=vec2(fbm(p+2.6*q+vec2(1.7,9.2)+t*.02),fbm(p+2.6*q+vec2(8.3,2.8)-t*.015));
  return fbm(p+3.2*w);}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*r)/r.y;
  vec2 p=uv*.95+vec2(0.,t*.008);
  float e=.006;
  float f=field(p);
  vec3 nr=normalize(vec3(field(p+vec2(e,0.))-f,field(p+vec2(0.,e))-f,e*.9));
  vec3 l=normalize(vec3(m-uv,.55));
  float d=max(dot(nr,l),0.);
  float rings=sin(f*30.+t*.1)*.5+.5;            /* growth lines, like the inside of a shell */
  float film=f*1.5+d*.7+rings*.06+t*.01;       /* thin-film colour shifts with the light */
  vec3 iri=vec3(.34,.44,.56)+vec3(.26,.28,.30)*cos(6.2831*(film+vec3(.02,.20,.40)));
  vec3 sea=mix(vec3(.02,.20,.24),vec3(.55,.36,.62),smoothstep(.3,.8,f));
  vec3 col=mix(sea,iri,.6);
  col*=.10+1.05*d;                                /* lit side glows, the rest sinks into dark water */
  col+=pow(d,30.)*vec3(1.,.94,.88)*.4;            /* wet highlight */
  col*=mix(.55,1.,rings);
  col*=smoothstep(1.35,.15,length(uv*vec2(.8,1.)));
  col=pow(col,vec3(1.15));
  gl_FragColor=vec4(col,1.);}`;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(pr, "a"); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    const ur = gl.getUniformLocation(pr, "r"), ut = gl.getUniformLocation(pr, "t"), um = gl.getUniformLocation(pr, "m");
    let mx = .25, my = .2, tx = .25, ty = .2, vis = true;
    const size = () => { const s = Math.min(1, 900 / innerWidth) * .75; cv.width = Math.round(cv.clientWidth * s); cv.height = Math.round(cv.clientHeight * s); gl.viewport(0, 0, cv.width, cv.height); };
    size(); addEventListener("resize", size);
    addEventListener("pointermove", e => { tx = (e.clientX / innerWidth - .5) * (innerWidth / innerHeight); ty = .5 - e.clientY / innerHeight; });
    new IntersectionObserver(es => { vis = es[0].isIntersecting; }).observe(cv);
    const t0 = performance.now();
    (function frame() {
      requestAnimationFrame(frame); if (!vis) return;
      mx += (tx - mx) * .04; my += (ty - my) * .04;
      gl.uniform2f(ur, cv.width, cv.height); gl.uniform1f(ut, calm ? 20 : (performance.now() - t0) / 1000 + 20); gl.uniform2f(um, mx, my);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    })();
  })();

  /* ---------- sound ---------- */
  const Sound = (() => {
    let ctx, master, wet, on = false, noise;
    const scale = [0, 0, 0, 0, 0, 0, 0, 0, 0]; /* no notes any more: the sound is the sea alone */
    function build() {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
      wet = master;

      /* soft noise is the raw material for every wave */
      const len = ctx.sampleRate * 8; noise = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let c = 0; c < 2; c++) { const d = noise.getChannelData(c); let v = 0; for (let i = 0; i < len; i++) { v = (v + .02 * (Math.random() * 2 - 1)) / 1.02; d[i] = v * 3.4; } }

      /* the open sea far off: a steady, quiet bed */
      const bed = ctx.createBufferSource(); bed.buffer = noise; bed.loop = true;
      const bl = ctx.createBiquadFilter(); bl.type = "lowpass"; bl.frequency.value = 520;
      const bg = ctx.createGain(); bg.gain.value = .16;
      const lfo = ctx.createOscillator(); lfo.frequency.value = .05; const lg = ctx.createGain(); lg.gain.value = .05; lfo.connect(lg).connect(bg.gain);
      bed.connect(bl).connect(bg).connect(master); bed.start(); lfo.start();

      wave(); setTimeout(wave, 4200);
    }
    /* one wave: it gathers, breaks with a brighter hiss, and draws back down the sand */
    function wave() {
      if (on) {
        const t = ctx.currentTime, rise = 2.6 + Math.random() * 2, fall = 4.5 + Math.random() * 3, peak = .22 + Math.random() * .16;
        const src = ctx.createBufferSource(); src.buffer = noise; src.loop = true;
        const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.Q.value = .4;
        const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 140;
        const g = ctx.createGain(), p = ctx.createStereoPanner();
        const from = Math.random() * 1.2 - .6; p.pan.setValueAtTime(from, t); p.pan.linearRampToValueAtTime(-from * .6, t + rise + fall);
        lp.frequency.setValueAtTime(350, t); lp.frequency.exponentialRampToValueAtTime(3800, t + rise); lp.frequency.exponentialRampToValueAtTime(600, t + rise + fall);
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + rise); g.gain.setTargetAtTime(0, t + rise, fall / 3.2);
        src.connect(hp).connect(lp).connect(g).connect(p).connect(master);
        src.start(t, Math.random() * 6); src.stop(t + rise + fall + 1);
      }
      setTimeout(wave, 6500 + Math.random() * 5000);
    }
    function bell() {} /* hovering and clicking are silent now */
    /* a real ocean recording, if one is saved as assets/score.mp3, plays along with the waves */
    let score = null;
    fetch("assets/score.mp3", { method: "HEAD" }).then(r => { if (r.ok) { score = new Audio("assets/score.mp3"); score.loop = true; score.volume = 0; } }).catch(() => {});
    function set(v) {
      on = v; if (v && !ctx) build();
      if (ctx) { if (v) ctx.resume(); master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setTargetAtTime(v ? (score ? .35 : .8) : 0, ctx.currentTime, v ? 1.6 : .4); }
      if (score) { if (v) { score.play().catch(() => {}); } const to = v ? .8 : 0, from = score.volume, t0 = performance.now();
        (function fade() { const k = Math.min(1, (performance.now() - t0) / 1500); score.volume = from + (to - from) * k; if (k < 1) requestAnimationFrame(fade); else if (!v) score.pause(); })(); }
      const b = $("#sound"); b.setAttribute("aria-pressed", v); b.lastElementChild.textContent = v ? "Sound on" : "Sound off";
    }
    return {
      set, toggle: () => set(!on),
      chime: (i = 0, vol = .5) => bell(scale[2 + (i % 7)], vol),
      chord: () => [3, 5, 7].forEach((n, k) => bell(scale[n], .6, k * .11)),
    };
  })();
  $("#sound").onclick = () => Sound.toggle();

  /* background films marked "slow" play at half speed */
  $$("video.slow").forEach(v => { const slow = () => { v.defaultPlaybackRate = .5; if (v.playbackRate !== .5) v.playbackRate = .5; }; slow(); ["loadedmetadata", "canplay", "play", "playing"].forEach(ev => v.addEventListener(ev, slow)); });

  /* ---------- entry ---------- */
  const vid = $("#introVideo");
  const kick = () => { if (vid.isConnected && vid.paused) vid.play().catch(() => {}); };
  vid.addEventListener("canplay", kick); addEventListener("pointerdown", kick, { once: true });
  function enter(withSound) {
    if (withSound) { Sound.set(true); setTimeout(() => Sound.chord(), 250); }
    $("#gate").classList.add("open"); document.body.classList.remove("gated");
    setTimeout(() => { vid.pause(); $("#gate").remove(); }, 2400);
  }
  $("#enter").onclick = () => enter(true);
  $("#enterQuiet").onclick = () => enter(false);
})();
