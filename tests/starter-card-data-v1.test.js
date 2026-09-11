'use strict';

var fs = require('fs');
var path = require('path');
var TestRunner = require('./lib.js');
var runner = new TestRunner();

function loadStarterData() {
  try {
    return require('../shared/card-data/starter-v1.js');
  } catch (err) {
    throw new Error('STARTER common DB v1 must be implemented: ' + err.message);
  }
}

function loadCompatibility() {
  try {
    return require('../shared/card-data/starter-v1-compatibility.js');
  } catch (err) {
    throw new Error('STARTER compatibility mapping must be implemented: ' + err.message);
  }
}

runner.test('STARTER common DB contains 24 identities, printings, and rules', function () {
  var data = loadStarterData();
  runner.assertEqual(data.identities.length, 24, 'CardIdentity count');
  runner.assertEqual(data.printings.length, 24, 'CardPrinting count');
  runner.assertEqual(data.rules.length, 24, 'CardRules count');
});

runner.test('STARTER common DB is schema-valid and has unique IDs', function () {
  var data = loadStarterData();
  var validation = require('../shared/card-data').validateCardData(data);
  runner.assertEqual(validation.valid, true, validation.errors.join('\n'));
});

runner.test('STARTER common DB contains no TEST cards', function () {
  var data = loadStarterData();
  runner.assertEqual(data.identities.some(function (x) { return x.canonicalCardId.indexOf('test_') === 0; }), false, 'no test identity');
  runner.assertEqual(data.printings.some(function (x) { return x.setId === 'TEST'; }), false, 'no TEST printing');
});

runner.test('Every STARTER printing and rule reference existing records', function () {
  var data = loadStarterData();
  var identities = Object.create(null);
  var rules = Object.create(null);
  data.identities.forEach(function (x) { identities[x.canonicalCardId] = true; });
  data.rules.forEach(function (x) { rules[x.rulesId] = true; });
  data.printings.forEach(function (x) {
    runner.assert(identities[x.canonicalCardId], 'printing identity exists: ' + x.printingId);
    runner.assert(rules[x.rulesId], 'printing rules exists: ' + x.printingId);
  });
  data.rules.forEach(function (x) {
    runner.assert(identities[x.canonicalCardId], 'rules identity exists: ' + x.rulesId);
  });
});

runner.test('Printing IDs use normalized three-digit collector numbers', function () {
  var data = loadStarterData();
  var printing = data.printings.filter(function (x) { return x.canonicalCardId === 'ginyanma'; })[0];
  runner.assertEqual(printing.printingId, 'printing:starter:006:standard', 'stable printing ID');
  runner.assertEqual(printing.collectorNumber.value.number, 6, 'numeric collector number');
  runner.assertEqual(printing.collectorNumber.value.total, 130, 'numeric collector total');
  runner.assertEqual(printing.officialNumberDisplay.value, '006/130', 'normalized display');
});

runner.test('Mushi no Ibuki official number remains blocked and conflicted', function () {
  var data = loadStarterData();
  var printing = data.printings.filter(function (x) { return x.canonicalCardId === 'mushi_no_ibuki'; })[0];
  runner.assertEqual(printing.collectorNumber.state, 'blocked', 'collector number blocked');
  runner.assertEqual(printing.officialNumberDisplay.state, 'blocked', 'display blocked');
  runner.assertEqual(printing.officialNumberCandidates[0], '127/130', 'catalog candidate retained');
  var verification = data.verifications.filter(function (x) {
    return x.entityId === printing.printingId && x.fieldPath === '/collectorNumber';
  })[0];
  runner.assert(verification, 'collector number verification exists');
  runner.assertEqual(verification.status, 'CONFLICTED', 'conflict is explicit');
});

runner.test('Catalog-backed rarity does not overwrite the legacy snapshot', function () {
  var data = loadStarterData();
  var printing = data.printings.filter(function (x) { return x.canonicalCardId === 'ginyanma'; })[0];
  runner.assertEqual(printing.rarity.state, 'known', 'catalog rarity is represented');
  runner.assertEqual(printing.rarity.value, 'N', 'catalog rarity value');
  var verification = data.verifications.filter(function (x) {
    return x.entityId === printing.printingId && x.fieldPath === '/rarity';
  })[0];
  runner.assertEqual(verification.status, 'VERIFIED_SECONDARY', 'secondary evidence retained');
});

runner.test('Non-attack skills are separated into traits for exactly three cards', function () {
  var data = loadStarterData();
  var traitCards = data.rules.filter(function (x) { return x.traits.length > 0; });
  runner.assertEqual(traitCards.length, 3, 'trait card count');
  var ids = traitCards.map(function (x) { return x.canonicalCardId; }).sort().join(',');
  runner.assertEqual(ids, 'minminzemi,namiageha,nanafushimodoki', 'trait card IDs');
  traitCards.forEach(function (rules) {
    runner.assertEqual(rules.traits.length, 1, 'one documented trait: ' + rules.canonicalCardId);
    runner.assert(rules.traits[0].name.indexOf('＜') === 0, 'trait name preserved');
    runner.assertEqual(rules.skills.some(function (skill) { return skill.name.indexOf('＜') === 0; }), false, 'trait removed from skills');
  });
});

runner.test('Enhancement effects are formal FieldState values', function () {
  var data = loadStarterData();
  data.rules.forEach(function (rules) {
    runner.assert(require('../shared/card-data').validateFieldState(rules.enhancementEffects).valid, 'valid enhancement state: ' + rules.canonicalCardId);
    if (rules.type.value !== 'ENHANCEMENT') {
      runner.assertEqual(rules.enhancementEffects.state, 'not_applicable', 'non-enhancement is N/A');
    }
  });
  var minomushi = data.rules.filter(function (x) { return x.canonicalCardId === 'minomushi_no_kakuremino'; })[0];
  runner.assertEqual(minomushi.enhancementEffects.state, 'known', 'known HP effect retained');
  runner.assertEqual(minomushi.enhancementEffects.value[0].amount, 500, 'HP amount retained');
  runner.assertEqual(minomushi.enhancementEffects.value[0].currentHpPolicy.state, 'blocked', 'currentHp issue remains blocked');
});

runner.test('Common DB compatibility mapping has no unexpected snapshot differences', function () {
  var fixturePath = path.join(__dirname, 'fixtures', 'starter-card-registry.snapshot.v1.json');
  var snapshot = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
  var comparison = loadCompatibility().compareStarterV1ToLegacySnapshot(loadStarterData(), snapshot);
  runner.assertEqual(comparison.unexpectedDifferences.length, 0, JSON.stringify(comparison.unexpectedDifferences));
  runner.assertEqual(comparison.intentionalDifferences.length > 0, true, 'intentional differences are reported');
  var allowed = loadCompatibility().INTENTIONAL_DIFFERENCE_CODES;
  comparison.intentionalDifferences.forEach(function (difference) {
    runner.assert(allowed.indexOf(difference.code) !== -1, 'difference is explicitly allowed: ' + difference.code);
  });
});

runner.test('Verification supports only the Phase 2 status enum', function () {
  var api = require('../shared/card-data');
  var valid = {
    verificationId: 'verification:ginyanma:cost',
    entityId: 'rules:ginyanma:starter-v1',
    fieldPath: '/cost',
    status: 'VERIFIED_OFFICIAL',
    notes: []
  };
  runner.assertEqual(api.validateVerification(valid).valid, true, 'valid verification');
  valid.status = 'GUESSED';
  runner.assertEqual(api.validateVerification(valid).valid, false, 'unknown status rejected');
});

module.exports = runner;
