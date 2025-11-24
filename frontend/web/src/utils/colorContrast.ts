/**
 * Calcula el contraste entre un color y el fondo
 * Retorna true si el contraste es suficiente para usar texto blanco
 */
export const shouldUseWhiteText = (hexColor: string): boolean => {
  // Remover el # si existe
  const hex = hexColor.replace('#', '');
  
  // Convertir a RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calcular luminosidad relativa (fórmula WCAG)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Si la luminosidad es menor a 0.5, usar texto blanco
  // Si es mayor, usar texto oscuro
  return luminance < 0.5;
};

/**
 * Oscurece un color para mejorar el contraste en modo oscuro
 */
export const darkenColor = (hexColor: string, amount: number = 30): string => {
  const hex = hexColor.replace('#', '');
  const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - amount);
  const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - amount);
  const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - amount);
  
  return `#${[r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('')}`;
};



