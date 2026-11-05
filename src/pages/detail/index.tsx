import { useState, useMemo } from 'react'
import { View, Text, Textarea, Button } from '@tarojs/components'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import questions from '../../data/questions.json'
import { Question, Status, STATUS_TEXT, DIFF_TEXT, DIFF_CLASS } from '../../types'
import { loadProgress, saveProgress, loadNotes, saveNotes } from '../../store'
import './index.scss'

const questionList = questions as Question[]

const STATUS_OPTIONS: Status[] = [0, 1, 2]

export default function Detail() {
  const { params } = useRouter()
  const q = useMemo(() => questionList.find((x) => x.id === params.id), [params.id])
  const [status, setStatus] = useState<Status>(0)
  const [note, setNote] = useState('')

  useDidShow(() => {
    if (!q) return
    setStatus((loadProgress()[q.id] ?? 0) as Status)
    setNote(loadNotes()[q.id] ?? '')
  })

  if (!q) {
    return <View className='detail empty'>题目不存在</View>
  }

  const changeStatus = (s: Status) => {
    setStatus(s)
    const map = loadProgress()
    if (s === 0) {
      delete map[q.id]
    } else {
      map[q.id] = s
    }
    saveProgress(map)
    Taro.showToast({ title: `已标记为「${STATUS_TEXT[s]}」`, icon: 'none' })
  }

  const saveNote = () => {
    const map = loadNotes()
    if (note.trim()) {
      map[q.id] = note
    } else {
      delete map[q.id]
    }
    saveNotes(map)
    Taro.showToast({ title: '笔记已保存', icon: 'success' })
  }

  const openLink = (url: string) => {
    if (process.env.TARO_ENV === 'h5') {
      window.open(url, '_blank')
    } else {
      Taro.setClipboardData({ data: url })
      Taro.showToast({ title: '链接已复制，请在浏览器打开', icon: 'none' })
    }
  }

  const copyLink = (url: string) => {
    Taro.setClipboardData({ data: url })
  }

  return (
    <View className='detail'>
      <View className='card head'>
        <View className='head-title'>
          <Text className='title'>
            {q.num ? `${q.num}. ` : ''}
            {q.title}
          </Text>
          <Text className={`diff ${DIFF_CLASS[q.difficulty]}`}>{DIFF_TEXT[q.difficulty]}</Text>
        </View>
        <View className='tags'>
          <Text className='tag'>{q.category}</Text>
          {q.sub && <Text className='tag'>{q.sub}</Text>}
          <Text className='tag gray'>{q.source === 'lc' ? '力扣' : '卡码网'}</Text>
        </View>
      </View>

      <View className='card'>
        <Text className='card-label'>刷题状态</Text>
        <View className='status-row'>
          {STATUS_OPTIONS.map((s) => (
            <Text
              key={s}
              className={`status-btn s${s} ${status === s ? 'active' : ''}`}
              onClick={() => changeStatus(s)}
            >
              {STATUS_TEXT[s]}
            </Text>
          ))}
        </View>
      </View>

      <View className='card'>
        <Text className='card-label'>相关链接</Text>
        {q.leetcodeUrl && (
          <View className='link-row'>
            <Text className='link' onClick={() => openLink(q.leetcodeUrl!)}>
              {q.source === 'lc' ? '在力扣打开原题 ↗' : '在卡码网打开原题 ↗'}
            </Text>
            <Text className='copy' onClick={() => copyLink(q.leetcodeUrl!)}>复制</Text>
          </View>
        )}
        {q.articleUrl && (
          <View className='link-row'>
            <Text className='link' onClick={() => Taro.navigateTo({ url: `/packages/solution/pages/view/index?id=${q.id}` })}>
              查看题解与解析 →
            </Text>
            <Text className='copy' onClick={() => openLink(q.articleUrl!)}>网页版 ↗</Text>
          </View>
        )}
      </View>

      <View className='card'>
        <Text className='card-label'>刷题笔记</Text>
        <Textarea
          className='note'
          value={note}
          maxlength={-1}
          placeholder='记录思路、易错点、优化解法…'
          onInput={(e) => setNote(e.detail.value)}
        />
        <Button className='save-btn' onClick={saveNote}>
          保存笔记
        </Button>
      </View>
    </View>
  )
}
