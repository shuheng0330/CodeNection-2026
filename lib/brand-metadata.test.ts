import { describe, expect, it } from "vitest";
import { createBrandMetadata } from "./brand-metadata";

describe("brand metadata", () => {
  it("uses one consistent identity and a large sharing image", () => {
    const metadata = createBrandMetadata("pikul.example");

    expect(metadata.metadataBase?.toString()).toBe("https://pikul.example/");
    expect(metadata.title).toBe("Pikul");
    expect(metadata.description).toBe(
      "See assignments, shifts, commuting and family together. Compare your week with your own normal, and find room for what matters.",
    );
    expect(metadata.alternates).toBeUndefined();
    expect(metadata.openGraph).toMatchObject({
      title: "Pikul",
      type: "website",
      images: [
        {
          url: "/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: "Pikul — Your week is more than your timetable, illustrated with a curved carrying line and hanging weights.",
        },
      ],
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: "Pikul",
      images: [
        {
          url: "/opengraph-image.png",
          alt: "Pikul — Your week is more than your timetable, illustrated with a curved carrying line and hanging weights.",
        },
      ],
    });
  });

  it("falls back to localhost only when no deployment host is available", () => {
    expect(createBrandMetadata().metadataBase?.toString()).toBe(
      "http://localhost:3000/",
    );
  });
});
