# Image Prompt Reference

Guide for writing effective `imagePrompt` strings in MulmoScript beats.

## Prompt Structure

Build each prompt using these components in order:

```
[Subject] + [Style] + [Composition] + [Lighting] + [Mood] + [Details]
```

| Component | Purpose | Example |
|-----------|---------|---------|
| Subject | What is in the image | "A software engineer presenting at a conference" |
| Style | Visual rendering style | "digital illustration, flat design" |
| Composition | Camera angle and framing | "wide shot, centered" |
| Lighting | Light source and quality | "soft natural lighting, golden hour" |
| Mood | Emotional atmosphere | "optimistic, professional" |
| Details | Extra specifics | "blue and white color palette, clean background" |

## Style Keywords

| Category | Keywords |
|----------|----------|
| Photorealistic | photorealistic, photography, DSLR, 35mm film, documentary style |
| Digital illustration | digital illustration, vector art, flat design, isometric |
| Painterly | watercolor, oil painting, impressionist, acrylic |
| Anime / Manga | anime style, manga-inspired, cel shading, Studio Ghibli style |
| Cinematic | cinematic, movie still, anamorphic, widescreen |
| Minimalist | minimalist, clean lines, simple shapes, negative space |
| Retro / Vintage | retro, vintage, 80s aesthetic, pixel art, vaporwave |
| 3D render | 3D render, clay render, low-poly, Pixar style |

## Composition Keywords

| Framing | Keywords |
|---------|----------|
| Close-up | close-up, macro, portrait, face detail |
| Medium shot | medium shot, waist up, half body |
| Wide shot | wide shot, full body, establishing shot |
| Bird's eye | bird's eye view, top-down, overhead |
| Low angle | low angle, worm's eye view, looking up |
| Rule of thirds | off-center, rule of thirds |
| Centered | centered, symmetrical |
| Panoramic | panoramic, ultra-wide, landscape orientation |

## Visual Brief for Consistency

Define a **Visual Brief** at the start of your project and apply it to every prompt. This ensures visual coherence across all beats.

### Visual Brief Template

```
Style: [chosen style, e.g., "flat digital illustration"]
Palette: [2-3 dominant colors, e.g., "navy blue, coral, white"]
Recurring elements: [shared motifs, e.g., "geometric shapes, rounded corners"]
Character style: [if applicable, e.g., "simplified faces, no detailed features"]
Background: [consistent treatment, e.g., "soft gradient backgrounds"]
```

### How to Apply

Append the Visual Brief keywords to every beat's `imagePrompt`:

```
[Beat-specific subject and composition], [Visual Brief style], [Visual Brief palette], [Visual Brief background]
```

**Example**: If Visual Brief is "flat digital illustration, navy blue and coral palette, soft gradient backgrounds":

- Beat 1: "A team brainstorming around a whiteboard, **flat digital illustration, navy blue and coral palette, soft gradient background**"
- Beat 2: "A rocket launching from a laptop screen symbolizing growth, **flat digital illustration, navy blue and coral palette, soft gradient background**"

## Anti-Patterns

| Anti-pattern | Problem | Fix |
|-------------|---------|-----|
| Text in images | AI image generators render text poorly | Put text/labels in narration or slide overlays, not in the image prompt |
| Overcrowded scenes | Too many subjects become incoherent | Focus on one clear subject per image |
| Vague prompts | "A nice picture about technology" produces generic results | Be specific: subject, style, composition, colors |
| Inconsistent style | Each beat looks like a different artist | Use Visual Brief consistently across all prompts |
| Describing abstract concepts literally | "A picture of innovation" is too abstract | Use metaphors: "A lightbulb emerging from a tangled knot of wires" |
| Contradictory descriptors | "dark bright moody cheerful" confuses the generator | Pick one mood direction per image |

## Example Prompts

### Tech / Business

```
A modern open-plan office with developers collaborating at standing desks, large
monitors showing code and dashboards, natural light from floor-to-ceiling windows,
digital illustration, clean flat design, blue and teal color palette, warm and
productive atmosphere
```

### Education / Explainer

```
A curious student surrounded by floating holographic diagrams of the solar system,
reaching out to touch Jupiter, watercolor and digital mixed media, soft purple and
gold palette, sense of wonder, wide shot with the student centered
```

### Storytelling / Narrative

```
A lone traveler walking across a vast desert at sunset, long shadow stretching
behind them, cinematic wide shot, warm orange and deep purple sky, photorealistic,
35mm film grain, contemplative mood
```

### Data / Analytics

```
An abstract visualization of interconnected data nodes forming a neural network
pattern, glowing blue connections on a dark background, isometric 3D render, clean
geometric shapes, futuristic and professional, navy and electric blue palette
```
