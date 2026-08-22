import { acceptedCountries, getLocalizedAcceptedCountries, type CountryLang } from "@/lib/influencer-program"

export const allCountriesSlotValue = "Todos os países"

export function getMeetingSlotCountryOptions(lang: CountryLang, allCountriesLabel = allCountriesSlotValue) {
  return [
    { value: allCountriesSlotValue, label: allCountriesLabel },
    ...getLocalizedAcceptedCountries(lang).filter((country) => country.value !== "Outro país europeu"),
  ]
}

export function isValidMeetingSlotCountry(country: string) {
  return country === allCountriesSlotValue || acceptedCountries.includes(country)
}

export function canBookSlotFromCountry(slotCountry: string, bookingCountry: string) {
  return slotCountry === allCountriesSlotValue || slotCountry === bookingCountry
}
