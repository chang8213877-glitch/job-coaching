import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "5mb" }));

// Server-side Gemini AI initialization
const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Helper: sleep
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper: Scrape basic text from URL if accessible
async function fetchUrlContent(url: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    clearTimeout(timeout);
    if (!response.ok) return "";
    const html = await response.text();

    const cleanText = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return cleanText.slice(0, 3000);
  } catch {
    return "";
  }
}

const ANALYSIS_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    jobTitle: {
      type: Type.STRING,
      description: "공고 또는 직무의 명칭 (예: 현대모비스 전동화 제어시스템 개발)",
    },
    matchScore: {
      type: Type.INTEGER,
      description: "0부터 100 사이의 객관적인 공고 부합도 점수",
    },
    matchGrade: {
      type: Type.STRING,
      description: "적합도 등급 (최상위 적합, 양호한 부합, 보통(보완 필요), 추가 준비 필요 중 하나)",
    },
    jobSummary: {
      type: Type.STRING,
      description: "공고에서 가장 중요하게 요구하는 핵심 역량 및 기술 스택 1~2문장 요약",
    },
    overallAssessment: {
      type: Type.STRING,
      description: "지원자 스펙과 공고 간의 종합 진단 총평 (2~3문장)",
    },
    strengths: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: "공고 맞춤 핵심 강점 제목",
          },
          matchRequirement: {
            type: Type.STRING,
            description: "공고의 어떤 필수/우대요건과 일치하는지",
          },
          evidence: {
            type: Type.STRING,
            description: "지원자 스펙의 구체적 근거 (프로젝트, 전공, 경험 등)",
          },
          sellingTip: {
            type: Type.STRING,
            description: "자소서 및 면접에서 서류 통과율을 높이기 위해 어필할 구체적 전략",
          },
        },
        required: ["title", "matchRequirement", "evidence", "sellingTip"],
      },
      description: "공고와 직결되는 핵심 강점 2~4개",
    },
    weaknesses: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: "공고 대비 핵심 약점 및 부족한 점 제목",
          },
          unmetRequirement: {
            type: Type.STRING,
            description: "공고에서 요구/우대하나 지원자 스펙에서 누락되었거나 부족한 요건",
          },
          riskReason: {
            type: Type.STRING,
            description: "채용관 관점에서 서류 탈락이나 면접 감점 원인이 될 수 있는 리스크 요인",
          },
          defenseStrategy: {
            type: Type.STRING,
            description: "면접 시 공격 질문 방어 논리 또는 서류 제출 전 단기 보완 조언",
          },
        },
        required: ["title", "unmetRequirement", "riskReason", "defenseStrategy"],
      },
      description: "공고 대비 아쉬운 점 및 약점 2~3개",
    },
    interviewQuestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: {
            type: Type.STRING,
            description: "질문 유형 (강점 검증 질문 또는 약점 압박 질문)",
          },
          question: {
            type: Type.STRING,
            description: "실제 기술/직무 면접에서 면접관이 던질 예상 질문",
          },
          intent: {
            type: Type.STRING,
            description: "면접관의 의도",
          },
          tip: {
            type: Type.STRING,
            description: "추천 모범 답변 방향",
          },
        },
        required: ["type", "question", "intent", "tip"],
      },
      description: "강점과 약점에 기반한 실전 면접 예상 질문 3가지",
    },
    actionPlan: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "지원 직전 자소서/포트폴리오에서 보완해야 할 3대 액션 플랜",
    },
  },
  required: [
    "jobTitle",
    "matchScore",
    "matchGrade",
    "jobSummary",
    "overallAssessment",
    "strengths",
    "weaknesses",
    "interviewQuestions",
    "actionPlan",
  ],
};

// API: Resume vs Job Posting Matching Analysis (Strengths & Weaknesses)
app.post("/api/match-resume", async (req, res) => {
  try {
    const { jobUrl, jobPostingText, candidateSpec, targetRole } = req.body;

    const hasUrl = typeof jobUrl === "string" && jobUrl.trim().length > 0;
    const hasText = typeof jobPostingText === "string" && jobPostingText.trim().length > 0;

    if (!hasUrl && !hasText) {
      res.status(400).json({
        error: "지원할 채용공고의 링크(URL) 또는 공고 요건 내용을 입력해주세요.",
      });
      return;
    }

    if (!candidateSpec || (typeof candidateSpec === "string" && !candidateSpec.trim())) {
      res.status(400).json({
        error: "지원자의 스펙(전공, 프로젝트, 자격증, 경험 등)을 입력해주세요.",
      });
      return;
    }

    if (!apiKey) {
      res.status(500).json({
        error: "서버에 GEMINI_API_KEY가 설정되어 있지 않습니다. AI Studio의 Settings > Secrets에서 키를 등록해주세요.",
      });
      return;
    }

    // Attempt URL scrape fallback if URL is provided
    let scrapedSnippet = "";
    if (hasUrl) {
      try {
        scrapedSnippet = await fetchUrlContent(jobUrl.trim());
      } catch {
        scrapedSnippet = "";
      }
    }

    let candidateFormatted = "";
    if (typeof candidateSpec === "string") {
      candidateFormatted = candidateSpec;
    } else {
      const { major, projects, certs, experiences, freeform } = candidateSpec;
      candidateFormatted = `
[학력 및 전공]: ${major || "미기재"}
[핵심 프로젝트 및 연구 경험]:
${projects || "미기재"}
[보유 자격증 및 어학]:
${certs || "미기재"}
[인턴 및 실무/대외활동]:
${experiences || "미기재"}
[기타 추가 스펙 및 세부 이력]:
${freeform || "미기재"}
      `.trim();
    }

    const prompt = `[목표 직무 분야]
${targetRole || "자동차 제조업 채용 직무"}

[지원할 공고 링크 (URL)]
${hasUrl ? jobUrl.trim() : "URL 미제공"}

${scrapedSnippet ? `[공고 링크에서 추출된 웹 콘텐츠 미리보기]\n${scrapedSnippet}\n` : ""}

[채용공고 상세 요건 (직무 소개 / 자격 요건 / 우대 사항)]
${hasText ? jobPostingText.trim() : "(링크 기반 분석)"}

[지원자의 상세 스펙 및 준비 이력]
${candidateFormatted}

[분석 요구사항]
위 채용공고(링크 및 요건)와 지원자의 스펙을 엄밀하고 현실적으로 대조해주세요.
대한민국 자동차 제조업(완성차 및 1차 협력사)의 실제 채용 평가 기준(단순 암기식 자격증보다는 프로젝트, 실무 툴, 연구실/인턴, 제어기/공정 경험 중시)을 반영하여:
1. 지원자가 해당 공고에서 어필할 수 있는 확실한 '강점(Strengths)' 2~4가지를 도출하고, 자소서/면접 활용 팁을 제시하세요.
2. 지원자가 해당 공고 대비 결핍되었거나 취약한 '약점(Weaknesses/Gaps)' 2~3가지를 명확히 짚어내고, 탈락 리스크와 이를 방어할 논리/대응책을 제시하세요.
3. 면접관이 강점과 약점을 확인하기 위해 던질 예상 질문 3가지(의도 및 답변 팁 포함)를 도출하세요.
4. 지원 전 반드시 실행해야 할 3대 우선순위 액션 플랜을 제시하세요.`;

    const systemInstruction =
      "당신은 현대자동차, 기아, 현대모비스 등 대한민국 자동차 제조업계 최고 수준의 기술 채용 전문관이자 취업 컨설턴트입니다. 지원자의 스펙과 채용공고의 링크/요건을 냉철하게 분석하여 공고 맞춤형 강점과 약점을 낱낱이 파헤치고, 실전에 바로 쓸 수 있는 현실적이고 날카로운 피드백을 제공합니다. 반드시 한국어로 답변하세요.";

    // Resilient invocation with automatic retry & fallback models for 503 / 429
    let lastError: unknown = null;
    const modelsToAttempt = [
      { model: "gemini-3.8-flash", useUrlContext: hasUrl },
      { model: "gemini-3.8-flash", useUrlContext: false }, // Retry 3.8-flash without urlContext tool if urlContext caused delay/503
      { model: "gemini-3.1-flash-lite", useUrlContext: false }, // High-throughput fallback model
    ];

    for (let i = 0; i < modelsToAttempt.length; i++) {
      const attempt = modelsToAttempt[i];
      try {
        const configTools = attempt.useUrlContext ? [{ urlContext: {} }] : undefined;

        const response = await ai.models.generateContent({
          model: attempt.model,
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            tools: configTools,
            responseSchema: ANALYSIS_RESPONSE_SCHEMA,
          },
        });

        const jsonText = response.text || "{}";
        const parsedData = JSON.parse(jsonText);
        res.json(parsedData);
        return;
      } catch (err: unknown) {
        lastError = err;
        console.warn(`Gemini attempt ${i + 1} (${attempt.model}) error:`, err);

        // Check if error is 503 UNAVAILABLE or 429 RESOURCE_EXHAUSTED
        const errMsg = String(err);
        const isTemporary =
          errMsg.includes("503") ||
          errMsg.includes("UNAVAILABLE") ||
          errMsg.includes("high demand") ||
          errMsg.includes("429");

        if (isTemporary && i < modelsToAttempt.length - 1) {
          // Wait 1200ms before retry
          await delay(1200);
          continue;
        }
      }
    }

    // If all attempts failed
    const errText =
      lastError instanceof Error ? lastError.message : String(lastError);
    if (errText.includes("503") || errText.includes("high demand") || errText.includes("UNAVAILABLE")) {
      res.status(503).json({
        error:
          "현재 Gemini AI 모델 서버에 일시적인 트래픽 급증(503)이 발생했습니다. 일시적인 현상이므로 10~20초 후 다시 시도해주세요.",
      });
      return;
    }

    res.status(500).json({
      error: `AI 분석 처리 중 오류가 발생했습니다: ${errText}`,
    });
  } catch (err: unknown) {
    console.error("Gemini API General Error:", err);
    res.status(500).json({
      error: "요청 처리 중 오류가 발생했습니다. 다시 시도해주세요.",
    });
  }
});

// Production vs Development handler
async function startServer() {
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  } else {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
