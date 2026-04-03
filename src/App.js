import React, { useState, useCallback, useEffect, useRef } from 'react';

// --- 1. 스타일 객체 정의 ---
const cardStyle = { 
  transition: 'all 0.3s ease', 
  cursor: 'pointer', 
  background: 'white', 
  borderRadius: '24px', 
  padding: '30px 20px', 
  textAlign: 'center', 
  boxShadow: '0 10px 30px rgba(0,0,0,0.05)', 
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center', 
  height: '100%', 
  boxSizing: 'border-box', 
  border: '1px solid #eee' 
};

const cardTitleStyle = { fontSize: '20px', fontWeight: '800', marginBottom: '12px', color: '#1e293b' };
const cardDescStyle = { fontSize: '14px', color: '#64748b', lineHeight: '1.5', marginBottom: '20px', flex: 1 };
const cardButtonStyle = { padding: '10px 20px', borderRadius: '10px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: '700', cursor: 'pointer', fontSize: '13px' };
const selectStyle = { height: '42px', padding: '0 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: '700', backgroundColor: 'white', color: '#334155' };

// --- 2. 메인 홈 컴포넌트 (Home) ---
const Home = ({ onNavigate }) => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Noto Sans KR', sans-serif", color: '#1e293b' }}>
      <section style={{
        padding: '80px 20px 120px', 
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
        
        <div className="scroll-indicator" style={{ 
          position: 'absolute', 
          bottom: '25px', 
          left: '50%', 
          transform: 'translateX(-50%)',
          flexDirection: 'column', 
          alignItems: 'center' 
        }}>
          <span style={{ fontSize: '11px', fontWeight: '900', color: '#facc15', marginBottom: '5px', letterSpacing: '1px' }}>SCROLL DOWN</span>
          <svg width="35" height="35" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 10L12 15L17 10" stroke="#facc15" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </section>

      <div className="cards-container" style={{ 
        maxWidth: '1100px', 
        margin: '-50px auto 80px', 
        padding: '0 20px', 
        display: 'grid', 
        gap: '25px', 
        position: 'relative', 
        zIndex: 10 
      }}>
        <div className="card-item" onClick={() => onNavigate('editor')} style={cardStyle}>
          <div style={{ fontSize: '45px', marginBottom: '15px' }}>✍️</div>
          <h3 style={cardTitleStyle}>원고지 연습장</h3>
          <p style={cardDescStyle}>온라인 원고지에 직접 쓰고 PDF로 저장하세요. 화면 맞춤 기능이 제공됩니다.</p>
          <button style={cardButtonStyle}>바로 시작하기</button>
        </div>

        <a href="https://buymeacoffee.com/02100korean/e/387205" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
          <div className="card-item" style={cardStyle}>
            <div style={{ fontSize: '45px', marginBottom: '15px' }}>📚</div>
            <h3 style={cardTitleStyle}>패턴 100 E-book</h3>
            <p style={cardDescStyle}>외국인이 가장 많이 틀리는 한국어 문장 패턴 100가지를 담았습니다.</p>
            <button style={{ ...cardButtonStyle, backgroundColor: '#10b981' }}>다운로드 하기</button>
          </div>
        </a>

        <a href="https://www.youtube.com/playlist?list=PLdNKi3Jkq1kmbPOQuexdPMYDxvrkfnWha" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
          <div className="card-item" style={cardStyle}>
            <div style={{ fontSize: '45px', marginBottom: '15px' }}>📺</div>
            <h3 style={cardTitleStyle}>패턴 100 영상</h3>
            <p style={cardDescStyle}>전문 강사의 설명과 함께하는 생생한 패턴 학습. 지금 시청하세요.</p>
            <button style={{ ...cardButtonStyle, backgroundColor: '#f59e0b' }}>강의 시청하기</button>
          </div>
        </a>
      </div>
    </div>
  );
};

// --- 3. 원고지 컨테이너 컴포넌트 ---
const ManuscriptContainer = ({ text, gridType, viewMode, lineColor, name, fontFamily, processToCells, renderCell }) => {
  const cols = 20; 
  const gridVal = parseInt(gridType); 
  const rows = gridVal / cols;
  const allCells = processToCells(text, cols);
  const pageCount = Math.max(1, Math.ceil(allCells.length / gridVal));
  const rowGap = viewMode === 'feedback' ? '30px' : viewMode === 'traditional' ? '15px' : '0px';

  return (
    <div className="manuscript-print-root" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {Array.from({ length: pageCount }).map((_, p) => (
        <div key={p} className="page-unit">
          <div style={{ backgroundColor: 'white', padding: '40px 60px', width: 'max-content', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', marginBottom: '40px' }} className="page-box">
            <div style={{ width: '100%', display: 'flex', justifyContent: 'end', marginBottom: '25px', height: '35px', alignItems: 'end' }}>
              {p === 0 ? (
                <div style={{ borderBottom: name ? '2px solid black' : '2px solid #ccc', padding: '0 25px 5px 25px', fontSize: '18px', fontWeight: 'bold', fontFamily, color: name ? 'black' : '#ccc' }}>
                  이름: {name || ''}
                </div>
              ) : (
                <div style={{ height: '100%', width: '100%' }}></div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: rowGap }}>
              {Array.from({ length: rows }).map((_, r) => (
                <div key={r} style={{ display: 'flex', borderRight: viewMode !== 'grid' ? `1.2px solid ${lineColor}` : 'none' }}>
                  {Array.from({ length: cols }).map((_, c) => renderCell(allCells[p * gridVal + r * cols + c], `c-${p}-${r}-${c}`, c === cols - 1))}
                </div>
              ))}
            </div>
            <div className="no-print" style={{ marginTop: '20px', textAlign: 'center', fontSize: '10px', color: '#cbd5e1', fontWeight: 'bold', letterSpacing: '2px' }}>PAGE {p + 1}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- 4. 메인 앱 컴포넌트 ---
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
    
    // 1. 크기 보정 (이전 요청사항)
    const largeFonts = [
      "'Gamja Flower', cursive",
      "'Hi Melody', cursive",
      "'Poor Story', cursive",
      "'Nanum Pen Script', cursive"
    ];
    const isLarge = largeFonts.includes(fontFamily);
    const baseFontSize = isLarge ? 23.5 : 22;

    // 2. 위치 보정 (아래로 조금 내림)
    const shiftDownFonts = [
      "'Hi Melody', cursive",
      "'Poor Story', cursive",
      "'Nanum Pen Script', cursive"
    ];
    const isShifted = shiftDownFonts.includes(fontFamily);

    const cellStyle = { 
        width: '38px', height: '38px', borderLeft: `1.2px solid ${lineColor}`, borderTop: `1.2px solid ${lineColor}`,
        borderBottom: `1.2px solid ${lineColor}`, borderRight: (isLastCol || isGridMode) ? `1.2px solid ${lineColor}` : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: `${baseFontSize}px`, backgroundColor: 'white', boxSizing: 'border-box', 
        fontFamily: fontFamily, fontWeight: 'normal',
        paddingTop: isShifted ? '4px' : '0px' // 위쪽 패딩을 주어 글자를 아래로 밀어냄
    };

    if (!cellData || cellData.type === 'empty') return <div key={key} style={cellStyle}></div>;
    
    // 글자가 아래로 내려가 보이도록 내부 div에도 정렬값 적용
    const contentInnerStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%'
    };

    if (cellData.type === 'pair') {
        return (
            <div key={key} style={{...cellStyle, display: 'flex', fontSize: `${baseFontSize - 2}px`}}>
                <div style={{width: '50%', display: 'flex', justifyContent: 'center'}}>{cellData.content[0]}</div>
                <div style={{width: '50%', display: 'flex', justifyContent: 'center'}}>{cellData.content[1]}</div>
            </div>
        );
    }
    return <div key={key} style={{...cellStyle, color: '#0f172a'}}>{cellData.content}</div>;
  }, [lineColor, viewMode, fontFamily]);

  return (
    <div className="app-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jua&family=Gamja+Flower&family=Hi+Melody&family=Poor+Story&family=Gowun+Dodum&family=Nanum+Pen+Script&family=Noto+Sans+KR:wght@400;700;900&family=Noto+Serif+KR:wght@400;700&family=Nanum+Barun+Pen:wght@400;700&display=swap');
        
        body { margin: 0; padding: 0; overflow-x: hidden; }
        .cards-container { grid-template-columns: 1fr; }
        @media (min-width: 900px) { .cards-container { grid-template-columns: repeat(3, 1fr) !important; } }
        .scroll-indicator { display: none; animation: bounce 2s infinite; }
        @media (orientation: portrait) { .scroll-indicator { display: flex; } }
        @keyframes bounce { 0%, 20%, 50%, 80%, 100% {transform: translate(-50%, 0);} 40% {transform: translate(-50%, -10px);} 60% {transform: translate(-50%, -5px);} }
        .card-item:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); border-color: #6366f1 !important; }
        
        @media print {
          .no-print { display: none !important; }
          body, html { margin: 0 !important; padding: 0 !important; background: white !important; overflow: visible !important; }
          .app-root, .manuscript-main, .main-container { display: block !important; background: white !important; height: auto !important; overflow: visible !important; }
          .manuscript-print-root { display: block !important; }
          .page-unit { display: block !important; page-break-after: always !important; background: white !important; margin: 0 !important; padding: 0 !important; height: auto !important; }
          .page-box { box-shadow: none !important; margin: 0 auto !important; padding: 40px 60px !important; }
          div[style*="transform"] { transform: scale(1) !important; } 
          @page { size: auto; margin: 10mm; }
        }
      `}</style>

      {view === 'home' ? (
        <Home onNavigate={setView} />
      ) : (
        <div className="main-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
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
            <aside className="sidebar no-print" style={{ width: '340px', backgroundColor: 'white', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
              <div style={{ padding: '15px', backgroundColor: '#f8fafc', borderBottom: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <select value={gridType} onChange={e => setGridType(e.target.value)} style={selectStyle}>
                    <option value="200">200자 (가로)</option>
                    <option value="400">400자 (세로)</option>
                  </select>
                  <select value={viewMode} onChange={e => setViewMode(e.target.value)} style={selectStyle}>
                    <option value="traditional">일반형</option>
                    <option value="feedback">피드백용</option>
                    <option value="grid">격자형</option>
                  </select>
                </div>
                <select value={fontFamily} onChange={e => setFontFamily(e.target.value)} style={selectStyle}>
                  <option value="'Noto Serif KR', serif">Noto Serif KR (바탕체)</option>
                  <option value="'Noto Sans KR', sans-serif">Noto Sans KR (고딕체)</option>
                  <option value="'Jua', sans-serif">Jua (주아체)</option>
                  <option value="'Gamja Flower', cursive">Gamja Flower (감자꽃체)</option>
                  <option value="'Hi Melody', cursive">Hi Melody (하이멜로디체)</option>
                  <option value="'Poor Story', cursive">Poor Story (푸른밤체)</option>
                  <option value="'Gowun Dodum', sans-serif">Gowun Dodum (고운돋움체)</option>
                  <option value="'Nanum Pen Script', cursive">Nanum Pen Script (나눔펜글씨)</option>
                  <option value="'Nanum Barun Pen', cursive">Nanum Barun Pen (나눔바른펜)</option>
                </select>
                <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="이름 입력" style={{ ...selectStyle, textAlign: 'center' }} />
                <button onClick={() => window.print()} style={{ backgroundColor: '#6366f1', color: 'white', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '5px' }}>인쇄 / PDF 저장</button>
              </div>
              <textarea value={content} onChange={e => setContent(e.target.value)} style={{ flex: 1, padding: '15px', border: 'none', outline: 'none', resize: 'none', fontSize: '15px', lineHeight: '1.6', fontFamily }} placeholder="내용을 입력하세요..." />
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
                <ManuscriptContainer 
                  text={content} 
                  gridType={gridType} 
                  viewMode={viewMode} 
                  lineColor={lineColor} 
                  name={studentName} 
                  fontFamily={fontFamily} 
                  processToCells={processToCells} 
                  renderCell={renderCell} 
                />
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
