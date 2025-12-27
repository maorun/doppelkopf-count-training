// src/lib/card-design.ts

/**
 * Card design style options
 */
export type CardStyle = 'classic' | 'modern' | 'minimalist'

/**
 * Color scheme options for card suits
 */
export type ColorScheme = 'traditional' | 'monochrome' | 'vibrant'

/**
 * Accessibility options for card display
 */
export interface AccessibilityOptions {
  highContrast: boolean
  largerText: boolean
}

/**
 * Complete card design configuration
 */
export interface CardDesignOptions {
  style: CardStyle
  colorScheme: ColorScheme
  accessibility: AccessibilityOptions
}

/**
 * Default card design options
 */
export const defaultCardDesign: CardDesignOptions = {
  style: 'classic',
  colorScheme: 'traditional',
  accessibility: {
    highContrast: false,
    largerText: false,
  },
}
