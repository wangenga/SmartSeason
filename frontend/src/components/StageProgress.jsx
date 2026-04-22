const STAGES = ['planted', 'growing', 'ready', 'harvested'];

const icons  = { planted: '🌱', growing: '🌿', ready: '🌾', harvested: '✅' };
const colors = {
  planted:   '#8b6914',
  growing:   '#52b788',
  ready:     '#f4a261',
  harvested: '#a8dadc',
};

export default function StageProgress({ stage }) {
  const currentIdx = STAGES.indexOf(stage);

  return (
    <div className="w-full">
      {/* Step dots */}
      <div className="flex items-center gap-0">
        {STAGES.map((s, i) => {
          const done    = i <= currentIdx;
          const current = i === currentIdx;
          return (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              {/* Dot */}
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-all duration-500 border"
                style={{
                  background: done ? colors[s] : 'rgba(255,255,255,0.06)',
                  borderColor: done ? colors[s] : 'rgba(255,255,255,0.12)',
                  boxShadow:   current ? `0 0 10px ${colors[s]}88` : 'none',
                }}
                title={s}
              >
                {done ? <span style={{ fontSize: 11 }}>{icons[s]}</span> : null}
              </div>
              {/* Connector */}
              {i < STAGES.length - 1 && (
                <div className="flex-1 h-0.5 mx-1 rounded-full transition-all duration-500"
                  style={{ background: i < currentIdx ? colors[s] : 'rgba(255,255,255,0.08)' }}
                />
              )}
            </div>
          );
        })}
      </div>
      {/* Labels */}
      <div className="flex justify-between mt-1.5">
        {STAGES.map((s) => (
          <span key={s}
            className="text-xs capitalize"
            style={{ color: s === stage ? colors[s] : 'rgba(255,255,255,0.3)', fontWeight: s === stage ? 600 : 400 }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}