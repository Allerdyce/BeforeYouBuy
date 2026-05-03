import XLSX from "xlsx";
import fs from "fs";
import path from "path";

const dir = "/Users/work/Desktop/BeforeYouBuy/Available Data";
const files = fs.readdirSync(dir).filter(f => f.endsWith(".xlsx"));

for (const f of files) {
  const wb = XLSX.readFile(path.join(dir, f));
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
  console.log("\n========", f, "========");
  // Print rows where col A is empty AND col B is empty AND col C empty etc — these are the section headers
  // Actually section headers are rows where col 0 looks like all caps without a number in col 0
  for (const r of rows) {
    const a = String(r[0] || "").trim();
    const b = String(r[1] || "").trim();
    // Section headers have something in column A but col B empty
    if (a && !b && a !== "FIELD #" && !a.match(/^Property_v|^©|^CoreLogic|^Confidential|^[A-Za-z][a-z]+_v\d/)) {
      console.log("  §", a);
    }
    // Field rows: col A is a number, col B is field name
    if (a.match(/^\d+$/) && b) {
      console.log("    -", b);
    }
  }
}
