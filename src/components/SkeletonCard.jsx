import './SkeletonCard.css'

const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-card-image skeleton" />
      <div className="skeleton-card-body">
        <div className="skeleton-card-badge skeleton" />
        <div className="skeleton-card-title skeleton" />
        <div className="skeleton-card-rating skeleton" />
        <div className="skeleton-card-price skeleton" />
        <div className="skeleton-card-button skeleton" />
      </div>
    </div>
  )
}

export default SkeletonCard
