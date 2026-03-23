let gameState = {};
let isLaunchPage = true;
window.gameUtils = {
  territories: {
    afghanistan: { x: 748.18703, y: 468.32483, r: 30 },
    alaska: { x: 64.842522, y: 265.11024, r: 30 },
    alberta: { x: 146.86418, y: 365.16731, r: 30 },
    argentina: { x: 216.67912, y: 865.5414, r: 30 },
    brazil: { x: 284.95276, y: 732.33664, r: 30 },
    central_america: { x: 170.62205, y: 576.33074, r: 30 },
    china: { x: 855.15353, y: 493.48229, r: 30 },
    congo: { x: 595.46457, y: 748.55315, r: 30 },
    east_africa: { x: 641.71065, y: 681.1122, r: 30 },
    eastern_australia: { x: 1031.498, y: 746.77561, r: 30 },
    eastern_united_states: { x: 235.21063, y: 484.45871, r: 30 },
    egypt: { x: 582.83267, y: 621.50789, r: 30 },
    great_britain: { x: 498.44884, y: 456.57284, r: 30 },
    greenland: { x: 439.11614, y: 186.99803, r: 30 },
    iceland: { x: 515.34449, y: 294.36614, r: 30 },
    india: { x: 784.82483, y: 575.37996, r: 30 },
    indonesia: { x: 919.56503, y: 651.08858, r: 30 },
    irkutsk: { x: 916.07483, y: 338.23819, r: 30 },
    japan: { x: 985.51178, y: 454.41733, r: 30 },
    kamchatka: { x: 1027.0748, y: 309.67323, r: 30 },
    madagascar: { x: 685.31104, y: 834.99803, r: 30 },
    middle_east: { x: 681.33664, y: 589.1575, r: 30 },
    mongolia: { x: 909.8268, y: 427.87798, r: 30 },
    new_guinea: { x: 1025.3918, y: 655.91931, r: 30 },
    north_africa: { x: 508.37009, y: 669.15949, r: 30 },
    northern_europe: { x: 565.99608, y: 468.75595, r: 30 },
    northwest_territory: { x: 152.10828, y: 280.28149, r: 30 },
    ontario: { x: 242.19095, y: 368.77561, r: 30 },
    peru: { x: 200.3622, y: 765.23618, r: 30 },
    quebec: { x: 335.49802, y: 392.32682, r: 30 },
    scandinavia: { x: 578.69884, y: 349.31694, r: 30 },
    siam: { x: 881.69294, y: 581.48035, r: 30 },
    siberia: { x: 843.189, y: 196.64172, r: 30 },
    south_africa: { x: 602.40358, y: 829.0689, r: 30 },
    southern_europe: { x: 595.3347, y: 536.85237, r: 30 },
    ukraine: { x: 659.55711, y: 373.06298, r: 30 },
    ural: { x: 770.04923, y: 331.71261, r: 30 },
    venezuela: { x: 201.64369, y: 644.07278, r: 30 },
    western_australia: { x: 939.25995, y: 751.57681, r: 30 },
    western_europe: { x: 512.22638, y: 537.55513, r: 30 },
    western_united_states: { x: 142.3996, y: 456.57874, r: 30 },
    yakutsk: { x: 954.67323, y: 213.27755, r: 30 }
  },
  continents: {
    south_america: ['argentina', 'brazil', 'peru', 'venezuela'],
    north_america: ['alaska', 'alberta', 'central_america', 'eastern_united_states', 'greenland', 'northwest_territory', 'ontario', 'quebec', 'western_united_states'],
    africa: ['congo', 'east_africa', 'egypt', 'madagascar', 'north_africa', 'south_africa'],
    europe: ['great_britain', 'iceland', 'northern_europe', 'scandinavia', 'southern_europe', 'ukraine', 'western_europe'],
    asia: ['afghanistan', 'china', 'india', 'irkutsk', 'japan', 'kamchatka', 'middle_east', 'mongolia', 'siam', 'siberia', 'ural', 'yakutsk'],
    australia: ['eastern_australia', 'indonesia', 'new_guinea', 'western_australia']
  },
  continentValues: {
    south_america: { value: 2, increment: 2, bg: '#00ff00' },
    north_america: { value: 5, increment: 5, bg: '#ffff00' },
    africa: { value: 3, increment: 3, bg: '#ffa500' },
    europe: { value: 5, increment: 5, bg: '#008080' },
    asia: { value: 7, increment: 7, bg: '#90ee90' },
    australia: { value: 2, increment: 2, bg: '#e6e6fa' }
  },
  continentDisplayNames: {
    south_america: 'S. America',
    north_america: 'N. America',
    africa: 'Africa',
    europe: 'Europe',
    asia: 'Asia',
    australia: 'Australia'
  },
  adjacencies: {
    afghanistan: ["china", "india", "middle_east", "ukraine", "ural"],
    alaska: ["kamchatka", "northwest_territory", "alberta"],
    alberta: ["alaska", "northwest_territory", "ontario", "western_united_states"],
    argentina: ["brazil", "peru"],
    brazil: ["argentina", "peru", "venezuela", "north_africa"],
    central_america: ["venezuela", "eastern_united_states", "western_united_states"],
    china: ["afghanistan", "india", "siam", "mongolia", "siberia", "ural"],
    congo: ["east_africa", "north_africa", "south_africa"],
    east_africa: ["congo", "egypt", "madagascar", "north_africa", "south_africa", "middle_east"],
    eastern_australia: ["new_guinea", "western_australia"],
    eastern_united_states: ["central_america", "ontario", "quebec", "western_united_states"],
    egypt: ["east_africa", "north_africa", "southern_europe", "middle_east"],
    great_britain: ["iceland", "northern_europe", "scandinavia", "western_europe"],
    greenland: ["iceland", "ontario", "northwest_territory", "quebec"],
    iceland: ["greenland", "great_britain", "scandinavia"],
    india: ["afghanistan", "china", "siam", "middle_east"],
    indonesia: ["new_guinea", "siam", "western_australia"],
    irkutsk: ["kamchatka", "mongolia", "siberia", "yakutsk"],
    japan: ["kamchatka", "mongolia"],
    kamchatka: ["alaska", "irkutsk", "mongolia", "japan", "yakutsk"],
    madagascar: ["east_africa", "south_africa"],
    middle_east: ["afghanistan", "east_africa", "egypt", "india", "southern_europe", "ukraine"],
    mongolia: ["china", "irkutsk", "japan", "siberia", "kamchatka"],
    new_guinea: ["eastern_australia", "indonesia", "western_australia"],
    north_africa: ["brazil", "congo", "east_africa", "egypt", "southern_europe", "western_europe"],
    northern_europe: ["great_britain", "scandinavia", "southern_europe", "ukraine", "western_europe"],
    northwest_territory: ["alaska", "alberta", "ontario", "greenland"],
    ontario: ["alberta", "eastern_united_states", "northwest_territory", "quebec", "western_united_states", "greenland"],
    peru: ["argentina", "brazil", "venezuela"],
    quebec: ["eastern_united_states", "ontario", "greenland"],
    scandinavia: ["great_britain", "iceland", "northern_europe", "ukraine"],
    siam: ["china", "india", "indonesia"],
    siberia: ["china", "irkutsk", "mongolia", "ural", "yakutsk"],
    south_africa: ["congo", "east_africa", "madagascar"],
    southern_europe: ["egypt", "north_africa", "northern_europe", "western_europe", "middle_east", "ukraine"],
    ukraine: ["afghanistan", "middle_east", "northern_europe", "scandinavia", "southern_europe", "ural"],
    ural: ["afghanistan", "china", "siberia", "ukraine"],
    venezuela: ["brazil", "central_america", "peru"],
    western_australia: ["eastern_australia", "indonesia", "new_guinea"],
    western_europe: ["great_britain", "north_africa", "northern_europe", "southern_europe"],
    western_united_states: ["alberta", "central_america", "eastern_united_states", "ontario"],
    yakutsk: ["irkutsk", "kamchatka", "siberia"]
  },
  cardNames: [
    'afghanistan', 'alaska', 'alberta', 'argentina', 'brazil', 'central_america', 'china',
    'congo', 'east_africa', 'eastern_australia', 'eastern_united_states', 'egypt', 'great_britain',
    'greenland', 'iceland', 'india', 'indonesia', 'irkutsk', 'japan', 'kamchatka', 'madagascar',
    'middle_east', 'mongolia', 'new_guinea', 'north_africa', 'northern_europe', 'northwest_territory',
    'ontario', 'peru', 'quebec', 'scandinavia', 'siam', 'siberia', 'south_africa', 'southern_europe',
    'ukraine', 'ural', 'venezuela', 'western_australia', 'western_europe', 'western_united_states',
    'yakutsk', 'wildcard1', 'wildcard2'
  ],
  cardTypes: {
    afghanistan: 'infantry', alaska: 'artillery', alberta: 'artillery', argentina: 'infantry',
    brazil: 'infantry', central_america: 'infantry', china: 'artillery', congo: 'artillery',
    east_africa: 'infantry', eastern_australia: 'cavalry', eastern_united_states: 'artillery',
    egypt: 'cavalry', great_britain: 'infantry', greenland: 'cavalry', iceland: 'cavalry',
    india: 'cavalry', indonesia: 'infantry', irkutsk: 'artillery', japan: 'cavalry',
    kamchatka: 'artillery', madagascar: 'cavalry', middle_east: 'artillery', mongolia: 'cavalry',
    new_guinea: 'cavalry', north_africa: 'infantry', northern_europe: 'cavalry',
    northwest_territory: 'cavalry', ontario: 'artillery', peru: 'cavalry', quebec: 'artillery',
    scandinavia: 'infantry', siam: 'cavalry', siberia: 'infantry', south_africa: 'artillery',
    southern_europe: 'infantry', ukraine: 'infantry', ural: 'infantry', venezuela: 'cavalry',
    western_australia: 'artillery', western_europe: 'infantry', western_united_states: 'artillery',
    yakutsk: 'artillery', wildcard1: 'wildcard', wildcard2: 'wildcard'
  },
  colorMap: {
    blue: "#0000ff",
    red: "#ff0000",
    pink: "#ff69b4",
    black: "#333333",
    green: "#008000",
    yellow: "#ffff00"
  },
  getNextContinentValue: function(continent, collectionCount) {
    const increments = {
      south_america: 2,
      north_america: 5,
      africa: 3,
      europe: 5,
      asia: 7,
      australia: 2
    };
    const baseValue = this.continentValues[continent].value;
    return baseValue + (collectionCount * increments[continent]);
  },
  continentSnapshot: function(player) {
    const snapshot = {};
    for (const [continent, territories] of Object.entries(this.continents)) {
      snapshot[continent] = territories.every(t => player.territories.some(pt => pt.name === t));
    }
    return snapshot;
  },
  initStyles: function() {
    const style = document.createElement('style');
    style.textContent = `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      html, body {
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #000000;
        font-family: Arial, sans-serif;
        touch-action: none;
        -webkit-text-size-adjust: none;
        -webkit-user-select: none;
        user-select: none;
      }
      .canvas-wrapper {
        width: 1920px;
        height: 1080px;
        position: absolute;
        top: 0;
        left: 50%;
        transform-origin: top center;
        transform: translate(-50%, 0);
        background: #0000ff;
        border: 6px solid #ff0000;
        pointer-events: auto;
        opacity: 0;
        transition: opacity 2s ease;
        display: none;
      }
      .canvas-wrapper.visible {
        display: block;
        opacity: 1;
      }
      .stage-image {
        position: absolute;
        width: 1920px;
        height: 1080px;
        top: 0;
        left: 0;
        z-index: 0;
        object-fit: contain;
        background: #333333;
        display: none;
      }
      .stage-image.visible {
        display: block;
      }
      .svg-overlay {
        position: absolute;
        width: 1920px;
        height: 1080px;
        top: 0;
        left: 0;
        z-index: 1;
        pointer-events: all;
        display: none;
      }
      .svg-overlay.visible {
        display: block;
      }
      .ui-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 1920px;
        height: 1080px;
        z-index: 2;
        pointer-events: none;
        opacity: 0;
        transition: opacity 2s ease;
      }
      .ui-overlay.visible {
        opacity: 1;
      }
      .ui-overlay * {
        pointer-events: auto;
      }
      .territory-circle {
        cursor: pointer;
        stroke: #000000;
        stroke-width: 2;
        pointer-events: all;
        transition: r 0.2s, stroke-width 0.2s;
      }
      .territory-circle:hover {
        r: 35;
      }
      .territory-circle.selected {
        r: 35;
        stroke-width: 3;
      }
      .territory-number {
        font-family: Arial, sans-serif;
        font-weight: bold;
        font-size: 21px;
        text-anchor: middle;
        dominant-baseline: central;
        pointer-events: all;
        cursor: pointer;
      }
      .error {
        position: absolute;
        left: 1105px;
        top: 950px;
        max-width: 200px;
        white-space: normal;
        color: #ff0000;
        font-family: Arial, sans-serif;
        font-size: 16px;
        font-weight: 900;
        z-index: 2;
        pointer-events: none;
        text-align: left;
        visibility: hidden;
      }
      .error.visible {
        visibility: visible;
      }
      .load-button {
        position: absolute;
        top: 540px;
        left: 960px;
        transform: translate(-50%, -50%);
        width: 200px;
        padding: 10px;
        font-size: 16px;
        font-weight: bold;
        border: none;
        border-radius: 4px;
        background: #28a745;
        color: #ffffff;
        cursor: pointer;
        z-index: 3;
        opacity: 0;
        transition: opacity 2s ease;
      }
      .load-button.visible {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
    console.log('[Core] Styles initialized');
  },
  initLaunchPage: function() {
    const canvasWrapper = document.getElementById('canvas');
    if (!canvasWrapper) return;
    canvasWrapper.innerHTML = `
      <div id="launcher-title">PLAYER PHASE LAUNCHER</div>
      <button class="load-button" id="load-button">Load Game</button>
      <input type="file" id="load-game-input" accept=".json" style="display: none;">
      <div id="error" class="error"></div>
    `;
    const loadButton = document.getElementById('load-button');
    const loadInput = document.getElementById('load-game-input');
    loadButton.addEventListener('click', () => {
      console.log('[Core] Load Game button clicked');
      loadInput.click();
    });
    loadInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) {
        console.log('[Core] No file selected');
        this.showError('No file selected');
        return;
      }
      console.log(`[Core] Loading file: ${file.name}`);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          gameState = JSON.parse(e.target.result);
          if (!this.validateGameState(gameState)) {
            console.error('[Core] Invalid game state in file');
            this.showError('Invalid game state in file');
            return;
          }
          localStorage.setItem('gameState', JSON.stringify(gameState));
          console.log('[Core] Game state loaded from file:', gameState);
          window.location.href = 'cardplay.html';
        } catch (err) {
          console.error(`[Core] Error parsing file: ${err.message}`);
          this.showError('Error parsing game file');
        }
        loadInput.value = '';
      };
      reader.readAsText(file);
    });
    this.resizeCanvas();
    console.log('[Core] Launch page initialized');
  },
  initGameView: function() {
    console.log('[Core] Initializing game view for non-launch page');
    const canvasWrapper = document.getElementById('canvas');
    if (!canvasWrapper) {
      console.log('[Core] Canvas wrapper not found for initGameView');
      this.showError('Canvas wrapper not found');
      return;
    }
    let stageImage = document.querySelector('.stage-image');
    if (!stageImage) {
      stageImage = document.createElement('img');
      stageImage.id = 'stage-image';
      stageImage.src = 'assets/images/stage.png';
      stageImage.alt = 'Stage';
      stageImage.className = 'stage-image';
      stageImage.onerror = () => this.showError('Failed to load stage image');
      canvasWrapper.appendChild(stageImage);
      console.log('[Core] Stage image created');
    }
    let svgOverlay = document.querySelector('.svg-overlay');
    if (!svgOverlay) {
      svgOverlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgOverlay.setAttribute('class', 'svg-overlay');
      svgOverlay.setAttribute('viewBox', '0 0 1920 1080');
      svgOverlay.setAttribute('width', '1920');
      svgOverlay.setAttribute('height', '1080');
      canvasWrapper.appendChild(svgOverlay);
      console.log('[Core] SVG overlay created');
    }
    this.resizeCanvas();
    console.log('[Core] Game view initialized');
  },
  validateGameState: function(gameState) {
    const isValid = gameState &&
      gameState.players &&
      Array.isArray(gameState.players) &&
      gameState.players.length >= 2 &&
      gameState.currentPlayer &&
      gameState.turnOrder &&
      gameState.players.every(p => p.name && p.color && Array.isArray(p.territories));
    console.log(`[Core] Game state valid: ${isValid}`);
    return isValid;
  },
  loadGameState: function(callback) {
    try {
      gameState = JSON.parse(localStorage.getItem('gameState') || '{}');
      console.log('[Core] Loaded gameState:', gameState);
      if (!this.validateGameState(gameState)) {
        console.error('[Core] Invalid game state');
        this.showError('Invalid game state');
        callback(null);
        return;
      }
      if (!gameState.continentCollectionCounts) {
        gameState.continentCollectionCounts = {
          south_america: 0,
          north_america: 0,
          africa: 0,
          europe: 0,
          asia: 0,
          australia: 0
        };
        console.log('[Core] Initialized continentCollectionCounts:', gameState.continentCollectionCounts);
      }
      if (gameState.phase === 'getcard' && gameState.deck && gameState.deck.length > 0) {
        const currentPlayer = gameState.players.find(p => p.name === gameState.currentPlayer);
        if (currentPlayer) {
          const card = gameState.deck.shift();
          currentPlayer.cards = currentPlayer.cards || [];
          currentPlayer.cards.push(card);
          currentPlayer.cardCount = currentPlayer.cards.length;
          console.log(`[Core] Drew card ${card} for ${currentPlayer.name}`);
        }
        const currentIndex = gameState.turnOrder.indexOf(gameState.currentPlayer);
        const nextIndex = (currentIndex + 1) % gameState.turnOrder.length;
        gameState.currentPlayer = gameState.turnOrder[nextIndex];
        gameState.phase = 'cardplay';
        localStorage.setItem('gameState', JSON.stringify(gameState));
        console.log(`[Core] Advanced to next player: ${gameState.currentPlayer}, phase: cardplay`);
      }
      callback(gameState);
    } catch (e) {
      console.error('[Core] Failed to load game state:', e.message);
      this.showError('Failed to load game state');
      callback(null);
    }
  },
  showError: function(message) {
    if (!message) return;
    const errorDiv = document.getElementById('error');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.classList.add('visible');
      setTimeout(() => errorDiv.classList.remove('visible'), 5000);
      console.log(`[Core] Error displayed: ${message}`);
    } else {
      console.error('[Core] Error element not found for message:', message);
    }
  },
  renderTerritories: function(changedLabel, gameState, deployedTroops = {}) {
    console.log(`[Core] Rendering territories, changedLabel: ${changedLabel || 'all'}, viewTroopsActive: ${window.viewTroopsActive || false}, deployedTroops:`, deployedTroops);
    try {
      const svg = document.querySelector('.svg-overlay');
      if (!svg) {
        console.error('[Core] SVG overlay not found');
        this.showError('SVG overlay not found');
        return;
      }
      if (!changedLabel) {
        svg.querySelectorAll('circle.territory-circle, text.territory-number').forEach(el => el.remove());
      }
      const territoryNames = Object.keys(this.territories);
      const renderTerritories = changedLabel ? [changedLabel] : territoryNames;
      renderTerritories.forEach(label => {
        if (label === 'wildcard1' || label === 'wildcard2') return;
        const territory = this.territories[label];
        if (!territory) {
          console.error(`[Core] No coordinates for ${label}`);
          this.showError(`No coordinates for ${label}`);
          return;
        }
        let playerName = null;
        let troops = 1;
        for (const player of gameState.players) {
          const t = player.territories.find(t => t.name === label);
          if (t) {
            playerName = player.name;
            troops = t.troops;
            break;
          }
        }
        const player = gameState.players.find(p => p.name === playerName);
        const color = player ? this.colorMap[player.color] || '#ffffff' : '#808080';
        const isDeployed = window.viewTroopsActive && deployedTroops[label] > 0 && playerName === gameState.currentPlayer;
        const textColor = isDeployed ? '#000000' : (player && (player.color === 'pink' || player.color === 'yellow') ? '#000000' : '#ffffff');
        const existingCircle = svg.querySelector(`circle[data-label="${label}"]`);
        const existingNumber = svg.querySelector(`text[data-label="${label}"]`);
        if (existingCircle) existingCircle.remove();
        if (existingNumber) existingNumber.remove();
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttributeNS(null, 'cx', territory.x);
        circle.setAttributeNS(null, 'cy', territory.y);
        circle.setAttributeNS(null, 'r', territory.r);
        circle.setAttributeNS(null, 'fill', isDeployed ? '#ffffff' : color);
        circle.setAttributeNS(null, 'stroke', isDeployed ? '#ff0000' : '#000000');
        circle.setAttributeNS(null, 'stroke-width', isDeployed ? '4' : '2');
        circle.setAttributeNS(null, 'class', 'territory-circle');
        circle.setAttributeNS(null, 'data-label', label);
        circle.setAttributeNS(null, 'role', 'button');
        circle.setAttributeNS(null, 'aria-label', `Select ${label.replace(/_/g, ' ')} (Troops: ${troops})`);
        circle.style.opacity = '1';
        circle.style.pointerEvents = 'all';
        const number = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        number.setAttributeNS(null, 'x', territory.x);
        number.setAttributeNS(null, 'y', territory.y);
        number.setAttributeNS(null, 'fill', textColor);
        number.setAttributeNS(null, 'class', 'territory-number');
        number.setAttributeNS(null, 'text-anchor', 'middle');
        number.setAttributeNS(null, 'dominant-baseline', 'central');
        number.setAttributeNS(null, 'font-size', '21');
        number.setAttributeNS(null, 'font-family', 'Arial, sans-serif');
        number.setAttributeNS(null, 'font-weight', 'bold');
        number.setAttributeNS(null, 'data-label', label);
        number.textContent = troops.toString().padStart(3, '0');
        number.style.opacity = '1';
        number.style.pointerEvents = 'all';
        if (window.location.pathname.includes('attack.html') && typeof window.handleTerritoryClick === 'function') {
          const clickHandler = () => {
            console.log(`[Core] Circle clicked: ${label}`);
            window.handleTerritoryClick(label, playerName || 'None', troops);
          };
          const keydownHandler = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              console.log(`[Core] Circle keydown: ${label}`);
              window.handleTerritoryClick(label, playerName || 'None', troops);
            }
          };
          circle.addEventListener('click', clickHandler);
          circle.addEventListener('keydown', keydownHandler);
          number.addEventListener('click', clickHandler);
          number.addEventListener('keydown', keydownHandler);
        } else if (window.location.pathname.includes('reinforce.html') && typeof window.handleTerritoryClick === 'function') {
          const clickHandler = () => {
            console.log(`[Core] Circle clicked: ${label}`);
            window.handleTerritoryClick(label, playerName || 'None', troops);
          };
          const keydownHandler = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              console.log(`[Core] Circle keydown: ${label}`);
              window.handleTerritoryClick(label, playerName || 'None', troops);
            }
          };
          circle.addEventListener('click', clickHandler);
          circle.addEventListener('keydown', keydownHandler);
          number.addEventListener('click', clickHandler);
          number.addEventListener('keydown', keydownHandler);
        } else {
          const clickHandler = () => this.handleTerritoryClick(label, circle, territory.r, gameState);
          circle.addEventListener('click', clickHandler);
          number.addEventListener('click', clickHandler);
        }
        circle.addEventListener('mouseover', () => circle.setAttributeNS(null, 'r', territory.r + 5));
        circle.addEventListener('mouseout', () => {
          if (!circle.classList.contains('selected')) {
            circle.setAttributeNS(null, 'r', territory.r);
          }
        });
        svg.appendChild(circle);
        svg.appendChild(number);
        console.log(`[Core] Rendered territory ${label}: owner=${playerName || 'none'}, color=${isDeployed ? '#ffffff' : color}, troops=${troops}, deployed=${isDeployed}, x=${territory.x}, y=${territory.y}`);
      });
      console.log(`[Core] Rendered ${renderTerritories.length} territory markers`);
    } catch (e) {
      console.error('[Core] Error rendering territories:', e.message);
      this.showError('Error rendering territories');
    }
  },
  handleTerritoryClick: function(label, circle, originalR, gameState) {
    console.log(`[Core] Clicked territory: ${label}`);
    if (!gameState || !gameState.players) {
      console.error('[Core] Game state or players undefined');
      this.showError('Game state or players undefined');
      window.selectedTerritory = null;
      requestAnimationFrame(() => {
        this.renderTerritories(null, gameState, window.deployedTroops || {});
        this.renderStats(gameState);
      });
      return;
    }
    const player = gameState.players.find(p => p.name === gameState.currentPlayer);
    const territory = player?.territories.find(t => t.name === label);
    if (label === window.selectedTerritory) {
      window.selectedTerritory = null;
      this.showError('');
    } else {
      window.selectedTerritory = null;
      this.showError('');
      if (territory) {
        window.selectedTerritory = label;
      } else {
        this.showError(`You do not own ${label.replace(/_/g, ' ')}.`);
      }
    }
    circle.setAttributeNS(null, 'r', originalR);
    circle.classList.toggle('selected', !!window.selectedTerritory && window.selectedTerritory === label);
    requestAnimationFrame(() => {
      this.renderTerritories(null, gameState, window.deployedTroops || {});
      this.renderStats(gameState);
    });
  },
  renderStats: function(gameState) {
    console.log('[Core] Rendering SVG stats, gameState:', gameState);
    try {
      const svg = document.querySelector('.svg-overlay');
      if (!svg) {
        console.error('[Core] SVG overlay not found');
        this.showError('SVG overlay not found');
        return;
      }
      if (!gameState.players || !gameState.currentPlayer || !gameState.turnOrder) {
        console.error('[Core] Invalid gameState: missing players, currentPlayer, or turnOrder');
        this.showError('Invalid game state');
        return;
      }
      const currentPlayer = gameState.players.find(p => p.name === gameState.currentPlayer);
      if (!currentPlayer) {
        console.error('[Core] Current player not found in gameState');
        this.showError('Current player not found');
        return;
      }
      const existingStats = svg.querySelector('#stats-group');
      if (existingStats) existingStats.remove();
      const statsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      statsGroup.setAttribute('id', 'stats-group');
      statsGroup.setAttribute('aria-label', 'Game statistics table');
      const tableX = 1105;
      const tableY = 20;
      const cellPadding = 3.0375;
      const borderWidth = 1.0125;
      const headerFontSize = 10.125;
      const cellFontSize = 11.1375;
      const rowHeight = 22.275;
      const headerRowHeight = 20.25;
      const columnWidths = [116.7855, 116.7855, 116.7855, 116.7855, 314.128125];
      const maxPlayers = 6;
      const rows = [];
      rows.push(['Player', 'Territories', 'Troops', 'Cards', 'Continents']);
      const player1c = gameState.turnOrder[0];
      const orderedPlayers = [];
      const player1cData = gameState.players.find(p => p.name === player1c);
      if (player1cData) orderedPlayers.push(player1cData);
      gameState.turnOrder
        .filter(name => name !== player1c)
        .forEach(name => {
          const player = gameState.players.find(p => p.name === name);
          if (player) orderedPlayers.push(player);
        });
      for (let i = 0; i < maxPlayers; i++) {
        const p = orderedPlayers[i] || { name: '', territories: [], troopsTotal: 0, cardCount: 0 };
        const continents = p.name ? this.getPlayerContinents(p) : [];
        const troops = Number(p.troopsTotal) || 0;
        const cardCount = Number(p.cardCount) || 0;
        rows.push([p.name || '-', p.territories.length || 0, troops, cardCount, continents.length ? continents.join(', ') : '-']);
        console.log(`[Core] Stats for ${p.name || 'empty'}: territories=${p.territories.length || 0}, troops=${troops}, cardCount=${cardCount}`);
      }
      rows.push([
        'S. America', this.getNextContinentValue('south_america', (gameState.continentCollectionCounts?.south_america || 0)),
        'N. America', this.getNextContinentValue('north_america', (gameState.continentCollectionCounts?.north_america || 0)),
        `ROUNDS: ${gameState.round || 1}`
      ]);
      rows.push([
        'Africa', this.getNextContinentValue('africa', (gameState.continentCollectionCounts?.africa || 0)),
        'Europe', this.getNextContinentValue('europe', (gameState.continentCollectionCounts?.europe || 0)),
        `CARDS: ${(Object.keys(this.territories).length + 2) - gameState.players.reduce((sum, p) => sum + (Number(p.cardCount) || 0), 0)}`
      ]);
      rows.push([
        'Asia', this.getNextContinentValue('asia', (gameState.continentCollectionCounts?.asia || 0)),
        'Australia', this.getNextContinentValue('australia', (gameState.continentCollectionCounts?.australia || 0)),
        ''
      ]);
      let currentY = tableY + cellPadding;
      rows.forEach((row, rowIndex) => {
        let currentX = tableX + cellPadding;
        const isHeader = rowIndex === 0;
        const isPlayerRow = rowIndex >= 1 && rowIndex <= maxPlayers;
        const playerName = isPlayerRow ? row[0] : null;
        const player = playerName && playerName !== '-' ? gameState.players.find(p => p.name === playerName) : null;
        const isCurrentPlayer = playerName === gameState.currentPlayer;
        const rowHeightToUse = isHeader ? headerRowHeight : rowHeight;
        const fontSize = isHeader ? headerFontSize : cellFontSize;
        row.forEach((cell, colIndex) => {
          const cellRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          cellRect.setAttribute('x', currentX);
          cellRect.setAttribute('y', currentY);
          cellRect.setAttribute('width', columnWidths[colIndex]);
          cellRect.setAttribute('height', rowHeightToUse);
          cellRect.setAttribute('fill', isPlayerRow && player ? (this.colorMap[player.color] || '#808080') : 'transparent');
          cellRect.setAttribute('stroke', isCurrentPlayer ? '#ffffff' : '#000000');
          cellRect.setAttribute('stroke-width', isCurrentPlayer ? '3' : borderWidth);
          cellRect.style.opacity = isPlayerRow && !isCurrentPlayer ? '0.5' : '1';
          statsGroup.appendChild(cellRect);
          if (cell) {
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', currentX + columnWidths[colIndex] / 2);
            text.setAttribute('y', currentY + rowHeightToUse / 2);
            text.setAttribute('fill', isPlayerRow && player && ['blue', 'red', 'green', 'black'].includes(player.color) ? '#ffffff' : '#000000');
            text.setAttribute('font-family', 'Arial, sans-serif');
            text.setAttribute('font-size', fontSize);
            text.setAttribute('font-weight', 'bold');
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'central');
            text.setAttribute('opacity', '1');
            text.textContent = cell.toString();
            statsGroup.appendChild(text);
          }
          currentX += columnWidths[colIndex] + borderWidth;
        });
        currentY += rowHeightToUse + borderWidth;
      });
      svg.appendChild(statsGroup);
      console.log(`[Core] Rendered SVG stats at x=${tableX}, y=${tableY}`);
    } catch (e) {
      console.error('[Core] Error rendering stats:', e.message);
      this.showError('Error rendering stats');
    }
  },
  getPlayerContinents: function(player) {
    try {
      const continentsOwned = [];
      for (const [continent, territories] of Object.entries(this.continents)) {
        if (territories.every(t => player.territories.some(pt => pt.name === t))) {
          continentsOwned.push(this.continentDisplayNames[continent]);
        }
      }
      return continentsOwned;
    } catch (e) {
      console.error('[Core] Error in getPlayerContinents:', e.message);
      return [];
    }
  },
  getTerritoryNames: function() {
    return Object.keys(this.territories);
  },
  getTerritoryCoords: function() {
    return this.territories;
  },
  getAdjacencies: function(territory) {
    return this.adjacencies[territory] || [];
  },
  resizeCanvas: function() {
    const canvas = document.getElementById('canvas');
    if (!canvas) {
      console.log('[Core] Canvas not found for scaling');
      return;
    }
    const scale = Math.min(window.innerHeight / 1080, window.innerWidth / 1920);
    canvas.style.transform = `translate(-50%, 0) scale(${scale})`;
    canvas.classList.add('visible');
    const stageImage = document.querySelector('.stage-image');
    const svgOverlay = document.querySelector('.svg-overlay');
    const uiOverlay = document.querySelector('.ui-overlay');
    if (stageImage) stageImage.classList.add('visible');
    if (svgOverlay) svgOverlay.classList.add('visible');
    if (uiOverlay) uiOverlay.classList.add('visible');
    console.log('[Core] Canvas scaled:', { scale, innerWidth: window.innerWidth, innerHeight: window.innerHeight });
  },
  renderAll: function(gameState, changedLabel = null, deployedTroops = {}) {
    this.renderTerritories(changedLabel, gameState, deployedTroops);
    this.renderStats(gameState);
  },
  renderGame: function() {
    this.loadGameState((gameState) => {
      if (gameState) {
        requestAnimationFrame(() => {
          this.renderAll(gameState);
        });
      }
    });
  },
  init: function() {
    this.initStyles();
    if (window.location.pathname.includes('launch.html')) {
      isLaunchPage = true;
      this.initLaunchPage();
    } else {
      isLaunchPage = false;
      console.log('[Core] Initializing game view for non-launch page');
      this.initGameView();
    }
    window.addEventListener('resize', () => requestAnimationFrame(() => this.resizeCanvas()));
    document.addEventListener('fullscreenchange', () => requestAnimationFrame(() => this.resizeCanvas()));
    document.addEventListener('webkitfullscreenchange', () => requestAnimationFrame(() => this.resizeCanvas()));
    document.addEventListener('mozfullscreenchange', () => requestAnimationFrame(() => this.resizeCanvas()));
    document.addEventListener('MSFullscreenChange', () => requestAnimationFrame(() => this.resizeCanvas()));
    document.addEventListener('wheel', e => {
      if (e.ctrlKey) e.preventDefault();
    }, { passive: false });
    document.addEventListener('keydown', e => {
      if (e.key === 'Equal' || e.key === 'Minus' || (e.ctrlKey && (e.key === '+' || e.key === '-'))) {
        e.preventDefault();
      }
    });
    console.log('[Core] Initialized');
  }
};
window.gameUtils.init();