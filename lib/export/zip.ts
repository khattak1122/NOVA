import JSZip from 'jszip';
import { Project } from '@/types/nova';

export async function exportProjectToZip(project: Project): Promise<Blob> {
  const zip = new JSZip();

  // Root folder
  const folder = zip.folder(project.name.toLowerCase().replace(/[^a-z0-9_-]/g, '-')) || zip;

  // Add all files
  for (const file of project.files) {
    folder.file(file.path, file.content);
  }

  // Add standard README.md if not present
  if (!project.files.some((f) => f.path.toLowerCase() === 'readme.md')) {
    folder.file(
      'README.md',
      `# ${project.name}

${project.description}

## Archetype
- **Type**: ${project.type}
- **Framework**: ${project.settings.framework}
- **Created via**: NOVA AI Studio

## Running Locally
${
  project.type === 'website'
    ? `Simply open \`${project.settings.entryFile}\` in any modern browser, or run a local static server:
\`\`\`bash
npx serve .
\`\`\``
    : project.type === 'android'
    ? `Open this directory in Android Studio. Gradle will sync dependencies and allow running in Android Emulator.`
    : `Run \`npm install\` and \`npm run dev\`.`
}
`
    );
  }

  // Generate binary zip
  return await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
