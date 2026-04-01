import React, { useState, useCallback } from 'react';
import { Printer, FileText, CheckCircle2 } from 'lucide-react';

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
        fontSize: '22px', backgroundColor: 'white', boxSizing: 'border-box',
        // 텍스트 고해상도 렌더링 힌트
        fontSmooth: 'antialiased',
        WebkitFontSmoothing: 'antialiased'
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
      <div className="flex flex-col items-center w-full bg-white print:block">
        {Array.from({ length: pageCount }).map((_, p) => (
          <div key={p} className="wongoji-page-unit flex flex-col items-center w-full overflow-visible">
            <div className="wongoji-paper-dynamic bg-white flex flex-col items-center p-8 lg:p-12" 
                 style={{ width: 'fit-content' }}>
              <div className="w-full flex justify-end mb-8 px-2">
                {p === 0 && name && (
                  <div className="border-b-[1.5px] border-slate-800 px-8 text-base font-bold flex items-end pb-1 tracking-tight">
                    <span className="text-slate-400 text-xs mr-2 uppercase">Name:</span> {name}
                  </div>
                )}
              </div>
              <div className="manuscript-grid flex flex-col" style={{ gap: getRowGap() }}>
                {Array.from({ length: rows }).map((_, r) => (
                  <div key={r} className="flex" style={{ borderRight: settings.viewMode !== 'grid' ? `1.2px solid ${lineColor}` : 'none' }}>
                    {Array.from({ length: cols }).map((_, c) => renderCell(allCells[p * gridVal + r * cols + c], `c-${p}-${r}-${c}`, c === cols - 1))}
                  </div>
                ))}
              </div>
              <div className="w-full text-center mt-8 text-[11px] font-bold text-slate-300 no-print tracking-[0.2em]">
                — PAGE {p + 1} —
              </div>
              {p < pageCount - 1 && <div className="w-full border-b-[1px] border-dashed border-slate-100 my-16 no-print"></div>}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`app-container h-screen w-screen flex flex-col bg-slate-50 overflow-hidden ${gridType === '200' ? 'print-landscape' : 'print-portrait'}`}>
      <nav className="bg-white/80 backdrop-blur-md border-b px-6 py-4 no-print flex justify-between items-center shadow-sm shrink-0 z-20">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-xl"><FileText className="text-red-600" size={24} /></div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">원고지 연습기 <span className="text-xs font-normal text-slate-400 ml-1">v2.0 High-Res</span></h1>
        </div>
        <div className="flex gap-3">
          {['#607d8b', '#ef4444', '#2d6a4f', '#000000'].map(c => (
            <button key={c} onClick={() => setLineColor(c)} className="w-7 h-7 rounded-full border-2 border-white shadow-md ring-1 ring-slate-200 transition-transform hover:scale-110" style={{ backgroundColor: c }} />
          ))}
        </div>
      </nav>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <aside className="h-[35%] lg:h-full w-full lg:w-[420px] bg-white border-b lg:border-b-0 lg:border-r no-print flex flex-col shadow-xl shrink-0 z-10 overflow-hidden">
          <div className="p-6 border-b flex flex-col gap-5 bg-slate-50/50">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Layout</label>
                <select value={gridType} onChange={e => setGridType(e.target.value)} className="w-full p-3 border-slate-200 border rounded-xl text-sm font-bold bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all">
                  <option value="200">200자 (A4 가로)</option>
                  <option value="400">400자 (A4 세로)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Style</label>
                <select value={viewMode} onChange={e => setViewMode(e.target.value)} className="w-full p-3 border-slate-200 border rounded-xl text-sm font-bold bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all">
                  <option value="traditional">일반 원고지</option>
                  <option value="feedback">피드백용</option>
                  <option value="grid">격자형</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Student Name</label>
                <div className="flex gap-2">
                    <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="이름을 입력하세요" className="flex-1 p-3 border-slate-200 border rounded-xl font-bold text-sm shadow-sm outline-none focus:ring-2 focus:ring-blue-100" />
                    <button onClick={() => window.print()} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-600 shadow-lg shadow-slate-200 transition-all flex items-center gap-2 shrink-0">
                        <Printer size={18}/> 인쇄
                    </button>
                </div>
            </div>
          </div>
          <div className="flex-1 p-6 overflow-hidden"> 
            <textarea 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              className="w-full h-full border-none outline-none resize-none bg-transparent text-lg leading-relaxed font-serif overflow-y-auto placeholder:text-slate-300" 
              placeholder="내용을 입력하면 고해상도 격자에 즉시 렌더링됩니다..." 
            />
          </div>
        </aside>

        <main className="flex-1 overflow-auto bg-slate-200/30 p-8 lg:p-16 flex justify-center items-start scroll-smooth">
          <div className="shadow-2xl rounded-sm overflow-hidden">
            <Manuscript text={content} settings={{ gridType, viewMode, lineColor }} name={studentName} />
          </div>
        </main>
      </div>

      <style>{`
        /* 초고해상도 텍스트 및 스크롤바 최적화 */
        * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        textarea::-webkit-scrollbar, main::-webkit-scrollbar { width: 8px; }
        textarea::-webkit-scrollbar-thumb, main::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; border: 2px solid transparent; background-clip: content-box; }

        @media print {
          .no-print { display: none !important; }
          body, html { margin: 0 !important; padding: 0 !important; background: white !important; }
          .app-container, .flex-1, main { display: block !important; height: auto !important; overflow: visible !important; background: white !important; }
          
          .wongoji-page-unit {
            page-break-after: always !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            height: 100vh !important;
            width: 100vw !important;
          }

          .wongoji-paper-dynamic {
            /* 인쇄 시 선 굵기 미세 조정으로 가독성 확보 */
            width: ${gridType === '200' ? '285mm' : '195mm'} !important; 
            transform: scale(0.92);
            image-rendering: auto;
          }

          .print-landscape { @page { size: A4 landscape; margin: 0; } }
          .print-portrait { @page { size: A4 portrait; margin: 0; } }
        }
      `}</style>
    </div>
  );
};

export default App;
