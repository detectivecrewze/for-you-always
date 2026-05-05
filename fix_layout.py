import re

with open('app/(landing)/page.tsx', 'r', encoding='utf8') as f:
    code = f.read()

code = code.replace(
    '<div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%", overflow: "hidden" }}>',
    '<div className="hub-showcase-media-wrapper" style={{ gap: 24 }}>'
)

code = code.replace(
    'className="hub-showcase-media"\n                    style={{ position: "relative" }}',
    'className="hub-showcase-media"\n                    style={{ position: "relative", flex: "none", width: "100%" }}'
)

code = code.replace(
    'flex: 1, padding: "16px", borderRadius: 16, \n                                        background: "#fff", backdropFilter: "blur(12px)",\n                                        border: `1.5px solid ${activeAccent}`,\n                                        display: "flex", flexDirection: "column", gap: 4,\n                                        boxShadow: `0 12px 24px -4px ${activeAccent}26`,\n                                        textAlign: "center", alignItems: "center"',
    'flex: 1, padding: "8px", \n                                        display: "flex", flexDirection: "column", gap: 4,\n                                        textAlign: "center", alignItems: "center"'
)

with open('app/(landing)/page.tsx', 'w', encoding='utf8') as f:
    f.write(code)
print('done')
