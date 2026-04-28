// ===========================
// data/wordLists.js
// Word pools & quote banks
// ===========================

export const COMMON_WORDS = [
  "the","be","to","of","and","a","in","that","have","it","for","not","on","with",
  "he","as","you","do","at","this","but","his","by","from","they","we","say","her",
  "she","or","an","will","my","one","all","would","there","their","what","so","up",
  "out","if","about","who","get","which","go","me","when","make","can","like","time",
  "no","just","him","know","take","people","into","year","your","good","some","could",
  "them","see","other","than","then","now","look","only","come","its","over","think",
  "also","back","after","use","two","how","our","work","first","well","way","even",
  "new","want","because","any","these","give","day","most","us","great","between",
  "need","large","often","hand","high","place","hold","turn","ask","men","read",
  "change","point","play","small","number","off","always","move","live","try","run",
  "never","same","long","little","own","right","big","down","keep","stop","tell",
  "much","before","still","something","real","name","those","should","write","home",
  "call","set","find","cut","help","talk","last","every","next","thought","show",
  "world","feel","food","king","old","able","face","few","week","land","fast",
  "open","seem","together","follow","start","form","force","bring","stand","both"
]

export const QUOTES = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "In the middle of every difficulty lies opportunity.",
    author: "Albert Einstein"
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius"
  },
  {
    text: "Life is what happens to you while you are busy making other plans.",
    author: "John Lennon"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle"
  },
  {
    text: "Spread love everywhere you go. Let no one ever come to you without leaving happier.",
    author: "Mother Teresa"
  },
  {
    text: "When you reach the end of your rope, tie a knot in it and hang on.",
    author: "Franklin D. Roosevelt"
  },
  {
    text: "Always remember that you are absolutely unique, just like everyone else.",
    author: "Margaret Mead"
  },
  {
    text: "Do not go where the path may lead, go instead where there is no path and leave a trail.",
    author: "Ralph Waldo Emerson"
  },
  {
    text: "You will face many defeats in life, but never let yourself be defeated.",
    author: "Maya Angelou"
  },
  {
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela"
  },
  {
    text: "In the end, it is not the years in your life that count. It is the life in your years.",
    author: "Abraham Lincoln"
  },
  {
    text: "Never let the fear of striking out keep you from playing the game.",
    author: "Babe Ruth"
  },
  {
    text: "Life is either a daring adventure or nothing at all.",
    author: "Helen Keller"
  },
  {
    text: "Many of life's failures are people who did not realize how close they were to success when they gave up.",
    author: "Thomas Edison"
  },
  {
    text: "You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose.",
    author: "Dr. Seuss"
  },
  {
    text: "If life were predictable it would cease to be life and be without flavor.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "If you look at what you have in life, you will always have more.",
    author: "Oprah Winfrey"
  },
  {
    text: "If you set your goals ridiculously high and it is a failure, you will fail above everyone else's success.",
    author: "James Cameron"
  }
]

export const CODE_SNIPPETS = [
  "const sum = (a, b) => a + b; console.log(sum(2, 3));",
  "function factorial(n) { return n <= 1 ? 1 : n * factorial(n - 1); }",
  "const arr = [1, 2, 3, 4, 5]; const doubled = arr.map(x => x * 2);",
  "async function fetchData(url) { const res = await fetch(url); return res.json(); }",
  "class Node { constructor(val) { this.val = val; this.next = null; } }",
  "const debounce = (fn, delay) => { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); }; };",
  "const flatten = arr => arr.reduce((flat, item) => flat.concat(Array.isArray(item) ? flatten(item) : item), []);",
  "const memoize = fn => { const cache = {}; return (...args) => { const key = JSON.stringify(args); return cache[key] ?? (cache[key] = fn(...args)); }; };",
]

/**
 * Generate a random word list test
 * @param {number} count - number of words
 * @param {boolean} includeNumbers - include random numbers
 * @param {boolean} includePunctuation - include punctuation
 */
export function generateWordTest(count = 50, includeNumbers = false, includePunctuation = false) {
  const pool = [...COMMON_WORDS]
  const words = []

  for (let i = 0; i < count; i++) {
    let word = pool[Math.floor(Math.random() * pool.length)]

    if (includeNumbers && Math.random() < 0.15) {
      word = String(Math.floor(Math.random() * 1000))
    }

    if (includePunctuation && Math.random() < 0.2) {
      const puncts = [',', '.', '!', '?', ';', ':']
      word = word + puncts[Math.floor(Math.random() * puncts.length)]
    }

    words.push(word)
  }

  return words.join(' ')
}

/**
 * Get a random quote
 */
export function getRandomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)]
}

/**
 * Get a random code snippet
 */
export function getRandomCode() {
  return CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)]
}
