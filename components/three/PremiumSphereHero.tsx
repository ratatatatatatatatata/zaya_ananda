"use client";

import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";

// Canvas itself lives in the lazy module, outside the initial bundle.
const CanvasScene = dynamic(() => import("./AboutSphereCanvas"), { ssr:false, loading:()=><StaticOrbs/> });
const orbs = [[27,17,11],[38,25,20],[60,23,11],[52,38,25],[28,47,17],[66,49,16],[40,63,24],[65,72,13],[20,70,8],[77,16,5],[15,35,7],[78,85,6],[53,86,8]];
export function StaticOrbs() {
  return <div aria-hidden="true" style={{position:"relative",width:"100%",height:"100%"}}>{orbs.map(([x,y,size],i)=><span key={i} style={{position:"absolute",left:x+"%",top:y+"%",width:size+"%",aspectRatio:"1",borderRadius:"50%",transform:"translate(-50%,-50%)",background:"radial-gradient(circle at 32% 26%,#ffffff 0%,#dbeef8 32%,#acc9df 67%,#769ab9 93%,#6688a5)",boxShadow:"inset -6px -8px 18px #56779528, 15px 24px 28px -14px #22426735",zIndex:i%3}}/>)}</div>;
}
class SceneBoundary extends Component<{ children:ReactNode },{ failed:boolean }> {
  state={failed:false};
  static getDerivedStateFromError() { return {failed:true}; }
  render() { return this.state.failed ? <StaticOrbs/> : this.props.children; }
}
export function PremiumSphereHero() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled,setEnabled]=useState(false);
  const [visible,setVisible]=useState(false);
  useEffect(()=>{
    const reduced=matchMedia("(prefers-reduced-motion: reduce)");
    const mobile=matchMedia("(max-width: 767px)");
    let supported=false;
    try { const canvas=document.createElement("canvas"); const gl=canvas.getContext("webgl2") || canvas.getContext("webgl"); supported=!!gl; gl?.getExtension("WEBGL_lose_context")?.loseContext(); } catch { /* static fallback */ }
    const update=()=>setEnabled(supported && !reduced.matches && !mobile.matches && (navigator.hardwareConcurrency || 8)>4);
    update(); reduced.addEventListener("change",update); mobile.addEventListener("change",update);
    const observer=new IntersectionObserver(entries=>setVisible(entries[0].isIntersecting),{rootMargin:"100px"});
    if(ref.current)observer.observe(ref.current);
    const onVisibility=()=>{ if(document.hidden)setVisible(false); else if(ref.current){const r=ref.current.getBoundingClientRect();setVisible(r.bottom>0&&r.top<innerHeight);} };
    document.addEventListener("visibilitychange",onVisibility);
    return ()=>{observer.disconnect();reduced.removeEventListener("change",update);mobile.removeEventListener("change",update);document.removeEventListener("visibilitychange",onVisibility);};
  },[]);
  return <div ref={ref} aria-hidden="true" style={{height:"100%",width:"100%"}}>{enabled && visible ? <SceneBoundary><CanvasScene/></SceneBoundary> : <StaticOrbs/>}</div>;
}
