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
    const isGridMode = viewMode === 'grid';
    const cellStyle = { 
        width: '38px', height: '38px', 
        borderLeft: `1.2px solid ${lineColor}`, 
        borderTop: `1.2px solid ${lineColor}`,
        borderBottom: `1.2px solid ${lineColor}`,
        borderRight: (isLastCol || isGridMode) ? `1.2px solid ${lineColor}` : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        fontSize: '22px', backgroundColor: 'white', boxSizing: 'border-box'
    };
    if (!cellData || cellData.type === 'empty') return <div key={key} style={cellStyle}></div>;
    if (cellData.type === 'pair') {
        return (
            <div key={key} style={cellStyle} className="flex font-bold text-[20px]">
                <div className="w-1/2 flex justify-center">{cellData.content[0]}</div>
                <div className="w-1/2 flex justify-center">{cellData.content[1]}</div>
            </div>
        );
    }
    return <div key={key} style={cellStyle} className="font-medium">{cellData.content}</div>;
  };

  const Manuscript = ({ text, settings, name }) => {
    const cols = 20;
    const gridVal = parseInt(settings.gridType);
    const rows = gridVal / cols;
    const allCells = processToCells(text, cols);
    const pageCount = Math.max(1, Math.ceil(allCells.length / gridVal));
    const getRowGap = () => {
      if (settings.viewMode === 'feedback') return '30px';
      if (settings.viewMode === 'traditional') return '15px';
      return '0px';
    };

    return (
      <div className="flex flex-col items-center w-full bg-white print:block">
        {Array.from({ length: pageCount }).map((_, p) => (
          <div key={p} className="wongoji-page-unit flex flex-col items-center w-full">
            <div className="wongoji-paper-dynamic bg-white flex flex-col items-center p-6 md:p-10 shadow-sm" 
                 style={{ width: 'fit-content' }}>
              <div className="w-full flex justify-end mb-6 px-2">
                {p === 0 && name && <div className="border-b-2 border-slate-800 px-6 text-sm font-bold pb-1">성명: {name}</div>}
              </div>
              <div className="manuscript-grid flex flex-col" style={{ gap: getRowGap() }}>
                {Array.from({ length: rows }).map((_, r) => (
                  <div key={r} className="flex" style={{ borderRight: settings.viewMode !== 'grid' ? `1.2px solid ${lineColor}` : 'none' }}>
                    {Array.from({ length: cols }).map((_, c) => renderCell(allCells[p * gridVal + r * cols + c], `c-${p}-${r}-${c}`, c === cols - 1))}
                  </div>
                ))}
              </div>
              <div className="w-full text-center mt-6 text-[10px] text-slate-300 no-print uppercase tracking-widest">Page {p + 1}</div>
              {p < pageCount - 1 && <div className="w-full border-b border-dashed border-slate-100 my-12 no-print"></div>}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`app-container flex flex-col bg-slate-50 min-h-screen ${gridType === '200' ? 'print-landscape' : 'print-portrait'}`}>
      <nav className="bg-white border-b px-4 py-3 no-print flex justify-between items-center shrink-0 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <FileText className="text-red-600" size={20} />
          <h1 className="text-base md:text-lg font-black text-slate-800 tracking-tight">원고지 연습기</h1>
        </div>
        <div className="flex gap-2">
          {['#607d8b', '#ef4444', '#2d6a4f', '#000000'].map(c => (
            <button key={c} onClick={() => setLineColor(c)} className="w-6 h-6 rounded-full border-2 border-white shadow ring-1 ring-slate-200" style={{ backgroundColor: c }} />
          ))}
        </div>
      </nav>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <aside className="w-full md:w-[380px] bg-white border-b md:border-b-0 md:border-r no-print flex flex-col shrink-0 z-20 h-[40vh] md:h-full">
          <div className="p-4 border-b bg-slate-50/50 flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              <select value={gridType} onChange={e => setGridType(e.target.value)} className="p-2.5 border border-slate-200 rounded-xl text-xs font-bold bg-white outline-none">
                <option value="200">200자 (가로)</option>
                <option value="400">400자 (세로)</option>
              </select>
              <select value={viewMode} onChange={e => setViewMode(e.target.value)} className="p-2.5 border border-slate-200 rounded-xl text-xs font-bold bg-white outline-none">
                <option value="traditional">일반형</option>
                <option value="feedback">피드백용</option>
                <option value="grid">격자형</option>
              </select>
            </div>
            <div className="flex gap-2">
              <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="학생 성명" className="flex-1 p-2.5 border border-slate-200 rounded-xl font-bold text-xs outline-none focus:ring-1 focus:ring-slate-300" />
              <button onClick={() => window.print()} className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-blue-600 shadow-md transition-all flex items-center gap-1">
                <Printer size={14}/> 인쇄
              </button>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-hidden bg-white">
            <textarea 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              className="w-full h-full border-none outline-none resize-none bg-transparent text-base md:text-lg leading-relaxed font-serif overflow-y-auto" 
              placeholder="여기에 내용을 입력하세요..." 
            />
          </div>
        </aside>

        {/* 수정된 영역: overflow-auto를 적용하여 가로/세로 스크롤 가능하게 변경 */}
        <main className="flex-1 overflow-auto bg-slate-100 p-4 md:p-8 flex justify-start md:justify-center items-start scroll-smooth">
          <div className="min-w-full md:min-w-0 inline-block">
            <div className="shadow-2xl bg-white origin-top-left md:origin-top scale-[0.85] sm:scale-100 transition-transform">
              <Manuscript text={content} settings={{ gridType, viewMode, lineColor }} name={studentName} />
            </div>
          </div>
        </main>
      </div>

      <style>{`
        /* 스크롤바 커스텀 */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        
        @media print {
          .no-print { display: none !important; }
          body, html { margin: 0 !important; padding: 0 !important; background: white !important; }
          .app-container, .flex-1, main { display: block !important; overflow: visible !important; height: auto !important; }
          .wongoji-page-unit { page-break-after: always !important; display: flex !important; align-items: center !important; justify-content: center !important; height: 100vh !important; }
          .wongoji-paper-dynamic { transform: scale(0.9); box-shadow: none !important; }
          .print-landscape { @page { size: A4 landscape; margin: 0; } }
          .print-portrait { @page { size: A4 portrait; margin: 0; } }
        }
      `}</style>
    </div>
  );
};

export default App;
