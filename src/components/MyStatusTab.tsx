import { useState } from "react";
import { JOB_ROLES } from "../data/rolesData";
import { GaugeProgressBar } from "./GaugeProgressBar";

interface MyStatusTabProps {
  isChecked: (id: string) => boolean;
  onResetAll: () => void;
  onSelectRoleAndTab: (roleId: string) => void;
}

export function MyStatusTab({
  isChecked,
  onResetAll,
  onSelectRoleAndTab,
}: MyStatusTabProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Compute stats across all roles
  let grandTotalItems = 0;
  let grandCompletedItems = 0;

  const roleStats = JOB_ROLES.map((role) => {
    const total = role.competencies.length + role.certificates.length;
    const completed =
      role.competencies.filter((c) => isChecked(c.id)).length +
      role.certificates.filter((c) => isChecked(c.id)).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    grandTotalItems += total;
    grandCompletedItems += completed;

    return {
      role,
      total,
      completed,
      percent,
    };
  });

  const overallPercent =
    grandTotalItems > 0
      ? Math.round((grandCompletedItems / grandTotalItems) * 100)
      : 0;

  const handleConfirmReset = () => {
    onResetAll();
    setShowConfirmModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Overall Summary Card */}
      <section
        aria-labelledby="overall-status-heading"
        className="bg-[var(--sf)] border border-[var(--line)] rounded-[8px] p-4 sm:p-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h2
              id="overall-status-heading"
              className="text-[18px] font-bold text-[var(--ink)] tracking-tight"
            >
              전체 준비 현황 요약
            </h2>
            <p className="text-[13px] text-[var(--mute)] mt-0.5">
              자동차 7대 직무 역량 및 자격증 준비 통계
            </p>
          </div>
          <div className="text-[13px] text-[var(--mute)] font-medium">
            전체 {grandTotalItems}개 항목 중{" "}
            <span className="text-[var(--ink)] font-bold">
              {grandCompletedItems}개
            </span>{" "}
            완료
          </div>
        </div>

        <GaugeProgressBar
          percent={overallPercent}
          label="전체 평균 달성도"
          subLabel={`준비 ${overallPercent}% 완료`}
        />
      </section>

      {/* Role by Role Progress List */}
      <section
        aria-labelledby="roles-status-heading"
        className="bg-[var(--sf)] border border-[var(--line)] rounded-[8px] p-4 sm:p-5"
      >
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3 mb-4">
          <h3
            id="roles-status-heading"
            className="text-[16px] font-bold text-[var(--ink)]"
          >
            직무별 준비 현황
          </h3>
          <span className="text-[12px] text-[var(--mute)]">
            클릭하여 해당 직무 가이드로 이동
          </span>
        </div>

        <div className="space-y-4 divide-y divide-[var(--line-subtle)]">
          {roleStats.map(({ role, total, completed, percent }) => (
            <div
              key={role.id}
              className="pt-4 first:pt-0 group cursor-pointer"
              onClick={() => onSelectRoleAndTab(role.id)}
            >
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-[15px] font-semibold text-[var(--ink)] group-hover:text-[var(--ac)] transition-colors">
                  {role.name}
                </span>
                <span className="text-[13px] text-[var(--mute)]">
                  {completed}/{total} 완료 ({percent}%)
                </span>
              </div>
              <GaugeProgressBar
                percent={percent}
                showPercentText={false}
              />
            </div>
          ))}
        </div>

        {/* Notice & Reset Action */}
        <div className="mt-6 pt-4 border-t border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-[13px] text-[var(--mute)]">
            * 체크 상태는 이 브라우저에만 저장됩니다.
          </p>
          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            className="px-3.5 py-2 text-[13px] font-medium text-red-600 dark:text-red-400 bg-transparent border border-red-300 dark:border-red-900/60 rounded-[6px] hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
          >
            전체 초기화
          </button>
        </div>
      </section>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-reset-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        >
          <div className="bg-[var(--sf)] border border-[var(--line)] rounded-[8px] max-w-sm w-full p-5 space-y-4 shadow-lg">
            <h4
              id="confirm-reset-title"
              className="text-[16px] font-bold text-[var(--ink)]"
            >
              전체 초기화 확인
            </h4>
            <p className="text-[14px] text-[var(--mute)] leading-relaxed">
              체크한 모든 역량 및 자격증 준비 현황이 삭제됩니다. 정말로 모든 항목을 초기화하시겠습니까?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-3 py-1.5 text-[13px] font-medium text-[var(--ink)] bg-[var(--sf)] border border-[var(--line)] rounded-[6px] hover:bg-[var(--line-subtle)] cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-3.5 py-1.5 text-[13px] font-medium text-white bg-red-600 rounded-[6px] hover:bg-red-700 cursor-pointer"
              >
                전체 초기화
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
