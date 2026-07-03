import { useRef, useEffect, useState } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, Heading3, Link, Eye, Edit } from 'lucide-react';

export default function RichEditor({ value, onChange, label }) {
  const editorRef = useRef(null);
  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'preview'

  // Sync initial value only if editor is empty to prevent caret jumping
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value && activeTab === 'write') {
      editorRef.current.innerHTML = value || '';
    }
  }, [value, activeTab]);

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const addLink = () => {
    const url = prompt('Havola URL manzilini kiriting (masalan: https://example.com):');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-dark-textMuted">{label}</label>}
      <div className="border border-dark-border rounded-xl bg-dark-bg/30 overflow-hidden focus-within:border-primary-500/50 transition-colors">
        
        {/* Editor Tabs & Toolbar */}
        <div className="flex flex-wrap items-center justify-between border-b border-dark-border bg-dark-card/50 p-2 gap-2">
          
          {/* Write / Preview toggles */}
          <div className="flex bg-dark-bg p-0.5 rounded-lg border border-dark-border">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'write' ? 'bg-dark-border text-white' : 'text-dark-textMuted hover:text-white'
              }`}
            >
              <Edit className="w-3.5 h-3.5" /> Tahrirlash
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'preview' ? 'bg-dark-border text-white' : 'text-dark-textMuted hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Ko'rish
            </button>
          </div>

          {/* Formatting Controls */}
          {activeTab === 'write' && (
            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => executeCommand('formatBlock', '<h1>')}
                className="p-1.5 text-dark-textMuted hover:text-white hover:bg-dark-border rounded-lg transition-colors"
                title="Sarlavha 1"
              >
                <Heading1 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand('formatBlock', '<h2>')}
                className="p-1.5 text-dark-textMuted hover:text-white hover:bg-dark-border rounded-lg transition-colors"
                title="Sarlavha 2"
              >
                <Heading2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand('formatBlock', '<h3>')}
                className="p-1.5 text-dark-textMuted hover:text-white hover:bg-dark-border rounded-lg transition-colors"
                title="Sarlavha 3"
              >
                <Heading3 className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-dark-border mx-1" />
              <button
                type="button"
                onClick={() => executeCommand('bold')}
                className="p-1.5 text-dark-textMuted hover:text-white hover:bg-dark-border rounded-lg transition-colors font-bold"
                title="Qalin"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand('italic')}
                className="p-1.5 text-dark-textMuted hover:text-white hover:bg-dark-border rounded-lg transition-colors italic"
                title="Kursiv"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand('underline')}
                className="p-1.5 text-dark-textMuted hover:text-white hover:bg-dark-border rounded-lg transition-colors underline"
                title="Tagiga chizilgan"
              >
                <Underline className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-dark-border mx-1" />
              <button
                type="button"
                onClick={() => executeCommand('insertUnorderedList')}
                className="p-1.5 text-dark-textMuted hover:text-white hover:bg-dark-border rounded-lg transition-colors"
                title="Bulleted List"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand('insertOrderedList')}
                className="p-1.5 text-dark-textMuted hover:text-white hover:bg-dark-border rounded-lg transition-colors"
                title="Numbered List"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={addLink}
                className="p-1.5 text-dark-textMuted hover:text-white hover:bg-dark-border rounded-lg transition-colors"
                title="Havola qo'shish"
              >
                <Link className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Editor Area */}
        {activeTab === 'write' ? (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            className="p-4 min-h-[220px] max-h-[400px] overflow-y-auto outline-none text-dark-text prose prose-invert max-w-none focus:outline-none"
            style={{ minHeight: '220px' }}
          />
        ) : (
          <div
            className="p-4 min-h-[220px] max-h-[400px] overflow-y-auto text-dark-text prose prose-invert max-w-none bg-dark-bg/10"
            dangerouslySetInnerHTML={{ __html: value || '<p className="text-dark-textMuted">Tarkib bo\'sh</p>' }}
          />
        )}
      </div>
    </div>
  );
}
