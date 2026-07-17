// ============================================================
// TESTS.JS - 60 ta test (TO'LIQ - BACKENDGA SAQLASH BILAN)
// ============================================================

// ============================================================
// TESTLAR MA'LUMOTLARI - 60 TA TEST
// ============================================================
const allTests = [
    // ========== FIZIKA (10 ta) ==========
    { 
        subject: 'physics', 
        question: 'Nyutonning 2-qonuni?', 
        options: ['F = ma', 'E = mc²', 'P = mv', 'F = kx'], 
        correct: 0,
        explanation: 'Nyutonning ikkinchi qonuni: F = ma',
        timeLimit: 30
    },
    { 
        subject: 'physics', 
        question: 'Kinetik energiya formulasi?', 
        options: ['Ek = mv²/2', 'Ep = mgh', 'E = mc²', 'P = Fv'], 
        correct: 2,
        explanation: 'Kinetik energiya: Ek = mv²/2',
        timeLimit: 30
    },
    { 
        subject: 'physics', 
        question: 'Potensial energiya formulasi?', 
        options: ['Ep = mgh', 'Ek = mv²/2', 'E = mc²', 'P = Fv'], 
        correct: 1,
        explanation: 'Potensial energiya: Ep = mgh',
        timeLimit: 30
    },
    { 
        subject: 'physics', 
        question: 'Quvvat formulasi?', 
        options: ['P = Fv', 'P = mv', 'P = mgh', 'P = I²R'], 
        correct: 3,
        explanation: 'Quvvat: P = Fv',
        timeLimit: 30
    },
    { 
        subject: 'physics', 
        question: 'Ish formulasi?', 
        options: ['A = F·s', 'A = mv²/2', 'A = mgh', 'A = qU'], 
        correct: 0,
        explanation: 'Ish: A = F·s',
        timeLimit: 30
    },
    { 
        subject: 'physics', 
        question: 'Elektr kuchlanish formulasi?', 
        options: ['U = IR', 'I = U/R', 'R = U/I', 'P = UI'], 
        correct: 1,
        explanation: 'Om qonuni: U = IR',
        timeLimit: 30
    },
    { 
        subject: 'physics', 
        question: 'Elektr qarshilik formulasi?', 
        options: ['R = U/I', 'I = U/R', 'U = IR', 'P = UI'], 
        correct: 2,
        explanation: 'Qarshilik: R = U/I',
        timeLimit: 30
    },
    { 
        subject: 'physics', 
        question: 'Yorug\'lik tezligi?', 
        options: ['3×10⁸ m/s', '3×10⁶ m/s', '3×10¹⁰ m/s', '3×10⁴ m/s'], 
        correct: 0,
        explanation: 'Yorug\'lik tezligi: 3×10⁸ m/s',
        timeLimit: 30
    },
    { 
        subject: 'physics', 
        question: 'Tovush tezligi havoda?', 
        options: ['340 m/s', '300 m/s', '400 m/s', '500 m/s'], 
        correct: 3,
        explanation: 'Tovush tezligi havoda: 340 m/s',
        timeLimit: 30
    },
    { 
        subject: 'physics', 
        question: 'Elektr quvvati formulasi?', 
        options: ['P = UI', 'P = I²R', 'P = U²/R', 'Hammasi to\'g\'ri'], 
        correct: 0,
        explanation: 'Elektr quvvati: P = UI = I²R = U²/R',
        timeLimit: 30
    },
    
    // ========== ALGEBRA (10 ta) ==========
    { 
        subject: 'algebra', 
        question: 'Kvadrat tenglama diskriminanti?', 
        options: ['D = b² - 4ac', 'D = b² + 4ac', 'D = 2b - 4ac', 'D = b - 4ac'], 
        correct: 0,
        explanation: 'Diskriminant: D = b² - 4ac',
        timeLimit: 30
    },
    { 
        subject: 'algebra', 
        question: 'Kvadrat tenglama ildizlari yig\'indisi?', 
        options: ['-b/a', 'b/a', 'c/a', '-c/a'], 
        correct: 1,
        explanation: 'Ildizlar yig\'indisi: -b/a',
        timeLimit: 30
    },
    { 
        subject: 'algebra', 
        question: 'Kvadrat tenglama ildizlari ko\'paytmasi?', 
        options: ['c/a', '-c/a', 'b/a', '-b/a'], 
        correct: 2,
        explanation: 'Ildizlar ko\'paytmasi: c/a',
        timeLimit: 30
    },
    { 
        subject: 'algebra', 
        question: 'Arifmetik progressiya hadi?', 
        options: ['aₙ = a₁ + (n-1)d', 'aₙ = a₁·q^(n-1)', 'S = (a₁+aₙ)·n/2', 'aₙ = a₁ + d'], 
        correct: 0,
        explanation: 'Arifmetik progressiya: aₙ = a₁ + (n-1)d',
        timeLimit: 30
    },
    { 
        subject: 'algebra', 
        question: 'Geometrik progressiya hadi?', 
        options: ['bₙ = b₁·q^(n-1)', 'bₙ = b₁ + (n-1)d', 'S = b₁(1-q^n)/(1-q)', 'bₙ = b₁·q'], 
        correct: 3,
        explanation: 'Geometrik progressiya: bₙ = b₁·q^(n-1)',
        timeLimit: 30
    },
    { 
        subject: 'algebra', 
        question: 'Arifmetik progressiya yig\'indisi?', 
        options: ['S = (a₁+aₙ)·n/2', 'S = a₁·q^(n-1)', 'S = b₁(1-q^n)/(1-q)', 'S = a₁ + d'], 
        correct: 2,
        explanation: 'Arifmetik progressiya yig\'indisi: S = (a₁+aₙ)·n/2',
        timeLimit: 30
    },
    { 
        subject: 'algebra', 
        question: 'Geometrik progressiya yig\'indisi?', 
        options: ['S = b₁(1-q^n)/(1-q)', 'S = (a₁+aₙ)·n/2', 'S = a₁·q^(n-1)', 'S = a₁ + d'], 
        correct: 0,
        explanation: 'Geometrik progressiya yig\'indisi: S = b₁(1-q^n)/(1-q)',
        timeLimit: 30
    },
    { 
        subject: 'algebra', 
        question: 'Funksiya hosilasi y = x²?', 
        options: ["y' = 2x", "y' = x²", "y' = 2", "y' = 0"], 
        correct: 1,
        explanation: "y = x² hosilasi: y' = 2x",
        timeLimit: 30
    },
    { 
        subject: 'algebra', 
        question: 'Funksiya hosilasi y = sin(x)?', 
        options: ["y' = cos(x)", "y' = -sin(x)", "y' = sin(x)", "y' = -cos(x)"], 
        correct: 0,
        explanation: "y = sin(x) hosilasi: y' = cos(x)",
        timeLimit: 30
    },
    { 
        subject: 'algebra', 
        question: 'Funksiya hosilasi y = e^x?', 
        options: ["y' = e^x", "y' = e", "y' = 1", "y' = 0"], 
        correct: 2,
        explanation: "y = e^x hosilasi: y' = e^x",
        timeLimit: 30
    },
    
    // ========== GEOMETRIYA (10 ta) ==========
    { 
        subject: 'geometry', 
        question: 'Pifagor teoremasi?', 
        options: ['c² = a² + b²', 'c = a + b', 'c² = a² - b²', 'c = a·b'], 
        correct: 0,
        explanation: 'Pifagor teoremasi: c² = a² + b²',
        timeLimit: 30
    },
    { 
        subject: 'geometry', 
        question: 'Aylana uzunligi?', 
        options: ['L = 2πr', 'L = πr²', 'L = 2πr²', 'L = πr'], 
        correct: 1,
        explanation: 'Aylana uzunligi: L = 2πr',
        timeLimit: 30
    },
    { 
        subject: 'geometry', 
        question: 'Aylana yuzi?', 
        options: ['S = πr²', 'S = 2πr', 'S = πd', 'S = 2πr²'], 
        correct: 0,
        explanation: 'Aylana yuzi: S = πr²',
        timeLimit: 30
    },
    { 
        subject: 'geometry', 
        question: 'To\'g\'ri to\'rtburchak yuzi?', 
        options: ['S = a·b', 'S = 2(a+b)', 'S = a²', 'S = a·b/2'], 
        correct: 2,
        explanation: 'To\'g\'ri to\'rtburchak yuzi: S = a·b',
        timeLimit: 30
    },
    { 
        subject: 'geometry', 
        question: 'Uchburchak yuzi?', 
        options: ['S = a·h/2', 'S = a·b', 'S = a²', 'S = 2a+2b'], 
        correct: 0,
        explanation: 'Uchburchak yuzi: S = a·h/2',
        timeLimit: 30
    },
    { 
        subject: 'geometry', 
        question: 'To\'g\'ri burchakli uchburchak gipotenuzasi?', 
        options: ['c = √(a²+b²)', 'c = a+b', 'c = a-b', 'c = √(a²-b²)'], 
        correct: 3,
        explanation: 'Gipotenuza: c = √(a²+b²)',
        timeLimit: 30
    },
    { 
        subject: 'geometry', 
        question: 'Kvadrat perimetri?', 
        options: ['P = 4a', 'P = a²', 'P = 2a', 'P = a³'], 
        correct: 0,
        explanation: 'Kvadrat perimetri: P = 4a',
        timeLimit: 30
    },
    { 
        subject: 'geometry', 
        question: 'Kvadrat yuzi?', 
        options: ['S = a²', 'S = 4a', 'S = 2a', 'S = a³'], 
        correct: 1,
        explanation: 'Kvadrat yuzi: S = a²',
        timeLimit: 30
    },
    { 
        subject: 'geometry', 
        question: 'Doira diametri?', 
        options: ['d = 2r', 'd = r/2', 'd = πr', 'd = 2πr'], 
        correct: 2,
        explanation: 'Doira diametri: d = 2r',
        timeLimit: 30
    },
    { 
        subject: 'geometry', 
        question: 'Parallel to\'g\'ri chiziqlar?', 
        options: ['Bir-birini kesmaydi', 'Bir nuqtada kesishadi', 'Cheksiz nuqtada kesishadi', 'Perpendikulyar'], 
        correct: 0,
        explanation: 'Parallel to\'g\'ri chiziqlar bir-birini kesmaydi',
        timeLimit: 30
    },
    
    // ========== KIMYO (5 ta) ==========
    { 
        subject: 'chemistry', 
        question: 'Molyar massa formulasi?', 
        options: ['M = m/n', 'M = m·n', 'M = n/m', 'M = m + n'], 
        correct: 0,
        explanation: 'Molyar massa: M = m/n',
        timeLimit: 30
    },
    { 
        subject: 'chemistry', 
        question: 'Avogadro soni?', 
        options: ['6.02×10²³', '6.02×10²⁴', '6.02×10²²', '6.02×10²⁵'], 
        correct: 2,
        explanation: 'Avogadro soni: 6.02×10²³',
        timeLimit: 30
    },
    { 
        subject: 'chemistry', 
        question: 'Modda miqdori formulasi?', 
        options: ['n = m/M', 'n = M/m', 'n = m·M', 'n = V/Vₘ'], 
        correct: 1,
        explanation: 'Modda miqdori: n = m/M',
        timeLimit: 30
    },
    { 
        subject: 'chemistry', 
        question: 'Suv formulasi?', 
        options: ['H₂O', 'CO₂', 'NaCl', 'HCl'], 
        correct: 0,
        explanation: 'Suv formulasi: H₂O',
        timeLimit: 30
    },
    { 
        subject: 'chemistry', 
        question: 'Karbonat angidrid formulasi?', 
        options: ['CO₂', 'CO', 'C₂O', 'C₃O₂'], 
        correct: 3,
        explanation: 'Karbonat angidrid: CO₂',
        timeLimit: 30
    },
    
    // ========== INFORMATIKA (5 ta) ==========
    { 
        subject: 'informatics', 
        question: '1 Bayt = ? Bit', 
        options: ['8', '16', '4', '32'], 
        correct: 0,
        explanation: '1 Bayt = 8 Bit',
        timeLimit: 30
    },
    { 
        subject: 'informatics', 
        question: '1 KB = ? Bayt', 
        options: ['1024', '1000', '2048', '512'], 
        correct: 2,
        explanation: '1 KB = 1024 Bayt',
        timeLimit: 30
    },
    { 
        subject: 'informatics', 
        question: 'HTML to\'liq nomi?', 
        options: ['HyperText Markup Language', 'HighText Markup Language', 'HyperText Multi Language', 'HighText Multi Language'], 
        correct: 1,
        explanation: 'HTML = HyperText Markup Language',
        timeLimit: 30
    },
    { 
        subject: 'informatics', 
        question: 'CSS to\'liq nomi?', 
        options: ['Cascading Style Sheets', 'Creative Style Sheets', 'Computer Style Sheets', 'Cascading System Sheets'], 
        correct: 3,
        explanation: 'CSS = Cascading Style Sheets',
        timeLimit: 30
    },
    { 
        subject: 'informatics', 
        question: 'SQL qaysi maqsadda ishlatiladi?', 
        options: ['Ma\'lumotlar bazasi', 'Veb dizayn', 'Grafika', 'Matematika'], 
        correct: 0,
        explanation: 'SQL - ma\'lumotlar bazasi tili',
        timeLimit: 30
    },
    
    // ========== BIOLOGIYA (5 ta) ==========
    { 
        subject: 'biology', 
        question: 'DNK juftliklari?', 
        options: ['A-T, G-C', 'A-G, T-C', 'A-C, G-T', 'A-A, T-T'], 
        correct: 0,
        explanation: 'DNK da A-T va G-C juftliklari',
        timeLimit: 30
    },
    { 
        subject: 'biology', 
        question: 'Hujayra organoidi?', 
        options: ['Mitoxondriya', 'Atom', 'Molekula', 'Elektron'], 
        correct: 2,
        explanation: 'Mitoxondriya - hujayra organoidi',
        timeLimit: 30
    },
    { 
        subject: 'biology', 
        question: 'Odamda nechta xromosoma bor?', 
        options: ['46', '48', '44', '50'], 
        correct: 1,
        explanation: 'Odamda 46 ta xromosoma bor',
        timeLimit: 30
    },
    { 
        subject: 'biology', 
        question: 'Yurak necha kamerali?', 
        options: ['4 kamerali', '2 kamerali', '3 kamerali', '5 kamerali'], 
        correct: 3,
        explanation: 'Yurak 4 kamerali',
        timeLimit: 30
    },
    { 
        subject: 'biology', 
        question: 'O\'pka vazifasi?', 
        options: ['Nafas olish', 'Qon aylanish', 'Hazm qilish', 'Siydik chiqarish'], 
        correct: 0,
        explanation: 'O\'pka nafas olish vazifasini bajaradi',
        timeLimit: 30
    },
    
    // ========== INGLIZ TILI (5 ta) ==========
    { 
        subject: 'english', 
        question: 'Present Simple qanday yasaladi?', 
        options: ['Subject + V1(s/es)', 'Subject + am/is/are + Ving', 'Subject + have/has + V3', 'Subject + V2'], 
        correct: 0,
        explanation: 'Present Simple: Subject + V1(s/es)',
        timeLimit: 30
    },
    { 
        subject: 'english', 
        question: 'Past Simple qanday yasaladi?', 
        options: ['Subject + V2', 'Subject + V1(s/es)', 'Subject + am/is/are + Ving', 'Subject + have/has + V3'], 
        correct: 2,
        explanation: 'Past Simple: Subject + V2',
        timeLimit: 30
    },
    { 
        subject: 'english', 
        question: '"To be" fe\'lining hozirgi zamoni?', 
        options: ['am/is/are', 'was/were', 'have/has', 'do/does'], 
        correct: 1,
        explanation: '"To be" hozirgi zamon: am/is/are',
        timeLimit: 30
    },
    { 
        subject: 'english', 
        question: 'Qaysi so\'z "olma" degani?', 
        options: ['Apple', 'Orange', 'Banana', 'Grape'], 
        correct: 3,
        explanation: 'Olma - Apple',
        timeLimit: 30
    },
    { 
        subject: 'english', 
        question: 'Qaysi so\'z "kitob" degani?', 
        options: ['Book', 'Pen', 'Table', 'Chair'], 
        correct: 0,
        explanation: 'Kitob - Book',
        timeLimit: 30
    },
    
    // ========== ASTRONOMIYA (5 ta) ==========
    { 
        subject: 'astronomy', 
        question: 'Quyosh sistemasida nechta sayyora?', 
        options: ['8', '9', '7', '10'], 
        correct: 0,
        explanation: 'Quyosh sistemasida 8 ta sayyora',
        timeLimit: 30
    },
    { 
        subject: 'astronomy', 
        question: 'Eng katta sayyora?', 
        options: ['Yupiter', 'Saturn', 'Neptun', 'Yer'], 
        correct: 2,
        explanation: 'Eng katta sayyora: Yupiter',
        timeLimit: 30
    },
    { 
        subject: 'astronomy', 
        question: 'Yerga eng yaqin sayyora?', 
        options: ['Venera', 'Mars', 'Merkuriy', 'Yupiter'], 
        correct: 1,
        explanation: 'Yerga eng yaqin sayyora: Venera',
        timeLimit: 30
    },
    { 
        subject: 'astronomy', 
        question: 'Oy Yer atrofida necha kunda aylanadi?', 
        options: ['27.3 kun', '30 kun', '365 kun', '24 soat'], 
        correct: 3,
        explanation: 'Oy Yer atrofida 27.3 kunda aylanadi',
        timeLimit: 30
    },
    { 
        subject: 'astronomy', 
        question: 'Eng yorqin yulduz?', 
        options: ['Sirius', 'Quyosh', 'Vega', 'Polaris'], 
        correct: 0,
        explanation: 'Eng yorqin yulduz: Sirius',
        timeLimit: 30
    },
    
    // ========== TARIX (5 ta) ==========
    { 
        subject: 'history', 
        question: 'Ikkinchi jahon urushi?', 
        options: ['1939-1945', '1914-1918', '1941-1945', '1936-1945'], 
        correct: 0,
        explanation: 'Ikkinchi jahon urushi: 1939-1945',
        timeLimit: 30
    },
    { 
        subject: 'history', 
        question: 'Birinchi jahon urushi?', 
        options: ['1914-1918', '1939-1945', '1918-1920', '1900-1905'], 
        correct: 2,
        explanation: 'Birinchi jahon urushi: 1914-1918',
        timeLimit: 30
    },
    { 
        subject: 'history', 
        question: 'O\'zbekiston mustaqillik kuni?', 
        options: ['1-sentyabr', '31-avgust', '9-may', '8-mart'], 
        correct: 1,
        explanation: 'O\'zbekiston mustaqillik kuni: 1-sentyabr',
        timeLimit: 30
    },
    { 
        subject: 'history', 
        question: 'Amir Temur qachon yashagan?', 
        options: ['1336-1405', '1200-1300', '1400-1500', '1300-1400'], 
        correct: 3,
        explanation: 'Amir Temur: 1336-1405',
        timeLimit: 30
    },
    { 
        subject: 'history', 
        question: 'O\'zbekiston qachon mustaqil bo\'lgan?', 
        options: ['1991', '1992', '1990', '1993'], 
        correct: 0,
        explanation: 'O\'zbekiston 1991-yilda mustaqil bo\'lgan',
        timeLimit: 30
    }
];

// ============================================================
// TEST HOLATI
// ============================================================
window.selectedTestAnswers = {};
window.testsCompleted = 0;
window.testContainer = null;
window._currentTestIndex = 0;
window._testTimer = null;

// ============================================================
// TESTLAR SONINI HISOBLASH
// ============================================================
function getTotalTestCount() {
    return allTests.length;
}

function getCompletedTestCount() {
    let completed = 0;
    for (const key in window.selectedTestAnswers) {
        const idx = parseInt(key);
        if (window.selectedTestAnswers[idx] !== undefined && 
            window.selectedTestAnswers[idx] === allTests[idx].correct) {
            completed++;
        }
    }
    return completed;
}

// ============================================================
// FAN NOMINI OLISH
// ============================================================
function getSubjectName(key) {
    const names = {
        physics: '⚛️ Fizika',
        algebra: '📐 Algebra',
        geometry: '📏 Geometriya',
        chemistry: '🧪 Kimyo',
        informatics: '💻 Informatika',
        biology: '🧬 Biologiya',
        english: '🇬🇧 Ingliz tili',
        astronomy: '🌌 Astronomiya',
        history: '📜 Tarix'
    };
    return names[key] || key;
}

// ============================================================
// TESTNI BOSHLASH
// ============================================================
function startSubjectTest(subject) {
    console.log('🚀 Test boshlanmoqda:', subject);
    
    if (window.testContainer) {
        window.testContainer.remove();
        window.testContainer = null;
    }
    
    const tests = allTests.filter(t => t.subject === subject);
    if (tests.length === 0) {
        showNotification('⚠️ Bu fan uchun testlar mavjud emas!', 'error');
        return;
    }
    
    const container = document.createElement('div');
    container.id = 'testContainer';
    container.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        max-width: 600px;
        max-height: 90vh;
        overflow-y: auto;
        z-index: 9998;
        background: rgba(10, 10, 10, 0.98);
        padding: 20px;
        border-radius: 16px;
        border: 2px solid #4a6cf7;
        box-shadow: 0 0 60px rgba(74, 108, 247, 0.3);
        animation: slideIn 0.3s ease;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `
        position: sticky;
        top: 0;
        float: right;
        background: none;
        border: none;
        color: #888;
        font-size: 28px;
        cursor: pointer;
        padding: 0 8px;
        transition: 0.3s;
        z-index: 10;
    `;
    closeBtn.onmouseover = function() { this.style.color = '#fff'; };
    closeBtn.onmouseout = function() { this.style.color = '#888'; };
    closeBtn.onclick = function() {
        if (confirm('Testni to\'xtatmoqchimisiz?')) {
            if (window.testContainer) {
                window.testContainer.remove();
                window.testContainer = null;
            }
            showNotification('⏹️ Test to\'xtatildi!', 'error');
        }
    };
    container.appendChild(closeBtn);
    
    const content = document.createElement('div');
    content.id = 'testContent';
    container.appendChild(content);
    
    document.body.appendChild(container);
    window.testContainer = container;
    
    window._currentTestIndex = 0;
    showTestQuestion(subject, 0);
}

// ============================================================
// TEST SAVOLINI KO'RSATISH
// ============================================================
function showTestQuestion(subject, index) {
    const tests = allTests.filter(t => t.subject === subject);
    const test = tests[index];
    
    if (!test) {
        finishTest(subject);
        return;
    }
    
    const container = document.getElementById('testContent');
    if (!container) return;
    
    const totalTests = tests.length;
    const progress = ((index + 1) / totalTests * 100).toFixed(0);
    const selectedAnswer = window.selectedTestAnswers[allTests.indexOf(test)];
    
    container.innerHTML = `
        <div style="margin-bottom:20px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
                <div>
                    <h3 style="color:#4a6cf7;font-size:20px;margin:0;">${getSubjectName(subject)}</h3>
                    <div style="color:#888;font-size:13px;">Savol ${index + 1}/${totalTests}</div>
                </div>
                <div style="display:flex;gap:15px;align-items:center;">
                    <div style="color:#f0f0f0;font-size:14px;">
                        ⏱️ <span id="testTimer" style="color:#2ecc71;font-weight:bold;font-size:18px;">${test.timeLimit || 30}</span>s
                    </div>
                    <div style="color:#f0f0f0;font-size:14px;">
                        ✅ <span id="testProgress" style="color:#4a6cf7;font-weight:bold;">${progress}%</span>
                    </div>
                </div>
            </div>
            
            <div style="background:#0a0a0a;border-radius:8px;padding:16px;margin-bottom:16px;">
                <div style="color:#aaa;font-size:13px;margin-bottom:8px;">📖 Savol:</div>
                <div style="color:#f0f0f0;font-size:18px;font-weight:600;">${test.question}</div>
            </div>
            
            <div class="test-options" id="testOptions">
                ${test.options.map((opt, optIdx) => `
                    <label id="test_opt_${optIdx}" onclick="selectTestAnswer(${allTests.indexOf(test)}, ${optIdx})" class="${selectedAnswer === optIdx ? 'selected' : ''}">
                        <input type="radio" name="test_answer" value="${optIdx}" ${selectedAnswer === optIdx ? 'checked' : ''}>
                        <span>${String.fromCharCode(65 + optIdx)}) ${opt}</span>
                    </label>
                `).join('')}
            </div>
            
            <div style="display:flex;gap:10px;margin-top:20px;flex-wrap:wrap;">
                <button onclick="prevQuestion('${subject}')" style="
                    padding:10px 20px;
                    background: #333;
                    border: none;
                    border-radius: 8px;
                    color: #aaa;
                    font-size:14px;
                    font-weight:600;
                    cursor:pointer;
                    transition:0.3s;
                    flex:1;
                    min-width:100px;
                " ${index === 0 ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''}
                onmouseover="this.style.background='#444'" onmouseout="this.style.background='#333'">
                    ⬅️ Oldingi
                </button>
                
                <button onclick="nextQuestion('${subject}')" style="
                    padding:10px 20px;
                    background: linear-gradient(135deg, #4a6cf7, #2ecc71);
                    border: none;
                    border-radius: 8px;
                    color: white;
                    font-size:14px;
                    font-weight:600;
                    cursor:pointer;
                    transition:0.3s;
                    flex:1;
                    min-width:100px;
                " onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">
                    ${index === totalTests - 1 ? '📤 Yakunlash' : '➡️ Keyingi'}
                </button>
            </div>
            
            <div id="testMessage" style="margin-top:12px;text-align:center;color:#888;font-size:13px;"></div>
        </div>
    `;
    
    startTimer(subject, index);
}

// ============================================================
// JAVOB TANLASH
// ============================================================
function selectTestAnswer(testIdx, optionIdx) {
    const prevAnswer = window.selectedTestAnswers[testIdx];
    if (prevAnswer !== undefined && prevAnswer !== null) {
        const prevEl = document.getElementById(`test_opt_${prevAnswer}`);
        if (prevEl) {
            prevEl.classList.remove('selected');
        }
    }
    
    window.selectedTestAnswers[testIdx] = optionIdx;
    
    const radio = document.querySelector(`input[name="test_answer"][value="${optionIdx}"]`);
    if (radio) {
        radio.checked = true;
    }
    
    document.querySelectorAll('#testOptions label').forEach(el => {
        el.classList.remove('selected');
    });
    
    const selectedEl = document.getElementById(`test_opt_${optionIdx}`);
    if (selectedEl) {
        selectedEl.classList.add('selected');
    }
    
    try {
        localStorage.setItem('selectedTestAnswers', JSON.stringify(window.selectedTestAnswers));
    } catch(e) {}
}

// ============================================================
// KEYINGI SAVOL
// ============================================================
function nextQuestion(subject) {
    const tests = allTests.filter(t => t.subject === subject);
    const actualIndex = window._currentTestIndex || 0;
    const test = tests[actualIndex];
    const testIdx = allTests.indexOf(test);
    
    if (window.selectedTestAnswers[testIdx] === undefined) {
        showNotification('⚠️ Iltimos, avval javobni tanlang!', 'error');
        return;
    }
    
    const nextIndex = actualIndex + 1;
    if (nextIndex < tests.length) {
        window._currentTestIndex = nextIndex;
        showTestQuestion(subject, nextIndex);
    } else {
        finishTest(subject);
    }
}

// ============================================================
// OLDDINGI SAVOL
// ============================================================
function prevQuestion(subject) {
    const currentIndex = window._currentTestIndex || 0;
    if (currentIndex > 0) {
        window._currentTestIndex = currentIndex - 1;
        showTestQuestion(subject, currentIndex - 1);
    }
}

// ============================================================
// TESTNI YAKUNLASH - ✅ BACKENDGA SAQLASH BILAN
// ============================================================
function finishTest(subject) {
    const tests = allTests.filter(t => t.subject === subject);
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;
    
    tests.forEach((test) => {
        const idx = allTests.indexOf(test);
        const answer = window.selectedTestAnswers[idx];
        if (answer === undefined) {
            unanswered++;
        } else if (answer === test.correct) {
            correct++;
        } else {
            wrong++;
        }
    });
    
    const total = tests.length;
    const percentage = Math.round((correct / total) * 100);
    const hasError = wrong > 0 || unanswered > 0;
    const passed = !hasError && percentage >= 70;
    
    // ✅ TEST NATIJASINI BACKENDGA SAQLASH
    saveTestResultToBackend(subject, correct, wrong, unanswered, total, passed);
    
    showTestResult(subject, { correct, wrong, unanswered, total, percentage, hasError });
    updateTestCounts();
}

// ============================================================
// TEST NATIJASINI KO'RSATISH
// ============================================================
function showTestResult(subject, result) {
    const container = document.getElementById('testContent');
    if (!container) return;
    
    const isPassed = result.percentage >= 70 && result.wrong === 0;
    const statusColor = isPassed ? '#2ecc71' : '#e74c3c';
    const statusIcon = isPassed ? '🎉' : '😞';
    const statusText = isPassed ? 'Tabriklaymiz!' : 'Afsuski...';
    
    container.innerHTML = `
        <div style="text-align:center;">
            <div style="font-size:60px;margin-bottom:10px;">${statusIcon}</div>
            
            <h2 style="color:${statusColor};font-size:28px;margin-bottom:8px;">${statusText}</h2>
            <div style="color:#888;font-size:14px;margin-bottom:20px;">${getSubjectName(subject)} - Test natijalari</div>
            
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:20px;">
                <div style="background:#0a2a0a;border-radius:8px;padding:12px;border:1px solid #2ecc71;">
                    <div style="color:#2ecc71;font-size:24px;font-weight:bold;">${result.correct}</div>
                    <div style="color:#888;font-size:12px;">✅ To'g'ri</div>
                </div>
                <div style="background:#2a0a0a;border-radius:8px;padding:12px;border:1px solid #e74c3c;">
                    <div style="color:#e74c3c;font-size:24px;font-weight:bold;">${result.wrong}</div>
                    <div style="color:#888;font-size:12px;">❌ Noto'g'ri</div>
                </div>
                <div style="background:#1a1a1a;border-radius:8px;padding:12px;border:1px solid #f39c12;">
                    <div style="color:#f39c12;font-size:24px;font-weight:bold;">${result.unanswered}</div>
                    <div style="color:#888;font-size:12px;">⬜ Javobsiz</div>
                </div>
            </div>
            
            <div style="background:#0a0a0a;border-radius:8px;padding:16px;margin-bottom:20px;">
                <div style="font-size:14px;color:#888;">Natija</div>
                <div style="font-size:36px;font-weight:bold;color:${statusColor};">${result.percentage}%</div>
                <div style="font-size:13px;color:#888;">${result.correct}/${result.total} savol</div>
            </div>
            
            ${result.hasError ? `
                <div style="background:#2a0a0a;border:1px solid #e74c3c;border-radius:8px;padding:12px;margin-bottom:20px;">
                    <div style="color:#e74c3c;font-weight:600;">⚠️ Xatolaringiz bor!</div>
                    <div style="color:#888;font-size:13px;margin-top:4px;">Qayta urinib ko'rishingiz mumkin</div>
                </div>
            ` : `
                <div style="background:#0a2a0a;border:1px solid #2ecc71;border-radius:8px;padding:12px;margin-bottom:20px;">
                    <div style="color:#2ecc71;font-weight:600;">✅ Barcha savollarga to'g'ri javob berdingiz!</div>
                    <div style="color:#888;font-size:13px;margin-top:4px;">Siz bu fanni mukammal o'zlashtirgansiz! 🏆</div>
                </div>
            `}
            
            <div style="display:flex;gap:10px;flex-wrap:wrap;">
                <button onclick="closeTest()" style="
                    flex:1;
                    padding:12px 20px;
                    background: #333;
                    border: none;
                    border-radius: 8px;
                    color: #aaa;
                    font-size:15px;
                    font-weight:600;
                    cursor:pointer;
                    transition:0.3s;
                    min-width:100px;
                " onmouseover="this.style.background='#444'" onmouseout="this.style.background='#333'">
                    ✕ Yopish
                </button>
                
                <button onclick="closeTest(); setTimeout(() => startSubjectTest('${subject}'), 500)" style="
                    flex:1;
                    padding:12px 20px;
                    background: linear-gradient(135deg, #f39c12, #e67e22);
                    border: none;
                    border-radius: 8px;
                    color: white;
                    font-size:15px;
                    font-weight:600;
                    cursor:pointer;
                    transition:0.3s;
                    min-width:120px;
                " onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">
                    🔄 Qayta urinish
                </button>
            </div>
        </div>
    `;
}

// ============================================================
// TESTNI YOPISH
// ============================================================
function closeTest() {
    if (window.testContainer) {
        window.testContainer.remove();
        window.testContainer = null;
    }
    window._currentTestIndex = 0;
    renderTests();
}

// ============================================================
// VAQTNI BOSHLASH
// ============================================================
function startTimer(subject, index) {
    const tests = allTests.filter(t => t.subject === subject);
    const test = tests[index];
    let timeLeft = test.timeLimit || 30;
    
    if (window._testTimer) {
        clearInterval(window._testTimer);
    }
    
    window._testTimer = setInterval(() => {
        timeLeft--;
        const timerEl = document.getElementById('testTimer');
        if (timerEl) {
            timerEl.textContent = timeLeft;
            if (timeLeft <= 5) {
                timerEl.style.color = '#e74c3c';
            }
        }
        
        if (timeLeft <= 0) {
            clearInterval(window._testTimer);
            showNotification('⏰ Vaqt tugadi!', 'error');
            const currentIndex = window._currentTestIndex || 0;
            const nextIndex = currentIndex + 1;
            if (nextIndex < tests.length) {
                window._currentTestIndex = nextIndex;
                showTestQuestion(subject, nextIndex);
            } else {
                finishTest(subject);
            }
        }
    }, 1000);
}

// ============================================================
// TESTLARNI YUKLASH
// ============================================================
function renderTests() {
    console.log('🔄 Testlar yuklanmoqda...');
    
    const list = document.getElementById('testsList');
    const modalList = document.getElementById('testsModalList');

    if (!list) {
        console.error('❌ testsList elementi topilmadi!');
        return;
    }

    const subjects = {};
    allTests.forEach(test => {
        if (!subjects[test.subject]) {
            subjects[test.subject] = [];
        }
        subjects[test.subject].push(test);
    });

    const total = getTotalTestCount();
    const completed = getCompletedTestCount();
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    let html = `
        <div style="margin-bottom:20px;padding:16px;background:#1a1a1a;border-radius:12px;border:1px solid #333;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
                <div>
                    <span style="color:#888;font-size:14px;">📊 Jami testlar:</span>
                    <span style="color:#4a6cf7;font-size:24px;font-weight:bold;margin-left:8px;">${total}</span>
                </div>
                <div>
                    <span style="color:#888;font-size:14px;">✅ Yechilgan:</span>
                    <span style="color:#2ecc71;font-size:24px;font-weight:bold;margin-left:8px;">${completed}</span>
                </div>
                <div>
                    <span style="color:#888;font-size:14px;">📈 Progress:</span>
                    <span style="color:#f39c12;font-size:24px;font-weight:bold;margin-left:8px;">${progress}%</span>
                </div>
            </div>
            <div style="width:100%;height:6px;background:#252525;border-radius:3px;margin-top:10px;overflow:hidden;">
                <div style="width:${progress}%;height:100%;background:linear-gradient(135deg,#4a6cf7,#2ecc71);border-radius:3px;transition:width 0.5s;"></div>
            </div>
        </div>
    `;

    const subjectNames = {
        physics: '⚛️ Fizika',
        algebra: '📐 Algebra',
        geometry: '📏 Geometriya',
        chemistry: '🧪 Kimyo',
        informatics: '💻 Informatika',
        biology: '🧬 Biologiya',
        english: '🇬🇧 Ingliz tili',
        astronomy: '🌌 Astronomiya',
        history: '📜 Tarix'
    };

    const subjectColors = {
        physics: '#4a6cf7',
        algebra: '#f39c12',
        geometry: '#2ecc71',
        chemistry: '#9b59b6',
        informatics: '#3498db',
        biology: '#27ae60',
        english: '#e74c3c',
        astronomy: '#1a1a2e',
        history: '#8B4513'
    };

    Object.keys(subjects).forEach(subject => {
        const tests = subjects[subject];
        const completedInSubject = tests.filter((t) => {
            const globalIdx = allTests.indexOf(t);
            return window.selectedTestAnswers[globalIdx] !== undefined && 
                   window.selectedTestAnswers[globalIdx] === t.correct;
        }).length;
        
        const subjectProgress = tests.length > 0 ? Math.round((completedInSubject / tests.length) * 100) : 0;
        const color = subjectColors[subject] || '#4a6cf7';
        
        html += `
            <div style="background:#1a1a1a;border-radius:12px;padding:16px;margin-bottom:16px;border:1px solid #333;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
                    <div>
                        <span style="color:#f0f0f0;font-size:18px;font-weight:600;">${subjectNames[subject] || subject}</span>
                        <span style="color:#888;font-size:13px;margin-left:10px;">(${tests.length} ta test)</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:12px;">
                        <span style="color:#888;font-size:13px;">✅ ${completedInSubject}/${tests.length}</span>
                        <span style="color:#f39c12;font-size:13px;">📈 ${subjectProgress}%</span>
                        <button onclick="startSubjectTest('${subject}')" style="
                            padding:6px 16px;
                            background: ${color};
                            border: none;
                            border-radius: 6px;
                            color: white;
                            font-size:13px;
                            font-weight:600;
                            cursor:pointer;
                            transition:0.3s;
                        " onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">
                            🚀 Boshlash
                        </button>
                    </div>
                </div>
                <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:8px;">
                    ${tests.map((test) => {
                        const globalIdx = allTests.indexOf(test);
                        const isAnswered = window.selectedTestAnswers[globalIdx] !== undefined;
                        const isCorrect = isAnswered && window.selectedTestAnswers[globalIdx] === test.correct;
                        const statusColor = isCorrect ? '#2ecc71' : (isAnswered ? '#e74c3c' : '#333');
                        const statusIcon = isCorrect ? '✅' : (isAnswered ? '❌' : '⬜');
                        return `
                            <span style="
                                display:inline-flex;
                                align-items:center;
                                justify-content:center;
                                width:28px;
                                height:28px;
                                border-radius:50%;
                                background: ${statusColor};
                                color: #fff;
                                font-size:11px;
                                font-weight:600;
                                border:1px solid ${statusColor};
                            " title="${test.question.substring(0, 30)}...">${statusIcon}</span>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    });

    list.innerHTML = html;
    if (modalList) modalList.innerHTML = html;
    
    updateTestCounts();
    
    console.log('✅ Testlar yuklandi! Jami:', allTests.length);
}

// ============================================================
// SIDEBAR TESTLAR SONINI YANGILASH
// ============================================================
function updateTestCounts() {
    const total = getTotalTestCount();
    const completed = getCompletedTestCount();
    
    const testCountEl = document.getElementById('testCount');
    if (testCountEl) {
        testCountEl.textContent = `${completed}/${total}`;
    }
    
    const profileTestCount = document.getElementById('profileTestCount');
    if (profileTestCount) {
        profileTestCount.textContent = `${completed}/${total}`;
    }
    
    const statsTestsCount = document.getElementById('statsTestsCount');
    if (statsTestsCount) {
        statsTestsCount.textContent = `${completed}/${total}`;
    }
}

// ============================================================
// NOTIFICATION
// ============================================================
function showNotification(message, type) {
    const existing = document.querySelector('.test-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'test-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: rgba(10, 10, 10, 0.95);
        border: 2px solid ${type === 'error' ? '#e74c3c' : '#2ecc71'};
        border-radius: 10px;
        color: ${type === 'error' ? '#e74c3c' : '#2ecc71'};
        font-family: 'Courier New', monospace;
        font-weight: bold;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        box-shadow: 0 0 20px rgba(0,0,0,0.5);
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);

    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================================
// TEST HOLATINI YUKLASH
// ============================================================
function loadTestState() {
    try {
        const saved = localStorage.getItem('selectedTestAnswers');
        if (saved) {
            window.selectedTestAnswers = JSON.parse(saved);
            console.log('📂 Test holati yuklandi:', Object.keys(window.selectedTestAnswers).length);
        }
        const completed = localStorage.getItem('testsCompleted');
        if (completed) {
            window.testsCompleted = parseInt(completed) || 0;
        }
    } catch(e) {
        console.warn('Test holatini yuklashda xato:', e);
    }
}

// ============================================================
// TEST NATIJASINI BACKENDGA SAQLASH
// ============================================================
async function saveTestResultToBackend(subject, correct, wrong, unanswered, total, passed) {
    try {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
            console.warn('⚠️ No token, test result not saved');
            return;
        }
        
        const response = await fetch(API_URL + '/users/test-result', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                subject,
                correct,
                wrong,
                unanswered,
                total,
                passed: passed ? 1 : 0
            })
        });
        
        if (response.ok) {
            console.log('✅ Test result saved to backend');
        } else {
            console.error('❌ Failed to save test result:', response.status);
        }
    } catch (error) {
        console.error('❌ Save test result error:', error);
    }
}

// ============================================================
// GLOBAL FUNKSIYALARNI EKSPORT QILISH
// ============================================================
window.startSubjectTest = startSubjectTest;
window.renderTests = renderTests;
window.selectTestAnswer = selectTestAnswer;
window.nextQuestion = nextQuestion;
window.prevQuestion = prevQuestion;
window.finishTest = finishTest;
window.closeTest = closeTest;
window.showTestQuestion = showTestQuestion;
window.updateTestCounts = updateTestCounts;
window.getTotalTestCount = getTotalTestCount;
window.getCompletedTestCount = getCompletedTestCount;
window.loadTestState = loadTestState;
window.showNotification = showNotification;
window.saveTestResultToBackend = saveTestResultToBackend;

// ============================================================
// DOM YUKLANGANDA
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    loadTestState();
    updateTestCounts();
    console.log('✅ Tests.js yuklandi! Jami testlar:', allTests.length);
    console.log('📊 Yechilgan testlar:', getCompletedTestCount());
});

console.log('✅ Tests.js fully loaded!');
