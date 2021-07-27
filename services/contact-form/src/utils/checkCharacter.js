const SAFE_CHARACTERS_REGEX = /^[\w !&+./:@`|£À-ÿāăąćĉċčđēėęěĝğģĥħĩīįİıĵķĸĺļłńņōőœŗřśŝşšţŦũūŭůűųŵŷźżžơưếệ–-]*$/i;
export const isValidCharacter = value => SAFE_CHARACTERS_REGEX.test(value);
