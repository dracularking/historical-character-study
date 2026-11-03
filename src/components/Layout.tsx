import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useArchive } from '../lib/store'

const navItems = [
  { to: '/explore', label: '人物探索' },
  { to: '/traits', label: '品质图谱' },
  { to: '/compare', label: '人物对比' },
  { to: '/simulator', label: '决策模拟' },
  { to: '/training', label: '训练中心' },
  { to: '/archive', label: '我的档案' },
]

function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('hcl-theme')
    return saved === 'light' ? 'light' : 'dark'
  })
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('hcl-theme', theme)
  }, [theme])
  return { theme, toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) }
}

export default function Layout({ children }: { children: ReactNode }) {
  const { theme, toggle } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const archive = useArchive()
  const location = useLocation()
  useEffect(() => setMenuOpen(false), [location.pathname])

  const archiveCount =
    archive.favoritePeople.length +
    archive.comparisons.length +
    archive.simulations.length +
    Object.keys(archive.training).length

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-app bg-app/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-stage items-center gap-4 px-4">
          <Link to="/" className="flex items-center gap-2 font-serif text-base font-bold whitespace-nowrap">
            <span className="text-xl" aria-hidden>
              🏛️
            </span>
            <span className="hidden sm:inline">历史人物人格实验室</span>
            <span className="sm:hidden">人格实验室</span>
          </Link>

          <nav className="hidden flex-1 items-center gap-1 md:flex" aria-label="主导航">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-1.5 text-sm transition-colors ${
                    isActive ? 'bg-accent-soft accent font-medium' : 'text-muted hover:text-[var(--text)]'
                  }`
                }
              >
                {item.label}
                {item.to === '/archive' && archiveCount > 0 && (
                  <span className="ml-1 rounded-full bg-[var(--accent)] px-1.5 text-[10px] text-black">
                    {archiveCount}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <button
              onClick={toggle}
              className="rounded-lg p-2 text-muted hover:text-[var(--text)]"
              aria-label={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button
              className="rounded-lg p-2 text-muted md:hidden"
              aria-label="打开菜单"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="border-t border-app px-4 py-2 md:hidden" aria-label="移动导航">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2.5 text-sm ${isActive ? 'bg-accent-soft accent' : 'text-muted'}`
                }
              >
                {item.label}
                {item.to === '/archive' && archiveCount > 0 && (
                  <span className="ml-2 rounded-full bg-[var(--accent)] px-1.5 text-[10px] text-black">
                    {archiveCount}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-stage px-4 py-6 md:py-8">{children}</main>

      <footer className="mt-16 border-t border-app">
        <div className="mx-auto grid max-w-stage gap-6 px-4 py-10 text-sm text-muted md:grid-cols-3">
          <div>
            <p className="font-serif text-base font-bold text-[var(--text)]">以历史为镜，认识人性，修炼自己。</p>
            <p className="mt-2 leading-relaxed">
              研究历史人物的优势、弱点、重大决策与人生结果，把历史经验转化为可实践的智慧。不神化，不审判，重机制，重证据。
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Link to="/sources" className="hover:accent">史料与证据中心</Link>
            <Link to="/topics/failure" className="hover:accent">专题：伟人为什么失败？</Link>
            <Link to="/about" className="hover:accent">方法论与产品说明</Link>
          </div>
          <div className="leading-relaxed">
            <p>证据分级 A/B/C/D 为本产品内部透明评估框架，非学界统一标准。</p>
            <p className="mt-2">反事实分析均明确标注为推测；不对历史人物做现代精神疾病诊断。</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
