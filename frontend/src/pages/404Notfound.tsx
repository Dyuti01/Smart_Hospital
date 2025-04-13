import React from 'react'
import { Link } from 'react-router'
import CusLink from '../components/CusLink'
import { Button } from '../ui/patientProfile/button'
import { Stethoscope } from 'lucide-react'

const NotFound404 = () => {
  return (
    <section className="bg-gradient-to-r from-cyan-700 to-teal-600 h-screen">
              <CusLink to='/' className="flex gap-[5px] pt-[50px] items-center justify-center text-white hover:cursor-pointer" >
                <Stethoscope className="text-cyan-50" />
                <span className="text-xl text-cyan-950 text-bold poppins-regular dark:text-white">smartClinic</span>
              </CusLink>
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center flex flex-col justify-center items-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-white dark:text-primary-500">404</h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-cyan-100 md:text-4xl dark:text-black">Something's missing.</p>
          <p className="mb-4 text-lg font-semibold text-cyan-950">Sorry, we can't find that page. May be your are not logged in.</p>
          <div className='flex gap-2'>
            <Button className='bg-gradient-to-r from-cyan-900'><CusLink to='/signin' className="inline-flex bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-cyan-100 dark:focus:ring-primary-900 my-4">Login</CusLink></Button>

            <Button className='bg-gradient-to-r from-cyan-900'><CusLink to='/signup' className="inline-flex text-cyan-100 bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4">Create account</CusLink></Button>
          </div>


        </div>
      </div>
    </section>
  )
}

export default NotFound404
