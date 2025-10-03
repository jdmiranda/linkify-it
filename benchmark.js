#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Comprehensive benchmark for linkify-it performance optimizations
 * Tests link detection ops/sec across different text sizes and link densities
 */

import LinkifyIt from './index.mjs'
import Benchmark from 'benchmark'

const linkify = new LinkifyIt()

// Test data generators
function generateText (size, linkDensity) {
  const words = [
    'the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog',
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing',
    'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore'
  ]

  const links = [
    'https://example.com',
    'http://test.org/path/to/resource',
    'www.github.com',
    'example.org/api/v1/endpoint',
    'user@example.com',
    'https://subdomain.domain.co.uk/path?query=value',
    'ftp://files.server.net/download',
    '//protocol-relative.com'
  ]

  let text = ''
  let wordCount = 0
  const targetWords = Math.floor(size / 6) // Approximate words for target size

  const linkInterval = linkDensity > 0 ? Math.floor(1 / linkDensity) : Infinity

  while (wordCount < targetWords) {
    // Add link based on density
    if (linkDensity > 0 && wordCount % linkInterval === 0 && wordCount > 0) {
      text += ' ' + links[Math.floor(Math.random() * links.length)]
    } else {
      text += ' ' + words[Math.floor(Math.random() * words.length)]
    }
    wordCount++
  }

  return text.trim()
}

// Benchmark configurations
const configs = [
  // Small text, no links
  { name: 'Small text (100 bytes, 0% links)', text: generateText(100, 0) },

  // Small text, 10% links
  { name: 'Small text (100 bytes, 10% links)', text: generateText(100, 0.1) },

  // Small text, 50% links
  { name: 'Small text (100 bytes, 50% links)', text: generateText(100, 0.5) },

  // Medium text, no links
  { name: 'Medium text (1KB, 0% links)', text: generateText(1024, 0) },

  // Medium text, 10% links
  { name: 'Medium text (1KB, 10% links)', text: generateText(1024, 0.1) },

  // Medium text, 50% links
  { name: 'Medium text (1KB, 50% links)', text: generateText(1024, 0.5) },

  // Large text, no links
  { name: 'Large text (10KB, 0% links)', text: generateText(10240, 0) },

  // Large text, 10% links
  { name: 'Large text (10KB, 10% links)', text: generateText(10240, 0.1) },

  // Large text, 50% links
  { name: 'Large text (10KB, 50% links)', text: generateText(10240, 0.5) },

  // Very large text, 10% links
  { name: 'Very large text (50KB, 10% links)', text: generateText(51200, 0.1) },

  // Specific test cases
  { name: 'URL-heavy content', text: 'Visit https://example.com or http://test.org and check www.github.com for updates. Email us at contact@example.com' },

  { name: 'Plain text (no URLs)', text: 'The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet consectetur adipiscing elit.' },

  { name: 'Mixed protocols', text: 'https://secure.example.com http://legacy.site.org ftp://files.server.net //cdn.example.com mailto:user@example.com' },

  { name: 'Email-heavy content', text: 'Contact john@example.com, mary@test.org, support@company.co.uk, admin@domain.net for more information' }
]

console.log('='.repeat(80))
console.log('Linkify-It Performance Benchmark')
console.log('='.repeat(80))
console.log()

// Run benchmarks
configs.forEach(config => {
  const suite = new Benchmark.Suite()

  suite
    .add(config.name, function () {
      linkify.match(config.text)
    })
    .on('cycle', function (event) {
      console.log(String(event.target))
      console.log(`  Text size: ${config.text.length} bytes`)
      const opsPerSec = event.target.hz
      const msPerOp = 1000 / opsPerSec
      console.log(`  Performance: ${opsPerSec.toFixed(0)} ops/sec, ${msPerOp.toFixed(3)} ms/op`)
      console.log()
    })
    .on('error', function (event) {
      console.error('Error in benchmark:', event.target.error)
    })
    .run()
})

console.log('='.repeat(80))
console.log('Benchmark Complete')
console.log('='.repeat(80))
