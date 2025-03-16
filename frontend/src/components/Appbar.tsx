import { Stethoscope } from 'lucide-react'
import CusLink from './CusLink'

const Appbar = () => {
  return (
    <header className="fixed px-[30px] h-[70px] w-[95%] flex justify-between items-center border-b shadow-sm rounded-full mt-3 mx-auto z-50 backdrop-blur-xl">

        <CusLink to='/' className="flex gap-[5px] items-center justify-center text-white" >
        <Stethoscope className="text-blue-700"/>
          <span className="text-xl text-gray-900 poppins-regular">smartClinic</span>
        </CusLink>
        <div className='navLinks flex items-center gap-[20px]'>
        <CusLink to='/home' className='w-[50px] h-[full] hover:text-blue-700 hover:scale-105 hover:cursor-pointer transition-all ease-in-out'>Home</CusLink>
        <CusLink to='/home' className='w-[50px] h-[full] hover:text-blue-700 hover:scale-105 hover:cursor-pointer transition-all ease-in-out'>Signin</CusLink>
        <CusLink to='/home' className='w-[120px] h-[full] hover:text-blue-700 hover:scale-105 hover:cursor-pointer transition-all ease-in-out'>Create account</CusLink>
        </div>

      </header>
  )
}

export default Appbar
