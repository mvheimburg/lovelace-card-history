import { historyLanguage, type LanguageSource } from "../strings";

/** The History card's and its editor's own words, in English and Bokmål. */
const en = {
  title: "History",
  entitiesRequired: "Add at least one entity under entities",
  entities: "Entities",
  cardTitle: "Title",
  range: "Default range",
  fill: "Translucent fill under lines",
  smooth: "Smooth lines",
  showCurrent: "Show current values",
  appearance: "Appearance",
  defaultAppearance: "Default",
  thirdUnit: "Not drawn: the chart has room for two units",
  missing: "Entity not found",
  hours6: "6 hours",
  hours24: "24 hours",
  days7: "7 days",
};
export type CardStrings = typeof en;
const nb: CardStrings = {
  title: "Historikk",
  entitiesRequired: "Legg til minst én entitet under entities",
  entities: "Entiteter",
  cardTitle: "Tittel",
  range: "Standard tidsrom",
  fill: "Gjennomsiktig fyll under linjene",
  smooth: "Myke linjer",
  showCurrent: "Vis nåverdier",
  appearance: "Utseende",
  defaultAppearance: "Standard",
  thirdUnit: "Ikke tegnet: diagrammet har plass til to enheter",
  missing: "Fant ikke entiteten",
  hours6: "6 timer",
  hours24: "24 timer",
  days7: "7 dager",
};
export function cardStrings(hass?: LanguageSource): CardStrings {
  return historyLanguage(hass) === "nb" ? nb : en;
}
