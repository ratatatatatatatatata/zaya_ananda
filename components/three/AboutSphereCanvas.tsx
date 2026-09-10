"use client";
import { Canvas } from "@react-three/fiber";
import { AboutSphereScene } from "./AboutSphereScene";
export default function AboutSphereCanvas() {
  return <Canvas dpr={[1,1.5]} camera={{position:[0,0,10],fov:40}} gl={{alpha:true,antialias:true,powerPreference:"low-power"}} style={{background:"transparent"}}><AboutSphereScene/></Canvas>;
}
