const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "src");

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(file));
    } else {
      if (file.endsWith(".tsx") || file.endsWith(".ts")) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walkDir(srcDir);
let changed = 0;

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");

  // Check if it has import Image from "next/image"
  if (content.includes('import Image from "next/image"')) {
    content = content.replace(
      /import Image from "next\/image"/g,
      'import { ImageWithFallback as Image } from "@/components/shared/ImageWithFallback"',
    );
    fs.writeFileSync(file, content, "utf8");
    changed++;
    console.log(`Updated ${file}`);
  } else if (content.includes("import Image from 'next/image'")) {
    content = content.replace(
      /import Image from 'next\/image'/g,
      'import { ImageWithFallback as Image } from "@/components/shared/ImageWithFallback"',
    );
    fs.writeFileSync(file, content, "utf8");
    changed++;
    console.log(`Updated ${file}`);
  }
}

console.log(`Total files updated: ${changed}`);
