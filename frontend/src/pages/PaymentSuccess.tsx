import React from 'react'
import { AceternityNav } from '../components/AceternaityNav'
import { AuroraBackground } from '../ui/AuroraBackground'
import { Button } from '../ui/patientProfile/button'
import CusLink from '../components/CusLink'
import { useAuth } from '../utils/AuthContext'

const PaymentSuccess = () => {
  const auth = useAuth();
  return (
    <>
    <AuroraBackground>
    <div className='w-screen h-screen text-black bg-[url(/beams-basic.png)] bg-cover bg-center flex flex-col justify-center items-center z-10'>
    <AceternityNav/>
      <p>Payment Success</p>
      <p>Your appointment gets booked!</p>
      <CusLink to={`/${auth.user?.role.toLowerCase()}_profile`}><Button>Go to profile</Button></CusLink>
    </div>
    </AuroraBackground>
    </>

  )
}

export default PaymentSuccess
