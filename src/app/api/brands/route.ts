// app/api/brands/route.ts
import { NextResponse } from 'next/server';

// 로컬 JSON 파일들을 내부적으로 임포트 (기존 매핑 객체 유지)
import bmwModels from '@/data/brands/0W5AWm.json';
import kiaModels from '@/data/brands/2oV0gK.json';
import jeepModels from '@/data/brands/6gakoO.json';
import toyotaModels from '@/data/brands/7gReZz.json';
import kgModels from '@/data/brands/bZ9GWp.json';
import infinityModels from '@/data/brands/BZpvWp.json';
import lexusModels from '@/data/brands/EW3do3.json';
import volvoModels from '@/data/brands/Jo6rOo.json';
import benzModels from '@/data/brands/lgBNgw.json';
import daewooModels from '@/data/brands/Lgyakg.json';
import volksModels from '@/data/brands/LZY3JW.json';
import hondaModels from '@/data/brands/NZONNo.json';
import porscheModels from '@/data/brands/qoA2Zr.json';
import landModels from '@/data/brands/QZq3WM.json';
import miniModels from '@/data/brands/Rg07Z0.json';
import audiModels from '@/data/brands/RgMAjg.json';
import polestarModels from '@/data/brands/RWlnAZ.json';
import genesisModels from '@/data/brands/vgm7Do.json';
import renaultModels from '@/data/brands/xgrX7o.json';
import hyundaiModels from '@/data/brands/xoKegB.json';
import teslaModels from '@/data/brands/xozX5g.json';
import nissanModels from '@/data/brands/6gaGko.json';
import lotusModels from '@/data/brands/BZpxvZ.json';
import lincolnModels from '@/data/brands/nWPkgx.json';
import maseratiModels from '@/data/brands/rWdrxZ.json';
import bydModels from '@/data/brands/xZvPwW.json';
import jaguarModels from '@/data/brands/KWnXZB.json';
import cadillacModels from '@/data/brands/roGpZy.json';
import fordModels from '@/data/brands/pZ2nZY.json';
import peugeotModels from '@/data/brands/wgNwQW.json';
import fiatModels from '@/data/brands/eo7QgO.json';

const brandModelsMap: Record<string, any> = {
  '0W5AWm': bmwModels,
  '2oV0gK': kiaModels,
  '6gakoO': jeepModels,
  '7gReZz': toyotaModels,
  bZ9GWp: kgModels,
  BZpvWp: infinityModels,
  EW3do3: lexusModels,
  Jo6rOo: volvoModels,
  lgBNgw: benzModels,
  Lgyakg: daewooModels,
  LZY3JW: volksModels,
  NZONNo: hondaModels,
  qoA2Zr: porscheModels,
  QZq3WM: landModels,
  Rg07Z0: miniModels,
  RgMAjg: audiModels,
  RWlnAZ: polestarModels,
  vgm7Do: genesisModels,
  xgrX7o: renaultModels,
  xoKegB: hyundaiModels,
  xozX5g: teslaModels,
  '6gaGko': nissanModels,
  BZpxvZ: lotusModels,
  nWPkgx: lincolnModels,
  rWdrxZ: maseratiModels,
  xZvPwW: bydModels,
  KWnXZB: jaguarModels,
  roGpZy: cadillacModels,
  pZ2nZY: fordModels,
  wgNwQW: peugeotModels,
  eo7QgO: fiatModels,
};

export async function GET() {
  return NextResponse.json({
    brandMap: brandModelsMap,
    allBrandsList: Object.values(brandModelsMap),
  });
}
