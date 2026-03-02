# Cinematic Animation Patterns

Theme-specific recipes for creating cinematic `html_tailwind` animated presentations. Each theme includes visual identity, beat patterns with complete code examples, and BGM recommendations.

For the animation API reference (MulmoAnimation DSL, interpolate, Easing), see `references/html_animation_reference.md`.

## BGM Sources

**mulmocast-media** (built-in, recommended): `https://github.com/receptron/mulmocast-media/raw/refs/heads/main/bgms/{name}`

Available tracks: `story001-005.mp3`, `theme001.mp3`, `vibe001-002.mp3`, `olympic001.mp3`, `morning001.mp3`, `classical001-002.mp3`, `llm001.mp3`, `silent001.mp3`, `voice001.mp3`

**Mixkit** (external, free, no attribution): Direct MP3 URLs from `assets.mixkit.co` — listed per theme below.

**Incompetech / Kevin MacLeod** (external, CC BY — attribution required): Direct MP3 URLs. Pattern: `https://incompetech.com/music/royalty-free/mp3-royaltyfree/{Track Name}.mp3`

Useful Incompetech tracks:

| Track | Mood | URL |
|-------|------|-----|
| Night on the Docks - Sax | Film Noir, smoky jazz | `https://incompetech.com/music/royalty-free/mp3-royaltyfree/Night%20on%20the%20Docks%20-%20Sax.mp3` |
| Impact Prelude | Epic, cinematic | `https://incompetech.com/music/royalty-free/mp3-royaltyfree/Impact%20Prelude.mp3` |
| Darkest Child | Horror, dark | `https://incompetech.com/music/royalty-free/mp3-royaltyfree/Darkest%20Child.mp3` |
| Unseen Horrors | Horror, creepy | `https://incompetech.com/music/royalty-free/mp3-royaltyfree/Unseen%20Horrors.mp3` |
| Investigations | Mystery, detective | `https://incompetech.com/music/royalty-free/mp3-royaltyfree/Investigations.mp3` |
| Crypto | Electronic, dark | `https://incompetech.com/music/royalty-free/mp3-royaltyfree/Crypto.mp3` |
| Peaceful Desolation | Calm, documentary | `https://incompetech.com/music/royalty-free/mp3-royaltyfree/Peaceful%20Desolation.mp3` |
| Heroic Age | Action, epic | `https://incompetech.com/music/royalty-free/mp3-royaltyfree/Heroic%20Age.mp3` |

Full catalog: https://incompetech.com/music/royalty-free/full_list.php

---

## Theme 1: Space Opera (Star Wars)

**Mood**: Epic, mythic, grand scale
**Voice**: Deep, authoritative (e.g., `onyx`)

### BGM

| Source | Track | URL |
|--------|-------|-----|
| mulmocast-media | theme001.mp3 (epic orchestral fanfare) | `https://github.com/receptron/mulmocast-media/raw/refs/heads/main/bgms/theme001.mp3` |
| Mixkit | Epical Drums 01 | `https://assets.mixkit.co/music/676/676.mp3` |
| Mixkit | Life's a Movie | `https://assets.mixkit.co/music/322/322.mp3` |

### Visual Identity

| Element | Value |
|---------|-------|
| Background | `bg-black` (pure black, always) |
| Primary color | `text-yellow-400` (logo, headings, key text) |
| Secondary color | `text-blue-400` / `text-blue-300` (accent, code, labels) |
| Muted | `text-gray-400` / `text-gray-600` (monospace labels) |
| Font — logo/headings | `font-family:Impact,"Arial Black",sans-serif` |
| Font — body/crawl | `font-family:"Times New Roman",Georgia,serif` |
| Font — code/labels | `font-family:"Courier New",Monaco,monospace` |
| Borders | `border-color:#1e3a5f` (dark blue) |
| Panel background | `rgba(0,0,30,0.5)` or `rgba(0,0,30,0.6)` |
| Glow effect | `text-shadow:0 0 40px rgba(250,204,21,0.4)` on logo |

### Signature element — Procedural Starfield

Generate 120 deterministic stars using seeded `Math.sin` (no `Math.random`):

```javascript
"var sf = document.getElementById('starfield');",
"for (var i = 0; i < 120; i++) {",
"  var d = document.createElement('div');",
"  var sz = (Math.sin(i*127.1)*0.5+0.5)*2+0.5;",
"  var tx = (Math.sin(i*311.7)*0.5+0.5)*100;",
"  var ty = (Math.sin(i*73.3)*0.5+0.5)*100;",
"  var op = (Math.sin(i*43.1)*0.5+0.5)*0.5+0.1;",
"  d.style.cssText='position:absolute;border-radius:50%;background:white;width:'+sz+'px;height:'+sz+'px;top:'+ty+'%;left:'+tx+'%;opacity:'+op;",
"  sf.insertBefore(d,sf.firstChild);",
"}"
```

### Opening Beat — "A long time ago..."

Fade-in/fade-out tagline on black. Classic cold open. Duration 6s for dramatic pacing.

```json
{
  "duration": 6,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full bg-black flex items-center justify-center'>",
      "  <div id='text' class='text-blue-400 text-2xl tracking-wider text-center leading-relaxed' style='font-family:\"Times New Roman\",Georgia,serif;opacity:0'>A long time ago in a galaxy<br>far, far away....</div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#text', { opacity: [0, 1] }, { start: 0.5, end: 1.8 });",
      "animation.animate('#text', { opacity: [1, 0] }, { start: 4.0, end: 5.2 });"
    ],
    "animation": true
  }
}
```

### Logo Reveal Beat

Title scales down from 3x with golden glow. Subtitle fades in after delay.

```json
{
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full bg-black flex flex-col items-center justify-center'>",
      "  <div id='logo' class='text-yellow-400 font-bold tracking-wider text-center' style='font-family:Impact,\"Arial Black\",sans-serif;font-size:110px;opacity:0;text-shadow:0 0 40px rgba(250,204,21,0.4)'>TITLE</div>",
      "  <div id='subtitle' class='text-yellow-500 text-xl tracking-[0.3em] mt-6 text-center' style='font-family:Impact,sans-serif;opacity:0'>EPISODE I — SUBTITLE</div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#logo', { opacity: [0, 1], scale: [3.0, 1] }, { start: 0.3, end: 2.0, easing: 'easeOut' });",
      "animation.animate('#subtitle', { opacity: [0, 1] }, { start: 2.5, end: 3.2 });"
    ],
    "animation": true
  }
}
```

### Opening Crawl Beat

3D perspective text scroll with starfield. Key: `perspective:300px`, `rotateX(25deg)`, `translateY` from 720 to -1100. Top/bottom gradient masks fade edges.

```json
{
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div id='starfield' class='h-full w-full bg-black relative overflow-hidden'>",
      "  <div class='absolute inset-0 flex justify-center' style='perspective:300px;perspective-origin:50% 0%'>",
      "    <div id='crawl' class='absolute text-yellow-400 text-center' style='font-family:\"Times New Roman\",Georgia,serif;width:560px;font-size:21px;line-height:2.2;transform:rotateX(25deg) translateY(720px)'>",
      "      <p class='text-2xl font-bold tracking-[0.3em] mb-4'>EPISODE I</p>",
      "      <p class='text-2xl font-bold mb-10'>SUBTITLE HERE</p>",
      "      <p>First paragraph...</p>",
      "      <p class='mt-8'>Second paragraph...</p>",
      "      <p class='mt-8'>Third paragraph...</p>",
      "    </div>",
      "  </div>",
      "  <div class='absolute top-0 left-0 right-0 h-40 z-10' style='background:linear-gradient(to bottom, black 20%, transparent 100%)'></div>",
      "  <div class='absolute bottom-0 left-0 right-0 h-24 z-10' style='background:linear-gradient(to top, black 0%, transparent 100%)'></div>",
      "</div>"
    ],
    "script": [
      "var sf = document.getElementById('starfield');",
      "for (var i = 0; i < 120; i++) { var d = document.createElement('div'); var sz = (Math.sin(i*127.1)*0.5+0.5)*2+0.5; var tx = (Math.sin(i*311.7)*0.5+0.5)*100; var ty = (Math.sin(i*73.3)*0.5+0.5)*100; var op = (Math.sin(i*43.1)*0.5+0.5)*0.5+0.1; d.style.cssText='position:absolute;border-radius:50%;background:white;width:'+sz+'px;height:'+sz+'px;top:'+ty+'%;left:'+tx+'%;opacity:'+op; sf.insertBefore(d,sf.firstChild); }",
      "const animation = new MulmoAnimation();",
      "animation.animate('#crawl', { rotateX: [25, 25], translateY: [720, -1100] }, { start: 0, end: 'auto' });"
    ],
    "animation": true
  }
}
```

### Feature Beat — Lightsaber Label + Code Reveal

Glowing bar expands, heading slides in, code reveals line-by-line.

```json
{
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full bg-black flex flex-col justify-center px-20'>",
      "  <div class='flex items-center gap-3 mb-2'>",
      "    <div id='saber' class='h-1 rounded-full' style='background:linear-gradient(90deg,#60a5fa,#93c5fd);width:0;opacity:0'></div>",
      "    <div id='label' class='text-blue-400 text-xs tracking-[0.3em]' style='font-family:monospace;opacity:0'>CATEGORY</div>",
      "  </div>",
      "  <div id='heading' class='text-yellow-400 text-5xl font-bold mb-8' style='font-family:Impact,sans-serif;opacity:0'>Feature Name</div>",
      "  <div class='p-6 rounded border' style='border-color:#1e3a5f;background:rgba(0,0,30,0.5)'>",
      "    <pre id='code' class='text-blue-300 text-base leading-relaxed' style='font-family:\"Courier New\",Monaco,monospace'></pre>",
      "    <span id='cursor' class='text-blue-300' style='font-family:monospace'>|</span>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "var codeLines = ['line1', 'line2', 'line3'];",
      "const animation = new MulmoAnimation();",
      "animation.animate('#saber', { opacity: [0, 1], width: [0, 60, 'px'] }, { start: 0, end: 0.5, easing: 'easeOut' });",
      "animation.animate('#label', { opacity: [0, 1] }, { start: 0.3, end: 0.6 });",
      "animation.animate('#heading', { opacity: [0, 1], translateX: [-20, 0] }, { start: 0.5, end: 1.0, easing: 'easeOut' });",
      "animation.codeReveal('#code', codeLines, { start: 1.2, end: 4.0 });",
      "animation.blink('#cursor', { interval: 0.35 });"
    ],
    "animation": true
  }
}
```

### Dashboard Beat — System Status Grid

2x2 counter grid with blinking indicator. Monospace labels, Impact status line.

```json
{
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full bg-black flex flex-col p-12'>",
      "  <div class='flex justify-between items-center mb-6'>",
      "    <div id='sysLabel' class='text-yellow-600 text-xs tracking-[0.3em]' style='font-family:monospace;opacity:0'>SYSTEM STATUS</div>",
      "    <div class='flex items-center gap-2'>",
      "      <div id='indicator' class='w-2 h-2 rounded-full bg-blue-400'></div>",
      "      <span class='text-xs text-gray-600' style='font-family:monospace'>ACTIVE</span>",
      "    </div>",
      "  </div>",
      "  <div class='grid grid-cols-2 gap-4 flex-1'>",
      "    <div id='m0' class='p-5 rounded' style='border:1px solid #1e3a5f;opacity:0'>",
      "      <div class='text-xs tracking-widest text-gray-600' style='font-family:monospace'>METRIC A</div>",
      "      <span id='c0' class='text-4xl font-bold text-blue-400'></span>",
      "    </div>",
      "    <div id='m1' class='p-5 rounded' style='border:1px solid #1e3a5f;opacity:0'>",
      "      <div class='text-xs tracking-widest text-gray-600' style='font-family:monospace'>METRIC B</div>",
      "      <span id='c1' class='text-4xl font-bold text-gray-200'></span>",
      "    </div>",
      "  </div>",
      "  <div id='status' class='mt-4 text-sm tracking-[0.3em] text-center text-yellow-400' style='font-family:Impact,sans-serif;opacity:0'>ALL SYSTEMS OPERATIONAL</div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#sysLabel', { opacity: [0, 1] }, { start: 0, end: 0.2 });",
      "animation.blink('#indicator', { interval: 0.5 });",
      "animation.stagger('#m{i}', 2, { opacity: [0, 1] }, { start: 0.3, stagger: 0.4, duration: 0.25 });",
      "animation.counter('#c0', [0, 99.9], { start: 0.5, end: 3.0, decimals: 1 });",
      "animation.counter('#c1', [0, 6], { start: 0.9, end: 3.0, decimals: 0 });",
      "animation.animate('#status', { opacity: [0, 1] }, { start: 4.0, end: 4.5 });"
    ],
    "animation": true
  }
}
```

### Closing Beat — Lightsaber Line + Title Card

```json
{
  "duration": 5,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full bg-black flex flex-col items-center justify-center'>",
      "  <div id='saber' class='mb-8 h-1 rounded-full' style='background:linear-gradient(90deg,transparent,#60a5fa,#93c5fd,#60a5fa,transparent);width:0;opacity:0'></div>",
      "  <div id='name' class='text-yellow-400 font-bold tracking-wider text-center' style='font-family:Impact,\"Arial Black\",sans-serif;font-size:100px;opacity:0;text-shadow:0 0 50px rgba(250,204,21,0.3)'>Title</div>",
      "  <div id='tagline' class='text-yellow-500 text-2xl tracking-[0.5em] mt-8' style='font-family:Georgia,\"Times New Roman\",serif;opacity:0'>TAGLINE</div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#saber', { opacity: [0, 0.8], width: [0, 500, 'px'] }, { start: 0.2, end: 1.2, easing: 'easeOut' });",
      "animation.animate('#name', { opacity: [0, 1], scale: [1.3, 1] }, { start: 0.8, end: 1.8, easing: 'easeOut' });",
      "animation.animate('#tagline', { opacity: [0, 1] }, { start: 2.2, end: 2.8 });"
    ],
    "animation": true
  }
}
```

---

## Theme 2: Cyberpunk Terminal (Ghost in the Shell)

**Mood**: High-tech, dystopian, neural-network aesthetic
**Voice**: Deep, authoritative (e.g., `onyx`)

### BGM

| Source | Track | URL |
|--------|-------|-----|
| mulmocast-media | story002.mp3 (techno, inspiring) | `https://github.com/receptron/mulmocast-media/raw/refs/heads/main/bgms/story002.mp3` |
| Mixkit | Cyberpunk City | `https://assets.mixkit.co/music/140/140.mp3` |
| Mixkit | Kodama Night Town | `https://assets.mixkit.co/music/114/114.mp3` |

### Visual Identity

| Element | Value |
|---------|-------|
| Background | `background:#0a0e17` (near-black navy) |
| Primary color | `color:#00FF41` (terminal green — text, status, code) |
| Secondary color | `color:#00FFFF` (cyan — headings, labels, accents) |
| Alert color | `color:#FF6B00` (orange — warnings, critical badges) |
| Muted | `color:#555` (dark gray — secondary labels) |
| Font — all elements | `font-family:'Courier New','Monaco',monospace` |
| Borders | `border:1px solid #1a3a4a` (dark teal) |
| Panel background | `background:#0d1117` (dark code block) |

### Signature element — CRT Scanline Overlay

Add to EVERY beat as an absolute-positioned layer:

```html
<div class='absolute inset-0 pointer-events-none' style='background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,65,0.03) 2px,rgba(0,255,65,0.03) 4px)'></div>
```

### Opening Beat — Boot Sequence

Scanline sweeps top-to-bottom while terminal lines appear with stagger.

```json
{
  "duration": 3,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<style>body{font-family:'Courier New','Monaco',monospace}</style>",
      "<div class='h-full w-full relative' style='background:#0a0e17'>",
      "  <div id='scanline' class='absolute left-0 w-full h-0.5' style='background:#00FF41;opacity:0.6;top:0'></div>",
      "  <div class='absolute inset-0 pointer-events-none' style='background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,65,0.03) 2px,rgba(0,255,65,0.03) 4px)'></div>",
      "  <div class='h-full flex flex-col justify-center px-20'>",
      "    <div id='l0' class='text-sm mb-2' style='color:#00FF41;opacity:0'>[SYS] Initializing neural network...</div>",
      "    <div id='l1' class='text-sm mb-2' style='color:#00FF41;opacity:0'>[SYS] Loading kernel v2.4...</div>",
      "    <div id='l2' class='text-sm mb-2' style='color:#00FF41;opacity:0'>[SYS] AI providers: 4 nodes detected</div>",
      "    <div id='l3' class='text-sm mb-2' style='color:#00FF41;opacity:0'>[SYS] Establishing secure channels...</div>",
      "    <div id='done' class='text-lg font-bold mt-4' style='color:#00FFFF;opacity:0'>CONNECTION ESTABLISHED</div>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#scanline', { translateY: [0, 720] }, { start: 0, end: 2.0 });",
      "animation.stagger('#l{i}', 4, { opacity: [0, 1] }, { start: 0.3, stagger: 0.35, duration: 0.15 });",
      "animation.animate('#done', { opacity: [0, 1] }, { start: 2.0, end: 2.3 });"
    ],
    "animation": true
  }
}
```

### Logo Beat — Glitch Title

Triple-layered text (green offset -3px/-2px, cyan offset +3px/+2px, white main) = chromatic aberration.

```json
{
  "duration": 4,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<style>body{font-family:'Courier New','Monaco',monospace}</style>",
      "<div class='h-full w-full relative' style='background:#0a0e17'>",
      "  <div class='absolute inset-0 pointer-events-none' style='background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,65,0.03) 2px,rgba(0,255,65,0.03) 4px)'></div>",
      "  <div class='h-full flex flex-col items-center justify-center'>",
      "    <div class='relative'>",
      "      <div id='glitch1' class='absolute text-8xl font-bold tracking-wider' style='color:#00FF41;opacity:0;left:-3px;top:-2px'>TITLE</div>",
      "      <div id='glitch2' class='absolute text-8xl font-bold tracking-wider' style='color:#00FFFF;opacity:0;left:3px;top:2px'>TITLE</div>",
      "      <div id='title' class='text-8xl font-bold tracking-wider text-white' style='opacity:0'>TITLE</div>",
      "    </div>",
      "    <div id='line' class='mt-4 h-px' style='background:#00FFFF;opacity:0;width:0'></div>",
      "    <div id='subtitle' class='mt-6 text-lg tracking-[0.3em]' style='color:#00FF41;opacity:0'>SUBTITLE</div>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#glitch1', { opacity: [0, 0.4] }, { start: 0.2, end: 0.5 });",
      "animation.animate('#glitch2', { opacity: [0, 0.3] }, { start: 0.3, end: 0.6 });",
      "animation.animate('#title', { opacity: [0, 1], scale: [1.05, 1] }, { start: 0.3, end: 0.8, easing: 'easeOut' });",
      "animation.animate('#line', { opacity: [0, 1], width: [0, 500, 'px'] }, { start: 1.0, end: 1.8, easing: 'easeOut' });",
      "animation.animate('#subtitle', { opacity: [0, 1] }, { start: 1.5, end: 2.0 });"
    ],
    "animation": true
  }
}
```

### Feature Beat — Terminal Window

Window chrome (3 colored dots), typewriter command, stagger output, bold result.

```json
{
  "duration": 4,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<style>body{font-family:'Courier New','Monaco',monospace}</style>",
      "<div class='h-full w-full relative' style='background:#0a0e17'>",
      "  <div class='absolute inset-0 pointer-events-none' style='background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,65,0.03) 2px,rgba(0,255,65,0.03) 4px)'></div>",
      "  <div class='h-full flex flex-col items-center justify-center'>",
      "    <div class='w-[750px] rounded' style='background:#0d1117;border:1px solid #1a3a4a'>",
      "      <div class='flex items-center gap-2 px-4 py-2' style='border-bottom:1px solid #1a3a4a'>",
      "        <div class='w-2.5 h-2.5 rounded-full' style='background:#FF6B00'></div>",
      "        <div class='w-2.5 h-2.5 rounded-full' style='background:#00FF41'></div>",
      "        <div class='w-2.5 h-2.5 rounded-full' style='background:#00FFFF'></div>",
      "        <span class='text-xs ml-2' style='color:#555'>user@cyberspace</span>",
      "      </div>",
      "      <div class='p-6'>",
      "        <div class='flex items-center'>",
      "          <span style='color:#00FFFF'>$</span>",
      "          <span id='cmd' class='ml-2' style='color:#00FF41'></span>",
      "          <span id='cur' style='color:#00FF41'>&#9608;</span>",
      "        </div>",
      "        <div id='s0' class='mt-3 text-sm' style='color:#555;opacity:0'>[step1] Processing... done</div>",
      "        <div id='s1' class='mt-1 text-sm' style='color:#555;opacity:0'>[step2] Processing... done</div>",
      "        <div id='s2' class='mt-1 text-sm' style='color:#555;opacity:0'>[step3] Processing... done</div>",
      "        <div id='done' class='mt-3 text-base font-bold' style='color:#00FF41;opacity:0'>Output: result.mp4</div>",
      "      </div>",
      "    </div>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.typewriter('#cmd', 'command --option value', { start: 0.3, end: 1.8 });",
      "animation.blink('#cur', { interval: 0.3 });",
      "animation.stagger('#s{i}', 3, { opacity: [0, 1] }, { start: 2.0, stagger: 0.3, duration: 0.15 });",
      "animation.animate('#done', { opacity: [0, 1] }, { start: 3.0, end: 3.3 });"
    ],
    "animation": true
  }
}
```

### Feature Beat — Vulnerability Alert List

Orange CRITICAL badges slide in from left with `translateX: [-20, 0]`.

```json
{
  "duration": 5,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<style>body{font-family:'Courier New','Monaco',monospace}</style>",
      "<div class='h-full w-full relative' style='background:#0a0e17'>",
      "  <div class='absolute inset-0 pointer-events-none' style='background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,65,0.03) 2px,rgba(0,255,65,0.03) 4px)'></div>",
      "  <div class='h-full flex flex-col justify-center px-20'>",
      "    <div id='alert' class='text-sm tracking-[0.3em] mb-8' style='color:#FF6B00;opacity:0'>VULNERABILITY DETECTED</div>",
      "    <div id='v0' class='flex items-center gap-4 mb-6' style='opacity:0'>",
      "      <span class='px-2 py-1 text-xs font-bold' style='background:#FF6B00;color:#0a0e17'>CRITICAL</span>",
      "      <span style='color:#ccc'>Issue description 1</span>",
      "    </div>",
      "    <div id='v1' class='flex items-center gap-4 mb-6' style='opacity:0'>",
      "      <span class='px-2 py-1 text-xs font-bold' style='background:#FF6B00;color:#0a0e17'>CRITICAL</span>",
      "      <span style='color:#ccc'>Issue description 2</span>",
      "    </div>",
      "    <div id='v2' class='flex items-center gap-4 mb-6' style='opacity:0'>",
      "      <span class='px-2 py-1 text-xs font-bold' style='background:#FF6B00;color:#0a0e17'>CRITICAL</span>",
      "      <span style='color:#ccc'>Issue description 3</span>",
      "    </div>",
      "    <div id='verdict' class='mt-6 text-base font-bold' style='color:#FF6B00;opacity:0'>STATUS: LEGACY ARCHITECTURE</div>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#alert', { opacity: [0, 1] }, { start: 0, end: 0.3 });",
      "animation.stagger('#v{i}', 3, { opacity: [0, 1], translateX: [-20, 0] }, { start: 0.5, stagger: 0.5, duration: 0.3, easing: 'easeOut' });",
      "animation.animate('#verdict', { opacity: [0, 1] }, { start: 2.5, end: 3.0 });"
    ],
    "animation": true
  }
}
```

### Closing Beat — Dive / Expanding Ring

Cyan ring expands behind centered text. "Dive into cyberspace" effect.

```json
{
  "duration": 5,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<style>body{font-family:'Courier New','Monaco',monospace}</style>",
      "<div class='h-full w-full relative' style='background:#0a0e17'>",
      "  <div class='absolute inset-0 pointer-events-none' style='background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,65,0.03) 2px,rgba(0,255,65,0.03) 4px)'></div>",
      "  <div class='absolute inset-0 flex items-center justify-center'>",
      "    <div id='ring' class='rounded-full' style='border:1px solid #00FFFF;opacity:0;width:0;height:0'></div>",
      "  </div>",
      "  <div class='h-full flex flex-col items-center justify-center relative'>",
      "    <div id='keyword' class='text-7xl font-bold tracking-[0.5em]' style='color:#00FFFF;opacity:0'>DIVE</div>",
      "    <div id='text1' class='text-2xl tracking-wider mt-8' style='color:white;opacity:0'>Main closing text</div>",
      "    <div id='cmd' class='mt-12 text-base tracking-wider' style='color:#00FF41;opacity:0'>$ npm install -g mulmocast</div>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#ring', { opacity: [0, 0.3], width: [0, 600, 'px'], height: [0, 600, 'px'] }, { start: 0.2, end: 2.0, easing: 'easeOut' });",
      "animation.animate('#keyword', { opacity: [0, 1], scale: [1.3, 1] }, { start: 0.3, end: 0.8, easing: 'easeOut' });",
      "animation.animate('#text1', { opacity: [0, 1] }, { start: 1.0, end: 1.5 });",
      "animation.animate('#cmd', { opacity: [0, 1] }, { start: 3.0, end: 3.5 });"
    ],
    "animation": true
  }
}
```

---

## Theme 3: Mecha Anime (Evangelion)

**Mood**: Urgent, dramatic, military briefing aesthetic
**Voice**: Deep, authoritative (e.g., `onyx`)

### BGM

| Source | Track | URL |
|--------|-------|-----|
| mulmocast-media | theme001.mp3 (epic orchestral) | `https://github.com/receptron/mulmocast-media/raw/refs/heads/main/bgms/theme001.mp3` |
| mulmocast-media | classical001.mp3 (classical) | `https://github.com/receptron/mulmocast-media/raw/refs/heads/main/bgms/classical001.mp3` |
| Mixkit | Epical Drums 02 | `https://assets.mixkit.co/music/677/677.mp3` |

### Visual Identity

| Element | Value |
|---------|-------|
| Background | `bg-black` (pure black) |
| Primary color | `text-red-600` (warnings, headers, accents, lines) |
| Secondary color | `text-white` (body text, headings) |
| Status color | `text-green-500` (system OK, counters) |
| Muted | `text-gray-500` / `text-gray-600` |
| Font — body/Japanese | `font-family:'Hiragino Mincho ProN','Yu Mincho',serif` (Mincho) |
| Font — labels/UI | `font-sans` (sans-serif class) |
| Font — code/data | `font-mono` |
| Borders | `border border-gray-700` or `border-gray-800` |

### Signature element — Red Bars

Top/bottom decorative red lines framing the content:

```html
<div id='topLine' class='w-full h-1 bg-red-600' style='opacity:0'></div>
<!-- content -->
<div id='bottomLine' class='w-full h-1 bg-red-600' style='opacity:0'></div>
```

### Opening Beat — WARNING Screen

Red WARNING + Japanese subtitle + blinking red indicator + red bars.

```json
{
  "duration": 3,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<style>body{font-family:'Hiragino Mincho ProN','Yu Mincho',serif}</style>",
      "<div class='h-full w-full bg-black flex flex-col'>",
      "  <div id='topLine' class='w-full h-1 bg-red-600' style='opacity:0'></div>",
      "  <div class='flex-1 flex flex-col items-center justify-center'>",
      "    <div id='warning' class='font-sans text-red-600 text-8xl font-bold tracking-[0.3em]' style='opacity:0'>WARNING</div>",
      "    <div id='warningJp' class='text-red-500 text-3xl mt-6 tracking-[0.5em]' style='opacity:0'>警 告</div>",
      "    <div id='indicator' class='mt-8 w-3 h-3 rounded-full bg-red-600'></div>",
      "  </div>",
      "  <div id='bottomLine' class='w-full h-1 bg-red-600' style='opacity:0'></div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#topLine', { opacity: [0, 1] }, { start: 0, end: 0.15 });",
      "animation.animate('#bottomLine', { opacity: [0, 1] }, { start: 0, end: 0.15 });",
      "animation.animate('#warning', { opacity: [0, 1] }, { start: 0.2, end: 0.5 });",
      "animation.animate('#warningJp', { opacity: [0, 1] }, { start: 0.6, end: 0.9 });",
      "animation.blink('#indicator', { interval: 0.3 });"
    ],
    "animation": true
  }
}
```

### Feature Beat — Dramatic Typewriter

Large text typewriter + expanding red underline. Maximum dramatic impact.

```json
{
  "duration": 4,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<style>body{font-family:'Hiragino Mincho ProN','Yu Mincho',serif}</style>",
      "<div class='h-full w-full bg-black flex flex-col items-center justify-center'>",
      "  <div id='text' class='text-white text-6xl font-bold tracking-wider'></div>",
      "  <div id='underline' class='mt-8 h-1 bg-red-600' style='opacity:0;width:0'></div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.typewriter('#text', 'Dramatic statement.', { start: 0.3, end: 2.5 });",
      "animation.animate('#underline', { opacity: [0, 1], width: [0, 500, 'px'] }, { start: 2.5, end: 3.3, easing: 'easeOut' });"
    ],
    "animation": true
  }
}
```

### Feature Beat — X-Mark Problem List

Red X marks with items sliding from left. `translateX: [-30, 0]`.

```json
{
  "duration": 4,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<style>body{font-family:'Hiragino Mincho ProN','Yu Mincho',serif}</style>",
      "<div class='h-full w-full bg-black flex flex-col items-start justify-center px-24'>",
      "  <div id='header' class='text-red-600 text-4xl font-bold mb-12 tracking-wider' style='opacity:0'>Section Header</div>",
      "  <div id='item0' class='flex items-center gap-6 mb-8' style='opacity:0'>",
      "    <span class='font-sans text-red-600 text-3xl font-bold'>&times;</span>",
      "    <span class='text-white text-2xl tracking-wide'>Problem 1</span>",
      "  </div>",
      "  <div id='item1' class='flex items-center gap-6 mb-8' style='opacity:0'>",
      "    <span class='font-sans text-red-600 text-3xl font-bold'>&times;</span>",
      "    <span class='text-white text-2xl tracking-wide'>Problem 2</span>",
      "  </div>",
      "  <div id='item2' class='flex items-center gap-6' style='opacity:0'>",
      "    <span class='font-sans text-red-600 text-3xl font-bold'>&times;</span>",
      "    <span class='text-white text-2xl tracking-wide'>Problem 3</span>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#header', { opacity: [0, 1] }, { start: 0, end: 0.4 });",
      "animation.stagger('#item{i}', 3, { opacity: [0, 1], translateX: [-30, 0] }, { start: 0.5, stagger: 0.5, duration: 0.4, easing: 'easeOut' });"
    ],
    "animation": true
  }
}
```

### Closing Beat — Next Episode Preview (次回予告)

Red bars + bold header + staggered text lines. Iconic anime episode preview format.

```json
{
  "duration": 5,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<style>body{font-family:'Hiragino Mincho ProN','Yu Mincho',serif}</style>",
      "<div class='h-full w-full bg-black flex flex-col'>",
      "  <div id='topBar' class='w-full h-1 bg-red-600' style='opacity:0'></div>",
      "  <div class='flex-1 flex flex-col items-center justify-center px-20'>",
      "    <div id='header' class='text-red-600 text-5xl font-bold tracking-[0.5em] mb-16' style='opacity:0'>次回予告</div>",
      "    <div id='line0' class='text-white text-2xl tracking-wider mb-3' style='opacity:0'>Line 1</div>",
      "    <div id='line1' class='text-white text-2xl tracking-wider mb-3' style='opacity:0'>Line 2</div>",
      "    <div id='line2' class='text-white text-2xl tracking-wider' style='opacity:0'>Line 3</div>",
      "  </div>",
      "  <div id='bottomBar' class='w-full h-1 bg-red-600' style='opacity:0'></div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#topBar', { opacity: [0, 1] }, { start: 0, end: 0.15 });",
      "animation.animate('#bottomBar', { opacity: [0, 1] }, { start: 0, end: 0.15 });",
      "animation.animate('#header', { opacity: [0, 1] }, { start: 0.2, end: 0.6 });",
      "animation.stagger('#line{i}', 3, { opacity: [0, 1] }, { start: 1.0, stagger: 0.6, duration: 0.3 });"
    ],
    "animation": true
  }
}
```

---

## Theme 4: Film Noir

**Mood**: Moody, mysterious, 1940s detective, smoky jazz bar
**Voice**: Low, smooth (e.g., `onyx` or `echo`)

### BGM

| Source | Track | URL |
|--------|-------|-----|
| mulmocast-media | story001.mp3 (smooth, piano) | `https://github.com/receptron/mulmocast-media/raw/refs/heads/main/bgms/story001.mp3` |
| Mixkit | Minimalist Jazz | `https://assets.mixkit.co/music/651/651.mp3` |
| Mixkit | Cinematic Jazz | `https://assets.mixkit.co/music/653/653.mp3` |
| Mixkit | Lonely in the Bar | `https://assets.mixkit.co/music/518/518.mp3` |
| Mixkit | Smooth Like Jazz | `https://assets.mixkit.co/music/24/24.mp3` |
| Incompetech | Night on the Docks - Sax | `https://incompetech.com/music/royalty-free/mp3-royaltyfree/Night%20on%20the%20Docks%20-%20Sax.mp3` |
| Incompetech | Investigations | `https://incompetech.com/music/royalty-free/mp3-royaltyfree/Investigations.mp3` |

### Visual Identity

| Element | Value |
|---------|-------|
| Background | `background:#0c0c0c` (near-black) |
| Primary color | `color:#d4a857` (muted gold — headings, accents) |
| Secondary color | `color:#8b8b8b` (silver-gray — body text) |
| Highlight | `color:#e8d5a3` (warm cream — key phrases) |
| Muted | `color:#444` (dark gray) |
| Font — headings | `font-family:Georgia,"Times New Roman",serif` |
| Font — body | `font-family:Georgia,serif` |
| Font — labels | `font-family:"Courier New",monospace` |
| Borders | `border:1px solid #333` |
| Film grain overlay | `background:url("data:image/svg+xml,...")` or noise via subtle opacity |

### Signature element — Venetian Blind Shadow

Horizontal light stripes simulating light through blinds:

```html
<div class='absolute inset-0 pointer-events-none' style='background:repeating-linear-gradient(180deg,transparent,transparent 28px,rgba(212,168,87,0.04) 28px,rgba(212,168,87,0.04) 30px);transform:rotate(-5deg) scale(1.2)'></div>
```

### Opening Beat — Noir Title Card

Slow fade-in with gold text, venetian blind overlay.

```json
{
  "duration": 5,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full relative' style='background:#0c0c0c'>",
      "  <div class='absolute inset-0 pointer-events-none' style='background:repeating-linear-gradient(180deg,transparent,transparent 28px,rgba(212,168,87,0.04) 28px,rgba(212,168,87,0.04) 30px);transform:rotate(-5deg) scale(1.2)'></div>",
      "  <div class='h-full flex flex-col items-center justify-center relative'>",
      "    <div id='line' class='h-px mb-8' style='background:linear-gradient(90deg,transparent,#d4a857,transparent);opacity:0;width:0'></div>",
      "    <div id='title' class='text-7xl font-bold tracking-wider text-center' style='font-family:Georgia,serif;color:#d4a857;opacity:0'>TITLE</div>",
      "    <div id='subtitle' class='text-xl tracking-[0.3em] mt-6 text-center' style='font-family:Georgia,serif;color:#8b8b8b;opacity:0'>A Story of Shadows and Light</div>",
      "    <div id='line2' class='h-px mt-8' style='background:linear-gradient(90deg,transparent,#d4a857,transparent);opacity:0;width:0'></div>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#line', { opacity: [0, 0.6], width: [0, 400, 'px'] }, { start: 0.5, end: 1.5, easing: 'easeOut' });",
      "animation.animate('#title', { opacity: [0, 1] }, { start: 1.0, end: 2.0 });",
      "animation.animate('#subtitle', { opacity: [0, 0.7] }, { start: 2.0, end: 3.0 });",
      "animation.animate('#line2', { opacity: [0, 0.6], width: [0, 400, 'px'] }, { start: 2.5, end: 3.5, easing: 'easeOut' });"
    ],
    "animation": true
  }
}
```

### Feature Beat — Case File

Case file card with gold label, serif body text, slow reveal.

```json
{
  "duration": 5,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full relative' style='background:#0c0c0c'>",
      "  <div class='absolute inset-0 pointer-events-none' style='background:repeating-linear-gradient(180deg,transparent,transparent 28px,rgba(212,168,87,0.04) 28px,rgba(212,168,87,0.04) 30px);transform:rotate(-5deg) scale(1.2)'></div>",
      "  <div class='h-full flex flex-col justify-center px-24 relative'>",
      "    <div id='label' class='text-xs tracking-[0.5em] mb-6' style='font-family:\"Courier New\",monospace;color:#d4a857;opacity:0'>CASE FILE #001</div>",
      "    <div id='heading' class='text-4xl font-bold mb-8' style='font-family:Georgia,serif;color:#e8d5a3;opacity:0'>The Evidence</div>",
      "    <div id='divider' class='h-px mb-8' style='background:#333;opacity:0;width:0'></div>",
      "    <div id='p0' class='text-lg leading-relaxed mb-4' style='font-family:Georgia,serif;color:#8b8b8b;opacity:0'>First piece of evidence...</div>",
      "    <div id='p1' class='text-lg leading-relaxed mb-4' style='font-family:Georgia,serif;color:#8b8b8b;opacity:0'>Second piece of evidence...</div>",
      "    <div id='p2' class='text-lg leading-relaxed' style='font-family:Georgia,serif;color:#8b8b8b;opacity:0'>Third piece of evidence...</div>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#label', { opacity: [0, 1] }, { start: 0, end: 0.5 });",
      "animation.animate('#heading', { opacity: [0, 1] }, { start: 0.3, end: 0.8 });",
      "animation.animate('#divider', { opacity: [0, 0.5], width: [0, 600, 'px'] }, { start: 0.5, end: 1.2, easing: 'easeOut' });",
      "animation.stagger('#p{i}', 3, { opacity: [0, 0.8] }, { start: 1.0, stagger: 0.6, duration: 0.5 });"
    ],
    "animation": true
  }
}
```

### Closing Beat — Fadeout Quote

Centered italic quote, slow fade, gold decorative lines.

```json
{
  "duration": 5,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full relative' style='background:#0c0c0c'>",
      "  <div class='absolute inset-0 pointer-events-none' style='background:repeating-linear-gradient(180deg,transparent,transparent 28px,rgba(212,168,87,0.04) 28px,rgba(212,168,87,0.04) 30px);transform:rotate(-5deg) scale(1.2)'></div>",
      "  <div class='h-full flex flex-col items-center justify-center relative px-24'>",
      "    <div id='quote' class='text-3xl italic leading-relaxed text-center' style='font-family:Georgia,serif;color:#e8d5a3;opacity:0'>\"In this city, every shadow tells a story.\"</div>",
      "    <div id='author' class='text-lg mt-6 tracking-wider' style='font-family:\"Courier New\",monospace;color:#d4a857;opacity:0'>— The Narrator</div>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#quote', { opacity: [0, 1] }, { start: 0.5, end: 2.0 });",
      "animation.animate('#author', { opacity: [0, 0.7] }, { start: 2.5, end: 3.5 });"
    ],
    "animation": true
  }
}
```

---

## Theme 5: Retro Synthwave / 80s

**Mood**: Neon-lit nostalgia, outrun, vaporwave
**Voice**: Energetic or smooth (e.g., `shimmer`, `nova`)

### BGM

| Source | Track | URL |
|--------|-------|-----|
| mulmocast-media | vibe001.mp3 (rap, dance) | `https://github.com/receptron/mulmocast-media/raw/refs/heads/main/bgms/vibe001.mp3` |
| Mixkit | Better Times are Coming | `https://assets.mixkit.co/music/173/173.mp3` |
| Mixkit | Sun in Your Eyes | `https://assets.mixkit.co/music/131/131.mp3` |
| Mixkit | Lonerism | `https://assets.mixkit.co/music/159/159.mp3` |

### Visual Identity

| Element | Value |
|---------|-------|
| Background | Gradient: `background:linear-gradient(180deg,#0a001a 0%,#1a0033 50%,#330044 100%)` |
| Primary color | `color:#ff00ff` (hot pink / magenta) |
| Secondary color | `color:#00ffff` (cyan) |
| Accent | `color:#ff6600` (orange) |
| Text | `color:#fff` (white for body) |
| Font — headings | `font-family:'Arial Black',Impact,sans-serif` (bold, blocky) |
| Font — body | `font-family:'Courier New',monospace` |
| Neon glow | `text-shadow:0 0 20px #ff00ff,0 0 40px #ff00ff` |

### Signature element — Neon Grid Floor

Perspective grid giving the classic "outrun highway" look:

```html
<div class='absolute bottom-0 left-0 right-0' style='height:40%;background:linear-gradient(180deg,transparent 0%,rgba(255,0,255,0.1) 100%);border-top:2px solid rgba(255,0,255,0.5)'>
  <div style='width:100%;height:100%;background:repeating-linear-gradient(90deg,transparent,transparent 78px,rgba(255,0,255,0.15) 78px,rgba(255,0,255,0.15) 80px),repeating-linear-gradient(180deg,transparent,transparent 18px,rgba(255,0,255,0.1) 18px,rgba(255,0,255,0.1) 20px)'></div>
</div>
```

### Opening Beat — Neon Title

Title with neon glow scales in over gradient background with grid.

```json
{
  "duration": 4,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full relative' style='background:linear-gradient(180deg,#0a001a 0%,#1a0033 50%,#330044 100%)'>",
      "  <div class='absolute bottom-0 left-0 right-0' style='height:40%;border-top:2px solid rgba(255,0,255,0.5)'>",
      "    <div style='width:100%;height:100%;background:repeating-linear-gradient(90deg,transparent,transparent 78px,rgba(255,0,255,0.15) 78px,rgba(255,0,255,0.15) 80px),repeating-linear-gradient(180deg,transparent,transparent 18px,rgba(255,0,255,0.1) 18px,rgba(255,0,255,0.1) 20px)'></div>",
      "  </div>",
      "  <div class='h-full flex flex-col items-center justify-center relative'>",
      "    <div id='title' class='text-8xl font-bold tracking-wider text-center' style='font-family:\"Arial Black\",Impact,sans-serif;color:#ff00ff;opacity:0;text-shadow:0 0 20px #ff00ff,0 0 40px #ff00ff'>TITLE</div>",
      "    <div id='subtitle' class='text-xl tracking-[0.4em] mt-6' style='font-family:\"Courier New\",monospace;color:#00ffff;opacity:0;text-shadow:0 0 10px #00ffff'>SUBTITLE</div>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#title', { opacity: [0, 1], scale: [1.5, 1] }, { start: 0.3, end: 1.5, easing: 'easeOut' });",
      "animation.animate('#subtitle', { opacity: [0, 1] }, { start: 1.5, end: 2.2 });"
    ],
    "animation": true
  }
}
```

### Feature Beat — Neon Stat Cards

Bright neon-bordered cards with counter animation on gradient background.

```json
{
  "duration": 4,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full relative' style='background:linear-gradient(180deg,#0a001a 0%,#1a0033 100%)'>",
      "  <div class='h-full flex flex-col items-center justify-center relative'>",
      "    <div id='label' class='text-sm tracking-[0.5em] mb-8' style='font-family:\"Courier New\",monospace;color:#00ffff;opacity:0'>STATISTICS</div>",
      "    <div class='flex gap-6'>",
      "      <div id='c0' class='p-6 text-center' style='border:2px solid #ff00ff;background:rgba(255,0,255,0.05);opacity:0;min-width:180px'>",
      "        <div class='text-xs tracking-widest mb-2' style='color:#ff00ff;font-family:monospace'>METRIC 1</div>",
      "        <div id='n0' class='text-5xl font-bold' style='color:white;font-family:\"Arial Black\",sans-serif'></div>",
      "      </div>",
      "      <div id='c1' class='p-6 text-center' style='border:2px solid #00ffff;background:rgba(0,255,255,0.05);opacity:0;min-width:180px'>",
      "        <div class='text-xs tracking-widest mb-2' style='color:#00ffff;font-family:monospace'>METRIC 2</div>",
      "        <div id='n1' class='text-5xl font-bold' style='color:white;font-family:\"Arial Black\",sans-serif'></div>",
      "      </div>",
      "      <div id='c2' class='p-6 text-center' style='border:2px solid #ff6600;background:rgba(255,102,0,0.05);opacity:0;min-width:180px'>",
      "        <div class='text-xs tracking-widest mb-2' style='color:#ff6600;font-family:monospace'>METRIC 3</div>",
      "        <div id='n2' class='text-5xl font-bold' style='color:white;font-family:\"Arial Black\",sans-serif'></div>",
      "      </div>",
      "    </div>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#label', { opacity: [0, 1] }, { start: 0, end: 0.3 });",
      "animation.stagger('#c{i}', 3, { opacity: [0, 1], translateY: [20, 0] }, { start: 0.3, stagger: 0.3, duration: 0.3, easing: 'easeOut' });",
      "animation.counter('#n0', [0, 100], { start: 0.5, end: 2.5, decimals: 0 });",
      "animation.counter('#n1', [0, 50], { start: 0.8, end: 2.5, decimals: 0 });",
      "animation.counter('#n2', [0, 30], { start: 1.1, end: 2.5, decimals: 0 });"
    ],
    "animation": true
  }
}
```

---

## Theme 6: Matrix / Digital Rain

**Mood**: Hacker, digital, reality-bending
**Voice**: Deep, measured (e.g., `onyx`, `echo`)

### BGM

| Source | Track | URL |
|--------|-------|-----|
| mulmocast-media | llm001.mp3 | `https://github.com/receptron/mulmocast-media/raw/refs/heads/main/bgms/llm001.mp3` |
| Mixkit | Sci-Fi Score | `https://assets.mixkit.co/music/464/464.mp3` |
| Mixkit | Vertigo | `https://assets.mixkit.co/music/597/597.mp3` |
| Mixkit | Brainiac | `https://assets.mixkit.co/music/167/167.mp3` |

### Visual Identity

| Element | Value |
|---------|-------|
| Background | `bg-black` (pure black) |
| Primary color | `color:#00ff00` (Matrix green) |
| Secondary color | `color:#003300` (dark green — faded elements) |
| Highlight | `color:white` (revealed/awakened elements) |
| Font — all | `font-family:'Courier New',Monaco,monospace` |

### Signature element — Digital Rain

Procedural falling characters (katakana + digits) using seeded positions:

```javascript
"var rain = document.getElementById('rain');",
"var chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789';",
"for (var i = 0; i < 40; i++) {",
"  var col = document.createElement('div');",
"  col.style.cssText = 'position:absolute;top:-100%;left:'+(i*3.2)+'%;font-size:14px;line-height:1.4;color:#00ff00;opacity:'+(Math.sin(i*71.3)*0.3+0.4);",
"  var t = '';",
"  for (var j = 0; j < 30; j++) { t += chars[Math.floor(Math.abs(Math.sin(i*127+j*311))*chars.length)] + '<br>'; }",
"  col.innerHTML = t;",
"  col.id = 'col'+i;",
"  rain.appendChild(col);",
"}"
```

### Opening Beat — Wake Up Neo

Digital rain falls behind white text that fades in center.

```json
{
  "duration": 4,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full bg-black relative overflow-hidden'>",
      "  <div id='rain' class='absolute inset-0'></div>",
      "  <div class='h-full flex flex-col items-center justify-center relative'>",
      "    <div id='prompt' class='text-xl' style='font-family:\"Courier New\",monospace;color:#00ff00;opacity:0'>Wake up...</div>",
      "    <div id='title' class='text-7xl font-bold mt-8' style='font-family:\"Courier New\",monospace;color:white;opacity:0'>TITLE</div>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "var rain = document.getElementById('rain');",
      "var chars = 'アイウエオカキクケコサシスセソ0123456789';",
      "for (var i = 0; i < 40; i++) { var col = document.createElement('div'); col.style.cssText = 'position:absolute;top:-100%;left:'+(i*2.5)+'%;font-size:14px;line-height:1.4;color:#00ff00;opacity:'+(Math.sin(i*71.3)*0.3+0.3); var t = ''; for (var j = 0; j < 30; j++) { t += chars[Math.floor(Math.abs(Math.sin(i*127+j*311))*chars.length)] + '<br>'; } col.innerHTML = t; col.id = 'col'+i; rain.appendChild(col); }",
      "const animation = new MulmoAnimation();",
      "for (var k = 0; k < 40; k++) { var spd = (Math.sin(k*43.7)*0.5+0.5)*0.8+0.3; animation.animate('#col'+k, { translateY: [0, 1500] }, { start: spd*0.5, end: 'auto' }); }",
      "animation.animate('#prompt', { opacity: [0, 1] }, { start: 0.5, end: 1.0 });",
      "animation.animate('#title', { opacity: [0, 1] }, { start: 1.5, end: 2.5 });"
    ],
    "animation": true
  }
}
```

### Feature Beat — Red Pill / Blue Pill Choice

Two panels side by side, one tinted red, one tinted blue.

```json
{
  "duration": 5,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full bg-black flex items-center justify-center gap-8 px-16'>",
      "  <div id='left' class='flex-1 p-8 text-center' style='border:1px solid #ff0000;background:rgba(255,0,0,0.05);opacity:0'>",
      "    <div class='text-xs tracking-[0.3em] mb-4' style='font-family:monospace;color:#ff4444'>OPTION A</div>",
      "    <div class='text-3xl font-bold mb-4' style='font-family:monospace;color:#ff6666'>The Truth</div>",
      "    <div class='text-sm' style='font-family:monospace;color:#883333'>Description of this option...</div>",
      "  </div>",
      "  <div id='vs' class='text-2xl font-bold' style='font-family:monospace;color:#00ff00;opacity:0'>OR</div>",
      "  <div id='right' class='flex-1 p-8 text-center' style='border:1px solid #0066ff;background:rgba(0,102,255,0.05);opacity:0'>",
      "    <div class='text-xs tracking-[0.3em] mb-4' style='font-family:monospace;color:#4488ff'>OPTION B</div>",
      "    <div class='text-3xl font-bold mb-4' style='font-family:monospace;color:#6699ff'>The Illusion</div>",
      "    <div class='text-sm' style='font-family:monospace;color:#335588'>Description of this option...</div>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#left', { opacity: [0, 1], translateX: [-30, 0] }, { start: 0.3, end: 1.0, easing: 'easeOut' });",
      "animation.animate('#vs', { opacity: [0, 1] }, { start: 1.2, end: 1.5 });",
      "animation.animate('#right', { opacity: [0, 1], translateX: [30, 0] }, { start: 1.5, end: 2.2, easing: 'easeOut' });"
    ],
    "animation": true
  }
}
```

---

## Theme 7: Documentary / Nature

**Mood**: Calm, elegant, educational, contemplative
**Voice**: Warm, clear (e.g., `shimmer`, `nova`)

### BGM

| Source | Track | URL |
|--------|-------|-----|
| mulmocast-media | story004.mp3 (classical, ambient) | `https://github.com/receptron/mulmocast-media/raw/refs/heads/main/bgms/story004.mp3` |
| mulmocast-media | story005.mp3 (piano solo, classical) | `https://github.com/receptron/mulmocast-media/raw/refs/heads/main/bgms/story005.mp3` |
| Mixkit | Forest Mist Whispers | `https://assets.mixkit.co/music/148/148.mp3` |
| Mixkit | Discover | `https://assets.mixkit.co/music/587/587.mp3` |
| Mixkit | Sun and His Daughter | `https://assets.mixkit.co/music/580/580.mp3` |

### Visual Identity

| Element | Value |
|---------|-------|
| Background | `background:#f5f0e8` (warm parchment) or `bg-white` |
| Primary color | `color:#2c3e50` (dark navy — headings) |
| Secondary color | `color:#7f8c8d` (silver sage — body text) |
| Accent | `color:#c0392b` (muted red — highlights, numbers) |
| Font — headings | `font-family:Georgia,"Times New Roman",serif` |
| Font — body | `font-family:"Helvetica Neue",Arial,sans-serif` |
| Font — captions | `font-family:"Courier New",monospace` |

### Opening Beat — Chapter Title

Minimal, elegant chapter opening with thin lines.

```json
{
  "duration": 4,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full flex flex-col items-center justify-center' style='background:#f5f0e8'>",
      "  <div id='chapter' class='text-sm tracking-[0.5em] mb-4' style='font-family:\"Courier New\",monospace;color:#7f8c8d;opacity:0'>CHAPTER ONE</div>",
      "  <div id='line1' class='h-px mb-6' style='background:#2c3e50;opacity:0;width:0'></div>",
      "  <div id='title' class='text-5xl font-bold tracking-wide text-center' style='font-family:Georgia,serif;color:#2c3e50;opacity:0'>The Beginning</div>",
      "  <div id='line2' class='h-px mt-6' style='background:#2c3e50;opacity:0;width:0'></div>",
      "  <div id='subtitle' class='text-lg mt-6 tracking-wider' style='font-family:Georgia,serif;color:#7f8c8d;opacity:0'>A story of discovery</div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#chapter', { opacity: [0, 1] }, { start: 0.3, end: 0.8 });",
      "animation.animate('#line1', { opacity: [0, 0.5], width: [0, 300, 'px'] }, { start: 0.5, end: 1.3, easing: 'easeOut' });",
      "animation.animate('#title', { opacity: [0, 1] }, { start: 1.0, end: 1.8 });",
      "animation.animate('#line2', { opacity: [0, 0.5], width: [0, 300, 'px'] }, { start: 1.5, end: 2.3, easing: 'easeOut' });",
      "animation.animate('#subtitle', { opacity: [0, 0.7] }, { start: 2.0, end: 2.8 });"
    ],
    "animation": true
  }
}
```

### Feature Beat — Data Callout

Large number with label and supporting text. Clean, minimal.

```json
{
  "duration": 4,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full flex items-center px-24' style='background:#f5f0e8'>",
      "  <div class='flex-1'>",
      "    <div id='label' class='text-xs tracking-[0.3em] mb-4' style='font-family:\"Courier New\",monospace;color:#7f8c8d;opacity:0'>KEY FINDING</div>",
      "    <div class='flex items-end gap-3'>",
      "      <div id='number' class='text-8xl font-bold' style='font-family:Georgia,serif;color:#c0392b'></div>",
      "      <div id='unit' class='text-2xl mb-3' style='font-family:Georgia,serif;color:#7f8c8d;opacity:0'>percent</div>",
      "    </div>",
      "    <div id='divider' class='h-px mt-6 mb-6' style='background:#2c3e50;opacity:0;width:0'></div>",
      "    <div id='desc' class='text-xl leading-relaxed' style='font-family:\"Helvetica Neue\",Arial,sans-serif;color:#2c3e50;opacity:0'>Description of the key finding and its significance.</div>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#label', { opacity: [0, 1] }, { start: 0, end: 0.4 });",
      "animation.counter('#number', [0, 73], { start: 0.3, end: 2.0, decimals: 0 });",
      "animation.animate('#unit', { opacity: [0, 1] }, { start: 1.5, end: 2.0 });",
      "animation.animate('#divider', { opacity: [0, 0.3], width: [0, 500, 'px'] }, { start: 1.5, end: 2.5, easing: 'easeOut' });",
      "animation.animate('#desc', { opacity: [0, 1] }, { start: 2.0, end: 2.8 });"
    ],
    "animation": true
  }
}
```

---

## Theme 8: Anime Opening

**Mood**: Bold, dynamic, energetic Japanese anime
**Voice**: Energetic (e.g., `nova`, `shimmer`)

### BGM

| Source | Track | URL |
|--------|-------|-----|
| mulmocast-media | vibe002.mp3 | `https://github.com/receptron/mulmocast-media/raw/refs/heads/main/bgms/vibe002.mp3` |
| mulmocast-media | olympic001.mp3 (epic fanfare) | `https://github.com/receptron/mulmocast-media/raw/refs/heads/main/bgms/olympic001.mp3` |
| Mixkit | Epic Games | `https://assets.mixkit.co/music/76/76.mp3` |

### Visual Identity

| Element | Value |
|---------|-------|
| Background | `bg-white` or bold gradient |
| Primary color | `color:#e63946` (anime red) |
| Secondary color | `color:#1d3557` (deep navy) |
| Accent | `color:#f4a261` (warm orange) |
| Font — Japanese titles | `font-family:'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif` (Gothic) |
| Font — episode labels | `font-family:Impact,sans-serif` |

### Signature element — Speed Lines

Radiating lines from center creating a motion/impact effect:

```html
<div class='absolute inset-0 pointer-events-none overflow-hidden'>
  <div style='position:absolute;top:50%;left:50%;width:200%;height:200%;transform:translate(-50%,-50%);background:repeating-conic-gradient(from 0deg,transparent 0deg,transparent 8deg,rgba(230,57,70,0.06) 8deg,rgba(230,57,70,0.06) 9deg)'></div>
</div>
```

### Opening Beat — Episode Title Card

Bold title with episode number, dynamic scaling.

```json
{
  "duration": 3,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full bg-white relative overflow-hidden'>",
      "  <div class='absolute inset-0 pointer-events-none'>",
      "    <div style='position:absolute;top:50%;left:50%;width:200%;height:200%;transform:translate(-50%,-50%);background:repeating-conic-gradient(from 0deg,transparent 0deg,transparent 8deg,rgba(230,57,70,0.06) 8deg,rgba(230,57,70,0.06) 9deg)'></div>",
      "  </div>",
      "  <div class='h-full flex flex-col items-center justify-center relative'>",
      "    <div id='ep' class='text-sm tracking-[0.5em] mb-4' style='font-family:Impact,sans-serif;color:#e63946;opacity:0'>EPISODE 01</div>",
      "    <div id='title' class='text-7xl font-bold tracking-wider' style='font-family:\"Hiragino Kaku Gothic ProN\",\"Noto Sans JP\",sans-serif;color:#1d3557;opacity:0'>Title</div>",
      "    <div id='bar' class='mt-6 h-1' style='background:#e63946;opacity:0;width:0'></div>",
      "    <div id='subtitle' class='text-xl mt-4 tracking-wider' style='font-family:\"Hiragino Kaku Gothic ProN\",sans-serif;color:#e63946;opacity:0'>Subtitle</div>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#ep', { opacity: [0, 1] }, { start: 0, end: 0.3 });",
      "animation.animate('#title', { opacity: [0, 1], scale: [1.3, 1] }, { start: 0.2, end: 0.8, easing: 'easeOut' });",
      "animation.animate('#bar', { opacity: [0, 1], width: [0, 400, 'px'] }, { start: 0.8, end: 1.3, easing: 'easeOut' });",
      "animation.animate('#subtitle', { opacity: [0, 1] }, { start: 1.2, end: 1.6 });"
    ],
    "animation": true
  }
}
```

### Feature Beat — Character/Item Reveal

Side-by-side layout with large label sliding in from left.

```json
{
  "duration": 4,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full bg-white flex'>",
      "  <div id='sidebar' class='w-2 h-full' style='background:#e63946;opacity:0'></div>",
      "  <div class='flex-1 flex flex-col justify-center px-20'>",
      "    <div id='tag' class='text-xs tracking-[0.5em] px-3 py-1 inline-block mb-4' style='background:#e63946;color:white;font-family:Impact,sans-serif;opacity:0;width:fit-content'>FEATURE</div>",
      "    <div id='name' class='text-5xl font-bold mb-4' style='font-family:\"Hiragino Kaku Gothic ProN\",sans-serif;color:#1d3557;opacity:0'>Feature Name</div>",
      "    <div id='desc' class='text-xl leading-relaxed' style='font-family:\"Helvetica Neue\",sans-serif;color:#555;opacity:0'>Description of the feature and its significance in the story.</div>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#sidebar', { opacity: [0, 1] }, { start: 0, end: 0.15 });",
      "animation.animate('#tag', { opacity: [0, 1], translateX: [-20, 0] }, { start: 0.2, end: 0.5, easing: 'easeOut' });",
      "animation.animate('#name', { opacity: [0, 1], translateX: [-15, 0] }, { start: 0.4, end: 0.8, easing: 'easeOut' });",
      "animation.animate('#desc', { opacity: [0, 1] }, { start: 0.8, end: 1.3 });"
    ],
    "animation": true
  }
}
```

---

## Theme 9: Horror / Thriller

**Mood**: Dark, unsettling, creeping dread
**Voice**: Deep, slow (e.g., `onyx`, `echo`)

### BGM

| Source | Track | URL |
|--------|-------|-----|
| Mixkit | Piano Horror | `https://assets.mixkit.co/music/671/671.mp3` |
| Mixkit | Dark Shadows | `https://assets.mixkit.co/music/64/64.mp3` |
| Mixkit | Delirium | `https://assets.mixkit.co/music/605/605.mp3` |
| Mixkit | Fright Night | `https://assets.mixkit.co/music/871/871.mp3` |
| Incompetech | Darkest Child | `https://incompetech.com/music/royalty-free/mp3-royaltyfree/Darkest%20Child.mp3` |
| Incompetech | Unseen Horrors | `https://incompetech.com/music/royalty-free/mp3-royaltyfree/Unseen%20Horrors.mp3` |

### Visual Identity

| Element | Value |
|---------|-------|
| Background | `bg-black` or `background:#0a0000` (black with faint red tint) |
| Primary color | `color:#8b0000` (dark blood red) |
| Secondary color | `color:#666` (dim gray — body text) |
| Flicker | `color:#ff0000` (bright red — sudden flashes) |
| Font — headings | `font-family:Georgia,"Times New Roman",serif` |
| Font — body | `font-family:'Courier New',monospace` |

### Signature element — Flicker Overlay

Subtle red-tinted vignette:

```html
<div class='absolute inset-0 pointer-events-none' style='background:radial-gradient(ellipse at center,transparent 50%,rgba(10,0,0,0.8) 100%)'></div>
```

### Opening Beat — Horror Title

Title appears with slow, creeping fade. Red accent.

```json
{
  "duration": 5,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full bg-black relative'>",
      "  <div class='absolute inset-0 pointer-events-none' style='background:radial-gradient(ellipse at center,transparent 50%,rgba(10,0,0,0.8) 100%)'></div>",
      "  <div class='h-full flex flex-col items-center justify-center relative'>",
      "    <div id='title' class='text-8xl font-bold tracking-wider' style='font-family:Georgia,serif;color:#8b0000;opacity:0'>TITLE</div>",
      "    <div id='subtitle' class='text-xl mt-6 tracking-[0.3em]' style='font-family:\"Courier New\",monospace;color:#666;opacity:0'>Something is wrong...</div>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#title', { opacity: [0, 1] }, { start: 1.0, end: 3.0 });",
      "animation.animate('#subtitle', { opacity: [0, 0.6] }, { start: 3.0, end: 4.5 });"
    ],
    "animation": true
  }
}
```

### Feature Beat — Countdown / Timer

Ominous countdown with red numbers.

```json
{
  "duration": 5,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full bg-black relative'>",
      "  <div class='absolute inset-0 pointer-events-none' style='background:radial-gradient(ellipse at center,transparent 50%,rgba(10,0,0,0.8) 100%)'></div>",
      "  <div class='h-full flex flex-col items-center justify-center relative'>",
      "    <div id='label' class='text-xs tracking-[0.5em] mb-8' style='font-family:\"Courier New\",monospace;color:#666;opacity:0'>TIME REMAINING</div>",
      "    <div id='timer' class='font-bold' style='font-family:\"Courier New\",monospace;color:#8b0000;font-size:120px'></div>",
      "    <div id='warning' class='text-lg mt-8 tracking-wider' style='font-family:\"Courier New\",monospace;color:#ff0000;opacity:0'>POINT OF NO RETURN</div>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#label', { opacity: [0, 1] }, { start: 0, end: 0.5 });",
      "animation.counter('#timer', [60, 0], { start: 0.3, end: 4.0, decimals: 0 });",
      "animation.animate('#warning', { opacity: [0, 1] }, { start: 3.5, end: 4.0 });",
      "animation.blink('#warning', { interval: 0.3 });"
    ],
    "animation": true
  }
}
```

### Feature Beat — Revealed Text

Text slowly appears letter by letter, as if being uncovered.

```json
{
  "duration": 5,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full bg-black relative'>",
      "  <div class='absolute inset-0 pointer-events-none' style='background:radial-gradient(ellipse at center,transparent 50%,rgba(10,0,0,0.8) 100%)'></div>",
      "  <div class='h-full flex flex-col items-center justify-center relative px-24'>",
      "    <div id='text' class='text-4xl leading-relaxed text-center' style='font-family:Georgia,serif;color:#666'></div>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.typewriter('#text', 'The truth was hiding in plain sight all along.', { start: 0.5, end: 4.0 });"
    ],
    "animation": true
  }
}
```

---

## Theme 10: Terminator T-800 Vision

**Mood**: Mechanical, threatening, cold machine intelligence
**Voice**: Deep, flat, robotic (e.g., `onyx`)

### BGM

| Source | Track | URL |
|--------|-------|-----|
| mulmocast-media | llm001.mp3 | `https://github.com/receptron/mulmocast-media/raw/refs/heads/main/bgms/llm001.mp3` |
| Mixkit | Cyberpunk City | `https://assets.mixkit.co/music/140/140.mp3` |
| Mixkit | Sci-Fi Score | `https://assets.mixkit.co/music/464/464.mp3` |
| Incompetech | Industrial Revolution | `https://incompetech.com/music/royalty-free/mp3-royaltyfree/Industrial%20Revolution.mp3` |
| Incompetech | Mechanolith | `https://incompetech.com/music/royalty-free/mp3-royaltyfree/Mechanolith.mp3` |

### Visual Identity

| Element | Value |
|---------|-------|
| Background | `background:#1a0000` (dark red-black) |
| Primary color | `color:#ff0000` (HUD red — targeting, borders, text) |
| Secondary color | `color:#ff3333` (lighter red — labels, secondary text) |
| Data color | `color:#ff6666` (soft red — counters, readouts) |
| Muted | `color:#660000` (dark red — grid lines, faint elements) |
| Font — all | `font-family:'Courier New',Monaco,monospace` (machine readout) |
| Borders | `border:1px solid #660000` |
| Panel background | `rgba(255,0,0,0.05)` |

### Signature element — Red Scan Grid

HUD targeting grid overlay with crosshair:

```html
<div class='absolute inset-0 pointer-events-none'>
  <div style='background:repeating-linear-gradient(0deg,transparent,transparent 38px,rgba(255,0,0,0.06) 38px,rgba(255,0,0,0.06) 40px),repeating-linear-gradient(90deg,transparent,transparent 38px,rgba(255,0,0,0.06) 38px,rgba(255,0,0,0.06) 40px)'></div>
  <div style='position:absolute;top:50%;left:50%;width:80px;height:80px;transform:translate(-50%,-50%);border:2px solid rgba(255,0,0,0.4);border-radius:50%'></div>
  <div style='position:absolute;top:50%;left:0;right:0;height:1px;background:rgba(255,0,0,0.08)'></div>
  <div style='position:absolute;left:50%;top:0;bottom:0;width:1px;background:rgba(255,0,0,0.08)'></div>
</div>
```

### Opening Beat — System Boot / Target Acquired

Red HUD boots up with scan lines, targeting reticle pulses, status text appears.

```json
{
  "duration": 4,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full relative' style='background:#1a0000'>",
      "  <div class='absolute inset-0' style='background:repeating-linear-gradient(0deg,transparent,transparent 38px,rgba(255,0,0,0.06) 38px,rgba(255,0,0,0.06) 40px),repeating-linear-gradient(90deg,transparent,transparent 38px,rgba(255,0,0,0.06) 38px,rgba(255,0,0,0.06) 40px)'></div>",
      "  <div id='reticle' class='absolute' style='top:50%;left:50%;width:0;height:0;transform:translate(-50%,-50%);border:2px solid #ff0000;border-radius:50%;opacity:0'></div>",
      "  <div id='hline' class='absolute' style='top:50%;left:0;right:0;height:1px;background:#ff0000;opacity:0'></div>",
      "  <div id='vline' class='absolute' style='left:50%;top:0;bottom:0;width:1px;background:#ff0000;opacity:0'></div>",
      "  <div class='absolute top-8 left-8'>",
      "    <div id='sys' class='text-xs tracking-[0.3em]' style='font-family:monospace;color:#ff3333;opacity:0'>CYBERDYNE SYSTEMS MODEL 101</div>",
      "    <div id='mode' class='text-xs mt-1' style='font-family:monospace;color:#660000;opacity:0'>SCAN MODE: ACTIVE</div>",
      "  </div>",
      "  <div class='absolute bottom-8 right-8 text-right'>",
      "    <div id='dist' class='text-xs' style='font-family:monospace;color:#ff6666;opacity:0'>DIST: <span id='distVal'></span>m</div>",
      "    <div id='threat' class='text-xs mt-1' style='font-family:monospace;color:#ff0000;opacity:0'>THREAT: <span id='threatVal'></span>%</div>",
      "  </div>",
      "  <div class='h-full flex flex-col items-center justify-center relative'>",
      "    <div id='target' class='text-5xl font-bold tracking-wider' style='font-family:monospace;color:#ff0000;opacity:0'>TARGET ACQUIRED</div>",
      "    <div id='id' class='text-lg mt-4 tracking-[0.5em]' style='font-family:monospace;color:#ff3333;opacity:0'>SUBJECT IDENTIFIED</div>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#reticle', { opacity: [0, 0.6], width: [0, 120, 'px'], height: [0, 120, 'px'] }, { start: 0, end: 1.0, easing: 'easeOut' });",
      "animation.animate('#hline', { opacity: [0, 0.15] }, { start: 0, end: 0.3 });",
      "animation.animate('#vline', { opacity: [0, 0.15] }, { start: 0, end: 0.3 });",
      "animation.animate('#sys', { opacity: [0, 1] }, { start: 0.2, end: 0.4 });",
      "animation.animate('#mode', { opacity: [0, 1] }, { start: 0.5, end: 0.7 });",
      "animation.blink('#mode', { interval: 0.8 });",
      "animation.animate('#dist', { opacity: [0, 1] }, { start: 0.8, end: 1.0 });",
      "animation.counter('#distVal', [250, 12], { start: 0.8, end: 3.0, decimals: 1 });",
      "animation.animate('#threat', { opacity: [0, 1] }, { start: 1.0, end: 1.2 });",
      "animation.counter('#threatVal', [0, 97], { start: 1.0, end: 2.5, decimals: 0 });",
      "animation.animate('#target', { opacity: [0, 1] }, { start: 1.5, end: 1.8 });",
      "animation.animate('#id', { opacity: [0, 1] }, { start: 2.0, end: 2.3 });"
    ],
    "animation": true
  }
}
```

### Feature Beat — Analysis HUD

Multi-zone data display: status bars, counters, blinking alerts.

```json
{
  "duration": 5,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full relative' style='background:#1a0000'>",
      "  <div class='absolute inset-0' style='background:repeating-linear-gradient(0deg,transparent,transparent 38px,rgba(255,0,0,0.06) 38px,rgba(255,0,0,0.06) 40px),repeating-linear-gradient(90deg,transparent,transparent 38px,rgba(255,0,0,0.06) 38px,rgba(255,0,0,0.06) 40px)'></div>",
      "  <div class='h-full flex flex-col justify-center px-16 relative'>",
      "    <div id='header' class='text-xs tracking-[0.5em] mb-8' style='font-family:monospace;color:#ff3333;opacity:0'>TACTICAL ANALYSIS</div>",
      "    <div class='flex gap-8'>",
      "      <div class='flex-1'>",
      "        <div id='r0' class='mb-6' style='opacity:0'>",
      "          <div class='flex justify-between text-xs mb-1' style='font-family:monospace;color:#ff6666'><span>POWER CELL</span><span id='v0'></span></div>",
      "          <div style='background:#330000;height:6px;border-radius:2px'><div id='bar0' style='background:#ff0000;height:100%;border-radius:2px;width:0'></div></div>",
      "        </div>",
      "        <div id='r1' class='mb-6' style='opacity:0'>",
      "          <div class='flex justify-between text-xs mb-1' style='font-family:monospace;color:#ff6666'><span>NEURAL NET</span><span id='v1'></span></div>",
      "          <div style='background:#330000;height:6px;border-radius:2px'><div id='bar1' style='background:#ff3333;height:100%;border-radius:2px;width:0'></div></div>",
      "        </div>",
      "        <div id='r2' class='mb-6' style='opacity:0'>",
      "          <div class='flex justify-between text-xs mb-1' style='font-family:monospace;color:#ff6666'><span>TARGETING</span><span id='v2'></span></div>",
      "          <div style='background:#330000;height:6px;border-radius:2px'><div id='bar2' style='background:#ff0000;height:100%;border-radius:2px;width:0'></div></div>",
      "        </div>",
      "      </div>",
      "      <div class='flex-1'>",
      "        <div id='info0' class='text-sm mb-3' style='font-family:monospace;color:#ff3333;opacity:0'>▸ Primary objective: ACTIVE</div>",
      "        <div id='info1' class='text-sm mb-3' style='font-family:monospace;color:#ff3333;opacity:0'>▸ Weapons system: ONLINE</div>",
      "        <div id='info2' class='text-sm mb-3' style='font-family:monospace;color:#ff3333;opacity:0'>▸ Threat analysis: PROCESSING</div>",
      "        <div id='warn' class='text-sm mt-6 font-bold' style='font-family:monospace;color:#ff0000;opacity:0'>⚠ ELEVATED THREAT LEVEL</div>",
      "      </div>",
      "    </div>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#header', { opacity: [0, 1] }, { start: 0, end: 0.3 });",
      "animation.stagger('#r{i}', 3, { opacity: [0, 1] }, { start: 0.3, stagger: 0.3, duration: 0.2 });",
      "animation.counter('#v0', [0, 87], { start: 0.5, end: 2.5, suffix: '%', decimals: 0 });",
      "animation.animate('#bar0', { width: [0, 87, '%'] }, { start: 0.5, end: 2.5, easing: 'easeOut' });",
      "animation.counter('#v1', [0, 100], { start: 0.8, end: 2.5, suffix: '%', decimals: 0 });",
      "animation.animate('#bar1', { width: [0, 100, '%'] }, { start: 0.8, end: 2.5, easing: 'easeOut' });",
      "animation.counter('#v2', [0, 94], { start: 1.1, end: 2.5, suffix: '%', decimals: 0 });",
      "animation.animate('#bar2', { width: [0, 94, '%'] }, { start: 1.1, end: 2.5, easing: 'easeOut' });",
      "animation.stagger('#info{i}', 3, { opacity: [0, 1], translateX: [-10, 0] }, { start: 1.5, stagger: 0.4, duration: 0.25, easing: 'easeOut' });",
      "animation.animate('#warn', { opacity: [0, 1] }, { start: 3.5, end: 3.8 });",
      "animation.blink('#warn', { interval: 0.4 });"
    ],
    "animation": true
  }
}
```

### Closing Beat — Mission Status

Full-screen mission result with data counters.

```json
{
  "duration": 5,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full relative' style='background:#1a0000'>",
      "  <div class='absolute inset-0' style='background:repeating-linear-gradient(0deg,transparent,transparent 38px,rgba(255,0,0,0.06) 38px,rgba(255,0,0,0.06) 40px),repeating-linear-gradient(90deg,transparent,transparent 38px,rgba(255,0,0,0.06) 38px,rgba(255,0,0,0.06) 40px)'></div>",
      "  <div class='h-full flex flex-col items-center justify-center relative'>",
      "    <div id='status' class='text-6xl font-bold tracking-wider' style='font-family:monospace;color:#ff0000;opacity:0'>MISSION COMPLETE</div>",
      "    <div id='line' class='mt-6 h-px' style='background:#ff0000;opacity:0;width:0'></div>",
      "    <div id='summary' class='text-xl mt-6 tracking-wider' style='font-family:monospace;color:#ff3333;opacity:0'>I'LL BE BACK.</div>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#status', { opacity: [0, 1] }, { start: 0.5, end: 1.0 });",
      "animation.animate('#line', { opacity: [0, 0.6], width: [0, 500, 'px'] }, { start: 1.0, end: 2.0, easing: 'easeOut' });",
      "animation.animate('#summary', { opacity: [0, 1] }, { start: 2.5, end: 3.0 });"
    ],
    "animation": true
  }
}
```

---

## Theme 11: Dragon Ball Scouter

**Mood**: Intense, explosive, power escalation
**Voice**: Energetic, excited (e.g., `nova`, `shimmer`)

### BGM

| Source | Track | URL |
|--------|-------|-----|
| mulmocast-media | olympic001.mp3 (epic fanfare) | `https://github.com/receptron/mulmocast-media/raw/refs/heads/main/bgms/olympic001.mp3` |
| mulmocast-media | theme001.mp3 (epic orchestral) | `https://github.com/receptron/mulmocast-media/raw/refs/heads/main/bgms/theme001.mp3` |
| Mixkit | Epic Games | `https://assets.mixkit.co/music/76/76.mp3` |
| Mixkit | Epical Drums 01 | `https://assets.mixkit.co/music/676/676.mp3` |
| Incompetech | Five Armies | `https://incompetech.com/music/royalty-free/mp3-royaltyfree/Five%20Armies.mp3` |
| Incompetech | Heroic Age | `https://incompetech.com/music/royalty-free/mp3-royaltyfree/Heroic%20Age.mp3` |

### Visual Identity

| Element | Value |
|---------|-------|
| Background | `background:#001a00` (dark green-black, scouter lens tint) |
| Primary color | `color:#00ff66` (scouter green — readouts, borders) |
| Secondary color | `color:#00cc44` (darker green — labels, secondary text) |
| Alert color | `color:#ff3300` (red — danger, power overflow) |
| Muted | `color:#004d1a` (very dark green — grid, faint) |
| Font — readout | `font-family:'Courier New',Monaco,monospace` |
| Font — labels | `font-family:Impact,'Arial Black',sans-serif` (bold power display) |
| Borders | `border:2px solid rgba(0,255,102,0.3)` |

### Signature element — Scouter Frame

Circular lens frame with scan sweep:

```html
<div class='absolute inset-0 pointer-events-none'>
  <div style='position:absolute;top:50%;left:50%;width:500px;height:500px;transform:translate(-50%,-50%);border:3px solid rgba(0,255,102,0.2);border-radius:50%'></div>
  <div style='position:absolute;top:50%;left:50%;width:350px;height:350px;transform:translate(-50%,-50%);border:1px solid rgba(0,255,102,0.1);border-radius:50%'></div>
  <div style='position:absolute;top:50%;left:50%;width:200px;height:200px;transform:translate(-50%,-50%);border:1px solid rgba(0,255,102,0.08);border-radius:50%'></div>
</div>
```

### Opening Beat — Power Level Scan

Scouter activates, scans target, power level counter races upward.

```json
{
  "duration": 5,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full relative' style='background:#001a00'>",
      "  <div class='absolute inset-0 pointer-events-none'>",
      "    <div id='ring1' style='position:absolute;top:50%;left:50%;width:0;height:0;transform:translate(-50%,-50%);border:3px solid rgba(0,255,102,0.3);border-radius:50%;opacity:0'></div>",
      "    <div id='ring2' style='position:absolute;top:50%;left:50%;width:0;height:0;transform:translate(-50%,-50%);border:1px solid rgba(0,255,102,0.15);border-radius:50%;opacity:0'></div>",
      "  </div>",
      "  <div class='absolute top-6 left-8'>",
      "    <div id='scouter' class='text-xs tracking-[0.3em]' style='font-family:monospace;color:#00cc44;opacity:0'>SCOUTER v3.0 — ACTIVE</div>",
      "  </div>",
      "  <div class='absolute top-6 right-8 text-right'>",
      "    <div id='scanLabel' class='text-xs' style='font-family:monospace;color:#004d1a;opacity:0'>SCANNING...</div>",
      "  </div>",
      "  <div class='h-full flex flex-col items-center justify-center relative'>",
      "    <div id='label' class='text-sm tracking-[0.5em] mb-4' style='font-family:monospace;color:#00cc44;opacity:0'>戦 闘 力</div>",
      "    <div id='power' class='font-bold' style='font-family:Impact,\"Arial Black\",sans-serif;color:#00ff66;font-size:120px'></div>",
      "    <div id='alert' class='text-xl mt-6 font-bold tracking-wider' style='font-family:monospace;color:#ff3300;opacity:0'>!!! OVER 9000 !!!</div>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#ring1', { opacity: [0, 0.5], width: [0, 500, 'px'], height: [0, 500, 'px'] }, { start: 0, end: 1.5, easing: 'easeOut' });",
      "animation.animate('#ring2', { opacity: [0, 0.3], width: [0, 350, 'px'], height: [0, 350, 'px'] }, { start: 0.3, end: 1.5, easing: 'easeOut' });",
      "animation.animate('#scouter', { opacity: [0, 1] }, { start: 0.2, end: 0.4 });",
      "animation.animate('#scanLabel', { opacity: [0, 1] }, { start: 0.3, end: 0.5 });",
      "animation.blink('#scanLabel', { interval: 0.3 });",
      "animation.animate('#label', { opacity: [0, 1] }, { start: 0.5, end: 0.8 });",
      "animation.counter('#power', [0, 9001], { start: 0.8, end: 3.5, decimals: 0 });",
      "animation.animate('#alert', { opacity: [0, 1] }, { start: 3.5, end: 3.8 });",
      "animation.blink('#alert', { interval: 0.25 });"
    ],
    "animation": true
  }
}
```

### Feature Beat — Multi-Target Analysis

Grid of targets with individual power levels and status indicators.

```json
{
  "duration": 5,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full relative' style='background:#001a00'>",
      "  <div class='absolute inset-0' style='background:repeating-linear-gradient(0deg,transparent,transparent 58px,rgba(0,255,102,0.04) 58px,rgba(0,255,102,0.04) 60px),repeating-linear-gradient(90deg,transparent,transparent 58px,rgba(0,255,102,0.04) 58px,rgba(0,255,102,0.04) 60px)'></div>",
      "  <div class='h-full flex flex-col justify-center px-16 relative'>",
      "    <div id='header' class='text-xs tracking-[0.5em] mb-8' style='font-family:monospace;color:#00cc44;opacity:0'>TARGET ANALYSIS</div>",
      "    <div class='grid grid-cols-3 gap-6'>",
      "      <div id='t0' class='p-5 text-center' style='border:2px solid rgba(0,255,102,0.3);background:rgba(0,255,102,0.03);opacity:0'>",
      "        <div class='text-xs tracking-widest mb-2' style='font-family:monospace;color:#00cc44'>TARGET A</div>",
      "        <div id='p0' class='text-4xl font-bold' style='font-family:Impact,sans-serif;color:#00ff66'></div>",
      "        <div class='text-xs mt-2' style='font-family:monospace;color:#004d1a'>STATUS: NORMAL</div>",
      "      </div>",
      "      <div id='t1' class='p-5 text-center' style='border:2px solid rgba(0,255,102,0.3);background:rgba(0,255,102,0.03);opacity:0'>",
      "        <div class='text-xs tracking-widest mb-2' style='font-family:monospace;color:#00cc44'>TARGET B</div>",
      "        <div id='p1' class='text-4xl font-bold' style='font-family:Impact,sans-serif;color:#00ff66'></div>",
      "        <div class='text-xs mt-2' style='font-family:monospace;color:#004d1a'>STATUS: ELEVATED</div>",
      "      </div>",
      "      <div id='t2' class='p-5 text-center' style='border:2px solid rgba(255,51,0,0.4);background:rgba(255,51,0,0.05);opacity:0'>",
      "        <div class='text-xs tracking-widest mb-2' style='font-family:monospace;color:#ff3300'>TARGET C</div>",
      "        <div id='p2' class='text-4xl font-bold' style='font-family:Impact,sans-serif;color:#ff3300'></div>",
      "        <div id='danger' class='text-xs mt-2 font-bold' style='font-family:monospace;color:#ff3300'>⚠ DANGER</div>",
      "      </div>",
      "    </div>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#header', { opacity: [0, 1] }, { start: 0, end: 0.3 });",
      "animation.stagger('#t{i}', 3, { opacity: [0, 1], translateY: [15, 0] }, { start: 0.3, stagger: 0.4, duration: 0.3, easing: 'easeOut' });",
      "animation.counter('#p0', [0, 1200], { start: 0.5, end: 2.5, decimals: 0 });",
      "animation.counter('#p1', [0, 4500], { start: 0.9, end: 2.5, decimals: 0 });",
      "animation.counter('#p2', [0, 53000], { start: 1.3, end: 3.0, decimals: 0 });",
      "animation.blink('#danger', { interval: 0.3 });"
    ],
    "animation": true
  }
}
```

### Closing Beat — Scouter Explosion

Power level overloads — screen cracks/flashes. The counter runs to overflow, then red flash.

```json
{
  "duration": 4,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full relative' style='background:#001a00'>",
      "  <div id='flash' class='absolute inset-0' style='background:#ff3300;opacity:0'></div>",
      "  <div class='h-full flex flex-col items-center justify-center relative'>",
      "    <div id='label' class='text-sm tracking-[0.5em] mb-4' style='font-family:monospace;color:#00cc44;opacity:0'>戦 闘 力</div>",
      "    <div id='power' class='font-bold' style='font-family:Impact,\"Arial Black\",sans-serif;color:#00ff66;font-size:100px'></div>",
      "    <div id='error' class='text-3xl mt-8 font-bold tracking-wider' style='font-family:monospace;color:#ff3300;opacity:0'>ERROR — CANNOT COMPUTE</div>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#label', { opacity: [0, 1] }, { start: 0, end: 0.3 });",
      "animation.counter('#power', [0, 999999], { start: 0.3, end: 2.5, decimals: 0 });",
      "animation.animate('#flash', { opacity: [0, 0.6] }, { start: 2.5, end: 2.7 });",
      "animation.animate('#flash', { opacity: [0.6, 0] }, { start: 2.7, end: 3.0 });",
      "animation.animate('#error', { opacity: [0, 1] }, { start: 2.8, end: 3.1 });",
      "animation.blink('#error', { interval: 0.2 });"
    ],
    "animation": true
  }
}
```

---

## Theme 12: Blade Runner

**Mood**: Melancholy, rain-soaked neon, existential, retro-futuristic
**Voice**: Low, contemplative (e.g., `echo`, `onyx`)

### BGM

| Source | Track | URL |
|--------|-------|-----|
| mulmocast-media | story001.mp3 (smooth, piano) | `https://github.com/receptron/mulmocast-media/raw/refs/heads/main/bgms/story001.mp3` |
| mulmocast-media | story004.mp3 (classical, ambient) | `https://github.com/receptron/mulmocast-media/raw/refs/heads/main/bgms/story004.mp3` |
| Mixkit | Echoes | `https://assets.mixkit.co/music/188/188.mp3` |
| Mixkit | Vertigo | `https://assets.mixkit.co/music/597/597.mp3` |
| Incompetech | Neon Laser Horizon | `https://incompetech.com/music/royalty-free/mp3-royaltyfree/Neon%20Laser%20Horizon.mp3` |
| Incompetech | Luminous Rain | `https://incompetech.com/music/royalty-free/mp3-royaltyfree/Luminous%20Rain.mp3` |

### Visual Identity

| Element | Value |
|---------|-------|
| Background | `background:#0a0a14` (deep blue-black) |
| Primary color | `color:#ff6a00` (neon orange — accents, highlights) |
| Secondary color | `color:#00b4d8` (teal/cyan — UI elements, text) |
| Warm accent | `color:#e76f51` (warm orange-red — emphasis) |
| Muted | `color:#555570` (blue-gray — body text) |
| Font — headings | `font-family:Georgia,"Times New Roman",serif` |
| Font — UI/labels | `font-family:'Courier New',Monaco,monospace` |
| Borders | `border:1px solid #1a1a2e` |

### Signature element — Neon Rain

Vertical rain streaks with neon glow:

```javascript
"var rain = document.getElementById('rain');",
"for (var i = 0; i < 60; i++) {",
"  var d = document.createElement('div');",
"  var x = (Math.sin(i*311.7)*0.5+0.5)*100;",
"  var h = (Math.sin(i*127.1)*0.5+0.5)*30+10;",
"  var op = (Math.sin(i*43.1)*0.5+0.5)*0.3+0.05;",
"  var colors = ['#00b4d8','#ff6a00','#e76f51'];",
"  var c = colors[Math.floor(Math.abs(Math.sin(i*73.3))*3)];",
"  d.style.cssText='position:absolute;top:-'+h+'px;left:'+x+'%;width:1px;height:'+h+'px;background:linear-gradient(180deg,transparent,'+c+');opacity:'+op;",
"  d.id='drop'+i; rain.appendChild(d);",
"}"
```

### Opening Beat — Rain City Title

Title fades in over falling rain. Slow, melancholic.

```json
{
  "duration": 6,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full relative overflow-hidden' style='background:#0a0a14'>",
      "  <div id='rain' class='absolute inset-0'></div>",
      "  <div class='absolute bottom-0 left-0 right-0 h-16' style='background:linear-gradient(0deg,rgba(255,106,0,0.08),transparent)'></div>",
      "  <div class='h-full flex flex-col items-center justify-center relative'>",
      "    <div id='title' class='text-7xl font-bold tracking-wider text-center' style='font-family:Georgia,serif;color:#ff6a00;opacity:0;text-shadow:0 0 30px rgba(255,106,0,0.3)'>TITLE</div>",
      "    <div id='subtitle' class='text-xl mt-6 tracking-[0.3em]' style='font-family:\"Courier New\",monospace;color:#00b4d8;opacity:0'>Like tears in rain</div>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "var rain = document.getElementById('rain');",
      "for (var i = 0; i < 60; i++) { var d = document.createElement('div'); var x = (Math.sin(i*311.7)*0.5+0.5)*100; var h = (Math.sin(i*127.1)*0.5+0.5)*30+10; var op = (Math.sin(i*43.1)*0.5+0.5)*0.3+0.05; var colors = ['#00b4d8','#ff6a00','#e76f51']; var c = colors[Math.floor(Math.abs(Math.sin(i*73.3))*3)]; d.style.cssText='position:absolute;top:-'+h+'px;left:'+x+'%;width:1px;height:'+h+'px;background:linear-gradient(180deg,transparent,'+c+');opacity:'+op; d.id='drop'+i; rain.appendChild(d); }",
      "const animation = new MulmoAnimation();",
      "for (var k = 0; k < 60; k++) { var spd = (Math.sin(k*43.7)*0.5+0.5)*1.5+0.5; animation.animate('#drop'+k, { translateY: [0, 800] }, { start: spd*0.3, end: 'auto' }); }",
      "animation.animate('#title', { opacity: [0, 1] }, { start: 1.0, end: 2.5 });",
      "animation.animate('#subtitle', { opacity: [0, 0.7] }, { start: 3.0, end: 4.5 });"
    ],
    "animation": true
  }
}
```

### Feature Beat — Voight-Kampff Terminal

Retro analysis terminal with blinking cursor, result data.

```json
{
  "duration": 5,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full relative' style='background:#0a0a14'>",
      "  <div class='absolute inset-0 pointer-events-none' style='background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,180,216,0.02) 3px,rgba(0,180,216,0.02) 4px)'></div>",
      "  <div class='h-full flex flex-col justify-center px-20 relative'>",
      "    <div id='label' class='text-xs tracking-[0.5em] mb-6' style='font-family:monospace;color:#ff6a00;opacity:0'>VOIGHT-KAMPFF ANALYSIS v6.2</div>",
      "    <div class='p-6 rounded' style='border:1px solid #1a1a2e;background:rgba(10,10,20,0.8)'>",
      "      <div id='q' class='text-lg mb-4' style='font-family:Georgia,serif;color:#00b4d8'></div>",
      "      <div id='cur' style='font-family:monospace;color:#00b4d8'>&#9608;</div>",
      "      <div class='mt-6 pt-4' style='border-top:1px solid #1a1a2e'>",
      "        <div id='r0' class='flex justify-between text-sm mb-2' style='font-family:monospace;opacity:0'><span style='color:#555570'>EMPATHY RESPONSE</span><span id='e0' style='color:#ff6a00'></span></div>",
      "        <div id='r1' class='flex justify-between text-sm mb-2' style='font-family:monospace;opacity:0'><span style='color:#555570'>PUPIL DILATION</span><span id='e1' style='color:#ff6a00'></span></div>",
      "        <div id='r2' class='flex justify-between text-sm' style='font-family:monospace;opacity:0'><span style='color:#555570'>BLUSH RESPONSE</span><span id='e2' style='color:#ff6a00'></span></div>",
      "      </div>",
      "      <div id='result' class='mt-6 text-lg font-bold tracking-wider text-center' style='font-family:monospace;color:#e76f51;opacity:0'>RESULT: INCONCLUSIVE</div>",
      "    </div>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#label', { opacity: [0, 1] }, { start: 0, end: 0.3 });",
      "animation.typewriter('#q', 'Describe in single words only the good things that come into your mind about your mother.', { start: 0.3, end: 2.5 });",
      "animation.blink('#cur', { interval: 0.35 });",
      "animation.stagger('#r{i}', 3, { opacity: [0, 1] }, { start: 2.8, stagger: 0.3, duration: 0.2 });",
      "animation.counter('#e0', [0, 0.73], { start: 3.0, end: 3.8, decimals: 2 });",
      "animation.counter('#e1', [0, 2.4], { start: 3.3, end: 4.0, decimals: 1, suffix: 'mm' });",
      "animation.counter('#e2', [0, 0.12], { start: 3.6, end: 4.2, decimals: 2 });",
      "animation.animate('#result', { opacity: [0, 1] }, { start: 4.3, end: 4.6 });"
    ],
    "animation": true
  }
}
```

### Closing Beat — Tears in Rain

Iconic monologue quote fading slowly on rain backdrop.

```json
{
  "duration": 6,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full relative overflow-hidden' style='background:#0a0a14'>",
      "  <div id='rain' class='absolute inset-0'></div>",
      "  <div class='h-full flex flex-col items-center justify-center relative px-24'>",
      "    <div id='quote' class='text-3xl italic leading-relaxed text-center' style='font-family:Georgia,serif;color:#00b4d8;opacity:0'>\"All those moments will be lost in time, like tears in rain.\"</div>",
      "    <div id='line' class='mt-8 h-px' style='background:linear-gradient(90deg,transparent,#ff6a00,transparent);opacity:0;width:0'></div>",
      "    <div id='label' class='text-sm mt-6 tracking-[0.3em]' style='font-family:monospace;color:#555570;opacity:0'>TIME TO DIE</div>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "var rain = document.getElementById('rain');",
      "for (var i = 0; i < 40; i++) { var d = document.createElement('div'); var x = (Math.sin(i*311.7)*0.5+0.5)*100; var h = (Math.sin(i*127.1)*0.5+0.5)*20+8; d.style.cssText='position:absolute;top:-'+h+'px;left:'+x+'%;width:1px;height:'+h+'px;background:linear-gradient(180deg,transparent,#00b4d8);opacity:'+(Math.sin(i*43.1)*0.1+0.1); d.id='drop'+i; rain.appendChild(d); }",
      "const animation = new MulmoAnimation();",
      "for (var k = 0; k < 40; k++) { animation.animate('#drop'+k, { translateY: [0, 800] }, { start: (Math.sin(k*43.7)*0.5+0.5)*1.0, end: 'auto' }); }",
      "animation.animate('#quote', { opacity: [0, 1] }, { start: 0.5, end: 2.5 });",
      "animation.animate('#line', { opacity: [0, 0.5], width: [0, 400, 'px'] }, { start: 2.5, end: 3.5, easing: 'easeOut' });",
      "animation.animate('#label', { opacity: [0, 0.5] }, { start: 3.5, end: 4.5 });"
    ],
    "animation": true
  }
}
```

---

## Theme 13: Total Recall (Rekall Memory Implant)

**Mood**: Disorienting, surreal, reality-bending, retro sci-fi
**Voice**: Smooth, slightly unsettling (e.g., `echo`, `shimmer`)

### BGM

| Source | Track | URL |
|--------|-------|-----|
| mulmocast-media | story002.mp3 (techno, inspiring) | `https://github.com/receptron/mulmocast-media/raw/refs/heads/main/bgms/story002.mp3` |
| Mixkit | Brainiac | `https://assets.mixkit.co/music/167/167.mp3` |
| Mixkit | Delirium | `https://assets.mixkit.co/music/605/605.mp3` |
| Incompetech | Crypto | `https://incompetech.com/music/royalty-free/mp3-royaltyfree/Crypto.mp3` |
| Incompetech | Mystery Bazaar | `https://incompetech.com/music/royalty-free/mp3-royaltyfree/Mystery%20Bazaar.mp3` |

### Visual Identity

| Element | Value |
|---------|-------|
| Background | `background:#0d0000` (dark with red-mars tint) |
| Primary color | `color:#ff4444` (Rekall red — UI, borders, headings) |
| Secondary color | `color:#00ccaa` (teal/green — memory data, holographic) |
| Glitch | `color:#ffffff` (white — flashes, reality breaks) |
| Muted | `color:#553333` (dim red-brown) |
| Font — headings | `font-family:'Arial Black',Impact,sans-serif` |
| Font — data/UI | `font-family:'Courier New',Monaco,monospace` |

### Signature element — Glitch / Memory Distortion

Horizontal offset bands that simulate a glitched signal:

```html
<div class='absolute inset-0 pointer-events-none overflow-hidden'>
  <div id='glitch1' style='position:absolute;top:30%;left:-5px;right:0;height:3px;background:#ff4444;opacity:0'></div>
  <div id='glitch2' style='position:absolute;top:60%;left:0;right:-5px;height:2px;background:#00ccaa;opacity:0'></div>
  <div id='glitch3' style='position:absolute;top:75%;left:-3px;right:0;height:4px;background:#ffffff;opacity:0'></div>
</div>
```

### Opening Beat — Rekall Memory Implant Start

Memory implant UI boots up with progress counter and reality glitch.

```json
{
  "duration": 5,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full relative' style='background:#0d0000'>",
      "  <div id='g1' class='absolute' style='top:25%;left:-5px;right:0;height:3px;background:#ff4444;opacity:0'></div>",
      "  <div id='g2' class='absolute' style='top:65%;left:0;right:-3px;height:2px;background:#00ccaa;opacity:0'></div>",
      "  <div class='h-full flex flex-col items-center justify-center relative'>",
      "    <div id='logo' class='text-sm tracking-[0.5em] mb-8' style='font-family:monospace;color:#ff4444;opacity:0'>R E K A L L   I N C.</div>",
      "    <div id='title' class='text-6xl font-bold tracking-wider' style='font-family:\"Arial Black\",Impact,sans-serif;color:#ff4444;opacity:0'>MEMORY IMPLANT</div>",
      "    <div class='mt-10 w-96'>",
      "      <div class='flex justify-between text-xs mb-2' style='font-family:monospace'><span id='status' style='color:#553333;opacity:0'>INITIALIZING...</span><span id='pct' style='color:#ff4444'></span></div>",
      "      <div style='background:#330000;height:8px;border-radius:4px'><div id='bar' style='background:linear-gradient(90deg,#ff4444,#00ccaa);height:100%;border-radius:4px;width:0'></div></div>",
      "    </div>",
      "    <div id='warn' class='text-sm mt-8 tracking-wider' style='font-family:monospace;color:#00ccaa;opacity:0'>DO NOT ATTEMPT TO RESIST</div>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#logo', { opacity: [0, 1] }, { start: 0.2, end: 0.5 });",
      "animation.animate('#title', { opacity: [0, 1], scale: [1.05, 1] }, { start: 0.5, end: 1.0, easing: 'easeOut' });",
      "animation.animate('#status', { opacity: [0, 1] }, { start: 1.2, end: 1.4 });",
      "animation.counter('#pct', [0, 100], { start: 1.2, end: 3.8, suffix: '%', decimals: 0 });",
      "animation.animate('#bar', { width: [0, 100, '%'] }, { start: 1.2, end: 3.8, easing: 'easeInOut' });",
      "animation.animate('#g1', { opacity: [0, 0.6] }, { start: 2.0, end: 2.1 });",
      "animation.animate('#g1', { opacity: [0.6, 0] }, { start: 2.1, end: 2.3 });",
      "animation.animate('#g2', { opacity: [0, 0.4] }, { start: 3.0, end: 3.1 });",
      "animation.animate('#g2', { opacity: [0.4, 0] }, { start: 3.1, end: 3.3 });",
      "animation.animate('#warn', { opacity: [0, 1] }, { start: 3.5, end: 4.0 });"
    ],
    "animation": true
  }
}
```

### Feature Beat — Memory Fragment / Split Reality

Left: "Real" memory (teal). Right: "Implanted" memory (red). Dual panels.

```json
{
  "duration": 5,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full relative' style='background:#0d0000'>",
      "  <div class='h-full flex'>",
      "    <div id='left' class='flex-1 flex flex-col justify-center px-12' style='border-right:2px solid #553333;opacity:0'>",
      "      <div class='text-xs tracking-[0.3em] mb-4' style='font-family:monospace;color:#00ccaa'>MEMORY — REAL</div>",
      "      <div class='text-3xl font-bold mb-4' style='font-family:\"Arial Black\",sans-serif;color:#00ccaa'>Earth</div>",
      "      <div class='text-sm leading-relaxed' style='font-family:monospace;color:#558888'>Original memories verified. Neural patterns consistent with baseline profile.</div>",
      "    </div>",
      "    <div id='right' class='flex-1 flex flex-col justify-center px-12' style='opacity:0'>",
      "      <div class='text-xs tracking-[0.3em] mb-4' style='font-family:monospace;color:#ff4444'>MEMORY — IMPLANTED</div>",
      "      <div class='text-3xl font-bold mb-4' style='font-family:\"Arial Black\",sans-serif;color:#ff4444'>Mars</div>",
      "      <div class='text-sm leading-relaxed' style='font-family:monospace;color:#885555'>Synthetic memory detected. Origin: Rekall Inc. Classification: SECRET AGENT PACKAGE.</div>",
      "    </div>",
      "  </div>",
      "  <div id='divider' class='absolute' style='top:50%;left:50%;transform:translate(-50%,-50%);font-family:monospace;color:white;font-size:24px;opacity:0'>?</div>",
      "  <div id='g1' class='absolute' style='top:40%;left:0;right:0;height:3px;background:#ffffff;opacity:0'></div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#left', { opacity: [0, 1], translateX: [-20, 0] }, { start: 0.3, end: 1.0, easing: 'easeOut' });",
      "animation.animate('#right', { opacity: [0, 1], translateX: [20, 0] }, { start: 0.8, end: 1.5, easing: 'easeOut' });",
      "animation.animate('#divider', { opacity: [0, 1], scale: [2, 1] }, { start: 1.5, end: 2.0, easing: 'easeOut' });",
      "animation.animate('#g1', { opacity: [0, 0.5] }, { start: 2.5, end: 2.6 });",
      "animation.animate('#g1', { opacity: [0.5, 0] }, { start: 2.6, end: 2.8 });"
    ],
    "animation": true
  }
}
```

### Closing Beat — "What is Real?"

Fragmented text with multiple glitch pulses.

```json
{
  "duration": 5,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full relative' style='background:#0d0000'>",
      "  <div id='g1' class='absolute' style='top:30%;left:-5px;right:0;height:3px;background:#ff4444;opacity:0'></div>",
      "  <div id='g2' class='absolute' style='top:55%;left:0;right:-3px;height:2px;background:#00ccaa;opacity:0'></div>",
      "  <div id='g3' class='absolute' style='top:80%;left:-3px;right:0;height:4px;background:#ffffff;opacity:0'></div>",
      "  <div class='h-full flex flex-col items-center justify-center relative'>",
      "    <div id='q' class='text-6xl font-bold tracking-wider text-center' style='font-family:\"Arial Black\",sans-serif;color:#ff4444;opacity:0'>WHAT IS REAL?</div>",
      "    <div id='sub' class='text-xl mt-6' style='font-family:monospace;color:#00ccaa;opacity:0'>If you can't tell the difference, does it matter?</div>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#q', { opacity: [0, 1] }, { start: 0.5, end: 1.5 });",
      "animation.animate('#g1', { opacity: [0, 0.7] }, { start: 1.5, end: 1.6 });",
      "animation.animate('#g1', { opacity: [0.7, 0] }, { start: 1.6, end: 1.8 });",
      "animation.animate('#g2', { opacity: [0, 0.5] }, { start: 2.0, end: 2.1 });",
      "animation.animate('#g2', { opacity: [0.5, 0] }, { start: 2.1, end: 2.3 });",
      "animation.animate('#g3', { opacity: [0, 0.8] }, { start: 2.5, end: 2.6 });",
      "animation.animate('#g3', { opacity: [0.8, 0] }, { start: 2.6, end: 2.8 });",
      "animation.animate('#sub', { opacity: [0, 0.7] }, { start: 3.0, end: 4.0 });"
    ],
    "animation": true
  }
}
```

---

## Theme 14: Iron Man JARVIS HUD

**Mood**: Sleek, futuristic, heroic tech, holographic
**Voice**: Smooth, precise (e.g., `shimmer`, `nova`)

### BGM

| Source | Track | URL |
|--------|-------|-----|
| mulmocast-media | story002.mp3 (techno, inspiring) | `https://github.com/receptron/mulmocast-media/raw/refs/heads/main/bgms/story002.mp3` |
| mulmocast-media | story003.mp3 (piano, inspiring) | `https://github.com/receptron/mulmocast-media/raw/refs/heads/main/bgms/story003.mp3` |
| Mixkit | Life's a Movie | `https://assets.mixkit.co/music/322/322.mp3` |
| Incompetech | Hero Theme | `https://incompetech.com/music/royalty-free/mp3-royaltyfree/Hero%20Theme.mp3` |
| Incompetech | Heroic Age | `https://incompetech.com/music/royalty-free/mp3-royaltyfree/Heroic%20Age.mp3` |

### Visual Identity

| Element | Value |
|---------|-------|
| Background | `background:#0a0e1a` (deep navy) |
| Primary color | `color:#4fc3f7` (JARVIS blue — UI, borders, text) |
| Secondary color | `color:#81d4fa` (light blue — labels, secondary) |
| Accent | `color:#ffffff` (white — highlights, key data) |
| Warm accent | `color:#ff9800` (amber — warnings, power indicators) |
| Muted | `color:#1a3a5c` (dark blue — grid, subtle elements) |
| Font — headings | `font-family:'Helvetica Neue',Arial,sans-serif` (clean, modern) |
| Font — data | `font-family:'Courier New',Monaco,monospace` |
| Panel background | `rgba(79,195,247,0.05)` |
| Borders | `border:1px solid rgba(79,195,247,0.2)` |

### Signature element — Arc Reactor Rings

Concentric rotating rings simulating the arc reactor:

```html
<div class='absolute inset-0 pointer-events-none flex items-center justify-center'>
  <div style='position:absolute;width:400px;height:400px;border:1px solid rgba(79,195,247,0.1);border-radius:50%'></div>
  <div style='position:absolute;width:280px;height:280px;border:1px solid rgba(79,195,247,0.15);border-radius:50%'></div>
  <div style='position:absolute;width:160px;height:160px;border:1px solid rgba(79,195,247,0.08);border-radius:50%'></div>
  <div style='position:absolute;width:8px;height:8px;background:#4fc3f7;border-radius:50%;box-shadow:0 0 20px #4fc3f7,0 0 40px rgba(79,195,247,0.3)'></div>
</div>
```

### Opening Beat — JARVIS System Activation

Arc reactor rings expand outward, system status lines cascade in.

```json
{
  "duration": 4,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full relative' style='background:#0a0e1a'>",
      "  <div class='absolute inset-0 flex items-center justify-center'>",
      "    <div id='ring1' style='position:absolute;width:0;height:0;border:1px solid rgba(79,195,247,0.2);border-radius:50%;opacity:0'></div>",
      "    <div id='ring2' style='position:absolute;width:0;height:0;border:1px solid rgba(79,195,247,0.15);border-radius:50%;opacity:0'></div>",
      "    <div id='core' style='position:absolute;width:0;height:0;background:#4fc3f7;border-radius:50%;box-shadow:0 0 20px #4fc3f7;opacity:0'></div>",
      "  </div>",
      "  <div class='absolute top-8 left-10'>",
      "    <div id='s0' class='text-xs mb-1' style='font-family:monospace;color:#4fc3f7;opacity:0'>JARVIS v7.2 — Online</div>",
      "    <div id='s1' class='text-xs mb-1' style='font-family:monospace;color:#1a3a5c;opacity:0'>Arc Reactor: 100%</div>",
      "    <div id='s2' class='text-xs' style='font-family:monospace;color:#1a3a5c;opacity:0'>All systems nominal</div>",
      "  </div>",
      "  <div class='h-full flex flex-col items-center justify-center relative'>",
      "    <div id='greeting' class='text-3xl tracking-wider' style='font-family:\"Helvetica Neue\",Arial,sans-serif;color:#81d4fa;opacity:0'>Good evening, sir.</div>",
      "    <div id='title' class='text-6xl font-bold mt-4 tracking-wider' style='font-family:\"Helvetica Neue\",Arial,sans-serif;color:#4fc3f7;opacity:0;text-shadow:0 0 30px rgba(79,195,247,0.3)'>TITLE</div>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#core', { opacity: [0, 1], width: [0, 12, 'px'], height: [0, 12, 'px'] }, { start: 0, end: 0.5, easing: 'easeOut' });",
      "animation.animate('#ring2', { opacity: [0, 0.5], width: [0, 280, 'px'], height: [0, 280, 'px'] }, { start: 0.2, end: 1.2, easing: 'easeOut' });",
      "animation.animate('#ring1', { opacity: [0, 0.3], width: [0, 400, 'px'], height: [0, 400, 'px'] }, { start: 0.4, end: 1.5, easing: 'easeOut' });",
      "animation.stagger('#s{i}', 3, { opacity: [0, 1] }, { start: 0.5, stagger: 0.25, duration: 0.15 });",
      "animation.animate('#greeting', { opacity: [0, 1] }, { start: 1.0, end: 1.5 });",
      "animation.animate('#title', { opacity: [0, 1], scale: [1.1, 1] }, { start: 1.5, end: 2.2, easing: 'easeOut' });"
    ],
    "animation": true
  }
}
```

### Feature Beat — Holographic Dashboard

Floating data panels with counters and progress indicators, JARVIS blue glow.

```json
{
  "duration": 5,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full relative' style='background:#0a0e1a'>",
      "  <div class='absolute inset-0 flex items-center justify-center'>",
      "    <div style='width:500px;height:500px;border:1px solid rgba(79,195,247,0.06);border-radius:50%'></div>",
      "  </div>",
      "  <div class='h-full flex flex-col justify-center px-16 relative'>",
      "    <div id='header' class='text-xs tracking-[0.5em] mb-8' style='font-family:monospace;color:#4fc3f7;opacity:0'>SYSTEM DIAGNOSTICS</div>",
      "    <div class='grid grid-cols-3 gap-5'>",
      "      <div id='p0' class='p-5' style='border:1px solid rgba(79,195,247,0.2);background:rgba(79,195,247,0.03);opacity:0'>",
      "        <div class='text-xs tracking-widest mb-3' style='font-family:monospace;color:#81d4fa'>ARC REACTOR</div>",
      "        <div id='n0' class='text-4xl font-bold' style='font-family:\"Helvetica Neue\",sans-serif;color:white'></div>",
      "        <div style='background:rgba(79,195,247,0.1);height:4px;border-radius:2px;margin-top:8px'><div id='b0' style='background:#4fc3f7;height:100%;border-radius:2px;width:0'></div></div>",
      "      </div>",
      "      <div id='p1' class='p-5' style='border:1px solid rgba(79,195,247,0.2);background:rgba(79,195,247,0.03);opacity:0'>",
      "        <div class='text-xs tracking-widest mb-3' style='font-family:monospace;color:#81d4fa'>THRUSTERS</div>",
      "        <div id='n1' class='text-4xl font-bold' style='font-family:\"Helvetica Neue\",sans-serif;color:white'></div>",
      "        <div style='background:rgba(79,195,247,0.1);height:4px;border-radius:2px;margin-top:8px'><div id='b1' style='background:#4fc3f7;height:100%;border-radius:2px;width:0'></div></div>",
      "      </div>",
      "      <div id='p2' class='p-5' style='border:1px solid rgba(255,152,0,0.3);background:rgba(255,152,0,0.03);opacity:0'>",
      "        <div class='text-xs tracking-widest mb-3' style='font-family:monospace;color:#ff9800'>WEAPONS</div>",
      "        <div id='n2' class='text-4xl font-bold' style='font-family:\"Helvetica Neue\",sans-serif;color:#ff9800'></div>",
      "        <div style='background:rgba(255,152,0,0.1);height:4px;border-radius:2px;margin-top:8px'><div id='b2' style='background:#ff9800;height:100%;border-radius:2px;width:0'></div></div>",
      "      </div>",
      "    </div>",
      "    <div id='ai' class='mt-8 text-sm text-center' style='font-family:monospace;color:#81d4fa;opacity:0'>\"All systems are functioning within normal parameters, sir.\"</div>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#header', { opacity: [0, 1] }, { start: 0, end: 0.3 });",
      "animation.stagger('#p{i}', 3, { opacity: [0, 1], translateY: [15, 0] }, { start: 0.3, stagger: 0.3, duration: 0.3, easing: 'easeOut' });",
      "animation.counter('#n0', [0, 100], { start: 0.5, end: 2.5, suffix: '%', decimals: 0 });",
      "animation.animate('#b0', { width: [0, 100, '%'] }, { start: 0.5, end: 2.5, easing: 'easeOut' });",
      "animation.counter('#n1', [0, 98], { start: 0.8, end: 2.5, suffix: '%', decimals: 0 });",
      "animation.animate('#b1', { width: [0, 98, '%'] }, { start: 0.8, end: 2.5, easing: 'easeOut' });",
      "animation.counter('#n2', [0, 85], { start: 1.1, end: 2.5, suffix: '%', decimals: 0 });",
      "animation.animate('#b2', { width: [0, 85, '%'] }, { start: 1.1, end: 2.5, easing: 'easeOut' });",
      "animation.animate('#ai', { opacity: [0, 1] }, { start: 3.5, end: 4.0 });"
    ],
    "animation": true
  }
}
```

### Closing Beat — Suit Up / Hero Reveal

Arc reactor flares, title scales in with glow.

```json
{
  "duration": 5,
  "image": {
    "type": "html_tailwind",
    "html": [
      "<div class='h-full w-full relative' style='background:#0a0e1a'>",
      "  <div class='absolute inset-0 flex items-center justify-center'>",
      "    <div id='glow' style='width:0;height:0;border-radius:50%;background:radial-gradient(circle,rgba(79,195,247,0.3),transparent);opacity:0'></div>",
      "  </div>",
      "  <div class='h-full flex flex-col items-center justify-center relative'>",
      "    <div id='core' class='mb-8' style='width:0;height:0;background:#4fc3f7;border-radius:50%;box-shadow:0 0 30px #4fc3f7,0 0 60px rgba(79,195,247,0.4);opacity:0'></div>",
      "    <div id='title' class='text-7xl font-bold tracking-wider' style='font-family:\"Helvetica Neue\",Arial,sans-serif;color:#4fc3f7;opacity:0;text-shadow:0 0 40px rgba(79,195,247,0.4)'>TITLE</div>",
      "    <div id='tagline' class='text-xl mt-6 tracking-[0.3em]' style='font-family:monospace;color:#81d4fa;opacity:0'>SUIT UP</div>",
      "  </div>",
      "</div>"
    ],
    "script": [
      "const animation = new MulmoAnimation();",
      "animation.animate('#glow', { opacity: [0, 0.5], width: [0, 600, 'px'], height: [0, 600, 'px'] }, { start: 0, end: 2.0, easing: 'easeOut' });",
      "animation.animate('#core', { opacity: [0, 1], width: [0, 20, 'px'], height: [0, 20, 'px'] }, { start: 0.3, end: 1.0, easing: 'easeOut' });",
      "animation.animate('#title', { opacity: [0, 1], scale: [1.2, 1] }, { start: 1.0, end: 2.0, easing: 'easeOut' });",
      "animation.animate('#tagline', { opacity: [0, 1] }, { start: 2.5, end: 3.0 });"
    ],
    "animation": true
  }
}
```

---

## Custom Theme Guidelines

### 1. Define visual identity

Pick a **restrained** palette:
- 1 background color (dark for dramatic, light for documentary/educational)
- 1 primary accent color (headings, key UI elements)
- 1 secondary color (body text, labels)
- 1 muted color (supporting info)
- 1-2 font families that define the mood

### 2. Design the signature overlay/texture

Each theme needs ONE distinctive visual element present in most beats:

| Theme | Signature Element |
|-------|------------------|
| Star Wars | Procedural starfield (white dots on black) |
| Cyberpunk | CRT scanlines (`repeating-linear-gradient`) |
| Evangelion | Top/bottom red bars |
| Film Noir | Venetian blind shadows (angled stripes) |
| Synthwave | Neon grid floor (perspective grid) |
| Matrix | Digital rain (falling katakana characters) |
| Documentary | None (clean, minimal is the signature) |
| Anime | Speed lines (`repeating-conic-gradient`) |
| Horror | Red vignette (`radial-gradient`) |
| Terminator | Red scan grid + targeting reticle |
| DB Scouter | Concentric scouter rings (green circles) |
| Blade Runner | Neon rain (colored vertical streaks) |
| Total Recall | Glitch distortion bands (horizontal offset) |
| JARVIS | Arc reactor rings (concentric blue circles + glow) |

### 3. Create beat templates (minimum 3)

1. **Opening**: Sets mood (3-6 seconds)
2. **Feature**: Reusable content beat (code, list, grid, data)
3. **Closing**: CTA or title card

### 4. Match animation timing to mood

| Mood | Timing Pattern |
|------|---------------|
| Epic / grand | Slow fades (1-2s), `scale: [3, 1]`, long pauses |
| Technical | Fast `stagger` (0.15s duration), `typewriter`, `blink` |
| Dramatic | `translateX: [-30, 0]` slides, rapid `opacity` snaps |
| Elegant | Gentle `translateY: [10, 0]`, slow `width` expansion |
| Mysterious | Very slow fades (2-3s), delayed reveals |
| Energetic | Quick `scale: [1.3, 1]`, short stagger gaps |

### 5. Choose BGM

| BGM | Mood | Best themes |
|-----|------|-------------|
| theme001.mp3 | Epic orchestral | Space Opera, Mecha, DB Scouter |
| story001.mp3 | Smooth piano | Film Noir, Blade Runner |
| story002.mp3 | Techno, inspiring | Cyberpunk, Total Recall, JARVIS |
| story003.mp3 | Piano, inspiring | JARVIS |
| story004.mp3 | Classical ambient | Documentary, Blade Runner |
| story005.mp3 | Piano solo | Documentary, Elegant |
| vibe001.mp3 | Dance, energetic | Anime, Action |
| llm001.mp3 | Electronic | Terminator, Matrix |
| olympic001.mp3 | Epic fanfare | DB Scouter, Anime |
| classical001.mp3 | Classical | Mecha, Documentary |
| llm001.mp3 | Electronic | Matrix, Cyberpunk |
| Piano Horror (Mixkit) | Horror piano | Horror, Thriller |
| Cyberpunk City (Mixkit) | Dark electronic | Cyberpunk, Matrix |
| Minimalist Jazz (Mixkit) | Jazz noir | Film Noir |
| Better Times (Mixkit) | Synthwave | Retro 80s |
