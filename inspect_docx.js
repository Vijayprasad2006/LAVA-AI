import mammoth from 'mammoth';
import fs from 'fs';
import path from 'path';

const filePath = path.join('src', 'assets', '1.docx');

if (fs.existsSync(filePath)) {
    mammoth.convertToHtml({ path: filePath })
        .then(result => {
            fs.writeFileSync('temp_doc.html', result.value);
            console.log("Written to temp_doc.html");
        })
        .catch(err => console.error(err));
} else {
    console.error(`File not found at: ${filePath}`);
}
