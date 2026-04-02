import React, { useState, useCallback } from 'react';

const App = () => {
  const [content, setContent] = useState('');
  const [studentName, setStudentName] = useState('');
  const [gridType, setGridType] = useState('200'); 
  const [viewMode, setViewMode] = useState('traditional'); 
  const [lineColor, setLineColor] = useState('#607d8b');
  const [fontFamily, setFontFamily] = useState("'Noto Serif KR', serif");
  const [zoom, setZoom] = useState(0.8);

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
        fontFamily: fontFamily
    };
    if (!cellData || cellData.type === 'empty') return <div key={key} style={cellStyle}></div>;
    if (cellData.type === 'pair') {
        return (
            <div key={key} style={{...cellStyle, display: 'flex', fontWeight: 'bold', fontSize: '20px'}}>
                <div style={{width: '50%', display: 'flex', justifyContent: 'center'}}>{cellData.content[0]}</div>
                <div style={{width: '50%', display: 'flex', justifyContent: 'center'}}>{cellData.content[1]}</div>
            </div>
        );
    }
    return <div key={key} style={{...cellStyle, fontWeight: '500', color: '#0f172a'}}>{cellData.content}</div>;
  };

  return (
    <div className={`app-root ${gridType === '200' ? 'p-landscape' : 'p-portrait'}`} style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&family=Noto+Serif+KR:wght@400;700&display=swap');
        
        .manuscript-main::-webkit-scrollbar { width: 10px; height: 10px; }
        .manuscript-main::-webkit-scrollbar-track { background: #cbd5e1; }
        .manuscript-main::-webkit-scrollbar-thumb { background: #475569; border-radius: 6px; border: 2px solid #cbd5e1; }
        
        main { touch-action: pan-x pan-y; }

        .main-container { display: flex; flex: 1; flex-direction: row; overflow: hidden; }
        .sidebar { width: 350px; background-color: white; border-right: 1px solid #ddd; display: flex; flex-direction: column; height: 100%; z-index: 30; }

        @media (max-width: 768px) {
          .main-container { flex-direction: column; }
          .sidebar { width: 100%; height: 40%; border-right: none; border-bottom: 1px solid #ddd; }
        }

        @media print {
          .no-print { display: none !important; }
          body, html { margin: 0 !important; background: white !important; overflow: visible !important; }
          .app-root, .main-container, main { display: block !important; overflow: visible !important; height: auto !important; width: 100% !important; background: white !important; }
          div[style*="transform"] { transform: scale(1) !important; }
          .p-landscape { @page { size: auto; margin: 10mm; } }
          .p-portrait { @page { size: auto; margin: 10mm; } }
          .page-unit { page-break-after: always !important; display: flex !important; align-items: center; justify-content: center; height: 100vh; }
        }
      `}</style>

      <header className="no-print" style={{ backgroundColor: 'white', borderBottom: '1px solid #ddd', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
        <div style={{ fontWeight: '900', color: '#1e293b', fontFamily: "'Noto Sans KR', sans-serif" }}>원고지 연습기</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['#607d8b', '#ef4444', '#2d6a4f', '#000000'].map(c => (
            <button key={c} onClick={() => setLineColor(c)} style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px solid white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', cursor: 'pointer', backgroundColor: c }} />
          ))}
        </div>
      </header>

      <div className="main-container">
        <aside className="sidebar no-print">
          <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderBottom: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <select value={gridType} onChange={e => setGridType(e.target.value)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '11px', fontWeight: 'bold' }}>
                <option value="200">200자 (가로)</option>
                <option value="400">400자 (세로)</option>
              </select>
              <select value={viewMode} onChange={e => setViewMode(e.target.value)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '11px', fontWeight: 'bold' }}>
                <option value="traditional">일반형</option>
                <option value="feedback">피드백용</option>
                <option value="grid">격자형</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <select 
                value={fontFamily} 
                onChange={e => setFontFamily(e.target.value)} 
                style={{ padding: '6px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '11px', fontWeight: 'bold', width: '60%' }}
              >
                {/* 요청하신 명칭으로 수정 */}
                <option value="'Noto Serif KR', serif">NOTO SERIF(바탕)</option>
                <option value="'Noto Sans KR', sans-serif">NOTO SANS(고딕)</option>
              </select>
              <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="이름" style={{ flex: 1, padding: '6px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '11px', fontWeight: 'bold' }} />
            </div>
            <button onClick={() => window.print()} style={{ backgroundColor: '#0f172a', color: 'white', padding: '8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>인쇄 / PDF 저장</button>
          </div>
          <textarea 
            value={content} 
            onChange={e => setContent(e.target.value)} 
            style={{ flex: 1, padding: '12px', border: 'none', outline: 'none', resize: 'none', fontSize: '15px', lineHeight: '1.6', fontFamily }} 
            placeholder="내용을 입력하세요..." 
          />
        </aside>

        <main className="manuscript-main" style={{ flex: 1, overflow: 'auto', position: 'relative', backgroundColor: '#cbd5e1' }}>
          <div className="no-print" style={{ position: 'sticky', top: '10px', left: '10px', zIndex: 50, backgroundColor: 'rgba(255,255,255,0.9)', padding: '4px 10px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '6px', width: 'fit-content', border: '1px solid #ddd' }}>
            <span style={{ fontSize: '9px', fontWeight: '800', color: '#64748b' }}>ZOOM</span>
            <select value={zoom} onChange={e => setZoom(parseFloat(e.target.value))} style={{ border: 'none', backgroundColor: 'transparent', fontSize: '11px', fontWeight: '900', cursor: 'pointer' }}>
              {[0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0].map(v => (
                <option key={v} value={v}>{Math.round(v * 100)}%</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'inline-block', minWidth: '100%', padding: '20px' }}>
            <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', transition: 'transform 0.15s ease' }}>
                <ManuscriptContainer text={content} gridType={gridType} viewMode={viewMode} lineColor={lineColor} name={studentName} fontFamily={fontFamily} processToCells={processToCells} renderCell={renderCell} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const ManuscriptContainer = ({ text, gridType, viewMode, lineColor, name, fontFamily, processToCells, renderCell }) => {
    const cols = 20;
    const gridVal = parseInt(gridType);
    const rows = gridVal / cols;
    const allCells = processToCells(text, cols);
    const pageCount = Math.max(1, Math.ceil(allCells.length / gridVal));
    const rowGap = viewMode === 'feedback' ? '30px' : viewMode === 'traditional' ? '15px' : '0px';

    return (
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'white', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
        {Array.from({ length: pageCount }).map((_, p) => (
          <div key={p} className="page-unit" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px', width: 'max-content' }}>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'end', marginBottom: '25px' }}>
                {p === 0 && name && <div style={{ borderBottom: '2px solid black', padding: '0 25px 5px 25px', fontSize: '18px', fontWeight: 'bold', fontFamily }}>이름: {name}</div>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: rowGap }}>
                {Array.from({ length: rows }).map((_, r) => (
                  <div key={r} style={{ display: 'flex', borderRight: viewMode !== 'grid' ? `1.2px solid ${lineColor}` : 'none' }}>
                    {Array.from({ length: cols }).map((_, c) => renderCell(allCells[p * gridVal + r * cols + c], `c-${p}-${r}-${c}`, c === cols - 1))}
                  </div>
                ))}
              </div>
              <div className="no-print" style={{ marginTop: '30px', fontSize: '10px', color: '#cbd5e1', fontWeight: 'bold', letterSpacing: '2px' }}>PAGE {p + 1}</div>
              {p < pageCount - 1 && <div className="no-print" style={{ width: '100%', borderBottom: '2px dotted #eee', margin: '60px 0' }}></div>}
            </div>
          </div>
        ))}
      </div>
    );
};

export default App;
