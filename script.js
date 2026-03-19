const PRIZES = [
    { id: 'standing_ovation', name: '全スタッフのスタンディングオベーション', rarity: 'legendary', rarityLabel: '【顕現】K・ゴッド', icon: '01.png', description: 'おめでとう！Kさんを筆頭に、全員が君を称える！', weight: 1 },
    { id: 'caricature', name: 'Kさんの「30秒似顔絵」', rarity: 'epic', rarityLabel: '【禁断】ピュア・K', icon: '02.png', description: 'K画伯の筆が唸る。芸術か、それとも事件か...', weight: 4 },
    { id: 'nickname', name: 'Kさんによる「新あだ名」命名権', rarity: 'rare', rarityLabel: '【心酔】K・ジャンキー', icon: '03.png', description: '今日から君はKさんの名付け子だ。誇りを持って名乗れ', weight: 10 },
    { id: 'confession', name: 'Kさんの「愛の告白」予行演習', rarity: 'uncommon', rarityLabel: '【常用】デイリー・K', icon: '04.png', description: 'Kさんが本気で君を口説く。まばたき禁止だ！', weight: 20 },
    { id: 'borrow_pen', name: 'Kさんの「愛用ペン」拝借権', rarity: 'common', rarityLabel: '【微熱】K・フィーバー', icon: '05.png', description: 'Kさんの魂が宿るペン。5分間で奇跡を（事務処理を）起こせ', weight: 30 },
    { id: 'heart_straw', name: 'Kさん特製 ハート型ストロー', rarity: 'common', rarityLabel: '【風味】K・フレーバー', icon: '06.png', description: 'Kさんが愛を込めて指で曲げた。吸引力、Kさんクラス！', weight: 20 },
    { id: 'maxim', name: 'Kさんからの「謎の格言」授与', rarity: 'common', rarityLabel: '【残滓】わずかなK', icon: '07.png', description: 'Kさんが贈る、明日から使える（？）重すぎる一言', weight: 15 }
];

const state = {
    isPulling: false,
    inventory: JSON.parse(localStorage.getItem('ksan_labels_fixed_inventory')) || {}
};

// DOM Elements
const pullButton = document.getElementById('pullButton');
const leverArm = document.getElementById('leverArm');
const capsulesContainer = document.getElementById('capsulesContainer');
const capsuleExit = document.getElementById('capsuleExit');
const revealModal = document.getElementById('revealModal');
const closeModal = document.getElementById('closeModal');
const inventoryDisplay = document.getElementById('inventory');

const prizeIcon = document.getElementById('prizeIcon');
const prizeName = document.getElementById('prizeName');
const prizeRarity = document.getElementById('prizeRarity');
const prizeDescription = document.getElementById('prizeDescription');

// Initialize visual capsules
function initCapsules() {
    capsulesContainer.innerHTML = '';
    const colors = ['white', 'blue', 'gold', 'purple'];
    for (let i = 0; i < 24; i++) {
        const capsule = document.createElement('div');
        capsule.className = `capsule ${colors[Math.floor(Math.random() * colors.length)]}`;
        capsule.style.transform = `translate(${Math.random() * 20 - 10}px, ${Math.random() * 10}px) rotate(${Math.random() * 360}deg)`;
        capsulesContainer.appendChild(capsule);
    }
}

// Logic to pick a prize based on weight
function pickPrize() {
    const totalWeight = PRIZES.reduce((sum, p) => sum + p.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const prize of PRIZES) {
        if (random < prize.weight) return prize;
        random -= prize.weight;
    }
    return PRIZES[0];
}

async function pullGacha() {
    if (state.isPulling) return;
    state.isPulling = true;
    pullButton.disabled = true;

    // 1. Lever Animation
    leverArm.classList.add('pulling');
    
    // 2. Machine Shaking
    const machine = document.querySelector('.gacha-machine');
    machine.classList.add('shaking');

    await new Promise(r => setTimeout(r, 1000));
    leverArm.classList.remove('pulling');

    // 3. Capsule Falling
    const prize = pickPrize();
    const fallingCapsule = document.createElement('div');
    const rarityClass = prize.rarity === 'common' ? 'white' : prize.rarity === 'uncommon' ? 'blue' : prize.rarity === 'rare' ? 'blue' : prize.rarity === 'epic' ? 'purple' : 'gold';
    fallingCapsule.className = `capsule ${rarityClass} capsule-falling`;
    capsuleExit.appendChild(fallingCapsule);

    await new Promise(r => setTimeout(r, 800));
    machine.classList.remove('shaking');

    // 4. Reveal Prize
    showReveal(prize);
    addToInventory(prize);
}

function showReveal(prize) {
    prizeIcon.innerHTML = `<img src="parts/${prize.icon}" alt="${prize.name}" class="prize-image">`;
    prizeName.textContent = prize.name;
    prizeRarity.textContent = prize.rarityLabel;
    prizeRarity.className = `prize-rarity rarity-${prize.rarity}`;
    prizeDescription.textContent = prize.description;
    
    // Update glow color
    const glow = document.querySelector('.rarity-glow');
    const colors = {
        common: 'rgba(255, 255, 255, 0.4)',
        uncommon: 'rgba(77, 148, 255, 0.4)',
        rare: 'rgba(77, 148, 255, 0.6)',
        epic: 'rgba(179, 102, 255, 0.7)',
        legendary: 'rgba(212, 175, 55, 0.8)'
    };
    glow.style.background = `radial-gradient(circle, ${colors[prize.rarity]} 0%, transparent 70%)`;

    revealModal.classList.add('active');
    triggerTierEffect(prize);
}

function triggerTierEffect(prize) {
    // Remove existing effect container if any
    const oldContainer = document.querySelector('.effect-container');
    if (oldContainer) oldContainer.remove();

    const container = document.createElement('div');
    container.className = 'effect-container';
    document.body.appendChild(container);

    switch (prize.rarity) {
        case 'legendary': // 1等
            // Concentration lines
            const lines = document.createElement('div');
            lines.className = 'effect-concentration-lines';
            container.appendChild(lines);
            // Confetti
            for (let i = 0; i < 100; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.backgroundColor = ['#ffd700', '#ffffff', '#ffdf00'][Math.floor(Math.random() * 3)];
                confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
                confetti.style.animationDelay = (Math.random() * 2) + 's';
                container.appendChild(confetti);
            }
            break;
        case 'epic': // 2等
            // Stars from corners
            const corners = [
                { top: '0', left: '0', dx: '40vw', dy: '40vh' },
                { top: '0', right: '0', dx: '-40vw', dy: '40vh' },
                { bottom: '0', left: '0', dx: '40vw', dy: '-40vh' },
                { bottom: '0', right: '0', dx: '-40vw', dy: '-40vh' }
            ];
            for (let i = 0; i < 40; i++) {
                const star = document.createElement('div');
                star.className = 'star-silver';
                star.innerHTML = '★';
                const corner = corners[Math.floor(Math.random() * corners.length)];
                if (corner.top) star.style.top = corner.top;
                if (corner.bottom) star.style.bottom = corner.bottom;
                if (corner.left) star.style.left = corner.left;
                if (corner.right) star.style.right = corner.right;
                star.style.setProperty('--dx', (Math.random() * 0.5 + 0.5) * parseInt(corner.dx) + 'vw');
                star.style.setProperty('--dy', (Math.random() * 0.5 + 0.5) * parseInt(corner.dy) + 'vh');
                star.style.animationDuration = (Math.random() * 1 + 1) + 's';
                star.style.animationDelay = (Math.random() * 2) + 's';
                container.appendChild(star);
            }
            break;
        case 'rare': // 3等
            // Balloons
            const colors = ['#ff4d4d', '#4dff4d', '#4d4dff', '#ffff4d', '#ff4dff', '#4dffff'];
            for (let i = 0; i < 30; i++) {
                const balloon = document.createElement('div');
                balloon.className = 'balloon';
                balloon.style.left = Math.random() * 100 + 'vw';
                balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                balloon.style.setProperty('--tx', (Math.random() * 20 - 10) + 'vw');
                balloon.style.animationDuration = (Math.random() * 3 + 3) + 's';
                balloon.style.animationDelay = (Math.random() * 3) + 's';
                container.appendChild(balloon);
            }
            break;
        case 'uncommon': // 4等
            // Hearts
            for (let i = 0; i < 40; i++) {
                const heart = document.createElement('div');
                heart.className = 'heart-pink';
                heart.innerHTML = '❤';
                heart.style.left = Math.random() * 100 + 'vw';
                heart.style.top = Math.random() * 100 + 'vh';
                heart.style.setProperty('--hx', (Math.random() * 100 - 50) + 'px');
                heart.style.setProperty('--hy', (Math.random() * -200 - 50) + 'px');
                heart.style.animationDuration = (Math.random() * 2 + 2) + 's';
                heart.style.animationDelay = (Math.random() * 3) + 's';
                container.appendChild(heart);
            }
            break;
        case 'common':
            if (prize.id === 'borrow_pen') { // 5等
                const frame = document.createElement('div');
                frame.className = 'effect-light-frame';
                container.appendChild(frame);
            } else if (prize.id === 'heart_straw') { // 6等
                // Background color change (handled by CSS transition if needed, 
                // but PDF says "fade background color", we can just set an overlay)
                const overlay = document.createElement('div');
                overlay.className = 'effect-dark-overlay';
                overlay.style.backgroundColor = 'rgba(255, 165, 0, 0.1)'; // Pale orange
                overlay.style.backdropFilter = 'none';
                container.appendChild(overlay);
            } else if (prize.id === 'maxim') { // 7等
                const dark = document.createElement('div');
                dark.className = 'effect-dark-overlay';
                container.appendChild(dark);
                const leaf = document.createElement('div');
                leaf.className = 'withered-leaf';
                leaf.innerHTML = '🍂';
                leaf.style.top = (Math.random() * 20 + 30) + 'vh';
                container.appendChild(leaf);
            }
            break;
    }
}

function addToInventory(prize) {
    if (state.inventory[prize.id]) {
        state.inventory[prize.id].count++;
    } else {
        state.inventory[prize.id] = { ...prize, count: 1 };
    }
    localStorage.setItem('ksan_labels_fixed_inventory', JSON.stringify(state.inventory));
    updateInventoryUI();
}

function updateInventoryUI() {
    inventoryDisplay.innerHTML = '';
    Object.values(state.inventory).forEach(item => {
        const div = document.createElement('div');
        div.className = 'inventory-item';
        div.innerHTML = `
            <img src="parts/${item.icon}" alt="${item.name}" class="inventory-image">
            <span class="count">${item.count}</span>
        `;
        div.title = `${item.name} (${item.rarityLabel})`;
        inventoryDisplay.appendChild(div);
    });
}

// Event Listeners
pullButton.addEventListener('click', pullGacha);
leverArm.addEventListener('click', pullGacha);

closeModal.addEventListener('click', () => {
    revealModal.classList.remove('active');
    const container = document.querySelector('.effect-container');
    if (container) container.remove();
    capsuleExit.innerHTML = '';
    state.isPulling = false;
    pullButton.disabled = false;
});

// Init
initCapsules();
updateInventoryUI();
