import type { DifyEvent } from './dify'
import type { WorkflowOutputs } from '../types'
import { NODE_META } from '../config'

export const MOCK_DIAGNOSIS = {
  status: 'ready',
  water_health_grade: '较差',
  problems: [
    {
      problem_name: '富营养化',
      severity: 0.86,
      confidence: 0.88,
      evidence: [
        'TN=2.9 mg/L、TP=0.21 mg/L，分别超出 GB 3838 Ⅴ类限值',
        '叶绿素 a=46 μg/L，藻类生物量偏高',
        '透明度仅 35 cm，DO=3.6 mg/L',
      ],
      evidence_type: '确定性证据',
      possible_mechanism: '外源氮磷输入叠加底泥内源释放，枯水期流速偏低导致藻类滞留',
    },
    {
      problem_name: '底泥内源污染',
      severity: 0.74,
      confidence: 0.66,
      evidence: ['底泥厚度 45 cm，历史淤积明显', 'DO 偏低，利于底泥磷释放', '沿河混接排口 7 个'],
      evidence_type: '推测性判断',
      possible_mechanism: '缺氧条件下铁结合态磷释放，形成内源负荷',
    },
    {
      problem_name: '生境退化',
      severity: 0.71,
      confidence: 0.79,
      evidence: ['岸线硬化率 68%', '水生植物覆盖率仅 8%', '鱼类多样性 Shannon=1.2'],
      evidence_type: '确定性证据',
      possible_mechanism: '硬质岸线切断水陆交错带，沉水植物定植条件不足',
    },
    {
      problem_name: '水动力不足',
      severity: 0.58,
      confidence: 0.62,
      evidence: ['流速 0.06 m/s', '水深 2.2 m，水体交换能力弱'],
      evidence_type: '推测性判断',
      possible_mechanism: '河道渠化与闸控调度削弱纵向连通性',
    },
    {
      problem_name: '自净能力下降',
      severity: 0.49,
      confidence: 0.55,
      evidence: ['DO=3.6 mg/L', '水生植物覆盖率 8%', '底泥有机质累积'],
      evidence_type: '推测性判断',
      possible_mechanism: '生产者与分解者结构失衡，氮磷循环效率下降',
    },
  ],
  limiting_factors: ['营养盐', '水动力', '生境结构'],
  missing_indicators: ['底泥 TN/TP 实测', '排口流量与水质', '鱼类群落完整名录'],
  health_dimensions: [
    { dimension: '水质', score: 38, note: '氮磷、有机物与叶绿素 a 偏高' },
    { dimension: '底泥', score: 46, note: '淤积明显，存在内源释放风险' },
    { dimension: '水动力', score: 52, note: '流速偏低，水体交换不足' },
    { dimension: '生境结构', score: 44, note: '岸线硬化率高，缓冲带缺失' },
    { dimension: '生物多样性', score: 35, note: '水生植物盖度与鱼类多样性偏低' },
  ],
}

export const MOCK_TOP3 = [
  {
    technology: '沉水植物恢复',
    total_score: 91.0,
    problem_match: 95,
    environment_match: 90,
    effect_score: 92,
    feasibility_score: 88,
    economic_score: 85,
    maintenance_score: 80,
    risk_score: 90,
    confidence: 0.7,
    cost_basis: '待成本库/询价校核',
    reason:
      '高度匹配富营养化与生境退化问题；流速、水深适宜，透明度 35 cm 处需先降浊。加分项为原生植被基础尚存；扣分项为运维投入与初期成活率风险。',
  },
  {
    technology: '生态缓冲带与岸线软化',
    total_score: 86.4,
    problem_match: 90,
    environment_match: 86,
    effect_score: 88,
    feasibility_score: 84,
    economic_score: 80,
    maintenance_score: 86,
    risk_score: 88,
    confidence: 0.74,
    cost_basis: '待成本库/询价校核',
    reason:
      '针对岸线硬化率 68% 与面源输入，可恢复水陆交错带并削减入河污染。可用土地 8000 m² 可支撑带状布置；扣分项为征地与管线协调不确定性。',
  },
  {
    technology: '底泥原位钝化 + 微曝气',
    total_score: 82.7,
    problem_match: 86,
    environment_match: 78,
    effect_score: 84,
    feasibility_score: 90,
    economic_score: 76,
    maintenance_score: 72,
    risk_score: 78,
    confidence: 0.61,
    cost_basis: '待成本库/询价校核',
    reason:
      '快速削减内源磷释放并改善 DO，适合作为沉水植物恢复的前置措施。扣分项为钝化剂长期生态风险与曝气能耗，需小试评估。',
  },
]

const MOCK_REPORT = `## 一、项目概况
项目位于江苏省南京市，治理对象为河流型水体，水域面积约 120,000 m²，治理河段长度 3,200 m。目标水质类别为Ⅳ类，期望修复周期 24 个月，预算与运维强度均为中等。沿河 7 个混接排口及上游农业面源是主要外源压力。

## 二、前期生态状况
现场监测显示：TN 2.9 mg/L、TP 0.21 mg/L、NH₃-N 1.4 mg/L、COD 38 mg/L、DO 3.6 mg/L、叶绿素 a 46 μg/L、透明度 35 cm、pH 7.8。流速 0.06 m/s，平均水深 2.2 m，底泥厚度 45 cm，岸线硬化率 68%，水生植物覆盖率 8%，鱼类多样性 Shannon 指数 1.2。

## 三、主要生态问题
依据指标组合关系，诊断出五项主要问题：**富营养化（严重度 0.86）**、**底泥内源污染（0.74）**、**生境退化（0.71）**、**水动力不足（0.58）**、**自净能力下降（0.49）**。前两项为确定性证据主导，后三项含专家推断成分。

## 四、关键限制因子
关键限制因子为**营养盐**、**水动力**与**生境结构**。氮磷负荷控制决定修复上限；低流速限制复氧与交换；硬质岸线与低植被盖度限制生物栖息地恢复。

## 五、修复目标
- 合规底线：TN、TP 稳定达到 GB 3838 Ⅳ类限值。
- 生态目标：水生植物覆盖率由 8% 提升至 25% 以上；岸线硬化率降至 40% 以下。
- 运行绩效：DO 年均不低于 4 mg/L，叶绿素 a 生长季均值不高于 25 μg/L。
- 目标类别由本项目输入决定，未默认采用Ⅲ类标准。

## 六、推荐修复方案
采用“**控源截污 + 生境重塑 + 植物恢复 + 适应性管理**”的组合路线：先完成排口治理与清水补给，再实施岸线软化与底质改良，最后分区定植沉水植物并建立监测反馈。

## 七、技术比选与推荐组合
| 排序 | 技术 | 总分 | 匹配度 | 环境适配 | 可实施性 | 置信度 |
|---|---|---|---|---|---|---|
| 1 | 沉水植物恢复 | 91.0 | 95 | 90 | 88 | 0.70 |
| 2 | 生态缓冲带与岸线软化 | 86.4 | 90 | 86 | 84 | 0.74 |
| 3 | 底泥原位钝化 + 微曝气 | 82.7 | 86 | 78 | 90 | 0.61 |

推荐组合：**沉水植物恢复、生态缓冲带与岸线软化、底泥原位钝化 + 微曝气**。

## 八、工程措施与关键设计参数
1. 沉水植物：以苦草、黑藻、金鱼藻为主，种植密度 15–25 株/m²，初期设置围隔与消浪设施。
2. 岸线软化：拆除硬质护岸 1.2 km，采用缓坡 + 生态护坡，缓冲带宽 5–8 m。
3. 底质改良：钝化剂投加量需经小试确定，曝气分区布置，避免全河段扰动。
4. 水文调度：结合闸控形成 0.08–0.12 m/s 的生态流速窗口。

## 九、空间布局与分区原则
按“**上游减量区—中游净化区—下游稳定区**”组织功能分区。具体岸线边界、排口位置与地下管线避让需待 GIS、断面测量与产权资料补充后确定，本阶段仅给功能分区原则。

## 十、生态-经济-社会可持续评价
方案以低能耗、低维护的原位生态措施为主，运行成本相对可控；沉水植物具备生境与景观协同效益。经济性评价目前为定性先验，成本数据待成本库或询价校核，不作为投资依据。

## 十一、实施时序与里程碑
- 第 0–3 月：排口整治、基线监测、方案深化与小试。
- 第 4–9 月：岸线软化、底质改良与水文调度。
- 第 10–18 月：分区植物定植与水生动物群落恢复。
- 第 19–24 月：效果评估、适应性调整与运维移交。

## 十二、成本概算框架
未接入成本库与工程量清单，本报告不填具体造价。概算科目包括：排口整治、岸线工程、底质改良、种植工程、监测与运维。计量单位分别为 m、m²、m³、株/ m²、次/年；价格基准年与单价均待询价确定。

## 十三、效果预测与达标判定
本次未收到 ML 预测 API 输出，**不生成确定去除率**。建议以 TN、TP、Chla、DO 与透明度为核心判定指标，采用修复前后同点位、同季节对比，并设置对照断面。预测所需输入包括水文气象、污染负荷与工程参数。

## 十四、监测与适应性管理
建立月度常规监测与季度生态调查机制，重点跟踪营养盐、藻类、DO、沉水植物盖度与鱼类多样性。设置阈值触发规则：Chla 连续两月高于 30 μg/L 时，启动藻类应急与污染源排查。

## 十五、风险、失败判据与退出/调整机制
主要风险包括：外源污染反弹、沉水植物定植失败、钝化剂生态风险、汛期冲淤。失败判据建议设为：24 个月后水生植物覆盖率低于 15%，或 TP 未稳定达到Ⅳ类。触发后应复核污染负荷并调整技术组合。

## 十六、需补充调查的数据
底泥 TN/TP 与有机质、排口流量与水质、鱼类与底栖动物完整名录、水下地形与断面、洪水位、地下管线与岸线产权资料。

## 十七、证据清单与参考依据
- GB 3838《地表水环境质量标准》
- HJ 1272—2022《生态保护修复成效评估技术指南（试行）》
- HJ 1295—2023《水生态监测技术指南 河流水生生物监测与评价（试行）》
- 知识库 KB01–KB06 检索证据（基础理论、问题诊断、修复技术、案例、效果数据、标准规范）
- 说明：案例经验仅作参考，不构成可直接迁移的工程成本或因果证据；缺少工程对照的结论标注“待同类工程实测复核”。`

const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal?.aborted) return reject(new DOMException('Aborted', 'AbortError'))
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort)
      resolve()
    }, ms)
    const onAbort = () => {
      clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
    }
    signal?.addEventListener('abort', onAbort, { once: true })
  })

const emit = (onEvent: (event: DifyEvent) => void, event: DifyEvent) => onEvent(event)

export async function runMock(
  onEvent: (event: DifyEvent) => void,
  signal?: AbortSignal,
): Promise<WorkflowOutputs> {
  const sequence: { id: string; delay: number; outputs?: Record<string, unknown> }[] = [
    { id: 'normalize', delay: 520 },
    {
      id: 'quality_check',
      delay: 460,
      outputs: {
        passed: true,
        errors: [],
        warnings: ['缺少底泥 TN/TP 实测值，内源污染判断置信度下调', '未提供排口流量，污染负荷核算待补充'],
      },
    },
    { id: 'retrieval_query', delay: 380 },
    { id: 'kb01', delay: 620 },
    { id: 'kb02', delay: 640 },
    { id: 'kb03', delay: 580 },
    { id: 'kb04', delay: 560 },
    { id: 'diagnose', delay: 1200 },
    { id: 'candidate', delay: 900 },
    { id: 'scoring', delay: 1050 },
    { id: 'top3', delay: 320 },
    { id: 'decision_query', delay: 340 },
    { id: 'case_match', delay: 620 },
    { id: 'standard', delay: 540 },
    { id: 'report', delay: 1500 },
  ]

  emit(onEvent, { event: 'node_started', data: { node_id: 'start', title: NODE_META.start.title } })
  emit(onEvent, {
    event: 'node_finished',
    data: { node_id: 'start', title: NODE_META.start.title, status: 'succeeded' },
  })

  for (const step of sequence) {
    const meta = NODE_META[step.id]
    emit(onEvent, {
      event: 'node_started',
      data: { node_id: step.id, title: meta?.title ?? step.id, node_type: 'mock' },
    })
    await sleep(step.delay, signal)
    emit(onEvent, {
      event: 'node_finished',
      data: {
        node_id: step.id,
        title: meta?.title ?? step.id,
        status: 'succeeded',
        outputs: step.outputs,
      },
    })
  }

  emit(onEvent, { event: 'node_started', data: { node_id: 'end', title: NODE_META.end.title } })
  emit(onEvent, {
    event: 'node_finished',
    data: { node_id: 'end', title: NODE_META.end.title, status: 'succeeded' },
  })

  const outputs: WorkflowOutputs = {
    final_report: MOCK_REPORT,
    diagnosis: JSON.stringify(MOCK_DIAGNOSIS),
    top3: MOCK_TOP3,
  }
  emit(onEvent, { event: 'workflow_finished', data: { status: 'succeeded', outputs } })
  return outputs
}
