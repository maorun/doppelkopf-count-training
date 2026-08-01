// src/lib/card-design-utils.test.ts
import { describe, it, expect } from 'vitest'
import {
  getCardContainerClasses,
  getCardBackClasses,
  getSuitColorClasses,
  getTextSizeClasses,
  getCardContentClasses,
} from './card-design-utils'

describe('card-design-utils', () => {
  describe('getCardContainerClasses', () => {
    it('should return base classes for classic style', () => {
      const classes = getCardContainerClasses('classic')
      expect(classes).toContain('w-64')
      expect(classes).toContain('h-96')
      expect(classes).toContain('bg-white')
      expect(classes).toContain('dark:bg-gray-800')
      expect(classes).toContain('rounded-lg')
    })

    it('should return gradient classes for modern style', () => {
      const classes = getCardContainerClasses('modern')
      expect(classes).toContain('bg-gradient-to-br')
      expect(classes).toContain('rounded-xl')
      expect(classes).toContain('shadow-2xl')
      expect(classes).toContain('hover:scale-105')
    })

    it('should return minimal classes for minimalist style', () => {
      const classes = getCardContainerClasses('minimalist')
      expect(classes).toContain('border')
      expect(classes).toContain('border-gray-300')
      expect(classes).not.toContain('shadow-lg')
    })
  })

  describe('getCardBackClasses', () => {
    it('should return base classes for classic style', () => {
      const classes = getCardBackClasses('classic')
      expect(classes).toContain('bg-blue-500')
      expect(classes).toContain('dark:bg-blue-700')
      expect(classes).toContain('rounded-lg')
      expect(classes).toContain('border-4')
    })

    it('should return gradient classes for modern style', () => {
      const classes = getCardBackClasses('modern')
      expect(classes).toContain('bg-gradient-to-br')
      expect(classes).toContain('from-blue-500')
      expect(classes).toContain('to-blue-700')
      expect(classes).toContain('rounded-xl')
    })

    it('should return minimal classes for minimalist style', () => {
      const classes = getCardBackClasses('minimalist')
      expect(classes).toContain('bg-gray-100')
      expect(classes).toContain('dark:bg-gray-900')
      expect(classes).toContain('border-2')
    })
  })

  describe('getSuitColorClasses', () => {
    describe('traditional color scheme', () => {
      it('should return red colors for Herz', () => {
        const classes = getSuitColorClasses('Herz', 'traditional', { highContrast: false, largerText: false })
        expect(classes).toContain('text-red-600')
        expect(classes).toContain('dark:text-red-400')
      })

      it('should return red colors for Karo', () => {
        const classes = getSuitColorClasses('Karo', 'traditional', { highContrast: false, largerText: false })
        expect(classes).toContain('text-red-600')
        expect(classes).toContain('dark:text-red-400')
      })

      it('should return dark colors for Pik', () => {
        const classes = getSuitColorClasses('Pik', 'traditional', { highContrast: false, largerText: false })
        expect(classes).toContain('text-gray-900')
        expect(classes).toContain('dark:text-gray-100')
      })

      it('should return dark colors for Kreuz', () => {
        const classes = getSuitColorClasses('Kreuz', 'traditional', { highContrast: false, largerText: false })
        expect(classes).toContain('text-gray-900')
        expect(classes).toContain('dark:text-gray-100')
      })
    })

    describe('monochrome color scheme', () => {
      it('should return same colors for all suits', () => {
        const herzClasses = getSuitColorClasses('Herz', 'monochrome', { highContrast: false, largerText: false })
        const pikClasses = getSuitColorClasses('Pik', 'monochrome', { highContrast: false, largerText: false })
        const karoClasses = getSuitColorClasses('Karo', 'monochrome', { highContrast: false, largerText: false })
        const kreuzClasses = getSuitColorClasses('Kreuz', 'monochrome', { highContrast: false, largerText: false })

        expect(herzClasses).toBe(pikClasses)
        expect(herzClasses).toBe(karoClasses)
        expect(herzClasses).toBe(kreuzClasses)
        expect(herzClasses).toContain('text-gray-900')
      })
    })

    describe('vibrant color scheme', () => {
      it('should return pink colors for Herz', () => {
        const classes = getSuitColorClasses('Herz', 'vibrant', { highContrast: false, largerText: false })
        expect(classes).toContain('text-pink-600')
        expect(classes).toContain('dark:text-pink-400')
      })

      it('should return orange colors for Karo', () => {
        const classes = getSuitColorClasses('Karo', 'vibrant', { highContrast: false, largerText: false })
        expect(classes).toContain('text-orange-600')
        expect(classes).toContain('dark:text-orange-400')
      })

      it('should return indigo colors for Pik', () => {
        const classes = getSuitColorClasses('Pik', 'vibrant', { highContrast: false, largerText: false })
        expect(classes).toContain('text-indigo-900')
        expect(classes).toContain('dark:text-indigo-300')
      })

      it('should return emerald colors for Kreuz', () => {
        const classes = getSuitColorClasses('Kreuz', 'vibrant', { highContrast: false, largerText: false })
        expect(classes).toContain('text-emerald-900')
        expect(classes).toContain('dark:text-emerald-300')
      })
    })

    describe('high contrast mode', () => {
      it('should override color scheme for red suits', () => {
        const classes = getSuitColorClasses('Herz', 'traditional', { highContrast: true, largerText: false })
        expect(classes).toContain('text-red-700')
        expect(classes).toContain('dark:text-red-300')
      })

      it('should override color scheme for black suits', () => {
        const classes = getSuitColorClasses('Pik', 'traditional', { highContrast: true, largerText: false })
        expect(classes).toContain('text-black')
        expect(classes).toContain('dark:text-white')
      })

      it('should work with vibrant color scheme', () => {
        const classes = getSuitColorClasses('Karo', 'vibrant', { highContrast: true, largerText: false })
        expect(classes).toContain('text-red-700')
        expect(classes).toContain('dark:text-red-300')
      })
    })
  })

  describe('getTextSizeClasses', () => {
    it('should return base sizes when largerText is false', () => {
      const smallSize = getTextSizeClasses('small', { highContrast: false, largerText: false })
      const mediumSize = getTextSizeClasses('medium', { highContrast: false, largerText: false })
      const largeSize = getTextSizeClasses('large', { highContrast: false, largerText: false })

      expect(smallSize).toBe('text-xl sm:text-2xl')
      expect(mediumSize).toBe('text-3xl sm:text-4xl')
      expect(largeSize).toBe('text-4xl sm:text-5xl')
    })

    it('should return larger sizes when largerText is true', () => {
      const smallSize = getTextSizeClasses('small', { highContrast: false, largerText: true })
      const mediumSize = getTextSizeClasses('medium', { highContrast: false, largerText: true })
      const largeSize = getTextSizeClasses('large', { highContrast: false, largerText: true })

      expect(smallSize).toBe('text-2xl sm:text-3xl')
      expect(mediumSize).toBe('text-4xl sm:text-5xl')
      expect(largeSize).toBe('text-5xl sm:text-6xl')
    })

    it('should work with high contrast enabled', () => {
      const size = getTextSizeClasses('medium', { highContrast: true, largerText: false })
      expect(size).toBe('text-3xl sm:text-4xl')
    })
  })

  describe('getCardContentClasses', () => {
    it('should return base classes for classic style', () => {
      const classes = getCardContentClasses('classic')
      expect(classes).toContain('w-full')
      expect(classes).toContain('h-full')
      expect(classes).toContain('p-4')
      expect(classes).toContain('flex')
      expect(classes).toContain('flex-col')
      expect(classes).toContain('justify-between')
    })

    it('should return more padding for modern style', () => {
      const classes = getCardContentClasses('modern')
      expect(classes).toContain('p-6')
    })

    it('should return less padding for minimalist style', () => {
      const classes = getCardContentClasses('minimalist')
      expect(classes).toContain('p-3')
    })

    it('should include animation for all styles', () => {
      const classicClasses = getCardContentClasses('classic')
      const modernClasses = getCardContentClasses('modern')
      const minimalistClasses = getCardContentClasses('minimalist')

      expect(classicClasses).toContain('animate-fade-in-slow')
      expect(modernClasses).toContain('animate-fade-in-slow')
      expect(minimalistClasses).toContain('animate-fade-in-slow')
    })
  })
})
