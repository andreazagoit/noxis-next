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
import { CheckFlow } from '@/components/check/check-flow'

const CheckDialogContext = createContext<{ openCheck: () => void } | null>(null)

export function useCheckDialog() {
  const ctx = useContext(CheckDialogContext)
  if (!ctx) throw new Error('useCheckDialog must be used within CheckDialogProvider')
  return ctx
}

/** Provider globale: qualsiasi CTA apre il check in un dialog invece che in
    una pagina dedicata. Il flow viene rimontato a ogni apertura (key). */
export function CheckDialogProvider({ children }: { children: ReactNode }) {
  const t = useTranslations()
  const [open, setOpen] = useState(false)
  const [session, setSession] = useState(0)

  const openCheck = useCallback(() => {
    setSession((s) => s + 1)
    setOpen(true)
  }, [])

  return (
    <CheckDialogContext.Provider value={{ openCheck }}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          data-lenis-prevent
          className="max-w-2xl max-h-[85vh] overflow-y-auto border-white/10 bg-background p-6 md:p-8"
        >
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl md:text-2xl font-semibold tracking-tight">
              {t('check.title_line1')}{' '}
              <span className="text-primary">{t('check.title_line2')}</span>
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed">
              {t('check.description')}
            </DialogDescription>
          </DialogHeader>
          <CheckFlow key={session} />
        </DialogContent>
      </Dialog>
    </CheckDialogContext.Provider>
  )
}
