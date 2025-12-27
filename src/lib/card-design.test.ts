// src/lib/card-design.test.ts
import { describe, it, expect } from 'vitest'
import {
  CardStyle,
  ColorScheme,
  AccessibilityOptions,
  CardDesignOptions,
  defaultCardDesign,
} from './card-design'

describe('card-design', () => {
  describe('CardStyle type', () => {
    it('should accept valid card styles', () => {
      const validStyles: CardStyle[] = ['classic', 'modern', 'minimalist']
      validStyles.forEach((style) => {
        const design: CardDesignOptions = { ...defaultCardDesign, style }
        expect(design.style).toBe(style)
      })
    })
  })

  describe('ColorScheme type', () => {
    it('should accept valid color schemes', () => {
      const validSchemes: ColorScheme[] = ['traditional', 'monochrome', 'vibrant']
      validSchemes.forEach((scheme) => {
        const design: CardDesignOptions = { ...defaultCardDesign, colorScheme: scheme }
        expect(design.colorScheme).toBe(scheme)
      })
    })
  })

  describe('AccessibilityOptions', () => {
    it('should have boolean properties', () => {
      const options: AccessibilityOptions = {
        highContrast: true,
        largerText: false,
      }
      expect(typeof options.highContrast).toBe('boolean')
      expect(typeof options.largerText).toBe('boolean')
    })

    it('should allow both options to be true', () => {
      const options: AccessibilityOptions = {
        highContrast: true,
        largerText: true,
      }
      expect(options.highContrast).toBe(true)
      expect(options.largerText).toBe(true)
    })

    it('should allow both options to be false', () => {
      const options: AccessibilityOptions = {
        highContrast: false,
        largerText: false,
      }
      expect(options.highContrast).toBe(false)
      expect(options.largerText).toBe(false)
    })
  })

  describe('CardDesignOptions', () => {
    it('should combine all design properties', () => {
      const design: CardDesignOptions = {
        style: 'modern',
        colorScheme: 'vibrant',
        accessibility: {
          highContrast: true,
          largerText: true,
        },
      }
      expect(design.style).toBe('modern')
      expect(design.colorScheme).toBe('vibrant')
      expect(design.accessibility.highContrast).toBe(true)
      expect(design.accessibility.largerText).toBe(true)
    })
  })

  describe('defaultCardDesign', () => {
    it('should have classic style', () => {
      expect(defaultCardDesign.style).toBe('classic')
    })

    it('should have traditional color scheme', () => {
      expect(defaultCardDesign.colorScheme).toBe('traditional')
    })

    it('should have all accessibility options disabled by default', () => {
      expect(defaultCardDesign.accessibility.highContrast).toBe(false)
      expect(defaultCardDesign.accessibility.largerText).toBe(false)
    })

    it('should be a complete CardDesignOptions object', () => {
      const design: CardDesignOptions = defaultCardDesign
      expect(design).toHaveProperty('style')
      expect(design).toHaveProperty('colorScheme')
      expect(design).toHaveProperty('accessibility')
      expect(design.accessibility).toHaveProperty('highContrast')
      expect(design.accessibility).toHaveProperty('largerText')
    })
  })
})
