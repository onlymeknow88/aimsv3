<?php
$pdo = new PDO('mysql:host=127.0.0.1;dbname=newaims', 'root', '');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

echo "=== ALL jsa_documents (status, is_obsolate, title) ===\n";
$rows = $pdo->query("SELECT id, title, status, is_obsolate FROM jsa_documents ORDER BY created_at DESC")->fetchAll(PDO::FETCH_ASSOC);
foreach ($rows as $r) {
    $obs = is_null($r['is_obsolate']) ? 'NULL' : $r['is_obsolate'];
    echo "  status={$r['status']} | is_obsolate={$obs} | {$r['title']}\n";
}

echo "\n=== QUERY: is_obsolate=0 AND status=2 (exact API query) ===\n";
$rows2 = $pdo->query("SELECT id, title, status FROM jsa_documents WHERE is_obsolate = 0 AND status = 2")->fetchAll(PDO::FETCH_ASSOC);
if (empty($rows2)) {
    echo "  (KOSONG! — is_obsolate bukan 0 di dokumen status=2)\n";
} else {
    foreach ($rows2 as $r) { echo "  OK: [{$r['status']}] {$r['title']}\n"; }
}

echo "\n=== QUERY: status=2 saja (tanpa filter is_obsolate) ===\n";
$rows3 = $pdo->query("SELECT id, title, status, is_obsolate FROM jsa_documents WHERE status = 2")->fetchAll(PDO::FETCH_ASSOC);
foreach ($rows3 as $r) {
    $obs = is_null($r['is_obsolate']) ? 'NULL' : $r['is_obsolate'];
    echo "  [{$r['status']}] {$r['title']} | is_obsolate={$obs}\n";
}
