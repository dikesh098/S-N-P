import { FloralDivider } from './Ornaments'
import { cn } from '../lib/util'

export default function SectionHeading({
  label, title, align = 'center', dark = false, className = '',
}: { label?: string; title: string; align?: 'center' | 'left'; dark?: boolean; className?: string }) {
  return (
    <div className={cn(align === 'center' ? 'text-center' : 'text-left', className)}>
      {label && (
        <p className={cn('mb-2 text-sm font-medium uppercase tracking-[0.18em]', dark ? 'text-gold-300' : 'text-saffron-600')}>
          {label}
        </p>
      )}
      <h2 className={cn('text-3xl font-semibold sm:text-4xl', dark ? 'text-ivory' : 'text-maroon')}>{title}</h2>
      <div className={cn('mt-4', align === 'center' ? 'flex justify-center' : '')}>
        <FloralDivider className={dark ? 'text-gold-300' : 'text-gold'} />
      </div>
    </div>
  )
}
