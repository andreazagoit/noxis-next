import { redirect } from 'next/navigation'

// La pagina Development è stata assorbita dalla landing; il path resta
// come deep-link stabile per vecchi link e segnalibri.
export default function DevelopmentPage() {
  redirect('/#servizi')
}
