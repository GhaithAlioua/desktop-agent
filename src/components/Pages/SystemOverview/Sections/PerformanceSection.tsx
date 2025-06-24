import React from "react";
import InfoCard from "../UI/InfoCard";
import {
  PerformanceInfo,
  SysInfoError,
  RustResult,
  formatError,
} from "../systemInfoTypes";

interface PerformanceSectionProps {
  performanceInfo: RustResult<PerformanceInfo, SysInfoError>;
}

const PerformanceSection: React.FC<PerformanceSectionProps> = ({
  performanceInfo,
}) => {
  const getPerformanceScoreColor = (score?: number) => {
    if (!score) return "text-gray-500";
    return "text-progress-blue";
  };

  const getPerformanceProgressColor = (score?: number) => {
    if (!score) return "bg-gray-500";
    return "bg-progress-blue";
  };

  const getPerformanceScoreIcon = (score?: number) => {
    if (!score) return "❓";
    if (score >= 80) return "🚀";
    if (score >= 60) return "⚡";
    if (score >= 40) return "📊";
    return "🐌";
  };

  const getPerformanceLevel = (score?: number) => {
    if (!score || score <= 0) return "Performance level unavailable";
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Average";
    return "Below Average";
  };

  const getPerformanceScore = (score: number | null | undefined): string => {
    if (score === null || score === undefined || score <= 0) {
      return "Performance score unavailable";
    }
    return score.toFixed(1);
  };

  return (
    <InfoCard title="Performance" className="lg:col-span-2">
      <div className="bg-secondary-bg rounded-lg p-4">
        {"Ok" in performanceInfo ? (
          <div className="space-y-6">
            {/* Overall Performance Score */}
            <div className="bg-accent-bg rounded-lg p-4 border border-border">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">
                  {getPerformanceScoreIcon(performanceInfo.Ok.overall_score)}
                </span>
                <div>
                  <h4
                    className={`text-xl font-bold text-main-text ${getPerformanceScoreColor(
                      performanceInfo.Ok.overall_score
                    )}`}
                  >
                    {performanceInfo.Ok.overall_score
                      ? `${performanceInfo.Ok.overall_score.toFixed(1)}/100`
                      : "Performance score unavailable"}
                  </h4>
                  <p className="text-sm text-secondary-text">
                    Overall Performance Score
                  </p>
                  <p className="text-xs text-secondary-text">
                    Level:{" "}
                    {getPerformanceLevel(performanceInfo.Ok.overall_score)}
                  </p>
                </div>
              </div>

              {/* Overall Score Progress Bar */}
              {performanceInfo.Ok.overall_score && (
                <div className="mt-3">
                  <div className="flex justify-between text-sm text-secondary-text mb-1">
                    <span>Performance Level</span>
                    <span>{performanceInfo.Ok.overall_score.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${getPerformanceProgressColor(
                        performanceInfo.Ok.overall_score
                      )}`}
                      style={{ width: `${performanceInfo.Ok.overall_score}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Individual Component Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* CPU Performance */}
              <div className="bg-accent-bg rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🖥️</span>
                  <h5 className="font-semibold text-main-text">
                    CPU Performance
                  </h5>
                </div>
                {performanceInfo.Ok.cpu_benchmark_score ? (
                  <>
                    <div
                      className={`text-2xl font-bold ${getPerformanceScoreColor(
                        performanceInfo.Ok.cpu_benchmark_score
                      )}`}
                    >
                      {performanceInfo.Ok.cpu_benchmark_score.toFixed(1)}/100
                    </div>
                    <div className="text-xs text-secondary-text mb-2">
                      {getPerformanceLevel(
                        performanceInfo.Ok.cpu_benchmark_score
                      )}
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getPerformanceProgressColor(
                          performanceInfo.Ok.cpu_benchmark_score
                        )}`}
                        style={{
                          width: `${performanceInfo.Ok.cpu_benchmark_score}%`,
                        }}
                      ></div>
                    </div>
                  </>
                ) : (
                  <div className="text-secondary-text text-sm">
                    Benchmark not available
                  </div>
                )}
              </div>

              {/* GPU Performance */}
              <div className="bg-accent-bg rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🎮</span>
                  <h5 className="font-semibold text-main-text">
                    GPU Performance
                  </h5>
                </div>
                {performanceInfo.Ok.gpu_benchmark_score ? (
                  <>
                    <div
                      className={`text-2xl font-bold ${getPerformanceScoreColor(
                        performanceInfo.Ok.gpu_benchmark_score
                      )}`}
                    >
                      {performanceInfo.Ok.gpu_benchmark_score.toFixed(1)}/100
                    </div>
                    <div className="text-xs text-secondary-text mb-2">
                      {getPerformanceLevel(
                        performanceInfo.Ok.gpu_benchmark_score
                      )}
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getPerformanceProgressColor(
                          performanceInfo.Ok.gpu_benchmark_score
                        )}`}
                        style={{
                          width: `${performanceInfo.Ok.gpu_benchmark_score}%`,
                        }}
                      ></div>
                    </div>
                  </>
                ) : (
                  <div className="text-secondary-text text-sm">
                    Benchmark not available
                  </div>
                )}
              </div>

              {/* Memory Performance */}
              <div className="bg-accent-bg rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🧠</span>
                  <h5 className="font-semibold text-main-text">
                    Memory Performance
                  </h5>
                </div>
                {performanceInfo.Ok.memory_benchmark_score ? (
                  <>
                    <div
                      className={`text-2xl font-bold ${getPerformanceScoreColor(
                        performanceInfo.Ok.memory_benchmark_score
                      )}`}
                    >
                      {performanceInfo.Ok.memory_benchmark_score.toFixed(1)}/100
                    </div>
                    <div className="text-xs text-secondary-text mb-2">
                      {getPerformanceLevel(
                        performanceInfo.Ok.memory_benchmark_score
                      )}
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getPerformanceProgressColor(
                          performanceInfo.Ok.memory_benchmark_score
                        )}`}
                        style={{
                          width: `${performanceInfo.Ok.memory_benchmark_score}%`,
                        }}
                      ></div>
                    </div>
                  </>
                ) : (
                  <div className="text-secondary-text text-sm">
                    Benchmark not available
                  </div>
                )}
              </div>

              {/* Storage Performance */}
              <div className="bg-accent-bg rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">💾</span>
                  <h5 className="font-semibold text-main-text">
                    Storage Performance
                  </h5>
                </div>
                {performanceInfo.Ok.storage_benchmark_score ? (
                  <>
                    <div
                      className={`text-2xl font-bold ${getPerformanceScoreColor(
                        performanceInfo.Ok.storage_benchmark_score
                      )}`}
                    >
                      {performanceInfo.Ok.storage_benchmark_score.toFixed(1)}
                      /100
                    </div>
                    <div className="text-xs text-secondary-text mb-2">
                      {getPerformanceLevel(
                        performanceInfo.Ok.storage_benchmark_score
                      )}
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getPerformanceProgressColor(
                          performanceInfo.Ok.storage_benchmark_score
                        )}`}
                        style={{
                          width: `${performanceInfo.Ok.storage_benchmark_score}%`,
                        }}
                      ></div>
                    </div>
                  </>
                ) : (
                  <div className="text-secondary-text text-sm">
                    Benchmark not available
                  </div>
                )}
              </div>
            </div>

            {/* Benchmark Information */}
            <div className="text-center text-secondary-text p-4 bg-accent-bg rounded-lg">
              <p className="text-sm">
                Performance benchmarks will be available in future updates
              </p>
              <p className="text-xs mt-1">
                These scores help determine resource pricing for the marketplace
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center text-red-500 p-4">
            Error: {formatError(performanceInfo.Err)}
          </div>
        )}
      </div>
    </InfoCard>
  );
};

export default PerformanceSection;
