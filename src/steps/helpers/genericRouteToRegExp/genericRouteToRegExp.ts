function escapeRegExp(str) {
  return str.replace(/[?.]/g, '\\$&');
}

export function genericRouteToRegExp(route): RegExp {
  let escapedRoute = escapeRegExp(route);
  let regExpStr = escapedRoute
    .replace('**', '{DOUBLE_WILDCARD}')
    .replace(/\*/g, '[a-zA-Z0-9@:%._\\-\\+~#=?&]*')
    .replace(
      '{DOUBLE_WILDCARD}',
      '[(http(s)?):\\/\\/(www.)?a-zA-Z0-9@:%._\\-\\+~#=]{2,256}\\.{0,1}[a-z]{0,6}\\/*'
    );

  regExpStr += '(\\?.*)?(#.*)?';

  return new RegExp('^' + regExpStr + '/*$');
}