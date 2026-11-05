import { useState, useMemo } from 'react'
import { View, Text } from '@tarojs/components'
import { useRouter } from '@tarojs/taro'
import questions from '../../../../data/questions.json'
import { Question, DIFF_TEXT, DIFF_CLASS } from '../../../../types'
import { getSolution } from '../../data'
import Md from '../../components/Md'
import { copyText } from '../../utils/clipboard'
import './index.scss'

const questionList = questions as Question[]

export default function SolutionPage() {
  const { params } = useRouter()
  const q = useMemo(() => questionList.find((x) => x.id === params.id), [params.id])
  const sol = useMemo(() => (q ? getSolution(q.id) : null), [q])
  const [copied, setCopied] = useState(false)

  if (!q) {
    return <View className='sol empty'>题目不存在</View>
  }

  const openLink = (url: string) => {
    if (process.env.TARO_ENV === 'h5') {
      window.open(url, '_blank')
    } else {
      copyText(url, '链接已复制，请在浏览器打开')
    }
  }

  const copyCode = () => {
    if (!sol) return
    copyText(sol.code, '代码已复制', () => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <View className='sol'>
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

      {sol ? (
        <>
          <View className='card'>
            <View className='sec-head'>
              <Text className='sec-title'>题目描述</Text>
            </View>
            <Md text={sol.desc} />
          </View>

          <View className='card'>
            <View className='sec-head'>
              <Text className='sec-title'>思路解析</Text>
            </View>
            <Md text={sol.analysis} />
          </View>

          <View className='card code-card'>
            <View className='sec-head'>
              <Text className='sec-title'>TypeScript 代码</Text>
              <Text className={`copy-all ${copied ? 'ok' : ''}`} onClick={copyCode}>
                {copied ? '已复制' : '复制全部'}
              </Text>
            </View>
            <Md text={'~~~\n' + sol.code + '\n~~~'} codeCopyable />
          </View>
        </>
      ) : (
        <View className='card'>
          <Text className='missing'>题解整理中，敬请期待…</Text>
        </View>
      )}

      <View className='card'>
        <Text className='sec-title'>外部链接</Text>
        {q.articleUrl && (
          <View className='link-row' onClick={() => openLink(q.articleUrl!)}>
            <Text className='link'>网页版完整题解 ↗</Text>
            <Text className='link-arrow'>代码随想录</Text>
          </View>
        )}
        {q.leetcodeUrl && (
          <View className='link-row' onClick={() => openLink(q.leetcodeUrl!)}>
            <Text className='link'>{q.source === 'lc' ? '在力扣打开原题 ↗' : '在卡码网打开原题 ↗'}</Text>
            <Text className='link-arrow'>在线作答</Text>
          </View>
        )}
      </View>
    </View>
  )
}
