import React, { useState, useCallback, useEffect, useRef } from 'react';

// --- 1. 스타일 객체 정의 ---
const cardStyle = { 
  transition: 'all 0.3s ease', 
  cursor: 'pointer', 
  background: 'white', 
  borderRadius: '24px', 
  padding: '25px 15px', 
  textAlign: 'center', 
  boxShadow: '0 10px 30px rgba(0,0,0,0.05)', 
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center', 
  height: '100%', 
  boxSizing: 'border-box', 
  border: '1px solid #eee',
  position: 'relative',
  textDecoration: 'none',
  color: 'inherit'
};

const cardTitleStyle = { fontSize: '18px', fontWeight: '800', marginBottom: '10px', color: '#1e293b' };
const cardDescStyle = { fontSize: '13px', color: '#64748b', lineHeight: '1.5', marginBottom: '15px', flex: 1 };
const cardButtonStyle = { padding: '10px 18px', borderRadius: '10px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: '700', cursor: 'pointer', fontSize: '12px' };
const selectStyle = { height: '42px', padding: '0 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: '700', backgroundColor: 'white', color: '#334155' };

// --- 2. 메인 홈 컴포넌트 (Home) ---
const Home = ({ onNavigate }) => {
  const bookUrl = "https://search.shopping.naver.com/book/catalog/57751554767?query=%ED%95%9C%20%EA%B6%8C%EC%9C%BC%EB%A1%9C%20%EC%99%84%EC%84%B1%ED%95%98%EB%8A%94%20TOPIK%201%20%EB%8B%A8%EC%96%B4&NaPm=ct%3Dmnjopjs0%7Cci%3D6a138955cd6dd285c04829e367fb31e064b9a774%7Ctr%3Dboksl%7Csn%3D95694%7Chk%3D2fc6442c1e849be84ad7de7e2cbeeabf6ff9c236";

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Noto Sans KR', sans-serif", color: '#1e293b' }}>
      <section style={{
        padding: '80px 20px 140px', 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
        color: 'white',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '60vh'
      }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '20px', lineHeight: '1.2' }}>
          Master Korean Writing
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
          가장 세련된 방법으로 한국어 쓰기를 연습하고,<br/>필수 패턴을 내 것으로 만드세요.
        </p>
        
        {/* 세로 화면 전용: 노란색 삼각형 스크롤 가이드 */}
        <div className="scroll-indicator" style={{ 
          position: 'absolute', 
          bottom: '30px', 
          left: '50%', 
          transform: 'translateX(-50%)',
          flexDirection: 'column', 
          alignItems: 'center',
          display: 'none'
        }}>
          <span style={{ fontSize: '11px', fontWeight: '900', color: '#facc15', marginBottom: '8px', letterSpacing: '1px' }}>SCROLL DOWN</span>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#facc15" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21l-10-14h20l-10 14z" />
          </svg>
        </div>
      </section>

      <div className="cards-container" style={{ 
        maxWidth: '1350px', 
        margin: '-50px auto 80px', 
        padding: '0 20px', 
        display: 'grid', 
        gap: '20px', 
        position: 'relative', 
        zIndex: 10 
      }}>
        {/* 카드 1 */}
        <div className="card-item" onClick={() => onNavigate('editor')} style={cardStyle}>
          <div style={{ fontSize: '40px', marginBottom: '15px' }}>✍️</div>
          <h3 style={cardTitleStyle}>원고지 연습장</h3>
          <p style={cardDescStyle}>온라인 원고지에 직접 쓰고 PDF로 저장하세요. 화면 맞춤 기능이 제공됩니다.</p>
          <button style={cardButtonStyle}>바로 시작하기</button>
        </div>

        {/* 카드 2 */}
        <a href="https://buymeacoffee.com/02100korean/e/387205" target="_blank" rel="noreferrer" style={cardStyle}>
          <div style={{ fontSize: '40px', marginBottom: '15px' }}>📚</div>
          <h3 style={cardTitleStyle}>패턴 100 E-book</h3>
          <p style={cardDescStyle}>외국인이 가장 많이 틀리는 한국어 문장 패턴 100가지를 담았습니다.</p>
          <button style={{ ...cardButtonStyle, backgroundColor: '#10b981' }}>다운로드 하기</button>
        </a>

        {/* 카드 3 */}
        <a href="https://www.youtube.com/playlist?list=PLdNKi3Jkq1kmbPOQuexdPMYDxvrkfnWha" target="_blank" rel="noreferrer" style={cardStyle}>
          <div style={{ fontSize: '40px', marginBottom: '15px' }}>📺</div>
          <h3 style={cardTitleStyle}>패턴 100 영상</h3>
          <p style={cardDescStyle}>전문 강사의 설명과 함께하는 생생한 패턴 학습. 지금 시청하세요.</p>
          <button style={{ ...cardButtonStyle, backgroundColor: '#f59e0b' }}>강의 시청하기</button>
        </a>

        {/* 카드 4: TOPIK 1 단어장 */}
        <div onClick={() => window.open(bookUrl, '_blank')} className="card-item" style={{...cardStyle, border: '2.5px solid #6366f1'}}>
            {/* 이메일 발송 박스 (버블링 차단 적용) */}
            <div 
              onClick={(e) => {
                e.stopPropagation(); // 카드 전체 클릭 이벤트가 실행되지 않도록 차단
                window.location.href = "mailto:02100korean@gmail.com";
              }}
              style={{ 
                backgroundColor: '#eff6ff', 
                border: '2px dashed #6366f1', 
                color: '#1e1b4b', 
                width: '100%',
                padding: '12px 10px', 
                borderRadius: '16px', 
                marginBottom: '15px', 
                lineHeight: '1.4',
                boxSizing: 'border-box'
            }}>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#4338ca', marginBottom: '4px' }}>해외 배송 / 10권 이상 구입 문의</div>
                <div style={{ fontSize: '14px', fontWeight: '900', textDecoration: 'underline' }}>02100korean@gmail.com</div>
            </div>
            
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📖</div>
            <h3 style={cardTitleStyle}>TOPIK 1 필수 단어장</h3>
            <p style={cardDescStyle}>
                한 권으로 완성하는 TOPIK 1 단어! 연습 문제까지 포함된 완벽한 교재입니다.
            </p>
            <button style={{ ...cardButtonStyle, width: '100%', backgroundColor: '#6366f1' }}>구입하러 가기</button>
        </div>
      </div>
    </div>
  );
};

// --- 3. 원고지 컨테이너 컴포넌트 ---
const ManuscriptContainer = ({ text, gridType, viewMode, lineColor, name, fontFamily, processToCells, renderCell }) => {
  const cols = 20; const gridVal = parseInt(gridType); const rows = gridVal / cols;
  const allCells = processToCells(text, cols);
  const pageCount = Math.max(1, Math.ceil(allCells.length / gridVal));
  const rowGap = viewMode === 'feedback' ? '30px' : viewMode === 'traditional' ? '15px' : '0px';

  return (
    <div className="manuscript-print-root" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {Array.from({ length: pageCount }).map((_, p) => (
        <div key={p} className="page-unit">
          <div style={{ backgroundColor: 'white', padding: '40px 60px', width: 'max-content', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', marginBottom: '40px' }} className="page-box">
            <div style={{ width: '100%', display: 'flex', justifyContent: 'end', marginBottom: '25px', height: '35px', alignItems: 'end' }}>
              {p === 0 && name && name.trim() !== '' ? (
                <div style={{ borderBottom: '2px solid black', padding: '0 25px 5px 25px', fontSize: '18px', fontWeight: 'bold', fontFamily, color: 'black' }}>
                  이름: {name}
                </div>
              ) : (
                <div style={{ height: '35px' }}></div>
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
    const largeFonts = ["'Gamja Flower', cursive", "'Hi Melody', cursive", "'Poor Story', cursive", "'Nanum Pen Script', cursive"];
    const baseFontSize = largeFonts.includes(fontFamily) ? 23.5 : 22;
    const shiftDownFonts = ["'Hi Melody', cursive", "'Poor Story', cursive", "'Nanum Pen Script', cursive"];
    
    const cellStyle = { 
        width: '38px', height: '38px', borderLeft: `1.2px solid ${lineColor}`, borderTop: `1.2px solid ${lineColor}`,
        borderBottom: `1.2px solid ${lineColor}`, borderRight: (isLastCol || isGridMode) ? `1.2px solid ${lineColor}` : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: `${baseFontSize}px`, backgroundColor: 'white', boxSizing: 'border-box', 
        fontFamily: fontFamily, fontWeight: 'normal', paddingTop: shiftDownFonts.includes(fontFamily) ? '4px' : '0px'
    };
    if (!cellData || cellData.type === 'empty') return <div key={key} style={cellStyle}></div>;
    if (cellData.type === 'pair') {
        return (
            <div key={key} style={{...cellStyle, display: 'flex', fontSize: '20px'}}>
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
        @media (min-width: 1000px) { .cards-container { grid-template-columns: repeat(4, 1fr) !important; } }

        @media (orientation: portrait) { .scroll-indicator { display: flex !important; } }
        .scroll-indicator { animation: bounceTriangle 2s infinite; }
        @keyframes bounceTriangle { 0%, 20%, 50%, 80%, 100% {transform: translate(-50%, 0);} 40% {transform: translate(-50%, -12px);} 60% {transform: translate(-50%, -6px);} }
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
