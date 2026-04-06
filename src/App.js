import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';

// --- [1. 스타일 및 디자인: v.12.8 완벽 보존] --- [cite: 1368-1374]
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
const selectStyle = { height: '34px', padding: '0 8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.1px', fontWeight: '700', backgroundColor: 'white', color: '#334155', width: '100%', boxSizing: 'border-box' };

const isSimplePunct = (c) => c === '.' || c === ',';
const isSingleQuote = (c) => /['‘’]/.test(c);
const isDoubleQuote = (c) => /["“”]/.test(c);
const isDigit = (c) => /[0-9]/.test(c);
const isAlphaLower = (c) => /[a-z]/.test(c); 

const WonjiIcon = () => (
    <div style={{ marginBottom: '15px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '50px' }}>
        <svg width="60" height="50" viewBox="0 0 60 50" fill="none">
            <rect x="0.5" y="0.5" width="59" height="49" rx="3.5" fill="white" stroke="#6366f1" strokeWidth="1"/>
            <path d="M15 0V50M30 0V50M45 0V50M0 16H60M0 33H60" stroke="#cbd5e1" strokeWidth="0.5"/>
        </svg>
        <span style={{ fontSize: '28px', position: 'absolute', bottom: '-5px', right: '-5px', transform: 'rotate(-10deg)' }}>🖋️</span>
    </div>
);

// --- [2. 홈 화면: v.12.8 완벽 보존] --- [cite: 1375-1391]
const Home = ({ onNavigate }) => {
  const cardsRef = useRef(null);
  const handleScroll = () => { cardsRef.current?.scrollIntoView({ behavior: 'smooth' }); };
  return (
    <div className="home-root">
      <style>{`
        .home-root { width: 100%; height: 100vh; overflow-y: auto !important; background-color: #f8fafc; font-family: 'Noto Sans KR', sans-serif; color: #1e293b; -webkit-overflow-scrolling: touch; }
        .hero-section { height: 50vh; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 0 20px; text-align: center; background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: white; position: relative; }
        .cards-grid { max-width: 1300px; margin: 40px auto 100px; padding: 0 20px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        @media screen and (orientation: portrait) { .cards-grid { grid-template-columns: 1fr; } }
        @media screen and (orientation: landscape) and (max-width: 900px) { .cards-grid { grid-template-columns: repeat(4, 1fr); gap: 10px; } .hero-section { height: 70vh; } }
        .card-item:hover { transform: translateY(-12px); box-shadow: 0 25px 50px rgba(99, 102, 241, 0.2); }
        .scroll-indicator { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); cursor: pointer; animation: bounce 2s infinite; display: flex; flex-direction: column; align-items: center; z-index: 10; }
        @keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); } 40% { transform: translateX(-50%) translateY(-10px); } }
      `}</style>
      <section className="hero-section">
        <h1 style={{ fontSize: '2.8rem', fontWeight: '900', marginBottom: '15px', lineHeight: 1.2 }}>Master Korean <br/> <span style={{ fontWeight: '400' }}>with</span> <span style={{ color: '#facc15' }}>02100 Korean</span></h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '700px', lineHeight: 1.6 }}>한국어를 원고지에 쓰면서 연습하고,<br/>한국어 필수 패턴을 내 것으로 만드세요.</p>
        <div className="scroll-indicator" onClick={handleScroll}><span style={{ fontSize: '11px', fontWeight: 900, color: '#facc15' }}>SCROLL DOWN ▼</span></div>
      </section>
      <div className="cards-grid" ref={cardsRef}>
        <div className="card-item" onClick={() => onNavigate('editor')} style={cardStyle}>
          <WonjiIcon /><h3 style={cardTitleStyle}>원고지 연습장</h3><p style={cardDescStyle}>다양한 폰트로 원고지 쓰기를 연습하고 인쇄하세요.</p><button style={cardButtonStyle}>시작하기</button>
        </div>
        <a href="https://buymeacoffee.com/02100korean/e/387205" target="_blank" rel="noreferrer" className="card-item" style={cardStyle}>
          <div style={{fontSize:'40px'}}>📚</div><h3 style={cardTitleStyle}>패턴 100 E-book</h3><p style={cardDescStyle}>한국어 초급 학습자에게 필수적인 한국어 문장 패턴 100가지를 담았습니다.</p><button style={{...cardButtonStyle, backgroundColor:'#10b981'}}>다운로드</button>
        </a>
        <a href="https://www.youtube.com/playlist?list=PLdNKi3Jkq1kmbPOQuexdPMYDxvrkfnWha" target="_blank" rel="noreferrer" className="card-item" style={cardStyle}>
          <div style={{fontSize:'40px'}}>📺</div><h3 style={cardTitleStyle}>패턴 100 영상</h3><p style={cardDescStyle}>전문 강사의 설명과 함께하는 생생한 패턴 학습. 지금 시청하세요.</p><button style={{...cardButtonStyle, backgroundColor:'#f59e0b'}}>시청하기</button>
        </a>
        <a href="https://search.shopping.naver.com/book/catalog/57751554767" target="_blank" rel="noreferrer" className="card-item" style={{...cardStyle, border:'2.5px solid #6366f1'}}>
          <div style={{backgroundColor:'#eff6ff', padding:'10px', borderRadius:'15px', marginBottom:'10px', fontSize:'11px', fontWeight:900}}>02100korean@gmail.com</div><h3 style={cardTitleStyle}>TOPIK 1 필수 단어장</h3><p style={cardDescStyle}>한 권으로 완성하는 TOPIK 1 단어! 연습 문제까지 포함된 완벽한 교재입니다.</p><button style={{...cardButtonStyle, width:'100%'}}>구입하기</button>
        </a>
      </div>
    </div>
  );
};

// --- [3. 메인 앱 컴포넌트: v.12.10 엔진 및 레이아웃 완벽 유지 + PDF 저장 함수 추가] ---
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

  // PDF 라이브러리 자동 주입
  useEffect(() => {
    const s1 = document.createElement('script');
    s1.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    document.head.appendChild(s1);
    const s2 = document.createElement('script');
    s2.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    document.head.appendChild(s2);
  }, []);

  const fitToScreen = useCallback(() => {
    if (mainRef.current) {
      const containerWidth = mainRef.current.clientWidth - 40;
      const baseWidth = viewMode === 'feedback' ? (gridType === '200' ? 1010 : 1050) : 880; 
      const calculatedZoom = Math.floor((containerWidth / baseWidth) * 100) / 100;
      setZoom(Math.min(1.5, Math.max(0.3, calculatedZoom))); 
    }
  }, [viewMode, gridType]);

  useEffect(() => {
    if (view === 'editor') { setTimeout(fitToScreen, 300); window.addEventListener('resize', fitToScreen); }
    return () => window.removeEventListener('resize', fitToScreen);
  }, [view, fitToScreen, gridType, viewMode]);

  // [v.12.8/v.12.10 텍스트 처리 엔진 완벽 보존] [cite: 1396-1411]
  const allCells = useMemo(() => {
    const cols = 20; const cells = [{ type: 'empty' }];
    let i = 0, sCount = 0, dCount = 0;
    const limit = Math.min(content.length, 3000);
    const fillAndIndent = () => {
      const rem = cols - (cells.length % cols || cols);
      for (let r = 0; r < rem; r++) cells.push({ type: 'empty' });
      cells.push({ type: 'empty' });
    };
    while (i < limit) {
      const char = content[i], next = content[i+1] || "", next2 = content[i+2] || "";
      let qType = null;
      if (isSingleQuote(char)) { sCount++; qType = sCount % 2 !== 0 ? 'open' : 'close'; }
      else if (isDoubleQuote(char)) { dCount++; qType = dCount % 2 !== 0 ? 'open' : 'close'; }
      if (cells.length % cols === 0 && ((sCount%2!==0) || (dCount%2!==0)) && qType !== 'open') cells.push({ type: 'empty' });
      if (char === '.' && next === '.' && next2 === '.') { cells.push({ type: 'ellipsis' }); i += 3; continue; }
      if (char === '\n') { const rem = cols - (cells.length % cols || cols); for(let r=0; r<rem; r++) cells.push({ type: 'empty' }); cells.push({ type: 'empty' }); i++; continue; }
      if (char === ' ') { if (cells.length % cols !== 0) cells.push({ type: 'default', content: '' }); i++; continue; }
      if ((isDigit(char) && isDigit(next)) || (isAlphaLower(char) && isAlphaLower(next)) || (isDigit(char) && isSimplePunct(next) && isDigit(next2)) || (isSimplePunct(char) && isDigit(next))) { 
        cells.push({ type: 'pair', content: [char, next] }); i += 2; continue; 
      }
      const isEnd = cells.length % cols === cols - 1;
      const nextIsClosing = isSingleQuote(next) ? (sCount+1)%2===0 : (isDoubleQuote(next) ? (dCount+1)%2===0 : false);
      if (isEnd && isSimplePunct(next)) { cells.push({ type: 'combined_end', content: char, punct: next }); i += 2; }
      else if (isSimplePunct(char) && nextIsClosing) { 
        cells.push({ type: 'punct_quote_final', punct: char, quote: next }); 
        if (isSingleQuote(next)) sCount++; else dCount++; i += 2; 
        fillAndIndent();
      } else { 
        if (qType === 'open') { cells.push({ type: 'quote_open', content: char }); i++; }
        else if (qType === 'close') { cells.push({ type: 'quote_close', content: char }); i++; fillAndIndent(); }
        else if (isSimplePunct(char)) { cells.push({ type: 'punct_alone', content: char }); i++; }
        else { cells.push({ type: 'default', content: char }); i++; }
      }
    }
    return cells;
  }, [content]);

  const renderCell = useCallback((cellData, key, isLastCol) => {
    const isGrid = viewMode === 'grid';
    let verticalShift = '0px';
    if (["'Jua', sans-serif", "'Gamja Flower', cursive", "'Hi Melody', cursive", "'Nanum Pen Script', cursive"].includes(fontFamily)) verticalShift = '3.8px';
    else if (fontFamily === "'Poor Story', cursive") verticalShift = '1.9px';
    const cellStyle = { width: '38px', height: '38px', borderLeft: `1.2px solid ${lineColor}`, borderTop: `1.2px solid ${lineColor}`, borderBottom: `1.2px solid ${lineColor}`, borderRight: (isLastCol || isGrid) ? `1.2px solid ${lineColor}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', backgroundColor: 'white', boxSizing: 'border-box', fontFamily: fontFamily, position: 'relative' };
    if (!cellData || cellData.type === 'empty') return <div key={key} style={cellStyle}></div>;
    const Punct = ({ char, x, y }) => <span style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: '500', fontSize: '22px', position: 'absolute', left: `${x}%`, bottom: `${y}%`, transform: 'translate(-50%, 50%)' }}>{char}</span>;
    if (cellData.type === 'ellipsis') return <div key={key} style={cellStyle}><Punct char="." x={35} y={65} /><Punct char="." x={50} y={65} /><Punct char="." x={65} y={65} /></div>;
    if (cellData.type === 'combined_end') return <div key={key} style={cellStyle}><span style={{zIndex:2, transform: `translateY(${verticalShift})` }}>{cellData.content}</span><Punct char={cellData.punct} x={85} y={40} /></div>;
    if (cellData.type === 'punct_quote_final') return <div key={key} style={cellStyle}><Punct char={cellData.punct} x={30} y={40} /><Punct char={cellData.quote} x={90} y={70} /></div>;
    if (cellData.type === 'pair') return (
        <div key={key} style={{...cellStyle, display: 'flex', fontSize: '20px'}}>
          <div style={{width: '50%', display: 'flex', justifyContent: 'center', transform: isSimplePunct(cellData.content[0]) ? 'none' : `translateY(${verticalShift})`, fontFamily: isSimplePunct(cellData.content[0]) ? "'Noto Sans KR', sans-serif" : fontFamily }}>{cellData.content[0]}</div>
          <div style={{width: '50%', display: 'flex', justifyContent: 'center', transform: isSimplePunct(cellData.content[1]) ? 'none' : `translateY(${verticalShift})`, fontFamily: isSimplePunct(cellData.content[1]) ? "'Noto Sans KR', sans-serif" : fontFamily }}>{cellData.content[1]}</div>
        </div>
      );
    if (cellData.type === 'punct_alone') return <div key={key} style={cellStyle}><Punct char={cellData.content} x={30} y={40} /></div>;
    if (cellData.type === 'quote_open') return <div key={key} style={cellStyle}><Punct char={cellData.content} x={75} y={65} /></div>;
    if (cellData.type === 'quote_close') return <div key={key} style={cellStyle}><Punct char={cellData.content} x={25} y={65} /></div>;
    return <div key={key} style={{...cellStyle, color: '#0f172a'}}><span style={{ transform: `translateY(${verticalShift})` }}>{cellData.content}</span></div>;
  }, [lineColor, viewMode, fontFamily]);

  const gridVal = parseInt(gridType);
  const pageCount = Math.max(1, Math.ceil(allCells.length / gridVal));

  // --- [모바일/PC 공용 PDF 저장 로직] ---
  const saveToPDF = async () => {
    if (!window.html2canvas || !window.jspdf) {
      alert("PDF 라이브러리를 로딩 중입니다. 1~2초 후 다시 클릭해 주세요.");
      return;
    }
    const { jsPDF } = window.jspdf;
    const pages = document.querySelectorAll('.page-unit');
    if (!pages.length) return;

    const orientation = gridType === '200' ? 'l' : 'p';
    const pdf = new jsPDF(orientation, 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < pages.length; i++) {
      const canvas = await window.html2canvas(pages[i], {
        scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      if (i > 0) pdf.addPage(orientation, 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    }

    const now = new Date();
    const dateStr = now.getFullYear() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
    const timeStr = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0') + String(now.getSeconds()).padStart(2, '0');
    pdf.save(`wongoji_${dateStr}_${timeStr}.pdf`);
  };

  return (
    <div className="app-root-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jua&family=Gamja+Flower&family=Hi+Melody&family=Poor+Story&family=Gowun+Dodum&family=Nanum+Pen+Script&family=Noto+Sans+KR:wght@400;500;700;900&family=Noto+Serif+KR:wght@400;700&family=Nanum+Barun+Pen:wght@400;700&display=swap');
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
        .editor-container { display: flex; width: 100vw; height: 100vh; background-color: #e2e8f0; overflow: hidden; }
        .editor-body { display: flex; flex: 1; width: 100%; height: calc(100vh - 50px); margin-top: 50px; flex-direction: row; }
        .sidebar { width: 40%; height: 100%; background: white; border-right: 1px solid #ddd; display: flex; flex-direction: column; flex-shrink: 0; z-index: 20; }
        .main-preview { width: 60%; height: 100%; overflow: auto; background-color: #cbd5e1; padding: 20px; display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-start; }
        @media screen and (orientation: portrait) {
          .editor-body { flex-direction: column !important; }
          .sidebar { width: 100% !important; height: 50% !important; flex-basis: 50% !important; border-right: none !important; border-bottom: 2px solid #ddd !important; }
          .main-preview { width: 100% !important; height: 50% !important; flex-basis: 50% !important; padding: 10px !important; }
        }
        .sidebar-settings { padding: 10px; background: #f8fafc; border-bottom: 1px solid #eee; display: flex; flex-direction: column; gap: 6px; }
        .sidebar-input { flex: 1; padding: 15px; border: none; outline: none; resize: none; font-size: 15px; line-height: 1.6; width: 100%; box-sizing: border-box; background: white; }

        @media print {
          @page { size: ${gridType === '200' ? 'landscape' : 'portrait'}; margin: 0; }
          .no-print, header, .sidebar, .scroll-indicator, .zoom-controls { display: none !important; }
          body, html, .app-root-container, .editor-container, .editor-body, .main-preview { background: white !important; overflow: visible !important; height: auto !important; width: 100% !important; display: block !important; margin: 0 !important; padding: 0 !important; }
          .zoom-wrapper { transform: none !important; width: 100% !important; height: auto !important; display: block !important; }
          .manuscript-print-root { display: block !important; width: 100% !important; height: auto !important; }
          .page-unit { height: 100vh !important; width: 100vw !important; display: flex !important; justify-content: center !important; align-items: center !important; box-sizing: border-box !important; page-break-after: always !important; break-after: page !important; position: relative !important; overflow: hidden !important; }
          
          /* [인쇄 수치 최종 복구 및 400자 일반 전용 교정] [cite: 1441-1446] */
          .case-200-traditional { padding: 20mm !important; transform: scale(min((100vw - 40mm) / 880, (100vh - 40mm) / 630)) !important; }
          .case-200-feedback { padding: 15mm !important; transform: scale(min((100vw - 30mm) / 1010, (100vh - 30mm) / 750)) !important; }
          .case-200-grid { padding: 25mm !important; transform: scale(min((100vw - 50mm) / 880, (100vh - 50mm) / 550)) !important; }
          
          /* [400자 일반: 90% 고정] [cite: 1447] */
          .case-400-traditional { padding: 20mm !important; transform: scale(0.9) !important; }
          
          /* [400자 피드백: 73% 고정] [cite: 1448] */
          .case-400-feedback { padding: 15mm !important; transform: scale(0.73) !important; }
          
          .case-400-grid { padding: 15mm !important; transform: scale(min((100vw - 30mm) / 880, (100vh - 30mm) / 1050)) !important; }
          .page-box { box-shadow: none !important; margin: 0 !important; padding: 40px 60px !important; height: auto !important; transform-origin: center center !important; }
        }
      `}</style>

      {view === 'home' ? <Home onNavigate={setView} /> : (
        <div className="editor-container">
          <header className="no-print" style={{ backgroundColor: 'white', borderBottom: '1px solid #ddd', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100, height: '50px', position: 'fixed', top: 0, left: 0, right: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><button onClick={() => setView('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>🏠</button><div style={{ fontWeight: '900', color: '#1e293b', fontSize: '14px' }}>원고지 연습장</div></div>
            <div style={{ display: 'flex', gap: '8px' }}>{['#607d8b', '#ef4444', '#2d6a4f', '#000000'].map(c => (<button key={c} onClick={() => setLineColor(c)} style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid white', backgroundColor: c }} />))}</div>
          </header>
          <div className="editor-body">
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
                    <option value="'Nanum Pen Script', cursive">나눔손글씨 (Nanum Pen)</option>
                  </select>
                  <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="이름 입력" style={selectStyle} />
                </div>
                {/* [버튼 클릭 시 PDF 저장 함수 실행] */}
                <button onClick={saveToPDF} style={{ height: '34px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>인쇄 / PDF 저장</button>
              </div>
              <textarea value={content} onChange={e => setContent(e.target.value.slice(0, 3000))} className="sidebar-input" placeholder="내용을 입력하세요..." />
            </aside>
            <main ref={mainRef} className="main-preview">
              <div className="no-print zoom-controls" style={{ marginBottom: '8px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '4px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', alignSelf: 'flex-start', flexShrink: 0 }}>
                <span style={{ fontSize: '10px', fontWeight: '900', color: '#6366f1' }}>ZOOM</span>
                <select value={zoom} onChange={e => setZoom(parseFloat(e.target.value))} style={{ border: 'none', backgroundColor: 'transparent', fontSize: '12px', fontWeight: '900' }}>{[0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2].map(v => <option key={v} value={v}>{Math.round(v * 100)}%</option>)}</select>
                <button onClick={fitToScreen} style={{ border: 'none', background: '#6366f1', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '4px' }}>맞춤</button>
              </div>
              <div className="zoom-wrapper" style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', display: 'inline-block' }}>
                <div className="manuscript-print-root">
                  {Array.from({ length: pageCount }).map((_, p) => (
                    <div key={p} className="page-unit">
                      <div style={{ backgroundColor: 'white', padding: '40px 60px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', width: 'max-content' }} className={`page-box case-${gridType}-${viewMode}`}>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'end', marginBottom: '25px', height: '35px', alignItems: 'end' }}>
                          {p === 0 && studentName ? (<div style={{ borderBottom: '2px solid black', padding: '0 25px 5px 25px', fontSize: '18px', fontWeight: 'bold', fontFamily, color: 'black' }}>이름: {studentName}</div>) : (<div style={{ height: '35px' }}></div>)}
                        </div>
                        <div style={{ display: 'flex' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: viewMode === 'feedback' ? '30px' : viewMode === 'traditional' ? '15px' : '0px' }}>
                            {Array.from({ length: gridVal/20 }).map((_, r) => (
                              <div key={r} style={{ display: 'flex', borderRight: (viewMode !== 'grid' && viewMode !== 'feedback') ? `1.2px solid ${lineColor}` : 'none' }}>
                                {Array.from({ length: 20 }).map((_, c) => renderCell(allCells[p * gridVal + r * 20 + c], `c-${p}-${r}-${c}`, c === 19))}
                              </div>
                            ))}
                          </div>
                          {viewMode === 'feedback' && (
                            <div style={{ width: gridType === '200' ? '113px' : '151px', marginLeft: '10px', border: `1.2px solid ${lineColor}`, borderRadius: '4px' }}></div>
                          )}
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
