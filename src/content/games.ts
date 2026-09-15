import type { Game } from "./types";

/**
 * Games published by AG Orion Studio.
 *
 * To add a game, append an object here (or create it from /admin). Detail pages,
 * sitemap entries, metadata, structured data and navigation are generated
 * automatically from this data.
 *
 * Artwork under /public/images/games/<slug>/ is placeholder art - replace it with
 * real store assets and in-game screenshots at any time; paths stay the same.
 */
export const games: Game[] = [
  {
    slug: "indianopenworlddriving",
    name: "Indian Open World Driving",
    type: "game",
    tagline: "Free-roam an Indian-inspired open world from behind the wheel.",
    shortDescription:
      "Explore an Indian-inspired open world, drive different vehicles, navigate city traffic, explore the environment, and enjoy free-roaming driving gameplay.",
    description: [
      "Indian Open World Driving is an open-world driving and simulation game for Android. It places you in a city and surrounding roads inspired by everyday India, with traffic, landmarks and street life that reward taking the long way around.",
      "The game is built around free exploration rather than lap times. Pick a vehicle, pull out into traffic and go wherever the roads lead - through busy junctions, along highways and into quieter neighbourhoods - at your own pace.",
      "AG Orion Studio develops, publishes and supports Indian Open World Driving directly. Updates, bug reports and feedback all go straight to the team building the game.",
    ],
    icon: "/images/games/indianopenworlddriving/icon.png",
    heroImage: "/images/games/indianopenworlddriving/hero.jpg",
    screenshots: [
      {
        src: "/images/games/indianopenworlddriving/screenshot-1.jpg",
        alt: "A sedan driving through a busy Indian city street with auto-rickshaws and shopfronts",
        caption: "City streets with everyday traffic",
      },
      {
        src: "/images/games/indianopenworlddriving/screenshot-2.jpg",
        alt: "A compact SUV on a coastal highway at dusk with a bridge ahead",
        caption: "Highways and open roads to explore",
      },
      {
        src: "/images/games/indianopenworlddriving/screenshot-3.jpg",
        alt: "A city bus turning at an illuminated roundabout at night after rain",
        caption: "Different vehicles, day and night",
      },
    ],
    category: "Simulation",
    genres: ["Open World", "Driving", "Simulation"],
    platforms: ["Android"],
    status: "Published",
    featured: true,
    packageName: "com.orionstudio.indian3dracingdriving",
    storeLinks: [
      {
        store: "Google Play",
        url: "https://play.google.com/store/apps/details?id=com.orionstudio.indian3dracingdriving",
      },
    ],
    privacyUrl: "/privacy/",
    supportUrl: "/contact/#support",
    features: [
      "Indian-inspired open world with city streets, highways and surrounding roads",
      "Several different vehicles to drive, each with its own feel",
      "City traffic to navigate, from busy junctions to open stretches",
      "Free-roaming gameplay with no forced race structure",
      "Explore the environment at your own pace",
      "Designed and optimized for Android phones",
    ],
    gameplay: [
      "Indian Open World Driving is a free-roam experience. There is no grid start and no finish line: you choose a vehicle, join the flow of traffic and explore the map however you like.",
      "Driving through the city means reading the road - merging into traffic, working through junctions and finding your way around a layout inspired by real Indian streets. Head out of the centre and the roads open up for longer, more relaxed drives.",
      "Switching vehicles changes how the world feels. Larger vehicles ask for more care in tight streets, while smaller ones make it easier to weave through traffic and explore side roads.",
    ],
    requirements: [
      { label: "Platform", value: "Android" },
      { label: "Distribution", value: "Google Play" },
      { label: "Minimum Android version", value: "See the Google Play listing" },
      { label: "Storage", value: "See the Google Play listing for the current download size" },
    ],
    // Version and release history are intentionally left empty until confirmed.
    // Example: releases: [{ version: "1.2.0", date: "2025-06-01", notes: ["New vehicle", "Bug fixes"] }]
    releases: [],
    seo: {
      title: "Indian Open World Driving",
      description:
        "Indian Open World Driving is an open-world driving game from AG Orion Studio. Explore an Indian-inspired city, drive vehicles, navigate traffic and enjoy free-roaming gameplay.",
    },
    visibility: "public",
    sortOrder: 1,
  },
];
