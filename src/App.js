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
    
    return (
      <div className="manuscript-wrapper flex flex-col items-center w-full bg-white print:block">
        {Array.from({ length: pageCount }).map((_, p) => (
          <div key={p} className="wongoji-page-unit">
            <div className="wongoji-paper-dynamic bg-white print:shadow-none flex flex-col items-center p-4 lg:p-8" 
                 style={{ width: 'fit-content', minHeight: 'fit-content' }}>
              <div className="w-full flex justify-end mb-4 px-2 no-print-margin">
                {p === 0 && name && <div className="border-b-2 border-black px-4 text-sm font-bold flex items-end pb-1">성명: {name}</div>}
              </div>
              <div className="manuscript-grid flex flex-col" style={{ gap: rowGap }}>
                {Array.from({ length: rows }).map((_, r) => (
                  <div key={r} className="flex">
                    {Array.from({ length: cols }).map((_, c) => renderCell(allCells[p * gridVal + r * cols + c], `c-${p}-${r}-${c}`, c === cols - 1))}
                  </div>
                ))}
              </div>
              <div className="w-full text-center mt-4 text-[10px] text-slate-300 no-print uppercase tracking-widest">Page {p + 1}</div>
              {p < pageCount - 1 && <div className="w-full border-b border-dashed border-slate-100 my-10 no-print"></div>}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`app-container h-screen w-screen flex flex-col bg-white ${gridType === '200' ? 'print-landscape' : 'print-portrait'}`}>
      <nav className="bg-white border-b px-4 py-3 no-print flex justify-between items-center shadow-sm shrink-0 z-20">
        <h1 className="text-lg font-bold text-slate-700 flex items-center gap-2 font-serif italic"><FileText className="text-red-600" /> 원고지 연습기</h1>
        <div className="flex gap-2">
          {['#607d8b', '#ef4444', '#2d6a4f', '#000000'].map(c => (
            <button key={c} onClick={() => setLineColor(c)} className="w-6 h-6 rounded-full border shadow-sm" style={{ backgroundColor: c }} />
          ))}
        </div>
      </nav>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden print:block print:overflow-visible">
        <aside className="h-[35%] lg:h-full w-full lg:w-[380px] bg-white border-b lg:border-b-0 lg:border-r no-print flex flex-col shadow-md shrink-0 z-10">
          <div className="p-3 border-b flex flex-col gap-2 bg-slate-50">
            <div className="grid grid-cols-2 gap-2">
              <select value={gridType} onChange={e => setGridType(e.target.value)} className="p-2 border rounded-lg text-xs font-bold">
                <option value="200">200자 원고지</option>
                <option value="400">400자 원고지</option>
              </select>
              <select value={viewMode} onChange={e => setViewMode(e.target.value)} className="p-2 border rounded-lg text-xs font-bold">
                <option value="traditional">일반형</option>
                <option value="feedback">피드백형</option>
              </select>
            </div>
            <div className="flex gap-2">
              <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="학생 성명" className="flex-1 p-2 border rounded-lg font-bold text-xs" />
              <button onClick={() => window.print()} className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-red-600 shadow-sm transition-all">
                <Printer size={14} className="inline mr-1"/> PDF 인쇄 (전체)
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full h-full border-none outline-none resize-none bg-transparent text-base leading-relaxed font-serif" placeholder="내용을 입력하면 자동으로 원고지 페이지가 생성됩니다..." />
          </div>
        </aside>

        <main className="flex-1 overflow-auto bg-white p-4 lg:p-8 flex justify-center items-start print:block print:overflow-visible print:p-0">
          <Manuscript text={content} settings={{ gridType, viewMode, lineColor }} name={studentName} />
        </main>
      </div>

      <style>{`
        @media print {
          /* 1. 모든 레이아웃 제약 해제 */
          .no-print { display: none !important; }
          .app-container, .flex-1, main { 
            display: block !important; 
            overflow: visible !important; 
            height: auto !important; 
            width: 100% !important; 
            position: static !important;
          }
          
          /* 2. 원고지 페이지 단위 설정 */
          .wongoji-page-unit {
            page-break-after: always !important; /* 각 원고지 페이지를 다음 종이로 넘김 */
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            height: 100vh !important; /* 종이 한 장에 꽉 차게 함 */
            width: 100vw !important;
          }

          /* 3. 종이 크기 및 비율 강제 조정 (내용 전체가 들어가도록) */
          .wongoji-paper-dynamic {
            width: ${gridType === '200' ? '280mm' : '190mm'} !important; 
            height: auto !important;
            max-height: 95% !important;
            padding: 0 !important;
            margin: 0 !important;
            transform: scale(0.9); /* 인쇄 여백 안전빵 */
          }

          .print-landscape { @page { size: A4 landscape; margin: 0; } }
          .print-portrait { @page { size: A4 portrait; margin: 0; } }
        }
      `}</style>
    </div>
  );
};

export default App;
