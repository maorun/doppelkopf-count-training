// src/components/TutorialModal.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TutorialModal } from './TutorialModal'

describe('TutorialModal', () => {
  it('renders the trigger button', () => {
    render(
      <TutorialModal>
        <button>Open Tutorial</button>
      </TutorialModal>,
    )
    expect(screen.getByText('Open Tutorial')).toBeInTheDocument()
  })

  it('opens the tutorial when clicking the trigger', async () => {
    render(
      <TutorialModal>
        <button>Open Tutorial</button>
      </TutorialModal>,
    )

    fireEvent.click(screen.getByText('Open Tutorial'))

    // Wait for dialog to open and check for welcome step
    expect(await screen.findByText('Willkommen zum Tutorial')).toBeInTheDocument()
    expect(screen.getByText('Lerne die Grundlagen des Doppelkopf-Zähltrainings')).toBeInTheDocument()
  })

  it('displays the welcome step content initially', async () => {
    render(
      <TutorialModal>
        <button>Open Tutorial</button>
      </TutorialModal>,
    )

    fireEvent.click(screen.getByText('Open Tutorial'))

    expect(await screen.findByText(/Willkommen beim Doppelkopf-Zähltraining!/)).toBeInTheDocument()
    expect(screen.getByText(/Was lernst du hier?/)).toBeInTheDocument()
    expect(screen.getByText(/Kartenwerte im Doppelkopf kennenlernen/)).toBeInTheDocument()
  })

  it('shows step 1 of 5 initially', async () => {
    render(
      <TutorialModal>
        <button>Open Tutorial</button>
      </TutorialModal>,
    )

    fireEvent.click(screen.getByText('Open Tutorial'))

    expect(await screen.findByText('Schritt 1 von 5')).toBeInTheDocument()
  })

  it('navigates to the next step when clicking Weiter', async () => {
    render(
      <TutorialModal>
        <button>Open Tutorial</button>
      </TutorialModal>,
    )

    fireEvent.click(screen.getByText('Open Tutorial'))

    // Wait for modal to open
    await screen.findByText('Willkommen zum Tutorial')

    // Click next button
    fireEvent.click(screen.getByText('Weiter'))

    // Should show card values step
    expect(await screen.findByText('Kartenwerte')).toBeInTheDocument()
    expect(screen.getByText('Diese Punkte haben die verschiedenen Karten')).toBeInTheDocument()
    expect(screen.getByText('Schritt 2 von 5')).toBeInTheDocument()
  })

  it('disables the Zurück button on the first step', async () => {
    render(
      <TutorialModal>
        <button>Open Tutorial</button>
      </TutorialModal>,
    )

    fireEvent.click(screen.getByText('Open Tutorial'))

    await screen.findByText('Willkommen zum Tutorial')

    const backButton = screen.getByText('Zurück')
    expect(backButton).toBeDisabled()
  })

  it('enables the Zurück button after navigating forward', async () => {
    render(
      <TutorialModal>
        <button>Open Tutorial</button>
      </TutorialModal>,
    )

    fireEvent.click(screen.getByText('Open Tutorial'))

    await screen.findByText('Willkommen zum Tutorial')

    // Navigate forward
    fireEvent.click(screen.getByText('Weiter'))
    await screen.findByText('Kartenwerte')

    const backButton = screen.getByText('Zurück')
    expect(backButton).not.toBeDisabled()
  })

  it('navigates back to previous step when clicking Zurück', async () => {
    render(
      <TutorialModal>
        <button>Open Tutorial</button>
      </TutorialModal>,
    )

    fireEvent.click(screen.getByText('Open Tutorial'))

    await screen.findByText('Willkommen zum Tutorial')

    // Navigate forward
    fireEvent.click(screen.getByText('Weiter'))
    await screen.findByText('Kartenwerte')

    // Navigate back
    fireEvent.click(screen.getByText('Zurück'))

    expect(await screen.findByText('Willkommen zum Tutorial')).toBeInTheDocument()
    expect(screen.getByText('Schritt 1 von 5')).toBeInTheDocument()
  })

  it('displays card values in the Kartenwerte step', async () => {
    render(
      <TutorialModal>
        <button>Open Tutorial</button>
      </TutorialModal>,
    )

    fireEvent.click(screen.getByText('Open Tutorial'))

    await screen.findByText('Willkommen zum Tutorial')

    // Navigate to card values step
    fireEvent.click(screen.getByText('Weiter'))
    await screen.findByText('Kartenwerte')

    // Check for card values
    expect(screen.getByText('Ass (Ace)')).toBeInTheDocument()
    expect(screen.getByText('11 Punkte')).toBeInTheDocument()
    expect(screen.getByText('10 Punkte')).toBeInTheDocument()
    expect(screen.getByText('König (King)')).toBeInTheDocument()
    expect(screen.getByText('4 Punkte')).toBeInTheDocument()
    expect(screen.getByText('Dame (Queen)')).toBeInTheDocument()
    expect(screen.getByText('3 Punkte')).toBeInTheDocument()
    expect(screen.getByText('Bube (Jack)')).toBeInTheDocument()
    expect(screen.getByText('2 Punkte')).toBeInTheDocument()
  })

  it('displays counting example in the Zähl-Beispiel step', async () => {
    render(
      <TutorialModal>
        <button>Open Tutorial</button>
      </TutorialModal>,
    )

    fireEvent.click(screen.getByText('Open Tutorial'))

    await screen.findByText('Willkommen zum Tutorial')

    // Navigate to counting example step (step 3)
    fireEvent.click(screen.getByText('Weiter'))
    fireEvent.click(screen.getByText('Weiter'))

    await screen.findByText('Zähl-Beispiel')

    expect(screen.getByText(/Beim Zählen addierst du die Punkte/)).toBeInTheDocument()
    expect(screen.getByText('1. Karte: Ass')).toBeInTheDocument()
    expect(screen.getByText('= 11 Punkte')).toBeInTheDocument()
    expect(screen.getByText(/Merke dir immer nur die laufende Summe/)).toBeInTheDocument()
  })

  it('displays gameplay instructions in the Spielablauf step', async () => {
    render(
      <TutorialModal>
        <button>Open Tutorial</button>
      </TutorialModal>,
    )

    fireEvent.click(screen.getByText('Open Tutorial'))

    await screen.findByText('Willkommen zum Tutorial')

    // Navigate to gameplay step (step 4)
    fireEvent.click(screen.getByText('Weiter'))
    fireEvent.click(screen.getByText('Weiter'))
    fireEvent.click(screen.getByText('Weiter'))

    await screen.findByText('Spielablauf')

    expect(screen.getByText('Karte aufdecken')).toBeInTheDocument()
    expect(screen.getByText('Punkte addieren')).toBeInTheDocument()
    expect(screen.getByText('Weiter zählen')).toBeInTheDocument()
    expect(screen.getByText('Ergebnis eingeben')).toBeInTheDocument()
  })

  it('displays tips and tricks in the last step', async () => {
    render(
      <TutorialModal>
        <button>Open Tutorial</button>
      </TutorialModal>,
    )

    fireEvent.click(screen.getByText('Open Tutorial'))

    await screen.findByText('Willkommen zum Tutorial')

    // Navigate to tips step (step 5)
    fireEvent.click(screen.getByText('Weiter'))
    fireEvent.click(screen.getByText('Weiter'))
    fireEvent.click(screen.getByText('Weiter'))
    fireEvent.click(screen.getByText('Weiter'))

    await screen.findByText('Tipps & Tricks')

    expect(screen.getByText(/Strategie-Tipps/)).toBeInTheDocument()
    expect(screen.getByText(/Geschwindigkeits-Tricks/)).toBeInTheDocument()
    expect(screen.getByText(/Punktesystem/)).toBeInTheDocument()
    expect(screen.getByText(/Konzentriere dich auf die laufende Summe/)).toBeInTheDocument()
  })

  it('disables the Weiter button on the last step', async () => {
    render(
      <TutorialModal>
        <button>Open Tutorial</button>
      </TutorialModal>,
    )

    fireEvent.click(screen.getByText('Open Tutorial'))

    await screen.findByText('Willkommen zum Tutorial')

    // Navigate to last step
    fireEvent.click(screen.getByText('Weiter'))
    fireEvent.click(screen.getByText('Weiter'))
    fireEvent.click(screen.getByText('Weiter'))
    fireEvent.click(screen.getByText('Weiter'))

    await screen.findByText('Tipps & Tricks')

    // On the last step, the button text changes to "Fertig" and is disabled
    const finishButton = screen.getByText('Fertig')
    expect(finishButton).toBeDisabled()
  })

  it('shows correct step count text (Schritt X von 5)', async () => {
    render(
      <TutorialModal>
        <button>Open Tutorial</button>
      </TutorialModal>,
    )

    fireEvent.click(screen.getByText('Open Tutorial'))

    await screen.findByText('Willkommen zum Tutorial')
    expect(screen.getByText('Schritt 1 von 5')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Weiter'))
    expect(await screen.findByText('Schritt 2 von 5')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Weiter'))
    expect(await screen.findByText('Schritt 3 von 5')).toBeInTheDocument()
  })

  it('displays progress indicator with correct number of dots', async () => {
    render(
      <TutorialModal>
        <button>Open Tutorial</button>
      </TutorialModal>,
    )

    fireEvent.click(screen.getByText('Open Tutorial'))

    await screen.findByText('Willkommen zum Tutorial')

    // Find the progress indicator container
    const progressIndicators = screen.getByText('Schritt 1 von 5').parentElement?.parentElement?.querySelector('.flex.gap-2.justify-center.py-2')
    expect(progressIndicators?.children.length).toBe(5)
  })

  it('resets to first step when modal is closed and reopened', async () => {
    render(
      <TutorialModal>
        <button>Open Tutorial</button>
      </TutorialModal>,
    )

    // Open modal
    fireEvent.click(screen.getByText('Open Tutorial'))
    await screen.findByText('Willkommen zum Tutorial')

    // Navigate forward
    fireEvent.click(screen.getByText('Weiter'))
    await screen.findByText('Kartenwerte')

    // Close modal using the X button
    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)

    // Wait for modal to close
    await new Promise(resolve => setTimeout(resolve, 100))

    // Reopen modal
    fireEvent.click(screen.getByText('Open Tutorial'))

    // Should be back at first step
    expect(await screen.findByText('Willkommen zum Tutorial')).toBeInTheDocument()
    expect(screen.getByText('Schritt 1 von 5')).toBeInTheDocument()
  })

  it('displays all 5 tutorial steps with correct titles', async () => {
    const expectedTitles = [
      'Willkommen zum Tutorial',
      'Kartenwerte',
      'Zähl-Beispiel',
      'Spielablauf',
      'Tipps & Tricks',
    ]

    render(
      <TutorialModal>
        <button>Open Tutorial</button>
      </TutorialModal>,
    )

    fireEvent.click(screen.getByText('Open Tutorial'))

    // Check each step
    for (let i = 0; i < expectedTitles.length; i++) {
      expect(await screen.findByText(expectedTitles[i])).toBeInTheDocument()

      // Don't click next on last step
      if (i < expectedTitles.length - 1) {
        fireEvent.click(screen.getByText('Weiter'))
      }
    }
  })
})
