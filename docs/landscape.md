# Landscape: where this sits

Digital Light Herder is a **playable software homage** to Dave Blair’s analog optical device. It is not the Device. It is also not “another Mandelbrot toy.” This is how the neighborhood actually looks, as of August 2026.

## The original (the thing we are honoring)

| | |
| --- | --- |
| **The Light Herder / God Machine II** | Dave Blair. Cameras, 4K monitors with analog H/S/B/C, 50/50 teleprompter glass, rods on linear+rotational bearings, switchers, delay boxes, trap/cut, insanity mode. The operator is physically in the loop. Featured on Make, Boing Boing, Hackaday, Kottke, TechEBlog. Hofstadter and Peitgen wrote him. Site: [thelightherder.com](https://www.thelightherder.com/). 4K walkthrough: [YouTube](https://www.youtube.com/watch?v=koDCabeh5kQ). |
| **Peter Henry King, 1997** | [Sweet and Fizzy](https://sweetandfizzy.com/fractals/) — two monitors + window glass at 45°. This is the fractal trick Blair cites. Ordinary camera-at-TV makes tunnels; multiplying the image in glass makes IFS-like attractors. King later: Max, Quartz Composer, iPhone IFS tables. |
| **Lineage** | Nam June Paik / video feedback; Sandin Image Processor; Vasulkas; Hofstadter’s *GEB* (Magritte’s *The Fair Captive*); Crutchfield, *Space-Time Dynamics in Video Feedback* (1984); Courtial & Padgett on pixellated feedback (*Nature*, 2001); 1990s optical fractal synthesizers (Tanida et al.). |

Blair’s claim is specific and fair: **precision analog optical 4K feedback with the operator herding knobs in real time** is not the same as rendering feedback in software. We should never muddy that. Commenters on Hackaday already police this line. Agree with them on the page.

## How to score the neighborhood

Five questions that actually matter for *this* homage, not for “best VJ tool”:

1. **Physics** — is light in air doing the work?
2. **Blair topology** — glass mixer, trap/cut, delay, two structures, insanity?
3. **Phone in thirty seconds** — can a fan play without installing a DAW of video?
4. **Guided unique sessions** — can a non-coder land somewhere *specific* and good?
5. **Infinite desk** — is the full graph still there after the on-ramp?

## Digital cousins

| Tool | What it is | Physics | Blair topology | Phone / free | Guided | Infinite desk | Vs this homage |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Light Herder** | Analog optical sculpture | Yes | The definition | No (you travel to the machine) | Operator as instrument | Yes, in mahogany | Irreplaceable. We point here. |
| **King 1997** | Two TVs + window glass | Yes | Glass trick only | DIY | Technique page | Small | Origin story we credit. |
| **Hydra** (Olivia Jack) | Browser live-coding video synth. WebGL, WebRTC jams. Inspired by analog modular *and* Crutchfield. | No | You can patch feedback; not named trap/glass/insanity | Yes, legendary | Gallery of sketches, still code | Yes, if you write | Better general instrument. Worse as a Blair fan toy. |
| **zissl / Hydra-on-WebGPU** | Same language, new GPU path | No | Same as Hydra | Modern browsers | Same | Same | Engine, not an homage. |
| **TouchDesigner / Max+Jitter** | Pro VJ / installation. Feedback TOPs, `jit.rota`. | No | You *can* rebuild his graph | Paid, steep | Your patch | Unlimited | Nobody ships Blair’s desk as a toy. |
| **Lumen** (Paracosm, Mac, ~$129) | Semi-modular analog-style video synth. Syphon, webcam, MIDI, 150+ patches. | No | Feedback patches exist | Mac app | Preset library | Patch bay | Closest “instrument” cousin. Not his topology, not free, not phone. |
| **Chromatose** (iOS) | Touch-first modular video synth. Metal, MIDI, AirPlay, 4K. | No | Generators + FX, not glass IFS | Phone-native | Learn in an hour | Modular, capped on free tier | Wins “trippy phone synth.” Loses “this is the Light Herder’s loop.” |
| **Shadertoy / p5 FBOs / VEDA / The Force** | Demo-scene ping-pong, live GLSL | No | Buffers and tunnels | Browser / editor | Examples | If you code | You must write the shader. No homage. |
| **Electric Sheep / fractal flames** (Draves) | Evolved IFS animations, screensaver flock | No | Math attractors, not a video loop | Screensaver | Watch, vote | Parameter space | Beautiful, unrelated process. No trap, no glass, no dying loop. |
| **Static IFS explorers** | Barnsley fern, chaos game, King’s later iPhone tables | No | IFS yes, video no | Often yes | Demos | Finite | Still pictures of the *idea*, not herding. |
| **Phone “point camera at screen”** | Accidental analog | Sort of | Tunnel, then white/black death | Instant | None | None | Shallow. This is what people think video feedback *is*. |
| **Academic OFS** | TV + mirrors as analog IFS (2008+ papers) | Yes | Closest physics papers | Lab | Papers | — | Not a fan instrument. |
| **This homage** | GPU ping-pong of *his* graph, named knobs, sessions + console | No | Deliberately yes | Browser, PWA, 540p on phones | Nine sessions + coach | Full desk in Console | Only sharp edge: Blair’s device in the browser, honest about not being analog. |

**Honest score:** Hydra, Lumen, Chromatose, and TouchDesigner are “better” as general visual instruments. Blair’s machine is “better” as physics. Electric Sheep is “better” as a communal fractal culture. This project does not compete with those on their terms.

This project only makes sense as **his topology, in a browser, with the knobs named after his moves**, plus a path for someone who is not a live-coder.

That is enough if we stay humble and specific.

## What fans already have (and what they don’t)

Blair’s audience arrives from Make / Hackaday / Kottke / the 4K YouTube. They already know:

- “Fractals without a computer” is the headline. Software that pretends otherwise will get roasted.
- The glass is the trick. Camera-at-TV is not the trick.
- Trap/cut, delay, and insanity are *named moves*, not generic FX.

They do **not** have:

- A way to *play those named moves* on a phone while waiting for a gallery visit that may never come.
- A guided Sierpiński / jellyfish / Fair Captive that still opens onto a desk of rods.
- A public GPU sketch that cites King, Hofstadter, and Blair in one breath and gives Blair veto.

Hydra people already live in feedback. They are not the primary audience. Light Herder people who will never open TouchDesigner are.

## What “winning” looks like here

Not download counts against Resolume. Winning is:

1. Light Herder fans can play the *ideas* on a phone in thirty seconds.
2. Blair is credited, linked, and given veto.
3. A few people who would never open TouchDesigner have a Sierpiński moment.
4. The console remains infinite — we did not sand off the depth to make a preset player.
5. B3’s marketing stays a footnote: proof of messy physical/digital builds, not a product SKU.

## Risks

- **Name collision.** “Light Herder” is his. Homage framing + blessing request is mandatory. If he objects, rename or take down.
- **Category error.** Commenters will say “this isn’t analog.” Agree with them on the page.
- **Going to black.** Digital loops die without screen-blend + contrast. We already learned that the hard way.
- **Mobile GPU.** 1080p + three loops + delay will cook a phone. Default 540p on small screens.
- **Looking like a knockoff product.** Do not sell the instrument. Do not run ads that outrank his site. Fit-call links stay quiet.
- **King’s glass vs our IFS placement.** We simulate contracted copies screened together, not photons. Stay in that sentence.

## Sources

- [thelightherder.com](https://www.thelightherder.com/)
- [davidblairportfolio.com — kinetic sculpture](https://davidblairportfolio.com/video-feedback-kinetic-sculpture/)
- [YouTube 4K device](https://www.youtube.com/watch?v=koDCabeh5kQ)
- [Hackaday, Jan 2024](https://hackaday.com/2024/01/02/video-feedback-machine-creates-analog-fractals/)
- [King, Sweet and Fizzy](https://sweetandfizzy.com/fractals/)
- [Hydra](https://hydra.ojack.xyz/) — Jack cites Crutchfield in the repo README
- [Lumen](https://lumen-app.com/)
- [Chromatose](https://www.chromatose.app/en/)
- [Electric Sheep / Draves](https://scottdraves.com/sheep.html)
- Crutchfield, J. P. (1984). Space-Time Dynamics in Video Feedback.
- Courtial, Leach, Padgett (2001). Fractals in pixellated video feedback. *Nature*.
