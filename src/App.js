import React, { useState, useCallback, useRef } from 'react';
import { Printer, FileText, Search } from 'lucide-react';

const App = () => {
  const [content, setContent] = useState('');
  const [studentName, setStudentName] = useState('');
  const [gridType, setGridType] = useState('200'); 
  const [viewMode, setViewMode] = useState('traditional'); 
  const [lineColor, setLineColor] = useState('#607d8b');
  
  // 줌 상태 관리 (0.3 ~ 1.0)
  const [zoom, setZoom] = useState(0.8);
  const touchDistRef = useRef(0);

  // 고속 핀치 줌 로직 (민감도 개선)
  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault(); 
      const dist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );

      if (touchDistRef.current > 0) {
        // 민감도를 0.01로 상향하여 반응 속도 체감 증가
        const delta = (dist - touchDistRef.current) * 0.01; 
        setZoom((prev) => {
          const nextZoom = prev + delta;
          return Math.min(Math.max(nextZoom, 0.3), 1.0);
        });
      }
      touchDistRef.current = dist;
    }
  };

  const handleTouchEnd = () => {
    touchDistRef.current = 0;
  };

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
      <div className="inline-flex flex-col items-center bg-white shadow-2xl print:shadow-none">
        {Array.from({ length: pageCount }).map((_, p) => (
          <div key={p} className="flex flex-col items-center">
            <div className="bg-white flex flex-col items-center p-12 md:p-16" style={{ width: 'max-content' }}>
              <div className="w-full flex justify-end mb-8 px-2">
                {p === 0 && name && <div className="border-b-2 border-slate-900 px-8 text-lg font-bold pb-1">성명: {name}</div>}
              </div>
              <div className="manuscript-grid flex flex-col" style={{ gap: getRowGap() }}>
                {Array.from({ length: rows }).map((_, r) => (
                  <div key={r} className="flex" style={{ borderRight: settings.viewMode !== 'grid' ? `1.2px solid ${lineColor}` : 'none' }}>
                    {Array.from({ length: cols }).map((_, c) => renderCell(allCells[p * gridVal + r * cols + c], `c-${p}-${r}-${c}`, c === cols - 1))}
                  </div>
                ))}
              </div>
              <div className="w-full text-center mt-10 text-[11px] text-slate-300 font-bold no-print tracking-widest uppercase">PAGE {p + 1}</div>
              {p < pageCount - 1 && <div className="w-full border-b-2 border-dotted border-slate-200 my-20 no-print"></div>}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`app-container flex flex-col bg-slate-200 h-screen overflow-hidden ${gridType === '200' ? 'print-landscape' : 'print-portrait'}`}>
      <nav className="bg-white border-b px-4 py-3 no-print flex justify-between items-center shrink-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <FileText className="text-red-600" size={20} />
          <h1 className="text-base font-black text-slate-800">원고지 연습기</h1>
        </div>
        <div className="flex gap-2">
          {['#607d8b', '#ef4444', '#2d6a4f', '#000000'].map(c => (
            <button key={c} onClick={() => setLineColor(c)} className="w-6 h-6 rounded-full border-2 border-white shadow ring-1 ring-slate-200" style={{ backgroundColor: c }} />
          ))}
        </div>
      </nav>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        <aside className="w-full md:w-[350px] bg-white border-b md:border-b-0 md:border-r no-print flex flex-col shrink-0 z-30 h-[30%] md:h-full">
          <div className="p-3 border-b bg-slate-50 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <select value={gridType} onChange={e => setGridType(e.target.value)} className="p-2 border rounded-xl text-xs font-bold bg-white outline-none">
                <option value="200">200자 (가로)</option>
                <option value="400">400자 (세로)</option>
              </select>
              <select value={viewMode} onChange={e => setViewMode(e.target.value)} className="p-2 border rounded-xl text-xs font-bold bg-white outline-none">
                <option value="traditional">일반형</option>
                <option value="feedback">피드백용</option>
                <option value="grid">격자형</option>
              </select>
            </div>
            <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="학생 성명" className="p-2 border rounded-xl font-bold text-xs outline-none" />
            <button onClick={() => window.print()} className="bg-slate-900 text-white w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 hover:bg-red-600 transition-colors">
              <Printer size={16}/> PDF 저장/인쇄
            </button>
          </div>
          <div className="flex-1 p-3">
            <textarea 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              className="w-full h-full border-none outline-none resize-none bg-transparent text-base leading-relaxed font-serif" 
              placeholder="여기에 내용을 입력하세요..." 
            />
          </div>
        </aside>

        <main 
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="flex-1 overflow-auto bg-slate-300 relative touch-none scrollbar-visible p-4 md:p-8"
        >
          {/* 수정된 영역: md:flex 클래스로 PC(중간 화면 이상)에서만 노출되도록 설정 */}
          <div className="sticky top-0 left-0 z-40 bg-white/95 backdrop-blur-md border px-3 py-2 hidden md:flex items-center gap-2 rounded-br-2xl shadow-md w-fit no-print">
            <Search size={14} className="text-slate-500" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Scale</span>
            <select 
              value={zoom} 
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="bg-transparent border-none text-xs font-black outline-none focus:ring-0 cursor-pointer text-slate-900"
            >
              <option value="0.3">30%</option>
              <option value="0.4">40%</option>
              <option value="0.5">50%</option>
              <option value="0.6">60%</option>
              <option value="0.7">70%</option>
              <option value="0.8">80%</option>
              <option value="0.9">90%</option>
              <option value="1.0">100%</option>
            </select>
          </div>

          <div className="inline-block min-w-full min-h-full">
            <div 
              className="origin-top-left transition-transform duration-75 ease-out p-4 md:p-10"
              style={{ transform: `scale(${zoom})` }}
            >
              <Manuscript text={content} settings={{ gridType, viewMode, lineColor }} name={studentName} />
            </div>
          </div>
        </main>
      </div>

      <style>{`
        .scrollbar-visible::-webkit-scrollbar { width: 10px; height: 10px; }
        .scrollbar-visible::-webkit-scrollbar-track { background: #cbd5e1; }
        .scrollbar-visible::-webkit-scrollbar-thumb { background: #475569; border-radius: 5px; border: 2px solid #cbd5e1; }
        
        main {
          touch-action: none;
          -webkit-overflow-scrolling: touch;
        }

        @media print {
          .no-print { display: none !important; }
          body, html { margin: 0 !important; padding: 0 !important; background: white !important; overflow: visible !important; }
          .app-container, .flex-1, main { display: block !important; overflow: visible !important; height: auto !important; width: 100% !important; background: white !important; }
          .origin-top-left { transform: scale(1) !important; padding: 0 !important; }
          .wongoji-page-unit { page-break-after: always !important; height: 100vh !important; display: flex !important; align-items: center !important; justify-content: center !important; }
          .wongoji-paper-dynamic { transform: scale(0.9); width: auto !important; padding: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default App;
