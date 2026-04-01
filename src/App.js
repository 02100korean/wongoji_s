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
    return <div key={key} style={cellStyle} className="font-medium text-slate-900">{cellData.content}</div>;
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
      <div className="flex flex-col items-center min-w-max bg-white print:block">
        {Array.from({ length: pageCount }).map((_, p) => (
          <div key={p} className="wongoji-page-unit flex flex-col items-center">
            <div className="wongoji-paper-dynamic bg-white flex flex-col items-center p-10 md:p-14" 
                 style={{ width: 'fit-content' }}>
              <div className="w-full flex justify-end mb-8 px-2">
                {p === 0 && name && <div className="border-b-2 border-slate-900 px-8 text-base font-bold pb-1 shadow-sm">성명: {name}</div>}
              </div>
              <div className="manuscript-grid flex flex-col shadow-sm" style={{ gap: getRowGap() }}>
                {Array.from({ length: rows }).map((_, r) => (
                  <div key={r} className="flex" style={{ borderRight: settings.viewMode !== 'grid' ? `1.2px solid ${lineColor}` : 'none' }}>
                    {Array.from({ length: cols }).map((_, c) => renderCell(allCells[p * gridVal + r * cols + c], `c-${p}-${r}-${c}`, c === cols - 1))}
                  </div>
                ))}
              </div>
              <div className="w-full text-center mt-8 text-[11px] text-slate-300 no-print font-bold tracking-widest">PAGE {p + 1}</div>
              {p < pageCount - 1 && <div className="w-full border-b-2 border-dotted border-slate-100 my-16 no-print"></div>}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`app-container flex flex-col bg-slate-100 min-h-screen ${gridType === '200' ? 'print-landscape' : 'print-portrait'}`}>
      {/* 네비게이션 */}
      <nav className="bg-white border-b px-4 py-3 no-print flex justify-between items-center shrink-0 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <FileText className="text-red-600" size={22} />
          <h1 className="text-lg font-black text-slate-800">원고지 연습기</h1>
        </div>
        <div className="flex gap-2">
          {['#607d8b', '#ef4444', '#2d6a4f', '#000000'].map(c => (
            <button key={c} onClick={() => setLineColor(c)} className="w-7 h-7 rounded-full border-2 border-white shadow ring-1 ring-slate-200" style={{ backgroundColor: c }} />
          ))}
        </div>
      </nav>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden h-[calc(100vh-53px)]">
        {/* 입력 사이드바 */}
        <aside className="w-full md:w-[380px] bg-white border-b md:border-b-0 md:border-r no-print flex flex-col shrink-0 z-30 h-[35%] md:h-full shadow-lg">
          <div className="p-4 border-b bg-slate-50 flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              <select value={gridType} onChange={e => setGridType(e.target.value)} className="p-2.5 border rounded-xl text-xs font-bold bg-white">
                <option value="200">200자 (가로형)</option>
                <option value="400">400자 (세로형)</option>
              </select>
              <select value={viewMode} onChange={e => setViewMode(e.target.value)} className="p-2.5 border rounded-xl text-xs font-bold bg-white">
                <option value="traditional">일반 원고지</option>
                <option value="feedback">피드백용</option>
                <option value="grid">격자형</option>
              </select>
            </div>
            <div className="flex gap-2">
              <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="학생 성명" className="flex-1 p-2.5 border rounded-xl font-bold text-xs outline-none focus:ring-2 focus:ring-slate-100" />
              <button onClick={() => window.print()} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-red-600 shadow-md transition-all flex items-center gap-1">
                <Printer size={16}/> 인쇄
              </button>
            </div>
          </div>
          <div className="flex-1 p-4 bg-white">
            <textarea 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              className="w-full h-full border-none outline-none resize-none bg-transparent text-base md:text-lg leading-relaxed font-serif overflow-y-auto" 
              placeholder="내용을 입력하세요..." 
            />
          </div>
        </aside>

        {/* 원고지 영역: 가로/세로 스크롤 및 확대/축소 가능 */}
        <main className="flex-1 overflow-auto bg-slate-200 p-4 md:p-10 flex justify-start items-start relative touch-pan-x touch-pan-y">
          <div className="manuscript-zoom-container origin-top-left md:origin-top transition-transform p-4">
            <Manuscript text={content} settings={{ gridType, viewMode, lineColor }} name={studentName} />
          </div>
        </main>
      </div>

      <style>{`
        /* 전역 스크롤바 최적화 */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 10px; border: 2px solid #f1f5f9; }
        
        /* 메인 원고지 영역 터치 동작 설정 */
        main {
          -webkit-overflow-scrolling: touch; /* iOS 부드러운 스크롤 */
          overscroll-behavior: contain;
        }

        .manuscript-zoom-container {
          /* 모바일에서 두 손가락 확대/축소(브라우저 기본기능)가 잘 작동하도록 설정 */
          touch-action: manipulation;
          display: inline-block;
          min-width: min-content;
        }

        @media print {
          .no-print { display: none !important; }
          body, html { margin: 0 !important; padding: 0 !important; background: white !important; overflow: visible !important; }
          .app-container, .flex-1, main { display: block !important; overflow: visible !important; height: auto !important; width: 100% !important; background: white !important; }
          .manuscript-zoom-container { transform: none !important; display: block !important; p: 0 !important; }
          .wongoji-page-unit { page-break-after: always !important; display: flex !important; align-items: center !important; justify-content: center !important; height: 100vh !important; }
          .wongoji-paper-dynamic { transform: scale(0.9); box-shadow: none !important; padding: 0 !important; }
          .print-landscape { @page { size: A4 landscape; margin: 0; } }
          .print-portrait { @page { size: A4 portrait; margin: 0; } }
        }
      `}</style>
    </div>
  );
};

export default App;
