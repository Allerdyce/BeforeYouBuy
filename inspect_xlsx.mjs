import XLSX from "xlsx";
import fs from "fs";
import path from "path";

const dir = "/Users/work/Desktop/BeforeYouBuy/Available Data";
const files = fs.readdirSync(dir).filter(f => f.endsWith(".xlsx"));

for (const f of files) {
  const wb = XLSX.readFile(path.join(dir, f));
  console.log("\n========================================");
  console.log("FILE:", f);
  console.log("Sheets:", wb.SheetNames.join(" | "));
  for (const sn of wb.SheetNames) {
    const ws = wb.Sheets[sn];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
    console.log(`-- sheet: "${sn}" rows=${rows.length}`);
    // Show first ~25 rows compactly
    const preview = rows.slice(0, 30);
    for (const r of preview) {
      const line = r.map(c => String(c).slice(0, 80)).join(" | ");
      if (line.trim()) console.log("   ", line);
    }
    if (rows.length > 30) console.log(`   ... (+${rows.length - 30} more rows)`);
  }
}
