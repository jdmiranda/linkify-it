#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Simple performance benchmark for linkify-it optimizations
 */

import LinkifyIt from './index.mjs'

const linkify = new LinkifyIt()

// Test data generators
function generateText (size, linkDensity) {
  const words = [
    'the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog',
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing'
  ]

  const links = [
    'https://example.com',
    'http://test.org/path',
    'www.github.com',
    'user@example.com'
  ]

  let text = ''
  let wordCount = 0
  const targetWords = Math.floor(size / 6)
  const linkInterval = linkDensity > 0 ? Math.floor(1 / linkDensity) : Infinity

  while (wordCount < targetWords) {
    if (linkDensity > 0 && wordCount % linkInterval === 0 && wordCount > 0) {
      text += ' ' + links[Math.floor(Math.random() * links.length)]
    } else {
      text += ' ' + words[Math.floor(Math.random() * words.length)]
    }
    wordCount++
  }
  return text.trim()
}

// Benchmark function
function benchmark (name, text, iterations = 10000) {
  const start = Date.now()
  for (let i = 0; i < iterations; i++) {
    linkify.match(text)
  }
  const end = Date.now()
  const duration = end - start
  const opsPerSec = Math.floor((iterations / duration) * 1000)
  const msPerOp = (duration / iterations).toFixed(4)

  console.log(`${name}:`)
  console.log(`  Size: ${text.length} bytes`)
  console.log(`  Iterations: ${iterations.toLocaleString()}`)
  console.log(`  Duration: ${duration}ms`)
  console.log(`  Performance: ${opsPerSec.toLocaleString()} ops/sec`)
  console.log(`  Average: ${msPerOp} ms/op`)
  console.log()
}

console.log('='.repeat(80))
console.log('Linkify-It Performance Benchmark')
console.log('='.repeat(80))
console.log()

// Run benchmarks
benchmark('Small text (100 bytes, 0% links)', generateText(100, 0), 50000)
benchmark('Small text (100 bytes, 10% links)', generateText(100, 0.1), 50000)
benchmark('Small text (100 bytes, 50% links)', generateText(100, 0.5), 50000)

benchmark('Medium text (1KB, 0% links)', generateText(1024, 0), 20000)
benchmark('Medium text (1KB, 10% links)', generateText(1024, 0.1), 20000)
benchmark('Medium text (1KB, 50% links)', generateText(1024, 0.5), 20000)

benchmark('Large text (10KB, 0% links)', generateText(10240, 0), 2000)
benchmark('Large text (10KB, 10% links)', generateText(10240, 0.1), 2000)
benchmark('Large text (10KB, 50% links)', generateText(10240, 0.5), 2000)

benchmark('URL-heavy content', 'Visit https://example.com or http://test.org and check www.github.com for updates. Email us at contact@example.com', 50000)

benchmark('Plain text (no URLs)', 'The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet consectetur adipiscing elit.', 50000)

console.log('='.repeat(80))
console.log('Benchmark Complete')
console.log('='.repeat(80))
