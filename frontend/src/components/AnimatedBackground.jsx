import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random";

export default function AnimatedBackground() {
  // Generate random star positions (50,000 points)
  const sphere = random.inSphere(new Float32Array(5000 * 3), { radius: 1.5 });

  return (
    <div className="fixed inset-0 w-full h-full -z-10">
      <Canvas camera={{ position: [0, 0, 2], fov: 75 }}>
        <Points positions={sphere} stride={3} frustumCulled={false}>
          {/* glowing colored stars */}
          <PointMaterial
            transparent
            color="#00ffff" // cyan glow
            size={0.015}
            sizeAttenuation={true}
            depthWrite={false}
          />
        </Points>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
