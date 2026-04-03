import React, { useState, useCallback, useEffect, useRef } from 'react';

// --- 1. 스타일 객체 정의 ---
const cardStyle = { 
  transition: 'all 0.3s ease', 
  cursor: 'pointer', 
  background: 'white', 
  borderRadius: '24px', 
  padding: '40px', 
  textAlign: 'center', 
  boxShadow: '0 10px 30px rgba(0,0,0,0.05)', 
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center', 
  height: '100%', 
  boxSizing: 'border-box', 
  border: '1px solid #eee' 
};

const cardTitleStyle = { fontSize: '22px', fontWeight: '800', marginBottom: '15px', color: '#1e293b' };
const cardDescStyle = { fontSize: '15px', color: '#64748b', lineHeight: '1.6', marginBottom: '25px', flex: 1 };
const cardButtonStyle = { padding: '12px 24px', borderRadius: '12px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: '700', cursor: 'pointer' };
const selectStyle = { height: '40px', padding: '0 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px', fontWeight: '700' };

// --- 2. 메인 홈 컴포넌트 (Home) ---
const Home = ({ onNavigate }) => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Noto Sans KR', sans-serif", color: '#1e293b' }}>
      <section style={{
        padding: '100px 20px 120px', 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
        color: 'white',
        position: 'relative'
      }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '20px', lineHeight: '1.2' }}>
          Master Korean Writing
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
          가장 세련된 방법으로 한국어 쓰기를 연습하고,<br/>필수 패턴을 내 것으로 만드세요.
        </p>
        
        {/* 세로 모드(Portrait)에서만 보이는 노란색 굵은 화살표 */}
        <div className="scroll-indicator" style={{ 
          position: 'absolute', 
          bottom: '25px', 
          left: '50%', 
          transform: 'translateX(-50%)',
          flexDirection: 'column', 
          alignItems: 'center' 
        }}>
          <span style={{ fontSize: '12px', fontWeight: '900', color: '#facc15', marginBottom: '5px', letterSpacing: '1px' }}>SCROLL DOWN</span>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 10L12 15L17 10" stroke="#facc15" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </section>

      <div style={{ maxWidth: '1200px', margin: '-50px auto 80px', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', position: 'relative', zIndex: 10 }}>
        <div className="card-item" onClick={() => onNavigate('editor')} style={cardStyle}>
          <div style={{ fontSize: '50px', marginBottom: '20px' }}>✍️</div>
          <h3 style={cardTitleStyle}>원고지 연습장</h3>
          <p style={cardDescStyle}>온라인 원고지에 직접 쓰고 PDF로 소장하세요. 화면 크기에 딱 맞는 스마트 자동 줌 기능이 제공됩니다.</p>
          <button style={cardButtonStyle}>바로 시작하기</button>
        </div>

        <a href="https://buymeacoffee.com/02100korean/e/387205" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
          <div className="card-item" style={cardStyle}>
            <div style={{ fontSize: '50px', marginBottom: '20px' }}>📚</div>
            <h3 style={cardTitleStyle}>한국어 패턴 100 E-book</h3>
            <p style={cardDescStyle}>외국인이 가장 많이 틀리는 한국어 문장 패턴 100가지를 한 권에 담았습니다.</p>
            <button style={{ ...cardButtonStyle, backgroundColor: '#10b981' }}>다운로드 하기</button>
          </div>
        </a>

        <a href="https://www.youtube.com/playlist?list=PLdNKi3Jkq1kmbPOQuexdPMYDxvrkfnWha" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
          <div className="card-item" style={cardStyle}>
            <div style={{ fontSize: '50px', marginBottom: '20px' }}>📺</div>
            <h3 style={cardTitleStyle}>한국어 패턴 100 영상</h3>
            <p style={cardDescStyle}>전문 강사의 설명과 함께하는 생생한 패턴 학습. 지금 바로 시청하세요.</p>
            <button style={{ ...cardButtonStyle, backgroundColor: '#f59e0b' }}>강의 시청하기</button>
          </div>
        </a>
      </div>
    </div>
  );
};

// --- 3. 메인 앱 컴포넌트 (App) ---
export default function App() {
  const [view, setView] = useState('home');
  const [content, setContent] = useState('');
  const [studentName, setStudentName] = useState('');
  const [gridType, setGridType] = useState('200'); 
  const [viewMode, setViewMode] = useState('traditional'); 
  const [lineColor, setLineColor] = useState('#607d8b');
  const [fontFamily, setFontFamily] = useState("'Noto Serif KR', serif");
  const [zoom, setZoom] = useState(1.0);
  
  const mainRef = useRef(null);

  const fitToScreen = useCallback(() => {
    if (mainRef.current) {
      const containerWidth = mainRef.current.clientWidth - 40;
      const manuscriptWidth = 880; 
      const newZoom = Math.min(1.0, containerWidth / manuscriptWidth);
      setZoom(Math.floor(newZoom * 10) / 10);
    }
  }, []);

  useEffect(() => {
    if (view === 'editor') {
      setTimeout(fitToScreen, 200);
      window.addEventListener('resize', fitToScreen);
    }
    return () => window.removeEventListener('resize', fitToScreen);
  }, [view, fitToScreen]);

  const processToCells = useCallback((text, cols) => {
    const cells = [{ type: 'empty' }]; 
    let i = 0;
    while (i < text.length) {
      const char = text[i];
      const nextChar = text[i + 1] || null;
      if (char === '\n') {
        const currentLinePos = cells.length % cols;
        const remaining = cols - (currentLinePos || cols);
        if (currentLinePos !== 0) { for (let r = 0; r < remaining; r++) cells.push({ type: 'empty' }); }
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
      if (canPair) { cells.push({ type: 'pair', content: [char, nextChar] }); i += 2; } 
      else { cells.push({ type: 'default', content: char }); i++; }
    }
    return cells;
  }, []);

  const renderCell = useCallback((cellData, key, isLastCol) => {
    const isGridMode = viewMode === 'grid';
    const cellStyle = { 
        width: '38px', height: '38px', borderLeft: `1.2px solid ${lineColor}`, borderTop: `1.2px solid ${lineColor}`,
        borderBottom: `1.2px solid ${lineColor}`, borderRight: (isLastCol || isGridMode) ? `1.2px solid ${lineColor}` : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', backgroundColor: 'white', boxSizing: 'border-box', fontFamily: fontFamily
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
  }, [lineColor, viewMode, fontFamily]);

  return (
    <div className={`app-root ${gridType === '200' ? 'p-landscape' : 'p-portrait'}`}>
      <style>{`
        /* 구글 폰트에서 가장 안정적인 폰트들만 로드 */
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700;900&family=Noto+Serif+KR:wght@400;700&family=Nanum+Barun+Pen:wght@400;700&display=swap');
        
        /* 빙그레 싸만코체 (사용자가 선호하는 귀여운 폰트) */
        @font-face { 
          font-family: 'BinggraeSamanco-Bold'; 
          src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_20-10@1.0/BinggraeSamanco-Bold.woff') format('woff'); 
          font-weight: normal; 
          font-style: normal; 
        }

        body { margin: 0; padding: 0; overflow-x: hidden; }
        
        /* 세로 화면(Portrait)에서만 화살표 표시 */
        .scroll-indicator { display: none; animation: bounce 2s infinite; }
        @media (orientation: portrait) { 
          .scroll-indicator { display: flex; } 
        }
        
        @keyframes bounce { 
          0%, 20%, 50%, 80%, 100% {transform: translate(-50%, 0);} 
          40% {transform: translate(-50%, -12px);} 
          60% {transform: translate(-50%, -6px);} 
        }

        .card-item:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); border-color: #6366f1 !important; }
        .manuscript-main::-webkit-scrollbar { width: 10px; height: 10px; }
        .manuscript-main::-webkit-scrollbar-track { background: #cbd5e1; }
        .manuscript-main::-webkit-scrollbar-thumb { background: #475569; border-radius: 6px; border: 2px solid #cbd5e1; }
        @media print { .no-print { display: none !important; } }
      `}</style>

      {view === 'home' ? (
        <Home onNavigate={setView} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
          <header className="no-print" style={{ backgroundColor: 'white', borderBottom: '1px solid #ddd', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button onClick={() => setView('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>🏠</button>
                <div style={{ fontWeight: '900', color: '#1e293b', fontFamily: "'Noto Sans KR', sans-serif", fontSize: '15px' }}>원고지 연습장</div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['#607d8b', '#ef4444', '#2d6a4f', '#000000'].map(c => (
                <button key={c} onClick={() => setLineColor(c)} style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px solid white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', cursor: 'pointer', backgroundColor: c }} />
              ))}
            </div>
          </header>

          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            <aside className="sidebar no-print" style={{ width: '350px', backgroundColor: 'white', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
              <div style={{ padding: '15px', backgroundColor: '#f8fafc', borderBottom: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <select value={gridType} onChange={e => setGridType(e.target.value)} style={selectStyle}>
                    <option value="200">200자 (가로)</option>
                    <option value="400">400자 (세로)</option>
                  </select>
                  <select value={viewMode} onChange={e => setViewMode(e.target.value)} style={selectStyle}>
                    <option value="traditional">일반형</option>
                    <option value="feedback">피드백용</option>
                    <option value="grid">격자형</option>
                  </select>
                  <select value={fontFamily} onChange={e => setFontFamily(e.target.value)} style={{ ...selectStyle, gridColumn: 'span 2' }}>
                    <option value="'Noto Serif KR', serif">NOTO SERIF (바탕)</option>
                    <option value="'Noto Sans KR', sans-serif">NOTO SANS (고딕)</option>
                    <option value="'BinggraeSamanco-Bold'">Binggrae Samanco (동글귀염)</option>
                    <option value="'Nanum Barun Pen', cursive">Nanum Barun Pen (깔끔한펜글씨)</option>
                  </select>
                  <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="이름 입력" style={{ ...selectStyle, gridColumn: 'span 2', textAlign: 'center' }} />
                </div>
                <button onClick={() => window.print()} style={{ backgroundColor: '#6366f1', color: 'white', padding: '10px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>인쇄 / PDF 저장</button>
              </div>
              <textarea value={content} onChange={e => setContent(e.target.value)} style={{ flex: 1, padding: '15px', border: 'none', outline: 'none', resize: 'none', fontSize: '15px', lineHeight: '1.6', fontFamily }} placeholder="여기에 원고지 내용을 입력하세요..." />
            </aside>

            <main ref={mainRef} className="manuscript-main" style={{ flex: 1, overflow: 'auto', backgroundColor: '#cbd5e1', padding: '20px', position: 'relative' }}>
              <div className="no-print" style={{ marginBottom: '15px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '4px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', width: 'fit-content', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '10px', fontWeight: '900', color: '#6366f1' }}>ZOOM</span>
                <select value={zoom} onChange={e => setZoom(parseFloat(e.target.value))} style={{ border: 'none', backgroundColor: 'transparent', fontSize: '12px', fontWeight: '900', cursor: 'pointer' }}>
                  {[0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2].map(v => <option key={v} value={v}>{Math.round(v * 100)}%</option>)}
                </select>
                <button onClick={fitToScreen} style={{ border: 'none', background: '#6366f1', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>화면맞춤</button>
              </div>
              <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', transition: 'transform 0.2s ease-out' }}>
                <ManuscriptContainer text={content} gridType={gridType} viewMode={viewMode} lineColor={lineColor} name={studentName} fontFamily={fontFamily} processToCells={processToCells} renderCell={renderCell} />
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
}

const ManuscriptContainer = ({ text, gridType, viewMode, lineColor, name, fontFamily, processToCells, renderCell }) => {
  const cols = 20; const gridVal = parseInt(gridType); const rows = gridVal / cols;
  const allCells = processToCells(text, cols);
  const pageCount = Math.max(1, Math.ceil(allCells.length / gridVal));
  const rowGap = viewMode === 'feedback' ? '30px' : viewMode === 'traditional' ? '15px' : '0px';

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'white', boxShadow: '0 15px 35px rgba(0,0,0,0.1)' }}>
      {Array.from({ length: pageCount }).map((_, p) => (
        <div key={p} className="page-unit" style={{ backgroundColor: 'white', padding: '40px 60px', width: 'max-content' }}>
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
          <div className="no-print" style={{ marginTop: '20px', textAlign: 'center', fontSize: '10px', color: '#cbd5e1', fontWeight: 'bold', letterSpacing: '2px' }}>PAGE {p + 1}</div>
          {p < pageCount - 1 && <div className="no-print" style={{ width: '100%', borderBottom: '1px dashed #ddd', margin: '20px 0' }}></div>}
        </div>
      ))}
    </div>
  );
};
