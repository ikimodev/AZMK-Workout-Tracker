const fs = require('fs');

function unescapeFile(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');
  content = content.replace(/\\\`/g, '\`');
  content = content.replace(/\\\$/g, '$');
  fs.writeFileSync(filepath, content, 'utf8');
  console.log('Fixed', filepath);
}

unescapeFile('src/components/common/OnboardingModal.tsx');
unescapeFile('src/components/ai/AIProgramGeneratorModal.tsx');
