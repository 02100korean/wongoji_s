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
      <div className="flex flex-col items-center w-full bg-white">
        {Array.from({ length: pageCount }).map((_, p) => (
          <div key={p} className="wongoji-page-unit flex flex-col items-center bg-white print:h-screen print:w-screen print:justify-center">
            {/* 미리보기에서는 여백 없이 격자 크기만큼만 차지, 인쇄 시에는 A4 규격 적용 */}
            <div className="wongoji-paper-dynamic bg-white print:shadow-none flex flex-col items-center p-4 lg:p-8" 
                 style={{ 
                   width: 'fit-content', // 미리보기 핵심: 격자 크기에 맞춤
                   minHeight: 'fit-content'
                 }}>
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
    <div className={`h-screen w-screen flex flex-col bg-white overflow-hidden ${gridType === '200' ? 'print-landscape' : 'print-portrait'}`}>
      <nav className="bg-white border-b px-4 py-3 no-print flex justify-between items-center shadow-sm shrink-0 z-20">
        <h1 className="text-lg font-bold text-slate-700 flex items-center gap-2 font-serif italic"><FileText className="text-red-600" /> 원고지 연습기</h1>
        <div className="flex gap-2">
          {['#607d8b', '#ef4444', '#2d6a4f', '#000000'].map(c => (
            <button key={c} onClick={() => setLineColor(c)} className="w-6 h-6 rounded-full border shadow-sm" style={{ backgroundColor: c }} />
          ))}
        </div>
      </nav>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <aside className="h-[35%] lg:h-full w-full lg:w-[380px] bg-white border-b lg:border-b-0 lg:border-r no-print flex flex-col shadow-md shrink-0 z-10">
          <div className="p-3 border-b flex flex-col gap-2 bg-slate-50">
            <div className="grid grid-cols-2 gap-2">
              <select value={gridType} onChange={e => setGridType(e.target.value)} className="p-2 border rounded-lg text-xs font-bold outline-none">
                <option value="200">200자 원고지</option>
                <option value="400">400자 원고지</option>
              </select>
              <select value={viewMode} onChange={e => setViewMode(e.target.value)} className="p-2 border rounded-lg text-xs font-bold outline-none">
                <option value="traditional">일반형</option>
                <option value="feedback">피드백형</option>
                <option value="grid">격자형</option>
              </select>
            </div>
            <div className="flex gap-2">
              <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="학생 성명" className="flex-1 p-2 border rounded-lg font-bold outline-none text-xs" />
              <button onClick={() => window.print()} className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-red-600 transition-colors shadow-sm">
                <Printer size={14} className="inline mr-1"/> PDF 인쇄
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
            <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full h-full border-none outline-none resize-none bg-transparent text-base leading-relaxed font-serif" placeholder="원고지 내용을 입력하세요..." />
          </div>
        </aside>

        <main className="flex-1 overflow-auto bg-white p-4 lg:p-8 flex justify-center items-start scroll-smooth scrollbar-hide">
          <Manuscript text={content} settings={{ gridType, viewMode, lineColor }} name={studentName} />
        </main>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        @media print {
          .no-print { display: none !important; }
          body, html { margin: 0 !important; padding: 0 !important; }
          
          /* 인쇄 시에는 강제로 A4 규격 중앙에 맞춤 */
          .wongoji-page-unit {
            page-break-after: always !important;
            height: 100vh !important;
            width: 100vw !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }

          .wongoji-paper-dynamic {
            /* 인쇄 시에만 고정 규격 적용 */
            width: ${gridType === '200' ? '297mm' : '210mm'} !important;
            height: ${gridType === '200' ? '210mm' : '297mm'} !important;
            padding: 0 !important;
            transform: scale(0.9); /* 인쇄 마진 확보를 위한 미세 축소 */
          }
          
          .print-landscape { @page { size: A4 landscape; margin: 0; } }
          .print-portrait { @page { size: A4 portrait; margin: 0; } }
        }
      `}</style>
    </div>
  );
};

export default App;
