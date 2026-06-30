const fs = require('fs');
const pkg1 = JSON.parse(fs.readFileSync('c:/Users/charu/Documents/concolabs-com/package.json', 'utf8'));
const pkg2 = JSON.parse(fs.readFileSync('C:/Users/charu/Downloads/concolabs-com-feature-admin-project (1)/concolabs-com-feature-admin-project/package.json', 'utf8'));

pkg1.dependencies = pkg1.dependencies || {};
pkg2.dependencies = pkg2.dependencies || {};
for (const [k, v] of Object.entries(pkg2.dependencies)) {
    if (!pkg1.dependencies[k]) pkg1.dependencies[k] = v;
}

pkg1.devDependencies = pkg1.devDependencies || {};
pkg2.devDependencies = pkg2.devDependencies || {};
for (const [k, v] of Object.entries(pkg2.devDependencies)) {
    if (!pkg1.devDependencies[k]) pkg1.devDependencies[k] = v;
}

// sort keys
pkg1.dependencies = Object.keys(pkg1.dependencies).sort().reduce((acc, k) => { acc[k] = pkg1.dependencies[k]; return acc; }, {});
pkg1.devDependencies = Object.keys(pkg1.devDependencies).sort().reduce((acc, k) => { acc[k] = pkg1.devDependencies[k]; return acc; }, {});

fs.writeFileSync('c:/Users/charu/Documents/concolabs-com/package.json', JSON.stringify(pkg1, null, 2));
console.log('Merged successfully!');
