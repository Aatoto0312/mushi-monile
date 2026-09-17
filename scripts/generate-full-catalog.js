'use strict';

var fs = require('fs');
var path = require('path');
var root = path.join(__dirname, '..');

function scalar(text) {
  text = text.trim();
  if (text === 'null') { return null; }
  if (text === '[]') { return []; }
  if (text === '{}') { return {}; }
  if (/^-?\d+$/.test(text)) { return Number(text); }
  if (text[0] === '"' && text[text.length - 1] === '"') { return JSON.parse(text); }
  return text;
}

function keyValue(text) {
  var position = text.indexOf(':');
  return { key: text.slice(0, position).trim(), value: text.slice(position + 1).trim() };
}

function parseYaml(source) {
  var lines = source.split(/\r?\n/).map(function (raw) {
    var content = raw.trim();
    return { indent: raw.length - raw.replace(/^\s+/, '').length, content: content };
  }).filter(function (line) { return line.content && line.content[0] !== '#'; });

  function parseAt(start, indent) {
    var arrayMode = lines[start].content.indexOf('-') === 0;
    var value = arrayMode ? [] : {};
    var index = start;
    while (index < lines.length && lines[index].indent === indent && (lines[index].content.indexOf('-') === 0) === arrayMode) {
      var content = lines[index].content;
      if (arrayMode) {
        var rest = content.slice(1).trim();
        if (!rest) {
          var child = parseAt(index + 1, lines[index + 1].indent);
          value.push(child.value); index = child.index; continue;
        }
        if (/^[A-Za-z][A-Za-z0-9_]*\s*:/.test(rest)) {
          var pair = keyValue(rest), item = {};
          if (pair.value) { item[pair.key] = scalar(pair.value); index += 1; }
          else { var nested = parseAt(index + 1, lines[index + 1].indent); item[pair.key] = nested.value; index = nested.index; }
          while (index < lines.length && lines[index].indent > indent) {
            var extraIndent = lines[index].indent;
            var extra = parseAt(index, extraIndent);
            if (Array.isArray(extra.value)) { break; }
            Object.keys(extra.value).forEach(function (key) { item[key] = extra.value[key]; });
            index = extra.index;
          }
          value.push(item); continue;
        }
        value.push(scalar(rest)); index += 1; continue;
      }
      var mapping = keyValue(content);
      if (mapping.value) { value[mapping.key] = scalar(mapping.value); index += 1; continue; }
      if (index + 1 >= lines.length || lines[index + 1].indent <= indent) { value[mapping.key] = null; index += 1; continue; }
      var parsed = parseAt(index + 1, lines[index + 1].indent);
      value[mapping.key] = parsed.value; index = parsed.index;
    }
    return { value: value, index: index };
  }
  return lines.length ? parseAt(0, lines[0].indent).value : {};
}

function recordsFromFile(file) {
  var markdown = fs.readFileSync(file, 'utf8');
  var records = [], match, pattern = /```yaml\s*\r?\n([\s\S]*?)```/g;
  while ((match = pattern.exec(markdown))) {
    var source = parseYaml(match[1]);
    if (!source.officialNumber || !source.name || !/^BOOSTER_SET_[2-7]$/.test(source.set)) { continue; }
    var number = Number(String(source.officialNumber).split('/')[0]);
    var effect = source.effectSummary ? [{ effectText: source.effectSummary }] : [];
    records.push({
      id: 'set' + source.set.match(/(\d+)$/)[1] + '_' + String(number).padStart(3, '0'),
      officialNumber: source.officialNumber,
      name: source.name,
      set: source.set,
      rarity: source.rarity,
      type: source.type,
      color: source.color,
      cost: source.cost,
      baseHp: source.baseHp,
      skills: (source.skills || []).map(function (skill) { return { name: skill.name, baseAp: skill.baseAp, effectText: skill.effectSummary }; }),
      passiveAbilities: (source.traits || []).map(function (trait) { return { name: trait.name, effectText: trait.effectSummary }; }),
      cardEffects: source.type === 'SPELL' ? effect : [],
      enhancementEffects: source.type === 'ENHANCEMENT' ? effect : [],
      rulings: source.rulings || [],
      tags: source.referencableTags || [],
      implementationStatus: 'RESEARCHED',
      sourceLevel: 'C',
      sourceRefs: source.sources ? Object.keys(source.sources).map(function (key) { return source.sources[key]; }).filter(Boolean) : [],
      verificationNotes: source.verification || null
    });
  }
  return records;
}

var records = [];
for (var set = 2; set <= 7; set += 1) {
  records = records.concat(recordsFromFile(path.join(root, 'docs', 'mushijingi-knowledge', 'SET' + set + '_CATALOG.md')));
}
var output = "(function (root, factory) {\n  'use strict';\n  var data = factory();\n  if (typeof module === 'object' && module.exports) { module.exports = data; }\n  else { root.MushijingiFullCatalogData = data; }\n}(typeof globalThis !== 'undefined' ? globalThis : this, function () {\n  'use strict';\n  return Object.freeze(" + JSON.stringify(records, null, 2) + ");\n}));\n";
fs.writeFileSync(path.join(root, 'js', 'cards', 'full-catalog-data.js'), output, 'utf8');
console.log('Generated ' + records.length + ' catalog records.');
