const fs = require("fs");
const path = require("path");

function replaceVersion(content) {
  return content
    .replace(/version":"\d+\.\d+\.\d+"/g, 'version":""')
    .replace(/version:"\d+\.\d+\.\d+"/g, 'version:""');
}

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, "utf8");
  const updated = replaceVersion(content);

  fs.writeFileSync(filePath, updated, "utf8");

  console.log("[next-docker-strip] patched:", filePath);
}

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;

  fs.readdirSync(dir).forEach((file) => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      walkDir(full, callback);
    } else {
      callback(full);
    }
  });
}

module.exports = function stripNextVersion() {
  const traceFile = path.join(process.cwd(), ".next/trace");
  processFile(traceFile);

  const chunksDir = path.join(process.cwd(), ".next/static/chunks");

  walkDir(chunksDir, (file) => {
    processFile(file);
  });

  console.log(
    "[next-docker-strip] ✅ Finished stripping Next.js version metadata."
  );
};
