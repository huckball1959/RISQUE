/**
 * Standalone battle tape playback (risque-replay-v1 JSON). Uses core.js map rendering only.
 */
(function () {
  "use strict";

  var TAPE_VERSION = 2;
  var MS_DEPLOY = 90;
  var MS_BATTLE = 140;
  var MS_ELIMINATION = 900;
  var MS_INIT = 80;
  var MS_DEAL = 95;
  var MS_REPLAY_START_HOLD = 450;

  function tapeVersionOk(v) {
    return v === 1 || v === TAPE_VERSION;
  }

  function speedMultiplier() {
    var el = document.getElementById("risque-replay-speed");
    var n = el ? Number(el.value) : 100;
    if (!Number.isFinite(n) || n < 25) n = 25;
    if (n > 200) n = 200;
    return n / 100;
  }

  function scaledDelay(ms) {
    var sp = speedMultiplier();
    if (sp <= 0) return ms;
    return Math.max(16, Math.round(ms / sp));
  }

  function setStatus(msg) {
    var el = document.getElementById("risque-replay-status");
    if (el) el.textContent = msg || "";
  }

  function mergeReplayPacks(packs) {
    if (!packs || !packs.length) return null;
    if (packs.length === 1) return packs[0];
    var sorted = packs.slice().sort(function (a, b) {
      var ra = Number(a.replayRound != null ? a.replayRound : a.round) || 0;
      var rb = Number(b.replayRound != null ? b.replayRound : b.round) || 0;
      return ra - rb;
    });
    var seenRound = {};
    var dupRounds = [];
    var events = [];
    var lastR = 0;
    var gaps = [];
    var i;
    for (i = 0; i < sorted.length; i++) {
      var p = sorted[i];
      var rr = Number(p.replayRound != null ? p.replayRound : p.round) || 0;
      if (seenRound[rr]) {
        dupRounds.push(rr);
        continue;
      }
      seenRound[rr] = true;
      var te = p.tape && p.tape.events;
      if (te && te.length) {
        events = events.concat(te);
      }
      if (lastR > 0 && rr > lastR + 1) {
        gaps.push("after " + lastR + " missing through " + (rr - 1));
      }
      lastR = rr;
    }
    var headLast = sorted[sorted.length - 1];
    var headFirst = sorted[0];
    var skSet = {};
    sorted.forEach(function (q) {
      if (q.sessionKey) skSet[String(q.sessionKey)] = true;
    });
    var skList = Object.keys(skSet);
    var warns = [];
    if (dupRounds.length) warns.push("duplicate round files: " + dupRounds.join(", "));
    if (gaps.length) warns.push("round gaps — playback may jump: " + gaps.join("; "));
    if (skList.length > 1) warns.push("mixed sessionKey across files");
    var evs = events;
    return {
      format: "risque-replay-v1",
      replayScope: "merged",
      replayRounds: sorted.map(function (q) {
        return Number(q.replayRound != null ? q.replayRound : q.round) || 0;
      }),
      tapeFormatVersion: TAPE_VERSION,
      savedAt: Date.now(),
      round: headLast.round,
      phase: headLast.phase,
      currentPlayer: headLast.currentPlayer,
      sessionKey: headLast.sessionKey,
      playerColors:
        headFirst.playerColors && typeof headFirst.playerColors === "object"
          ? headFirst.playerColors
          : headLast.playerColors || {},
      tape: {
        v: TAPE_VERSION,
        events: evs,
        openingRecorded: evs.some(function (e) {
          return e && e.type === "init";
        }),
        hasDealFrames: evs.some(function (e) {
          return e && e.type === "board" && e.segment === "deal";
        })
      },
      __mergeWarnings: warns
    };
  }

  function normalizeImportedReplay(raw) {
    if (!raw || typeof raw !== "object") return null;
    if (raw.format === "risque-replay-v1" && raw.tape && tapeVersionOk(raw.tape.v)) {
      return raw;
    }
    if (raw.risqueReplayTape && tapeVersionOk(raw.risqueReplayTape.v)) {
      return {
        format: "risque-replay-v1",
        tapeFormatVersion: TAPE_VERSION,
        savedAt: Date.now(),
        round: raw.round,
        phase: raw.phase,
        currentPlayer: raw.currentPlayer,
        sessionKey: raw.risqueReplayTapeSessionKey || null,
        playerColors:
          raw.risqueReplayPlayerColors && typeof raw.risqueReplayPlayerColors === "object"
            ? raw.risqueReplayPlayerColors
            : {},
        tape: {
          v: raw.risqueReplayTape.v,
          events: raw.risqueReplayTape.events,
          openingRecorded: !!raw.risqueReplayTape.openingRecorded,
          hasDealFrames: !!raw.risqueReplayTape.hasDealFrames
        }
      };
    }
    return null;
  }

  function replayGhostColorForOwner(gs, ownerName) {
    var nm = String(ownerName || "");
    var m = gs && gs.risqueReplayPlayerColors;
    if (m && m[nm]) return m[nm];
    return "black";
  }

  function applyBoard(gs, board) {
    if (!gs || !gs.players || !board) return;
    var replay = !!gs.risqueReplayPlaybackActive;
    if (replay) {
      var need = {};
      Object.keys(board).forEach(function (label) {
        var cell = board[label];
        if (cell && cell.owner) need[String(cell.owner)] = true;
      });
      Object.keys(need).forEach(function (nm) {
        var hit = gs.players.some(function (x) {
          return x && String(x.name) === nm;
        });
        if (!hit) {
          gs.players.push({
            name: nm,
            territories: [],
            cards: [],
            cardCount: 0,
            color: replayGhostColorForOwner(gs, nm),
            risqueReplayGhostPlayer: true
          });
        }
      });
    }
    gs.players.forEach(function (p) {
      p.territories = [];
    });
    Object.keys(board).forEach(function (label) {
      var cell = board[label];
      if (!cell || !cell.owner) return;
      var own = String(cell.owner);
      var pl = gs.players.find(function (x) {
        return x && String(x.name) === own;
      });
      if (pl) {
        pl.territories.push({
          name: label,
          troops: Number(cell.troops) || 0
        });
      }
    });
    gs.players.forEach(function (p) {
      p.troopsTotal = (p.territories || []).reduce(function (s, t) {
        return s + (Number(t.troops) || 0);
      }, 0);
    });
    if (replay) {
      gs.players = gs.players.filter(function (p) {
        if (!p || !p.risqueReplayGhostPlayer) return true;
        return p.territories && p.territories.length > 0;
      });
    }
  }

  function boardSnapshotFromTape(board) {
    if (!board || typeof board !== "object") return {};
    var out = {};
    Object.keys(board).forEach(function (k) {
      var c = board[k];
      if (c && c.owner) {
        out[k] = { owner: String(c.owner), troops: Number(c.troops) || 0 };
      }
    });
    return out;
  }

  function replayDiffChangedTerritoryLabels(prev, next) {
    var labels = [];
    var seen = {};
    function add(lab) {
      if (!lab || seen[lab]) return;
      seen[lab] = true;
      labels.push(lab);
    }
    var keys = {};
    if (prev) Object.keys(prev).forEach(function (k) {
      keys[k] = true;
    });
    if (next) Object.keys(next).forEach(function (k) {
      keys[k] = true;
    });
    Object.keys(keys).forEach(function (lab) {
      var a = prev ? prev[lab] : null;
      var b = next ? next[lab] : null;
      if (!a && !b) return;
      if (!a || !b) {
        add(lab);
        return;
      }
      if (String(a.owner) !== String(b.owner) || (Number(a.troops) || 0) !== (Number(b.troops) || 0)) {
        add(lab);
      }
    });
    return labels;
  }

  function filterFullReplayEvents(events) {
    if (!events || !events.length) return [];
    var out = [];
    var i;
    for (i = 0; i < events.length; i++) {
      var e = events[i];
      if (!e || !e.type) continue;
      if (e.type === "init" && e.board) {
        out.push(e);
      } else if (
        e.type === "board" &&
        e.board &&
        (e.segment === "deal" || e.segment === "deploy" || e.segment === "battle")
      ) {
        out.push(e);
      } else if (e.type === "elimination") {
        out.push(e);
      }
    }
    return out;
  }

  function getEventRound(ev) {
    if (!ev || ev.round == null) return null;
    var n = typeof ev.round === "number" ? ev.round : parseInt(ev.round, 10);
    return isFinite(n) && n >= 1 ? n : null;
  }

  function collectReplayRounds(playbackEvents) {
    var seen = {};
    var i;
    for (i = 0; i < playbackEvents.length; i++) {
      var r = getEventRound(playbackEvents[i]);
      if (r != null) seen[r] = true;
    }
    return Object.keys(seen)
      .map(function (k) {
        return parseInt(k, 10);
      })
      .filter(function (x) {
        return isFinite(x);
      })
      .sort(function (a, b) {
        return a - b;
      });
  }

  function indexFirstBattle(playbackEvents) {
    var i;
    for (i = 0; i < playbackEvents.length; i++) {
      var e = playbackEvents[i];
      if (e && e.type === "board" && e.segment === "battle") return i;
    }
    return -1;
  }

  function replayComputeStartIndex(playbackEvents, mode, roundMin) {
    if (!playbackEvents || !playbackEvents.length) return 0;
    var m = String(mode || "deal").toLowerCase();
    if (m === "first_battle") {
      var ib = indexFirstBattle(playbackEvents);
      return ib >= 0 ? ib : 0;
    }
    if (m === "from_round") {
      var target = Number(roundMin);
      if (!isFinite(target) || target < 1) return 0;
      var j;
      for (j = 0; j < playbackEvents.length; j++) {
        var r = getEventRound(playbackEvents[j]);
        if (r != null && r >= target) return j;
      }
      return 0;
    }
    return 0;
  }

  function replayDelayForEvent(ev) {
    if (!ev || !ev.type) return scaledDelay(MS_BATTLE);
    if (ev.type === "init") return scaledDelay(MS_INIT);
    if (ev.type === "elimination") return scaledDelay(MS_ELIMINATION);
    if (ev.type === "board") {
      if (ev.segment === "deal") return scaledDelay(MS_DEAL);
      if (ev.segment === "deploy") return scaledDelay(MS_DEPLOY);
      return scaledDelay(MS_BATTLE);
    }
    return scaledDelay(MS_BATTLE);
  }

  function removeReplayRoundHud() {
    var legacy = document.getElementById("risque-replay-round-hud");
    if (legacy && legacy.parentNode) legacy.parentNode.removeChild(legacy);
  }

  function createReplayBarElement() {
    var bar = document.createElement("div");
    bar.id = "risque-replay-bar";
    bar.className = "risque-replay-bar";
    bar.setAttribute("role", "toolbar");
    bar.setAttribute("aria-label", "Replay controls");
    bar.innerHTML =
      '<div class="risque-replay-bar__main">' +
      '<span class="risque-replay-bar-title">MAP REPLAY</span>' +
      '<button type="button" class="risque-replay-bar-btn" id="risque-replay-skip">SKIP TO END</button>' +
      '<button type="button" class="risque-replay-bar-btn risque-replay-bar-btn--done" id="risque-replay-cancel">CLOSE</button>' +
      "</div>" +
      '<div class="risque-replay-bar__round" role="status" aria-live="polite">' +
      '<span class="risque-replay-bar-round__label">ROUND</span>' +
      '<span class="risque-replay-bar-round__num" id="risque-replay-bar-round-num">1</span>' +
      "</div>";
    return bar;
  }

  function wireReplayBarButtons(skipCb, cancelCb) {
    var sk = document.getElementById("risque-replay-skip");
    var ca = document.getElementById("risque-replay-cancel");
    if (sk && skipCb) sk.onclick = function () { skipCb(); };
    if (ca && cancelCb) ca.onclick = function () { cancelCb(); };
  }

  function syncRoundHud(gs) {
    if (!gs || !gs.risqueReplayPlaybackActive) {
      removeReplayRoundHud();
      var staleBar = document.getElementById("risque-replay-bar");
      if (staleBar && staleBar.parentNode) staleBar.parentNode.removeChild(staleBar);
      return;
    }
    var canvas = document.getElementById("canvas");
    if (!canvas) return;
    var raw = gs.risqueReplayHudRound;
    var n = typeof raw === "number" ? raw : parseInt(raw, 10);
    if (!isFinite(n) || n < 1) {
      var r2 = gs.round;
      n = typeof r2 === "number" ? r2 : parseInt(r2, 10);
    }
    if (!isFinite(n) || n < 1) n = 1;
    var bar = document.getElementById("risque-replay-bar");
    if (!bar) {
      bar = createReplayBarElement();
      canvas.appendChild(bar);
    }
    var numEl = document.getElementById("risque-replay-bar-round-num");
    if (numEl) numEl.textContent = String(n);
  }

  function removeReplaySplash() {
    var el = document.getElementById("risque-replay-splash");
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function showEliminationSplash(conqueror, defeated) {
    removeReplaySplash();
    var root = document.createElement("div");
    root.id = "risque-replay-splash";
    root.className = "risque-replay-splash";
    root.setAttribute("role", "status");
    var line = document.createElement("div");
    line.className = "risque-replay-splash-line";
    line.textContent =
      String(conqueror || "").toUpperCase() + " CONQUERS " + String(defeated || "").toUpperCase();
    root.appendChild(line);
    document.body.appendChild(root);
  }

  function removeReplayStartOverlay() {
    var el = document.getElementById("risque-replay-start-overlay");
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function showStartChooser(playbackEvents, onPick, onCancel) {
    removeReplayStartOverlay();
    var rounds = collectReplayRounds(playbackEvents);
    var hasRounds = rounds.length > 0;
    var ib = indexFirstBattle(playbackEvents);
    var hasBattle = ib >= 0;

    var overlay = document.createElement("div");
    overlay.id = "risque-replay-start-overlay";
    overlay.className = "risque-replay-start-overlay";
    overlay.setAttribute("role", "presentation");

    var dlg = document.createElement("div");
    dlg.className = "risque-replay-start-dialog";
    dlg.setAttribute("role", "dialog");
    dlg.setAttribute("aria-modal", "true");
    dlg.setAttribute("aria-labelledby", "risque-replay-start-heading");

    var title = document.createElement("div");
    title.id = "risque-replay-start-heading";
    title.className = "risque-replay-start-title";
    title.textContent = "MAP REPLAY";

    var sub = document.createElement("div");
    sub.className = "risque-replay-start-sub";
    sub.textContent = "Start from:";

    function rowRadio(value, labelText, checked, disabled) {
      var row = document.createElement("label");
      row.className = "risque-replay-start-row";
      if (disabled) row.className += " risque-replay-start-row--disabled";
      var inp = document.createElement("input");
      inp.type = "radio";
      inp.name = "risque-replay-start-mode";
      inp.value = value;
      inp.checked = !!checked;
      inp.disabled = !!disabled;
      var span = document.createElement("span");
      span.textContent = labelText;
      row.appendChild(inp);
      row.appendChild(span);
      return { row: row, input: inp };
    }

    var rDeal = rowRadio("deal", "Full — from territory deal (default)", true, false);
    var rBattle = rowRadio("first_battle", "Skip to first battle", false, !hasBattle);
    var rRound = rowRadio("from_round", "From round — first frame at or after:", false, !hasRounds);

    var roundSelect = document.createElement("select");
    roundSelect.id = "risque-replay-start-round";
    roundSelect.className = "risque-replay-start-round-select";
    roundSelect.disabled = !hasRounds;
    var ri;
    for (ri = 0; ri < rounds.length; ri++) {
      var opt = document.createElement("option");
      opt.value = String(rounds[ri]);
      opt.textContent = "Round " + rounds[ri];
      roundSelect.appendChild(opt);
    }

    var roundIndent = document.createElement("div");
    roundIndent.className = "risque-replay-start-round-indent";
    roundIndent.appendChild(roundSelect);

    if (!hasRounds) {
      var hint = document.createElement("div");
      hint.className = "risque-replay-start-hint";
      hint.textContent =
        "Round labels are unavailable for this recording. Use full replay or skip to battle.";
      roundIndent.appendChild(hint);
    }

    var actions = document.createElement("div");
    actions.className = "risque-replay-start-actions";
    var btnOk = document.createElement("button");
    btnOk.type = "button";
    btnOk.className = "risque-replay-start-btn risque-replay-start-btn--primary";
    btnOk.id = "risque-replay-start-ok";
    btnOk.textContent = "START";
    var btnCancel = document.createElement("button");
    btnCancel.type = "button";
    btnCancel.className = "risque-replay-start-btn";
    btnCancel.id = "risque-replay-start-cancel";
    btnCancel.textContent = "CANCEL";
    actions.appendChild(btnOk);
    actions.appendChild(btnCancel);

    dlg.appendChild(title);
    dlg.appendChild(sub);
    dlg.appendChild(rDeal.row);
    dlg.appendChild(rBattle.row);
    dlg.appendChild(rRound.row);
    dlg.appendChild(roundIndent);
    dlg.appendChild(actions);
    overlay.appendChild(dlg);
    document.body.appendChild(overlay);

    function selectedMode() {
      var radios = dlg.querySelectorAll('input[name="risque-replay-start-mode"]');
      var i;
      for (i = 0; i < radios.length; i++) {
        if (radios[i].checked) return radios[i].value;
      }
      return "deal";
    }

    function syncRoundEnabled() {
      roundSelect.disabled = !hasRounds || selectedMode() !== "from_round";
    }

    function onRadioChange() {
      syncRoundEnabled();
    }

    rDeal.input.addEventListener("change", onRadioChange);
    rBattle.input.addEventListener("change", onRadioChange);
    rRound.input.addEventListener("change", onRadioChange);
    roundSelect.addEventListener("change", function () {
      rRound.input.checked = true;
      syncRoundEnabled();
    });
    roundSelect.addEventListener("mousedown", function () {
      if (!rRound.input.disabled) rRound.input.checked = true;
    });

    function detachKey() {
      document.removeEventListener("keydown", onKey);
    }

    function finishPick() {
      var mode = selectedMode();
      var rn = rounds.length ? parseInt(roundSelect.value, 10) : 1;
      if (mode === "from_round" && !hasRounds) mode = "deal";
      if (mode === "first_battle" && !hasBattle) mode = "deal";
      var startIdx = replayComputeStartIndex(playbackEvents, mode, rn);
      detachKey();
      removeReplayStartOverlay();
      if (typeof onPick === "function") onPick(startIdx);
    }

    function finishCancel() {
      detachKey();
      removeReplayStartOverlay();
      if (typeof onCancel === "function") onCancel();
    }

    btnOk.addEventListener("click", function (e) {
      e.preventDefault();
      finishPick();
    });
    btnCancel.addEventListener("click", function (e) {
      e.preventDefault();
      finishCancel();
    });
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) finishCancel();
    });

    function onKey(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        finishCancel();
      }
    }
    document.addEventListener("keydown", onKey);

    syncRoundEnabled();
    try {
      btnOk.focus();
    } catch (eF) {
      /* ignore */
    }
  }

  function minimalStateFromPack(pack) {
    var gs = {
      phase: pack.phase != null ? String(pack.phase) : "attack",
      round: Number(pack.round) || 1,
      currentPlayer: pack.currentPlayer != null ? String(pack.currentPlayer) : "",
      turnOrder: [],
      players: [],
      deck: [],
      risqueReplayPlaybackActive: true,
      risqueReplayPlayerColors:
        pack.playerColors && typeof pack.playerColors === "object" ? pack.playerColors : {}
    };
    return gs;
  }

  function refreshTurnOrder(gs) {
    if (!gs || !gs.players) return;
    var names = gs.players.map(function (p) {
      return p && p.name ? String(p.name) : "";
    }).filter(Boolean);
    gs.turnOrder = names;
    if (!gs.currentPlayer || names.indexOf(gs.currentPlayer) === -1) {
      gs.currentPlayer = names[0] || "";
    }
  }

  var __timer = null;

  function stopPlayback() {
    if (__timer != null) {
      clearTimeout(__timer);
      __timer = null;
    }
    removeReplayStartOverlay();
    removeReplaySplash();
    removeReplayRoundHud();
    var barEarly = document.getElementById("risque-replay-bar");
    if (barEarly && barEarly.parentNode) barEarly.parentNode.removeChild(barEarly);
    if (window.gameState && typeof window.gameState === "object") {
      delete window.gameState.risqueReplayPlaybackActive;
      delete window.gameState.phaseReplayIndex;
      delete window.gameState.risqueReplayBattleFlashLabels;
    }
    setStatus("Playback stopped. Load another file to replay.");
  }

  function runPlaybackFromPack(pack, startIndex) {
    if (!window.gameUtils) {
      setStatus("Map engine not ready.");
      return;
    }
    stopPlayback();
    var playbackEvents = filterFullReplayEvents(pack.tape.events.slice());
    if (!playbackEvents.length) {
      setStatus("No playable frames on this tape.");
      return;
    }

    var gs = minimalStateFromPack(pack);
    window.gameState = gs;

    var idx = Math.max(
      0,
      Math.min(Math.floor(Number(startIndex)) || 0, Math.max(0, playbackEvents.length - 1))
    );

    var replayRoundFallback = (function () {
      var r = gs.round;
      var n = typeof r === "number" ? r : parseInt(r, 10);
      return isFinite(n) && n >= 1 ? n : 1;
    })();
    var lastStampedRound = null;
    var lastReplayBoardSnapshot = null;

    var canvasEl = document.getElementById("canvas");
    if (!canvasEl) return;

    gs.risqueReplayPlaybackActive = true;
    var bar = createReplayBarElement();
    canvasEl.appendChild(bar);
    gs.risqueReplayHudRound = replayRoundFallback;
    syncRoundHud(gs);
    wireReplayBarButtons(
      function () {
        idx = playbackEvents.length;
        step();
      },
      function () {
        stopPlayback();
      }
    );

    __timer = setTimeout(function () {
      __timer = null;
      step();
    }, scaledDelay(MS_REPLAY_START_HOLD));

    function step() {
      if (__timer != null) {
        clearTimeout(__timer);
        __timer = null;
      }
      removeReplaySplash();
      if (!window.gameState || !window.gameState.risqueReplayPlaybackActive) return;

      if (idx >= playbackEvents.length) {
        stopPlayback();
        return;
      }

      var ev = playbackEvents[idx];
      idx += 1;
      gs.phaseReplayIndex = idx;

      var stamped = getEventRound(ev);
      if (stamped != null) {
        lastStampedRound = stamped;
        gs.round = stamped;
      }
      gs.risqueReplayHudRound = lastStampedRound != null ? lastStampedRound : replayRoundFallback;
      syncRoundHud(gs);

      if (ev.type === "init") {
        delete gs.risqueReplayBattleFlashLabels;
        applyBoard(gs, ev.board);
        refreshTurnOrder(gs);
        lastReplayBoardSnapshot = boardSnapshotFromTape(ev.board);
        window.gameUtils.renderTerritories(null, gs);
        window.gameUtils.renderStats(gs);
      } else if (ev.type === "board") {
        delete gs.risqueReplayBattleFlashLabels;
        var nextSnap = boardSnapshotFromTape(ev.board);
        if (ev.segment === "battle" && lastReplayBoardSnapshot) {
          gs.risqueReplayBattleFlashLabels = replayDiffChangedTerritoryLabels(
            lastReplayBoardSnapshot,
            nextSnap
          );
        }
        applyBoard(gs, ev.board);
        refreshTurnOrder(gs);
        lastReplayBoardSnapshot = nextSnap;
        window.gameUtils.renderTerritories(null, gs);
        window.gameUtils.renderStats(gs);
        if (ev.segment === "battle" && gs.risqueReplayBattleFlashLabels) {
          var flashCopy = gs.risqueReplayBattleFlashLabels;
          window.setTimeout(function () {
            if (!window.gameState || window.gameState !== gs) return;
            if (!gs.risqueReplayPlaybackActive) return;
            if (gs.risqueReplayBattleFlashLabels !== flashCopy) return;
            delete gs.risqueReplayBattleFlashLabels;
            window.gameUtils.renderTerritories(null, gs);
          }, 240);
        }
      } else if (ev.type === "elimination") {
        delete gs.risqueReplayBattleFlashLabels;
        showEliminationSplash(ev.conqueror, ev.defeated);
      }

      var d = replayDelayForEvent(ev);
      __timer = setTimeout(step, d);
    }
  }

  function startFromPack(pack) {
    var playbackEvents = filterFullReplayEvents(pack.tape.events.slice());
    if (!playbackEvents.length) {
      setStatus("Tape has no deal, deploy, battle, or elimination frames.");
      return;
    }
    showStartChooser(playbackEvents, function (startIdx) {
      runPlaybackFromPack(pack, startIdx);
      setStatus("Playing… Esc closes.");
    });
  }

  function readFileAsJson(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        try {
          resolve(JSON.parse(String(reader.result || "")));
        } catch (e) {
          reject(e);
        }
      };
      reader.onerror = function () {
        reject(new Error("read"));
      };
      reader.readAsText(file);
    });
  }

  function onFilesSelected(fileList) {
    if (!fileList || !fileList.length) return;
    var files = Array.prototype.slice.call(fileList, 0);
    Promise.all(
      files.map(function (f) {
        return readFileAsJson(f);
      })
    )
      .then(function (raws) {
        var packs = [];
        var fi;
        for (fi = 0; fi < raws.length; fi++) {
          var pack = normalizeImportedReplay(raws[fi]);
          if (!pack) {
            setStatus("Not a replay file: " + (files[fi] && files[fi].name ? files[fi].name : String(fi)));
            return;
          }
          packs.push(pack);
        }
        var toPlay = packs.length === 1 ? packs[0] : mergeReplayPacks(packs);
        if (!toPlay || !toPlay.tape || !toPlay.tape.events || !toPlay.tape.events.length) {
          setStatus("No events to play.");
          return;
        }
        var bits = [];
        bits.push(packs.length === 1 ? "1 tape" : "merged " + packs.length + " tapes");
        if (toPlay.__mergeWarnings && toPlay.__mergeWarnings.length) {
          bits.push(toPlay.__mergeWarnings.join(" · "));
        }
        setStatus(bits.join(" — ") + ".");
        startFromPack(toPlay);
      })
      .catch(function () {
        setStatus("Invalid or unreadable JSON.");
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var inp = document.getElementById("risque-replay-file");
    if (inp) {
      inp.addEventListener("change", function () {
        var list = inp.files;
        inp.value = "";
        onFilesSelected(list);
      });
    }
    document.addEventListener("keydown", function (e) {
      if (!window.gameState || !window.gameState.risqueReplayPlaybackActive) return;
      if (e.key === "Escape") {
        e.preventDefault();
        stopPlayback();
      }
    });
  });
})();
