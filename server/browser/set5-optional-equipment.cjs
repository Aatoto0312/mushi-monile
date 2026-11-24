'use strict';
const { test } = require('node:test'),
  assert = require('node:assert/strict'),
  fs = require('fs'),
  os = require('os'),
  path = require('path');
const rt = require('../lib/runtime.cjs'),
  original = rt.createRuntime;
let scenario;
const { setup } = require('../../tests/fixtures/set5-recovery.cjs');
// Test-only scenario injection. Production server code and readiness never change.
rt.createRuntime = function () {
  const r = original(),
    start = r.start;
  r.start = function (...args) {
    const s = start(...args);
    setup(r.context, s, scenario.number, scenario.territory);
    return s;
  };
  return r;
};
const { build } = require('../../scripts/build-online-candidate.cjs'),
  { createCandidateServer } = require('../tools/candidate-server.cjs');
const pw = require(process.env.MUSHI_PLAYWRIGHT_PATH || 'playwright');
for (const kind of ['chromium', 'webkit'])
  for (const mode of ['cpu', 'online'])
    test(
      kind + ' ' + mode + ' SET5 canonical B-board selections resolve',
      async (t) => {
        const dir = fs.mkdtempSync(
          path.join(os.tmpdir(), 'mushi-set5-restricted-'),
        );
        t.after(() => {
          assert.equal(path.dirname(dir), path.resolve(os.tmpdir()));
          assert(path.basename(dir).startsWith('mushi-set5-restricted-'));
          fs.rmSync(dir, { recursive: true, force: true });
        });
        const candidate =
          process.env.MUSHI_CANDIDATE_DIRECTORY || path.join(dir, 'candidate');
        if (!process.env.MUSHI_CANDIDATE_DIRECTORY) build(candidate);
        const app = createCandidateServer(candidate, { rng: () => 0 });
        await app.start();
        t.after(() => app.stop());
        const browser = await pw[kind].launch(
          kind === 'chromium' &&
            process.env.MUSHI_CHROMIUM_CHANNEL !== 'bundled'
            ? { channel: 'msedge' }
            : {},
        );
        t.after(() => browser.close());
        for (const number of [48, 49, 55]) {
          const territory = false;
          scenario = { number, territory };
          const a = await browser.newPage({
              viewport: { width: 375, height: 667 },
              isMobile: true,
              hasTouch: true,
            }),
            errors = [];
          a.on('pageerror', (e) => errors.push(e.message));
          let b;
          try {
            await a.addInitScript(() => (Math.random = () => 0));
            if (mode === 'cpu') {
              await a.goto(app.url + '/index.html');
              await a.locator('#btn-vs-cpu').click();
              await a.locator('#btn-deck-p1-kabuto').click();
              await a.locator('#btn-deck-p2-okama').click();
              await a.locator('#cpu-b-shell').waitFor();
              await a.evaluate(
                ({ code, number, territory }) => {
                  const ui = MushiBattle.ui;
                  (0, eval)('(' + code + ')')(
                    window,
                    ui.state,
                    number,
                    territory,
                  );
                  ui.render();
                },
                { code: setup.toString(), number, territory },
              );
            } else {
              b = await browser.newPage();
              for (const p of [a, b]) {
                await p.goto(app.url + '/online-b.html');
                await p.waitForFunction(
                  () => !document.querySelector('#create').disabled,
                );
              }
              await a.locator('#create').click();
              await a.locator('#room-code').waitFor();
              await b
                .locator('#code')
                .fill(await a.locator('#room-code').innerText());
              await b.locator('#join').click();
              await b.locator('#room').waitFor();
              for (const p of [a, b]) {
                const v = await p
                  .locator('#board')
                  .getAttribute('data-version');
                await p.locator('#deck-apply').click();
                await Promise.all(
                  [a, b].map((q) =>
                    q.waitForFunction(
                      (v) =>
                        Number(
                          document.querySelector('#board').dataset.version,
                        ) > Number(v),
                      v,
                    ),
                  ),
                );
              }
              for (const p of [a, b]) {
                const v = await p
                  .locator('#board')
                  .getAttribute('data-version');
                await p.locator('#ready').click();
                await Promise.all(
                  [a, b].map((q) =>
                    q.waitForFunction(
                      (v) =>
                        Number(
                          document.querySelector('#board').dataset.version,
                        ) > Number(v),
                      v,
                    ),
                  ),
                );
              }
              await a.waitForFunction(
                () =>
                  document.querySelector('#board').dataset.roomPhase ===
                  'PLAYING',
              );
            }
            const id = 'set5_' + String(number).padStart(3, '0');
            if (
              (await a
                .locator('[data-role="hand-toggle"]')
                .getAttribute('aria-expanded')) === 'false'
            )
              await a.locator('[data-role="hand-toggle"]').click();
            await a
              .locator('[data-role="hand"] .unit[data-card-id="' + id + '"]')
              .click();
            await a
              .getByRole('button', { name: '強化を使う', exact: true })
              .click();
            await a.locator('[data-role="own-field"] .target').click();
            await a.waitForFunction(() =>
              document
                .querySelector('[data-role="own-field"] .markers')
                ?.textContent.includes('強化 1'),
            );
            await a.locator('[data-role="end"]').click();
            if (mode === 'online') {
              for (let i = 0; i < 3; i++) {
                await b.locator('[data-role="all-actions"]').click();
                if (await b.locator('#sheet [data-kind="MAIN"]').count()) {
                  await b.locator('#sheet [data-kind="MAIN"]').click();
                  break;
                }
                if (await b.locator('#sheet [data-kind="DRAW"]').count())
                  await b.locator('#sheet [data-kind="DRAW"]').click();
                else await b.locator('#sheet [data-kind="TO_SET"]').click();
              }
              await b
                .locator(
                  '[data-role="own-field"] .unit[data-card-id="set1_003"]',
                )
                .click();
              await b
                .getByRole('button', { name: '攻撃する', exact: true })
                .click();
              await b.locator('[data-skill]').first().click();
              await b.locator('[data-role="other-field"] .target').click();
            }
            await a.locator('.online-choice-list>button').first().waitFor();
            if (mode === 'online') {
              await a.reload();
              await a.locator('.online-choice-list>button').first().waitFor();
              assert.equal(
                await b.locator('.online-choice-list:visible').count(),
                0,
              );
            }
            assert.equal(
              await a.locator('.online-choice-list>button').count(),
              1,
            );
            await a.locator('.online-choice-list>button').click();
            await a.locator('[data-kind="CONFIRM_SELECTION"]').click();
            const returned = id;
            await a
              .locator(
                '[data-role="hand"] .unit[data-card-id="' + returned + '"]',
              )
              .waitFor();
            assert.equal(
              await a.locator('[data-role="own-field"] .unit').count(),
              0,
            );
            assert.deepEqual(errors, []);
            continue;
          } catch (error) {
            console.log(
              'SET5 B diagnostic',
              kind,
              mode,
              number,
              territory,
              await a.evaluate(() => ({
                heading: document.querySelector('#sheet h1')?.textContent,
                body: document.querySelector('#sheet-body')?.textContent,
                notice: document.querySelector('#notice')?.textContent,
                cpuPending: window.MushiBattle?.ui.state.pendingEffect,
                board: document.querySelector('#board')?.dataset,
              })),
            );
            throw error;
          } finally {
            await a.close();
            if (b) await b.close();
          }
        }
      },
    );
