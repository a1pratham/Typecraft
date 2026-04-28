// ===========================
// hooks/useTypingTest.js
// Core typing engine hook
// ===========================

import { useState, useEffect, useRef, useCallback } from 'react'
import { generateWordTest, getRandomQuote, getRandomCode } from '../data/wordLists'
import {
  calcRawWPM, calcNetWPM, calcAccuracy,
  calcConsistency, buildWPMTimeline, getProblematicChars, saveResult
} from '../utils/analytics'

export const MODES = {
  WORDS:  'words',
  QUOTE:  'quote',
  CODE:   'code',
}

export const TIME_OPTIONS  = [15, 30, 60, 120]
export const WORD_OPTIONS  = [10, 25, 50, 100]

const DEFAULT_SETTINGS = {
  mode: MODES.WORDS,
  timeLimit: 30,
  wordCount: 25,
  timed: true,
  numbers: false,
  punctuation: false,
}

export function useTypingTest() {
  const [settings, setSettings]       = useState(DEFAULT_SETTINGS)
  const [targetText, setTargetText]   = useState('')
  const [quoteInfo, setQuoteInfo]     = useState(null)

  // Typing state
  const [typedChars, setTypedChars]   = useState([]) // array of { char, correct }
  const [currentIdx, setCurrentIdx]   = useState(0)
  const [errors, setErrors]           = useState(0)

  // Timer / phase
  const [phase, setPhase]             = useState('idle') // idle | running | finished
  const [elapsed, setElapsed]         = useState(0)
  const [timeLeft, setTimeLeft]       = useState(DEFAULT_SETTINGS.timeLimit)

  // Live stats
  const [liveWPM, setLiveWPM]         = useState(0)
  const [liveAccuracy, setLiveAccuracy] = useState(100)

  // Result
  const [result, setResult]           = useState(null)

  // Internals
  const startTimeRef    = useRef(null)
  const timerRef        = useRef(null)
  const keystrokesRef   = useRef([])  // [{timestamp, correct, char}]
  const wpmSnapshotsRef = useRef([])
  const charErrorsRef   = useRef([])

  // ── Generate / reset test ──────────────────────────────────────────────
  const generateTest = useCallback((overrideSettings) => {
    const s = overrideSettings || settings
    let text = ''
    let qi = null

    if (s.mode === MODES.WORDS) {
      text = generateWordTest(s.timed ? 200 : s.wordCount, s.numbers, s.punctuation)
    } else if (s.mode === MODES.QUOTE) {
      const q = getRandomQuote()
      text = q.text
      qi = q
    } else if (s.mode === MODES.CODE) {
      text = getRandomCode()
    }

    setTargetText(text)
    setQuoteInfo(qi)
    setTypedChars([])
    setCurrentIdx(0)
    setErrors(0)
    setPhase('idle')
    setElapsed(0)
    setTimeLeft(s.timeLimit)
    setLiveWPM(0)
    setLiveAccuracy(100)
    setResult(null)
    startTimeRef.current = null
    keystrokesRef.current = []
    wpmSnapshotsRef.current = []
    charErrorsRef.current = []

    clearInterval(timerRef.current)
  }, [settings])

  // ── Start timer ────────────────────────────────────────────────────────
  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now()
    setPhase('running')

    timerRef.current = setInterval(() => {
      const now = Date.now()
      const secs = Math.floor((now - startTimeRef.current) / 1000)
      setElapsed(secs)

      if (settings.timed) {
        const left = settings.timeLimit - secs
        setTimeLeft(Math.max(0, left))
        if (left <= 0) {
          clearInterval(timerRef.current)
          finishTest()
        }
      }
    }, 100)
  }, [settings])

  // ── Finish test ────────────────────────────────────────────────────────
  const finishTest = useCallback(() => {
    clearInterval(timerRef.current)
    setPhase('finished')

    const endTime = Date.now()
    const elapsedSec = startTimeRef.current
      ? (endTime - startTimeRef.current) / 1000
      : 1

    const allTyped = keystrokesRef.current
    const totalTyped = allTyped.length
    const correctTyped = allTyped.filter(k => k.correct).length
    const errorCount = totalTyped - correctTyped

    const rawWpm = calcRawWPM(totalTyped, elapsedSec)
    const netWpm = calcNetWPM(totalTyped, errorCount, elapsedSec)
    const accuracy = calcAccuracy(correctTyped, totalTyped)
    const timeline = buildWPMTimeline(allTyped, startTimeRef.current)
    const consistency = calcConsistency(timeline.map(t => t.wpm))
    const problematic = getProblematicChars(charErrorsRef.current)

    const res = {
      wpm: netWpm,
      rawWpm,
      accuracy,
      consistency,
      errors: errorCount,
      correctChars: correctTyped,
      totalChars: totalTyped,
      elapsedSec: Math.round(elapsedSec),
      timeline,
      problematic,
      mode: settings.mode,
      timeLimit: settings.timeLimit,
      wordCount: settings.wordCount,
      date: new Date().toISOString(),
    }

    setResult(res)
    saveResult(res)
  }, [settings])

  // ── Handle keypress ────────────────────────────────────────────────────
  const handleKeyDown = useCallback((e) => {
    if (phase === 'finished') return

    // Start test on first keypress
    if (phase === 'idle') {
      if (e.key.length === 1) {
        startTimer()
      } else {
        return
      }
    }

    const key = e.key

    // Backspace
    if (key === 'Backspace') {
      e.preventDefault()
      if (currentIdx > 0) {
        setCurrentIdx(prev => prev - 1)
        setTypedChars(prev => prev.slice(0, -1))
        // Remove last keystroke from ref
        if (keystrokesRef.current.length > 0) {
          keystrokesRef.current.pop()
        }
      }
      return
    }

    // Ignore modifier keys
    if (key.length !== 1) return

    e.preventDefault()

    const expected = targetText[currentIdx]
    const correct = key === expected

    const newTyped = [...typedChars, { char: key, correct }]
    setTypedChars(newTyped)
    setCurrentIdx(prev => prev + 1)

    // Record keystroke
    const ks = { timestamp: Date.now(), correct, char: key, expected }
    keystrokesRef.current.push(ks)
    charErrorsRef.current.push({ char: expected, wasCorrect: correct })

    if (!correct) setErrors(prev => prev + 1)

    // Update live stats
    const now = Date.now()
    const elapsedSec = startTimeRef.current ? (now - startTimeRef.current) / 1000 : 1
    const totalT = keystrokesRef.current.length
    const correctT = keystrokesRef.current.filter(k => k.correct).length
    const wpm = calcNetWPM(totalT, totalT - correctT, elapsedSec)
    const acc = calcAccuracy(correctT, totalT)
    setLiveWPM(wpm)
    setLiveAccuracy(acc)
    wpmSnapshotsRef.current.push(wpm)

    // Finish if all chars typed (non-timed or quote/code mode)
    const nextIdx = currentIdx + 1
    if (nextIdx >= targetText.length) {
      finishTest()
    }
  }, [phase, currentIdx, typedChars, targetText, startTimer, finishTest])

  // ── Settings update ────────────────────────────────────────────────────
  const updateSettings = useCallback((updates) => {
    const newSettings = { ...settings, ...updates }
    setSettings(newSettings)
    generateTest(newSettings)
  }, [settings, generateTest])

  // ── Init ───────────────────────────────────────────────────────────────
  useEffect(() => {
    generateTest()
    return () => clearInterval(timerRef.current)
  }, []) // eslint-disable-line

  // ── Restart (same settings) ────────────────────────────────────────────
  const restart = useCallback(() => {
    generateTest()
  }, [generateTest])

  return {
    // state
    settings,
    targetText,
    quoteInfo,
    typedChars,
    currentIdx,
    errors,
    phase,
    elapsed,
    timeLeft,
    liveWPM,
    liveAccuracy,
    result,
    // actions
    handleKeyDown,
    restart,
    updateSettings,
  }
}
