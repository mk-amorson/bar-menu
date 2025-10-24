interface EditorButtonProps {
  onClick: () => void
}

export default function EditorButton({ onClick }: EditorButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-vintage-bronze hover:bg-vintage-bronze/80 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
    >
      <div className="flex items-center justify-center space-x-3">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
        </svg>
        <span>Редактор</span>
      </div>
    </button>
  )
}
