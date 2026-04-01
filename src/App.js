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
    // 격자형일 때는 border-right를 항상 표시하여 완벽한 격자 생성
    const isGridMode = viewMode === 'grid';
    const cellStyle = { 
        width: '37px', height: '37px', 
        borderLeft: `1px solid ${lineColor}`, 
        borderTop: `1px solid ${lineColor}`,
        borderBottom: `1px solid ${lineColor}`,
        borderRight: (isLastCol || isGridMode) ? `1px solid ${lineColor}` : 'none',
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
    
    // 메뉴 이름에 따른 간격 설정
    const rowGap = settings.viewMode === 'feedback' ? '28px' : '0px'; 
    // 일반형/격자형은 gap 0, 피드백용만 28px

    return (
      <div className="flex flex-col items-center w-full bg-white print:block">
        {Array.from({ length: pageCount }).map((_, p) => (
          <div key={p} className="wongoji-page-unit flex flex-col items-center">
            <div className="wongoji-paper-dynamic bg-white flex flex-col items-center p-4 lg:p-8" 
                 style={{ width: 'fit-content' }}>
              <div className="w-full flex justify-end mb-4 px-2">
                {p === 0 && name && <div className="border-b-2 border-black px-4 text-sm font-bold flex items-end pb-1">성명: {name}</div>}
              </div>
              <div className="manuscript-grid flex flex-col" style={{ gap: rowGap }}>
                {Array.from({ length: rows }).map((_, r) => (
                  <div key={r} className="flex" style={{ borderRight: settings.viewMode !== 'grid' ? `1px solid ${lineColor}` : 'none' }}>
                    {Array.from({ length: cols }).map((_, c) => renderCell(allCells[p * gridVal + r * cols + c], `c-${p}-${r}-${c}`, c === cols - 1))}
                  </div>
                ))}
              </div>
              <div className="w-full text-center mt-4 text-[10px] text-slate-300 no-print uppercase">Page {p + 1}</div>
              {p < pageCount - 1 && <div className="w-full border-b border-dashed border-slate-100 my-10 no-print"></div>}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`app-container h-screen w-screen flex flex-col bg-white overflow-hidden ${gridType === '200' ? 'print-landscape' : 'print-portrait'}`}>
      <nav className="bg-white border-b px-4 py-3 no-print flex justify-between items-center shadow-sm shrink-0 z-20">
        <h1 className="text-lg font-bold text-slate-700 flex items-center gap-2 font-serif italic"><FileText className="text-red-600" /> 원고지 연습기</h1>
        <div className="flex gap-2">
          {['#607d8b', '#ef4444', '#2d6a4f', '#000000'].map(c => (
            <button key={c} onClick={() => setLineColor(c)} className="w-6 h-6 rounded-full border shadow-sm" style={{ backgroundColor: c }} />
          ))}
        </div>
      </nav>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* 입력 영역: 내부 텍스트박스 스크롤만 남기고 컨테이너 스크롤 제거 */}
        <aside className="h-[35%] lg:h-full w-full lg:w-[380px] bg-white border-b lg:border-b-0 lg:border-r no-print flex flex-col shadow-md shrink-0 z-10 overflow-hidden">
          <div className="p-3 border-b flex flex-col gap-2 bg-slate-50">
            <div className="grid grid-cols-2 gap-2">
              <select value={gridType} onChange={e => setGridType(e.target.value)} className="p-2 border rounded-lg text-xs font-bold outline-none">
                <option value="200">200자 원고지</option>
                <option value="400">400자 원고지</option>
              </select>
              <select value={viewMode} onChange={e => setViewMode(e.target.value)} className="p-2 border rounded-lg text-xs font-bold outline-none">
                <option value="traditional">일반 원고지</option>
                <option value="feedback">피드백용 원고지</option>
                <option value="grid">격자형 원고지</option>
              </select>
            </div>
            <div className="flex gap-2">
              <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="학생 성명" className="flex-1 p-2 border rounded-lg font-bold text-xs outline-none" />
              <button onClick={() => window.print()} className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-red-600 shadow-sm transition-all">
                <Printer size={14} className="inline mr-1"/> PDF 인쇄
              </button>
            </div>
          </div>
          {/* 스크롤바가 두 개 생기지 않도록 관리 */}
          <div className="flex-1 p-4 overflow-hidden"> 
            <textarea 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              className="w-full h-full border-none outline-none resize-none bg-transparent text-base leading-relaxed font-serif overflow-y-auto" 
              placeholder="내용을 입력하세요..." 
            />
          </div>
        </aside>

        <main className="flex-1 overflow-auto bg-white p-4 lg:p-8 flex justify-center items-start scroll-smooth">
          <Manuscript text={content} settings={{ gridType, viewMode, lineColor }} name={studentName} />
        </main>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body, html { margin: 0 !important; padding: 0 !important; overflow: visible !important; }
          .app-container, .flex-1, main { display: block !important; height: auto !important; overflow: visible !important; }
          
          .wongoji-page-unit {
            page-break-after: always !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            height: 100vh !important;
            width: 100vw !important;
          }

          .wongoji-paper-dynamic {
            width: ${gridType === '200' ? '280mm' : '190mm'} !important; 
            transform: scale(0.9);
          }

          .print-landscape { @page { size: A4 landscape; margin: 0; } }
          .print-portrait { @page { size: A4 portrait; margin: 0; } }
        }
      `}</style>
    </div>
  );
};

export default App;
