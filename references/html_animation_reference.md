# html_tailwind Animation API Reference

This is a concise reference for generating animated html_tailwind beats in MulmoScript.
The runtime template injects helper functions (`interpolate`, `Easing`, `MulmoAnimation`) that are available in the `script` field.

## Beat Structure

```json
{
  "image": {
    "type": "html_tailwind",
    "html": ["<div id='el'>...</div>"],
    "script": ["const animation = new MulmoAnimation(); ..."],
    "animation": true
  }
}
```

- `html`: HTML markup only (no `<script>` tags). Use Tailwind CSS classes.
- `script`: JavaScript code (no `<script>` tags — automatically wrapped)
- `animation`: `true` (30fps) or `{ "fps": 15 }` for custom fps
- `duration`: **Do NOT set** — automatically calculated from audio length. Only set explicitly for silent beats or when you need a fixed duration.

## Available Runtime APIs

### interpolate(value, opts)

Maps a frame number to a value range with clamping and optional easing.

```javascript
interpolate(frame, {
  input: { inMin: 0, inMax: fps },
  output: { outMin: 0, outMax: 1 },
  easing: 'easeOut'  // optional: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | Easing.xxx
})
```

### Easing

```javascript
Easing.linear     // t => t
Easing.easeIn     // t => t * t
Easing.easeOut    // t => 1 - (1 - t) * (1 - t)
Easing.easeInOut  // smooth acceleration/deceleration
```

### MulmoAnimation

Declarative animation helper. Times (`start`, `end`) are in **seconds**. Use `end: 'auto'` to span the entire beat duration.

```javascript
const animation = new MulmoAnimation();

// Property animation (CSS/transform/SVG)
animation.animate(selector, props, { start, end, easing? })
// props: { opacity: [from, to], translateY: [from, to], width: [from, to, '%'] }
// end: seconds or 'auto' (= beat's total duration)

// Stagger across numbered elements (selector uses {i} placeholder)
animation.stagger(selector, count, props, { start, stagger, duration, easing? })

// Typewriter effect
animation.typewriter(selector, text, { start, end })

// Animated counter
animation.counter(selector, [from, to], { start, end, prefix?, suffix?, decimals? })

// Code reveal — show lines one by one (line-level typewriter)
animation.codeReveal(selector, linesArray, { start, end })

// Blink — periodic show/hide toggle (e.g. cursor)
animation.blink(selector, { interval? })  // interval: half-cycle seconds (default 0.5)

// Auto-render: if variable is named `animation`, render() is auto-generated.
// No need to define render() manually.
```

#### Property types

| Property | Applied as | Default unit |
|----------|-----------|-------------|
| `translateX`, `translateY` | CSS transform | px |
| `scale` | CSS transform | (none) |
| `rotate` | CSS transform | deg |
| `rotateX`, `rotateY`, `rotateZ` | CSS transform (3D rotation) | deg |
| `opacity` | style.opacity | (none) |
| Other CSS (`width`, etc.) | style[prop] | px (override with `[from, to, '%']`) |
| SVG attrs (`r`, `cx`, etc.) | setAttribute | (none) |

## Constraints

- `animation` and `moviePrompt` cannot be used together on the same beat
- Do NOT set `duration` on animated beats — it is auto-calculated from the audio. Setting it explicitly can cause audio/video desync. Only set `duration` for silent beats or fixed-length intros.
- `end: 'auto'` uses the beat's total duration (`totalFrames / fps`) as the end time
- CSS animations/transitions are disabled in the template (deterministic frame rendering)
- All elements that will be animated should have initial styles set inline (e.g., `style='opacity:0'`)

## Image Animation Patterns

Embed real images (`<img>`) inside animated html_tailwind beats. Sample script: `scripts/samples/image_animation_showcase.json`

### Critical Rules

1. **Variable name must be `animation`** — the auto-render system checks `typeof animation !== 'undefined'`. Using `const a = ...` will silently fail (no animation).
2. **Wrap images in a `<div>` for transforms** — animate the wrapper, not the `<img>` directly. `object-fit:cover` on `<img>` conflicts with `scale`/`translate` transforms.
3. **Use `image:` URL scheme** — reference `imageParams.images` with `src="image:{imageKey}"` (e.g., `src="image:bg_scene"`). Mulmocast resolves these automatically. Relative paths and absolute `file://` paths also still work but `image:` is preferred.

### Pattern: Ken Burns (zoom + pan)

```json
"html": [
  "<div class='h-full w-full overflow-hidden relative bg-black'>",
  "  <div id='photo_wrap' style='position:absolute;inset:0;overflow:hidden'>",
  "    <img src='image:photo' style='width:100%;height:100%;object-fit:cover' />",
  "  </div>",
  "</div>"
],
"script": [
  "const animation = new MulmoAnimation();",
  "animation.animate('#photo_wrap', { scale: [1.0, 1.2], translateX: [0, -30, 'px'] }, { start: 0, end: 'auto', easing: 'linear' });"
]
```

### Pattern: Image + Text Overlay

Image as background, text panel slides in over a gradient scrim.

```json
"html": [
  "<div class='h-full w-full relative bg-black'>",
  "  <img src='image:photo' style='position:absolute;inset:0;width:100%;height:100%;object-fit:cover' />",
  "  <div style='position:absolute;inset:0;background:linear-gradient(to right, rgba(0,0,0,0.75), transparent)'></div>",
  "  <div id='panel' style='opacity:0;position:absolute;left:0;top:0;bottom:0;width:45%;display:flex;flex-direction:column;justify-content:center;padding:0 48px'>",
  "    <h2 id='h2' style='opacity:0;color:white;font-size:36px'>Title</h2>",
  "  </div>",
  "</div>"
],
"script": [
  "const animation = new MulmoAnimation();",
  "animation.animate('#panel', { opacity: [0,1], translateX: [-60,0,'px'] }, { start: 0.3, end: 1.0, easing: 'easeOut' });",
  "animation.animate('#h2', { opacity: [0,1], translateY: [20,0] }, { start: 0.6, end: 1.2, easing: 'easeOut' });"
]
```

### Pattern: Image Carousel (cross-fade)

Wrap each image in a `<div id='w{i}'>`, cross-fade with `opacity`.

```json
"html": [
  "<div class='h-full w-full relative bg-black overflow-hidden'>",
  "  <div id='w0' style='position:absolute;inset:0'><img src='image:img1' style='width:100%;height:100%;object-fit:cover' /></div>",
  "  <div id='w1' style='position:absolute;inset:0;opacity:0'><img src='image:img2' style='width:100%;height:100%;object-fit:cover' /></div>",
  "</div>"
],
"script": [
  "const animation = new MulmoAnimation();",
  "animation.animate('#w0', { scale: [1.0, 1.1] }, { start: 0, end: 2.0 });",
  "animation.animate('#w0', { opacity: [1, 0] }, { start: 1.6, end: 2.2 });",
  "animation.animate('#w1', { opacity: [0, 1] }, { start: 1.6, end: 2.2 });",
  "animation.animate('#w1', { scale: [1.05, 1.0] }, { start: 2.0, end: 'auto' });"
]
```

### Pattern: HUD Overlay on Photo

Image as background with CSS-drawn brackets, counters, scan lines.

```json
"script": [
  "const animation = new MulmoAnimation();",
  "animation.animate('#scan', { translateY: [0, 720, 'px'] }, { start: 0, end: 2.0, easing: 'linear' });",
  "animation.stagger('#b{i}', 4, { opacity: [0,1], scale: [1.6,1.0] }, { start: 1.5, stagger: 0.15, duration: 0.5 });",
  "animation.counter('#ct', [0, 3], { start: 2.5, end: 4.0, decimals: 0 });"
]
```

### Other Patterns

- **Split reveal**: Two images with `stagger('#s{i}', 2, ...)` entrance
- **Zoom spotlight**: Wrapper scales up + vignette overlay fades in + callout ring
- **Parallax layers**: Background/mid/front at different `translateX` speeds
- **Morphing grid**: 2×2 grid with `stagger('#g{i}', 4, ...)` scale-in

## Combining imagePrompt with html_tailwind Animation

Use AI-generated images (`imagePrompt`) as backgrounds for animated beats. This produces cinematic visuals — AI art with Ken Burns, text overlays, counters, etc.

### How it works

`mulmo movie` executes in order: **audio → images → video**. By the time html_tailwind renders, images from `imageParams.images` already exist on disk. Reference them with `<img src="image:{imageKey}">` — the `image:` URL scheme resolves automatically.

### Syntax

```html
<img src="image:{imageKey}" />
```

Example: image key `bg_city` → `<img src="image:bg_city" />`

### Full example: imagePrompt + Ken Burns + text overlay

```json
{
  "imageParams": {
    "images": {
      "bg_finance": {
        "type": "imagePrompt",
        "prompt": "Dramatic Wall Street scene at dusk, towering glass buildings reflecting golden light, trading floor visible through windows, cinematic wide angle, photorealistic"
      }
    }
  },
  "beats": [
    {
      "text": "Narration text here",
      "speaker": "Presenter",
      "image": {
        "type": "html_tailwind",
        "html": [
          "<div class='h-full w-full overflow-hidden relative bg-black'>",
          "  <div id='wrap' style='position:absolute;inset:0;overflow:hidden'>",
          "    <img src='image:bg_finance' style='width:100%;height:100%;object-fit:cover' />",
          "  </div>",
          "  <div style='position:absolute;inset:0;background:linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)'></div>",
          "  <div id='title' style='opacity:0;position:absolute;bottom:120px;left:48px;right:48px'>",
          "    <div style='font-size:20px;color:#60A5FA;font-weight:bold;margin-bottom:12px'>BREAKING NEWS</div>",
          "    <h1 style='color:white;font-size:44px;font-weight:bold;line-height:1.3'>Headline Text</h1>",
          "  </div>",
          "</div>"
        ],
        "script": [
          "const animation = new MulmoAnimation();",
          "animation.animate('#wrap', { scale: [1.0, 1.15] }, { start: 0, end: 'auto', easing: 'linear' });",
          "animation.animate('#title', { opacity: [0,1], translateY: [40,0] }, { start: 0.5, end: 1.5, easing: 'easeOut' });"
        ],
        "animation": true
      }
    }
  ]
}
```

### Pattern: imagePrompt + data overlay

AI image as background with animated metrics and callout boxes.

```json
"html": [
  "<div class='h-full w-full overflow-hidden relative bg-black'>",
  "  <div id='bg' style='position:absolute;inset:0;overflow:hidden'>",
  "    <img src='image:bg_market' style='width:100%;height:100%;object-fit:cover;filter:brightness(0.4)' />",
  "  </div>",
  "  <div id='card' style='opacity:0;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.7);border:1px solid #3B82F6;border-radius:16px;padding:48px;text-align:center'>",
  "    <div style='color:#94A3B8;font-size:18px'>MARKET SIZE</div>",
  "    <div id='counter' style='color:white;font-size:72px;font-weight:bold'>$0</div>",
  "    <div style='color:#EF4444;font-size:20px;margin-top:8px'>Trillion</div>",
  "  </div>",
  "</div>"
],
"script": [
  "const animation = new MulmoAnimation();",
  "animation.animate('#bg', { scale: [1.05, 1.0] }, { start: 0, end: 'auto', easing: 'linear' });",
  "animation.animate('#card', { opacity: [0,1], scale: [0.8,1.0] }, { start: 0.3, end: 1.0, easing: 'easeOut' });",
  "animation.counter('#counter', [0, 1.8], { start: 1.0, end: 3.0, prefix: '$', decimals: 1 });"
]
```

### Tips

- **Image prompt quality**: Write detailed, cinematic prompts. Include lighting, angle, mood. The image is the visual foundation.
- **Darken for readability**: Use `filter:brightness(0.4)` on `<img>` or gradient overlays to ensure text is readable over AI images.
- **One image per beat**: Each beat typically needs one background image. Define multiple keys in `imageParams.images` for multi-beat scripts.
- **Mix with slides**: Animated imagePrompt beats can be mixed freely with static `slide` beats in the same script. Use animation for hook/close beats and slides for data-heavy beats.
