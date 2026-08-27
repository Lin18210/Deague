export const WEATHER_TYPES = ['clear','overcast','rain','storm','fog','snow','arcane_aurora'];
export const WEATHER_DESCRIPTIONS = {
  clear         : 'A rare clear sky. Stars glitter overhead like scattered coin.',
  overcast      : 'Heavy grey clouds press low. The air smells of iron.',
  rain          : 'Cold rain patters against stone. The torches hiss and spit.',
  storm         : 'Lightning splits the sky. The thunder rattles your teeth.',
  fog           : 'Thick fog swallows the path a dozen paces ahead.',
  snow          : 'Snowflakes drift down in eerie silence.',
  arcane_aurora : 'Ribbons of violet and gold light pulse across the sky.',
};
export function rollWeather() {
  return WEATHER_TYPES[Math.floor(Math.random() * WEATHER_TYPES.length)];
}
export function getWeatherModifier(weather) {
  return {
    clear       : { perception: +1, stealth: -1 },
    rain        : { stealth: +1, perception: -1, fire_dmg: -2 },
    storm       : { perception: -2, stealth: +2, lightning_dmg: +2 },
    fog         : { perception: -3, stealth: +3 },
    arcane_aurora: { spell_dc: +1, magic_dmg: +2 },
  }[weather] || {};
}
