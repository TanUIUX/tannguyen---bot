import "./homepage.css";

interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  const clampProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="progress-container">
      <div
        className="progress-fill"
        style={{ width: `${clampProgress}%` }}
      />
    </div>
  );
}
