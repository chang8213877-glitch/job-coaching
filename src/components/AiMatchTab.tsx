import { useState } from "react";
import { JOB_ROLES } from "../data/rolesData";
import { GaugeProgressBar } from "./GaugeProgressBar";
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Loader2,
  Link as LinkIcon,
  UserCheck,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Award,
  BookOpen,
} from "lucide-react";

interface AiAnalysisResult {
  jobTitle: string;
  matchScore: number;
  matchGrade: string;
  jobSummary: string;
  overallAssessment: string;
  strengths: {
    title: string;
    matchRequirement: string;
    evidence: string;
    sellingTip: string;
  }[];
  weaknesses: {
    title: string;
    unmetRequirement: string;
    riskReason: string;
    defenseStrategy: string;
  }[];
  interviewQuestions: {
    type: string;
    question: string;
    intent: string;
    tip: string;
  }[];
  actionPlan: string[];
}

interface AiMatchTabProps {
  isChecked: (id: string) => boolean;
}

const SAMPLE_DATA = {
  ev: {
    roleId: "ev",
    url: "https://talent.hyundai.com/apply/spec/recruit.do?recruitNo=2024EV001",
    jobPostingText: `[현대자동차 / 배터리 시스템(BMS) 제어기 개발 신입 채용]
1. 담당 업무
- 전기차(EV) 고전압 배터리 관리 시스템(BMS) 제어 알고리즘 모델링 및 시뮬레이션
- MBD(Model-Based Design, MATLAB/Simulink) 기반 제어 로직 설계 및 Stateflow 로직 구현
- CAN/CAN-FD 통신 기반 제어기 데이터 분석 및 실차 검증

2. 지원 자격
- 전기전자공학, 제어계측, 기계공학 등 관련 전공 학사 이상
- 회로이론, 제어공학, 마이크로프로세서 기초 지식 보유자
- MATLAB/Simulink 툴 사용 경험 및 제어 모델링 가능자

3. 우대 사항
- BMS 또는 모터 제어 연구실(Lab) 학부연구생 또는 관련 논문/인턴 경험자
- 전기기사 자격증 보유자 (전장 전력 분야 가산)
- CANoe, CANalyzer 등 차량 네트워크 분석 툴 활용 경험자`,
    spec: {
      major: "수도권 4년제 대학교 전자전기공학부 (학점 3.82 / 4.5)",
      projects: `1. MATLAB/Simulink 기반 모터 속도 제어기 MBD 모델링 프로젝트 (학기 프로젝트)
- PI 제어기 튜닝 및 과도응답 오버슈트 5% 이내 저감
2. 캡스톤 디자인: 2륜 모빌리티용 배터리 팩 전류/전압 모니터링 보드 제작 및 CAN 통신 송수신 구현`,
      certs: "전기기사 1차 필기 합격 (실기 응시 예정), OPIc IM2, 컴퓨터활용능력 1급",
      experiences: "차세대 전력전자 연구실 학부연구생 6개월: 리튬이온 배터리 셀 충방전 데이터 수집 및 SoC 추정 기초 스터디",
      freeform: "차량 제어기 펌웨어 및 BMS 알고리즘에 관심이 많아 관련 전공 과목(제어공학 A0, 전력전자 A+)을 집중 이수했습니다.",
    },
  },
  sdv: {
    roleId: "sdv",
    url: "https://mobis.recruiter.co.kr/career/job/sdv-embedded-sw",
    jobPostingText: `[현대모비스 / SDV 임베디드 제어기 SW 개발]
1. 주요 업무
- 차세대 SDV 아키텍처 기반 차량 제어기(ECU) 펌웨어 및 BSW 디바이스 드라이버 개발
- AUTOSAR Classic 플랫폼 기반 컴포넌트(SWC) 설계 및 통합
- CAN, Ethernet 통신 프로토콜 스택 연동 및 실시간 제어 로직 구현

2. 지원 자격
- 컴퓨터공학, 전자공학, 소프트웨어 관련 학사 이상
- C/C++ 언어 숙련자 및 임베디드 시스템/OS 개념 보유자
- MCU(ARM Cortex-M 등) 제어 및 디버깅 경험자

3. 우대 사항
- AUTOSAR 플랫폼 실습 경험 또는 ISO 26262 기능안전 교육 이수자
- 정보처리기사 자격증 보유자
- 자작자동차, 로봇, 자율주행 SW 동아리 프로젝트 유경험자`,
    spec: {
      major: "지방 국립대 컴퓨터공학과 (학점 3.75 / 4.5)",
      projects: `1. STM32(ARM Cortex-M4) 기반 센서 모니터링 시스템 제작
- FreeRTOS 적용하여 멀티태스킹 스케줄링 구현 및 I2C/SPI 통신 센서 제어
2. 자율주행 소형차 제작: C++ 및 ROS2 기반 라이다 센서 데이터 수신 및 모터 PWM 제어`,
      certs: "정보처리기사 취득 완료, 리눅스마스터 2급, 토익 810점",
      experiences: "교내 임베디드 시스템 학술동아리 2년 활동 (임베디드 리눅스 환경 포팅 스터디 진행)",
      freeform: "AUTOSAR의 경우 개념 강의를 수강했으나 실차 상용 툴(EB tresos 등) 라이선스 실습 경험은 아직 부족합니다.",
    },
  },
  mt: {
    roleId: "mt",
    url: "https://talent.hyundai.com/apply/spec/recruit.do?recruitNo=2024MT003",
    jobPostingText: `[현대자동차 / 생산기술(차체·의장 조립 설비 자동화)]
1. 담당 업무
- 신차 양산 공정 라인 설계 및 설비 레이아웃 검토
- 차체 스폿 용접 및 조립 라인 산업용 로봇, PLC 설비 셋업 및 공정 자동화
- 스마트팩토리 데이터 기반 설비 가동률 분석 및 병목 공정 개선

2. 지원 자격
- 기계공학, 산업공학, 전기전자공학 학사 이상
- CAD 도면 판독 및 공정 설계 기초 역량 보유자
- 제조 현장 안전 관리 및 문제 해결 태도 보유자

3. 우대 사항
- 산업안전기사 자격증 취득자 (현장 우대)
- 일반기계기사 또는 공조냉동기계기사 보유자
- PLC 프로그래밍 또는 완성차/부품사 현장실습(인턴십) 경험자`,
    spec: {
      major: "수도권 사립대 기계공학과 (학점 3.68 / 4.5)",
      projects: `1. 기계요소설계 캡스톤: 조립 공정 자동화 지그(Jig) 3D 기구설계 (CATIA) 및 구조해석 (ANSYS)
2. 스마트 제조 전문인력 양성과정 (80시간): 미쓰비시 PLC 기초 래더 로직 실습`,
      certs: "산업안전기사 취득 완료, 일반기계기사 필기 합격, OPIc IH",
      experiences: "자동차 1차 부품 협력사 하계 6주 현장실습 (의장 라인 부품 공급 물류 흐름 개선 과제 참여)",
      freeform: "현장 엔지니어들과의 원활한 소통력과 안전제일 마인드를 갖추고 있으며, 공정 개선 아이디어를 수치화하는 역량이 있습니다.",
    },
  },
};

export function AiMatchTab({ isChecked }: AiMatchTabProps) {
  // Job Posting Inputs
  const [jobUrl, setJobUrl] = useState<string>(SAMPLE_DATA.ev.url);
  const [targetRoleId, setTargetRoleId] = useState<string>("ev");
  const [jobPostingText, setJobPostingText] = useState<string>(SAMPLE_DATA.ev.jobPostingText);
  const [showPostingDetail, setShowPostingDetail] = useState<boolean>(true);

  // Candidate Spec Inputs
  const [specMajor, setSpecMajor] = useState<string>(SAMPLE_DATA.ev.spec.major);
  const [specProjects, setSpecProjects] = useState<string>(SAMPLE_DATA.ev.spec.projects);
  const [specCerts, setSpecCerts] = useState<string>(SAMPLE_DATA.ev.spec.certs);
  const [specExperiences, setSpecExperiences] = useState<string>(SAMPLE_DATA.ev.spec.experiences);
  const [specFreeform, setSpecFreeform] = useState<string>(SAMPLE_DATA.ev.spec.freeform);

  // Analysis State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<AiAnalysisResult | null>(null);

  // Load from User's In-App Checklist
  const handleImportFromChecklist = () => {
    const role = JOB_ROLES.find((r) => r.id === targetRoleId) || JOB_ROLES[0];
    const checkedComps = role.competencies.filter((c) => isChecked(c.id));
    const checkedCerts = role.certificates.filter((c) => isChecked(c.id));

    let projectText = specProjects ? `${specProjects}\n` : "";
    let certText = specCerts ? `${specCerts}\n` : "";

    if (checkedComps.length > 0) {
      projectText += `[앱 가이드에서 체크한 역량]: ${checkedComps.map((c) => c.name).join(", ")}`;
    }
    if (checkedCerts.length > 0) {
      certText += `[앱 가이드에서 체크한 자격증]: ${checkedCerts.map((c) => `${c.name} (${c.comment})`).join(", ")}`;
    }

    setSpecProjects(projectText.trim());
    setSpecCerts(certText.trim());
  };

  const handleApplyPreset = (key: keyof typeof SAMPLE_DATA) => {
    const data = SAMPLE_DATA[key];
    setTargetRoleId(data.roleId);
    setJobUrl(data.url);
    setJobPostingText(data.jobPostingText);
    setSpecMajor(data.spec.major);
    setSpecProjects(data.spec.projects);
    setSpecCerts(data.spec.certs);
    setSpecExperiences(data.spec.experiences);
    setSpecFreeform(data.spec.freeform);
  };

  const handleRunAnalysis = async () => {
    if (!jobUrl.trim() && !jobPostingText.trim()) {
      setErrorMsg("지원할 공고의 링크(URL) 또는 공고 요건 내용을 입력해주세요.");
      return;
    }

    const hasAnySpec =
      specMajor.trim() ||
      specProjects.trim() ||
      specCerts.trim() ||
      specExperiences.trim() ||
      specFreeform.trim();

    if (!hasAnySpec) {
      setErrorMsg("지원자의 스펙(전공, 프로젝트, 자격증, 경험 등)을 하나 이상 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setResult(null);

    const targetRoleName = JOB_ROLES.find((r) => r.id === targetRoleId)?.name || "자동차 직무";

    try {
      const res = await fetch("/api/match-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobUrl: jobUrl.trim(),
          jobPostingText: jobPostingText.trim(),
          targetRole: targetRoleName,
          candidateSpec: {
            major: specMajor,
            projects: specProjects,
            certs: specCerts,
            experiences: specExperiences,
            freeform: specFreeform,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "분석 요청에 실패했습니다.");
      }

      setResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <section className="bg-[var(--sf)] border border-[var(--line)] rounded-[8px] p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-[6px] bg-[var(--ac)] text-[var(--acink)] shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-[var(--ink)] tracking-tight">
              AI 공고 부합도 & 강점·약점 진단 시스템
            </h2>
            <p className="text-[13.5px] text-[var(--mute)] mt-1 leading-relaxed">
              지원할 <strong>채용공고 링크(URL)</strong>와 본인의 <strong>스펙(전공, 프로젝트, 자격증, 경험)</strong>을 입력하면, AI가 해당 공고에서 어디가 독보적인 강점이고 어디가 치명적인 약점인지를 정밀 분석해 드립니다.
            </p>
          </div>
        </div>
      </section>

      {/* Preset Quick Select */}
      <div className="flex items-center gap-2 flex-wrap text-[13px] px-1">
        <span className="font-semibold text-[var(--ink)]">체험용 프리셋:</span>
        <button
          type="button"
          onClick={() => handleApplyPreset("ev")}
          className="px-2.5 py-1 text-[12px] font-medium rounded-[4px] bg-[var(--line-subtle)] hover:bg-[var(--line)] text-[var(--ink)] border border-[var(--line)] transition-colors cursor-pointer"
        >
          전동화 BMS R&D (전자공학)
        </button>
        <button
          type="button"
          onClick={() => handleApplyPreset("sdv")}
          className="px-2.5 py-1 text-[12px] font-medium rounded-[4px] bg-[var(--line-subtle)] hover:bg-[var(--line)] text-[var(--ink)] border border-[var(--line)] transition-colors cursor-pointer"
        >
          SDV SW 개발 (컴공)
        </button>
        <button
          type="button"
          onClick={() => handleApplyPreset("mt")}
          className="px-2.5 py-1 text-[12px] font-medium rounded-[4px] bg-[var(--line-subtle)] hover:bg-[var(--line)] text-[var(--ink)] border border-[var(--line)] transition-colors cursor-pointer"
        >
          생산기술 설비 (기계공학)
        </button>
      </div>

      {/* Main 2-Column Split: Job Posting vs Candidate Spec */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ================= COLUMN 1: JOB POSTING ================= */}
        <section
          aria-labelledby="job-posting-heading"
          className="bg-[var(--sf)] border border-[var(--line)] rounded-[8px] p-4 sm:p-5 flex flex-col justify-between space-y-4"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-2.5">
              <h3
                id="job-posting-heading"
                className="text-[16px] font-bold text-[var(--ink)] flex items-center gap-2"
              >
                <LinkIcon className="w-4 h-4 text-[var(--ac)]" />
                1. 지원할 공고 정보
              </h3>
              <select
                value={targetRoleId}
                onChange={(e) => setTargetRoleId(e.target.value)}
                aria-label="목표 직무 선택"
                className="text-[12.5px] font-medium bg-[var(--bg)] border border-[var(--line)] rounded-[4px] px-2 py-1 text-[var(--ink)] cursor-pointer"
              >
                {JOB_ROLES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Field A: Job Posting URL */}
            <div className="space-y-1.5">
              <label
                htmlFor="job-url-input"
                className="text-[13.5px] font-bold text-[var(--ink)] flex items-center gap-1.5"
              >
                공고 링크 (URL)
                <span className="text-[12px] font-normal text-[var(--mute)]">
                  (현대차, 모비스, 협력사, 사람인/잡코리아 등)
                </span>
              </label>
              <div className="relative">
                <input
                  id="job-url-input"
                  type="url"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="https://talent.hyundai.com/... 또는 공고 링크 붙여넣기"
                  className="w-full text-[13px] px-3 py-2.5 rounded-[6px] bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)] focus:border-[var(--ac)] focus:outline-hidden font-mono"
                />
              </div>
            </div>

            {/* Field B: Job Requirements Text (collapsible or open) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="job-text-input"
                  className="text-[13.5px] font-bold text-[var(--ink)]"
                >
                  공고 상세 요건 (직접 입력 / 보완)
                </label>
                <button
                  type="button"
                  onClick={() => setShowPostingDetail(!showPostingDetail)}
                  className="text-[12px] text-[var(--mute)] hover:text-[var(--ink)] flex items-center gap-1 cursor-pointer"
                >
                  {showPostingDetail ? (
                    <>
                      접기 <ChevronUp className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      펼치기 <ChevronDown className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {showPostingDetail && (
                <textarea
                  id="job-text-input"
                  rows={8}
                  value={jobPostingText}
                  onChange={(e) => setJobPostingText(e.target.value)}
                  placeholder="공고의 주요 업무, 자격요건, 우대사항 텍스트를 붙여넣으시면 분석 정확도가 극대화됩니다..."
                  className="w-full text-[13px] p-3 rounded-[6px] bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)] leading-relaxed focus:border-[var(--ac)] focus:outline-hidden resize-none font-mono"
                />
              )}
            </div>
          </div>

          <div className="text-[12px] text-[var(--mute)] bg-[var(--line-subtle)]/60 p-2.5 rounded-[6px] leading-relaxed">
            * 링크(URL)만 입력해도 AI가 접근 가능한 웹 정보를 참조하며, 채용 공고의 자격/우대사항 텍스트를 함께 기재하시면 더욱 정밀하게 분석합니다.
          </div>
        </section>

        {/* ================= COLUMN 2: CANDIDATE SPEC ================= */}
        <section
          aria-labelledby="candidate-spec-heading"
          className="bg-[var(--sf)] border border-[var(--line)] rounded-[8px] p-4 sm:p-5 flex flex-col justify-between space-y-4"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-2.5">
              <h3
                id="candidate-spec-heading"
                className="text-[16px] font-bold text-[var(--ink)] flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4 text-[var(--ac)]" />
                2. 지원자 스펙 (Spec) 입력
              </h3>

              <button
                type="button"
                onClick={handleImportFromChecklist}
                title="앱 내 가이드에서 체크한 역량과 자격증을 스펙란에 자동으로 채웁니다"
                className="text-[12px] font-semibold text-[var(--ac)] hover:bg-[var(--line-subtle)] border border-[var(--ac)] rounded-[4px] px-2 py-1 transition-colors cursor-pointer flex items-center gap-1 shrink-0"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                내 체크리스트 불러오기
              </button>
            </div>

            {/* Spec 1: Major & GPA */}
            <div className="space-y-1">
              <label
                htmlFor="spec-major-input"
                className="text-[13px] font-semibold text-[var(--ink)] flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-[var(--ac)]" />
                학력 / 전공 및 학점
              </label>
              <input
                id="spec-major-input"
                type="text"
                value={specMajor}
                onChange={(e) => setSpecMajor(e.target.value)}
                placeholder="예: 수도권 4년제 전자전기공학부 (학점 3.8 / 4.5)"
                className="w-full text-[13px] px-3 py-2 rounded-[6px] bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)] focus:border-[var(--ac)] focus:outline-hidden"
              />
            </div>

            {/* Spec 2: Projects & Lab */}
            <div className="space-y-1">
              <label
                htmlFor="spec-projects-input"
                className="text-[13px] font-semibold text-[var(--ink)]"
              >
                핵심 프로젝트 & 연구/실습 경험
              </label>
              <textarea
                id="spec-projects-input"
                rows={3}
                value={specProjects}
                onChange={(e) => setSpecProjects(e.target.value)}
                placeholder="예: Simulink 모터 제어 MBD 모델링, 배터리 충방전 데이터 분석 등"
                className="w-full text-[13px] p-2.5 rounded-[6px] bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)] leading-relaxed focus:border-[var(--ac)] focus:outline-hidden resize-none"
              />
            </div>

            {/* Spec 3: Certs & Languages */}
            <div className="space-y-1">
              <label
                htmlFor="spec-certs-input"
                className="text-[13px] font-semibold text-[var(--ink)] flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5 text-[var(--sig)]" />
                보유 자격증 & 어학 성적
              </label>
              <input
                id="spec-certs-input"
                type="text"
                value={specCerts}
                onChange={(e) => setSpecCerts(e.target.value)}
                placeholder="예: 전기기사 실기 응시 예정, 산업안전기사 취득, OPIc IH, 토익 850"
                className="w-full text-[13px] px-3 py-2 rounded-[6px] bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)] focus:border-[var(--ac)] focus:outline-hidden"
              />
            </div>

            {/* Spec 4: Intern & Extracurricular */}
            <div className="space-y-1">
              <label
                htmlFor="spec-exp-input"
                className="text-[13px] font-semibold text-[var(--ink)]"
              >
                인턴, 연구실, 자작차 동아리 및 대외활동
              </label>
              <textarea
                id="spec-exp-input"
                rows={2}
                value={specExperiences}
                onChange={(e) => setSpecExperiences(e.target.value)}
                placeholder="예: 배터리 연구실 학부연구생 6개월, 자작자동차 동아리 섀시팀장, 부품사 인턴 등"
                className="w-full text-[13px] p-2.5 rounded-[6px] bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)] leading-relaxed focus:border-[var(--ac)] focus:outline-hidden resize-none"
              />
            </div>

            {/* Spec 5: Additional Notes */}
            <div className="space-y-1">
              <label
                htmlFor="spec-freeform-input"
                className="text-[13px] font-semibold text-[var(--mute)]"
              >
                기타 역량 및 어필 사항 (선택)
              </label>
              <input
                id="spec-freeform-input"
                type="text"
                value={specFreeform}
                onChange={(e) => setSpecFreeform(e.target.value)}
                placeholder="예: CANoe 통신 툴 기초 활용 가능, C언어 알고리즘 스터디 등"
                className="w-full text-[13px] px-3 py-2 rounded-[6px] bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)] focus:border-[var(--ac)] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="text-[12px] text-[var(--mute)]">
            * 작성된 스펙과 공고의 요건을 하나하나 대조하여 지원자의 강점과 약점을 분류합니다.
          </div>
        </section>
      </div>

      {/* Action CTA Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-[var(--sf)] border border-[var(--line)] rounded-[8px]">
        <div className="text-[13px] text-[var(--mute)]">
          공고 링크와 스펙을 기반으로 <strong>맞춤형 강점·약점·면접 예상 질문</strong>을 도출합니다.
        </div>
        <button
          type="button"
          onClick={handleRunAnalysis}
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-2.5 bg-[var(--ac)] hover:bg-[var(--ac-hover)] text-[var(--acink)] font-bold text-[14.5px] rounded-[6px] transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-xs shrink-0"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              공고 및 스펙 대조 분석 중...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              AI 공고 강점·약점 심층 분석 실행
            </>
          )}
        </button>
      </div>

      {/* Error Message with One-Click Retry */}
      {errorMsg && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 rounded-[8px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[14px]">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900 dark:text-amber-200 m-0">
                AI 분석 안내 (일시적 트래픽 집중)
              </p>
              <p className="text-[13px] text-amber-800 dark:text-amber-300 mt-0.5 m-0 leading-relaxed">
                {errorMsg}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRunAnalysis}
            disabled={isLoading}
            className="px-4 py-2 text-[13px] font-bold text-white bg-[var(--ac)] hover:bg-[var(--ac-hover)] rounded-[6px] transition-colors cursor-pointer shrink-0 shadow-xs flex items-center justify-center gap-1.5 self-start sm:self-auto"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            다시 시도
          </button>
        </div>
      )}

      {/* ================= RESULTS VIEW ================= */}
      {result && (
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* Top Overall Assessment & Score */}
          <section className="bg-[var(--sf)] border border-[var(--line)] rounded-[8px] p-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
              <div>
                <span className="text-[12px] font-bold text-[var(--ac)] tracking-wider uppercase">
                  {result.jobTitle}
                </span>
                <div className="flex items-center gap-2.5 mt-1">
                  <h3 className="text-[22px] sm:text-[26px] font-extrabold text-[var(--ink)]">
                    공고 부합도 <span className="font-mono text-[var(--ac)]">{result.matchScore}%</span>
                  </h3>
                  <span className="px-2.5 py-0.5 text-[12px] font-bold rounded-[4px] bg-[var(--ac)] text-[var(--acink)]">
                    {result.matchGrade}
                  </span>
                </div>
                <p className="text-[13.5px] text-[var(--mute)] mt-1.5 leading-relaxed">
                  <strong>공고 핵심 요건:</strong> {result.jobSummary}
                </p>
              </div>
            </div>

            <GaugeProgressBar
              percent={result.matchScore}
              showPercentText={false}
              className="mb-4"
            />

            <div className="p-3.5 bg-[var(--line-subtle)] rounded-[6px] text-[14px] text-[var(--ink)] leading-relaxed">
              <strong>종합 진단 총평:</strong> {result.overallAssessment}
            </div>
          </section>

          {/* ================= STRENGTHS & WEAKNESSES SPLIT ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* STRENGTHS CARD */}
            <section
              aria-labelledby="strengths-heading"
              className="bg-[var(--sf)] border border-[var(--ok)]/40 rounded-[8px] p-5 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
                <h4
                  id="strengths-heading"
                  className="text-[16.5px] font-bold text-[var(--ink)] flex items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5 text-[var(--ok)] shrink-0" />
                  지원자의 확실한 강점 ({result.strengths.length})
                </h4>
                <span className="text-[12px] font-semibold text-[var(--ok)]">
                  서류 합격 셀링 포인트
                </span>
              </div>

              <div className="space-y-3.5">
                {result.strengths.map((s, idx) => (
                  <article
                    key={idx}
                    className="p-3.5 bg-[var(--line-subtle)]/60 border border-[var(--line-subtle)] rounded-[6px] space-y-2 text-[13.5px]"
                  >
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-[var(--ok)] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        +{idx + 1}
                      </span>
                      <h5 className="font-bold text-[var(--ink)] text-[14.5px]">
                        {s.title}
                      </h5>
                    </div>

                    <div className="text-[13px] text-[var(--mute)] pl-7">
                      <strong className="text-[var(--ink)]">공고 매칭 요건:</strong> {s.matchRequirement}
                    </div>

                    <div className="text-[13px] text-[var(--ink)] pl-7">
                      <strong>스펙 근거:</strong> {s.evidence}
                    </div>

                    <div className="mt-2 pt-2 border-t border-[var(--line)]/50 pl-7 text-[13px] text-[var(--ok)] dark:text-emerald-400 font-medium leading-relaxed">
                      💡 <strong>자소서/면접 어필 전략:</strong> {s.sellingTip}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* WEAKNESSES CARD */}
            <section
              aria-labelledby="weaknesses-heading"
              className="bg-[var(--sf)] border border-[var(--sig)]/40 rounded-[8px] p-5 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
                <h4
                  id="weaknesses-heading"
                  className="text-[16.5px] font-bold text-[var(--ink)] flex items-center gap-2"
                >
                  <AlertTriangle className="w-5 h-5 text-[var(--sig)] shrink-0" />
                  공고 대비 취약점 & 약점 ({result.weaknesses.length})
                </h4>
                <span className="text-[12px] font-semibold text-[var(--sig)]">
                  탈락 리스크 및 방어 필수
                </span>
              </div>

              <div className="space-y-3.5">
                {result.weaknesses.map((w, idx) => (
                  <article
                    key={idx}
                    className="p-3.5 bg-[var(--line-subtle)]/60 border border-[var(--line-subtle)] rounded-[6px] space-y-2 text-[13.5px]"
                  >
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-[var(--sig)] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        !{idx + 1}
                      </span>
                      <h5 className="font-bold text-[var(--ink)] text-[14.5px]">
                        {w.title}
                      </h5>
                    </div>

                    <div className="text-[13px] text-[var(--mute)] pl-7">
                      <strong className="text-[var(--ink)]">미비 요건:</strong> {w.unmetRequirement}
                    </div>

                    <div className="text-[13px] text-red-700 dark:text-red-400 pl-7">
                      <strong>탈락/감점 우려 리스크:</strong> {w.riskReason}
                    </div>

                    <div className="mt-2 pt-2 border-t border-[var(--line)]/50 pl-7 text-[13px] text-[var(--ink)] font-medium leading-relaxed bg-[var(--sf)]/70 p-2 rounded-[4px]">
                      🛡️ <strong>면접 방어 논리 & 단기 대책:</strong> {w.defenseStrategy}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          {/* Interview Questions Section */}
          <section
            aria-labelledby="interview-heading"
            className="bg-[var(--sf)] border border-[var(--line)] rounded-[8px] p-5 space-y-4"
          >
            <h4
              id="interview-heading"
              className="text-[16px] font-bold text-[var(--ink)] flex items-center gap-2 pb-2.5 border-b border-[var(--line)]"
            >
              <HelpCircle className="w-5 h-5 text-[var(--ac)] shrink-0" />
              강점·약점 기반 실전 면접 예상 질문 & 답변 가이드
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {result.interviewQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-[var(--line-subtle)]/70 border border-[var(--line-subtle)] rounded-[6px] flex flex-col justify-between space-y-2"
                >
                  <div className="space-y-1.5">
                    <span className="inline-block px-1.5 py-0.5 text-[11px] font-bold rounded-[3px] bg-[var(--ac)] text-[var(--acink)]">
                      {q.type}
                    </span>
                    <p className="text-[14px] font-bold text-[var(--ink)] leading-snug">
                      "{q.question}"
                    </p>
                    <p className="text-[12.5px] text-[var(--mute)] leading-relaxed">
                      <strong>출제 의도:</strong> {q.intent}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[var(--line)] text-[12.5px] text-[var(--ok)] dark:text-emerald-400 font-medium leading-relaxed">
                    <strong>추천 답변 팁:</strong> {q.tip}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Action Plan */}
          <section
            aria-labelledby="action-heading"
            className="bg-[var(--sf)] border border-[var(--line)] rounded-[8px] p-5 space-y-3"
          >
            <h4
              id="action-heading"
              className="text-[16px] font-bold text-[var(--ink)] flex items-center gap-2 pb-2.5 border-b border-[var(--line)]"
            >
              <ArrowRight className="w-5 h-5 text-[var(--ok)] shrink-0" />
              지원 직전 서류/스펙 3대 필수 실행 액션 플랜
            </h4>
            <ol className="space-y-2.5 text-[14px] text-[var(--ink)]">
              {result.actionPlan.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="font-mono font-bold text-[var(--ac)] shrink-0">
                    Step {idx + 1}.
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      )}
    </div>
  );
}
