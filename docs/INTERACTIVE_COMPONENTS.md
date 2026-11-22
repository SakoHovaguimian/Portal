# Interactive Components

Import these components and their public types from `@/components/ui`. Open the [Component Library](/dev-settings/components) in local demo mode and search for a component by name to try it and adjust its settings.

| Component                                                               | Behavior and configuration                                                                                                                                                                                  |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Animated Counter](/dev-settings/components?component=animated-counter) | Roll individual digits as the value changes. Configure precision, grouping, separators, padding, and affixes.                                                                                               |
| [Step Player](/dev-settings/components?component=step-player)           | Play, pause, replay, or select steps in a timed sequence. Configure per-step timing, looping, and control placement.                                                                                        |
| [Card Swap](/dev-settings/components?component=card-swap)               | Click or fling the front card to send it to the back. Configure stack size, offset, rotation, and the optional auto-advance interval. Auto-advance pauses during focus, hover, and drag.                    |
| [Orbit Carousel](/dev-settings/components?component=orbit-carousel)     | Swipe, use the arrow keys, or press the navigation buttons to move around a continuous ring. Configure spread, depth, idle float, pointer tilt, and settle speed.                                           |
| [Assignee Picker](/dev-settings/components?component=assignee-picker)   | Choose people from a keyboard-navigable multi-select. Supply names, optional photos and descriptions, disabled choices, selection limits, and an overlapping row or compact grid.                           |
| [Time Scrubber](/dev-settings/components?component=time-scrubber)       | Drag or scroll the horizontal ruler through a 24-hour day. Configure snapping, locale, the 12- or 24-hour display, and momentum. Arrow keys, Home, End, Page Up, and Page Down support precise adjustments. |
| [Image Compare](/dev-settings/components?component=image-compare)       | Drag the elastic divider between aligned images. Supply image sources and alt text, optional labels, aspect ratio, keyboard step, and flick-to-edge behavior.                                               |
| [Voice Note](/dev-settings/components?component=voice-note)             | Hold to record, release to keep, or slide left to cancel. Play, pause, scrub, and discard the clip. Configure recording mode, duration, cancellation distance, sensitivity, bar count, and bounce.          |
| [Create Menu](/dev-settings/components?component=create-menu)           | Expand the trigger into a menu. Supply actions, optional icons, disabled items, and an action callback. The menu supports arrow keys, Escape, and return focus.                                             |

The controls use Portal's semantic surfaces, focus indicators, shape, and motion tokens. Device and saved reduced-motion preferences suppress automatic movement and settling animations while preserving direct input. Use the provided class options for layout or per-instance styling. Card Swap and Orbit Carousel accept `cardClassName`. Assignee Picker accepts `popoverClassName` and Create Menu accepts `menuClassName`.

## Controlled Values

- Animated Counter accepts a numeric `value`, `decimals` (0–15), `padStart` (1–21 integer digits), Western or Indian `grouping`, custom string separators, and React node `prefix` and `suffix` slots. A blank grouping separator disables grouping. The digit roll defaults to the theme’s entrance timing and can be overridden with `duration` in seconds. The formatted value is available to assistive technology as one string.
- Step Player accepts a numeric step count or an array of `{ label, duration }` entries. Step indices are zero-based and durations are in milliseconds. Use `value` and `playing` for controlled state or `defaultValue` and `defaultPlaying` for local state. Pausing preserves elapsed progress. Seeking starts the selected step from the beginning. `onComplete` fires once per completed sequence, including each loop. Device and saved Reduced Motion skip the visual transitions and continuous fill while preserving playback timing. Customize the control with `showControl`, `controlPosition`, and `size` in pixels. Seek buttons keep a 44px minimum target.
- Card Swap and Orbit Carousel accept `activeId` or `defaultActiveId` and emit `onActiveChange`. Use stable, unique item IDs and label each card. Card contents are presentational. Place independent links or actions alongside the deck.
- Assignee Picker accepts `value` or `defaultValue` as an array of option IDs and emits `onValueChange`. Unavailable options may be disabled individually.
- Time Scrubber uses minutes since midnight. `stepMinutes` supports whole-minute divisors of a day up to 60 and defaults to 15. `onValueChange` emits the snapped minute on release or keyboard change. An optional `name` includes that value in native form data.
- Image Compare takes a percentage from 0 through 100. `onValueChange` reports movement and `onValueCommit` reports the final target. Match both images' framing for a continuous wipe.
- Create Menu accepts `open` or `defaultOpen` with `onOpenChange` and calls `onAction` with the selected item ID. The consumer owns creation and any resulting navigation.

## Voice Capture

Voice Note uses the browser's microphone and MediaRecorder by default. Microphone capture needs a secure context and browser permission. `interaction="toggle"` starts and stops on activation, which also lets a first-time user grant permission without holding the button. Keyboard activation toggles recording in either mode. Escape discards the current recording.

`onClipChange` receives a `VoiceNoteClip` with a `Blob`, duration in milliseconds, and waveform levels. Discarding emits `null`. The component keeps audio in memory and releases its stream and playback URL on cleanup. The consumer owns saving and uploading. An optional `captureSource` supplies a different `MediaStream` and receives an abort signal for cleanup. The library uses a bundled sample to exercise the same recording and playback paths without microphone access.

## References And Preview Media

The interaction references are [Card Swap](https://bencho.dev/blocks/card-swap), [Carousel](https://bencho.dev/blocks/carousel), [Assignees](https://bencho.dev/blocks/picker), [Time Scrubber](https://bencho.dev/blocks/time-scrubber), [Image Compare](https://bencho.dev/blocks/image-compare), [Voice Note](https://bencho.dev/blocks/voice-note), and [Create Menu](https://bencho.dev/blocks/liq-create) on Bencho.

The demos bundle [Alpine](https://unsplash.com/photos/XPVVtqCQWzY), [Ridge](https://unsplash.com/photos/EkrDOiRyOp8), [Forest](https://unsplash.com/photos/cUkXCqyv3dQ), [Cloud](https://unsplash.com/photos/HMT5XIUctUE), and [Valley](https://unsplash.com/photos/sqJ40H9RtNw) under the [Unsplash License](https://unsplash.com/license).
