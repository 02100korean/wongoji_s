import React, { useState, useCallback } from 'react';
import { Settings, Printer, FileText, ChevronDown, ChevronUp } from 'lucide-react';

const App = () => {
  const [content, setContent] = useState('');
  const [studentName, setStudentName] = useState('');
  const [fontType, setFontType] = useState("'Noto Serif KR', serif");
  const [gridType, setGridType] = useState('200'); 
  const [viewMode, setViewMode] = useState('traditional'); 
  const [lineColor, setLineColor] = useState('#607d8b');
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);

  // 원고지 엔진: 줄바꿈 및 첫 칸 비우기 규칙
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

  const renderCell = (cellData, key) => {
    const cellStyle = { 
        width: '37px', height: '37px', 
        borderRight: `1px solid ${lineColor}`, 
        borderBottom: `1px solid ${lineColor}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '21px'
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
    // 인쇄 시 딱 맞게 조절하기 위한 스타일
    const paperClassName = `wongoji-paper bg-white shadow-2xl p-8 print:p-0 print:shadow-none print:m-0 flex flex-col items-center justify-center`;
    const paperStyle = settings.gridType === '200' 
      ? { width: '297mm', minHeight: '210mm', height: 'auto' } 
      : { width: '210mm', minHeight: '297mm', height: 'auto' };

    return (
      <div className="flex flex-col items-center w-full gap-8 print:gap-0">
        {Array.from({ length: pageCount }).map((_, p) => (
          <div key={p} className={paperClassName} style={{ fontFamily: settings.fontType, ...paperStyle }}>
            <div className="w-full flex justify-end h-8 mb-4 px-10 print:mt-10">
              {p === 0 && name && <div className="border-b-2 border-black px-4 text-sm font-bold">성명: {name}</div>}
            </div>
            <div className="border-t border-l flex flex-col" style={{ borderColor: lineColor, gap: rowGap }}>
              {Array.from({ length: rows }).map((_, r) => (
                <div key={r} className="flex">
                  {Array.from({ length: cols }).map((_, c) => renderCell(allCells[p * gridVal + r * cols + c], c))}
                </div>
              ))}
            </div>
            <div className="w-full text-center mt-4 text-xs text-slate-300 no-print">Page {p + 1}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`h-screen w-full flex flex-col bg-slate-100 overflow-hidden ${gridType === '200' ? 'print-landscape' : 'print-portrait'}`}>
      {/* 상단바 (고정) */}
      <nav className="bg-white border-b px-6 py-3 no-print flex justify-between items-center shadow-sm shrink-0">
        <h1 className="text-xl font-bold text-slate-700 flex items-center gap-2"><FileText className="text-blue-600" /> 원고지 연습기</h1>
        <div className="flex gap-2">
          {['#607d8b', '#ef4444', '#22c55e', '#000000'].map(c => (
            <button key={c} onClick={() => setLineColor(c)} className="w-6 h-6 rounded-full border shadow-sm" style={{ backgroundColor: c }} />
          ))}
        </div>
      </nav>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* 왼쪽 입력창 (스크롤 고정) */}
        <aside className="w-full lg:w-[400px] bg-white border-r no-print flex flex-col shadow-lg shrink-0">
          <div className="p-5 border-b flex flex-col gap-4">
            <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="flex justify-between items-center font-bold text-slate-600">
              <span className="flex items-center gap-2"><Settings size={18}/> 원고지 설정</span>
              {isSettingsOpen ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
            </button>
            {isSettingsOpen && (
              <div className="grid grid-cols-2 gap-3">
                <select value={gridType} onChange={e => setGridType(e.target.value)} className="p-2 border rounded-lg text-sm outline-none bg-slate-50">
                  <option value="200">200자 (가로형)</option>
                  <option value="400">400자 (세로형)</option>
                </select>
                <select value={viewMode} onChange={e => setViewMode(e.target.value)} className="p-2 border rounded-lg text-sm outline-none bg-slate-50">
                  <option value="traditional">일반형</option>
                  <option value="feedback">피드백형</option>
                  <option value="grid">격자형</option>
                </select>
              </div>
            )}
            <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="학생 성명" className="p-3 border rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-100" />
          </div>

          {/* 텍스트 입력 영역 (이곳만 스크롤) */}
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
            <textarea 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              className="w-full h-full min-h-[400px] p-4 border-none outline-none resize-none bg-transparent text-lg leading-relaxed" 
              placeholder="여기에 내용을 입력하세요..." 
            />
          </div>

          <div className="p-5 border-t">
            <button onClick={() => window.print()} className="w-full bg-slate-800 text-white h-14 rounded-2xl font-bold hover:bg-black transition-all shadow-md flex items-center justify-center gap-2">
              <Printer size={20}/> 인쇄 및 PDF 저장
            </button>
          </div>
        </aside>

        {/* 오른쪽 원고지 미리보기 (이곳도 독립적 스크롤) */}
        <main className="flex-1 overflow-auto bg-slate-300 p-4 lg:p-12 flex justify-center custom-scrollbar">
          <Manuscript text={content} settings={{ gridType, viewMode, fontType, lineColor }} name={studentName} />
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        
        @media print {
          .no-print { display: none !important; }
          body, html { margin: 0 !important; padding: 0 !important; height: auto !important; overflow: visible !important; }
          .wongoji-paper { 
            page-break-after: always !important; 
            box-shadow: none !important; 
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .print-landscape { @page { size: A4 landscape; margin: 0; } }
          .print-portrait { @page { size: A4 portrait; margin: 0; } }
        }
      `}</style>
    </div>
  );
};

export default App;
