interface MenuButtonProps {
  onClick: () => void
}

export default function MenuButton({ onClick }: MenuButtonProps) {
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
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </div>
      <div className="flex-1">
        <span className="text-white font-medium text-lg">Меню</span>
      </div>
      <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  )
}
