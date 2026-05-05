const fs = require('fs');
let code = fs.readFileSync('app/(landing)/page.tsx', 'utf8');

const themeStart = code.indexOf('                    {/* Themes Section */}');
const themeEnd = code.indexOf('                    <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginTop: "auto" }}>');

if(themeStart === -1 || themeEnd === -1) {
    console.log('not found', {themeStart, themeEnd});
    process.exit(1);
}

const themeBlock = code.substring(themeStart, themeEnd);
code = code.substring(0, themeStart) + code.substring(themeEnd);

const mediaStart = code.indexOf('                {/* Media Section (16:9) */}');
const textContentStart = code.indexOf('                {/* Text Content */}');

if(mediaStart === -1 || textContentStart === -1) {
    console.log('media start not found', {mediaStart, textContentStart});
    process.exit(1);
}

const mediaBlock = code.substring(mediaStart, textContentStart);

const newMediaBlock = `
                {/* Media Column Wrapper */}
                <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%", overflow: "hidden" }}>
${mediaBlock}
${themeBlock}
                </div>

`;

code = code.substring(0, mediaStart) + newMediaBlock + code.substring(textContentStart);
fs.writeFileSync('app/(landing)/page.tsx', code);
console.log('success');
