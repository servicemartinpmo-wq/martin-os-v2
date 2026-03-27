import {
  animationPresets,
  cornerPresets,
  densityPresets,
  pagePresets,
  uiPresetThemes,
} from '../data/visualPresets'

function PreferencesPanel({
  isOpen,
  onClose,
  preferences,
  onPreferenceChange,
  lockscreenOptions,
}) {
  if (!isOpen) return null
  const selectedLockscreenId = lockscreenOptions.some(
    (option) => option.id === preferences.lockscreenId
  )
    ? preferences.lockscreenId
    : lockscreenOptions[0]?.id

  return (
    <aside className="prefs-panel">
      <div className="prefs-header">
        <h3>Personalize</h3>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>

      <section>
        <label htmlFor="themePreset">Preset Theme</label>
        <select
          id="themePreset"
          value={preferences.themePreset}
          onChange={(event) => onPreferenceChange('themePreset', event.target.value)}
        >
          {uiPresetThemes.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.label}
            </option>
          ))}
        </select>
      </section>

      <section>
        <label htmlFor="density">Information Density</label>
        <select
          id="density"
          value={preferences.density}
          onChange={(event) => onPreferenceChange('density', event.target.value)}
        >
          {densityPresets.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.label}
            </option>
          ))}
        </select>
      </section>

      <section>
        <label htmlFor="pagePreset">Page Preset</label>
        <select
          id="pagePreset"
          value={preferences.pagePreset}
          onChange={(event) => onPreferenceChange('pagePreset', event.target.value)}
        >
          {pagePresets.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.label}
            </option>
          ))}
        </select>
      </section>

      <section>
        <label htmlFor="lockscreen">Lock Screen</label>
        <select
          id="lockscreen"
          value={selectedLockscreenId}
          onChange={(event) => onPreferenceChange('lockscreenId', event.target.value)}
        >
          {lockscreenOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </section>

      <section>
        <label htmlFor="glow">Glow Intensity</label>
        <input
          id="glow"
          type="range"
          min="0"
          max="100"
          value={preferences.glow}
          onChange={(event) => onPreferenceChange('glow', Number(event.target.value))}
        />
      </section>

      <section>
        <label htmlFor="cornerPreset">Corner Geometry</label>
        <select
          id="cornerPreset"
          value={preferences.cornerPreset}
          onChange={(event) => onPreferenceChange('cornerPreset', event.target.value)}
        >
          {cornerPresets.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.label}
            </option>
          ))}
        </select>
      </section>

      <section>
        <label htmlFor="animationPreset">Animation Level</label>
        <select
          id="animationPreset"
          value={preferences.animationPreset}
          onChange={(event) => onPreferenceChange('animationPreset', event.target.value)}
        >
          {animationPresets.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.label}
            </option>
          ))}
        </select>
      </section>
    </aside>
  )
}

export default PreferencesPanel
