import FeatureCard from './FeatureCard'

function Features() {
  const features = [
    {
      icon: '🚀',
      title: 'התחלה מהירה'
    },
    {
      icon: '🎁',
      title: 'ניהול תקציב חכם'
    },
    {
      icon: '💰',
      title: 'מעקב אחר הוצאות'
    },
    {
      icon: '🔔',
      title: 'התראות וחריגות'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          icon={feature.icon}
          title={feature.title}
        />
      ))}
    </div>
  )
}

export default Features
