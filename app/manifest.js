export default function manifest() {
  return {
    name: "Bank Application Generator",
    short_name: "Bank App",
    description: "Generate bank job application PDFs",
    start_url: "/",
    display: "standalone",
    background_color: "#f9fafb",
    theme_color: "#1d4ed8",
    icons: [
      {
        src: "/app-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}