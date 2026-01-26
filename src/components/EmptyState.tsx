import type { FilterSelection } from '../types'
import './EmptyState.css'

interface EmptyStateProps {
  searchQuery: string
  selectedFilter: FilterSelection
}

function getFilterDisplayName(filter: FilterSelection): string | null {
  if (filter.type === 'all') return null
  if (filter.type === 'collection') {
    return filter.value.startsWith('*') ? filter.value.slice(1) : filter.value
  }
  return filter.value
}

export function EmptyState({ searchQuery, selectedFilter }: EmptyStateProps) {
  const query = searchQuery.trim()
  const filterName = getFilterDisplayName(selectedFilter)
  
  let message = ''
  if (query && filterName) {
    message = `Your search for "${query}" in ${filterName} came up empty.`
  } else if (query) {
    message = `Your search for "${query}" came up empty.`
  } else if (filterName) {
    message = `No items found in ${filterName}.`
  } else {
    message = 'No items to display.'
  }

  return (
    <div className="empty-state">
      <svg width="150" height="150" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* body */}
        <path d="M57.1025 30.0049C57.6067 30.0562 58 30.4823 58 31V57L57.9951 57.1025C57.9889 57.1634 57.9756 57.2222 57.959 57.2793C57.9285 57.3843 57.8812 57.4817 57.8203 57.5693C57.817 57.5742 57.814 57.5792 57.8105 57.584C57.7807 57.6254 57.7476 57.6639 57.7119 57.7002C57.708 57.7041 57.7041 57.708 57.7002 57.7119C57.6646 57.747 57.6265 57.7792 57.5859 57.8086C57.5802 57.8127 57.5742 57.8163 57.5684 57.8203C57.5273 57.8489 57.4847 57.8752 57.4395 57.8975C57.4343 57.9 57.429 57.9019 57.4238 57.9043C57.3503 57.9389 57.2724 57.9656 57.1904 57.9814C57.1615 57.987 57.1323 57.9921 57.1025 57.9951L57 58H7C6.48232 58 6.05621 57.6067 6.00488 57.1025L6 57V31C6 30.4477 6.44772 30 7 30H57L57.1025 30.0049ZM7 57H15V54C15 51.2386 12.7614 49 10 49H7V57ZM7 48H10C13.3137 48 16 50.6863 16 54V57H48V54C48 50.6863 50.6863 48 54 48H57V31H38V45C38 45.5177 37.6067 45.9438 37.1025 45.9951L37 46H27L26.8975 45.9951C26.3933 45.9438 26 45.5177 26 45V31H7V48ZM54 49C51.2386 49 49 51.2386 49 54V57H57V49H54ZM27 45H37V31H27V45ZM32 34C33.1046 34 34 34.8954 34 36C34 36.9316 33.3622 37.7113 32.5 37.9336V39.5L32.4902 39.6006C32.4437 39.8286 32.2417 40 32 40C31.7583 40 31.5563 39.8286 31.5098 39.6006L31.5 39.5V37.9336C30.6378 37.7113 30 36.9316 30 36C30 34.8954 30.8954 34 32 34ZM32 35C31.4477 35 31 35.4477 31 36C31 36.5523 31.4477 37 32 37C32.5523 37 33 36.5523 33 36C33 35.4477 32.5523 35 32 35Z" fill="var(--accent)"/>
        {/* lines connecting top and bottom */}
        <path d="M6.5 17L10.5 30.5M57.5 17L53.5 30.5" stroke="var(--accent)"/>
        {/* top of chest */}
        <path d="M52.3086 6.00781C55.4789 6.16843 58 8.78979 58 12V17C58 17.5177 57.6067 17.9438 57.1025 17.9951L57 18H7C6.48232 18 6.05621 17.6067 6.00488 17.1025L6 17V12C6 8.68629 8.68629 6 12 6H52L52.3086 6.00781ZM12 7C9.23858 7 7 9.23858 7 12V17H26V11C26 10.4477 26.4477 10 27 10H37C37.5523 10 38 10.4477 38 11V17H57V12C57 9.23858 54.7614 7 52 7H12ZM27 17H37V11H27V17Z" fill="var(--accent)"/>
        {/* latch */}
        <rect x="28.5" y="17.5" width="7" height="4" rx="0.5" stroke="var(--accent)"/>
      </svg>

      <h3 className="empty-state-title">Alas, No Wares Found</h3>
      <p className="empty-state-message">{message}</p>
    </div>
  )
}

