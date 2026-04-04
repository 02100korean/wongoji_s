import React, { useState, useCallback, useEffect, useRef } from 'react';

// --- 1. 유틸리티 및 스타일 ---
const cardStyle = { 
  transition: 'all 0.3s ease', cursor: 'pointer', background: 'white', borderRadius: '24px', padding: '25px 15px', 
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
    <div style={{ marginBottom: '15px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="60" height="50" viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="59" height="49" rx="3.5" fill="white" stroke="#6366f1" strokeWidth="1"/>
            <line x1="15" y1="0" x2="15" y2="50" stroke="#cbd5e1" strokeWidth="0.5"/><line x1="30" y1="0" x2="30" y2="50" stroke="#cbd5e1" strokeWidth="0.5"/><line x1="45" y1="0" x2="45" y2="50" stroke="#cbd5e1" strokeWidth="0.5"/><line x1="0" y1="16" x2="60" y2="16" stroke="#cbd5e1" strokeWidth="0.5"/><line x1="0" y1="33" x2="60" y2="33" stroke="#cbd5e1" strokeWidth="0.5"/>
        </svg>
        <span style={{ fontSize: '28px', position: 'absolute', bottom: '-5px', right: '0px', transform: 'rotate(-10deg)' }}>🖋️</span>
    </div>
);

// --- 2. 홈 컴포넌트 ---
const Home = ({ onNavigate }) => (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Noto Sans KR', sans-serif", color: '#1e293b' }}>
      <section style={{ padding: '80px 20px 140px', textAlign: 'center', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '60vh' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '20px' }}>Master Korean <span style={{ fontWeight: '400' }}>with</span> <span style={{ color: '#facc15' }}>02100 Korean</span></h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>한국어를 원고지에 쓰면서 연습하세요.</p>
      </section>
      <div style={{ maxWidth: '1350px', margin: '-50px auto 80px', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        <div onClick={() => onNavigate('editor')} style={cardStyle}><WonjiIcon /><h3 style={cardTitleStyle}>원고지 연습장</h3><p style={cardDescStyle}>다양한 폰트로 원고지 쓰기를 연습하세요.</p><button style={cardButtonStyle}>바로 시작하기</button></div>
      </div>
    </div>
);

// --- 3. 메인 앱 ---
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
    if (view === 'editor') { fitToScreen(); window.addEventListener('resize', fitToScreen); }
    return () => window.removeEventListener('resize', fitToScreen);
  }, [view, fitToScreen]);

  // --- [핵심: 문장부호 복구 엔진] ---
  const processToCells = useCallback((text, cols) => {
    const cells = [{ type: 'empty' }]; 
    let i = 0, sCount = 0, dCount = 0;
    const limit = Math.min(text.length, 3000);

    while (i < limit) {
      const char = text[i], next = text[i+1] || "", next2 = text[i+2] || "";
      const currentPos = cells.length % cols;

      // 따옴표 카운팅 및 타입 결정
      let qType = null;
      if (isSingleQuote(char)) { sCount++; qType = sCount % 2 !== 0 ? 'open' : 'close'; }
      else if (isDoubleQuote(char)) { dCount++; qType = dCount % 2 !== 0 ? 'open' : 'close'; }
      const isInside = (sCount % 2 !== 0) || (dCount % 2 !== 0);

      // 규칙: 인용 중 줄바꿈 시 첫 칸 비우기
      if (currentPos === 0 && isInside && qType !== 'open') { cells.push({ type: 'empty' }); }

      // 1. 말줄임표
      if (char === '.' && next === '.' && next2 === '.') { cells.push({ type: 'ellipsis' }); i += 3; continue; }
      // 2. 줄바꿈
      if (char === '\n') {
        const rem = cols - (cells.length % cols || cols);
        if (cells.length % cols !== 0) { for(let r=0; r<rem; r++) cells.push({ type: 'empty' }); }
        cells.push({ type: 'empty' }); i++; continue;
      }
      // 3. 공백
      if (char === ' ') { if (cells.length % cols === 0) { i++; continue; } cells.push({ type: 'default', content: '' }); i++; continue; }
      
      // 4. 숫자 사이 부호 (핵심 복구: 1.5 -> [1.] 한 칸 사용)
      if (isDigit(char) && isSimplePunct(next) && isDigit(next2)) {
        cells.push({ type: 'pair', content: [char, next] }); i += 2; continue;
      }
      // 5. 일반 숫자/영어 페어링 (2글자씩)
      if (next !== "" && ((isDigit(char) && isDigit(next)) || (isAlpha(char) && isAlpha(next)))) {
        cells.push({ type: 'pair', content: [char, next] }); i += 2; continue;
      }

      // 6. 결합 규칙
      const isEnd = cells.length % cols === cols - 1;
      const nextIsClosing = isSingleQuote(next) ? (sCount+1)%2===0 : (isDoubleQuote(next) ? (dCount+1)%2===0 : false);

      if (isEnd && isSimplePunct(next)) { cells.push({ type: 'combined_end', content: char, punct: next }); i += 2; }
      else if (isSimplePunct(char) && nextIsClosing) {
        cells.push({ type: 'punct_quote_final', punct: char, quote: next });
        if (isSingleQuote(next)) sCount++; else dCount++; i += 2;
      } else {
        // 단독 요소
        if (qType === 'open') cells.push({ type: 'quote_open', content: char });
        else if (qType === 'close') cells.push({ type: 'quote_close', content: char });
        else if (isSimplePunct(char)) cells.push({ type: 'punct_alone', content: char });
        else cells.push({ type: 'default', content: char });
        i++;
      }
    }
    return cells;
  }, []);

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
        fontFamily: fontFamily, fontWeight: 'normal', paddingTop: isShiftDown ? '2px' : isMoreShift ? '4px' : '0px', position: 'relative'
    };

    if (!cellData || cellData.type === 'empty') return <div key={key} style={cellStyle}></div>;

    const Punct = ({ char, x, y, size = baseSize }) => (
        <span style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: '500', fontSize: `${size}px`, position: 'absolute', left: `${x}%`, bottom: `${y}%`, transform: 'translate(-50%, 50%)' }}>{char}</span>
    );

    if (cellData.type === 'ellipsis') return <div key={key} style={cellStyle}><Punct char="." x={35} y={65} /><Punct char="." x={50} y={65} /><Punct char="." x={65} y={65} /></div>;
    if (cellData.type === 'combined_end') return <div key={key} style={cellStyle}><span style={{zIndex:2}}>{cellData.content}</span><Punct char={cellData.punct} x={80} y={30} /></div>;
    if (cellData.type === 'punct_quote_final') return <div key={key} style={cellStyle}><Punct char={cellData.punct} x={30} y={40} /><Punct char={cellData.quote} x={90} y={70} /></div>;
    if (cellData.type === 'pair') return <div key={key} style={{...cellStyle, display: 'flex', fontSize: '20px'}}><div style={{width: '50%', display: 'flex', justifyContent: 'center'}}>{cellData.content[0]}</div><div style={{width: '50%', display: 'flex', justifyContent: 'center'}}>{cellData.content[1]}</div></div>;
    if (cellData.type === 'punct_alone') return <div key={key} style={cellStyle}><Punct char={cellData.content} x={30} y={40} /></div>;
    if (cellData.type === 'quote_open') return <div key={key} style={cellStyle}><Punct char={cellData.content} x={80} y={70} /></div>;
    if (cellData.type === 'quote_close') return <div key={key} style={cellStyle}><Punct char={cellData.content} x={20} y={70} /></div>;

    return <div key={key} style={{...cellStyle, color: '#0f172a'}}><span>{cellData.content}</span></div>;
  }, [lineColor, viewMode, fontFamily]);

  return (
    <div className="app-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jua&family=Gamja+Flower&family=Hi+Melody&family=Poor+Story&family=Gowun+Dodum&family=Nanum+Pen+Script&family=Noto+Sans+KR:wght@400;500;700;900&family=Noto+Serif+KR:wght@400;700&family=Nanum+Barun+Pen:wght@400;700&display=swap');
        body { margin: 0; padding: 0; overflow: hidden; height: 100vh; width: 100vw; }
        .editor-container { display: flex; height: 100vh; width: 100vw; background-color: #e2e8f0; overflow: hidden; }
        
        /* 가로 모드: 좌측(설정/입력), 우측(원고지) */
        .sidebar { width: 340px; height: 100vh; background: white; border-right: 1px solid #ddd; display: flex; flex-direction: column; flex-shrink: 0; }
        .main-preview { flex: 1; height: 100vh; overflow: auto; background-color: #cbd5e1; padding: 20px; display: flex; flex-direction: column; align-items: flex-start; }

        /* 세로 모드: 상단 50% 하단 50% */
        @media (orientation: portrait) {
          .editor-container { flex-direction: column !important; }
          .sidebar { width: 100% !important; height: 50vh !important; border-right: none; border-bottom: 2px solid #ddd; }
          .main-preview { width: 100% !important; height: 50vh !important; padding: 10px; align-items: center; }
        }

        .sidebar-settings { padding: 10px; background: #f8fafc; border-bottom: 1px solid #eee; display: flex; flex-direction: column; gap: 6px; }
        .sidebar-input { flex: 1; padding: 15px; border: none; outline: none; resize: none; font-size: 15px; line-height: 1.6; min-height: 0; }
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
                    <option value="'Noto Serif KR', serif">바탕체</option><option value="'Noto Sans KR', sans-serif">고딕체</option><option value="'Jua', sans-serif">주아체</option><option value="'Gamja Flower', cursive">감자꽃체</option><option value="'Hi Melody', cursive">하이멜로디</option><option value="'Poor Story', cursive">푸른밤체</option>
                  </select>
                  <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="이름 입력" style={selectStyle} />
                </div>
                <button onClick={() => window.print()} style={{ height: '34px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px' }}>인쇄 / PDF 저장</button>
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
  return (
    <div className="manuscript-print-root">
      {Array.from({ length: pageCount }).map((_, p) => (
        <div key={p} className="page-unit" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pageBreakAfter: 'always' }}>
          <div style={{ backgroundColor: 'white', padding: '40px 60px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', marginBottom: '40px', width: 'max-content' }} className="page-box">
            <div style={{ width: '100%', display: 'flex', justifyContent: 'end', marginBottom: '25px', height: '35px', alignItems: 'end' }}>
              {p === 0 && name && name.trim() !== '' ? (<div style={{ borderBottom: '2px solid black', padding: '0 25px 5px 25px', fontSize: '18px', fontWeight: 'bold', fontFamily, color: 'black' }}>이름: {name}</div>) : (<div style={{ height: '35px' }}></div>)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: viewMode === 'feedback' ? '30px' : viewMode === 'traditional' ? '15px' : '0px' }}>
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
