# React Bits

Copyright (c) 2026 David Haz. MIT + Commons Clause; full terms in LICENSE.md.
Copied source, not an npm dependency. https://reactbits.dev

- Magnet: https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/Animations/Magnet/Magnet.tsx
- SpotlightCard (existing): https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/Components/SpotlightCard/SpotlightCard.tsx
- License: https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md

Magnet retains upstream spring, pointer arbitration, maximum-offset and cleanup logic. Local adaptation: live reduced-motion/coarse-pointer guards. Presets/reset use a restrained 3px maximum offset. The speed control remains native and stationary for accurate dragging; its readout uses Magnet, its thumb uses local CSS feedback. Local palette/slider/button CSS is not React Bits.
