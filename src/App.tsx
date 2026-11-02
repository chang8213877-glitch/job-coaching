/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { useChecklist } from "./hooks/useChecklist";
import { RoleGuideTab } from "./components/RoleGuideTab";
import { CertificatesTab } from "./components/CertificatesTab";
import { MyStatusTab } from "./components/MyStatusTab";
import { AiMatchTab } from "./components/AiMatchTab";
import { JOB_ROLES } from "./data/rolesData";
import { Sun, Moon, Laptop, Sparkles } from "lucide-react";

type TabKey = "role" | "cert" | "me" | "ai";
type ThemeMode = "system" | "light" | "dark";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("role");
  const [selectedRoleId, setSelectedRoleId] = useState<string>(JOB_ROLES[0].id);
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem("auto_mfg_theme") as ThemeMode | null;
      if (saved && ["system", "light", "dark"].includes(saved)) {
        return saved;
      }
    } catch {
      // Ignore error
    }
    return "system";
  });

  const { isChecked, toggleCheck, resetAll } = useChecklist();

  // Apply theme mode to documentElement
  useEffect(() => {
    try {
      localStorage.setItem("auto_mfg_theme", themeMode);
    } catch {
      // Ignore
    }

    const root = document.documentElement;
    if (themeMode === "system") {
      root.removeAttribute("data-theme");
      root.classList.remove("dark");
    } else if (themeMode === "dark") {
      root.setAttribute("data-theme", "dark");
      root.classList.add("dark");
    } else {
      root.setAttribute("data-theme", "light");
      root.classList.remove("dark");
    }
  }, [themeMode]);

  const cycleTheme = () => {
    setThemeMode((prev) => {
      if (prev === "system") return "dark";
      if (prev === "dark") return "light";
      return "system";
    });
  };

  const handleSelectRoleAndTab = (roleId: string) => {
    setSelectedRoleId(roleId);
    setActiveTab("role");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Top Header */}
      <header className="max-w-[860px] mx-auto px-4 pt-6 pb-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[22px] sm:text-[28px] font-extrabold tracking-tight text-[var(--ink)] leading-snug">
              자동차 제조업 직무별 자격증·역량 가이드
            </h1>
            <p className="text-[14px] sm:text-[15px] text-[var(--mute)] mt-1.5 leading-relaxed max-w-[70ch]">
              직무를 고르면 필요한 핵심 역량, 도움이 되는 자격증, 경험 증명 방법, 준비 순서를 보고 내 준비 현황을 체크하며 AI로 공고 부합도를 분석할 수 있습니다.
            </p>
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={cycleTheme}
            title={`테마 변경 (현재: ${
              themeMode === "system"
                ? "시스템 기본"
                : themeMode === "dark"
                ? "다크 모드"
                : "라이트 모드"
            })`}
            aria-label="화면 테마 변경"
            className="p-2 text-[var(--mute)] hover:text-[var(--ink)] hover:bg-[var(--line-subtle)] rounded-[6px] transition-colors border border-[var(--line)] cursor-pointer shrink-0 mt-1"
          >
            {themeMode === "system" ? (
              <Laptop className="w-4 h-4" />
            ) : themeMode === "dark" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Required Fixed Notice Banner */}
        <div className="mt-4 p-3 sm:p-3.5 bg-[var(--sf)] border border-[var(--line)] border-l-4 border-l-[var(--sig)] rounded-[6px] text-[13px] sm:text-[13.5px] text-[var(--mute)] leading-relaxed">
          <p className="m-0">
            <strong>안내:</strong> 자격증은 대부분 필수가 아니라 보완 요소입니다. 인턴·프로젝트 같은 직무 경험을 더 중시한다는 현직자 의견이 많고, 품질 관련 자격증은 의견이 갈립니다. 지원 전 공고의 우대사항을 확인하세요.
          </p>
        </div>
      </header>

      {/* Sticky Tabs Navigation */}
      <nav
        aria-label="주요 화면 탭"
        className="sticky top-0 z-20 bg-[var(--bg)]/95 backdrop-blur-xs border-b border-[var(--line)] mt-3"
      >
        <div
          role="tablist"
          className="max-w-[860px] mx-auto px-4 flex gap-1 sm:gap-2 overflow-x-auto no-scrollbar"
        >
          <button
            role="tab"
            type="button"
            id="tab-role"
            aria-controls="panel-role"
            aria-selected={activeTab === "role"}
            onClick={() => setActiveTab("role")}
            className={`py-3 px-3.5 sm:px-4 text-[14.5px] font-bold border-b-[3px] transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "role"
                ? "text-[var(--ink)] border-[var(--sig)]"
                : "text-[var(--mute)] border-transparent hover:text-[var(--ink)]"
            }`}
          >
            직무별 가이드
          </button>

          <button
            role="tab"
            type="button"
            id="tab-cert"
            aria-controls="panel-cert"
            aria-selected={activeTab === "cert"}
            onClick={() => setActiveTab("cert")}
            className={`py-3 px-3.5 sm:px-4 text-[14.5px] font-bold border-b-[3px] transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "cert"
                ? "text-[var(--ink)] border-[var(--sig)]"
                : "text-[var(--mute)] border-transparent hover:text-[var(--ink)]"
            }`}
          >
            자격증 목록
          </button>

          <button
            role="tab"
            type="button"
            id="tab-me"
            aria-controls="panel-me"
            aria-selected={activeTab === "me"}
            onClick={() => setActiveTab("me")}
            className={`py-3 px-3.5 sm:px-4 text-[14.5px] font-bold border-b-[3px] transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "me"
                ? "text-[var(--ink)] border-[var(--sig)]"
                : "text-[var(--mute)] border-transparent hover:text-[var(--ink)]"
            }`}
          >
            내 준비 현황
          </button>

          <button
            role="tab"
            type="button"
            id="tab-ai"
            aria-controls="panel-ai"
            aria-selected={activeTab === "ai"}
            onClick={() => setActiveTab("ai")}
            className={`py-3 px-3.5 sm:px-4 text-[14.5px] font-bold border-b-[3px] transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === "ai"
                ? "text-[var(--ink)] border-[var(--sig)]"
                : "text-[var(--mute)] border-transparent hover:text-[var(--ink)]"
            }`}
          >
            <Sparkles className="w-4 h-4 text-[var(--sig)]" />
            AI 공고 부합도
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-[860px] mx-auto px-4 pt-5">
        <div
          role="tabpanel"
          id="panel-role"
          aria-labelledby="tab-role"
          hidden={activeTab !== "role"}
        >
          {activeTab === "role" && (
            <RoleGuideTab
              selectedRoleId={selectedRoleId}
              onSelectRole={setSelectedRoleId}
              isChecked={isChecked}
              onToggleCheck={toggleCheck}
            />
          )}
        </div>

        <div
          role="tabpanel"
          id="panel-cert"
          aria-labelledby="tab-cert"
          hidden={activeTab !== "cert"}
        >
          {activeTab === "cert" && (
            <CertificatesTab
              isChecked={isChecked}
              onToggleCheck={toggleCheck}
              onSelectRoleAndTab={handleSelectRoleAndTab}
            />
          )}
        </div>

        <div
          role="tabpanel"
          id="panel-me"
          aria-labelledby="tab-me"
          hidden={activeTab !== "me"}
        >
          {activeTab === "me" && (
            <MyStatusTab
              isChecked={isChecked}
              onResetAll={resetAll}
              onSelectRoleAndTab={handleSelectRoleAndTab}
            />
          )}
        </div>

        <div
          role="tabpanel"
          id="panel-ai"
          aria-labelledby="tab-ai"
          hidden={activeTab !== "ai"}
        >
          {activeTab === "ai" && <AiMatchTab isChecked={isChecked} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-[860px] mx-auto px-4 mt-12 pt-6 border-t border-[var(--line)] text-center text-[12.5px] text-[var(--mute)]">
        자동차 제조업 취업 준비생을 위한 직무별 가이드 &middot; 체크 상태는 로컬 브라우저에 저장됩니다 &middot; AI 분석은 Google Gemini를 활용합니다
      </footer>
    </div>
  );
}
