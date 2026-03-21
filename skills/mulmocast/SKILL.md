---
name: mulmocast
description: Unified entry point — automatically routes input to the appropriate MulmoCast skill
allowed-tools: Read, Bash, Grep, Glob
user-invocable: true
---

# /mulmocast - Unified Dispatcher

Automatically detect the input type and route to the appropriate MulmoCast skill.

## Invocation

```
/mulmocast <input>
```

Where `<input>` can be a URL, file path, or topic description.

## Skill Name Resolution

When invoking a child skill, try the **namespaced name first**, then fall back to the **short name**:

1. Try `mulmocast:story` → if not found, try `story`
2. Try `mulmocast:narrate` → if not found, try `narrate`
3. Try `mulmocast:extend` → if not found, try `extend`
4. Try `mulmocast:illustrate` → if not found, try `illustrate`
5. Try `mulmocast:presentation` → if not found, try `presentation`

This ensures the dispatcher works both as an installed plugin (namespaced) and in local/symlinked setups (no namespace).

## Routing Rules

Detect the input type and invoke the corresponding skill using the Skill tool:

1. **URL** (starts with `http://` or `https://`)
   - If the input contains illustration keywords (see below) → invoke `illustrate` skill
   - Otherwise → invoke `story` skill
   - The selected skill will fetch the URL, research the content, and create a presentation

2. **File path with presentation extension** (`.pdf`, `.pptx`, `.md`, `.key`) → invoke `narrate` skill
   - The narrate skill will convert the source file into a narrated ExtendedMulmoScript

3. **File path with `.json` extension** → invoke `extend` skill
   - The extend skill will add metadata to the existing MulmoScript

4. **Plain text** (no extension, not a URL)
   - If the input contains presentation keywords (see below) → invoke `presentation` skill
   - If the input contains illustration keywords (see below) → invoke `illustrate` skill
   - Otherwise → invoke `story` skill
   - Treat as a topic description for the selected skill to research and create a presentation

### Presentation keywords

Route to the `presentation` skill when the input contains any of these keywords:
`presentation`, `プレゼン`, `プレゼンテーション`, `発表`, `スライド作成`, `slide deck`

### Illustration keywords

Route to the `illustrate` skill when the input contains any of these keywords:
`illustrate`, `illustrated`, `illustration`, `picture book`, `image-based`, `画像`, `イラスト`, `絵本`

### Animation keywords

When the input contains animation keywords, pass them through to the routed skill (story or illustrate) so it knows to use `html_tailwind` animated beats:
`animated`, `animation`, `html_tailwind`, `cinematic`, `opening crawl`, `3D`, `motion`, `アニメーション`, `動くスライド`

## Examples

```
/mulmocast https://example.com/article
→ routes to story skill (try mulmocast:story, then story)

/mulmocast samples/presentation.pdf
→ routes to narrate skill (try mulmocast:narrate, then narrate)

/mulmocast samples/document.md
→ routes to narrate skill (try mulmocast:narrate, then narrate)

/mulmocast scripts/my-talk/my-talk.json
→ routes to extend skill (try mulmocast:extend, then extend)

/mulmocast AI trends in 2026
→ routes to story skill (try mulmocast:story, then story)

/mulmocast https://example.com/article illustrate
→ routes to illustrate skill (try mulmocast:illustrate, then illustrate)

/mulmocast AI trends in 2026, illustrated
→ routes to illustrate skill (try mulmocast:illustrate, then illustrate)

/mulmocast 宇宙の歴史をイラストで
→ routes to illustrate skill (try mulmocast:illustrate, then illustrate)
```

## Important

- Do NOT process the input yourself — always delegate to the appropriate skill
- Pass the original input (including any additional arguments) to the target skill
- If the input type is ambiguous, ask the user which skill to use
