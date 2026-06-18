'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ContactForm } from '@/components/contact/contact-form'
import type { LeadOffer } from '@/lib/models/lead/config'

const ContactDialogContext = createContext<{ openContact: (offer: LeadOffer) => void } | null>(null)

export function useContactDialog() {
  const ctx = useContext(ContactDialogContext)
  if (!ctx) throw new Error('useContactDialog must be used within ContactDialogProvider')
  return ctx
}

/** Provider globale: il "Parliamone" delle card apre il form contestuale
    all'offerta in un dialog. Il form viene rimontato a ogni apertura (key). */
export function ContactDialogProvider({ children }: { children: ReactNode }) {
  const t = useTranslations()
  const [open, setOpen] = useState(false)
  const [offer, setOffer] = useState<LeadOffer>('automation')
  const [session, setSession] = useState(0)

  const openContact = useCallback((nextOffer: LeadOffer) => {
    setOffer(nextOffer)
    setSession((s) => s + 1)
    setOpen(true)
  }, [])

  return (
    <ContactDialogContext.Provider value={{ openContact }}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          data-lenis-prevent
          className="max-w-xl max-h-[85vh] overflow-y-auto border-white/10 bg-background p-6 md:p-8"
        >
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl md:text-2xl font-semibold tracking-tight">
              {t('contact.title')}{' '}
              <span className="text-primary">{t(`pricing.${offer}.name`)}</span>
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed">
              {t(`contact.subtitle_${offer}`)}
            </DialogDescription>
          </DialogHeader>
          <ContactForm key={session} offer={offer} />
        </DialogContent>
      </Dialog>
    </ContactDialogContext.Provider>
  )
}
