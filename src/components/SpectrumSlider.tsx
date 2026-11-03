import { useState } from 'react'
import type { TraitSpectrum } from '../types'
import { EvidenceRefs } from './Evidence'
import { Disclaimer } from './ui'

/**
 * 模块 D：双刃剑特质强度滑块。
 * 0–33 不足 / 34–66 合理 / 67–100 过度。
 * 启发式模型，明确声明非心理测量。
 */
export default function SpectrumSlider({ spectrum }: { spectrum: TraitSpectrum }) {
  const [situationIdx, setSituationIdx] = useState(0)
  const [value, setValue] = useState(50)
  const situation = spectrum.situations[situationIdx]

  const zone = value <= 33 ? 'deficient' : value <= 66 ? 'balanced' : 'excessive'
  const zoneText =
    zone === 'deficient'
      ? { title: '不足', text: situation.deficient, color: 'text-sky-500' }
      : zone === 'balanced'
        ? { title: '合理区间', text: situation.balanced, color: 'accent' }
        : { title: '过度', text: situation.excessive, color: 'text-rose-500' }

  const trackGradient =
    'linear-gradient(to right, #3b82f6 0%, #3b82f6 33%, #c2a36b 34%, #c2a36b 66%, #e11d48 67%, #e11d48 100%)'

  return (
    <div className="rounded-xl border border-app p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-bold">{spectrum.name}</h3>
        <div className="flex gap-1.5">
          {spectrum.situations.map((s, i) => (
            <button
              key={i}
              onClick={() => setSituationIdx(i)}
              className={`rounded-lg px-3 py-1 text-xs ${
                i === situationIdx ? 'bg-accent-soft accent font-medium' : 'text-muted hover:text-[var(--text)]'
              }`}
            >
              情境{i + 1}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted">情境：{situation.situation}</p>
      <p className="mt-2 text-sm italic">“{spectrum.thesis}”</p>

      <div className="mt-6">
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="trait-slider"
          style={{ background: trackGradient }}
          aria-label={`${spectrum.name}强度滑块`}
          aria-valuetext={`${value}，${zoneText.title}`}
        />
        <div className="mt-1 flex justify-between text-[11px] text-muted">
          <span>不足（怯懦/缺位）</span>
          <span>合理</span>
          <span>过度（失控）</span>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-app p-4" style={{ background: 'var(--bg)' }}>
        <div className={`text-sm font-bold ${zoneText.color}`}>
          强度 {value} · {zoneText.title}
        </div>
        <p className="mt-2 text-sm leading-relaxed">{zoneText.text}</p>
      </div>

      <div className="mt-4">
        <Disclaimer>
          这是帮助理解"特质强度随情境变化"的启发式模型，不是经过心理测量验证的量表，不构成对你个人特质的测量结论。
        </Disclaimer>
        <EvidenceRefs evidence={spectrum.evidence} />
      </div>
    </div>
  )
}
