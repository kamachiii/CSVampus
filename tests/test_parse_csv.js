const Papa = require('papaparse');

function parseCSV(text) {
  const parsed = Papa.parse(text, { skipEmptyLines: true });
  if (!parsed || !parsed.data || parsed.data.length < 2) throw new Error('File CSV tidak valid atau kosong.');

  const headerRow = parsed.data[0].map(h => String(h || '').trim());
  const normalizedHeader = headerRow.map(h => h.toLowerCase());

  const findIndex = (aliases) => {
    for (const a of aliases) {
      const idx = normalizedHeader.indexOf(a.toLowerCase());
      if (idx !== -1) return idx;
    }
    return -1;
  };

  const nimIndex = findIndex(['nim', 'nrp']);
  const rombelIndex = findIndex(['rombel', 'kelas', 'class']);
  const namaIndex = findIndex(['nama full rombel', 'nama', 'nama lengkap', 'full name']);

  if (nimIndex === -1 || namaIndex === -1) {
    throw new Error(`Kolom yang diperlukan tidak ditemukan. Ditemukan: ${headerRow.join(', ')}`);
  }

  const students = [];
  for (let i = 1; i < parsed.data.length; i++) {
    const row = parsed.data[i];
    const nim = String(row[nimIndex] || '').trim();
    const rombel = String((rombelIndex !== -1 ? row[rombelIndex] : '') || '').trim();
    const nama = String(row[namaIndex] || '').trim();
    if (nim && nama) students.push({ nim, rombel, nama });
  }
  return students;
}

function assertEqual(a, b, msg) {
  const ok = JSON.stringify(a) === JSON.stringify(b);
  console.log((ok ? 'PASS' : 'FAIL') + ' - ' + msg);
  if (!ok) {
    console.log('  Expected:', b);
    console.log('  Received:', a);
  }
  return ok;
}

let allOk = true;

// Test 1: normal CSV
try {
  const csv1 = 'NIM,Rombel,Nama\n123,TI-1,Anna\n456,TI-2,Budi\n';
  const out1 = parseCSV(csv1);
  allOk = allOk && assertEqual(out1.length, 2, 'Normal CSV produces 2 rows');
} catch (e) { console.log('FAIL - Normal CSV threw', e.message); allOk = false; }

// Test 2: quoted commas
try {
  const csv2 = 'NIM,Rombel,Nama\n1,TI-1,"Last, First"\n2,TI-2,"O\"Connor, Sam"\n';
  const out2 = parseCSV(csv2);
  allOk = allOk && assertEqual(out2[0].nama, 'Last, First', 'Quoted comma preserved');
  allOk = allOk && assertEqual(out2[1].nama, 'O"Connor, Sam', 'Quoted quote and comma preserved');
} catch (e) { console.log('FAIL - Quoted CSV threw', e.message); allOk = false; }

// Test 3: different header names and casing
try {
  const csv3 = 'nim,kelas,Nama Lengkap\n900,TI-A,Test User\n';
  const out3 = parseCSV(csv3);
  allOk = allOk && assertEqual(out3[0].nim, '900', 'Header alias (nim, kelas, Nama Lengkap) works');
} catch (e) { console.log('FAIL - Alias header threw', e.message); allOk = false; }

// Test 4: missing required header
try {
  const csv4 = 'ID,Group,Full\n1,ABC,Name\n';
  try {
    parseCSV(csv4);
    console.log('FAIL - Missing header did not throw');
    allOk = false;
  } catch (err) {
    console.log('PASS - Missing header threw expected error');
  }
} catch (e) { console.log('FAIL - Missing header test error', e.message); allOk = false; }

console.log('\nTests ' + (allOk ? 'PASSED' : 'FAILED'));
process.exit(allOk ? 0 : 1);
