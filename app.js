(() => {
  'use strict';

  let LANG = window.LINGUA_LANGUAGES.vi;
  let VOCAB = LANG.words;
  const CATEGORIES = Array.isArray(window.VIETNAMESE_CATEGORIES) ? window.VIETNAMESE_CATEGORIES : [];
  const CATEGORY_LOOKUP = Object.fromEntries(CATEGORIES.map(category => [category.id, category]));
  const STORAGE_KEY = 'littleLinguaVietnameseV1';
  const PAGE_SIZE = 48;
  const GAME_PICKER_PAGE_SIZE = 18;
  const FEATURED_GAME_WORDS = ['xin chào', 'một', 'mẹ', 'ba', 'bạn', 'con mèo', 'con chó', 'quả táo', 'hoa', 'mưa', 'mặt trời', 'nhà', 'sách', 'nước', 'phở', 'con thỏ', 'xe đạp', 'cảm ơn'];
  const initialState = { language: 'vi', known: [], stars: 0, minutes: 0, streak: 1, goal: 10, nickname: 'Sunny', practiceDays: [] };
  let state = loadState();
  let activeCategory = 'all';
  let searchTerm = '';
  let showKnownOnly = false;
  let currentPage = 1;
  let selectedGameWord = null;
  let gameWordPage = 1;
  let puzzleSegments = [];
  let puzzleTiles = [];
  let slotAssignments = [];
  let puzzleSolved = false;
  let storyPage = 0;
  let toastTimer = null;
  let spotlightWord = VOCAB[0] || null;

  const STORIES = [
    '<p>Luna thức dậy vào một ngày nắng đẹp. Cô thỏ nhỏ mỉm cười và nói: <span class="story-word">“Xin chào!”</span> <span class="story-translation">(Hello!)</span></p><p>Luna nhìn thấy những bông hoa trong khu vườn. <span class="story-word">Hoa đẹp quá!</span> <span class="story-translation">(The flowers are so pretty!)</span></p>',
    '<p>Một chú mèo đi đến bên Luna. Luna hỏi: <span class="story-word">“Bạn có muốn uống nước không?”</span> <span class="story-translation">(Would you like some water?)</span></p><p>Chú mèo vui vẻ kêu: “Meo meo!” rồi uống một chút nước.</p>',
    '<p>Chú mèo nói: <span class="story-word">“Cảm ơn bạn!”</span> <span class="story-translation">(Thank you!)</span></p><p>Luna và người bạn mới cùng chơi dưới ánh nắng. <span class="story-word">Tạm biệt, hẹn gặp lại!</span> <span class="story-translation">(Goodbye, see you again!)</span></p>'
  ];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const language = () => LANG;
  const translate = item => item.vi;

  function loadState() { return {...initialState, known:[], practiceDays:[]}; }
  function saveState() { /* Profile changes use atomic account mutations. */ }
  async function accountAction(action) {
    try { return await window.LinguaAccount.mutate(action); }
    catch(error) { toast(error.message); return null; }
  }
  function targetWord(item) { return item.vi; }
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  }

  function normalizeText(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'd').toLowerCase().trim();
  }

  function localDateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function toast(message) {
    const el = $('#toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => el.classList.remove('show'), 2600);
  }

  let speechRequestId = 0;

  function findVietnameseVoice(voices) {
    const vietnameseVoices = voices.filter(voice =>
      /^vi(?:[-_]|$)/i.test(voice.lang || '') || /vietnamese|tiếng việt/i.test(voice.name || '')
    );
    vietnameseVoices.sort((a, b) => {
      const score = voice => {
        const lang = String(voice.lang || '').replace('_', '-').toLowerCase();
        if (lang === 'vi-vn') return 0;
        if (lang.startsWith('vi-vn-')) return 1;
        if (lang.startsWith('vi')) return 2;
        return 3;
      };
      return score(a) - score(b);
    });
    return vietnameseVoices[0] || null;
  }

  function waitForVietnameseVoice(timeoutMs = 1200) {
    const synth = window.speechSynthesis;
    const existingVoice = findVietnameseVoice(synth.getVoices());
    if (existingVoice) return Promise.resolve(existingVoice);

    return new Promise(resolve => {
      let settled = false;
      let previousHandler = null;
      let fallbackHandler = null;
      const deadline = Date.now() + timeoutMs;
      const onVoicesChanged = () => finish();
      const finish = () => {
        if (settled) return;
        const voice = findVietnameseVoice(synth.getVoices());
        if (!voice && Date.now() < deadline) return;
        settled = true;
        window.clearTimeout(timeoutId);
        if (typeof synth.removeEventListener === 'function') {
          synth.removeEventListener('voiceschanged', onVoicesChanged);
        } else if (synth.onvoiceschanged === fallbackHandler) {
          synth.onvoiceschanged = previousHandler;
        }
        resolve(voice);
      };
      const timeoutId = window.setTimeout(finish, timeoutMs);
      if (typeof synth.addEventListener === 'function') {
        synth.addEventListener('voiceschanged', onVoicesChanged);
      } else {
        previousHandler = synth.onvoiceschanged;
        fallbackHandler = event => {
          if (typeof previousHandler === 'function') previousHandler.call(synth, event);
          onVoicesChanged();
        };
        synth.onvoiceschanged = fallbackHandler;
      }
    });
  }

  let currentAudio = null;

  async function playAudioBlob(blob, requestId, engineLabel) {
    if (requestId !== speechRequestId) return;
    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);
    currentAudio = audio;
    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      URL.revokeObjectURL(audioUrl);
      if (currentAudio === audio) currentAudio = null;
    };
    audio.onended = release;
    audio.onerror = () => {
      release();
      if (requestId === speechRequestId) toast(`${engineLabel} could not be played. Please try again.`);
    };
    try {
      await audio.play();
    } catch (error) {
      release();
      throw error;
    }
  }

  async function speak(text, slow = false) {
    const requestId = ++speechRequestId;
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = '';
      currentAudio = null;
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    const speechText = String(text || '').trim();
    if (state.language !== 'vi') {
      if (!('speechSynthesis' in window)) return toast('Pronunciation is not supported on this browser.');
      const utterance = new SpeechSynthesisUtterance(speechText); utterance.lang=LANG.speech;
      const voice=window.speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().startsWith(state.language==='zh'?'zh':'en'));
      if(voice)utterance.voice=voice;utterance.rate=slow?.65:.85; window.speechSynthesis.speak(utterance); return;
    }
    if (!speechText) return;

    const matchingWord = VOCAB.find(item => item.vi === speechText);
    if (matchingWord) {
      const base = `assets/audio/vi/${encodeURIComponent(matchingWord.id)}`;
      const candidates = slow ? [`${base}-slow.mp3`, `${base}.mp3`] : [`${base}.mp3`];
      for (const relativeUrl of candidates) {
        try {
          const audioUrl = new URL(relativeUrl, document.baseURI).href;
          const response = await fetch(audioUrl, { cache: 'force-cache' });
          if (requestId !== speechRequestId) return;
          if (!response.ok) continue;
          const blob = await response.blob();
          if (blob.size > 100) {
            await playAudioBlob(blob, requestId, 'Saved Vietnamese recording');
            return;
          }
        } catch (_) {
          // Try the next available recording or the device voice below.
        }
      }
    }

    // Optional fallback: use an installed Vietnamese voice on this device/browser.
    if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
      toast(matchingWord
        ? `No saved MP3 for “${speechText}” yet. Add ${matchingWord.id}.mp3 to assets/audio/vi/.`
        : 'No Vietnamese audio is available for this text yet.');
      return;
    }
    const synth = window.speechSynthesis;
    const vietnameseVoice = await waitForVietnameseVoice();
    if (requestId !== speechRequestId) return;
    if (!vietnameseVoice) {
      toast(matchingWord
        ? `No saved MP3 for “${speechText}” yet, and this device has no Vietnamese voice. Add ${matchingWord.id}.mp3 to assets/audio/vi/.`
        : 'This device has no Vietnamese voice. Add a saved MP3 to use this text.');
      return;
    }
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = 'vi-VN';
    utterance.voice = vietnameseVoice;
    utterance.rate = slow ? 0.62 : 0.82;
    utterance.pitch = 1.08;
    utterance.onerror = event => {
      if (event.error !== 'canceled' && event.error !== 'interrupted') {
        toast('Vietnamese speech could not be played. Check the saved MP3 or device voice.');
      }
    };
    synth.speak(utterance);
  }

  function changeView(name) {
    const validViews = ['today', 'learn', 'play', 'stories', 'progress', 'shop', 'profile'];
    if (!validViews.includes(name)) name = 'today';
    $$('.view').forEach(view => view.classList.toggle('active', view.id === `view-${name}`));
    $$('.nav-link').forEach(button => button.classList.toggle('active', button.dataset.view === name));
    const labels = { today: 'My day', learn: 'Learn Vietnamese', play: 'Play & practice', stories: 'Story garden', progress: 'My progress', shop:'Pokémon Shop', profile:'My profile' };
    $('#page-crumb').textContent = labels[name];
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (name === 'learn') renderVocab();
    if (name === 'play') renderGameWordPicker();
    if (name === 'stories') renderStory();
    if (name === 'progress') renderProgress();
  }

  function markPractice() {
    const key = localDateKey();
    if (!state.practiceDays.includes(key)) state.practiceDays.push(key);
    saveState();
  }

  function updateDashboard() {
    const name = escapeHTML(state.nickname || 'Sunny');
    $('#welcome-title').innerHTML = `Hello, ${name}! <span class="wave">👋</span>`;
    $('#daily-minutes').textContent = state.minutes;
    $('#hero-progress-fill').style.width = `${Math.min(100, state.minutes / Math.max(1, state.goal) * 100)}%`;
    $('#week-words').textContent = state.known.length;
    $('#streak-count').textContent = `${state.streak} ${state.streak === 1 ? 'day' : 'days'}`;
    $('#language-flag').textContent = LANG.flag;
    $('#language-select').value = state.language;
    $('.highlight-word').textContent=LANG.name;
    $('#learn-title').textContent=`Discover ${LANG.name}! ${LANG.flag}`;
    $('#view-learn .view-heading .welcome-copy').textContent=`Explore ${VOCAB.length.toLocaleString()} entries by topic. Search in ${LANG.name} or ${LANG.hint}, then tap ♫ to listen.`;
    $('#vocab-search').placeholder=`Search ${LANG.name} or ${LANG.hint}…`;
    $('#game-word-search').placeholder=`Search ${LANG.name} or ${LANG.hint}…`;
    $('#view-learn .helper-text').textContent=`Tap ♫ to hear ${LANG.name}; Shift-click for slower audio.`;
    $('#view-play .welcome-copy').textContent='Practice words, collect stars, or battle with your Pokémon team.';
    $('.hero-copy p').textContent=`Learn useful ${LANG.name} words, hear their pronunciation, and build confidence one little step at a time.`;
    $('.lesson-card.card-peach h3').textContent=`${LANG.name} starter words`;
    $('.lesson-card.card-peach p').textContent=`Build a first set of useful ${LANG.name} words.`;
    $('.lesson-card.card-mint p').textContent=`Learn how to greet people and say thank you in ${LANG.name}.`;
    $('.art-chat span').textContent=LANG.hello;
    const tip=$('.gentle-tip p');tip.innerHTML=state.language==='vi'?'<strong>Tone-mark tip</strong><br>Listen for the tones and keep every accent mark in your word.':state.language==='zh'?'<strong>Chinese starter tip</strong><br>Read the characters alongside the pinyin. Tone marks in pinyin help you hear each syllable.':'<strong>English explorer tip</strong><br>Listen, say the word aloud, and notice how letters and sounds work together.';
    $('#learned-count').textContent = state.known.length;
    $('#progress-words').textContent = state.known.length;
    $('#progress-minutes').textContent = state.minutes;
    $('#progress-stars').textContent = state.totalEarned || 0;
    $('#progress-streak').textContent = state.streak;
    $('#game-score').textContent = state.stars;
    $$('#star-track span').forEach((star, index) => {
      const earned = index < Math.min(5, state.stars);
      star.textContent = earned ? '★' : '☆';
      star.classList.toggle('earned', earned);
    });
    $('#today-date').textContent = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date());

    if (VOCAB.length) {
      const dayIndex = Math.floor(new Date().setHours(0, 0, 0, 0) / 86400000) % VOCAB.length;
      spotlightWord = VOCAB[dayIndex];
      $('#spotlight-word').textContent = spotlightWord.vi;
      $('#spotlight-meaning').textContent = spotlightWord.en;
      $('#spotlight-emoji').textContent = spotlightWord.emoji;
      $('#speak-spotlight').setAttribute('aria-label', `Listen to ${spotlightWord.vi}`);
    }

    const todayIndex = (new Date().getDay() + 6) % 7;
    $$('.day-item').forEach((item, index) => {
      const bubble = $('.day-bubble', item);
      const dayDate = new Date();
      dayDate.setDate(dayDate.getDate() - ((todayIndex - index + 7) % 7));
      const dateKey = localDateKey(dayDate);
      bubble.classList.toggle('done', state.practiceDays.includes(dateKey));
      bubble.classList.toggle('today', index === todayIndex && !state.practiceDays.includes(dateKey));
      bubble.textContent = state.practiceDays.includes(dateKey) ? '✓' : index === todayIndex ? '✦' : '·';
    });
    renderProgress();
  }

  function initCategories() {
    const select = $('#category-select');
    if (!select || select.dataset.ready === 'true') return;
    select.innerHTML = '<option value="all">All topics</option>' + CATEGORIES.map(category =>
      `<option value="${escapeHTML(category.id)}">${escapeHTML(category.icon)} ${escapeHTML(category.label)}</option>`
    ).join('');
    select.dataset.ready = 'true';
  }

  function currentFilteredWords() {
    const query = normalizeText(searchTerm);
    return VOCAB.filter(item => {
      if (activeCategory !== 'all' && item.category !== activeCategory) return false;
      if (showKnownOnly && !state.known.includes(item.id)) return false;
      if (!query) return true;
      return [item.vi, item.en, item.categoryLabel].some(value => normalizeText(value).includes(query));
    });
  }

  function renderVocab() {
    const grid = $('#vocab-grid');
    if (!grid) return;
    initCategories();
    const words = currentFilteredWords();
    const visibleWords = words.slice(0, currentPage * PAGE_SIZE);
    grid.innerHTML = visibleWords.map(item => {
      const known = state.known.includes(item.id);
      return `<article class="vocab-card ${known ? 'known' : ''}" data-vocab-id="${escapeHTML(item.id)}">
        <div class="vocab-card-top"><span class="vocab-category">${escapeHTML(item.categoryLabel)}</span><span class="vocab-card-number">${state.language.toUpperCase()}</span></div>
        <div class="vocab-emoji" aria-hidden="true">${escapeHTML(item.emoji)}</div>
        <div class="vocab-word"><h3 lang="vi-VN">${escapeHTML(item.vi)}</h3>${item.pinyin?`<span class="pinyin">${escapeHTML(item.pinyin)}</span>`:""}<button class="speaker-button" data-speak="${escapeHTML(item.id)}" aria-label="Hear ${escapeHTML(item.vi)} in Vietnamese" title="Hear Vietnamese pronunciation">♫</button></div>
        <p class="vocab-meaning"><span>${LANG.hint}</span>${escapeHTML(item.en)}</p>
        <button class="know-button" data-known="${escapeHTML(item.id)}">${known ? '✓ Learned' : 'Mark as learned'}</button>
      </article>`;
    }).join('');
    $('#learned-count').textContent = state.known.length;
    $('#vocab-count').textContent = words.length === 0
      ? 'No words found. Try another search.'
      : `Showing ${visibleWords.length} of ${words.length} words${activeCategory === 'all' ? '' : ` in ${CATEGORY_LOOKUP[activeCategory]?.label || 'this topic'}`}`;
    const moreButton = $('#vocab-load-more');
    moreButton.hidden = visibleWords.length >= words.length;
    moreButton.textContent = `Load ${Math.min(PAGE_SIZE, words.length - visibleWords.length)} more words ↓`;
  }

  async function toggleKnown(id) {
    if(!VOCAB.some(w=>w.id===id))return;
    const result=state.known.includes(id)
      ? await accountAction({type:'unlearn',id:`${state.language}:${id}`})
      : await accountAction({type:'reward',key:`learn:${state.language}:${id}`,day:localDateKey()});
    if(result)toast('A little step forward! ✨');
  }

  function startLesson(kind) {
    const categoryByLesson = { animals: 'animals', phrases: 'phrases', words: 'everyday' };
    activeCategory = categoryByLesson[kind] || 'all';
    searchTerm = '';
    showKnownOnly = false;
    currentPage = 1;
    $('#vocab-search').value = '';
    $('#known-filter').checked = false;
    $('#category-select').value = activeCategory;
    changeView('learn');
    renderVocab();
    toast(kind === 'animals' ? 'Let’s meet Vietnamese animal words! 🐾' : kind === 'phrases' ? 'Let’s practice friendly Vietnamese phrases! 💛' : 'Your Vietnamese word adventure starts now! 🌱');
  }

  function initGamePicker() {
    const select = $('#game-category');
    if (!select || select.dataset.ready === 'true') return;
    select.innerHTML = '<option value="all">All topics</option>' + CATEGORIES.map(category =>
      `<option value="${escapeHTML(category.id)}">${escapeHTML(category.icon)} ${escapeHTML(category.label)}</option>`
    ).join('');
    select.dataset.ready = 'true';
  }

  function gameWordResults() {
    const query = normalizeText($('#game-word-search').value);
    const category = $('#game-category').value || 'all';
    if (!query && category === 'all') {
      return state.language==='vi'?FEATURED_GAME_WORDS.map(vi => VOCAB.find(item => normalizeText(item.vi) === normalizeText(vi))).filter(Boolean):VOCAB.slice(0,18);
    }
    return VOCAB.filter(item => {
      if (category !== 'all' && item.category !== category) return false;
      if (!query) return true;
      return [item.vi, item.en, item.categoryLabel].some(value => normalizeText(value).includes(query));
    });
  }

  function renderGameWordPicker() {
    const list = $('#game-word-list');
    if (!list) return;
    initGamePicker();
    const words = gameWordResults();
    const visibleWords = words.slice(0, gameWordPage * GAME_PICKER_PAGE_SIZE);
    list.innerHTML = visibleWords.map(item => {
      const selected = selectedGameWord && item.id === selectedGameWord.id;
      return `<button type="button" class="game-word-card ${selected ? 'selected' : ''}" data-game-word="${escapeHTML(item.id)}" aria-pressed="${selected ? 'true' : 'false'}">
        <span class="game-word-emoji" aria-hidden="true">${escapeHTML(item.emoji)}</span>
        <span class="game-word-card-copy"><strong lang="vi-VN">${escapeHTML(item.vi)}</strong>${item.pinyin?`<span class="pinyin">${escapeHTML(item.pinyin)}</span>`:""}<small>${escapeHTML(item.en)}</small><em>${escapeHTML(item.categoryLabel)}</em></span>
        <span class="game-word-check" aria-hidden="true">${selected ? '✓' : '+'}</span>
      </button>`;
    }).join('');

    const query = normalizeText($('#game-word-search').value);
    const category = $('#game-category').value || 'all';
    const count = $('#game-word-count');
    if (!words.length) count.textContent = 'No words found. Try another search or topic.';
    else if (!query && category === 'all') count.textContent = `${words.length} friendly starter picks · search or choose a topic to explore all ${VOCAB.length.toLocaleString()} words.`;
    else count.textContent = `Showing ${visibleWords.length} of ${words.length.toLocaleString()} matching words.`;

    const loadMore = $('#game-word-load-more');
    loadMore.hidden = (!query && category === 'all') || visibleWords.length >= words.length;
    loadMore.textContent = `Show ${Math.min(GAME_PICKER_PAGE_SIZE, words.length - visibleWords.length)} more words ↓`;

    const summary = $('#selected-word-summary');
    const startButton = $('#shuffle-selected');
    if (selectedGameWord) {
      summary.innerHTML = `${escapeHTML(selectedGameWord.emoji)} You picked <strong lang="vi-VN">${escapeHTML(selectedGameWord.vi)}</strong> — ${escapeHTML(selectedGameWord.en)}!`;
      startButton.disabled = false;
    } else {
      summary.textContent = '🌱 No word picked yet. Choose a card above!';
      startButton.disabled = true;
    }
  }

  function selectGameWord(id) {
    const item = VOCAB.find(word => word.id === id);
    if (!item) return;
    selectedGameWord = item;
    renderGameWordPicker();
    const selectedCard = $(`[data-game-word="${CSS.escape(id)}"]`);
    if (selectedCard) selectedCard.focus();
  }

  function shuffleArray(items) {
    const result = items.slice();
    for (let index = result.length - 1; index > 0; index--) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
    }
    return result;
  }

  function cleanedVietnameseWord(value) {
    return String(value || '').normalize('NFC').replace(/[.,!?…:;"'“”‘’()\[\]{}]/g, '').replace(/\s+/g, ' ').trim();
  }

  function startScramble(item = selectedGameWord) {
    if (!item) {
      toast('Pick your favorite Vietnamese word first! 😊');
      return;
    }
    selectedGameWord = item;
    puzzleSegments = cleanedVietnameseWord(item.vi).split(' ').filter(Boolean).map(segment => Array.from(segment));
    const targetLetters = puzzleSegments.flat();
    let mixedLetters = shuffleArray(targetLetters);
    let attempts = 0;
    while (targetLetters.length > 1 && mixedLetters.every((char, index) => char === targetLetters[index]) && attempts < 15) {
      mixedLetters = shuffleArray(targetLetters);
      attempts += 1;
    }
    if (targetLetters.length > 1 && mixedLetters.every((char, index) => char === targetLetters[index])) {
      mixedLetters = targetLetters.slice(1).concat(targetLetters[0]);
    }
    puzzleTiles = mixedLetters.map((char, index) => ({ id: `tile-${index}`, char }));
    slotAssignments = targetLetters.map(() => null);
    puzzleSolved = false;
    $('#question-emoji').textContent = item.emoji;
    $('#question-hint').textContent = `${LANG.hint} clue: “${item.en}”. Can you build the ${LANG.name} word?`;
    $('#game-feedback').textContent = 'Tap the mixed-up letters to build your word. You can change your mind by tapping a letter in the answer!';
    $('#game-feedback').className = 'game-feedback';
    $('#word-choice-panel').hidden = true;
    $('#game-layout').hidden = false;
    renderScramble();
    $('#change-game-word').focus();
  }

  function renderScramble() {
    const slots = $('#scramble-word-slots');
    let globalIndex = 0;
    slots.innerHTML = puzzleSegments.map((segment, wordIndex) => {
      const wordSlots = segment.map((targetChar) => {
        const slotIndex = globalIndex++;
        const tileId = slotAssignments[slotIndex];
        const tile = tileId ? puzzleTiles.find(item => item.id === tileId) : null;
        const locked = puzzleSolved ? ' disabled' : '';
        return `<button type="button" class="scramble-slot ${tile ? 'filled' : ''}" data-slot-index="${slotIndex}" aria-label="Letter slot ${slotIndex + 1}${tile ? `, ${escapeHTML(tile.char)}, tap to remove` : ', empty'}"${locked}>${tile ? escapeHTML(tile.char) : '<span>·</span>'}</button>`;
      }).join('');
      return `<div class="scramble-word-group" aria-label="Word ${wordIndex + 1}">${wordSlots}</div>`;
    }).join('<span class="scramble-word-space" aria-hidden="true"> </span>');

    $('#scramble-letter-bank').innerHTML = puzzleTiles.map(tile => {
      const used = slotAssignments.includes(tile.id);
      const disabled = used || puzzleSolved ? ' disabled' : '';
      return `<button type="button" class="scramble-tile ${used ? 'used' : ''}" data-tile-id="${escapeHTML(tile.id)}" aria-label="Letter ${escapeHTML(tile.char)}"${disabled}>${escapeHTML(tile.char)}</button>`;
    }).join('');
  }

  async function evaluateScramble() {
    if (slotAssignments.some(tileId => !tileId)) return;
    const assembled = slotAssignments.map(tileId => puzzleTiles.find(tile => tile.id === tileId).char);
    const target = puzzleSegments.flat();
    const correct = assembled.every((char, index) => char === target[index]);
    if (correct) {
      puzzleSolved = true;
      renderScramble();
      const puzzleIdentity=selectedGameWord.id, accountIdentity=window.LinguaAccount.user?.uid||'guest';
      const result = await accountAction({type:'reward', key:`solve:${state.language}:${selectedGameWord.id}`, day:localDateKey()});
      if((window.LinguaAccount.user?.uid||'guest')!==accountIdentity || selectedGameWord?.id!==puzzleIdentity)return;
      if(!result){puzzleSolved=false;renderScramble();return;}
      $('#question-hint').textContent = `${selectedGameWord.vi} means “${selectedGameWord.en}”. You did it!`;
      $('#game-feedback').textContent = 'Chính xác! Perfect! You put every letter in the right place. ⭐';
      $('#game-feedback').className = 'game-feedback good';
      saveState();
      updateDashboard();
      renderScramble();
    } else {
      $('#game-feedback').textContent = 'Almost! Tap a letter in your answer to send it back, then try a new order. 💛';
      $('#game-feedback').className = 'game-feedback try-again';
    }
  }

  function placeScrambleTile(tileId) {
    if (puzzleSolved || slotAssignments.includes(tileId)) return;
    const emptyIndex = slotAssignments.indexOf(null);
    if (emptyIndex === -1) return;
    slotAssignments[emptyIndex] = tileId;
    renderScramble();
    evaluateScramble();
  }

  function removeScrambleTile(slotIndex) {
    if (puzzleSolved || slotAssignments[slotIndex] == null) return;
    slotAssignments[slotIndex] = null;
    $('#game-feedback').textContent = 'That letter is back in the tray. Keep going! 🌱';
    $('#game-feedback').className = 'game-feedback';
    renderScramble();
  }

  function resetScramble() {
    if (!selectedGameWord) return;
    startScramble(selectedGameWord);
  }

  function renderStory() {
    $('#story-text').innerHTML = (window.LINGUA_STORIES[state.language] || STORIES)[storyPage];
    $('#story-page-label').textContent = `Page ${storyPage + 1} of ${STORIES.length}`;
    $('#story-progress-fill').style.width = `${(storyPage + 1) / STORIES.length * 100}%`;
    $('#story-prev').disabled = storyPage === 0;
    $('#story-next').textContent = storyPage === STORIES.length - 1 ? 'Read again ↻' : 'Next page →';
  }

  function renderProgress() {
    $('#progress-words').textContent = state.known.length;
    $('#progress-minutes').textContent = state.minutes;
    $('#progress-stars').textContent = state.totalEarned || 0;
    $('#progress-streak').textContent = state.streak;
    const percent = Math.min(100, state.known.length / 10 * 100);
    $('#badge-progress-fill').style.width = `${percent}%`;
    $('#badge-progress-text').textContent = `${Math.min(10, state.known.length)} of 10 words`;
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dayBars = $$('.progress-day');
    const today = new Date();
    const mondayOffset = (today.getDay() + 6) % 7;
    dayBars.forEach((bar, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - mondayOffset + index);
      const practiced = state.practiceDays.includes(localDateKey(date));
      const fill = $('.bar-shell i', bar);
      if (fill) fill.style.height = `${practiced ? 84 : 10}%`;
      $('span', bar).textContent = dayLabels[index];
    });
  }

  // Navigation and learning controls.
  $$('.nav-link').forEach(button => button.addEventListener('click', () => changeView(button.dataset.view)));
  $$('[data-go]').forEach(button => button.addEventListener('click', () => changeView(button.dataset.go)));
  $$('[data-lesson]').forEach(button => button.addEventListener('click', () => startLesson(button.dataset.lesson)));
  $('#start-quest').addEventListener('click', () => startLesson('words'));
  $('#language-select').addEventListener('change', event => accountAction({type:'language',language:event.target.value}));
  $('#speak-spotlight').addEventListener('click', () => { if (spotlightWord) speak(spotlightWord.vi); });
  $('#vocab-grid').addEventListener('click', event => {
    const speakButton = event.target.closest('[data-speak]');
    const knownButton = event.target.closest('[data-known]');
    if (speakButton) {
      const item = VOCAB.find(word => word.id === speakButton.dataset.speak);
      if (item) speak(item.vi, event.shiftKey);
    }
    if (knownButton) toggleKnown(knownButton.dataset.known);
  });
  $('#vocab-search').addEventListener('input', event => {
    searchTerm = event.target.value;
    currentPage = 1;
    renderVocab();
  });
  $('#category-select').addEventListener('change', event => {
    activeCategory = event.target.value;
    currentPage = 1;
    renderVocab();
  });
  $('#known-filter').addEventListener('change', event => {
    showKnownOnly = event.target.checked;
    currentPage = 1;
    renderVocab();
  });
  $('#vocab-load-more').addEventListener('click', () => { currentPage += 1; renderVocab(); });
  document.addEventListener('keydown', event => {
    if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      event.preventDefault();
      changeView('learn');
      $('#vocab-search').focus();
    }
  });

  $('#game-word-search').addEventListener('input', () => { gameWordPage = 1; renderGameWordPicker(); });
  $('#game-category').addEventListener('change', () => { gameWordPage = 1; renderGameWordPicker(); });
  $('#game-word-load-more').addEventListener('click', () => { gameWordPage += 1; renderGameWordPicker(); });
  $('#game-word-list').addEventListener('click', event => {
    const card = event.target.closest('[data-game-word]');
    if (card) selectGameWord(card.dataset.gameWord);
  });
  $('#shuffle-selected').addEventListener('click', () => startScramble());
  $('#change-game-word').addEventListener('click', () => {
    selectedGameWord = null;
    gameWordPage = 1;
    $('#game-word-search').value = '';
    $('#game-category').value = 'all';
    $('#game-layout').hidden = true;
    $('#word-choice-panel').hidden = false;
    renderGameWordPicker();
    $('#game-word-search').focus();
  });
  $('#scramble-letter-bank').addEventListener('click', event => {
    const tile = event.target.closest('[data-tile-id]');
    if (tile) placeScrambleTile(tile.dataset.tileId);
  });
  $('#scramble-word-slots').addEventListener('click', event => {
    const slot = event.target.closest('[data-slot-index]');
    if (slot) removeScrambleTile(Number(slot.dataset.slotIndex));
  });
  $('#reset-scramble').addEventListener('click', resetScramble);
  $('#speak-game-word').addEventListener('click', () => { if (selectedGameWord) speak(selectedGameWord.vi); });
  $('#story-next').addEventListener('click', () => {
    storyPage = storyPage === STORIES.length - 1 ? 0 : storyPage + 1;
    renderStory();
    if (storyPage === 0) toast('A story is even more fun the second time! 📖');
  });
  $('#story-prev').addEventListener('click', () => { storyPage = Math.max(0, storyPage - 1); renderStory(); });
  $('#story-listen').addEventListener('click', () => {
    const text = $('#story-text').innerText.replace(/\([^)]*\)/g, '').replace(/\s+/g, ' ');
    speak(text, true);
  });

  // Adult settings are a prototype rather than a security gate.
  const modal = $('#modal-backdrop');
  function openModal() {
    modal.hidden = false;
    $('#learner-name').value = state.nickname;
    $('#daily-goal').value = String(state.goal);
    $('#learner-name').focus();
  }
  function closeModal() { modal.hidden = true; $('#grownup-button').focus(); }
  $('#grownup-button').addEventListener('click', openModal);
  $('#profile-button').addEventListener('click', () => changeView('profile'));
  $('#modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !modal.hidden) closeModal(); });
  $('#save-settings').addEventListener('click', async () => {
    const result = await accountAction({type:'settings', nickname:$('#learner-name').value.trim(), goal:Number($('#daily-goal').value)});
    if(result){closeModal();toast('Your learning space is all set! ✨');}
  });
  $('#reset-progress').addEventListener('click', () => {
    const confirmed = window.confirm('Reset Vietnamese learning progress on this device?');
    if (!confirmed) return;
    const preserved = { language: 'vi', nickname: state.nickname, goal: state.goal };
    state = { ...initialState, ...preserved };
    saveState(); updateDashboard(); renderVocab(); toast('A fresh start! Every little step counts. 🌱');
  });
  $('#sound-toggle').addEventListener('click', () => {
    const button = $('#sound-toggle');
    const nowOn = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(nowOn));
    button.classList.toggle('is-off', !nowOn);
    button.textContent = nowOn ? '♫' : '♪';
    toast(nowOn ? 'Sound button is on. Use speaker buttons to hear Vietnamese words.' : 'The visual sound control is muted; pronunciation buttons still work.');
  });

  let identity=null;
  window.LinguaApp={ show:changeView, refresh(next,userKey) {
    const reset=identity!==userKey || state.language!==next.language;
    identity=userKey;state=next;LANG=window.LINGUA_LANGUAGES[state.language]||window.LINGUA_LANGUAGES.vi;VOCAB=LANG.words;
    if(reset){activeCategory='all';searchTerm='';showKnownOnly=false;currentPage=1;gameWordPage=1;storyPage=0;selectedGameWord=null;puzzleSolved=false;$('#vocab-search').value='';$('#game-word-search').value='';$('#known-filter').checked=false;$('#category-select').value='all';$('#game-category').value='all';$('#game-layout').hidden=true;$('#word-choice-panel').hidden=false;}
    updateDashboard();renderVocab();renderGameWordPicker();renderStory();
  }};
  initCategories();initGamePicker();updateDashboard();renderVocab();renderGameWordPicker();renderStory();
})();
