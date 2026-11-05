import { useState, useMemo } from 'react'
import { View, Text } from '@tarojs/components'
import { useDidShow } from '@tarojs/taro'
import questions from '../../data/questions.json'
import { Question, Status, DIFF_TEXT } from '../../types'
import { loadProgress, ProgressMap } from '../../store'
import './index.scss'

const questionList = questions as Question[]

export default function Stats() {
  const [progress, setProgress] = useState<ProgressMap>({})

  useDidShow(() => {
    setProgress(loadProgress())
  })

  const data = useMemo(() => {
    const total = questionList.length
    let done = 0
    let redo = 0
    const catMap = new Map<string, { total: number; done: number; order: number }>()
    const diffMap: Record<number, { total: number; done: number }> = {
      1: { total: 0, done: 0 },
      2: { total: 0, done: 0 },
      3: { total: 0, done: 0 }
    }
    for (const q of questionList) {
      const st = (progress[q.id] ?? 0) as Status
      if (st >= 1) done++
      if (st === 2) redo++
      const c = catMap.get(q.category)
      if (c) {
        c.total++
        if (st >= 1) c.done++
        c.order = Math.min(c.order, q.order)
      } else {
        catMap.set(q.category, { total: 1, done: st >= 1 ? 1 : 0, order: q.order })
      }
      const d = diffMap[q.difficulty]
      if (d) {
        d.total++
        if (st >= 1) d.done++
      }
    }
    const cats = [...catMap.entries()]
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => a.order - b.order)
    return { total, done, redo, cats, diffs: Object.entries(diffMap).map(([k, v]) => ({ key: Number(k), ...v })) }
  }, [progress])

  const percent = data.total ? Math.round((data.done / data.total) * 100) : 0

  return (
    <View className='stats'>
      <View className='card overview'>
        <View className='percent-row'>
          <Text className='percent'>{percent}%</Text>
          <View className='nums'>
            <Text className='num-line'>已刷 {data.done} / {data.total} 题</Text>
            <Text className='num-line redo'>重刷 {data.redo} 题</Text>
          </View>
        </View>
        <View className='bar'>
          <View className='bar-inner' style={{ width: `${percent}%` }} />
        </View>
      </View>

      <View className='card'>
        <Text className='card-label'>难度分布</Text>
        {data.diffs.map((d) => (
          <View key={d.key} className='diff-row'>
            <Text className={`diff-name d${d.key}`}>{DIFF_TEXT[d.key]}</Text>
            <View className='diff-bar'>
              <View
                className={`diff-bar-inner d${d.key}`}
                style={{ width: `${d.total ? (d.done / d.total) * 100 : 0}%` }}
              />
            </View>
            <Text className='diff-count'>{d.done}/{d.total}</Text>
          </View>
        ))}
      </View>

      <View className='card'>
        <Text className='card-label'>分类进度</Text>
        {data.cats.map((c) => {
          const p = c.total ? Math.round((c.done / c.total) * 100) : 0
          return (
            <View key={c.name} className='cat-row'>
              <View className='cat-head'>
                <Text className='cat-name'>{c.name}</Text>
                <Text className='cat-count'>{c.done}/{c.total} · {p}%</Text>
              </View>
              <View className='cat-bar'>
                <View className='cat-bar-inner' style={{ width: `${p}%` }} />
              </View>
            </View>
          )
        })}
      </View>
    </View>
  )
}
