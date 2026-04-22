import { useNavigate } from 'react-router-dom';
import StatusBadge   from './StatusBadge';
import StageProgress from './StageProgress';

const cropIcon = (crop) => {
  const map = { maize: '🌽', corn: '🌽', wheat: '🌾', beans: '🫘', rice: '🌾', sorghum: '🌿', sunflower: '🌻', pyrethrum: '💐' };
  return map[crop?.toLowerCase()] || '🌱';
};

const stageColor = { planted: '#8b6914', growing: '#52b788', ready: '#f4a261', harvested: '#a8dadc' };

const daysSince = (date) => {
  if (!date) return null;
  return Math.floor((Date.now() - new Date(date)) / 86_400_000);
};

export default function FieldCard({ field, showAgent = false }) {
  const navigate = useNavigate();
  const planted  = daysSince(field.plantingDate);
  const updated  = daysSince(field.lastUpdatedAt || field.updatedAt);

  return (
    <div
      onClick={() => navigate(`/fields/${field.id}`)}
      className="glass rounded-xl p-5 cursor-pointer card-hover flex flex-col gap-4 animate-fade-in"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: `${stageColor[field.stage]}22`, border: `1px solid ${stageColor[field.stage]}44` }}
          >
            {cropIcon(field.cropType)}
          </div>
          <div>
            <div className="font-semibold text-sm leading-tight" style={{ color: 'var(--text)' }}>{field.name}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{field.cropType}</div>
          </div>
        </div>
        <StatusBadge status={field.status} pulse />
      </div>

      {/* Stage progress */}
      <StageProgress stage={field.stage} />

      {/* Meta row */}
      <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
        {field.location && (
          <div className="flex items-center gap-1">
            <span>📍</span>
            <span className="truncate">{field.location}</span>
          </div>
        )}
        {field.areaHectares && (
          <div className="flex items-center gap-1">
            <span>📐</span>
            <span>{field.areaHectares} ha</span>
          </div>
        )}
        {planted !== null && (
          <div className="flex items-center gap-1">
            <span>📅</span>
            <span>Day {planted}</span>
          </div>
        )}
        {updated !== null && (
          <div className={`flex items-center gap-1 ${updated >= 7 ? 'text-amber-400' : ''}`}>
            <span>🕐</span>
            <span>{updated === 0 ? 'Today' : `${updated}d ago`}</span>
          </div>
        )}
      </div>

      {/* Agent (admin view) */}
      {showAgent && field.agent && (
        <div className="pt-3 border-t flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
          <div className="w-6 h-6 rounded-full bg-forest-700 flex items-center justify-center text-xs font-bold text-forest-300">
            {field.agent.name[0]}
          </div>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{field.agent.name}</span>
        </div>
      )}
    </div>
  );
}