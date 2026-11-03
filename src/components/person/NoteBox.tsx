import { useState, useEffect } from 'react'
import type { Person } from '../../types'
import { Card } from '../ui'
import { useArchive, archiveStore } from '../../lib/store'

/** 人物页本地 Markdown 笔记，自动保存到 localStorage */
export default function NoteBox({ person }: { person: Person }) {
  const archive = useArchive()
  const saved = archive.notes[person.slug]
  const [text, setText] = useState(saved?.markdown ?? '')
  const [savedAt, setSavedAt] = useState<string | undefined>(saved?.updatedAt)

  useEffect(() => {
    setText(saved?.markdown ?? '')
    setSavedAt(saved?.updatedAt)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [person.slug])

  const dirty = text !== (saved?.markdown ?? '')

  const save = () => {
    if (!text.trim()) {
      archiveStore.deleteNote(person.slug)
    } else {
      archiveStore.saveNote(person.slug, text)
    }
    setSavedAt(new Date().toISOString())
  }

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-bold">我的阅读笔记（Markdown，本地保存）</h3>
        <div className="flex items-center gap-2">
          {dirty && <span className="text-xs text-rose-500">未保存</span>}
          {savedAt && !dirty && (
            <span className="text-xs text-muted">
              已保存 {new Date(savedAt).toLocaleString('zh-CN', { hour12: false })}
            </span>
          )}
          <button className="btn btn-primary px-3 py-1.5 text-xs" onClick={save}>
            保存
          </button>
        </div>
      </div>
      <textarea
        className="input mt-3 min-h-[220px] font-mono text-sm leading-relaxed"
        placeholder={`## ${person.name} 给我的三个启发\n\n1. \n2. \n3. \n\n> 可在"我的档案"中导出为 Markdown（兼容 Obsidian）。`}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={save}
        aria-label="人物笔记"
      />
    </Card>
  )
}
