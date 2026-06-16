import os
import re

catalog_dir = r"C:\Users\aldor\OneDrive\Desktop\Valentine-Platform\app\(landing)\catalog"

for folder in os.listdir(catalog_dir):
    folder_path = os.path.join(catalog_dir, folder)
    if os.path.isdir(folder_path):
        page_path = os.path.join(folder_path, "page.tsx")
        if os.path.exists(page_path):
            with open(page_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            # 1. Clean up old CheckoutModal tags
            content = re.sub(r'<CheckoutModal[^>]+/>\n*', '', content)
            
            # 2. Add CheckoutModal tag before the last </div>
            content = re.sub(r'(\s*</div>\s*)\);\s*}', r'\n            <CheckoutModal product={checkoutProduct} onClose={() => setCheckoutProduct(null)} />\1);\n}', content)

            # 3. Fix missing state hooks
            # Find the component declaration: export default function Something() {
            if "const [checkoutProduct" not in content:
                content = re.sub(
                    r'(export default function\s+\w+\(\)\s*\{)',
                    r'\1\n    const [checkoutProduct, setCheckoutProduct] = useState<CheckoutProduct | null>(null);\n',
                    content
                )

            # 4. Check imports just in case
            if "CheckoutModal" not in content[:content.find("export default")]:
                content = content.replace(
                    'import { LandscapeProductCard }',
                    'import CheckoutModal, { CheckoutProduct } from "../../../components/CheckoutModal";\nimport { LandscapeProductCard }'
                )
            if 'useState' not in content[:content.find("export default")]:
                content = 'import { useState } from "react";\n' + content

            with open(page_path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Fixed {folder}")
