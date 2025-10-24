interface EditorButtonProps {
  onClick: () => void
}

export default function EditorButton({ onClick }: EditorButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClick()
      }}
      className="w-full text-left p-4 bg-vintage-dark-gray hover:bg-vintage-medium-gray rounded-xl transition-all duration-300 flex items-center space-x-3 group cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
      style={{ 
        pointerEvents: 'auto',
        zIndex: 9999,
        position: 'relative'
      }}
    >
      <div className="p-2 rounded-lg group-hover:transition-colors duration-300">
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
        </svg>
      </div>
      <div className="flex-1">
        <span className="text-white font-medium text-lg">Редактор</span>
      </div>
      <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  )
}
