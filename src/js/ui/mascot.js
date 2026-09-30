/**
 * PyITES · ui/mascot
 * La mascota "Pyti", dibujada en SVG para no depender de imágenes.
 * El SVG incluye las clases .eye y .tongue, animadas desde components.css.
 */

/**
 * @param {string} [size]  '' | 'xs' | 'sm' | 'lg' para escalarla
 * @param {string} [mood]  'happy' (por defecto) | 'sad'
 */
export const mascot = (size = '', mood = 'happy') => {
  const sad = mood === 'sad';
  const mouth = sad ? 'M48 79 Q60 70 72 79' : 'M46 71 Q60 84 74 71';
  const tongue = sad
    ? ''
    : '<path class="tongue" d="M60 80 v9 m0 0 l-4 5 m4 -5 l4 5" stroke="#ff4b4b" stroke-width="3" fill="none" stroke-linecap="round"/>';
  const tear = sad ? '<path d="M35 64 q-4 8 0 11 q4 -3 0 -11z" fill="#8fd3ff"/>' : '';

  return `<div class="mascot-box ${size}"><svg class="mascot" viewBox="0 0 120 120" aria-hidden="true">
    <ellipse cx="60" cy="104" rx="42" ry="13" fill="#2a5f96"/>
    <ellipse cx="60" cy="100" rx="42" ry="13" fill="#3776ab"/>
    <path d="M22 100 q38 12 76 0" stroke="#ffd43b" stroke-width="5" fill="none" stroke-linecap="round" opacity=".9"/>
    <circle cx="60" cy="58" r="41" fill="#4a9be0"/>
    <path d="M40 24 q20 -12 40 0" stroke="#ffd43b" stroke-width="7" fill="none" stroke-linecap="round"/>
    <ellipse cx="60" cy="74" rx="26" ry="17" fill="#ffe680"/>
    <g class="eye"><circle cx="43" cy="50" r="12" fill="#fff"/><circle cx="45" cy="52" r="6" fill="#16283a"/><circle cx="47.5" cy="49.5" r="2" fill="#fff"/></g>
    <g class="eye"><circle cx="77" cy="50" r="12" fill="#fff"/><circle cx="75" cy="52" r="6" fill="#16283a"/><circle cx="77.5" cy="49.5" r="2" fill="#fff"/></g>
    <circle cx="27" cy="68" r="5" fill="#ff9bb0" opacity=".7"/><circle cx="93" cy="68" r="5" fill="#ff9bb0" opacity=".7"/>
    <circle cx="54" cy="66" r="1.7" fill="#2a5f96"/><circle cx="66" cy="66" r="1.7" fill="#2a5f96"/>
    <path d="${mouth}" stroke="#16283a" stroke-width="3" fill="none" stroke-linecap="round"/>
    ${tongue}${tear}
  </svg></div>`;
};
