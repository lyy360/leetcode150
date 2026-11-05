import { useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { copyText } from '../utils/clipboard'
import './Md.scss'

type Block =
  | { type: 'h2' | 'h3' | 'p' | 'quote'; text: string }
  | { type: 'ul' | 'ol'; items: string[] }
  | { type: 'code'; lines: string[] }

const FENCE = /^\s*(```|~~~)/
const UL = /^[-*]\s+/
const OL = /^\d+[.)]\s+/
const SPECIAL = /^(#{2,3}\s|[-*]\s|\d+[.)]\s|>|\s*(```|~~~))/

function parseBlocks(src: string): Block[] {
  const lines = src.replace(/\r\n/g, '\n').split('\n')
  const blocks: Block[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (FENCE.test(line)) {
      i++
      const codeLines: string[] = []
      while (i < lines.length && !FENCE.test(lines[i])) {
        codeLines.push(lines[i])
        i++
      }
      i++
      blocks.push({ type: 'code', lines: codeLines })
      continue
    }
    if (/^###\s/.test(line)) {
      blocks.push({ type: 'h3', text: line.replace(/^###\s/, '').trim() })
      i++
      continue
    }
    if (/^##\s/.test(line)) {
      blocks.push({ type: 'h2', text: line.replace(/^##\s/, '').trim() })
      i++
      continue
    }
    if (/^>\s?/.test(line)) {
      const buf: string[] = []
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ''))
        i++
      }
      blocks.push({ type: 'quote', text: buf.join(' ') })
      continue
    }
    if (UL.test(line)) {
      const items: string[] = []
      while (i < lines.length && UL.test(lines[i])) {
        items.push(lines[i].replace(UL, ''))
        i++
      }
      blocks.push({ type: 'ul', items })
      continue
    }
    if (OL.test(line)) {
      const items: string[] = []
      while (i < lines.length && OL.test(lines[i])) {
        items.push(lines[i].replace(OL, ''))
        i++
      }
      blocks.push({ type: 'ol', items })
      continue
    }
    if (line.trim() === '') {
      i++
      continue
    }
    const buf = [line]
    i++
    while (i < lines.length && lines[i].trim() !== '' && !SPECIAL.test(lines[i])) {
      buf.push(lines[i])
      i++
    }
    blocks.push({ type: 'p', text: buf.join('') })
  }
  return blocks
}

/** 行内渲染：**加粗** */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean)
  return (
    <>
      {parts.map((p, idx) =>
        p.startsWith('**') && p.endsWith('**') ? (
          <Text key={idx} className='md-b'>
            {p.slice(2, -2)}
          </Text>
        ) : (
          <Text key={idx}>{p}</Text>
        )
      )}
    </>
  )
}

function CodeBlock({ lines, copyable }: { lines: string[]; copyable?: boolean }) {
  const code = lines.join('\n')
  const copy = () => {
    copyText(code)
  }
  return (
    <View className='md-codeblock'>
      <View className='md-codebar'>
        <Text className='md-codelang'>代码</Text>
        {copyable && (
          <Text className='md-copybtn' onClick={copy}>
            复制
          </Text>
        )}
      </View>
      <ScrollView className='md-codescroll' scrollX>
        <Text className='md-codepre'>{code}</Text>
      </ScrollView>
    </View>
  )
}

/**
 * 轻量 markdown 渲染（小程序兼容）：
 * 支持 ## / ### 标题、- 列表、1. 列表、> 引用、**加粗**、``` 或 ~~~ 围栏代码块
 */
export default function Md({ text, codeCopyable = false }: { text: string; codeCopyable?: boolean }) {
  const blocks = useMemo(() => parseBlocks(text), [text])
  return (
    <View className='md'>
      {blocks.map((b, idx) => {
        switch (b.type) {
          case 'h2':
            return (
              <View key={idx} className='md-h2'>
                <Text>{b.text}</Text>
              </View>
            )
          case 'h3':
            return (
              <View key={idx} className='md-h3'>
                <Text>{b.text}</Text>
              </View>
            )
          case 'quote':
            return (
              <View key={idx} className='md-quote'>
                <Inline text={b.text} />
              </View>
            )
          case 'ul':
            return (
              <View key={idx} className='md-list'>
                {b.items.map((it, j) => (
                  <View key={j} className='md-li'>
                    <Text className='md-dot'>•</Text>
                    <View className='md-li-text'>
                      <Inline text={it} />
                    </View>
                  </View>
                ))}
              </View>
            )
          case 'ol':
            return (
              <View key={idx} className='md-list'>
                {b.items.map((it, j) => (
                  <View key={j} className='md-li'>
                    <Text className='md-dot'>{j + 1}.</Text>
                    <View className='md-li-text'>
                      <Inline text={it} />
                    </View>
                  </View>
                ))}
              </View>
            )
          case 'code':
            return <CodeBlock key={idx} lines={b.lines} copyable={codeCopyable} />
          default:
            return (
              <View key={idx} className='md-p'>
                <Inline text={b.text} />
              </View>
            )
        }
      })}
    </View>
  )
}
