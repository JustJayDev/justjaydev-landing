
(function(){
  'use strict';
  // ===== CONFIG: add your WhatsApp number (country code + number, digits only, e.g. "919876543210") =====
  var CONFIG = { whatsapp: '', email: 'jaykumar.c2010@gmail.com' };

  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var store = { get:function(k){try{return localStorage.getItem(k)}catch(e){return null}}, set:function(k,v){try{localStorage.setItem(k,v)}catch(e){}} };

  // ===== i18n (Hindi) =====
  var HI = {
    skip:'मेरा काम देखें',nWork:'काम',nServices:'सेवाएँ',nProcess:'प्रक्रिया',nAbout:'मेरे बारे में',nFaq:'सवाल',
    ctaStart:'प्रोजेक्ट शुरू करें',ctaStartArrow:'प्रोजेक्ट शुरू करें →',avail:'नए प्रोजेक्ट ले रहा हूँ · 24 घंटे में जवाब',
    heroH:'वेबसाइट जो <span class="strike">सेकंडों</span> <span class="hl">पलक झपकते</span> खुले।',
    heroP:'मैं जय हूँ, एक स्वयं-सीखा डेवलपर। मैं भारतीय दुकानों, क्लिनिक, क्रिएटर्स और गेमिंग टीमों के लिए तेज़, आधुनिक वेबसाइट और इंस्टॉल होने वाले वेब ऐप बनाता हूँ, अंग्रेज़ी और हिंदी दोनों में।',
    ctaAudit:'मुफ़्त वेबसाइट ऑडिट पाएँ',ctaWork:'मेरा काम देखें',pr1:'पेज साइज़',pr2:'द्विभाषी',pr3:'ऑटोमेटेड टेस्ट (शॉप ऐप)',pr4:'इंस्टॉल होने वाला ऐप',
    idRole:'भूमिका',idRoleV:'वेब डेवलपर',idStack:'टेक',idSpec:'खासियत',idSpecV:'तेज़ साइट · PWA',idStatus:'स्थिति',idStatusV:'● उपलब्ध',
    spLbl:'यह पेज खुला',spNote:'आपके ब्राउज़र में अभी मापा गया। आपकी साइट भी इतनी तेज़ हो सकती है।',
    kWork:'चुनिंदा काम',workH:'बनाया, टेस्ट किया,<br><span class="hl">लाइव।</span>',workP:'असली प्रोजेक्ट जिन्हें आप खोलकर आज़मा सकते हैं।',
    tFood:'फ़ूड और रिटेल',c1P:'फ़ूड शॉप के लिए द्विभाषी ऑर्डरिंग ऐप। ग्राहक फ़ोन से मेन्यू देखकर ऑर्डर करते हैं, और मालिक एडमिन पैनल से आइटम संभालता है।',
    c1a:'इंस्टॉल होने वाला PWA, बिना प्ले स्टोर के ऐप जैसा अनुभव',c1b:'पूरा अंग्रेज़ी और हिंदी इंटरफ़ेस',c1c:'दुकान मालिक के लिए एडमिन पैनल',c1d:'363 ऑटोमेटेड टेस्ट, ताकि अपडेट से ऑर्डरिंग न टूटे',live:'लाइव डेमो खोलें',
    tConcept:'कॉन्सेप्ट रीडिज़ाइन',tHealth:'हेल्थकेयर',c2H:'डेंटल क्लिनिक, दिल्ली',c2P:'एक असली क्लिनिक की वेबसाइट पर सुरक्षा एरर था और टेम्पलेट का टेक्स्ट व नकली डॉक्टर अब भी दिख रहे थे। मैंने उसे ऐसा रीडिज़ाइन किया कि विज़िटर अपॉइंटमेंट बुक करें।',
    c2a:'क्लिनिक के समय के हिसाब से लाइव "खुला / बंद" बैज',c2b:'बुकिंग फ़ॉर्म जो तैयार WhatsApp मैसेज भेजता है',c2c:'फ़िल्टर होने वाले इलाज, डॉक्टर प्रोफ़ाइल और FAQ',c2d:'मोबाइल पर कॉल / WhatsApp / बुक बार',c2Btn:'ऐसी साइट चाहिए?',
    tBrand:'पर्सनल ब्रांड',tAndroid:'एंड्रॉइड पर बनाया',c3P:'प्रोजेक्ट्स, प्लगइन्स और टूल्स के लिए मेरा ब्रांड। यह पूरी साइट मैंने एंड्रॉइड फ़ोन पर बनाई, और फिर भी यह पलक झपकते खुलती है।',
    c3a:'100 KB से कम, बिना फ़्रेमवर्क और बिना फ़ालतू कोड',c3b:'ऑफ़लाइन चलती है, होम स्क्रीन पर इंस्टॉल होती है',c3c:'SEO, शेयर प्रीव्यू और स्ट्रक्चर्ड डेटा शामिल',gh:'GitHub पर देखें',
    tGame:'गेमिंग',tFF:'Free Fire MAX',tNoVoice:'बिना कमेंट्री',
    c4P:'मेरा Free Fire MAX गेमप्ले चैनल — बिना कमेंट्री, सिर्फ़ायर। क्लच, स्नाइप और सेटिंग्स गाइड, काइज़ेन की भावना में रोज़ 1% बेहतर होने के लिए।',
    c4a:'1v4 और स्नाइपर क्लच हाइलाइट्स',c4b:'Free Fire MAX सेंसिटिविटी और सेटिंग्स गाइड',c4c:'बिना कमेंट्री साफ़ गेमप्ले, टेक्स्ट ओवरले के साथ',c4Btn:'चैनल खोलें',
    kSvc:'सेवाएँ',svcH:'मैं आपके लिए<br><span class="hl">क्या बना सकता हूँ।</span>',svcP:'साफ़ स्कोप, तय कीमत, कोई उलझाने वाली तकनीकी बातें नहीं। बस ऐसी साइट जो आपके बिज़नेस के काम आए।',
    s1H:'बिज़नेस वेबसाइट',s1P:'आपकी दुकान, क्लिनिक, इंस्टिट्यूट या सर्विस के लिए आधुनिक साइट, जो हर फ़ोन पर बढ़िया दिखे।',s1a:'5 पेज तक',s1b:'WhatsApp और कॉल बटन',s1c:'Google Maps और समय',
    s2H:'वेबसाइट रीवैम्प',s2P:'पुरानी, धीमी या टूटी साइट? मैं उसे तेज़ और आधुनिक बनाता हूँ, आपका कंटेंट और Google रैंकिंग बचाकर।',s2a:'पहले मुफ़्त ऑडिट',s2b:'स्पीड और सुरक्षा सुधार',s2c:'नया डिज़ाइन, वही URL',
    s3H:'वेब ऐप और PWA',s3P:'ऑर्डरिंग, बुकिंग या कैटलॉग ऐप जो असली ऐप की तरह इंस्टॉल हों, बिना प्ले स्टोर के।',s3a:'एडमिन पैनल',s3b:'ऑफ़लाइन चलता है',s3c:'लॉन्च से पहले टेस्टेड',
    s4H:'गेमिंग और क्रिएटर साइट',s4P:'ईस्पोर्ट्स टीमों और क्रिएटर्स के लिए टीम पेज, रोस्टर, शेड्यूल और लिंक हब, उसी स्टाइल में जो आपकी कम्युनिटी पसंद करे।',s4a:'रोस्टर और मैच पेज',s4b:'सोशल और स्ट्रीम लिंक',s4c:'बोल्ड, कस्टम लुक',
    inclLbl:'हर प्रोजेक्ट में:',i1:'मोबाइल-फ़र्स्ट',i2:'तेज़ लोडिंग',i3:'SEO बेसिक्स',i4:'HTTPS',i5:'अंग्रेज़ी / हिंदी',i6:'1 महीने मुफ़्त सुधार',
    kWhy:'यह क्यों ज़रूरी है',whyH:'ज़्यादातर छोटे बिज़नेस की साइटें<br><span class="hl">ग्राहक खो रही हैं।</span>',badH:'// आम टेम्पलेट साइट',goodH:'// जय की बनाई साइट',
    b1:'भारी थीम और प्लगइन, मोबाइल डेटा पर धीमी',b2:'बचा हुआ "Lorem ipsum" और डेमो कंटेंट',b3:'कॉल, WhatsApp या बुकिंग का साफ़ रास्ता नहीं',b4:'एक्सपायर्ड सुरक्षा सर्टिफ़िकेट की चेतावनी',b5:'सिर्फ़ अंग्रेज़ी, जिससे हिंदी पसंद करने वाले ग्राहक छूट जाते हैं',
    g1:'हाथ से लिखा, हल्का कोड, जो 4G पर भी तुरंत खुले',g2:'आपका असली कंटेंट, बेचने के लिए लिखा गया',g3:'WhatsApp, कॉल और बुकिंग बस एक टैप पर',g4:'HTTPS और साफ़, सुरक्षित सेटअप',g5:'ज़रूरत हो तो द्विभाषी',
    kProc:'प्रक्रिया',procH:'आइडिया से लाइव तक<br><span class="hl">4 कदमों में।</span>',
    p1H:'मुफ़्त ऑडिट',p1P:'मैं आपकी साइट या आइडिया देखकर ईमानदार सुधार-सूची भेजता हूँ।',p1T:'~24 घंटे',p2H:'डिज़ाइन प्रीव्यू',p2P:'बड़ा भुगतान करने से पहले आप अपने नए होमपेज का असली प्रीव्यू देखते हैं।',p2T:'2–4 दिन',
    p3H:'बनाना और टेस्ट',p3P:'हर पेज बनाकर असली फ़ोन, धीमे नेटवर्क और दोनों भाषाओं पर टेस्ट करता हूँ।',p3T:'1–2 हफ़्ते',p4H:'लॉन्च और सपोर्ट',p4P:'आपके डोमेन पर लाइव करता हूँ, Google सेटअप करता हूँ, और एक महीने तक मुफ़्त सुधार करता हूँ।',p4T:'लॉन्च +30 दिन',
    kAbout:'मेरे बारे में',aboutH:'लोग इसे नामुमकिन कहते हैं।<br><span class="hl">मैं इसे अटल कहता हूँ।</span>',
    aboutP1:'मैं एक स्वयं-सीखा डेवलपर हूँ। खुलेआम सीखता हूँ और शून्य से बनाता हूँ। यह साइट भी मैंने एंड्रॉइड फ़ोन पर बनाई है।',
    aboutP2:'स्क्रीन से हटकर, मैं Team Quantum Gaming का IGL (इन-गेम लीडर) हूँ। दबाव में फ़ैसले लेने से मैंने वही सीखा जो क्लाइंट सबसे ज़्यादा चाहते हैं: साफ़ प्लान, तेज़ बातचीत और काम पूरा करना।',
    f1:'हाथ से कोड, कोई पेज बिल्डर नहीं',f2:'भाषाएँ: अंग्रेज़ी और हिंदी',f3:'नई पूछताछ पर जवाब',
    kFaq:'सवाल',faqH:'सवाल,<br><span class="hl">जवाब।</span>',faqP:'आपका सवाल नहीं मिला? बस मैसेज करें, 24 घंटे में जवाब दूँगा।',
    q1:'वेबसाइट की कीमत कितनी है?',a1:'यह पेज और फ़ीचर्स पर निर्भर करता है। मुफ़्त ऑडिट के बाद आपको तय कीमत मिलती है, कोई अचानक बिल नहीं। छोटे बिज़नेस की साइटें किफ़ायती रखी जाती हैं।',
    q2:'कितना समय लगता है?',a2:'आम बिज़नेस साइट प्रीव्यू मंज़ूर होने के बाद 1–2 हफ़्ते में लाइव होती है। एडमिन पैनल वाले ऐप में ज़्यादा समय लगता है, और आपको पहले ही साफ़ टाइमलाइन मिलेगी।',
    q3:'क्या मेरी साइट हिंदी में भी हो सकती है?',a3:'हाँ। मैं एक टैप भाषा-स्विच वाली अंग्रेज़ी-हिंदी साइट बनाता हूँ, बिल्कुल इस साइट की तरह।',
    q4:'क्या आप डोमेन और होस्टिंग संभालते हैं?',a4:'हाँ। मैं डोमेन, मुफ़्त या सस्ती होस्टिंग और HTTPS सेट कर सकता हूँ, ताकि आपको कुछ तकनीकी न छूना पड़े।',
    q5:'अगर मेरी पहले से वेबसाइट है तो?',a5:'बढ़िया! मुफ़्त ऑडिट से शुरू करें। मैं दिखाऊँगा कि क्या उसे धीमा कर रहा है या ग्राहक खो रहा है, और सुधार ठीक रहेगा या पूरा रीवैम्प।',
    kContact:'संपर्क',cH:'चलिए कुछ<br><span class="hl">तेज़</span> बनाते हैं।',cP:'अपने बिज़नेस के बारे में बताएँ। मैं 24 घंटे में मुफ़्त ऑडिट या प्लान के साथ जवाब दूँगा।',
    copy:'कॉपी',copied:'कॉपी हो गया ✓',fName:'आपका नाम',fBiz:'बिज़नेस का नाम',fSite:'मौजूदा वेबसाइट (अगर है)',fNeed:'आपको क्या चाहिए?',
    ch1:'मुफ़्त ऑडिट',ch2:'नई वेबसाइट',ch3:'रीवैम्प',ch4:'वेब ऐप / PWA',ch5:'गेमिंग साइट',fMsg:'और कुछ?',fSend:'पूछताछ भेजें',
    fNote:'आपका ईमेल ऐप तैयार मैसेज के साथ खुलेगा। कोई स्पैम नहीं।',fNoteWa:'WhatsApp तैयार मैसेज के साथ खुलेगा। कोई स्पैम नहीं।',
    sH:'बस हो गया!',sBtn:'मैसेज भेजें',sEdit:'बदलें',
    tWelcome:'अरे, आपने टर्मिनल ढूँढ लिया। help लिखें।',foot:'एंड्रॉइड पर बनाया · हाथ से कोड · © __Y__ जय (JustJayDev)',top:'ऊपर जाएँ ↑',mMail:'ईमेल',ctaAuditShort:'मुफ़्त ऑडिट →',
    errName:'कृपया अपना नाम लिखें।',errBiz:'कृपया बिज़नेस का नाम लिखें।',errSite:'कृपया सही वेबसाइट पता लिखें (जैसे example.com)।',sentP:'आपका मैसेज तैयार है। भेजने के लिए नीचे टैप करें।',termHelp:'कमांड:\n  whoami    मैं कौन हूँ\n  services  मैं क्या बनाता हूँ\n  projects  बनाए हुए प्रोजेक्ट\n  hire      प्रोजेक्ट शुरू करें\n  contact   संपर्क करें\n  clear     स्क्रीन साफ़ करें',termWhoami:'जय · @JustJayDev\nस्वयं-सीखा वेब डेवलपर। IGL @ Team Quantum Gaming (#07)।\nशून्य से बनाता हूँ। जिसे लोग नामुमकिन कहते हैं, वह करता हूँ।',termServices:'01 बिज़नेस वेबसाइट\n02 वेबसाइट रीवैम्प\n03 वेब ऐप और PWA\n04 गेमिंग और क्रिएटर साइट',termProjects:'shop-template   द्विभाषी फ़ूड-शॉप PWA · 363 टेस्ट\nNightForge      github.com/nightforgeio\nKaizenFF       youtube.com/@kaizenff.official\nयह साइट        एंड्रॉइड पर बनी · <100 KB',termContact:'ईमेल: ',termSudo:'बढ़िया कोशिश। आप sudoers फ़ाइल में नहीं हैं।\nयह घटना दर्ज की जाएगी। 😏',termHire:'संपर्क फ़ॉर्म खोल रहा हूँ...',termNotFound:'कमांड नहीं मिली: ',termTryHelp:'. help लिखें',termWa:'व्हाट्सएप: +'
  };
  var EN_EXTRA = { copied:'copied ✓', fNoteWa:'Opens WhatsApp with the message ready. No spam, ever.', errName:'Please enter your name.', errBiz:'Please enter your business name.', errSite:'Please enter a valid website (e.g. example.com).', sentP:'Your message is ready. Tap below to send it.', termHelp:'commands:\n  whoami    who I am\n  services  what I build\n  projects  shipped work\n  hire      start a project\n  contact   reach me\n  clear     clear screen', termWhoami:'Jay · @JustJayDev\nSelf-taught web developer. IGL @ Team Quantum Gaming (#07).\nBuilds from scratch. Ships what others call impossible.', termServices:'01 business websites\n02 website revamps\n03 web apps & PWAs\n04 gaming & creator sites', termProjects:'shop-template   bilingual food-shop PWA · 363 tests\nNightForge      github.com/nightforgeio\nKaizenFF       youtube.com/@kaizenff.official\nthis site       built on android · <100 KB', termContact:'email: ', termSudo:'nice try. you are not in the sudoers file.\nthis incident will be reported. 😏', termHire:'opening contact form...', termNotFound:'command not found: ', termTryHelp:'. try help', termWa:'whatsapp: +' };
  var EN = {};
  document.querySelectorAll('[data-i18n]').forEach(function(el){ EN[el.getAttribute('data-i18n')] = el.textContent; });
  document.querySelectorAll('[data-i18n-html]').forEach(function(el){ EN[el.getAttribute('data-i18n-html')] = el.innerHTML; });
  for (var k in EN_EXTRA) EN[k] = EN_EXTRA[k];
  var lang = store.get('jjd-lang') === 'hi' ? 'hi' : 'en';
  function T(key){ var d = lang === 'hi' ? HI : EN; var v = d[key] !== undefined ? d[key] : EN[key]; return String(v).replace('__Y__', new Date().getFullYear()); }
  var langBtn = document.getElementById('langBtn');
  function applyLang(){
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var key = el.getAttribute('data-i18n');
      if (key === 'foot') { el.innerHTML = T('foot').replace(/(\d{4})/, '<span id="yr">$1</span>'); return; }
      el.textContent = T(key);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function(el){ el.innerHTML = T(el.getAttribute('data-i18n-html')); });
    langBtn.textContent = lang === 'en' ? 'हिन्दी' : 'EN';
    langBtn.setAttribute('aria-label', lang === 'en' ? 'Switch language to Hindi' : 'Switch language to English');
    updateNote();
  }
  langBtn.addEventListener('click', function(){ lang = lang === 'en' ? 'hi' : 'en'; store.set('jjd-lang', lang); applyLang(); });

  // ===== contact channel note =====
  var hasWa = /^\d{10,15}$/.test(CONFIG.whatsapp);
  function updateNote(){ var n = document.getElementById('sendNote'); if (n) n.textContent = T(hasWa ? 'fNoteWa' : 'fNote'); }
  if (hasWa) {
    var alt = document.getElementById('mbarAlt');
    alt.href = 'https://wa.me/' + CONFIG.whatsapp; alt.target = '_blank'; alt.rel = 'noopener';
    alt.querySelector('span').setAttribute('data-i18n','mWa'); EN.mWa = 'WhatsApp'; HI.mWa = 'WhatsApp';
  }

  // ===== nav: scroll state, progress, active link, mobile bar =====
  var nav = document.getElementById('nav'), prog = document.getElementById('progress'), mbar = document.getElementById('mbar');
  var secs = ['work','services','process','about','faq'].map(function(id){ return document.getElementById(id); });
  var navLinks = document.querySelectorAll('.links a');
  var ticking = false;
  function onScroll(){
    var y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
    nav.classList.toggle('scrolled', y > 8);
    prog.style.width = (h > 0 ? y / h * 100 : 0) + '%';
    mbar.classList.toggle('show', y > innerHeight * 0.6 && (document.getElementById('contact').getBoundingClientRect().top > innerHeight * 0.5));
    var tt = document.getElementById('toTop'); if (tt) { var show = y > innerHeight * 0.8; tt.classList.toggle('show', show); tt.hidden = !show; }
    var cur = '';
    secs.forEach(function(s){ if (s && s.getBoundingClientRect().top < innerHeight * 0.4) cur = s.id; });
    navLinks.forEach(function(a){
      var on = a.getAttribute('href') === '#' + cur;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    ticking = false;
  }
  addEventListener('scroll', function(){ if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // ===== mobile menu =====
  var burger = document.getElementById('burger'), mm = document.getElementById('mmenu');
  function setMenu(o){ mm.classList.toggle('open', o); mm.inert = !o; burger.setAttribute('aria-expanded', o); burger.setAttribute('aria-label', o ? 'Close menu' : 'Open menu'); }
  burger.addEventListener('click', function(){ setMenu(!mm.classList.contains('open')); });
  mm.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ setMenu(false); }); });
  addEventListener('keydown', function(e){ if (e.key === 'Escape') setMenu(false); });
  var toTop = document.getElementById('toTop'); if (toTop) toTop.addEventListener('click', function(){ window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
  // ===== live load time =====
  function showSpeed(){
    var v = document.getElementById('speedVal'), ms = 0;
    try { var n = performance.getEntriesByType('navigation')[0]; if (n) ms = n.domContentLoadedEventEnd || n.loadEventEnd; } catch(e){}
    if (!ms && performance.timing) ms = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
    if (ms > 0 && ms < 60000) v.textContent = ms < 1000 ? Math.round(ms) + ' ms' : (ms/1000).toFixed(2) + ' s';
    else v.textContent = '< 1 s';
  }
  if (document.readyState === 'complete') setTimeout(showSpeed, 0); else addEventListener('load', function(){ setTimeout(showSpeed, 0); });

  // ===== reveal =====
  var hh = document.querySelector('.hero-h');
  var rv = document.querySelectorAll('.rv');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      var rvi = 0;
      rv.forEach(function(el){ el.style.transitionDelay = Math.min(rvi++ * 60, 360) + 'ms'; io.observe(el); });
    if (hh) setTimeout(function(){ hh.classList.add('in'); }, 260);
  } else { rv.forEach(function(el){ el.classList.add('in'); }); if (hh) hh.classList.add('in'); }

  // ===== copy email =====
  var copyBtn = document.getElementById('copyBtn');
  copyBtn.addEventListener('click', function(){
    function done(){ copyBtn.textContent = T('copied'); setTimeout(function(){ copyBtn.textContent = T('copy'); }, 2000); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(CONFIG.email).then(done, done); else done();
  });

  // ===== contact form =====
  var chips = document.querySelectorAll('#needChips .chip');
  chips.forEach(function(c){ c.addEventListener('click', function(){ chips.forEach(function(x){ x.setAttribute('aria-pressed','false'); }); c.setAttribute('aria-pressed','true'); }); });
  var cf = document.getElementById('cf'), sent = document.getElementById('sent');
  function err(id, msg){ var f = document.getElementById(id).closest('.fld'); f.classList.toggle('bad', !!msg); f.querySelector('.err').textContent = msg || ''; }
  cf.addEventListener('submit', function(e){
    e.preventDefault();
    var name = document.getElementById('cName').value.trim(), biz = document.getElementById('cBiz').value.trim();
    var site = document.getElementById('cSite').value.trim(), msg = document.getElementById('cMsg').value.trim();
    var need = document.querySelector('#needChips .chip[aria-pressed="true"]').getAttribute('data-v');
    var ok = true;
    if (name.length < 2) { err('cName', T('errName')); ok = false; } else err('cName', '');
    if (biz.length < 2) { err('cBiz', T('errBiz')); ok = false; } else err('cBiz', '');
    if (site) {
      var siteCheck = site.replace(/^https?:\/\//i, '');
      var siteValid = /^[a-z0-9]([a-z0-9.-]*[a-z0-9])?(\.[a-z]{2,})([/:?#].*)?$/i.test(siteCheck);
      if (!siteValid) { err('cSite', T('errSite')); ok = false; } else err('cSite', '');
    }
    if (!ok) { var f = cf.querySelector('.bad input'); if (f) f.focus(); return; }
    var body = 'Hi Jay,\n\nName: ' + name + '\nBusiness: ' + biz + (site ? '\nWebsite: ' + site : '') + '\nNeed: ' + need + (msg ? '\n\n' + msg : '') + '\n';
    var link = hasWa ? 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(body)
                     : 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent(need + ' – ' + biz) + '&body=' + encodeURIComponent(body);
    document.getElementById('sendLink').href = link;
    document.getElementById('sentP').textContent = T('sentP');
    cf.style.display = 'none'; sent.style.display = 'flex'; sent.focus();
  });
  document.getElementById('editBtn').addEventListener('click', function(){ sent.style.display = 'none'; cf.style.display = 'grid'; document.getElementById('cName').focus(); });

  // ===== terminal easter egg =====
  var tb = document.getElementById('termBody'), ti = document.getElementById('termIn');
  function cmdFor(c){
    if (c === 'contact') return T('termContact') + CONFIG.email + (hasWa ? '\n' + T('termWa') + CONFIG.whatsapp : '');
    var map = { help:'termHelp', whoami:'termWhoami', services:'termServices', projects:'termProjects', sudo:'termSudo' };
    return map[c] ? T(map[c]) : null;
  }
  var hist = [], hi = 0;
  function print(t, cls){ String(t).split('\n').forEach(function(l){ var p = document.createElement('p'); p.className = 'term-line' + (cls ? ' ' + cls : ''); p.textContent = l; tb.appendChild(p); }); tb.scrollTop = tb.scrollHeight; }
  function run(raw){
    var c = raw.trim().toLowerCase(); if (!c) return;
    print(c, 'echo');
    if (c === 'clear') { tb.innerHTML = ''; return; }
    if (c === 'hire') { print(T('termHire')); sent.style.display = 'none'; cf.style.display = 'grid'; setTimeout(function(){ document.getElementById('contact').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); document.getElementById('cName').focus({ preventScroll: true }); }, 400); return; }
    if (c.indexOf('sudo') === 0) { print(T('termSudo')); return; }
    var r = cmdFor(c);
    print(r !== null ? r : (T('termNotFound') + c + T('termTryHelp')));
  }
  ti.addEventListener('keydown', function(e){
    if (e.key === 'Enter') { if (ti.value.trim()) { hist.push(ti.value); hi = hist.length; } run(ti.value); ti.value = ''; }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (hi > 0) ti.value = hist[--hi]; }
    else if (e.key === 'ArrowDown') { e.preventDefault(); if (hi < hist.length - 1) ti.value = hist[++hi]; else { hi = hist.length; ti.value = ''; } }
  });
  document.querySelectorAll('.term-hint button').forEach(function(b){ b.addEventListener('click', function(){ run(b.getAttribute('data-cmd')); }); });

  // ===== service worker (offline + install) =====
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    addEventListener('load', function(){
      navigator.serviceWorker.register('sw.js').catch(function(){});
    });
  }

  applyLang();
})();
