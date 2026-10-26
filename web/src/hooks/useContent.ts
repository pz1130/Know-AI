import { useMemo } from 'react'
import { usePrefs } from '../i18n/context'
import { t, ui } from '../i18n/ui'

import { layers, crossCuts, laws } from '../data/layers'
import { layersEn, crossCutsEn, lawsEn } from '../data/en/layers'

import {
  aAxis,
  bAxis,
  cellLabel,
  knobs,
  portrait,
  acceptanceQuestions,
} from '../data/grid'
import {
  aAxisEn,
  bAxisEn,
  cellLabelEn,
  knobsEn,
  portraitEn,
  acceptanceQuestionsEn,
  coarseRowsEn,
  coarseColsEn,
} from '../data/en/grid'

import { morphologies } from '../data/morphologies'
import { morphologiesEn } from '../data/en/morphologies'

import { triageSteps, hardConstraints } from '../data/triage'
import { triageStepsEn, hardConstraintsEn, resultLabelEn } from '../data/en/triage'

import { generalBaselines, formBaselines } from '../data/baselines'
import { generalBaselinesEn, formBaselinesEn } from '../data/en/baselines'
import { selfTest } from '../data/selftest'
import { selfTestEn } from '../data/en/selftest'

import { scoreDims, evaluateScores } from '../data/scoring'
import { scoreDimsEn, evaluateScoresEn } from '../data/en/scoring'

import { scenarios, dangerSignals, buildOrder } from '../data/scenarios'
import { scenariosEn, dangerSignalsEn, buildOrderEn } from '../data/en/scenarios'

import { terms, confusions, lectures, flashcards } from '../data/glossary'
import { termsEn, confusionsEn, lecturesEn, flashcardsEn } from '../data/en/glossary'

import type { ALevel, BLevel } from '../data/grid'
import type { MorphologyResult } from '../data/triage'

const coarseRowsZh = [
  { aLabel: 'A0–A1 人决策', aMin: 0 as ALevel, aMax: 1 as ALevel },
  { aLabel: 'A2 预定路径', aMin: 2 as ALevel, aMax: 2 as ALevel },
  { aLabel: 'A3 运行时生成', aMin: 3 as ALevel, aMax: 3 as ALevel },
]
const coarseColsZh = [
  { bLabel: 'B0–B1 只读', bMin: 0 as BLevel, bMax: 1 as BLevel },
  { bLabel: 'B2 写自身', bMin: 2 as BLevel, bMax: 2 as BLevel },
  { bLabel: 'B3 写业务', bMin: 3 as BLevel, bMax: 3 as BLevel },
]

function resultLabelZh(code: MorphologyResult): string {
  const map: Record<string, string> = {
    split: '拆分需求',
    closed: '封闭需求 · 模板/路由即可',
    gate: '流程自动化 + 强制人工门',
  }
  return map[code] ?? code
}

export function useUi() {
  const { locale } = usePrefs()
  return useMemo(
    () => ({
      locale,
      t: (leaf: { zh: string; en: string }) => t(leaf, locale),
      ui,
    }),
    [locale],
  )
}

export function useContent() {
  const { locale } = usePrefs()
  return useMemo(() => {
    const en = locale === 'en'
    return {
      locale,
      layers: en ? layersEn : layers,
      crossCuts: en ? crossCutsEn : crossCuts,
      laws: en ? lawsEn : laws,
      aAxis: en ? aAxisEn : aAxis,
      bAxis: en ? bAxisEn : bAxis,
      cellLabel: en ? cellLabelEn : cellLabel,
      knobs: en ? knobsEn : knobs,
      portrait: en ? portraitEn : portrait,
      acceptanceQuestions: en ? acceptanceQuestionsEn : acceptanceQuestions,
      coarseRows: en ? coarseRowsEn : coarseRowsZh,
      coarseCols: en ? coarseColsEn : coarseColsZh,
      morphologies: en ? morphologiesEn : morphologies,
      triageSteps: en ? triageStepsEn : triageSteps,
      hardConstraints: en ? hardConstraintsEn : hardConstraints,
      resultLabel: en ? resultLabelEn : resultLabelZh,
      generalBaselines: en ? generalBaselinesEn : generalBaselines,
      formBaselines: en ? formBaselinesEn : formBaselines,
      selfTest: en ? selfTestEn : selfTest,
      scoreDims: en ? scoreDimsEn : scoreDims,
      evaluateScores: en ? evaluateScoresEn : evaluateScores,
      scenarios: en ? scenariosEn : scenarios,
      dangerSignals: en ? dangerSignalsEn : dangerSignals,
      buildOrder: en ? buildOrderEn : buildOrder,
      terms: en ? termsEn : terms,
      confusions: en ? confusionsEn : confusions,
      lectures: en ? lecturesEn : lectures,
      flashcards: en ? flashcardsEn : flashcards,
      // 原文库固定中文源稿，不随 locale 切换 — 见 pages/Library.tsx
    }
  }, [locale])
}
