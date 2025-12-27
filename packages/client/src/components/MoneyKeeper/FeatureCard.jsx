function FeatureCard({ icon, title }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="text-5xl mb-3">
        {icon}
      </div>
      <h3 className="text-sm md:text-base font-medium text-white">
        {title}
      </h3>
    </div>
  )
}

export default FeatureCard
