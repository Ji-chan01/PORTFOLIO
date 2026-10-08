/**
 * inspect-glb.mjs
 * Lists all nodes, meshes, materials, triangle count, and texture sizes
 * in the computer_desk.glb model.
 *
 * Usage: node scripts/inspect-glb.mjs
 */

import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const glbPath = path.resolve(__dirname, '..', 'models-src', 'computer_desk.glb');

async function main() {
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
  const doc = await io.read(glbPath);
  const root = doc.getRoot();

  // File size
  const stats = fs.statSync(glbPath);
  console.log(`\n📁 File: ${glbPath}`);
  console.log(`📏 Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB\n`);

  // Nodes
  console.log('═══════════════════════════════════════');
  console.log('  NODES');
  console.log('═══════════════════════════════════════');
  const nodes = root.listNodes();
  nodes.forEach((node, i) => {
    const mesh = node.getMesh();
    const children = node.listChildren();
    const t = node.getTranslation();
    console.log(
      `  [${i}] "${node.getName() || '(unnamed)'}"` +
      (mesh ? ` → mesh: "${mesh.getName() || '(unnamed)'}"` : '') +
      ` | children: ${children.length}` +
      ` | pos: [${t.map(v => v.toFixed(2)).join(', ')}]`
    );
  });

  // Meshes
  console.log('\n═══════════════════════════════════════');
  console.log('  MESHES');
  console.log('═══════════════════════════════════════');
  const meshes = root.listMeshes();
  let totalTriangles = 0;
  meshes.forEach((mesh, i) => {
    const prims = mesh.listPrimitives();
    let meshTris = 0;
    prims.forEach((prim) => {
      const indices = prim.getIndices();
      const position = prim.getAttribute('POSITION');
      if (indices) {
        meshTris += indices.getCount() / 3;
      } else if (position) {
        meshTris += position.getCount() / 3;
      }
    });
    totalTriangles += meshTris;
    console.log(
      `  [${i}] "${mesh.getName() || '(unnamed)'}" — ${prims.length} primitive(s), ~${Math.round(meshTris)} triangles`
    );
  });
  console.log(`\n  Total triangles: ~${Math.round(totalTriangles)}`);

  // Materials
  console.log('\n═══════════════════════════════════════');
  console.log('  MATERIALS');
  console.log('═══════════════════════════════════════');
  const materials = root.listMaterials();
  materials.forEach((mat, i) => {
    const bc = mat.getBaseColorFactor();
    const rough = mat.getRoughnessFactor();
    const metal = mat.getMetallicFactor();
    const baseColorTex = mat.getBaseColorTexture();
    const normalTex = mat.getNormalTexture();
    const mrTex = mat.getMetallicRoughnessTexture();
    const emissiveTex = mat.getEmissiveTexture();
    const emissiveFactor = mat.getEmissiveFactor();
    console.log(
      `  [${i}] "${mat.getName() || '(unnamed)'}"` +
      ` | baseColor: [${bc.map(v => v.toFixed(2)).join(', ')}]` +
      ` | rough: ${rough.toFixed(2)} metal: ${metal.toFixed(2)}` +
      ` | emissive: [${emissiveFactor.map(v => v.toFixed(2)).join(', ')}]` +
      (baseColorTex ? ' | has baseColorTex' : '') +
      (normalTex ? ' | has normalTex' : '') +
      (mrTex ? ' | has mrTex' : '') +
      (emissiveTex ? ' | has emissiveTex' : '')
    );
  });

  // Textures
  console.log('\n═══════════════════════════════════════');
  console.log('  TEXTURES');
  console.log('═══════════════════════════════════════');
  const textures = root.listTextures();
  textures.forEach((tex, i) => {
    const image = tex.getImage();
    const mime = tex.getMimeType();
    const uri = tex.getURI();
    const sizeBytes = image ? image.byteLength : 0;
    const sizeKB = (sizeBytes / 1024).toFixed(1);
    console.log(
      `  [${i}] "${tex.getName() || '(unnamed)'}" — ${mime || 'unknown'}, ${sizeKB} KB` +
      (uri ? ` (${uri})` : '')
    );
  });

  // Look for screen/monitor/laptop/computer keywords
  console.log('\n═══════════════════════════════════════');
  console.log('  SCREEN/MONITOR/LAPTOP/DISPLAY SEARCH');
  console.log('═══════════════════════════════════════');
  const keywords = ['screen', 'monitor', 'laptop', 'display', 'computer', 'lcd', 'led'];
  let found = false;
  nodes.forEach((node, i) => {
    const name = (node.getName() || '').toLowerCase();
    const mesh = node.getMesh();
    const meshName = mesh ? (mesh.getName() || '').toLowerCase() : '';
    for (const kw of keywords) {
      if (name.includes(kw) || meshName.includes(kw)) {
        console.log(`  ✅ Node[${i}] "${node.getName()}" (mesh: "${mesh?.getName() || 'none'}")`);
        found = true;
        break;
      }
    }
  });
  if (!found) {
    console.log('  ❌ No screen/monitor/laptop meshes found by name.');
    console.log('  → A procedural monitor/laptop will be added in code.');
  }

  console.log('\n✅ Inspection complete.\n');
}

main().catch(console.error);
