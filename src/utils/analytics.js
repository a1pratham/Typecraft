// ===========================
// utils/analytics.js
// WPM, accuracy, score calcs
// ===========================

/**
 * Calculate raw WPM (every 5 chars = 1 word)
 * @param {number} typedChars - total characters typed (correct + wrong)
 * @param {number} elapsedSeconds
 */
export function calcRawWPM(typedChars, elapsedSeconds) {
  if (elapsedSeconds <= 0) return 0
  return Math.round((typedChars / 5) / (elapsedSeconds / 60))
}

/**
 * Calculate net WPM (subtracts uncorrected errors per minute)
 */
export function calcNetWPM(typedChars, errors, elapsedSeconds) {
  if (elapsedSeconds <= 0) return 0
  const rawWpm = (typedChars / 5) / (elapsedSeconds / 60)
  const errorsPerMinute = errors / (elapsedSeconds / 60)
  return Math.max(0, Math.round(rawWpm - errorsPerMinute))
}

/**
 * Calculate accuracy percentage
 */
export function calcAccuracy(correctChars, totalTyped) {
  if (totalTyped === 0) return 100
  return Math.round((correctChars / totalTyped) * 100)
}

/**
 * Calculate a consistency score based on WPM variance over time
 * @param {number[]} wpmHistory - array of WPM snapshots
 */
export function calcConsistency(wpmHistory) {
  if (wpmHistory.length < 2) return 100
  const avg = wpmHistory.reduce((a, b) => a + b, 0) / wpmHistory.length
  const variance = wpmHistory.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / wpmHistory.length
  const stdDev = Math.sqrt(variance)
  const cv = avg > 0 ? (stdDev / avg) * 100 : 0
  return Math.max(0, Math.round(100 - cv))
}

/**
 * Assign a performance grade
 */
export function getGrade(wpm, accuracy) {
  const score = wpm * (accuracy / 100)
  if (score >= 120) return { label: 'S', color: '#f5c400', desc: 'Legendary' }
  if (score >= 90)  return { label: 'A', color: '#00f5d4', desc: 'Excellent' }
  if (score >= 65)  return { label: 'B', color: '#7b2fff', desc: 'Great' }
  if (score >= 45)  return { label: 'C', color: '#f72585', desc: 'Good' }
  if (score >= 25)  return { label: 'D', color: '#ff6b35', desc: 'Average' }
  return { label: 'F', color: '#6b6b8a', desc: 'Keep Practicing' }
}

/**
 * Build per-second WPM timeline from keystrokes
 * @param {Array} keystrokes - [{timestamp, correct}]
 * @param {number} startTime
 */
export function buildWPMTimeline(keystrokes, startTime) {
  if (!keystrokes.length) return []

  const timeline = []
  const buckets = {}

  keystrokes.forEach(ks => {
    const sec = Math.floor((ks.timestamp - startTime) / 1000)
    if (!buckets[sec]) buckets[sec] = { correct: 0, total: 0 }
    buckets[sec].total++
    if (ks.correct) buckets[sec].correct++
  })

  const maxSec = Math.max(...Object.keys(buckets).map(Number))

  let cumChars = 0
  for (let i = 0; i <= maxSec; i++) {
    const b = buckets[i] || { correct: 0, total: 0 }
    cumChars += b.correct
    const elapsedMin = (i + 1) / 60
    timeline.push({
      second: i + 1,
      wpm: elapsedMin > 0 ? Math.round((cumChars / 5) / elapsedMin) : 0,
      errors: b.total - b.correct
    })
  }

  return timeline
}

/**
 * Analyse which characters the user struggles with
 * @param {Array} charErrors - [{char, wasCorrect}]
 */
export function getProblematicChars(charErrors) {
  const map = {}
  charErrors.forEach(({ char, wasCorrect }) => {
    if (!map[char]) map[char] = { correct: 0, wrong: 0 }
    if (wasCorrect) map[char].correct++
    else map[char].wrong++
  })

  return Object.entries(map)
    .map(([char, stats]) => ({
      char,
      errorRate: Math.round((stats.wrong / (stats.correct + stats.wrong)) * 100),
      total: stats.correct + stats.wrong
    }))
    .filter(c => c.total >= 3 && c.errorRate > 10)
    .sort((a, b) => b.errorRate - a.errorRate)
    .slice(0, 8)
}

/**
 * Format seconds into mm:ss display
 */
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}:${String(s).padStart(2, '0')}` : `${s}s`
}

/**
 * Save a result to localStorage history
 */
export function saveResult(result) {
  const history = getHistory()
  history.unshift({ ...result, id: Date.now() })
  const trimmed = history.slice(0, 50) // keep last 50
  localStorage.setItem('typecraft_history', JSON.stringify(trimmed))
}

/**
 * Get all stored results
 */
export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem('typecraft_history') || '[]')
  } catch {
    return []
  }
}

/**
 * Clear all history
 */
export function clearHistory() {
  localStorage.removeItem('typecraft_history')
}

/**
 * Get personal best stats
 */
export function getPersonalBests(history) {
  if (!history.length) return { bestWPM: 0, bestAccuracy: 0, totalTests: 0, avgWPM: 0 }
  return {
    bestWPM: Math.max(...history.map(h => h.wpm)),
    bestAccuracy: Math.max(...history.map(h => h.accuracy)),
    totalTests: history.length,
    avgWPM: Math.round(history.reduce((s, h) => s + h.wpm, 0) / history.length)
  }
}
