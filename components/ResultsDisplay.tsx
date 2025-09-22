import React from 'react';
import type { ContentPackage } from '../types';
import { DownloadIcon, CopyIcon, LinkIcon } from './IconComponents';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

interface ResultsDisplayProps {
  contentPackage: ContentPackage;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ contentPackage }) => {

  const formatContentForDownload = () => {
    let content = `Title Suggestions:\n- ${contentPackage.titles.join('\n- ')}\n\n`;
    content += "-------------------------\n\n";
    content += "Script/Outline:\n\n";
    contentPackage.script.forEach(segment => {
        content += `## ${segment.segmentTitle}\n\n`;
        content += "Talking Points:\n";
        segment.talkingPoints.forEach(point => {
            content += `- ${point}\n`;
        });
        content += "\nMedia Links:\n";
        segment.mediaLinks.forEach(link => {
            content += `- ${link.description}: ${link.url}\n`;
        });
        content += "\n-------------------------\n\n";
    });
    return content;
  };

  const handleDownloadScript = () => {
    const content = formatContentForDownload();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ContentCrafter_Script.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadDocx = () => {
    const docChildren = [
      new Paragraph({
        children: [new TextRun({ text: "Title Suggestions", bold: true, size: 32 })],
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 },
      }),
      ...contentPackage.titles.map(title => new Paragraph({ text: title, bullet: { level: 0 } })),
      new Paragraph({ text: "" }),
      new Paragraph({
        children: [new TextRun({ text: "Full Script/Outline", bold: true, size: 32 })],
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 },
      }),
    ];

    contentPackage.script.forEach(segment => {
      docChildren.push(
        new Paragraph({
          children: [new TextRun({ text: segment.segmentTitle, bold: true, size: 28 })],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 },
        })
      );
      docChildren.push(
        new Paragraph({
          children: [new TextRun({ text: "Talking Points:", bold: true })],
          spacing: { after: 100 },
        })
      );
      segment.talkingPoints.forEach(point => {
        docChildren.push(new Paragraph({ text: point, bullet: { level: 0 } }));
      });
      docChildren.push(new Paragraph({ text: "" }));
      docChildren.push(
        new Paragraph({
          children: [new TextRun({ text: "Visual & B-Roll Links", bold: true })],
          spacing: { after: 100 },
        })
      );
      segment.mediaLinks.forEach(link => {
        docChildren.push(new Paragraph({ text: `${link.description}: ${link.url}`, bullet: { level: 0 } }));
      });
      docChildren.push(new Paragraph({ text: "" }));
    });

    const doc = new Document({
      sections: [{ children: docChildren }],
    });

    Packer.toBlob(doc).then(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ContentCrafter_Script.docx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  };
  
  const handleCopyScript = () => {
    const content = formatContentForDownload();
    navigator.clipboard.writeText(content).then(() => {
        alert('Script copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy script: ', err);
    });
  };

  const handleDownloadLinks = () => {
     let linksContent = "Media Links\n\n";
      contentPackage.script.forEach(segment => {
        segment.mediaLinks.forEach(link => {
            linksContent += `${link.description}: ${link.url}\n`;
        });
    });
    const blob = new Blob([linksContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ContentCrafter_Media_Links.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyLinks = () => {
    const allLinks = contentPackage.script
      .flatMap(segment => segment.mediaLinks.map(link => link.url))
      .join('\n');

    if (allLinks) {
      navigator.clipboard.writeText(allLinks).then(() => {
        alert('All media links copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy media links: ', err);
        alert('Failed to copy links.');
      });
    } else {
      alert('No media links to copy.');
    }
  };


  return (
    <section className="mt-8 p-6 bg-blue-200 dark:bg-dark-surface rounded-xl border border-blue-300 dark:border-dark-border shadow-md animate-fade-in transition-colors duration-300">
      <div className="flex flex-wrap justify-end items-center gap-4 mb-6">
        <button onClick={handleCopyScript} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-bg border border-slate-300 dark:border-dark-border rounded-lg hover:bg-slate-100 dark:hover:bg-dark-border transition">
            <CopyIcon /> Copy Script
        </button>
        <button onClick={handleCopyLinks} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-bg border border-slate-300 dark:border-dark-border rounded-lg hover:bg-slate-100 dark:hover:bg-dark-border transition">
            <CopyIcon /> Copy All Media Links
        </button>
        <button onClick={handleDownloadDocx} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-bg border border-slate-300 dark:border-dark-border rounded-lg hover:bg-slate-100 dark:hover:bg-dark-border transition">
            <DownloadIcon /> Download Script (.docx)
        </button>
        <button onClick={handleDownloadScript} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-bg border border-slate-300 dark:border-dark-border rounded-lg hover:bg-slate-100 dark:hover:bg-dark-border transition">
            <DownloadIcon /> Download Script (.txt)
        </button>
         <button onClick={handleDownloadLinks} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-bg border border-slate-300 dark:border-dark-border rounded-lg hover:bg-slate-100 dark:hover:bg-dark-border transition">
            <DownloadIcon /> Download Media Links
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-pink">Title/Hook Suggestions</h2>
        <ul className="list-disc list-inside space-y-2 pl-4">
          {contentPackage.titles.map((title, index) => <li key={index}>{title}</li>)}
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-pink">Full Script/Outline</h2>
        <div className="space-y-6">
          {contentPackage.script.map((segment, index) => (
            <div key={index} className="p-4 bg-white dark:bg-dark-bg rounded-lg border border-blue-200 dark:border-dark-border transition-colors duration-300">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">{segment.segmentTitle}</h3>
              <p className="text-slate-700 dark:text-dark-text-secondary mb-4 whitespace-pre-wrap">{segment.talkingPoints.join('\n\n')}</p>
              
              <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Visual & B-Roll Links</h4>
              <ul className="space-y-2">
                {segment.mediaLinks.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-brand-pink hover:underline">
                      <LinkIcon /> {link.description}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};