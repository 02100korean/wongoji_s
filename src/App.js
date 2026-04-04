import React, { useState, useCallback, useEffect, useRef } from 'react';

// --- 1. 스타일 및 유틸리티 ---
const cardStyle = { 
  transition: 'all 0.3s ease', cursor: 'pointer', background: 'white', borderRadius: '24px', padding: '25px 15px', 
  textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', 
  alignItems: 'center', height: '100%', boxSizing: 'border-box', border: '1px solid #eee', position: 'relative', 
  textDecoration: 'none', color: 'inherit'
};

const cardTitleStyle = { fontSize: '18px', fontWeight: '800', marginBottom: '10px', color: '#1e293b' };
const cardDescStyle = { fontSize: '13px', color: '#64748b', lineHeight: '1.5', marginBottom: '15px', flex: 1 };
const cardButtonStyle = { padding: '10px 18px', borderRadius: '10px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: '700', cursor: 'pointer', fontSize: '12px' };

// 설정 박스 공통 스타일 (사이즈 축소 및 통일)
const selectStyle = { height: '34px', padding: '0 8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '11px', fontWeight: '700', backgroundColor: 'white', color: '#334155', width: '100%', boxSizing: 'border-box' };

const isSimplePunct = (c) => c === '.' || c === ',';
const isSingleQuote = (c) => /['‘’]/.test(c);
const isDoubleQuote = (c) => /["“”]/.test(c);

const WonjiIcon = () => (
    <div style={{ marginBottom: '15px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="60" height="50" viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="59" height="49" rx="3.5" fill="white" stroke="#6366f1" strokeWidth="1"/>
            <line x1="15" y1="0" x2="15" y2="50" stroke="#cbd5e1" strokeWidth="0.5"/><line x1="30" y1="0" x2="30" y2="50" stroke="#cbd5e1" strokeWidth="0.5"/><line x1="45" y1="0" x2="45" y2="50" stroke="#cbd5e1" strokeWidth="0.5"/><line x1="0" y1="16" x2="60" y2="16" stroke="#cbd5e1" strokeWidth="0.5"/><line x1="0" y1="33" x2="60" y2="33" stroke="#cbd5e1" strokeWidth="0.5"/>
        </svg>
        <span style={{ fontSize: '28px', position: 'absolute', bottom: '-5px', right: '0px', transform: 'rotate(-10deg)' }}>🖋️</span>
    </div>
);

// --- 2. 메인 홈 컴포넌트 ---
const Home = ({ onNavigate }) => {
  const bookUrl = "https://search.shopping.naver.com/book/catalog/57751554767?query=%ED%95%9C%20%EA%B6%8C%EC%9C%BC%EB%A1%9C%20%EC%99%84%EC%84%B1%ED%95%98%EB%8A%94%20TOPIK%201%20%EB%8B%A8%EC%96%B4";
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Noto Sans KR', sans-serif", color: '#1e293b' }}>
      <section style={{ padding: '80px 20px 140px', textAlign: 'center', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', color: 'white', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '60vh' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '20px', lineHeight: '1.2' }}>Master Korean <span style={{ fontWeight: '400' }}>with</span> <span style={{ color: '#facc15' }}>02100 Korean</span></h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>한국어를 원고지에 쓰면서 연습하고,<br/>한국어 필수 패턴을 내 것으로 만드세요.</p>
        <div className="scroll-indicator" style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', flexDirection: 'column', alignItems: 'center', display: 'none' }}>
          <span style={{ fontSize: '11px', fontWeight: '900', color: '#facc15', marginBottom: '8px', letterSpacing: '1px' }}>SCROLL DOWN</span>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#facc15"><path d="M12 21l-10-14h20l-10 14z" /></svg>
        </div>
      </section>
      <div className="cards-container" style={{ maxWidth: '1350px', margin: '-50px auto 80px', padding: '0 20px', display: 'grid', gap: '20px', position: 'relative', zIndex: 10 }}>
        <div className="card-item" onClick={() => onNavigate('editor')} style={cardStyle}><WonjiIcon /><h3 style={cardTitleStyle}>원고지 연습장</h3><p style={cardDescStyle}>원고지에 직접 쓰고 인쇄하거나 PDF로 저장하세요. 다양한 폰트로 연습할 수 있어요.</p><button style={cardButtonStyle}>바로 시작하기</button></div>
        <a href="https://buymeacoffee.com/02100korean/e/387205" target="_blank" rel="noreferrer" className="card-item" style={cardStyle}><div style={{ fontSize: '40px', marginBottom: '15px' }}>📚</div><h3 style={cardTitleStyle}>패턴 100 E-book</h3><p style={cardDescStyle}>한국어 초급 학습자에게 필수적인 한국어 문장 패턴 100가지를 담았습니다.</p><button style={{ ...cardButtonStyle, backgroundColor: '#10b981' }}>다운로드 하기</button></a>
        <a href="https://www.youtube.com/playlist?list=PLdNKi3Jkq1kmbPOQuexdPMYDxvrkfnWha" target="_blank" rel="noreferrer" className="card-item" style={cardStyle}><div style={{ fontSize: '40px', marginBottom: '15px' }}>📺</div><h3 style={cardTitleStyle}>패턴 100 영상</h3><p style={cardDescStyle}>전문 강사의 설명과 함께하는 생생한 패턴 학습. 지금 시청하세요.</p><button style={{ ...cardButtonStyle, backgroundColor: '#f59e0b' }}>강의 시청하기</button></a>
        <a href={bookUrl} target="_blank" rel="noreferrer" className="card-item" style={{...cardStyle, border: '2.5px solid #6366f1'}}><div style={{ backgroundColor: '#eff6ff', border: '2px dashed #6366f1', color: '#1e1b4b', width: '100%', padding: '12px 10px', borderRadius: '16px', marginBottom: '15px', lineHeight: '1.4', boxSizing: 'border-box' }}><div style={{ fontSize: '11px', fontWeight: '800', color: '#4338ca', marginBottom: '4px' }}>해외 배송 / 10권 이상 구입 문의</div><div style={{ fontSize: '14px', fontWeight: '900' }}>02100korean@gmail.com</div></div><div style={{ fontSize: '40px', marginBottom: '10px' }}>📖</div><h3 style={cardTitleStyle}>TOPIK 1 필수 단어장</h3><p style={cardDescStyle}>한 권으로 완성하는 TOPIK 1 단어! 연습 문제까지 포함된 완벽한 교재입니다.</p><button style={{ ...cardButtonStyle, width: '100%', backgroundColor: '#6366f1' }}>구입하러 가기</button></a>
      </div>
    </div>
  );
};

// --- 3. 메인 앱 컴포넌트 ---
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
      setZoom(Math.floor(Math.min(1.0, containerWidth / manuscriptWidth) * 10) / 10);
    }
  }, []);

  useEffect(() => {
    if (view === 'editor') {
      setTimeout(fitToScreen, 200);
      window.addEventListener('resize', fitToScreen);
    }
    return () => window.removeEventListener('resize', fitToScreen);
  }, [view, fitToScreen]);

  // 원고지 가공 엔진 (무한 루프 수정 및 인용구 정석)
  const processToCells = useCallback((text, cols) => {
    const cells = [{ type: 'empty' }]; 
    let i = 0, sQuoteCount = 0, dQuoteCount = 0;
    const limit = Math.min(text.length, 3000); 

    while (i < limit) {
      const char = text[i], next = text[i + 1] || "", next2 = text[i + 2] || "";
      const currentPos = cells.length % cols;
      let currentType = null;
      if (isSingleQuote(char)) { sQuoteCount++; currentType = sQuoteCount % 2 !== 0 ? 'open' : 'close'; }
      else if (isDoubleQuote(char)) { dQuoteCount++; currentType = dQuoteCount % 2 !== 0 ? 'open' : 'close'; }
      const isQuoteActive = (sQuoteCount % 2 !== 0) || (dQuoteCount % 2 !== 0);

      if (currentPos === 0 && isQuoteActive && currentType !== 'open') cells.push({ type: 'empty' });
      if (char === '.' && next === '.' && next2 === '.') { cells.push({ type: 'ellipsis' }); i += 3; continue; }
      if (char === '\n') {
        const remaining = cols - (cells.length % cols || cols);
        if (cells.length % cols !== 0) { for (let r = 0; r < remaining; r++) cells.push({ type: 'empty' }); }
        cells.push({ type: 'empty' }); i++; continue;
      }
      if (char === ' ') { if (cells.length % cols === 0) { i++; continue; } cells.push({ type: 'default', content: '' }); i++; continue; }
      const isDigit = (c) => /[0-9]/.test(c);
      if (isDigit(char) && isSimplePunct(next) && isDigit(next2)) { cells.push({ type: 'pair', content: [char, next] }); i += 2; continue; }
      if (next !== "" && ( (/[0-9]/.test(char) && /[0-9]/.test(next)) || (/[a-zA-Z]/.test(char) && /[a-zA-Z]/.test(next)) )) { cells.push({ type: 'pair', content: [char, next] }); i += 2; continue; }
      const isEndCol = cells.length % cols === cols - 1;
      const nextIsClosingQuote = isSingleQuote(next) ? (sQuoteCount + 1) % 2 === 0 : isDoubleQuote(next) ? (dQuoteCount + 1) % 2 === 0 : false;
      if (isEndCol && isSimplePunct(next)) { cells.push({ type: 'combined_end', content: char, punct: next }); i += 2; } 
      else if (isSimplePunct(char) && nextIsClosingQuote) {
        cells.push({ type: 'punct_quote_final', punct: char, quote: next });
        if (isSingleQuote(next)) sQuoteCount++; else dQuoteCount++; i += 2;
      } else {
        if (currentType === 'open') cells.push({ type: 'quote_open', content: char });
        else if (currentType === 'close') cells.push({ type: 'quote_close', content: char });
        else if (isSimplePunct(char)) cells.push({ type: 'punct_alone', content: char });
        else cells.push({ type: 'default', content: char });
        i++;
      }
    }
    return cells;
  }, []);

  const renderCell = useCallback((cellData, key, isLastCol) => {
    const isGridMode = viewMode === 'grid';
    let baseFontSize = 22;
    if (fontFamily.includes('Gamja') || fontFamily.includes('Poor')) baseFontSize = 23.5;
    if (fontFamily.includes('Hi Melody')) baseFontSize = 24.675; 
    if (fontFamily.includes('Nanum Pen')) baseFontSize = 25.85; 

    const isShiftDown = ["'Hi Melody', cursive", "'Gamja Flower', cursive", "'Jua', sans-serif"].includes(fontFamily);
    const isMoreShiftDown = ["'Poor Story', cursive", "'Nanum Pen Script', cursive"].includes(fontFamily);

    const cellStyle = { 
        width: '38px', height: '38px', borderLeft: `1.2px solid ${lineColor}`, borderTop: `1.2px solid ${lineColor}`,
        borderBottom: `1.2px solid ${lineColor}`, borderRight: (isLastCol || isGridMode) ? `1.2px solid ${lineColor}` : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: `${baseFontSize}px`, backgroundColor: 'white', boxSizing: 'border-box', 
        fontFamily: fontFamily, fontWeight: 'normal', paddingTop: isShiftDown ? '2.5px' : isMoreShiftDown ? '4px' : '0px', position: 'relative'
    };

    if (!cellData || cellData.type === 'empty') return <div key={key} style={cellStyle}></div>;
    const Punct = ({ char, x, y, size = baseFontSize }) => (
        <span style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: '500', fontSize: `${size}px`, position: 'absolute', left: `${x}%`, bottom: `${y}%`, transform: 'translate(-50%, 50%)' }}>{char}</span>
    );
    if (cellData.type === 'ellipsis') return <div key={key} style={cellStyle}><Punct char="." x={35} y={65} /><Punct char="." x={50} y={65} /><Punct char="." x={65} y={65} /></div>;
    if (cellData.type === 'combined_end') return <div key={key} style={cellStyle}><span style={{zIndex:2}}>{cellData.content}</span><Punct char={cellData.punct} x={80} y={30} /></div>;
    if (cellData.type === 'punct_quote_final') return <div key={key} style={cellStyle}><Punct char={cellData.punct} x={30} y={40} /><Punct char={cellData.quote} x={90} y={70} /></div>;
    if (cellData.type === 'pair') return <div key={key} style={{...cellStyle, display: 'flex', fontSize: '20px'}}><div style={{width: '50%', display: 'flex', justifyContent: 'center'}}>{cellData.content[0]}</div><div style={{width: '50%', display: 'flex', justifyContent: 'center'}}>{cellData.content[1]}</div></div>;
    const char = cellData.content;
    if (cellData.type === 'punct_alone') return <div key={key} style={cellStyle}><Punct char={char} x={30} y={40} /></div>;
    if (cellData.type === 'quote_open') return <div key={key} style={cellStyle}><Punct char={char} x={80} y={70} /></div>;
    if (cellData.type === 'quote_close') return <div key={key} style={cellStyle}><Punct char={char} x={20} y={70} /></div>;
    return <div key={key} style={{...cellStyle, color: '#0f172a'}}><span>{cellData.content}</span></div>;
  }, [lineColor, viewMode, fontFamily]);

  return (
    <div className="app-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jua&family=Gamja+Flower&family=Hi+Melody&family=Poor+Story&family=Gowun+Dodum&family=Nanum+Pen+Script&family=Noto+Sans+KR:wght@400;500;700;900&family=Noto+Serif+KR:wght@400;700&family=Nanum+Barun+Pen:wght@400;700&display=swap');
        body { margin: 0; padding: 0; overflow-x: hidden; }
        
        /* [가로/세로 레이아웃 고정 구조] */
        .editor-container { display: flex; height: 100vh; background-color: #e2e8f0; overflow: hidden; }
        
        /* 1. 가로 모드 (좌측: 입력/설정, 우측: 원고지) */
        .sidebar { width: 340px; background: white; border-right: 1px solid #ddd; display: flex; flex-direction: column; flex-shrink: 0; }
        .main-preview { flex: 1; overflow: auto; background-color: #cbd5e1; padding: 20px; display: flex; flex-direction: column; alignItems: center; }

        /* 2. 세로 모드 (상단: 입력/설정 50%, 하단: 원고지 50%) */
        @media (orientation: portrait) {
          .editor-container { flex-direction: column !important; }
          .sidebar { width: 100% !important; height: 50vh !important; border-right: none; border-bottom: 2px solid #ddd; }
          .main-preview { width: 100% !important; height: 50vh !important; padding: 10px; }
        }

        .sidebar-settings { padding: 10px; background: #f8fafc; border-bottom: 1px solid #eee; display: flex; flex-direction: column; gap: 6px; }
        .sidebar-input { flex: 1; padding: 15px; border: none; outline: none; resize: none; font-size: 15px; line-height: 1.6; }

        /* 인쇄 설정 */
        @media print {
          @page { size: auto; margin: 20mm !important; }
          .no-print { display: none !important; }
          body, html { background: white !important; margin: 0 !important; }
          .page-unit { height: 100vh !important; display: flex !important; justify-content: center !important; align-items: center !important; page-break-after: always !important; }
          .page-box { 
            box-shadow: none !important; padding: 40px 60px !important; 
            max-width: calc(100vw - 40mm) !important; max-height: calc(100vh - 40mm) !important;
            width: auto !important; height: auto !important; transform: scale(1) !important; zoom: 0.9; 
          }
        }
      `}</style>

      {view === 'home' ? (
        <Home onNavigate={setView} />
      ) : (
        <div className="editor-container">
          <header className="no-print" style={{ backgroundColor: 'white', borderBottom: '1px solid #ddd', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100, height: '50px', position: 'fixed', top: 0, left: 0, right: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><button onClick={() => setView('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>🏠</button><div style={{ fontWeight: '900', color: '#1e293b', fontSize: '14px' }}>원고지 연습장</div></div>
            <div style={{ display: 'flex', gap: '8px' }}>{['#607d8b', '#ef4444', '#2d6a4f', '#000000'].map(c => (<button key={c} onClick={() => setLineColor(c)} style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid white', backgroundColor: c }} />))}</div>
          </header>

          <div style={{ display: 'flex', flex: 1, width: '100%', paddingTop: '50px' }} className="editor-layout">
            <aside className="sidebar no-print">
              <div className="sidebar-settings">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <select value={gridType} onChange={e => setGridType(e.target.value)} style={selectStyle}><option value="200">200자 (가로)</option><option value="400">400자 (세로)</option></select>
                  <select value={viewMode} onChange={e => setViewMode(e.target.value)} style={selectStyle}><option value="traditional">일반형</option><option value="feedback">피드백용</option><option value="grid">격자형</option></select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <select value={fontFamily} onChange={e => setFontFamily(e.target.value)} style={selectStyle}>
                    <option value="'Noto Serif KR', serif">바탕체</option><option value="'Noto Sans KR', sans-serif">고딕체</option><option value="'Jua', sans-serif">주아체</option><option value="'Gamja Flower', cursive">감자꽃체</option><option value="'Hi Melody', cursive">하이멜로디</option><option value="'Poor Story', cursive">푸른밤체</option><option value="'Nanum Pen Script', cursive">나눔펜글씨</option>
                  </select>
                  <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="이름 입력" style={selectStyle} />
                </div>
                <button onClick={() => window.print()} style={{ height: '34px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>인쇄 / PDF 저장</button>
              </div>
              <textarea value={content} onChange={e => setContent(e.target.value.slice(0, 3000))} className="sidebar-input" style={{ fontFamily }} placeholder="내용을 입력하세요 (최대 3,000자)..." />
            </aside>

            <main ref={mainRef} className="main-preview">
              <div className="no-print" style={{ marginBottom: '8px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '4px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '10px', fontWeight: '900', color: '#6366f1' }}>ZOOM</span>
                <select value={zoom} onChange={e => setZoom(parseFloat(e.target.value))} style={{ border: 'none', backgroundColor: 'transparent', fontSize: '12px', fontWeight: '900' }}>{[0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0].map(v => <option key={v} value={v}>{Math.round(v * 100)}%</option>)}</select>
                <button onClick={fitToScreen} style={{ border: 'none', background: '#6366f1', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '4px' }}>맞춤</button>
              </div>
              {/* 원고지 중앙 정렬을 보장하는 래퍼 */}
              <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', width: 'fit-content' }}>
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
    <div className="manuscript-print-root">
      {Array.from({ length: pageCount }).map((_, p) => (
        <div key={p} className="page-unit">
          <div style={{ backgroundColor: 'white', padding: '40px 60px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', marginBottom: '40px', width: 'max-content' }} className="page-box">
            <div className="name-tag" style={{ width: '100%', display: 'flex', justifyContent: 'end', marginBottom: '25px', height: '35px', alignItems: 'end' }}>
              {p === 0 && name && name.trim() !== '' ? (<div style={{ borderBottom: '2px solid black', padding: '0 25px 5px 25px', fontSize: '18px', fontWeight: 'bold', fontFamily, color: 'black' }}>이름: {name}</div>) : (<div style={{ height: '35px' }}></div>)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: rowGap }}>
              {Array.from({ length: rows }).map((_, r) => (
                <div key={r} style={{ display: 'flex', borderRight: viewMode !== 'grid' ? `1.2px solid ${lineColor}` : 'none' }}>
                  {Array.from({ length: cols }).map((_, c) => renderCell(allCells[p * gridVal + r * cols + c], `c-${p}-${r}-${c}`, c === cols - 1))}
                </div>
              ))}
            </div>
            <div className="no-print" style={{ marginTop: '20px', textAlign: 'center', fontSize: '10px', color: '#94a3b8', fontWeight: 'bold' }}>PAGE {p + 1}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
