// src/lib/card-design-utils.ts
import { CardStyle, ColorScheme, AccessibilityOptions } from './card-design'
import { Suit } from './doppelkopf'

/**
 * Get CSS classes for card container based on style
 */
export const getCardContainerClasses = (style: CardStyle): string => {
  const baseClasses = 'w-44 h-64 sm:w-56 sm:h-80 md:w-64 md:h-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center cursor-pointer transition-colors'

  switch (style) {
    case 'classic':
      return baseClasses
    case 'modern':
      return 'w-44 h-64 sm:w-56 sm:h-80 md:w-64 md:h-96 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-2xl flex items-center justify-center cursor-pointer transition-all hover:scale-105'
    case 'minimalist':
      return 'w-44 h-64 sm:w-56 sm:h-80 md:w-64 md:h-96 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 flex items-center justify-center cursor-pointer transition-colors'
  }
}

/**
 * Get CSS classes for card back based on style
 */
export const getCardBackClasses = (style: CardStyle): string => {
  const baseClasses = 'w-full h-full bg-blue-500 dark:bg-blue-700 rounded-lg border-4 border-white dark:border-gray-600 transition-colors'

  switch (style) {
    case 'classic':
      return baseClasses
    case 'modern':
      return 'w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-700 dark:to-blue-900 rounded-xl border-2 border-blue-300 dark:border-blue-800 transition-colors'
    case 'minimalist':
      return 'w-full h-full bg-gray-100 dark:bg-gray-900 rounded border-2 border-gray-400 dark:border-gray-600 transition-colors'
  }
}

/**
 * Determine if suit should be displayed in red color
 */
const isRedSuit = (suit: Suit): boolean => {
  return suit === 'Herz' || suit === 'Karo'
}

/**
 * Get high contrast color classes for suit
 */
const getHighContrastColors = (suit: Suit): string => {
  return isRedSuit(suit)
    ? 'text-red-700 dark:text-red-300'
    : 'text-black dark:text-white'
}

/**
 * Get traditional color scheme classes for suit
 */
const getTraditionalColors = (suit: Suit): string => {
  return isRedSuit(suit)
    ? 'text-red-600 dark:text-red-400'
    : 'text-gray-900 dark:text-gray-100'
}

/**
 * Get vibrant color scheme classes for suit
 */
const getVibrantColors = (suit: Suit): string => {
  if (isRedSuit(suit)) {
    return suit === 'Herz'
      ? 'text-pink-600 dark:text-pink-400'
      : 'text-orange-600 dark:text-orange-400'
  }
  else {
    return suit === 'Pik'
      ? 'text-indigo-900 dark:text-indigo-300'
      : 'text-emerald-900 dark:text-emerald-300'
  }
}

/**
 * Get text color classes for card suit based on color scheme
 */
export const getSuitColorClasses = (
  suit: Suit,
  colorScheme: ColorScheme,
  accessibility: AccessibilityOptions,
): string => {
  // High contrast mode overrides other color schemes
  if (accessibility.highContrast) {
    return getHighContrastColors(suit)
  }

  switch (colorScheme) {
    case 'traditional':
      return getTraditionalColors(suit)

    case 'monochrome':
      return 'text-gray-900 dark:text-gray-100'

    case 'vibrant':
      return getVibrantColors(suit)
  }
}

/**
 * Get text size classes based on accessibility settings
 */
export const getTextSizeClasses = (
  baseSize: 'small' | 'medium' | 'large',
  accessibility: AccessibilityOptions,
): string => {
  const sizes = {
    small: accessibility.largerText ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl',
    medium: accessibility.largerText ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl',
    large: accessibility.largerText ? 'text-5xl sm:text-6xl' : 'text-4xl sm:text-5xl',
  }

  return sizes[baseSize]
}

/**
 * Get card content wrapper classes based on style
 */
export const getCardContentClasses = (style: CardStyle): string => {
  const baseClasses = 'w-full h-full p-4 flex flex-col justify-between animate-fade-in-slow'

  switch (style) {
    case 'classic':
      return baseClasses
    case 'modern':
      return 'w-full h-full p-6 flex flex-col justify-between animate-fade-in-slow'
    case 'minimalist':
      return 'w-full h-full p-3 flex flex-col justify-between animate-fade-in-slow'
  }
}
