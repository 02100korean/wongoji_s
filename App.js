import React, { useState, useCallback } from 'react';
import { Settings, Printer, FileText, ChevronDown, ChevronUp } from 'lucide-react';

const App = () => {
  const [content, setContent] = useState('');
  const [studentName, setStudentName] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [fontType, setFontType] = useState("'Noto Serif KR', serif");
  const [gridType, setGridType] = useState('200'); 
  const [viewMode, setViewMode] = useState('traditional');
  const [lineColor, setLineColor] = useState('#607d8b');

  const processToCells = useCallback((text, cols) => {
    const cells = [{ type: 'empty' }]; // 첫 칸 비우기 [cite: 23]
    let i = 0;
    while (i < text.length) {
      const char = text[i];
      const nextChar = text[i + 1] || null;
      if (char === '\n') {
        const currentLinePos = cells.length % cols;
        const remaining = cols - (currentLinePos || cols);
        if (currentLinePos !== 0) {
            for (let r = 0; r < remaining; r++) cells.push({ type: 'empty' });
        }
        cells.push({ type: 'empty' }); // 줄바꿈 시 자동 들여쓰기 [cite: 24, 25]
        i++; continue;
      }
      if (char === ' ') {
        if (cells.length % cols === 0) { i++; continue; }
        cells.push({ type: 'default', content: '' });
        i++; continue;
      }
      const isDigit = (c) => /[0-9]/.test(c);
      const isPunct = (c) => c === '.' || c === ',';
      const isSmallChar = (c) => /[a-z]/.test(c);
      const canPair = nextChar && (
        (isDigit(char) && isDigit(nextChar)) || (isDigit(char) && isPunct(nextChar)) || 
        (isPunct(char) && isDigit(nextChar)) || (isSmallChar(char) && isSmallChar(nextChar))
      );
      if (canPair) {
        cells.push({ type: 'pair', content: [char, nextChar] }); [cite: 28]
        i += 2;
      } else if (isPunct(char)) {
        cells.push({ type: 'punct-low', content: char }); [cite: 29]
        i++;
      } else if (char === '?' || char === '!') {
        cells.push({ type: 'punct-center', content: char }); [cite: 30]
        i++;
      } else {
        cells.push({ type: 'default', content: char });
        i++;
      }
    }
    return cells;
  }, []);

  const renderCell = (cellData, key) => {
    const cellStyle = { 
        width: '37px', height: '37px', borderRight: `0.8px solid ${lineColor}`, borderBottom: `0.8px solid ${lineColor}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', fontSize: '21px'
    };
    if (!cellData || cellData.type === 'empty') return <div key={key} style={cellStyle}></div>;
    if (cellData.type === 'pair') {
        return (
            <div key={key} style={cellStyle}>
                <div className="flex w-full h-full font-bold text-[19px]">
                    <div className="w-1/2 flex items-center justify-center relative">{cellData.content[0]}</div>
                    <div className="w-1/2 flex items-center justify-center relative">{cellData.content[1]}</div>
                </div>
            </div>
        );
    }
    return <div key={key} style={cellStyle}>{cellData.content}</div>;
  };

  const Manuscript = ({ text, settings, name }) => {
    const cols = 20;
    const gridVal = parseInt(settings.gridType);
    const rows = gridVal / cols;
    const allCells = processToCells(text, cols);
    const pageCount = Math.max(1, Math.ceil(allCells.length / gridVal));
    
    return (
      <div className="flex flex-col items-center w-full">
        {Array.from({ length: pageCount }).map((_, p) => (
          <div key={p} className="wongoji-paper mb-10 bg-white shadow-2xl p-0 print:p-[15mm]" style={{ fontFamily: settings.fontType, width: gridVal === 200 ? '297mm' : '210mm' }}>
            <div className="flex justify-end h-8 px-6 pt-2">
              {p === 0 && name && <div className="border-b-2 border-slate-300 px-4 text-xs font-bold">성명: {name}</div>}
            </div>
            <div className="flex items-center justify-center p-4">
              <div className="flex flex-col" style={{ gap: settings.viewMode === 'feedback' ? '28px' : '14px' }}>
                {Array.from({ length: rows }).map((_, r) => (
                  <div key={r} className="flex border-t border-l" style={{ borderColor: lineColor }}>
                    {Array.from({ length: cols }).map((_, c) => renderCell(allCells[(p * gridVal) + (r * cols) + c], `c-${p}-${r}-${c}`))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`h-screen flex flex-col bg-slate-100 overflow-hidden ${gridType === '200' ? 'print-landscape' : 'print-portrait'}`}>
      <nav className="bg-white border-b px-6 py-3 no-print flex justify-between items-center z-40 shadow-sm">
        <h1 className="text-xl font-bold text-slate-700 flex items-center gap-2"><FileText className="text-blue-600" /> 원고지 연습기</h1>
        <div className="flex gap-2">
          {['#607d8b', '#ff9e9e', '#2d6a4f', '#000000'].map(c => (
            <button key={c} onClick={() => setLineColor(c)} className="w-5 h-5 rounded-full border" style={{ backgroundColor: c }} />
          ))}
        </div>
      </nav>
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <aside className="w-full lg:w-96 bg-white border-r no-print p-5 flex flex-col gap-4">
          <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="성명 입력" className="p-2 border rounded-xl font-bold" />
          <textarea value={content} onChange={e => setContent(e.target.value)} className="flex-1 p-4 border rounded-2xl resize-none shadow-inner" placeholder="내용을 입력하세요..." />
          <button onClick={() => window.print()} className="w-full bg-slate-800 text-white h-12 rounded-xl font-bold hover:bg-black transition-all">인쇄 및 PDF 저장</button>
        </aside>
        <section className="flex-1 overflow-auto bg-slate-200 p-8 flex justify-center">
          <Manuscript text={content} settings={{ gridType, viewMode, fontType, lineColor }} name={studentName} />
        </section>
      </div>
      <style>{`
        @media print { .no-print { display: none !important; } .wongoji-paper { box-shadow: none !important; page-break-after: always; } }
      `}</style>
    </div>
  );
};

export default App;
