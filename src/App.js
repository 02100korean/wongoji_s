import React, { useState, useCallback } from 'react';

// --- 메인 홈 컴포넌트 (Home) ---
const Home = ({ onNavigate }) => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: "'Noto Sans KR', sans-serif",
      color: '#1e293b'
    }}>
      {/* Hero Section */}
      <section style={{
        padding: '80px 20px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
        color: 'white',
        marginBottom: '50px'
      }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '20px' }}>Master Korean Writing</h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
          가장 세련된 방법으로 한국어 쓰기를 연습하고, 필수 패턴을 익혀보세요.
        </p>
      </section>

      {/* Main Cards Container */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px 80px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px'
      }}>
        
        {/* Card 1: Manuscript Tool */}
        <div className="card" onClick={() => onNavigate('editor')} style={cardStyle}>
          <div style={{ fontSize: '50px', marginBottom: '20px' }}>✍️</div>
          <h3 style={cardTitleStyle}>원고지 연습 도구</h3>
          <p style={cardDescStyle}>격식 있는 한국어 글쓰기의 시작. 온라인 원고지에 직접 쓰고 PDF로 소장하세요.</p>
          <button style={cardButtonStyle}>바로 시작하기</button>
        </div>

        {/* Card 2: E-book Link */}
        <a href="https://buymeacoffee.com/02100korean/e/387205" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="card" style={cardStyle}>
            <div style={{ fontSize: '50px', marginBottom: '20px' }}>📚</div>
            <h3 style={cardTitleStyle}>한국어 패턴 100 E-book</h3>
            <p style={cardDescStyle}>외국인이 가장 많이 틀리는 한국어 문장 패턴 100가지를 한 권에 담았습니다.</p>
            <button style={{ ...cardButtonStyle, backgroundColor: '#10b981' }}>다운로드 하기</button>
          </div>
        </a>

        {/* Card 3: Video Link */}
        <a href="https://www.youtube.com/playlist?list=PLdNKi3Jkq1kmbPOQuexdPMYDxvrkfnWha" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="card" style={cardStyle}>
            <div style={{ fontSize: '50px', marginBottom: '20px' }}>📺</div>
            <h3 style={cardTitleStyle}>한국어 패턴 100 영상</h3>
            <p style={cardDescStyle}>전문 강사의 설명과 함께하는 생생한 패턴 학습. 지금 바로 시청하세요.</p>
            <button style={{ ...cardButtonStyle, backgroundColor: '#f59e0b' }}>강의 시청하기</button>
          </div>
        </a>
      </div>

      <style>{`
        .card { transition: transform 0.3s ease, box-shadow 0.3s ease; cursor: pointer; }
        .card:hover { transform: translateY(-10px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
      `}</style>
    </div>
  );
};

const cardStyle = { backgroundColor: 'white', padding: '40px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', boxSizing: 'border-box' };
const cardTitleStyle = { fontSize: '22px', fontWeight: '800', marginBottom: '15px' };
const cardDescStyle = { fontSize: '15px', color: '#64748b', lineHeight: '1.6', marginBottom: '25px', flex: 1 };
const cardButtonStyle = { padding: '12px 24px', borderRadius: '12px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: '700', cursor: 'pointer' };

// --- 메인 앱 (App) ---
const App = () => {
  const [view, setView] = useState('home');
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

  const renderCell = (cellData, key, isLastCol) => {
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
  };

  if (view === 'home') return <Home onNavigate={setView} />;

  return (
    <div className={`app-root ${gridType === '200' ? 'p-landscape' : 'p-portrait'}`} style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700;900&family=Noto+Serif+KR:wght@400;700&family=Nanum+Pen+Script&family=Single+Day&display=swap');
        
        /* 외부 폰트 추가 로드 */
        @font-face { font-family: 'GangwonEduSaekbeol'; src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2201-2@1.0/GangwonEduSaekbeol-OTF.woff2') format('woff2'); font-weight: normal; font-style: normal; }
        @font-face { font-family: 'CookieRun'; src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2105@1.1/CookieRun-Regular.woff2') format('woff2'); font-weight: normal; font-style: normal; }
        @font-face { font-family: 'Cafe24Anemone'; src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2212@1.0/Cafe24Anemone.woff2') format('woff2'); font-weight: normal; font-style: normal; }

        .manuscript-main::-webkit-scrollbar { width: 10px; height: 10px; }
        .manuscript-main::-webkit-scrollbar-track { background: #cbd5e1; }
        .manuscript-main::-webkit-scrollbar-thumb { background: #475569; border-radius: 6px; border: 2px solid #cbd5e1; }
        .main-container { display: flex; flex: 1; flex-direction: row; overflow: hidden; }
        .sidebar { width: 350px; background-color: white; border-right: 1px solid #ddd; display: flex; flex-direction: column; height: 100%; z-index: 30; }
        .control-item { width: 100%; height: 40px; padding: 0 10px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 11px; font-weight: 700; color: #334155; background-color: white; box-sizing: border-box; outline: none; }
        
        @media (max-width: 768px) { .main-container { flex-direction: column; } .sidebar { width: 100%; height: 42%; border-right: none; border-bottom: 1px solid #ddd; } }
        @media print {
          .no-print { display: none !important; }
          body, html { margin: 0 !important; background: white !important; }
          .page-unit { page-break-after: always !important; display: flex !important; height: 100vh; justify-content: center; align-items: center; }
        }
      `}</style>

      <header className="no-print" style={{ backgroundColor: 'white', borderBottom: '1px solid #ddd', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={() => setView('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>🏠</button>
            <div style={{ fontWeight: '900', color: '#1e293b', fontFamily: "'Noto Sans KR', sans-serif", fontSize: '15px' }}>원고지 연습기</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['#607d8b', '#ef4444', '#2d6a4f', '#000000'].map(c => (
            <button key={c} onClick={() => setLineColor(c)} style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px solid white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', cursor: 'pointer', backgroundColor: c }} />
          ))}
        </div>
      </header>

      <div className="main-container">
        <aside className="sidebar no-print">
          <div style={{ padding: '15px', backgroundColor: '#f8fafc', borderBottom: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <select value={gridType} onChange={e => setGridType(e.target.value)} className="control-item">
                <option value="200">200자 (가로)</option>
                <option value="400">400자 (세로)</option>
              </select>
              <select value={viewMode} onChange={e => setViewMode(e.target.value)} className="control-item">
                <option value="traditional">일반형</option>
                <option value="feedback">피드백용</option>
                <option value="grid">격자형</option>
              </select>
              <select value={fontFamily} onChange={e => setFontFamily(e.target.value)} className="control-item">
                <option value="'Noto Serif KR', serif">NOTO SERIF (바탕)</option>
                <option value="'Noto Sans KR', sans-serif">NOTO SANS (고딕)</option>
                <option value="'GangwonEduSaekbeol'">GangwonEdu Saekbeol (강원교육새싹체)</option>
                <option value="'CookieRun'">CookieRun (쿠키런체)</option>
                <option value="'Nanum Pen Script', cursive">Nanum Pen Script (나눔펜글씨)</option>
                <option value="'Single Day', cursive">Single Day (싱글데이)</option>
                <option value="'Cafe24Anemone'">Cafe24 Anemone (카페24 아네모네)</option>
              </select>
              <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="이름 입력" className="control-item" style={{ textAlign: 'center' }} />
            </div>
            <button onClick={() => window.print()} style={{ backgroundColor: '#0f172a', color: 'white', padding: '10px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>인쇄 / PDF 저장</button>
          </div>
          <textarea value={content} onChange={e => setContent(e.target.value)} style={{ flex: 1, padding: '15px', border: 'none', outline: 'none', resize: 'none', fontSize: '15px', lineHeight: '1.6', fontFamily }} placeholder="여기에 원고지 내용을 입력하세요..." />
        </aside>

        <main className="manuscript-main" style={{ flex: 1, overflow: 'auto', position: 'relative', backgroundColor: '#cbd5e1' }}>
          <div className="no-print" style={{ position: 'sticky', top: '10px', left: '10px', zIndex: 50, backgroundColor: 'rgba(255,255,255,0.9)', padding: '4px 10px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '6px', width: 'fit-content' }}>
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
    const cols = 20; const gridVal = parseInt(gridType); const rows = gridVal / cols;
    const allCells = processToCells(text, cols);
    const pageCount = Math.max(1, Math.ceil(allCells.length / gridVal));
    const rowGap = viewMode === 'feedback' ? '30px' : viewMode === 'traditional' ? '15px' : '0px';

    return (
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'white', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
        {Array.from({ length: pageCount }).map((_, p) => (
          <div key={p} className="page-unit" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 60px', width: 'max-content' }}>
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
              <div className="no-print" style={{ marginTop: '20px', fontSize: '10px', color: '#cbd5e1', fontWeight: 'bold', letterSpacing: '2px' }}>PAGE {p + 1}</div>
              {p < pageCount - 1 && ( <div className="no-print" style={{ width: '100%', borderBottom: '2px dotted #eee', margin: '15px 0' }}></div> )}
            </div>
          </div>
        ))}
      </div>
    );
};

export default App;
