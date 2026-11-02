import { JobRole, JOB_ROLES } from "../data/rolesData";
import { GaugeProgressBar } from "./GaugeProgressBar";
import { PriorityBadge } from "./PriorityBadge";

interface RoleGuideTabProps {
  selectedRoleId: string;
  onSelectRole: (roleId: string) => void;
  isChecked: (id: string) => boolean;
  onToggleCheck: (id: string) => void;
}

export function RoleGuideTab({
  selectedRoleId,
  onSelectRole,
  isChecked,
  onToggleCheck,
}: RoleGuideTabProps) {
  const currentRole =
    JOB_ROLES.find((r) => r.id === selectedRoleId) || JOB_ROLES[0];

  // Calculate progress for current role
  const totalItems =
    currentRole.competencies.length + currentRole.certificates.length;
  const completedItems =
    currentRole.competencies.filter((item) => isChecked(item.id)).length +
    currentRole.certificates.filter((item) => isChecked(item.id)).length;
  const progressPercent =
    totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Job Selection Chips */}
      <div>
        <div
          role="group"
          aria-label="직무 선택"
          className="flex flex-wrap gap-2 pt-1 pb-1"
        >
          {JOB_ROLES.map((role) => {
            const isSelected = role.id === currentRole.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => onSelectRole(role.id)}
                aria-pressed={isSelected}
                className={`px-3 py-1.5 text-[13px] font-medium rounded-full transition-colors border cursor-pointer ${
                  isSelected
                    ? "bg-[var(--ac)] text-[var(--acink)] border-[var(--ac)] font-semibold shadow-xs"
                    : "bg-[var(--sf)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--mute)]"
                }`}
              >
                {role.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Job Header & Progress Card */}
      <section
        aria-labelledby="role-title"
        className="bg-[var(--sf)] border border-[var(--line)] rounded-[8px] p-4 sm:p-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h2 id="role-title" className="text-[19px] font-bold tracking-tight text-[var(--ink)]">
              {currentRole.name}
            </h2>
            <p className="text-[13px] text-[var(--mute)] mt-0.5">
              {currentRole.shortDesc}
            </p>
          </div>
          <div className="text-[13px] text-[var(--mute)] font-medium sm:text-right shrink-0">
            총 {totalItems}개 중 <span className="text-[var(--ink)] font-bold">{completedItems}개</span> 달성
          </div>
        </div>

        <GaugeProgressBar
          percent={progressPercent}
          label="직무 역량·자격증 준비도"
          subLabel={`준비 ${progressPercent}% 완료`}
        />
      </section>

      {/* 2-Column Grid or Stack for Competencies and Certs */}
      <div className="space-y-4">
        {/* Core Competencies Checklist */}
        <section
          aria-labelledby="competency-heading"
          className="bg-[var(--sf)] border border-[var(--line)] rounded-[8px] p-4 sm:p-5"
        >
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-2.5 mb-2">
            <h3
              id="competency-heading"
              className="text-[16px] font-bold text-[var(--ink)] flex items-center gap-2"
            >
              핵심 역량
              <span className="text-[12px] font-normal text-[var(--mute)]">
                ({currentRole.competencies.filter((c) => isChecked(c.id)).length}/
                {currentRole.competencies.length})
              </span>
            </h3>
            <span className="text-[12px] text-[var(--mute)]">
              1=필수, 2=가산
            </span>
          </div>

          <ul className="divide-y divide-[var(--line-subtle)]" role="list">
            {currentRole.competencies.map((comp) => {
              const checked = isChecked(comp.id);
              return (
                <li key={comp.id}>
                  <label className="flex items-start gap-3 py-2.5 px-1 cursor-pointer hover:bg-[var(--line-subtle)] rounded-[4px] transition-colors select-none min-h-[44px]">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggleCheck(comp.id)}
                      className="mt-1 w-4 h-4 rounded-[3px] accent-[var(--ac)] cursor-pointer shrink-0"
                    />
                    <div className="flex-1 flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`text-[14.5px] font-medium leading-snug transition-colors ${
                          checked
                            ? "text-[var(--mute)] line-through decoration-[var(--mute)]"
                            : "text-[var(--ink)]"
                        }`}
                      >
                        {comp.name}
                      </span>
                      <PriorityBadge type="competency" priority={comp.priority} />
                    </div>
                  </label>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Helpful Certificates Checklist */}
        <section
          aria-labelledby="cert-heading"
          className="bg-[var(--sf)] border border-[var(--line)] rounded-[8px] p-4 sm:p-5"
        >
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-2.5 mb-2">
            <h3
              id="cert-heading"
              className="text-[16px] font-bold text-[var(--ink)] flex items-center gap-2"
            >
              도움이 되는 자격증
              <span className="text-[12px] font-normal text-[var(--mute)]">
                ({currentRole.certificates.filter((c) => isChecked(c.id)).length}/
                {currentRole.certificates.length})
              </span>
            </h3>
            <span className="text-[12px] text-[var(--mute)]">
              1=우선 권장, 2=가산 가능, 3=참고
            </span>
          </div>

          <ul className="divide-y divide-[var(--line-subtle)]" role="list">
            {currentRole.certificates.map((cert) => {
              const checked = isChecked(cert.id);
              return (
                <li key={cert.id}>
                  <label className="flex items-start gap-3 py-2.5 px-1 cursor-pointer hover:bg-[var(--line-subtle)] rounded-[4px] transition-colors select-none min-h-[44px]">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggleCheck(cert.id)}
                      className="mt-1 w-4 h-4 rounded-[3px] accent-[var(--ac)] cursor-pointer shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span
                          className={`text-[14.5px] font-semibold leading-snug transition-colors ${
                            checked
                              ? "text-[var(--mute)] line-through decoration-[var(--mute)]"
                              : "text-[var(--ink)]"
                          }`}
                        >
                          {cert.name}
                        </span>
                        <PriorityBadge type="certificate" priority={cert.priority} />
                      </div>
                      <p className="text-[13px] text-[var(--mute)] mt-0.5 leading-relaxed">
                        {cert.comment}
                      </p>
                    </div>
                  </label>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {/* Experience & Roadmap Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 경험으로 증명하기 */}
        <section
          aria-labelledby="experience-heading"
          className="bg-[var(--sf)] border border-[var(--line)] rounded-[8px] p-4 sm:p-5"
        >
          <h3
            id="experience-heading"
            className="text-[16px] font-bold text-[var(--ink)] mb-3 pb-2 border-b border-[var(--line)]"
          >
            경험으로 증명하기
          </h3>
          <ul className="space-y-2.5 text-[14px] text-[var(--ink)] pl-4 list-disc marker:text-[var(--ac)]">
            {currentRole.experiences.map((exp, idx) => (
              <li key={idx} className="leading-snug">
                {exp}
              </li>
            ))}
          </ul>
        </section>

        {/* 준비 순서 */}
        <section
          aria-labelledby="roadmap-heading"
          className="bg-[var(--sf)] border border-[var(--line)] rounded-[8px] p-4 sm:p-5"
        >
          <h3
            id="roadmap-heading"
            className="text-[16px] font-bold text-[var(--ink)] mb-3 pb-2 border-b border-[var(--line)]"
          >
            준비 순서
          </h3>
          <ol className="space-y-2.5 text-[14px] text-[var(--ink)]">
            {currentRole.roadmap.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2.5 leading-snug">
                <span className="w-5 h-5 rounded-full bg-[var(--ac)] text-[var(--acink)] text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
