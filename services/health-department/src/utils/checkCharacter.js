const SAFE_CHARACTERS_REGEX = /^[\w !&+./:@`|£À-ÿāăąćĉċčđēėęěĝğģĥħĩīįİıĵķĸĺļłńņōőœŗřśŝşšţŦũūŭůűųŵŷźżžơưếệ–-]*$/i;
const NO_HTTP_REGEX = /^((?!http).)*$/i;
const NO_FTP_REGEX = /^((?!ftp).)*$/i;

export const isValidCharacter = value =>
  SAFE_CHARACTERS_REGEX.test(value) &&
  NO_HTTP_REGEX.test(value) &&
  NO_FTP_REGEX.test(value);

export const isValidTextCharacter = value =>
  NO_HTTP_REGEX.test(value) && NO_FTP_REGEX.test(value);
