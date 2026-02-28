# html_tailwind Animation API Reference

This is a concise reference for generating animated html_tailwind beats in MulmoScript.
The runtime template injects helper functions (`interpolate`, `Easing`, `MulmoAnimation`) that are available in the `script` field.

## Beat Structure

```json
{
  "duration": 3,
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
- `duration`: Beat length in seconds. `totalFrames = floor(duration * fps)`. May be auto-calculated from audio.

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
- `duration` is required when `animation` is set (may be auto-calculated from audio)
- `end: 'auto'` uses the beat's total duration (`totalFrames / fps`) as the end time
- CSS animations/transitions are disabled in the template (deterministic frame rendering)
- All elements that will be animated should have initial styles set inline (e.g., `style='opacity:0'`)
