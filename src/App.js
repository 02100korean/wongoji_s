import React, { useState, useCallback } from 'react';
import { Printer, FileText } from 'lucide-react';

const App = () => {
  const [content, setContent] = useState('');
  const [studentName, setStudentName] = useState('');
  const [gridType, setGridType] = useState('200'); 
  const [viewMode, setViewMode] = useState('traditional'); 
  const [lineColor, setLineColor] = useState('#607d8b');

  const processToCells = useCallback((text, cols) => {
    const cells = [{ type: 'empty' }]; 
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
        cells.push({ type: 'empty' });
        i++; continue;
      }
      if (char === ' ') {
        if (cells.length % cols === 0) { i++; continue; }
        cells.push({ type: 'default', content: '' });
        i++; continue;
      }
      const isDigit = (c) => /[0-9]/.test(c);
      const isSmallChar = (c) => /[a-zA-Z]/.test(c);
      const canPair = nextChar && ((isDigit(char) && isDigit(nextChar)) || (isSmallChar(char) && isSmallChar(nextChar)));
      
      if (canPair) {
        cells.push({ type: 'pair', content: [char, nextChar] });
        i += 2;
      } else {
        cells.push({ type: 'default', content: char });
        i++;
      }
    }
    return cells;
  }, []);

  const renderCell = (cellData, key, isLastCol) => {
    const cellStyle = { 
        width: '37px', height: '37px', 
        borderLeft: `1px solid ${lineColor}`, borderTop: `1px solid ${lineColor}`,
        borderBottom: `1px solid ${lineColor}`,
        borderRight: isLastCol ? `1px solid ${lineColor}` : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        fontSize: '21px', backgroundColor: 'white', boxSizing: 'border-box'
    };
    if (!cellData || cellData.type === 'empty') return <div key={key} style={cellStyle}></div>;
    if (cellData.type === 'pair') {
        return (
            <div key={key} style={cellStyle} className="flex font-bold text-[19px]">
                <div className="w-1/2 flex justify-center">{cellData.content[0]}</div>
                <div className="w-1/2 flex justify-center">{cellData.content[1]}</div>
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
    const rowGap = settings.viewMode === 'feedback' ? '28px' : (settings.viewMode === 'traditional' ? '14px' : '0');
    
    // 미리보기 화면에서 너무 커지지 않도록 비율 조정 클래스
    const previewScale = settings.gridType === '400' ? 'scale-[0.65] lg:scale-[0.8]' : 'scale-[0.7] lg:scale-100';

    return (
      <div className="flex flex-col items-center w-full print:block print:bg-white">
        {Array.from({ length: pageCount }).map((_, p) => (
          <div key={p} className="wongoji-container flex items-center justify-center print:h-screen print:w-screen overflow-visible">
            <div className={`wongoji-paper bg-white shadow-2xl print:shadow-none flex flex-col items-center justify-center origin-top lg:origin-center ${previewScale} print:scale-100 transition-transform`} 
                 style={{ 
                   width: settings.gridType === '200' ? '297mm' : '210mm', 
                   height: settings.gridType === '200' ? '210mm' : '297mm',
                   marginBottom: '2rem' 
                 }}>
              <div className="w-full flex justify-end h-8 mb-4 px-20">
                {p === 0 && name && <div className="border-b-2 border-black px-6 text-sm font-bold flex items-end pb-1">성명: {name}</div>}
              </div>
              <div className="flex flex-col" style={{ gap: rowGap }}>
                {Array.from({ length: rows }).map((_, r) => (
                  <div key={r} className="flex">
                    {Array.from({ length: cols }).map((_, c) => renderCell(allCells[p * gridVal + r * cols + c], `c-${p}-${r}-${c}`, c === cols - 1))}
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
    <div className={`h-screen w-screen flex flex-col bg-slate-200 overflow-hidden ${gridType === '200' ? 'print-landscape' : 'print-portrait'}`}>
      <nav className="bg-white border-b px-4 py-3 no-print flex justify-between items-center shadow-sm shrink-0 z-20">
        <h1 className="text-lg font-bold text-slate-700 flex items-center gap-2 font-serif italic"><FileText className="text-red-600" /> 원고지 연습기</h1>
        <div className="flex gap-1.5">
          {['#607d8b', '#ef4444', '#2d6a4f', '#000000'].map(c => (
            <button key={c} onClick={() => setLineColor(c)} className="w-5 h-5 rounded-full border shadow-sm" style={{ backgroundColor: c }} />
          ))}
        </div>
      </nav>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <aside className="h-[35%] lg:h-full w-full lg:w-[380px] bg-white border-b lg:border-b-0 lg:border-r no-print flex flex-col shadow-md shrink-0 z-10">
          <div className="p-3 border-b flex flex-col gap-2 bg-slate-50">
            <div className="grid grid-cols-2 gap-2">
              <select value={gridType} onChange={e => setGridType(e.target.value)} className="p-2 border rounded-lg text-xs font-bold outline-none">
                <option value="200">200자 (가로용지)</option>
                <option value="400">400자 (세로용지)</option>
              </select>
              <select value={viewMode} onChange={e => setViewMode(e.target.value)} className="p-2 border rounded-lg text-xs font-bold outline-none">
                <option value="traditional">일반형</option>
                <option value="feedback">피드백</option>
                <option value="grid">격자형</option>
              </select>
            </div>
            <div className="flex gap-2">
              <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="성명" className="flex-1 p-2 border rounded-lg font-bold outline-none text-xs" />
              <button onClick={() => window.print()} className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-red-600 flex items-center gap-1 shadow-sm transition-colors">
                <Printer size={14}/> PDF 인쇄
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scroll">
            <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full h-full border-none outline-none resize-none bg-transparent text-base leading-relaxed font-serif" placeholder="여기에 내용을 입력하세요..." />
          </div>
        </aside>

        <main className="flex-1 overflow-auto bg-slate-300 p-2 lg:p-10 flex justify-center items-start lg:items-center scroll-smooth">
          <Manuscript text={content} settings={{ gridType, viewMode, lineColor }} name={studentName} />
        </main>
      </div>

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        
        @media print {
          .no-print { display: none !important; }
          body, html { background: white !important; margin: 0 !important; padding: 0 !important; width: 210mm; height: 297mm; }
          .wongoji-container { 
            page-break-after: always !important; 
            height: 100vh !important; 
            width: 100vw !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .wongoji-paper { 
            transform: scale(1) !important; 
            margin: 0 !important;
            box-shadow: none !important;
          }
          .print-landscape { @page { size: A4 landscape; margin: 0; } }
          .print-portrait { @page { size: A4 portrait; margin: 0; } }
        }
      `}</style>
    </div>
  );
};

export default App;
