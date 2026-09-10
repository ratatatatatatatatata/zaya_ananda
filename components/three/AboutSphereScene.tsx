"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

// Deterministic sculpture composition; no random shifts on re-mount.
const spheres: {pos:[number,number,number];r:number}[] = [
  {pos:[-1.4,2.2,-.2],r:.43},{pos:[-.5,1.5,.2],r:.82},{pos:[.8,2.1,-.3],r:.34},
  {pos:[.7,.6,0],r:1.02},{pos:[-1.25,.35,.5],r:.64},{pos:[1.8,-.35,-.5],r:.58},
  {pos:[-.4,-1.05,.15],r:.88},{pos:[.95,-2,-.2],r:.49},{pos:[-1.7,-1.75,-.3],r:.26},
  {pos:[2.3,2.65,-.5],r:.2},{pos:[-2.45,1.05,.1],r:.25},{pos:[2.2,-2.7,.3],r:.22},
  {pos:[.05,-2.7,.3],r:.27},{pos:[-1.5,1.15,-1],r:.6},{pos:[.1,.3,-1.2],r:.72},
];
export function AboutSphereScene({reducedMotion=false}:{reducedMotion?:boolean}) {
  const group=useRef<Group>(null);
  useFrame(({clock})=>{if(!group.current||reducedMotion)return;const t=clock.elapsedTime;group.current.rotation.y=Math.sin(t*.09)*.28;group.current.rotation.z=Math.sin(t*.07)*.035;group.current.position.y=Math.sin(t*.35)*.08;});
  return <><ambientLight intensity={1.1} color="#e6f3ff"/><directionalLight position={[-3,5,6]} intensity={3} color="#ffffff"/><directionalLight position={[4,-2,0]} intensity={1.1} color="#86bce5"/><group ref={group}>{spheres.map((s,i)=><mesh key={i} position={s.pos} scale={s.r}><sphereGeometry args={[1,36,28]}/><meshStandardMaterial color={i%3===0?"#c7dff0":"#b5d1e5"} roughness={.27} metalness={.12}/></mesh>)}</group></>;
}
