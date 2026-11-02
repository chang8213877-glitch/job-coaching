import { useState, useMemo } from "react";
import {
  getUnifiedCertificates,
  CERTIFICATE_PRIORITY_LABELS,
  UnifiedCertificate,
} from "../data/rolesData";
import { PriorityBadge } from "./PriorityBadge";

interface CertificatesTabProps {
  isChecked: (id: string) => boolean;
  onToggleCheck: (id: string) => void;
  onSelectRoleAndTab: (roleId: string) => void;
}

export function CertificatesTab({
  isChecked,
  onToggleCheck,
  onSelectRoleAndTab,
}: CertificatesTabProps) {
  const [selectedFilter, setSelectedFilter] = useState<0 | 1 | 2 | 3>(0);

  const allCerts = useMemo(() => getUnifiedCertificates(), []);

  const filteredCerts = useMemo(() => {
    if (selectedFilter === 0) return allCerts;
    return allCerts.filter((cert) => cert.highestPriority === selectedFilter);
  }, [allCerts, selectedFilter]);

  // Check if any role instance of this certificate is checked
  const isCertChecked = (cert: UnifiedCertificate) => {
    return cert.roleReferences.every((ref) => isChecked(ref.itemId));
  };

  const isCertPartiallyChecked = (cert: UnifiedCertificate) => {
    const someChecked = cert.roleReferences.some((ref) => isChecked(ref.itemId));
    const allChecked = cert.roleReferences.every((ref) => isChecked(ref.itemId));
    return someChecked && !allChecked;
  };

  const toggleAllForCert = (cert: UnifiedCertificate) => {
    const allChecked = cert.roleReferences.every((ref) => isChecked(ref.itemId));
    // If all are checked, uncheck all. Otherwise check all.
    cert.roleReferences.forEach((ref) => {
      if (allChecked && isChecked(ref.itemId)) {
        onToggleCheck(ref.itemId);
      } else if (!allChecked && !isChecked(ref.itemId)) {
        onToggleCheck(ref.itemId);
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Priority Filter Chips */}
      <div>
        <div
          role="group"
          aria-label="우선도 필터"
          className="flex flex-wrap items-center gap-2 pt-1 pb-1"
        >
          {([0, 1, 2, 3] as const).map((priority) => {
            const isSelected = selectedFilter === priority;
            const label =
              priority === 0 ? "전체" : CERTIFICATE_PRIORITY_LABELS[priority];
            const count =
              priority === 0
                ? allCerts.length
                : allCerts.filter((c) => c.highestPriority === priority).length;

            return (
              <button
                key={priority}
                type="button"
                onClick={() => setSelectedFilter(priority)}
                aria-pressed={isSelected}
                className={`px-3 py-1.5 text-[13px] font-medium rounded-full transition-colors border cursor-pointer ${
                  isSelected
                    ? "bg-[var(--ac)] text-[var(--acink)] border-[var(--ac)] font-semibold shadow-xs"
                    : "bg-[var(--sf)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--mute)]"
                }`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Guide notice text */}
      <div className="text-[13px] text-[var(--mute)] px-1 leading-relaxed">
        * 여러 직무에 걸친 자격증은 직무 중 <strong>가장 높은 우선도</strong>를
        기준으로 정렬·분류됩니다.
      </div>

      {/* Certificate List or Empty State */}
      {filteredCerts.length === 0 ? (
        <div className="bg-[var(--sf)] border border-[var(--line)] rounded-[8px] p-8 text-center">
          <p className="text-[15px] font-medium text-[var(--mute)]">
            선택한 우선도에 해당하는 자격증이 없습니다.
          </p>
          <button
            type="button"
            onClick={() => setSelectedFilter(0)}
            className="mt-3 px-4 py-1.5 text-[13px] font-medium text-[var(--ac)] hover:underline cursor-pointer"
          >
            전체 자격증 보기
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCerts.map((cert) => {
            const checkedAll = isCertChecked(cert);
            const partiallyChecked = isCertPartiallyChecked(cert);

            return (
              <article
                key={cert.name}
                className={`bg-[var(--sf)] border rounded-[8px] p-4 transition-colors ${
                  checkedAll
                    ? "border-[var(--ok)]/40 bg-[var(--sf)]"
                    : "border-[var(--line)]"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={checkedAll}
                      ref={(input) => {
                        if (input) input.indeterminate = partiallyChecked;
                      }}
                      onChange={() => toggleAllForCert(cert)}
                      aria-label={`${cert.name} 준비 완료 체크`}
                      className="mt-1 w-4 h-4 rounded-[3px] accent-[var(--ac)] cursor-pointer shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-[16px] font-bold text-[var(--ink)]">
                          {cert.name}
                        </h3>
                        <PriorityBadge
                          type="certificate"
                          priority={cert.highestPriority}
                        />
                      </div>

                      {/* Related Roles Tags/Links */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[12.5px] text-[var(--mute)]">
                        <span className="font-semibold text-[var(--ink)]">
                          관련 직무:
                        </span>
                        {cert.roleReferences.map((ref, idx) => (
                          <button
                            key={ref.roleId}
                            type="button"
                            onClick={() => onSelectRoleAndTab(ref.roleId)}
                            title={`${ref.roleName} 가이드로 이동`}
                            className="inline-flex items-center hover:text-[var(--ac)] hover:underline cursor-pointer transition-colors"
                          >
                            {ref.roleName}
                            {idx < cert.roleReferences.length - 1 && (
                              <span className="text-[var(--mute)] mx-1" aria-hidden="true">
                                ·
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Role-specific comments */}
                <div className="mt-3 pt-3 border-t border-[var(--line-subtle)] space-y-1.5">
                  {cert.roleReferences.map((ref) => (
                    <div
                      key={ref.roleId}
                      className="text-[13.5px] flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 leading-relaxed"
                    >
                      <span className="text-[12px] font-medium text-[var(--mute)] shrink-0 sm:w-32">
                        [{ref.roleName}]
                      </span>
                      <span className="text-[var(--ink)]">{ref.comment}</span>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Footer Note */}
      <div className="text-[13px] text-[var(--mute)] pt-2 leading-relaxed">
        우선도는 직무별 최고 등급 기준입니다. 현직자 답변과 일반 채용 정보를
        종합한 참고용이며 공고 우대사항이 우선입니다.
      </div>
    </div>
  );
}
