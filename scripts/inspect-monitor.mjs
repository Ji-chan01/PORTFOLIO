/**
 * Inspect the Monitor mesh bounding box in the ORIGINAL GLB.
 * Usage: node scripts/inspect-monitor.mjs
 */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read('models-src/computer_desk.glb');
const root = doc.getRoot();
const nodes = root.listNodes();

for (const node of nodes) {
  const name = node.getName();
  if (name === 'Monitor' || name === 'Monitor_Monitor_0' || name === 'Computer' || name === 'Computer_Computer_0') {
    const t = node.getTranslation();
    const s = node.getScale();
    const r = node.getRotation();
    console.log(`\nNode: "${name}"`);
    console.log('  translation:', t);
    console.log('  scale:', s);
    console.log('  rotation:', r);

    const mesh = node.getMesh();
    if (mesh) {
      const prim = mesh.listPrimitives()[0];
      const pos = prim.getAttribute('POSITION');
      let min = [Infinity, Infinity, Infinity];
      let max = [-Infinity, -Infinity, -Infinity];
      for (let i = 0; i < pos.getCount(); i++) {
        const v = pos.getElement(i, [0, 0, 0]);
        for (let j = 0; j < 3; j++) {
          if (v[j] < min[j]) min[j] = v[j];
          if (v[j] > max[j]) max[j] = v[j];
        }
      }
      console.log('  mesh AABB min:', min.map(v => v.toFixed(4)));
      console.log('  mesh AABB max:', max.map(v => v.toFixed(4)));
      const center = min.map((m, i) => (m + max[i]) / 2);
      const size = min.map((m, i) => max[i] - m);
      console.log('  mesh center:', center.map(v => v.toFixed(4)));
      console.log('  mesh size:', size.map(v => v.toFixed(4)));
    }
  }
}
