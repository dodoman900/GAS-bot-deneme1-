// Basit otomatik düzeltici: komut dosyalarındaki yaygın sözdizimi dengesizliklerini tespit edip (ör. eksik '}')
// kullanıcı onayı ile uygular. Güvenli ve geri alınabilir değişiklikler yapar.

// usage: node tools/auto_fix.js
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const KOMUTLAR_DIR = path.join(__dirname, '..', 'komutlar');
const LEGACY_DIR = path.join(__dirname, '..', 'komutlar_legacy');

// Gelişmiş analiz: neden ve öneri üreten yapı
function analyze(filePath, content) {
  const result = { file: path.basename(filePath), issues: [] };
  // counts
  const opens = { '{': (content.match(/{/g)||[]).length, '(': (content.match(/\(/g)||[]).length, '[': (content.match(/\[/g)||[]).length };
  const closes = { '}': (content.match(/}/g)||[]).length, ')': (content.match(/\)/g)||[]).length, ']': (content.match(/]/g)||[]).length };

  // mismatch checks with reasons & suggestions
  if (opens['{'] > closes['}']) {
    const diff = opens['{'] - closes['}'];
    result.issues.push({ severity: 'error', code: 'MISSING_BRACE', reason: `Dosyada ${diff} eksik '}' var.`, suggestion: `Dosyanın sonuna ${diff} adet '}' eklenmesi önerilir.` });
  } else if (closes['}'] > opens['{']) {
    result.issues.push({ severity: 'error', code: 'EXTRA_BRACE', reason: `Fazla '}' tespit edildi (fazla: ${closes['}'] - opens['{']}).`, suggestion: 'Fazla brace bulunduğu satır(lar) manuel olarak kontrol edilsin.' });
  }
  if (opens['('] > closes[')']) {
    const diff = opens['('] - closes[')'];
    result.issues.push({ severity: 'error', code: 'MISSING_PAREN', reason: `${diff} eksik ')' var.`, suggestion: `Eksik parantez için uygun yerlere ')' ekleyin.` });
  }
  if (opens['['] > closes[']']) {
    const diff = opens['['] - closes[']'];
    result.issues.push({ severity: 'warning', code: 'MISSING_BRACKET', reason: `${diff} eksik ']' var.`, suggestion: 'Array / index bracket kontrolü yapın.' });
  }

  // dangling comma
  const trimmed = content.trimEnd();
  if (trimmed.endsWith(',') || trimmed.endsWith(',\n')) {
    result.issues.push({ severity: 'warning', code: 'DANGLING_COMMA', reason: 'Dosya sonunda olası trailing comma var.', suggestion: 'Dosya sonundaki fazla virgül kaldırılmalı.' });
  }

  // pattern checks for common mistakes
  if (/}\s*;\s*\n\s*{(?:\s*[A-Za-z0-9_\-]+)\s*:/.test(content)) {
    result.issues.push({ severity: 'warning', code: 'BAD_MODULE_SPLIT', reason: 'Modül sonu ile yeni obje literal arasında çakışma (ör: "};\\n { aliases:")', suggestion: 'Bunu manuel olarak iki ayrı modül veya export yapısına dönüştürün.' });
  }

  // quick check for require('quick.db') etc.
  const problematicRequires = [];
  if (/require\(['"]quick\.db['"]\)/.test(content)) problematicRequires.push('quick.db (binary/native bağımlı)');
  if (/require\(['"]snekfetch['"]\)/.test(content)) problematicRequires.push('snekfetch (eski, yerine node-fetch kullanın)');
  if (problematicRequires.length) {
    result.issues.push({ severity: 'info', code: 'DEPRECATED_DEP', reason: `Dosya eski veya native bağımlılık kullanıyor: ${problematicRequires.join(', ')}`, suggestion: 'Bu bağımlılıkları modern alternatiflerle (mongoose/node-fetch) değiştirmeyi düşünün.' });
  }

  // If no issues
  if (result.issues.length === 0) result.issues.push({ severity: 'ok', code: 'CLEAN', reason: 'Dosya temel kontrollerden geçti.', suggestion: 'Her şey iyi görünüyor.' });

  return result;
}

// Expose analyzer for CLI and other modules
async function runCLI() {
  const dirs = [KOMUTLAR_DIR, LEGACY_DIR].filter(d => fs.existsSync(d));
  const all = [];
  for (const dir of dirs) {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
    for (const f of files) {
      const fp = path.join(dir, f);
      const content = fs.readFileSync(fp, 'utf8');
      all.push(analyze(fp, content));
    }
  }
  // print summary
  for (const r of all) {
    console.log(`\n${r.file}:`);
    r.issues.forEach(i => console.log(` - [${i.severity}] ${i.code}: ${i.reason} => ${i.suggestion}`));
  }
  return all;
}

module.exports = { analyzeFile: analyze, runCLI };

// CLI entry
if (require.main === module) {
  runCLI().catch(e => { console.error('Auto-fix CLI hata:', e && e.stack ? e.stack : e); process.exit(1); });
}
    try {
      content = fs.readFileSync(fp, 'utf8');
    } catch (e) {
      console.error('Okuma hatası:', fp, e.message);
      continue;
    }

    const plan = analyze(fp, content);
    if (!plan.length) {
      console.log(`İncelendi (temiz): ${f}`);
      continue;
    }

    console.log(`\nDosya: ${f}`);
    plan.forEach((p, i) => {
      console.log(`  [${i+1}] ${p.action.toUpperCase()}: ${p.reason}${p.text ? ` -> "${p.text.replace(/\n/g,'\\n')}"` : ''}`);
    });

    const apply = (await prompt('Bu dosya için önerilen güvenli eklemeleri uygula? (y/N): ')).trim().toLowerCase();
    if (apply !== 'y') {
      console.log('Atlandı:', f);
      continue;
    }

    // backup
    const bak = fp + '.bak';
    try {
      fs.copyFileSync(fp, bak, fs.constants.COPYFILE_EXCL);
      console.log('Yedek oluşturuldu:', path.basename(bak));
    } catch (e) {
      // already exists? overwrite not necessary
      console.log('Yedek var veya oluşturulamadı (devam ediliyor).');
    }

    // Uygula: sadece append işlemleri güvenle uygula; diğerleri log ile bırak
    let newContent = content;
    const appended = [];
    for (const p of plan) {
      if (p.action === 'append' && p.text) {
        newContent = newContent + '\n' + p.text + '\n';
        appended.push(p.text);
      } else if (p.action === 'warn' || p.action === 'repair_block_split') {
        console.log('  UYARI (otomatik uygulanmadı):', p.reason);
      }
    }

    // write back
    try {
      fs.writeFileSync(fp, newContent, 'utf8');
      console.log('Uygulandı:', f, appended.length ? `(${appended.join('')})` : '');
      fixes.push({ file: f, applied: true, plan });
    } catch (e) {
      console.error('Yazma hatası:', fp, e.message);
      fixes.push({ file: f, applied: false, error: e.message });
    }
  }

  console.log('\nİşlem tamamlandı. Özet:');
  fixes.forEach(z => {
    console.log(` - ${z.file}: ${z.applied ? 'Uygulandı' : 'Uygulanmadı'}${z.error ? ' ('+z.error+')' : ''}`);
  });
  console.log('\nNotlar:');
  console.log(' - Bu betik sadece basit, geri alınabilir ekleme önerileri uygular (eksik kapanış parantezleri vb).');
  console.log(' - Karmaşık sözdizimi hataları veya mantıksal hatalar manuel müdahale gerektirir; betik bu dosyalar için uyarı bırakır.');
  console.log(' - Uygulanan değişiklikler .bak uzantılı yedek dosyalarında bulunmaktadır.');
  const next = await prompt('\nSonrasında ne yapmak istersiniz? (1) Hiçbir şey, (2) Tüm .bak dosyalarını geri al, (3) Hataları manuel listele — seçim (1/2/3): ');
  if (next === '2') {
    // restore all .bak
    for (const f of fixes) {
      if (f.applied) {
        const fp = path.join(KOMUTLAR_DIR, f.file);
        const bak = fp + '.bak';
        if (fs.existsSync(bak)) {
          fs.copyFileSync(bak, fp);
          console.log('Geri alındı:', f.file);
        }
      }
    }
    console.log('Tüm yedekler geri alındı.');
  } else if (next === '3') {
    console.log('Manuel müdahale gerektiren dosyalar:');
    fixes.forEach(f => {
      const warns = (f.plan || []).filter(p => p.action !== 'append');
      if (warns.length) {
        console.log(` - ${f.file}:`);
        warns.forEach(w => console.log(`    * ${w.reason}`));
      }
    });
    console.log('Bu dosyaları editörde açıp belirtilen uyarılara göre düzeltin.');
  } else {
    console.log('Çıkılıyor. Değişiklikleri korudum.');
  }
}

run().catch(e => {
  console.error('Beklenmeyen hata:', e && e.stack ? e.stack : e);
  process.exit(1);
});
