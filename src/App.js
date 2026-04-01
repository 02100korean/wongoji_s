import React, { useState, useCallback } from 'react';
import { Settings, Printer, FileText, ChevronDown, ChevronUp } from 'lucide-react';

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
        borderRight: isLastCol ? `1px solid ${lineColor}` : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        fontSize: '21px', backgroundColor: 'white'
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
    const paperStyle = settings.gridType === '200' ? { width: '297mm', minHeight: '210mm' } : { width: '210mm', minHeight: '297mm' };

    return (
      <div className="flex flex-col items-center w-full gap-12 print:gap-0">
        {Array.from({ length: pageCount }).map((_, p) => (
          <div key={p} className="wongoji-paper bg-white shadow-2xl print:shadow-none flex flex-col items-center justify-start py-12 print:py-0" style={{ fontFamily: settings.fontType, ...paperStyle }}>
            <div className="w-full flex justify-end h-10 mb-4 px-20 print:mt-10">
              {p === 0 && name && <div className="border-b-2 border-black px-6 text-sm font-bold flex items-end">성명: {name}</div>}
            </div>
            <div className="flex flex-col" style={{ gap: rowGap }}>
              {Array.from({ length: rows }).map((_, r) => (
                <div key={r} className="flex" style={{ borderBottom: `1px solid ${lineColor}` }}>
                  {Array.from({ length: cols }).map((_, c) => renderCell(allCells[p * gridVal + r * cols + c], `c-${p}-${r}-${c}`, c === cols - 1))}
                </div>
              ))}
            </div>
            <div className="w-full text-center mt-8 text-xs text-slate-300 no-print">Page {p + 1}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`h-screen w-full flex flex-col bg-slate-100 overflow-hidden ${gridType === '200' ? 'print-landscape' : 'print-portrait'}`}>
      {/* 네비게이션 */}
      <nav className="bg-white border-b px-6 py-3 no-print flex justify-between items-center shadow-sm shrink-0 z-10">
        <h1 className="text-xl font-bold text-slate-700 flex items-center gap-2 font-serif italic"><FileText className="text-red-600" /> 원고지 연습기</h1>
        <div className="flex gap-2">
          {['#607d8b', '#ef4444', '#2d6a4f', '#000000'].map(c => (
            <button key={c} onClick={() => setLineColor(c)} className="w-6 h-6 rounded-full border shadow-sm" style={{ backgroundColor: c }} />
          ))}
        </div>
      </nav>

      {/* 메인 레이아웃: 가로일 땐 좌우 / 세로일 땐 상하 분할 */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* 입력창 영역 (화면이 작을 땐 높이의 40~50% 고정) */}
        <aside className="h-[45vh] lg:h-full w-full lg:w-[380px] bg-white border-b lg:border-b-0 lg:border-r no-print flex flex-col shadow-xl shrink-0">
          <div className="p-4 border-b flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              <select value={gridType} onChange={e => setGridType(e.target.value)} className="p-2 border rounded-lg text-sm font-bold bg-slate-50 outline-none">
                <option value="200">200자 (가로)</option>
                <option value="400">400자 (세로)</option>
              </select>
              <select value={viewMode} onChange={e => setViewMode(e.target.value)} className="p-2 border rounded-lg text-sm font-bold bg-slate-50 outline-none">
                <option value="traditional">일반형</option>
                <option value="feedback">피드백형</option>
                <option value="grid">격자형</option>
              </select>
            </div>
            <div className="flex gap-2">
              <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="성명" className="flex-1 p-2 border rounded-lg font-bold outline-none text-sm" />
              <button onClick={() => window.print()} className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-600 transition-all flex items-center gap-1 shadow-md">
                <Printer size={16}/> Print
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <textarea 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              className="w-full h-full min-h-[150px] p-0 border-none outline-none resize-none bg-transparent text-lg leading-relaxed font-serif" 
              placeholder="여기에 내용을 입력하세요..." 
            />
          </div>
        </aside>

        {/* 원고지 미리보기 영역 (나머지 공간 전체 차지) */}
        <main className="flex-1 overflow-auto bg-slate-300 p-4 lg:p-16 flex justify-center scroll-smooth">
          <div className="h-fit">
            <Manuscript text={content} settings={{ gridType, viewMode, lineColor }} name={studentName} />
          </div>
        </main>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body, html { background: white !important; margin: 0 !important; padding: 0 !important; }
          main { background: white !important; padding: 0 !important; overflow: visible !important; width: 100% !important; height: auto !important; }
          .wongoji-paper { 
            box-shadow: none !important; margin: 0 auto !important; 
            page-break-after: always !important; display: flex !important;
            justify-content: center !important; align-items: center !important;
            height: 100vh !important; 
          }
          .print-landscape { @page { size: A4 landscape; margin: 0; } }
          .print-portrait { @page { size: A4 portrait; margin: 0; } }
        }
      `}</style>
    </div>
  );
};

export default App;
