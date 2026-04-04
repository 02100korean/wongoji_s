import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';

// --- [1. 스타일 및 상수: 디자인 완벽 유지] ---
const cardStyle = { 
  transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease', 
  cursor: 'pointer', background: 'white', borderRadius: '24px', padding: '25px 15px', 
  textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', 
  alignItems: 'center', height: '100%', boxSizing: 'border-box', border: '1px solid #eee', position: 'relative', 
  textDecoration: 'none', color: 'inherit'
};
const cardTitleStyle = { fontSize: '18px', fontWeight: '800', marginBottom: '10px', color: '#1e293b' };
const cardDescStyle = { fontSize: '13px', color: '#64748b', lineHeight: '1.5', marginBottom: '15px', flex: 1 };
const cardButtonStyle = { padding: '10px 18px', borderRadius: '10px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: '700', cursor: 'pointer', fontSize: '12px' };
const selectStyle = { height: '34px', padding: '0 8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '11px', fontWeight: '700', backgroundColor: 'white', color: '#334155', width: '100%', boxSizing: 'border-box' };

const isSimplePunct = (c) => c === '.' || c === ',';
const isSingleQuote = (c) => /['‘’]/.test(c);
const isDoubleQuote = (c) => /["“”]/.test(c);
const isDigit = (c) => /[0-9]/.test(c);
const isAlpha = (c) => /[a-zA-Z]/.test(c);

const WonjiIcon = () => (
    <div style={{ marginBottom: '15px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '50px' }}>
        <svg width="60" height="50" viewBox="0 0 60 50" fill="none">
            <rect x="0.5" y="0.5" width="59" height="49" rx="3.5" fill="white" stroke="#6366f1" strokeWidth="1"/>
            <path d="M15 0V50M30 0V50M45 0V50M0 16H60M0 33H60" stroke="#cbd5e1" strokeWidth="0.5"/>
        </svg>
        <span style={{ fontSize: '28px', position: 'absolute', bottom: '-5px', right: '-5px', transform: 'rotate(-10deg)' }}>🖋️</span>
    </div>
);

// --- [2. 홈 화면: 스크롤 + 인디케이터 + 애니메이션 완벽 복구] ---
const Home = ({ onNavigate }) => {
  return (
    <div className="home-root">
      <style>{`
        .home-root { min-height: 100vh; background-color: #f8fafc; font-family: 'Noto Sans KR', sans-serif; color: #1e293b; overflow-y: auto; scroll-behavior: smooth; }
        .hero-section { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 0 20px; text-align: center; background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: white; position: relative; }
        .cards-grid { max-width: 1200px; margin: -60px auto 100px; padding: 0 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 25px; }
        .card-item:hover { transform: translateY(-15px); box-shadow: 0 25px 50px rgba(99, 102, 241, 0.2); border-color: #6366f1; }
        .fade-in { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        
        /* 스크롤 인디케이터 애니메이션 */
        .scroll-indicator { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 8px; animation: bounce 2s infinite; cursor: pointer; }
        .scroll-text { font-size: 11px; font-weight: 900; color: #facc15; letter-spacing: 2px; }
        @keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); } 40% { transform: translateX(-50%) translateY(-10px); } 60% { transform: translateX(-50%) translateY(-5px); } }
      `}</style>
      
      <section className="hero-section">
        <h1 className="fade-in" style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '20px', lineHeight: 1.2 }}>Master Korean <br/> <span style={{ fontWeight: '400' }}>with</span> <span style={{ color: '#facc15' }}>02100 Korean</span></h1>
        <p className="fade-in" style={{ fontSize: '1.2rem', opacity: 0.9, animationDelay: '0.2s' }}>정교한 한국어 원고지 연습 시스템</p>
        <div className="scroll-indicator" onClick={() => window.scrollTo({top: window.innerHeight - 100, behavior: 'smooth'})}>
          <span className="scroll-text">SCROLL DOWN</span>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="#facc15"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>
        </div>
      </section>

      <div className="cards-grid">
        <div className="card-item fade-in" onClick={() => onNavigate('editor')} style={{...cardStyle, animationDelay: '0.4s'}}><WonjiIcon /><h3 style={cardTitleStyle}>원고지 연습장</h3><p style={cardDescStyle}>정석 규칙이 적용된 쓰기 연습.</p><button style={cardButtonStyle}>시작하기</button></div>
        <a href="https://buymeacoffee.com/02100korean/e/387205" target="_blank" rel="noreferrer" className="card-item fade-in" style={{...cardStyle, animationDelay: '0.5s'}}><div style={{fontSize:'40px'}}>📚</div><h3 style={cardTitleStyle}>패턴 100 E-book</h3><p style={cardDescStyle}>초급 필수 패턴 100가지.</p><button style={{...cardButtonStyle, backgroundColor:'#10b981'}}>다운로드</button></a>
        <a href="https://www.youtube.com/playlist?list=PLdNKi3Jkq1kmbPOQuexdPMYDxvrkfnWha" target="_blank" rel="noreferrer" className="card-item fade-in" style={{...cardStyle, animationDelay: '0.6s'}}><div style={{fontSize:'40px'}}>📺</div><h3 style={cardTitleStyle}>패턴 100 영상</h3><p style={cardDescStyle}>생생한 패턴 학습 강의.</p><button style={{...cardButtonStyle, backgroundColor:'#f59e0b'}}>시청하기</button></a>
        <a href="https://search.shopping.naver.com/book/catalog/57751554767" target="_blank" rel="noreferrer" className="card-item fade-in" style={{...cardStyle, border:'2.5px solid #6366f1', animationDelay: '0.7s'}}><div style={{backgroundColor:'#eff6ff', padding:'10px', borderRadius:'15px', marginBottom:'10px', fontSize:'11px', fontWeight:900}}>02100korean@gmail.com</div><h3 style={cardTitleStyle}>TOPIK 1 단어장</h3><p style={cardDescStyle}>한 권으로 끝내는 필수 어휘.</p><button style={{...cardButtonStyle, width:'100%'}}>구입하기</button></a>
      </div>
    </div>
  );
};

// --- [3. 메인 앱 컴포넌트] ---
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
      setZoom(Math.floor(Math.min(1.0, containerWidth / 880) * 10) / 10);
    }
  }, []);

  useEffect(() => {
    if (view === 'editor') { setTimeout(fitToScreen, 200); window.addEventListener('resize', fitToScreen); }
  }, [view, fitToScreen]);

  const allCells = useMemo(() => {
    const cols = 20; const cells = [{ type: 'empty' }];
    let i = 0, sCount = 0, dCount = 0;
    const limit = Math.min(content.length, 3000);
    while (i < limit) {
      const char = content[i], next = content[i+1] || "", next2 = content[i+2] || "";
      const currentPos = cells.length % cols;
      let qType = null;
      if (isSingleQuote(char)) { sCount++; qType = sCount % 2 !== 0 ? 'open' : 'close'; }
      else if (isDoubleQuote(char)) { dCount++; qType = dCount % 2 !== 0 ? 'open' : 'close'; }
      const isQuoteActive = (sCount % 2 !== 0) || (dCount % 2 !== 0);
      if (currentPos === 0 && isQuoteActive && qType !== 'open') cells.push({ type: 'empty' });
      if (char === '.' && next === '.' && next2 === '.') { cells.push({ type: 'ellipsis' }); i += 3; continue; }
      if (char === '\n') {
        const rem = cols - (cells.length % cols || cols);
        if (cells.length % cols !== 0) { for(let r=0; r<rem; r++) cells.push({ type: 'empty' }); }
        cells.push({ type: 'empty' }); i++; continue;
      }
      if (char === ' ') { if (cells.length % cols === 0) { i++; continue; } cells.push({ type: 'default', content: '' }); i++; continue; }
      if (isDigit(char) && isSimplePunct(next) && isDigit(next2)) { cells.push({ type: 'pair', content: [char, next] }); i += 2; continue; }
      if (isSimplePunct(char) && isDigit(next)) { cells.push({ type: 'pair', content: [char, next] }); i += 2; continue; }
      if (next !== "" && ((isDigit(char) && isDigit(next)) || (isAlpha(char) && isAlpha(next)))) { cells.push({ type: 'pair', content: [char, next] }); i += 2; continue; }
      const isEnd = cells.length % cols === cols - 1;
      const nextIsClosing = isSingleQuote(next) ? (sCount+1)%2===0 : (isDoubleQuote(next) ? (dCount+1)%2===0 : false);
      if (isEnd && isSimplePunct(next)) { cells.push({ type: 'combined_end', content: char, punct: next }); i += 2; }
      else if (isSimplePunct(char) && nextIsClosing) {
        cells.push({ type: 'punct_quote_final', punct: char, quote: next });
        if (isSingleQuote(next)) sCount++; else dCount++; i += 2;
      } else {
        if (qType === 'open') cells.push({ type: 'quote_open', content: char });
        else if (qType === 'close') cells.push({ type: 'quote_close', content: char });
        else if (isSimplePunct(char)) cells.push({ type: 'punct_alone', content: char });
        else cells.push({ type: 'default', content: char });
        i++;
      }
    }
    return cells;
  }, [content]);

  const renderCell = useCallback((cellData, key, isLastCol) => {
    const isGrid = viewMode === 'grid';
    let baseSize = 22;
    if (fontFamily.includes('Gamja') || fontFamily.includes('Poor')) baseSize = 23.5;
    if (fontFamily.includes('Hi Melody')) baseSize = 24.675; 
    if (fontFamily.includes('Nanum Pen')) baseSize = 25.85; 
    const isShiftDown = ["'Hi Melody', cursive", "'Gamja Flower', cursive", "'Jua', sans-serif"].includes(fontFamily);
    const isMoreShift = ["'Poor Story', cursive", "'Nanum Pen Script', cursive"].includes(fontFamily);
    const cellStyle = { 
        width: '38px', height: '38px', borderLeft: `1.2px solid ${lineColor}`, borderTop: `1.2px solid ${lineColor}`,
        borderBottom: `1.2px solid ${lineColor}`, borderRight: (isLastCol || isGrid) ? `1.2px solid ${lineColor}` : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: `${baseSize}px`, backgroundColor: 'white', boxSizing: 'border-box', 
        fontFamily: fontFamily, fontWeight: 'normal', paddingTop: isShiftDown ? '2.5px' : isMoreShift ? '4px' : '0px', position: 'relative'
    };
    if (!cellData || cellData.type === 'empty') return <div key={key} style={cellStyle}></div>;
    const Punct = ({ char, x, y, size = baseSize }) => (
        <span style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: '500', fontSize: `${size}px`, position: 'absolute', left: `${x}%`, bottom: `${y}%`, transform: 'translate(-50%, 50%)' }}>{char}</span>
    );
    if (cellData.type === 'ellipsis') return <div key={key} style={cellStyle}><Punct char="." x={35} y={65} /><Punct char="." x={50} y={65} /><Punct char="." x={65} y={65} /></div>;
    if (cellData.type === 'combined_end') return <div key={key} style={cellStyle}><span style={{zIndex:2}}>{cellData.content}</span><Punct char={cellData.punct} x={85} y={40} /></div>;
    if (cellData.type === 'punct_quote_final') return <div key={key} style={cellStyle}><Punct char={cellData.punct} x={30} y={40} /><Punct char={cellData.quote} x={90} y={70} /></div>;
    if (cellData.type === 'pair') return <div key={key} style={{...cellStyle, display: 'flex', fontSize: '20px'}}><div style={{width: '50%', display: 'flex', justifyContent: 'center'}}>{cellData.content[0]}</div><div style={{width: '50%', display: 'flex', justifyContent: 'center'}}>{cellData.content[1]}</div></div>;
    if (cellData.type === 'punct_alone') return <div key={key} style={cellStyle}><Punct char={cellData.content} x={30} y={40} /></div>;
    if (cellData.type === 'quote_open') return <div key={key} style={cellStyle}><Punct char={cellData.content} x={75} y={65} /></div>;
    if (cellData.type === 'quote_close') return <div key={key} style={cellStyle}><Punct char={cellData.content} x={25} y={65} /></div>;
    return <div key={key} style={{...cellStyle, color: '#0f172a'}}><span>{cellData.content}</span></div>;
  }, [lineColor, viewMode, fontFamily]);

  const gridVal = parseInt(gridType);
  const rows = gridVal / 20;
  const pageCount = Math.max(1, Math.ceil(allCells.length / gridVal));

  return (
    <div className="app-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jua&family=Gamja+Flower&family=Hi+Melody&family=Poor+Story&family=Gowun+Dodum&family=Nanum+Pen+Script&family=Noto+Sans+KR:wght@400;500;700;900&family=Noto+Serif+KR:wght@400;700&family=Nanum+Barun+Pen:wght@400;700&display=swap');
        
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
        
        .editor-container { display: flex; width: 100vw; height: 100vh; background-color: #e2e8f0; position: relative; overflow: hidden; }
        
        /* 가로: 좌 340px, 우 원고지 */
        .sidebar { width: 340px; height: 100%; background: white; border-right: 1px solid #ddd; display: flex; flex-direction: column; flex-shrink: 0; z-index: 20; }
        .main-preview { flex: 1; height: 100%; overflow: auto; background-color: #cbd5e1; padding: 20px; display: flex; flex-direction: column; align-items: flex-start; }

        /* [세로 모드 복구 핵심] */
        @media (orientation: portrait) {
          .editor-container { flex-direction: column !important; overflow: hidden !important; }
          .sidebar { width: 100% !important; height: 50% !important; border-right: none; border-bottom: 2px solid #ddd; flex-shrink: 0; overflow-y: auto !important; }
          .main-preview { width: 100% !important; height: 50% !important; padding: 10px; align-items: center; overflow-y: auto !important; }
          .sidebar-input { min-height: 150px !important; }
        }

        .sidebar-settings { padding: 10px; background: #f8fafc; border-bottom: 1px solid #eee; display: flex; flex-direction: column; gap: 6px; }
        .sidebar-input { flex: 1; padding: 15px; border: none; outline: none; resize: none; font-size: 15px; line-height: 1.6; width: 100%; box-sizing: border-box; }

        /* [인쇄 설정: 20mm 여백 + 비율 유지 완벽] */
        @media print {
          @page { size: auto; margin: 0; }
          .no-print, header, .sidebar, .scroll-indicator { display: none !important; }
          body, html { background: white !important; overflow: visible !important; height: auto !important; width: auto !important; }
          .editor-container { display: block !important; height: auto !important; width: auto !important; }
          .main-preview { display: block !important; padding: 0 !important; margin: 0 !important; background: white !important; width: 100% !important; height: auto !important; overflow: visible !important; }
          .page-unit { 
            height: 100vh !important; width: 100vw !important; 
            display: flex !important; justify-content: flex-start !important; align-items: flex-start !important; 
            padding: 20mm !important; box-sizing: border-box !important;
            page-break-after: always !important; break-after: page !important;
          }
          .page-box { box-shadow: none !important; margin: 0 !important; padding: 0 !important; width: auto !important; height: auto !important; display: flex !important; flex-direction: column !important; }
        }
      `}</style>

      {view === 'home' ? <Home onNavigate={setView} /> : (
        <div className="editor-container">
          <header className="no-print" style={{ backgroundColor: 'white', borderBottom: '1px solid #ddd', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100, height: '50px', position: 'fixed', top: 0, left: 0, right: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><button onClick={() => setView('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>🏠</button><div style={{ fontWeight: '900', color: '#1e293b', fontSize: '14px' }}>원고지 연습장</div></div>
            <div style={{ display: 'flex', gap: '8px' }}>{['#607d8b', '#ef4444', '#2d6a4f', '#000000'].map(c => (<button key={c} onClick={() => setLineColor(c)} style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid white', backgroundColor: c }} />))}</div>
          </header>

          <div style={{ display: 'flex', flex: 1, width: '100%', paddingTop: '50px' }}>
            <aside className="sidebar no-print">
              <div className="sidebar-settings">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <select value={gridType} onChange={e => setGridType(e.target.value)} style={selectStyle}><option value="200">200자 (가로)</option><option value="400">400자 (세로)</option></select>
                  <select value={viewMode} onChange={e => setViewMode(e.target.value)} style={selectStyle}><option value="traditional">일반형</option><option value="feedback">피드백용</option><option value="grid">격자형</option></select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <select value={fontFamily} onChange={e => setFontFamily(e.target.value)} style={selectStyle}>
                    <option value="'Noto Serif KR', serif">바탕체 (Noto Serif)</option><option value="'Noto Sans KR', sans-serif">고딕체 (Noto Sans)</option>
                    <option value="'Jua', sans-serif">주아체 (Jua)</option><option value="'Gamja Flower', cursive">감자꽃체 (Gamja)</option>
                    <option value="'Hi Melody', cursive">하이멜로디 (Hi Melody)</option><option value="'Poor Story', cursive">푸른밤체 (Poor Story)</option>
                    <option value="'Nanum Pen Script', cursive">나눔펜글씨 (Nanum Pen)</option>
                  </select>
                  <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="이름 입력" style={selectStyle} />
                </div>
                <button onClick={() => window.print()} style={{ height: '34px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>인쇄 / PDF 저장</button>
              </div>
              <textarea value={content} onChange={e => setContent(e.target.value.slice(0, 3000))} className="sidebar-input" style={{ fontFamily }} placeholder="내용을 입력하세요..." />
            </aside>
            <main ref={mainRef} className="main-preview">
              <div className="no-print" style={{ marginBottom: '8px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '4px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', alignSelf: 'flex-start' }}>
                <span style={{ fontSize: '10px', fontWeight: '900', color: '#6366f1' }}>ZOOM</span>
                <select value={zoom} onChange={e => setZoom(parseFloat(e.target.value))} style={{ border: 'none', backgroundColor: 'transparent', fontSize: '12px', fontWeight: '900' }}>{[0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0].map(v => <option key={v} value={v}>{Math.round(v * 100)}%</option>)}</select>
                <button onClick={fitToScreen} style={{ border: 'none', background: '#6366f1', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '4px' }}>맞춤</button>
              </div>
              <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
                <div className="manuscript-print-root">
                  {Array.from({ length: pageCount }).map((_, p) => (
                    <div key={p} className="page-unit">
                      <div style={{ backgroundColor: 'white', padding: '40px 60px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', marginBottom: '40px', width: 'max-content' }} className="page-box">
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'end', marginBottom: '25px', height: '35px', alignItems: 'end' }}>
                          {p === 0 && studentName ? (<div style={{ borderBottom: '2px solid black', padding: '0 25px 5px 25px', fontSize: '18px', fontWeight: 'bold', fontFamily, color: 'black' }}>이름: {studentName}</div>) : (<div style={{ height: '35px' }}></div>)}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: viewMode === 'feedback' ? '30px' : viewMode === 'traditional' ? '15px' : '0px' }}>
                          {Array.from({ length: rows }).map((_, r) => (
                            <div key={r} style={{ display: 'flex', borderRight: viewMode !== 'grid' ? `1.2px solid ${lineColor}` : 'none' }}>
                              {Array.from({ length: 20 }).map((_, c) => renderCell(allCells[p * gridVal + r * 20 + c], `c-${p}-${r}-${c}`, c === 19))}
                            </div>
                          ))}
                        </div>
                        <div className="no-print" style={{ marginTop: '20px', textAlign: 'center', fontSize: '10px', color: '#94a3b8', fontWeight: 'bold' }}>PAGE {p + 1}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
