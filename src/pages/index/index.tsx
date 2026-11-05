import { useState, useMemo, useCallback } from 'react'
import { View, Text, Input } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import questions from '../../data/questions.json'
import { Question, Status, STATUS_TEXT, DIFF_TEXT, DIFF_CLASS } from '../../types'
import { loadProgress, ProgressMap } from '../../store'
import './index.scss'

const questionList = questions as Question[]

const FILTERS: { key: 'all' | Status; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 0, label: '未刷' },
  { key: 1, label: '已刷' },
  { key: 2, label: '重刷' }
]

const SORTS: { key: 'category' | 'difficulty'; label: string }[] = [
  { key: 'category', label: '按分类' },
  { key: 'difficulty', label: '按难度' }
]

export default function Index() {
  const [keyword, setKeyword] = useState('')
  const [filter, setFilter] = useState<'all' | Status>('all')
  const [sortBy, setSortBy] = useState<'category' | 'difficulty'>('category')
  const [progress, setProgress] = useState<ProgressMap>({})

  useDidShow(() => {
    setProgress(loadProgress())
  })

  const groups = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    const filtered = questionList.filter((q) => {
      const st = progress[q.id] ?? 0
      if (filter !== 'all' && st !== filter) return false
      if (kw && !q.title.toLowerCase().includes(kw) && !q.num.includes(kw)) return false
      return true
    })
    if (sortBy === 'difficulty') {
      return [1, 2, 3]
        .map((d) => ({
          name: DIFF_TEXT[d],
          diff: DIFF_CLASS[d] as string | undefined,
          list: filtered.filter((q) => q.difficulty === d).sort((a, b) => a.order - b.order)
        }))
        .filter((g) => g.list.length > 0)
    }
    const map = new Map<string, Question[]>()
    for (const q of filtered) {
      const key = q.sub ? `${q.category} · ${q.sub}` : q.category
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(q)
    }
    return [...map.entries()]
      .map(([name, list]) => ({
        name,
        diff: undefined,
        list: list.sort((a, b) => a.order - b.order)
      }))
      .sort((a, b) => a.list[0].order - b.list[0].order)
  }, [keyword, filter, progress, sortBy])

  const doneCount = useMemo(
    () => questionList.filter((q) => (progress[q.id] ?? 0) >= 1).length,
    [progress]
  )

  const goDetail = useCallback((id: string) => {
    Taro.navigateTo({ url: `/pages/detail/index?id=${id}` })
  }, [])

  return (
    <View className='page'>
      <View className='summary'>
        <Text className='summary-num'>{doneCount}</Text>
        <Text className='summary-total'> / {questionList.length} 已刷</Text>
        <View className='summary-bar'>
          <View
            className='summary-bar-inner'
            style={{ width: `${questionList.length ? (doneCount / questionList.length) * 100 : 0}%` }}
          />
        </View>
      </View>

      <View className='search-wrap'>
        <Text className='search-prefix'>🔍</Text>
        <Input
          className='search'
          type='text'
          placeholder='搜索题号或题目名称'
          placeholderStyle='color: #5b6478'
          value={keyword}
          onInput={(e) => setKeyword(e.detail.value)}
        />
      </View>

      <View className='seg'>
        {FILTERS.map((f) => (
          <Text
            key={String(f.key)}
            className={`seg-item ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </Text>
        ))}
      </View>

      <View className='sort-row'>
        <Text className='sort-label'>排序</Text>
        <View className='sort-tabs'>
          {SORTS.map((s) => (
            <Text
              key={s.key}
              className={`sort-item ${sortBy === s.key ? 'active' : ''}`}
              onClick={() => setSortBy(s.key)}
            >
              {s.label}
            </Text>
          ))}
        </View>
      </View>

      {groups.map((g) => (
        <View key={g.name} className='group'>
          <View className='group-title'>
            <Text className={`group-name ${g.diff ?? ''}`}>{g.name}</Text>
            <Text className='group-count'>{g.list.length} 题</Text>
          </View>
          {g.list.map((q) => {
            const st = (progress[q.id] ?? 0) as Status
            return (
              <View key={q.id} className={`item st-${st}`} onClick={() => goDetail(q.id)}>
                <View className='item-main'>
                  <Text className='item-title'>
                    {q.num ? `${q.num}. ` : ''}
                    {q.title}
                  </Text>
                  <Text className={`diff ${DIFF_CLASS[q.difficulty]}`}>{DIFF_TEXT[q.difficulty]}</Text>
                </View>
                <Text className={`status s${st}`}>{STATUS_TEXT[st]}</Text>
              </View>
            )
          })}
        </View>
      ))}

      {groups.length === 0 && <View className='empty'>没有符合条件的题目</View>}
    </View>
  )
}
