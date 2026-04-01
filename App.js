import React, { useState, useCallback } from 'react';
import { Settings, Printer, FileText, ChevronDown, ChevronUp } from 'lucide-react';

const App = () => {
  // --- 상태 관리 (필요한 UI 상태만 유지) ---
  const [activeTab, setActiveTab] = useState('write'); 
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [studentName, setStudentName] = useState('');
  
  // 원고지 설정 상태
  const [fontType, setFontType] = useState("'Noto Serif KR', serif");
  const [gridType, setGridType] = useState('200'); 
  const [viewMode, setViewMode] = useState('traditional');
  const [lineColor, setLineColor] = useState('#607d8b');

  /**
   * [원고지 규칙 엔진 v8.0 유지]
   */
  const processToCells = useCallback((text, cols) => {
    const cells = [{ type: 'empty' }]; // 첫 칸 비우기 [cite: 23]
    let i = 0;
    
    while (i < text.length) {
      const char = text[i];
      const nextChar = text[i + 1] || null; [cite: 24]

      if (char === '\n') {
        const currentLinePos = cells.length % cols;
        const remaining = cols - (currentLinePos || cols);
        if (currentLinePos !== 0) {
            for (let r = 0; r < remaining; r++) cells.push({ type: 'empty' });
        }
        cells.push({ type: 'empty' }); // 줄바꿈 시 자동 들여쓰기 [cite: 24]
        i++; continue;
      }

      if (char === ' ') {
        if (cells.length % cols === 0) { // 행 시작 공백 무시 [cite: 25]
          i++; continue;
        }
        cells.push({ type: 'default', content: '' });
        i++; continue;
      }

      const isDigit = (c) => /[0-9]/.test(c);
      const isPunct = (c) => c === '.' || c === ','; [cite: 27]
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
        cells.push({ type: 'default', content: char }); [cite: 31]
        i++;
      }
    }
    return cells;
  }, []);

  // --- UI 컴포넌트 ---
  const renderCell = (cellData, key) => {
    const cellStyle = { 
        width: '37px', height: '37px', borderRight: `0.8px solid ${lineColor}`, borderBottom: `0.8px solid ${lineColor}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', fontSize: '21px'
    }; [cite: 65]

    if (!cellData || cellData.type === 'empty') return <div key={key} style={cellStyle}></div>;
    if (cellData.type === 'pair') {
        const isPunctChar = (c) => c === '.' || c === ',';
        return (
            <div key={key} style={cellStyle}>
                <div className="flex w-full h-full font-bold text-[19px]">
                    <div className="w-1/2 flex items-center justify-center relative">
                      {isPunctChar(cellData.content[0]) ? <span className="absolute bottom-[8%]">{cellData.content[0]}</span> : cellData.content[0]}
                    </div>
                    <div className="w-1/2 flex items-center justify-center relative">
                      {isPunctChar(cellData.content[1]) ? <span className="absolute bottom-[8%]">{cellData.content[1]}</span> : cellData.content[1]}
                    </div>
                </div>
            </div>
        ); [cite: 67, 68, 69, 70]
    }
    return <div key={key} style={cellStyle}>{cellData.type === 'punct-low' ? <span className="absolute left-[5%] bottom-[8%]">{cellData.content}</span> : cellData.content}</div>;
  };

  const Manuscript = ({ text, settings, name }) => {
    const cols = 20; [cite: 72]
    const gridVal = parseInt(settings.gridType);
    const rows = gridVal / cols;
    const cellsPerPage = gridVal;
    const allCells = processToCells(text, cols); [cite: 73]
    const pageCount = Math.max(1, Math.ceil(allCells.length / cellsPerPage));
    
    const paperStyle = gridVal === 200 
      ? { width: '297mm', minHeight: 'auto', height: 'auto' } 
      : { width: '210mm', minHeight: 'auto', height: 'auto' }; [cite: 75]
    
    const rowGap = settings.viewMode === 'feedback' ? '28px' : (settings.viewMode === 'traditional' ? '14px' : '0'); [cite: 76]

    return (
      <div className="flex flex-col items-center w-full">
        {Array.from({ length: pageCount }).map((_, p) => {
          const pageCells = allCells.slice(p * cellsPerPage, (p + 1) * cellsPerPage);
          return (
            <div key={`p-${p}`} className="wongoji-paper mb-10 bg-white shadow-2xl flex flex-col overflow-hidden p-0 print:p-[15mm]" style={{ fontFamily: settings.fontType, ...paperStyle }}>
              <div className={`flex justify-end shrink-0 px-6 ${settings.viewMode === 'grid' ? 'h-5 pt-1' : 'h-8 pt-2'} print:h-10`}>
                {p === 0 && name && <div className="border-b-2 border-slate-300 px-4 py-0 text-xs font-bold text-slate-700">성명: {name}</div>}
              </div>
              <div className={`flex-1 flex items-center justify-center overflow-visible px-4 print:p-0 ${settings.viewMode === 'grid' ? 'pb-1 pt-1' : 'pb-2 pt-2'}`}>
                <div className={settings.viewMode === 'grid' ? "grid grid-cols-20 border-t border-l" : "flex flex-col"} style={{ borderColor: lineColor, gap: settings.viewMode === 'grid' ? 0 : rowGap }}>
                   {settings.viewMode === 'grid' 
                     ? Array.from({ length: cellsPerPage }).map((__, c) => renderCell(pageCells[c], `c-${p}-${c}`))
                     : Array.from({ length: rows }).map((__, r) => (
                        <div key={`row-${p}-${r}`} className="flex border-t border-l" style={{ borderColor: lineColor }}>
                            {Array.from({ length: cols }).map((___, c) => renderCell(pageCells[r * cols + c], `cell-${p}-${r}-${c}`))}
                        </div>
                     ))
                   }
                </div>
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-slate-300 uppercase no-print px-6 pb-2">
                <span>Page {p + 1}</span>
                <span>Wongoji Practice Mode</span>
              </div>
            </div>
          ); [cite: 77, 78, 79, 80, 81, 82, 83]
        })}
      </div>
    );
  };

  return (
    <div className={`h-screen flex flex-col bg-slate-100 overflow-hidden text-slate-800 font-sans ${gridType === '200' ? 'print-landscape' : 'print-portrait'}`}>
      <nav className="bg-white border-b px-6 py-3 no-print flex justify-between items-center z-40 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-slate-700 flex items-center gap-2"><FileText className="text-blue-600" /> 원고지 연습기</h1>
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border">
             {['#607d8b', '#ff9e9e', '#2d6a4f', '#000000'].map(c => (
               <button key={c} onClick={() => setLineColor(c)} className={`w-5 h-5 rounded-full border-2 border-white shadow-sm transition-transform ${lineColor === c ? 'scale-125 ring-2 ring-slate-200' : ''}`} style={{ backgroundColor: c }} />
             ))}
          </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <aside className="w-full lg:w-96 bg-white border-b lg:border-b-0 lg:border-r no-print flex flex-col z-30 shadow-xl shrink-0 h-auto lg:h-full max-h-[75vh] lg:max-h-full">
          <div className="border-b shrink-0">
            <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="w-full px-5 py-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-600"><Settings size={16} /> 원고지 설정</div>
              {isSettingsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {isSettingsOpen && (
              <div className="px-5 pb-3 lg:pb-5 animate-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-3 gap-2">
                  <select value={fontType} onChange={e => setFontType(e.target.value)} className="p-1.5 border rounded-lg text-xs outline-none shadow-sm">
                    <option value="'Noto Serif KR', serif">바탕</option>
                    <option value="'Noto Sans KR', sans-serif">고딕</option>
                  </select>
                  <select value={gridType} onChange={e => setGridType(e.target.value)} className="p-1.5 border rounded-lg text-xs outline-none shadow-sm">
                    <option value="200">200자</option>
                    <option value="400">400자</option>
                  </select>
                  <select value={viewMode} onChange={e => setViewMode(e.target.value)} className="p-1.5 border rounded-lg text-xs outline-none shadow-sm">
                    <option value="traditional">일반</option>
                    <option value="feedback">피드백</option>
                    <option value="grid">격자</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 p-4 lg:p-5 flex flex-col overflow-hidden min-h-0">
            <div className="flex-1 flex flex-col min-h-0">
              <div className="mb-2">
                <input 
                  type="text" 
                  value={studentName} 
                  onChange={e => setStudentName(e.target.value)} 
                  placeholder="성명을 입력하세요" 
                  className="w-full p-2 border-2 border-slate-100 rounded-xl outline-none bg-slate-50/30 text-sm font-bold"
                />
              </div>
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-sm font-bold text-slate-700">내용 입력</h3>
                <span className="text-[10px] text-slate-400 font-bold">{content.length}자</span>
              </div>
              <textarea 
                value={content} 
                onChange={e => setContent(e.target.value)} 
                className="flex-1 w-full p-3 lg:p-4 border-2 border-slate-100 rounded-xl lg:rounded-2xl outline-none resize-none bg-slate-50/30 text-base lg:text-lg min-h-[250px] lg:min-h-0 shadow-inner" 
                placeholder="원고지에 작성할 내용을 입력하세요..." 
              />
            </div>
            <div className="mt-3 lg:mt-4 shrink-0">
              <button 
                onClick={() => window.print()} 
                className="w-full flex items-center justify-center gap-2 bg-slate-700 text-white h-12 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg"
              >
                <Printer size={18} /> 인쇄 및 PDF 저장
              </button>
            </div>
          </div>
        </aside>
        
        <section id="previewSection" className="flex-1 overflow-auto bg-slate-200 p-4 lg:p-8 flex flex-col items-center justify-start custom-scrollbar touch-pan-y">
          <Manuscript text={content} settings={{ gridType, viewMode, fontType, lineColor }} name={studentName} />
        </section>
      </div>

      <style>{`
        .grid-cols-20 { grid-template-columns: repeat(20, minmax(0, 1fr)); }
        @media (max-width: 1023px) { .wongoji-paper { transform: scale(0.98); transform-origin: top center; margin-bottom: 20px; } }
        @media print { 
          .no-print { display: none !important; } 
          #previewSection { padding: 0 !important; overflow: visible !important; display: block !important; background: white !important; } 
          .wongoji-paper { box-shadow: none !important; margin: 0 auto !important; padding: 10mm !important; page-break-after: always; transform: scale(1) !important; } 
          .print-landscape .wongoji-paper { width: 297mm !important; height: 210mm !important; }
          .print-portrait .wongoji-paper { width: 210mm !important; height: 297mm !important; }
          @page { margin: 0; }
          .print-landscape @page { size: landscape; }
          .print-portrait @page { size: portrait; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;
