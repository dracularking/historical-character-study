// 手写轻量 SVG 图表：雷达图与分数条（无第三方依赖，便于标注免责声明）

export type RadarSeries = {
  name: string
  color: string
  values: { dim: string; score: number }[]
}

export function RadarChart({
  series,
  size = 460,
}: {
  series: RadarSeries[]
  size?: number
}) {
  const dims = series[0]?.values.map((v) => v.dim) ?? []
  const n = dims.length
  const cx = size / 2
  const cy = size / 2
  const radius = size / 2 - 96
  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2

  const point = (i: number, r: number) => [cx + Math.cos(angle(i)) * r, cy + Math.sin(angle(i)) * r]

  const rings = [1, 2, 3, 4, 5]

  return (
    <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label="人格维度雷达图（启发式评分）" className="w-full">
      {rings.map((ring) => {
        const pts = dims.map((_, i) => point(i, (radius * ring) / 5).join(',')).join(' ')
        return <polygon key={ring} points={pts} fill="none" stroke="var(--border)" strokeWidth={1} />
      })}
      {dims.map((dim, i) => {
        const [x, y] = point(i, radius)
        const [lx, ly] = point(i, radius + 18)
        return (
          <g key={dim}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke="var(--border)" strokeWidth={1} />
            <text
              x={lx}
              y={ly}
              textAnchor={Math.abs(lx - cx) < 20 ? 'middle' : lx > cx ? 'start' : 'end'}
              dominantBaseline="middle"
              fontSize="12"
              fill="var(--text-muted)"
            >
              {dim}
            </text>
          </g>
        )
      })}
      {series.map((s, si) => {
        const pts = s.values.map((v, i) => point(i, (radius * v.score) / 5).join(',')).join(' ')
        return (
          <g key={si}>
            <polygon points={pts} fill={s.color} fillOpacity={0.15} stroke={s.color} strokeWidth={2} />
            {s.values.map((v, i) => {
              const [x, y] = point(i, (radius * v.score) / 5)
              return <circle key={i} cx={x} cy={y} r={3} fill={s.color} />
            })}
          </g>
        )
      })}
    </svg>
  )
}

export function ScoreBar({ score, color = 'var(--accent)' }: { score: number; color?: string }) {
  return (
    <div className="flex items-center gap-1" aria-label={`评分 ${score} / 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className="h-2 w-5 rounded-sm"
          style={{ background: i <= score ? color : 'var(--border)' }}
        />
      ))}
    </div>
  )
}

export function Legend({ items }: { items: { name: string; color: string }[] }) {
  return (
    <div className="flex flex-wrap gap-4 text-xs text-muted">
      {items.map((it) => (
        <span key={it.name} className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm" style={{ background: it.color }} />
          {it.name}
        </span>
      ))}
    </div>
  )
}
