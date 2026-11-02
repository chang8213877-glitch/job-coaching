export interface CompetencyItem {
  id: string;
  name: string;
  priority: 1 | 2; // 1 = 필수, 2 = 가산
}

export interface CertificateItem {
  id: string;
  name: string;
  priority: 1 | 2 | 3; // 1 = 우선 권장, 2 = 가산 가능, 3 = 참고
  comment: string;
}

export interface JobRole {
  id: string;
  name: string;
  shortDesc: string;
  competencies: CompetencyItem[];
  certificates: CertificateItem[];
  experiences: string[];
  roadmap: string[];
}

export const CERTIFICATE_PRIORITY_LABELS: Record<1 | 2 | 3, string> = {
  1: "우선 권장",
  2: "가산 가능",
  3: "참고",
};

export const COMPETENCY_PRIORITY_LABELS: Record<1 | 2, string> = {
  1: "필수",
  2: "가산",
};

export const JOB_ROLES: JobRole[] = [
  {
    id: "ev",
    name: "전동화·배터리 R&D",
    shortDesc: "배터리 시스템, 모터 및 전력변환, 차량 제어 모델링",
    competencies: [
      { id: "ev.s.0", name: "배터리·BMS 원리", priority: 1 },
      { id: "ev.s.1", name: "모터·전력전자", priority: 1 },
      { id: "ev.s.2", name: "제어공학·MBD(Simulink)", priority: 1 },
      { id: "ev.s.3", name: "CAN 등 차량 통신", priority: 2 },
      { id: "ev.s.4", name: "Python·C 기초", priority: 2 },
    ],
    certificates: [
      {
        id: "ev.c.0",
        name: "전기기사",
        priority: 2,
        comment: "전장·전력 분야 가산. 석·학사 연구 경험이 더 중요",
      },
      {
        id: "ev.c.1",
        name: "일반기계기사",
        priority: 3,
        comment: "열·구동계 직무에서 참고",
      },
    ],
    experiences: [
      "배터리·모터 관련 연구실·논문",
      "Simulink 제어 모델링 프로젝트",
      "전기차 관련 인턴",
    ],
    roadmap: [
      "전공 기초(회로·제어) 정리",
      "MBD 프로젝트 1건",
      "연구·인턴 경험 확보",
    ],
  },
  {
    id: "sdv",
    name: "SDV·임베디드 SW",
    shortDesc: "차량용 제어기 소프트웨어, AUTOSAR, 기능안전 표준",
    competencies: [
      { id: "sdv.s.0", name: "C/C++", priority: 1 },
      { id: "sdv.s.1", name: "임베디드·제어기 SW", priority: 1 },
      { id: "sdv.s.2", name: "AUTOSAR 개념", priority: 1 },
      { id: "sdv.s.3", name: "RTOS·Linux", priority: 2 },
      { id: "sdv.s.4", name: "Git·CI/CD", priority: 2 },
      { id: "sdv.s.5", name: "ISO 26262 기초", priority: 2 },
    ],
    certificates: [
      {
        id: "sdv.c.0",
        name: "정보처리기사",
        priority: 2,
        comment: "CS 기본기 증빙. 공고 우대사항 확인",
      },
      {
        id: "sdv.c.1",
        name: "ISO 26262·ASPICE 교육/인증",
        priority: 3,
        comment: "민간·국제 과정. 필수 아님, 이해도 어필용",
      },
      {
        id: "sdv.c.2",
        name: "리눅스마스터",
        priority: 3,
        comment: "리눅스 환경 경험 보완",
      },
    ],
    experiences: [
      "MCU 기반 제어 프로젝트",
      "자작차·로봇·자율주행 동아리",
      "AUTOSAR 실습 경험",
    ],
    roadmap: [
      "C/C++·자료구조 다지기",
      "MCU·RTOS 프로젝트",
      "AUTOSAR·기능안전 개념 학습",
    ],
  },
  {
    id: "ad",
    name: "자율주행·AI",
    shortDesc: "센서 퓨전, ROS2 인지 및 경로 계획, 인공지능 알고리즘",
    competencies: [
      { id: "ad.s.0", name: "Python·C++", priority: 1 },
      { id: "ad.s.1", name: "ROS/ROS2", priority: 1 },
      { id: "ad.s.2", name: "딥러닝·센서 융합", priority: 1 },
      { id: "ad.s.3", name: "Linux 개발환경", priority: 2 },
      { id: "ad.s.4", name: "수학·확률통계", priority: 2 },
    ],
    certificates: [
      {
        id: "ad.c.0",
        name: "ADsP·빅데이터분석기사",
        priority: 3,
        comment: "데이터 기본기. 직무 직접성은 낮음",
      },
      {
        id: "ad.c.1",
        name: "정보처리기사",
        priority: 3,
        comment: "SW 기본기 보완",
      },
    ],
    experiences: [
      "ROS 기반 프로젝트",
      "자율주행 대회·동아리",
      "논문·오픈소스 기여",
    ],
    roadmap: [
      "Python·수학 기초",
      "ROS2 + 인지/계획 프로젝트",
      "포트폴리오 정리",
    ],
  },
  {
    id: "it",
    name: "IT·앱·클라우드",
    shortDesc: "커넥티드 카 백엔드, 모빌리티 서비스 앱 및 클라우드 인프라",
    competencies: [
      { id: "it.s.0", name: "백엔드(Java/Spring·Python)", priority: 1 },
      { id: "it.s.1", name: "프론트·앱 개발", priority: 2 },
      { id: "it.s.2", name: "SQL·DB", priority: 1 },
      { id: "it.s.3", name: "클라우드·DevOps", priority: 2 },
      { id: "it.s.4", name: "보안 기초", priority: 2 },
    ],
    certificates: [
      {
        id: "it.c.0",
        name: "정보처리기사",
        priority: 2,
        comment: "IT 직군 기본 증빙",
      },
      {
        id: "it.c.1",
        name: "SQLD",
        priority: 3,
        comment: "데이터·DB 역량 보완",
      },
      {
        id: "it.c.2",
        name: "클라우드 자격(AWS 등)",
        priority: 3,
        comment: "클라우드 직무 가산",
      },
    ],
    experiences: [
      "서비스 개발 프로젝트·배포",
      "코딩테스트",
      "인포테인먼트·모빌리티 서비스 사례 분석",
    ],
    roadmap: [
      "언어 1개 + 프레임워크",
      "프로젝트 배포",
      "코딩테스트 준비",
    ],
  },
  {
    id: "mt",
    name: "생산기술",
    shortDesc: "차량 제조 라인 공정 설계, PLC 자동화 설비 및 스마트팩토리",
    competencies: [
      { id: "mt.s.0", name: "공정 설계·설비 이해", priority: 1 },
      { id: "mt.s.1", name: "PLC·자동화", priority: 2 },
      { id: "mt.s.2", name: "스마트팩토리·로봇", priority: 2 },
      { id: "mt.s.3", name: "안전·품질 기초", priority: 2 },
      { id: "mt.s.4", name: "원가·효율 분석", priority: 2 },
    ],
    certificates: [
      {
        id: "mt.c.0",
        name: "산업안전기사",
        priority: 1,
        comment: "현직자 답변에서 가장 많이 추천(현장·안전 어필)",
      },
      {
        id: "mt.c.1",
        name: "일반기계기사",
        priority: 2,
        comment: "기계 직무 범용성",
      },
      {
        id: "mt.c.2",
        name: "공조냉동기계기사",
        priority: 3,
        comment: "현직자가 대안으로 언급",
      },
      {
        id: "mt.c.3",
        name: "전기기사",
        priority: 3,
        comment: "설비·전기 제어 보완",
      },
      {
        id: "mt.c.4",
        name: "자동차정비기능사",
        priority: 3,
        comment: "기능사는 가치가 크지 않다는 의견도 있음",
      },
    ],
    experiences: [
      "현장실습·인턴",
      "자동화·로봇 프로젝트",
      "공정개선(개선안 수치화)",
    ],
    roadmap: [
      "산업안전기사 준비",
      "PLC·설비 프로젝트",
      "현장 경험 확보",
    ],
  },
  {
    id: "qa",
    name: "품질",
    shortDesc: "완성차 및 부품 품질 보증, 통계적 공정관리(SPC), IATF 16949",
    competencies: [
      { id: "qa.s.0", name: "통계적 품질관리(SPC)", priority: 1 },
      { id: "qa.s.1", name: "FMEA·8D·PPAP", priority: 1 },
      { id: "qa.s.2", name: "IATF 16949·ISO 9001 이해", priority: 1 },
      { id: "qa.s.3", name: "데이터 분석(엑셀·Minitab)", priority: 2 },
      { id: "qa.s.4", name: "자동차 구조·부품 이해", priority: 2 },
    ],
    certificates: [
      {
        id: "qa.c.0",
        name: "품질경영기사",
        priority: 2,
        comment: "의견 갈림: 자동차엔 큰 도움 안 된다는 답변과 유리하다는 답변이 공존",
      },
      {
        id: "qa.c.1",
        name: "6시그마 GB/BB",
        priority: 2,
        comment: "BB 수준 권장 의견, 효용이 낮다는 의견도 있음",
      },
      {
        id: "qa.c.2",
        name: "ADsP",
        priority: 3,
        comment: "데이터 기초 증빙",
      },
      {
        id: "qa.c.3",
        name: "IATF 16949·ISO 9001 교육",
        priority: 2,
        comment: "현직자가 실무 연관 교육으로 추천",
      },
      {
        id: "qa.c.4",
        name: "전기기사",
        priority: 3,
        comment: "전장 품질 직무에서 가산",
      },
    ],
    experiences: [
      "품질 관련 인턴·현장실습",
      "품질 개선 프로젝트(수치화)",
      "자동차 부품 불량 사례 분석",
    ],
    roadmap: [
      "SPC·통계 기초",
      "IATF·FMEA 학습",
      "인턴·프로젝트 확보",
    ],
  },
  {
    id: "bz",
    name: "구매·사업기획",
    shortDesc: "부품 협력사 조달 및 원가 절감, 공급망 관리(SCM), 사업 전략",
    competencies: [
      { id: "bz.s.0", name: "원가·협상·공급망", priority: 1 },
      { id: "bz.s.1", name: "데이터·엑셀 분석", priority: 1 },
      { id: "bz.s.2", name: "영어·글로벌 소통", priority: 1 },
      { id: "bz.s.3", name: "시장·산업 분석", priority: 2 },
      { id: "bz.s.4", name: "재무·손익 이해", priority: 2 },
    ],
    certificates: [
      {
        id: "bz.c.0",
        name: "어학(OPIc IH 이상 등)",
        priority: 1,
        comment: "현직자 답변에서 어학 점수 언급",
      },
      {
        id: "bz.c.1",
        name: "컴퓨터활용능력",
        priority: 3,
        comment: "문서·데이터 기본기",
      },
      {
        id: "bz.c.2",
        name: "ADsP",
        priority: 3,
        comment: "데이터 기초",
      },
      {
        id: "bz.c.3",
        name: "무역·물류 관련 자격",
        priority: 3,
        comment: "글로벌 사업·구매 보완(일반 정보)",
      },
    ],
    experiences: [
      "공급망·원가 분석 프로젝트",
      "해외 경험·교환학생",
      "산업 리포트 작성",
    ],
    roadmap: [
      "어학 점수 확보",
      "엑셀·데이터 분석",
      "산업·기업 분석 글 작성",
    ],
  },
];

export interface UnifiedCertificate {
  name: string;
  highestPriority: 1 | 2 | 3;
  roleReferences: {
    roleId: string;
    roleName: string;
    priority: 1 | 2 | 3;
    comment: string;
    itemId: string;
  }[];
}

export function getUnifiedCertificates(): UnifiedCertificate[] {
  const certMap = new Map<string, UnifiedCertificate>();

  JOB_ROLES.forEach((role) => {
    role.certificates.forEach((cert) => {
      const existing = certMap.get(cert.name);
      if (!existing) {
        certMap.set(cert.name, {
          name: cert.name,
          highestPriority: cert.priority,
          roleReferences: [
            {
              roleId: role.id,
              roleName: role.name,
              priority: cert.priority,
              comment: cert.comment,
              itemId: cert.id,
            },
          ],
        });
      } else {
        // Higher priority means lower number (1 > 2 > 3)
        if (cert.priority < existing.highestPriority) {
          existing.highestPriority = cert.priority;
        }
        existing.roleReferences.push({
          roleId: role.id,
          roleName: role.name,
          priority: cert.priority,
          comment: cert.comment,
          itemId: cert.id,
        });
      }
    });
  });

  return Array.from(certMap.values()).sort((a, b) => {
    if (a.highestPriority !== b.highestPriority) {
      return a.highestPriority - b.highestPriority;
    }
    return a.name.localeCompare(b.name, "ko-KR");
  });
}
