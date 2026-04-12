import fs from 'fs';
import path from 'path';

const backendSrc = 'c:/Users/asus/Desktop/projet/Bey-Fragrance-main/backend/src';
const seedFiles = [
  'seed_batch_1.ts',
  'seed_batch_2.ts',
  'seed_batch_3.ts',
  'seed_batch_4.ts',
  'seed_batch_5.ts',
  'seed_batch_6.ts'
];

async function main() {
  const genderMap: Record<string, string> = {};
  
  for (const file of seedFiles) {
    const filePath = path.join(backendSrc, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      // Very basic regex to extract name and category (gender)
      // Example: { name: "Pure Poison", category: "Woman", ... }
      const regex = /name:\s*"([^"]+)",\s*category:\s*"([^"]+)"/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        const name = match[1];
        const gender = match[2];
        if (['Man', 'Woman', 'Unisex'].includes(gender)) {
            genderMap[name] = gender;
        }
      }
    }
  }

  console.log('Total Genders Found:', Object.keys(genderMap).length);
  // Optional: print some to verify
  console.log('Sample:', Object.entries(genderMap).slice(0, 5));
  
  fs.writeFileSync(path.join(backendSrc, 'extracted_genders.json'), JSON.stringify(genderMap, null, 2));
}

main();
