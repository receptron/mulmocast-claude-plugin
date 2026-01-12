---
name: mulmocast-scripting
description: |
  This skill provides knowledge about creating MulmoScript files for MulmoCast video and PDF generation. Use this skill when the user asks about MulmoScript structure, beat creation, or video/PDF generation with MulmoCast.
version: 1.0.0
---

# MulmoScript Creation Guide

MulmoScript is a JSON-based format for defining multi-modal presentations that can be converted to videos, podcasts, and PDFs using MulmoCast.

## Schema Validation

Generated MulmoScript must pass `mulmoScriptSchema.safeParse()` validation. Key requirements:

- `$mulmocast.version` must be exactly `"1.1"`
- `$mulmocast.credit` is optional, use `"closing"` to show credits at the end
- `beats` array must have at least 1 element
- All objects must be strict (no extra properties)
- `lang` defaults to `"en"` if not specified

## Basic Structure

```json
{
  "$mulmocast": {
    "version": "1.1",
    "credit": "closing"
  },
  "title": "Presentation Title",
  "description": "Brief description",
  "lang": "en",
  "beats": [
    { "text": "...", "image": { ... } }
  ]
}
```

## Beat Types

### 1. Text Slide
For titles, bullet points, and key messages:

```json
{
  "text": "Let me introduce the key features.",
  "image": {
    "type": "textSlide",
    "slide": {
      "title": "Key Features",
      "subtitle": "Optional subtitle",
      "bullets": ["Feature 1", "Feature 2", "Feature 3"]
    }
  }
}
```

### 2. Markdown
For code, tables, and formatted text:

```json
{
  "text": "Here is an example of the code.",
  "image": {
    "type": "markdown",
    "markdown": "# Code Example\n```typescript\nconst hello = () => console.log('Hello');\n```"
  }
}
```

### 3. Mermaid Diagrams
For flowcharts, sequence diagrams, architecture:

```json
{
  "text": "This diagram shows the data flow.",
  "image": {
    "type": "mermaid",
    "title": "Data Flow",
    "code": {
      "kind": "text",
      "text": "graph LR\n  A[Input] --> B[Process] --> C[Output]"
    }
  }
}
```

### 4. Charts
For data visualization (Chart.js format):

```json
{
  "text": "Sales have increased over the quarter.",
  "image": {
    "type": "chart",
    "title": "Quarterly Sales",
    "chartData": {
      "type": "bar",
      "data": {
        "labels": ["Q1", "Q2", "Q3", "Q4"],
        "datasets": [{
          "label": "Sales",
          "data": [100, 150, 200, 250]
        }]
      }
    }
  }
}
```

### 5. Static Image
For existing images:

```json
{
  "text": "This is our logo.",
  "image": {
    "type": "image",
    "source": {
      "kind": "path",
      "path": "./images/logo.png"
    }
  }
}
```

Or from URL:

```json
{
  "image": {
    "type": "image",
    "source": {
      "kind": "url",
      "url": "https://example.com/image.png"
    }
  }
}
```

### 6. AI-Generated Image
Use imagePrompt for AI generation:

```json
{
  "text": "Imagine a futuristic city.",
  "imagePrompt": "futuristic cityscape, neon lights, cyberpunk style, high detail"
}
```

### imagePrompt Best Practices

For emotional, impactful images (especially in promotional content):

**Include in prompts:**
- Emotion/atmosphere: "warm golden light", "sense of hope", "dramatic lighting"
- Human elements: "person looking at...", "hands holding...", "silhouette of..."
- Art style: "cinematic", "photorealistic", "digital art", "inspirational"
- Metaphorical imagery: "lightbulb transforming into video", "ideas as glowing butterflies"

**Good examples:**
```json
{
  "imagePrompt": "A glowing lightbulb floating in a person's open hands, warm golden light emanating, dreamy atmosphere, hope and potential, cinematic lighting"
}
```

```json
{
  "imagePrompt": "A person walking confidently toward a bright sunrise, leaving shadows behind, hope and new beginnings, inspirational cinematic shot"
}
```

**Avoid:**
- Generic descriptions: "a computer" (boring)
- Missing emotion: "a presentation" (no impact)
- Too vague: "ideas" (unclear)

## Speaker Configuration

Define speakers in `speechParams`:

```json
{
  "speechParams": {
    "speakers": {
      "Host": {
        "voiceId": "shimmer",
        "displayName": { "en": "Host" }
      },
      "Expert": {
        "voiceId": "echo",
        "displayName": { "en": "Expert" }
      }
    }
  },
  "beats": [
    { "speaker": "Host", "text": "Welcome everyone." },
    { "speaker": "Expert", "text": "Thank you for having me." }
  ]
}
```

## Best Practices

### Beat Text
- Keep conversational and natural
- 1-3 sentences per beat
- Avoid reading code verbatim; explain it
- Use transitions: "Now let's look at...", "Next, we'll explore..."

### Visual Selection
- **textSlide**: For introducing topics, summarizing points
- **markdown**: For code, technical details, tables
- **mermaid**: For architecture, workflows, relationships
- **chart**: For numerical data, trends, comparisons
- **image**: For screenshots, logos, photos

### Beat Count Guidelines

#### Standard Version
- Short video (2-3 min): 5-8 beats
- Medium video (5-7 min): 10-15 beats
- Long video (10+ min): 20+ beats

#### Detailed Version
For comprehensive repository explanations:
- Minimum 15-20 beats
- Cover every major component
- Include multiple code examples
- Show architecture diagrams for each subsystem
- Explain internal implementation details
- Cover edge cases and error handling
- Include configuration options

### Structure Flow

#### Standard Version
1. **Opening**: Title + hook
2. **Context**: Why this matters
3. **Main Content**: Core information in logical order
4. **Examples**: Concrete demonstrations
5. **Summary**: Key takeaways
6. **Closing**: Call to action or next steps

#### Detailed Version
1. **Opening**: Title + comprehensive overview
2. **Problem Statement**: Detailed context and motivation
3. **Architecture Overview**: High-level system design
4. **Core Components**: Deep dive into each module
5. **Data Flow**: How data moves through the system
6. **API/Interface**: Public interfaces and usage
7. **Implementation Details**: Key algorithms and patterns
8. **Configuration**: All configurable options
9. **Extension Points**: How to customize/extend
10. **Error Handling**: How errors are managed
11. **Testing**: Testing approach and coverage
12. **Performance**: Optimization considerations
13. **Examples**: Multiple real-world use cases
14. **Summary**: Comprehensive recap
15. **Next Steps**: Advanced topics and resources

## CLI Commands

Generate outputs with:

```bash
# Video (includes audio)
npx mulmocast movie script.json

# PDF
npx mulmocast pdf script.json

# Audio only
npx mulmocast audio script.json

# Images only
npx mulmocast images script.json
```

## Canvas Sizes

Default is 1280x720 (16:9). Can customize:

```json
{
  "canvasSize": {
    "width": 1080,
    "height": 1920
  }
}
```

Common sizes:
- Landscape: 1280x720, 1920x1080
- Portrait: 1080x1920 (for shorts/reels)
- Square: 1080x1080

## Language Support

Set primary language:

```json
{
  "lang": "ja"
}
```

Supported: en, ja, fr, es, de, zh-CN, zh-TW, ko, it, pt, ar, hi

## Schema Validation Checklist

Before outputting MulmoScript, verify:

1. [ ] `$mulmocast.version` is `"1.1"`
2. [ ] `beats` array has at least 1 element
3. [ ] Each beat has `text` (can be empty string `""`)
4. [ ] Image types match exactly: `textSlide`, `markdown`, `mermaid`, `chart`, `image`
5. [ ] Mermaid `code` uses `{ "kind": "text", "text": "..." }` format
6. [ ] No extra properties in any object (strict mode)
7. [ ] All URLs are valid if using `url` kind
8. [ ] All paths are relative if using `path` kind
