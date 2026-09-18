import React, { useEffect, useRef, useState } from 'react';
import { Activity, HeartPulse, Stethoscope, Compass, Sparkles, ArrowRight } from 'lucide-react';

/* ─── Animated Floating Particles Canvas ──────────────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '#10B981' : Math.random() > 0.5 ? '#F59E0B' : '#818CF8',
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Draw connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = '#10B981';
            ctx.globalAlpha = 0.04 * (1 - dist / 80);
            ctx.lineWidth = 0.6;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

/* ─── 3D Floating Orb ─────────────────────────────────────────────────────── */
function FloatingOrb({ size = 320, color1 = '#10B981', color2 = '#0EA5E9', delay = '0s', style = {} }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 35% 35%, ${color1}55, ${color2}22, transparent 70%)`,
        boxShadow: `0 0 80px 20px ${color1}18, inset 0 0 60px ${color1}12`,
        filter: 'blur(0.5px)',
        animation: `floatOrb 8s ease-in-out infinite`,
        animationDelay: delay,
        ...style,
      }}
    />
  );
}

/* ─── Scenario Card with 3D tilt ──────────────────────────────────────────── */
function ScenarioCard({ sc, isSelected, onClick }) {
  const cardRef = useRef(null);
  const Icon = sc.icon;

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -8;
    const rotY = ((x - cx) / cx) * 8;
    card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)';
    }
  };

  return (
    <button
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="text-left w-full"
      style={{
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className={`p-4 rounded-2xl border h-full relative overflow-hidden transition-all ${
          isSelected
            ? 'bg-emerald-950/50 border-emerald-400/50 shadow-lg shadow-emerald-500/20'
            : 'bg-slate-900/70 hover:bg-slate-800/70 border-white/10 hover:border-emerald-500/30 hover:shadow-md hover:shadow-emerald-500/10'
        }`}
      >
        {/* Shine overlay */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: isSelected
              ? 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, transparent 60%)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%)',
          }}
        />
        {isSelected && (
          <div
            className="absolute top-0 right-0 w-20 h-20 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%)',
              transform: 'translate(30%, -30%)',
            }}
          />
        )}

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isSelected
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-white/8 text-amber-300 border border-amber-500/20'
              }`}
            >
              {sc.tag}
            </span>
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                isSelected ? 'bg-emerald-500/20' : 'bg-white/8'
              }`}
            >
              <Icon size={15} className={isSelected ? 'text-emerald-400' : 'text-slate-400'} />
            </div>
          </div>

          <div className="text-sm font-bold text-white mb-1.5 leading-tight">{sc.title}</div>
          <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{sc.queryText}</div>

          {isSelected && (
            <div className="mt-3 flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
              <ArrowRight size={11} />
              <span>Running now</span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

/* ─── Main Hero ───────────────────────────────────────────────────────────── */
export default function HeroSection({ onSelectScenario, activeScenarioId }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    // Animate the counter text
    const t = setInterval(() => setTick((v) => v + 1), 60);
    return () => clearInterval(t);
  }, []);

  const scenarios = [
    {
      id: 'bihar-dialysis-bpl',
      title: 'Dialysis in Bihar (Patna · BPL)',
      tag: 'Video Demo §05',
      state: 'Bihar',
      district: 'Patna',
      condition: 'Dialysis',
      incomeCategory: 'BPL',
      icon: Activity,
      queryText:
        'My father needs maintenance dialysis in Patna, Bihar. We hold a BPL ration card. Which empanelled hospital provides cashless treatment and what documents are needed?',
    },
    {
      id: 'karnataka-cardiac-ark',
      title: 'Cardiac Surgery · Bengaluru (BPL)',
      tag: 'Karnataka Jayadeva',
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      condition: 'Cardiac',
      incomeCategory: 'BPL',
      icon: HeartPulse,
      queryText:
        'Patient in Bengaluru needs heart bypass surgery (CABG). We have a BPL card. Does Arogya Karnataka / PM-JAY cover Sri Jayadeva Institute cashless?',
    },
    {
      id: 'bihar-maternity-mmjay',
      title: 'Maternity in Gaya (MMJAY / NFSA)',
      tag: 'High-Risk Delivery',
      state: 'Bihar',
      district: 'Gaya',
      condition: 'Maternity',
      incomeCategory: 'PHH',
      icon: Stethoscope,
      queryText:
        'Emergency C-section delivery needed in Gaya, Bihar. Family has a state ration card. Where is the nearest empanelled government medical college?',
    },
    {
      id: 'karnataka-oncology-kidwai',
      title: 'Oncology · Bengaluru (Kidwai / PM-JAY)',
      tag: 'Cancer Chemo',
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      condition: 'Oncology',
      incomeCategory: 'BPL',
      icon: Compass,
      queryText:
        'Family member requires chemotherapy in Bengaluru. Is Kidwai Memorial Institute empanelled for free oncology under PM-JAY and what papers do we carry?',
    },
  ];

  return (
    <>
      {/* ── Inject keyframes once ── */}
      <style>{`
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0px) scale(1); }
          33% { transform: translateY(-18px) scale(1.04); }
          66% { transform: translateY(10px) scale(0.97); }
        }
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmerText {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes ringPulse {
          0%, 100% { transform: scale(1);   opacity: 0.5; }
          50%       { transform: scale(1.12); opacity: 0.15; }
        }
        .hero-fade-up  { animation: heroFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }
        .hero-delay-1  { animation-delay: 0.08s; }
        .hero-delay-2  { animation-delay: 0.18s; }
        .hero-delay-3  { animation-delay: 0.28s; }
        .hero-delay-4  { animation-delay: 0.40s; }
        .shimmer-title {
          background: linear-gradient(
            90deg,
            #34D399 0%, #FBBF24 25%, #A78BFA 50%, #34D399 75%, #FBBF24 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmerText 4s linear infinite;
        }
        .ring-pulse {
          animation: ringPulse 3s ease-in-out infinite;
        }
      `}</style>

      <section className="relative overflow-hidden pt-10 pb-6 px-4">
        {/* ── Background: particle canvas ── */}
        <div className="absolute inset-0" style={{ zIndex: 0 }}>
          <ParticleCanvas />
        </div>

        {/* ── 3-D floating orbs ── */}
        <FloatingOrb
          size={480}
          color1="#10B981"
          color2="#0EA5E9"
          delay="0s"
          style={{ top: '-120px', left: '-160px', zIndex: 0 }}
        />
        <FloatingOrb
          size={360}
          color1="#F59E0B"
          color2="#EC4899"
          delay="-3s"
          style={{ top: '-80px', right: '-140px', zIndex: 0 }}
        />
        <FloatingOrb
          size={260}
          color1="#818CF8"
          color2="#6366F1"
          delay="-6s"
          style={{ bottom: '-60px', left: '40%', zIndex: 0 }}
        />

        {/* ── Radial pulse rings behind headline ── */}
        <div
          className="absolute pointer-events-none ring-pulse"
          style={{
            width: 600,
            height: 600,
            borderRadius: '50%',
            border: '1px solid rgba(16,185,129,0.15)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            zIndex: 0,
          }}
        />
        <div
          className="absolute pointer-events-none ring-pulse"
          style={{
            width: 400,
            height: 400,
            borderRadius: '50%',
            border: '1px solid rgba(16,185,129,0.1)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            zIndex: 0,
            animationDelay: '1s',
          }}
        />

        {/* ── Content ── */}
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Scope badge */}
          <div
            className="hero-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
            style={{
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.25)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-300 tracking-wide">
              Agentic AI — Government Health Scheme Navigator
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-amber-400 font-bold">Bharat Builds Tour 2026</span>
          </div>

          {/* Headline */}
          <h1
            className="hero-fade-up hero-delay-1 text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none mb-5"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Every citizen is a{' '}
            <span className="shimmer-title">HaqDaar</span>
            <br />
            <span className="text-white text-3xl sm:text-5xl lg:text-6xl font-bold">
              of free health coverage.
            </span>
          </h1>

          {/* Sub-headline */}
          <p
            className="hero-fade-up hero-delay-2 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10"
          >
            Describe your healthcare need in plain language.{' '}
            <strong className="text-white">HaqDaar</strong> finds the right government scheme,
            empanelled hospitals near you, and the exact documents to carry —{' '}
            <strong className="text-emerald-400">in one conversation.</strong>
          </p>

          {/* Live stats strip */}
          <div className="hero-fade-up hero-delay-3 flex flex-wrap items-center justify-center gap-6 mb-10">
            {[
              { val: '30+', label: 'States Covered', color: '#34D399' },
              { val: '500+', label: 'Hospitals Indexed', color: '#FBBF24' },
              { val: '5', label: 'Gov Schemes', color: '#A78BFA' },
              { val: '< 3s', label: 'AI Response', color: '#38BDF8' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div
                  className="text-2xl sm:text-3xl font-extrabold font-heading"
                  style={{ color: s.color, textShadow: `0 0 20px ${s.color}55` }}
                >
                  {s.val}
                </div>
                <div className="text-[11px] text-slate-400 font-medium mt-0.5 uppercase tracking-wider">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Scenario Cards */}
          <div className="hero-fade-up hero-delay-4">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              <Sparkles size={14} className="text-amber-400" />
              <span>Select a verified scenario for instant demonstration</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
              {scenarios.map((sc) => (
                <ScenarioCard
                  key={sc.id}
                  sc={sc}
                  isSelected={activeScenarioId === sc.id}
                  onClick={() => onSelectScenario(sc)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
