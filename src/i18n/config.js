export const supportedLocales = ["en", "uz", "ru"];
export const defaultLocale = "en";

export async function getMessages(locale) {
  const lang = supportedLocales.includes(locale) ? locale : defaultLocale;
  switch (lang) {
    case "uz":
      return (await import("./uz.json")).default;
    case "ru":
      return (await import("./ru.json")).default;
    default:
      return (await import("./en.json")).default;
  }
}

