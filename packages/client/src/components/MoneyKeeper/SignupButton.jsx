import { useNavigate } from 'react-router-dom'

function SignupButton() {
  const navigate = useNavigate()

  return (
    <div className="flex justify-center">
      <button
        onClick={() => navigate('/money-keeper/app')}
        className="bg-[#D4A5A5] cursor-pointer text-[#4A1313] px-4 sm:px-6 md:px-8 py-3 sm:py-2.5 md:py-3 rounded-3xl text-base sm:text-lg md:text-xl font-bold hover:bg-[#C9605E] transition-colors shadow-2xl"
      >
        תנסו בעצמכם!
      </button>
    </div>
  )
}

export default SignupButton
