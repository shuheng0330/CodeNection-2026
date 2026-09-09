import type { Metadata } from "next";

export const BRAND_TITLE =
  "Pikul — Your week is more than your timetable.";
export const BRAND_DESCRIPTION =
  "See assignments, shifts, commuting and family together. Compare your week with your own normal, and find room for what matters.";
export const BRAND_IMAGE_ALT =
  "Pikul — Your week is more than your timetable, illustrated with a curved carrying line and hanging weights.";

function deploymentBaseUrl(deploymentHost?: string) {
  if (!deploymentHost) {
    return new URL("http://localhost:3000");
  }

  return new URL(
    deploymentHost.includes("://")
      ? deploymentHost
      : `https://${deploymentHost}`,
  );
}

export function createBrandMetadata(deploymentHost?: string): Metadata {
  return {
    metadataBase: deploymentBaseUrl(deploymentHost),
    title: BRAND_TITLE,
    description: BRAND_DESCRIPTION,
    openGraph: {
      title: BRAND_TITLE,
      description: BRAND_DESCRIPTION,
      type: "website",
      images: [
        {
          url: "/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: BRAND_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: BRAND_TITLE,
      description: BRAND_DESCRIPTION,
      images: [
        {
          url: "/opengraph-image.png",
          alt: BRAND_IMAGE_ALT,
        },
      ],
    },
  };
}

