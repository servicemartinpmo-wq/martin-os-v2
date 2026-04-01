'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { fadeScaleFast } from '@/motion/presets'

/**
 * Bento Grid Component
 * Editorial grid layout with flexible card sizes
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Grid items
 * @param {number} props.columns - Number of columns
 * @param {string} props.gap - Gap between cards
 * @param {string} props.className - Additional classes
 */
export default function BentoGrid({
  children,
  columns = 3,
  gap = 'md',
  className = '',
}) {
  const gapSizes = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  }

  return (
    <div
      className={cn(
        'layout-bento__grid',
        'grid',
        gapSizes[gap] || gapSizes.md,
        className
      )}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {children}
    </div>
  )
}

/**
 * Bento Card Component
 * Individual card in the bento grid
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.size - Card size ('small' | 'medium' | 'large' | 'full')
 * @param {boolean} props.large - Span 2 columns
 * @param {boolean} props.tall - Span 2 rows
 * @param {boolean} props.featured - Span 2 columns and 2 rows
 * @param {string} props.title - Card title
 * @param {React.ReactNode} props.icon - Card icon
 * @param {string} props.color - Accent color
 * @param {function} props.onClick - Click handler
 * @param {string} props.className - Additional classes
 */
export function BentoCard({
  children,
  size = 'medium',
  large = false,
  tall = false,
  featured = false,
  title,
  icon,
  color,
  onClick,
  className = '',
}) {
  const sizeClasses = {
    small: 'min-h-[12rem]',
    medium: 'min-h-[16rem]',
    large: 'min-h-[20rem]',
    full: 'min-h-[24rem]',
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'bento-card',
        'glass-panel chrome-edge',
        'relative overflow-hidden',
        'cursor-pointer',
        sizeClasses[size] || sizeClasses.medium,
        large && 'bento-card--large',
        tall && 'bento-card--tall',
        featured && 'bento-card--featured',
        onClick && 'hover:shadow-xl',
        className
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={fadeScaleFast}
    >
      {/* Accent gradient background */}
      {color && (
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${color} 0%, transparent 100%)`,
          }}
        />
      )}

      {/* Header */}
      {(title || icon) && (
        <div className="flex items-center gap-2 mb-4">
          {icon && (
            <div
              className="p-2 rounded-lg"
              style={{ background: color ? `${color}20` : 'var(--bg-subtle)' }}
            >
              {icon}
            </div>
          )}
          {title && (
            <h3 className="font-display font-semibold text-lg">{title}</h3>
          )}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none bento-card__glow" />
    </motion.div>
  )
}

/**
 * Bento Card with Metric
 * Pre-styled card for displaying metrics
 *
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Metric value
 * @param {string} props.trend - Trend indicator
 * @param {boolean} props.trendPositive - Is trend positive
 * @param {React.ReactNode} props.icon - Card icon
 * @param {string} props.color - Accent color
 * @param {string} props.size - Card size
 */
export function BentoMetricCard({
  title,
  value,
  trend,
  trendPositive = true,
  icon,
  color = 'var(--accent)',
  size = 'medium',
}) {
  return (
    <BentoCard title={title} icon={icon} color={color} size={size}>
      <div className="space-y-2">
        <div className="text-4xl font-bold" style={{ color }}>
          {value}
        </div>
        {trend && (
          <div
            className={cn(
              'text-sm font-medium',
              trendPositive ? 'text-[var(--success)]' : 'text-[var(--error)]'
            )}
          >
            {trend}
          </div>
        )}
        <div className="text-sm text-[var(--text-muted)]">
          Updated just now
        </div>
      </div>
    </BentoCard>
  )
}

/**
 * Bento Card with Chart
 * Pre-styled card for displaying charts
 *
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {React.ReactNode} props.chart - Chart component
 * @param {React.ReactNode} props.icon - Card icon
 * @param {string} props.color - Accent color
 * @param {boolean} props.featured - Is featured card
 */
export function BentoChartCard({
  title,
  chart,
  icon,
  color = 'var(--accent)',
  featured = false,
}) {
  return (
    <BentoCard
      title={title}
      icon={icon}
      color={color}
      featured={featured}
      size={featured ? 'large' : 'medium'}
    >
      <div className="h-full min-h-[200px]">{chart}</div>
    </BentoCard>
  )
}

/**
 * Bento Card with List
 * Pre-styled card for displaying lists
 *
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {Array} props.items - List items
 * @param {React.ReactNode} props.icon - Card icon
 * @param {string} props.color - Accent color
 * @param {string} props.size - Card size
 */
export function BentoListCard({
  title,
  items = [],
  icon,
  color = 'var(--accent)',
  size = 'medium',
}) {
  return (
    <BentoCard title={title} icon={icon} color={color} size={size}>
      <div className="space-y-3">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-[var(--bg-subtle)] transition-colors"
          >
            <div
              className="w-2 h-2 rounded-full mt-2"
              style={{ background: item.color || color }}
            />
            <div className="flex-1">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-[var(--text-muted)]">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </BentoCard>
  )
}

/**
 * Bento Card with Action
 * Pre-styled card for displaying actions
 *
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {string} props.description - Card description
 * @param {string} props.buttonText - Button text
 * @param {function} props.onAction - Action handler
 * @param {React.ReactNode} props.icon - Card icon
 * @param {string} props.color - Accent color
 * @param {string} props.size - Card size
 */
export function BentoActionCard({
  title,
  description,
  buttonText,
  onAction,
  icon,
  color = 'var(--accent)',
  size = 'medium',
}) {
  return (
    <BentoCard title={title} icon={icon} color={color} size={size}>
      <div className="space-y-4">
        <p className="text-sm text-[var(--text-muted)]">{description}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors"
          style={{
            background: color,
            color: 'var(--text-on-accent)',
          }}
        >
          {buttonText}
        </motion.button>
      </div>
    </BentoCard>
  )
}
