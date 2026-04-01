import React, { useState, useCallback } from 'react';
import { Settings, Printer, FileText, ChevronDown, ChevronUp } from 'lucide-react';

const App = () => {
  // --- 상태 관리 ---
  const [content, setContent] = useState('');
  const [studentName, setStudentName] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // 원고지 설정
  const [fontType, setFontType] = useState("'Noto Serif KR', serif");
  const [gridType, setGridType] = useState('200'); 
  const [viewMode, setViewMode] = useState('traditional');
  const [lineColor, setLineColor] = useState('#607d8b');

  // --- 원고지 규칙 로직 ---
  const processToCells = useCallback((text, cols) => {
    const cells = [{ type: 'empty' }]; // 문단 시작 첫 칸 비우기
    let i = 0;
    
    while (i < text.length) {
      const char = text[i];
      const nextChar = text[i + 1] || null;

      // 줄바꿈 처리
      if (char === '\n') {
        const currentLinePos = cells.length % cols;
        const remaining = cols - (currentLinePos || cols);
        if (currentLinePos !== 0) {
            for (let r = 0; r < remaining; r++) cells.push({ type: 'empty' });
        }
        cells.push({ type: 'empty' }); // 새 문단 시작 시 첫 칸 비우기
        i++; continue;
      }

      // 공백 처리
      if (char === ' ') {
        if (cells.length % cols === 0) { // 줄 첫 칸이 공백이면 무시
          i++; continue;
        }
        cells.push({ type: 'default', content: '' });
        i++; continue;
      }

      const isDigit = (c) => /[0-9]/.test(c);
      const isPunct = (c) => c === '.' || c === ',';
      const isSmallChar = (c) => /[a-zA-Z]/.test(c);

      // 숫자/영어 반 칸 처리 (한 칸에 두 자)
      const canPair = nextChar && (
        (isDigit(char) && isDigit(nextChar)) || 
        (isDigit(char) && isPunct(nextChar)) || 
        (isPunct(char) && isDigit(nextChar)) || 
        (isSmallChar(char) && isSmallChar(nextChar))
      );

      if (canPair) {
        cells.push({ type: 'pair', content: [char, nextChar] });
        i += 2;
      } else if (isPunct(char)) {
        cells.push({ type: 'punct-low', content: char });
        i++;
      } else if (char === '?' || char === '!') {
        cells.push({ type: 'punct-center', content: char });
        i++;
      } else {
        cells.push({ type: 'default', content: char });
        i++;
      }
    }
    return cells;
  }, []);

  // --- 셀 렌더링 ---
  const renderCell = (cellData, key) => {
    const cellStyle = { 
        width: '37px', height: '37px', 
        borderRight: `1px solid ${lineColor}`, 
        borderBottom: `1px solid ${lineColor}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        position: 'relative', fontSize: '20px', fontWeight: '500'
    };

    if (!cellData || cellData.type === 'empty') return <div key={key} style={cellStyle}></div>;
    
    if (cellData.type === 'pair') {
        return (
            <div key={key} style={cellStyle}>
                <div className="flex w-full h-full">
                    <div className="w-1/2 flex items-center justify-center">{cellData.content[0]}</div>
                    <div className="w-1/2 flex items-center justify-center">{cellData.content[1]}</div>
                </div>
            </div>
        );
    }
    
    return (
      <div key={key} style={cellStyle}>
        {cellData.type === 'punct-low' ? (
          <span className="absolute left-[10%] bottom-[10%]">{cellData.content}</span>
        ) : cellData.content}
      </div>
    );
  };

  // --- 원고지 컴포넌트 ---
  const Manuscript = ({ text, settings, name }) => {
    const cols = 20;
    const gridVal = parseInt(settings.gridType);
    const rows = gridVal / cols;
    const allCells = processToCells(text, cols);
    const pageCount = Math.max(1, Math.ceil(allCells.length / gridVal));
    
    return (
      <div className="flex flex-col items-center w-full">
        {Array.from({ length: pageCount }).map((_, p) => (
          <div key={p} className="mb-12 bg-white shadow-xl p-8 print:p-0 print:shadow-none" style={{ 
            fontFamily: settings.fontType, 
            width: gridVal === 200 ? '297mm' : '210mm',
            minHeight: gridVal === 200 ? '210mm' : '297mm'
          }}>
            <div className="flex justify-end mb-4 px-4">
              {p === 0 && name && <div className="border-b-2 border-black px-4 py-1 text-sm font-bold">성명: {name}</div>}
            </div>
            <div className="flex flex-col items-center">
              <div className="border-t border-l" style={{ borderColor: lineColor }}>
                {Array.from({ length: rows }).map((_, r) => (
                  <div key={r} className="flex">
                    {Array.from({ length: cols }).map((_, c) => {
                      const cellIndex = (p * gridVal) + (r * cols) + c;
                      return renderCell(allCells[cellIndex], `cell-${p}-${r}-${c}`);
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* 네비게이션 */}
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center no-print shadow-sm">
        <h1 className="text-xl font-black text-slate-800 flex items-center gap-2 italic">
          <FileText className="text-blue-600" /> K-WONGOJI
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400">LINE COLOR</span>
          {['#607d8b', '#ef4444', '#22c55e', '#000000'].map(c => (
            <button key={c} onClick={() => setLineColor(c)} className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c }} />
          ))}
        </div>
      </nav>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* 사이드바 */}
        <aside className="w-full lg:w-80 bg-white border-r p-6 no-print flex flex-col gap-6 shadow-sm overflow-y-auto">
          <div>
            <label className="block text-xs font-black text-slate-400 mb-2 uppercase">Student Name</label>
            <input 
              type="text" 
              value={studentName} 
              onChange={e => setStudentName(e.target.value)} 
              placeholder="이름을 입력하세요" 
              className="w-full p-3 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none transition-all font-bold"
            />
          </div>

          <div className="flex-1 flex flex-col">
            <label className="block text-xs font-black text-slate-400 mb-2 uppercase">Content ({content.length})</label>
            <textarea 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              placeholder="여기에 글을 작성하면 자동으로 원고지에 입력됩니다..." 
              className="flex-1 w-full p-4 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none resize-none transition-all text-lg leading-relaxed shadow-inner min-h-[300px]"
            />
          </div>

          <button 
            onClick={() => window.print()} 
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Printer size={20} /> 인쇄 및 PDF 저장
          </button>
        </aside>

        {/* 원고지 미리보기 */}
        <main className="flex-1 overflow-auto bg-slate-200 p-4 lg:p-12 flex justify-center">
          <Manuscript text={content} settings={{ gridType, viewMode, fontType, lineColor }} name={studentName} />
        </main>
      </div>

      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .shadow-xl { box-shadow: none !important; }
          main { padding: 0 !important; background: white !important; overflow: visible !important; }
          .wongoji-paper { margin: 0 !important; page-break-after: always; }
          @page { size: auto; margin: 15mm; }
        }
      `}</style>
    </div>
  );
};

export default App;
