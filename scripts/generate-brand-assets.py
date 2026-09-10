from __future__ import annotations

import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
APP = ROOT / "app"
CHUNKS = ROOT / ".next" / "static" / "chunks"
MEDIA = ROOT / ".next" / "static" / "media"

COLORS = {
    "linen": "#fbf7f2",
    "raised": "#f5eee6",
    "hairline": "#e7dcd1",
    "ink": "#2b211c",
    "muted": "#7a6a60",
    "clay700": "#8f3f24",
    "clay600": "#b0512f",
    "clay500": "#c2603f",
    "clay100": "#f2e4d8",
    "dusk": "#5b6c8c",
}

SHARING_IMAGE_ALT = (
    "Pikul — Your week is more than your timetable, illustrated with a curved "
    "carrying line and hanging weights."
)


def find_latin_font(family: str) -> Path:
    css = "\n".join(path.read_text(encoding="utf-8") for path in CHUNKS.glob("*.css"))
    pattern = re.compile(
        rf"@font-face\{{font-family:{re.escape(family)};(?P<body>[^}}]+U\+\?\?[^}}]+)\}}"
    )
    match = pattern.search(css)
    if not match:
        raise RuntimeError(
            f"Could not find the {family} Latin font emitted by next/font. "
            "Run npm run build first."
        )
    filename = re.search(r"\.\./media/([^)]*\.woff2)", match.group("body"))
    if not filename:
        raise RuntimeError(f"The {family} font rule did not contain a WOFF2 source.")
    return MEDIA / filename.group(1)


def quadratic_points(
    start: tuple[float, float],
    control: tuple[float, float],
    end: tuple[float, float],
    steps: int = 80,
) -> list[tuple[float, float]]:
    points = []
    for index in range(steps + 1):
        t = index / steps
        inverse = 1 - t
        points.append(
            (
                inverse * inverse * start[0]
                + 2 * inverse * t * control[0]
                + t * t * end[0],
                inverse * inverse * start[1]
                + 2 * inverse * t * control[1]
                + t * t * end[1],
            )
        )
    return points


def cubic_points(
    start: tuple[float, float],
    control_a: tuple[float, float],
    control_b: tuple[float, float],
    end: tuple[float, float],
    steps: int = 120,
) -> list[tuple[float, float]]:
    points = []
    for index in range(steps + 1):
        t = index / steps
        inverse = 1 - t
        points.append(
            (
                inverse**3 * start[0]
                + 3 * inverse * inverse * t * control_a[0]
                + 3 * inverse * t * t * control_b[0]
                + t**3 * end[0],
                inverse**3 * start[1]
                + 3 * inverse * inverse * t * control_a[1]
                + 3 * inverse * t * t * control_b[1]
                + t**3 * end[1],
            )
        )
    return points


def generate_icon(transparent: bool = True) -> Image.Image:
    background = (0, 0, 0, 0) if transparent else COLORS["linen"]
    image = Image.new("RGBA", (512, 512), background)
    draw = ImageDraw.Draw(image)

    # Arched carrying yoke beam (rests on shoulders, lifts towards fulcrum)
    beam = quadratic_points((48, 208), (256, 100), (464, 208))
    draw.line(beam, fill=COLORS["clay500"], width=50, joint="curve")
    for point in (beam[0], beam[-1]):
        draw.ellipse(
            (point[0] - 25, point[1] - 25, point[0] + 25, point[1] + 25),
            fill=COLORS["clay500"],
        )

    # Center fulcrum node (the shoulder contact / balance point)
    draw.ellipse((256 - 28, 108 - 28, 256 + 28, 108 + 28), fill=COLORS["clay700"])

    # Left suspension cord and balanced counterweight
    draw.line((88, 216, 88, 296), fill=COLORS["clay600"], width=32)
    draw.ellipse((88 - 60, 355 - 60, 88 + 60, 355 + 60), fill=COLORS["clay700"])
    draw.ellipse((88 - 20, 355 - 20, 88 + 20, 355 + 20), fill=COLORS["linen"])

    # Right suspension cord and balanced counterweight
    draw.line((424, 216, 424, 296), fill=COLORS["clay600"], width=32)
    draw.ellipse((424 - 60, 355 - 60, 424 + 60, 355 + 60), fill=COLORS["clay700"])
    draw.ellipse((424 - 20, 355 - 20, 424 + 20, 355 + 20), fill=COLORS["linen"])

    return image


def generate_svg_icon() -> str:
    return """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <!-- Fulcrum node -->
  <circle cx="16" cy="6.8" r="1.8" fill="#8f3f24"/>

  <!-- Arched carrying yoke beam -->
  <path d="M3 13 C9 6.2, 23 6.2, 29 13" stroke="#c2603f" stroke-width="3.2" stroke-linecap="round"/>

  <!-- Left suspension cord & counterweight -->
  <line x1="5.5" y1="13.5" x2="5.5" y2="18.5" stroke="#b0512f" stroke-width="2" stroke-linecap="round"/>
  <circle cx="5.5" cy="22.2" r="3.8" fill="#8f3f24"/>
  <circle cx="5.5" cy="22.2" r="1.3" fill="#fbf7f2"/>

  <!-- Right suspension cord & counterweight -->
  <line x1="26.5" y1="13.5" x2="26.5" y2="18.5" stroke="#b0512f" stroke-width="2" stroke-linecap="round"/>
  <circle cx="26.5" cy="22.2" r="3.8" fill="#8f3f24"/>
  <circle cx="26.5" cy="22.2" r="1.3" fill="#fbf7f2"/>
</svg>
"""



def generate_sharing_image(fraunces_path: Path, dm_sans_path: Path) -> Image.Image:
    scale = 2
    image = Image.new("RGB", (1200 * scale, 630 * scale), COLORS["linen"])
    draw = ImageDraw.Draw(image)

    def box(values: tuple[int, int, int, int]) -> tuple[int, int, int, int]:
        return tuple(value * scale for value in values)

    def point(values: tuple[int, int]) -> tuple[int, int]:
        return tuple(value * scale for value in values)

    fraunces_wordmark = ImageFont.truetype(fraunces_path, 54 * scale)
    fraunces_headline = ImageFont.truetype(fraunces_path, 76 * scale)
    dm_sans = ImageFont.truetype(dm_sans_path, 24 * scale)

    draw.ellipse(box((870, -200, 1310, 240)), fill=COLORS["clay100"])
    draw.ellipse(box((-160, 420, 300, 880)), fill=COLORS["raised"])

    draw.text(point((78, 42)), "Pikul", font=fraunces_wordmark, fill=COLORS["clay700"])
    wordmark_width = draw.textlength("Pikul", font=fraunces_wordmark) / scale
    draw.ellipse(
        box((int(78 + wordmark_width + 8), 70, int(78 + wordmark_width + 24), 86)),
        fill=COLORS["clay500"],
    )

    draw.text(
        point((78, 132)),
        "Your week is more than",
        font=fraunces_headline,
        fill=COLORS["ink"],
    )
    draw.text(
        point((78, 214)),
        "your timetable.",
        font=fraunces_headline,
        fill=COLORS["clay700"],
    )
    draw.text(
        point((82, 318)),
        "See everything you carry, together.",
        font=dm_sans,
        fill=COLORS["muted"],
    )

    curve = cubic_points((92, 422), (318, 385), (410, 545), (602, 505))
    curve += cubic_points((602, 505), (795, 465), (904, 370), (1102, 420))[1:]
    scaled_curve = [(x * scale, y * scale) for x, y in curve]
    draw.line(scaled_curve, fill=COLORS["clay600"], width=10 * scale, joint="curve")
    for x, y in (scaled_curve[0], scaled_curve[-1]):
        radius = 5 * scale
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=COLORS["clay600"])

    for start, end in [((280, 429), (280, 493)), ((552, 510), (552, 552)), ((862, 430), (862, 500))]:
        draw.line((*point(start), *point(end)), fill=COLORS["clay500"], width=5 * scale)

    draw.rounded_rectangle(
        box((236, 485, 324, 561)),
        radius=24 * scale,
        fill=COLORS["clay100"],
        outline=COLORS["clay500"],
        width=3 * scale,
    )
    draw.rounded_rectangle(
        box((508, 544, 596, 600)),
        radius=22 * scale,
        fill=COLORS["raised"],
        outline=COLORS["hairline"],
        width=3 * scale,
    )
    draw.rounded_rectangle(
        box((818, 492, 906, 574)),
        radius=26 * scale,
        fill=COLORS["dusk"],
    )

    return image.resize((1200, 630), Image.Resampling.LANCZOS)


def main() -> None:
    fraunces = find_latin_font("Fraunces")
    dm_sans = find_latin_font("DM Sans")

    favicon = generate_icon(transparent=True)
    favicon.save(APP / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

    apple_icon = generate_icon(transparent=False)
    apple_icon.resize((180, 180), Image.Resampling.LANCZOS).save(APP / "apple-icon.png")

    (APP / "icon.svg").write_text(
        generate_svg_icon().strip() + "\n",
        encoding="utf-8",
    )

    generate_sharing_image(fraunces, dm_sans).save(APP / "opengraph-image.png")
    (APP / "opengraph-image.alt.txt").write_text(
        SHARING_IMAGE_ALT,
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
