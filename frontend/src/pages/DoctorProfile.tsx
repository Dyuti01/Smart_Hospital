import { useState } from 'react'
import { AuroraBackground } from '../ui/AuroraBackground'
import Datepicker from 'react-tailwindcss-datepicker'
import { cn } from '../lib/utils';
import { Label } from '@radix-ui/react-label';
import { Input } from '../ui/Input';
import { AceternityNav } from '../components/AceternaityNav';
import { BACKEND_URL, PAYMENT_KEY_ID } from '../config';
import axios from 'axios';

/*
Display all the doctors, fetching all the doctors with safeDoctors information (must include doctorId) and use that doctorId to open
doctor's profile using /doctor_profile/:doctorId
*/

const DoctorProfile = () => {
  // const [value, setValue] = useState({
  //   startDate: null,
  //   endDate: null
  // });
  
  const [responseId, setResponseId] = useState("")

  const [appointmentFormData, setAppointmentFormData] = useState({
    patientFirstName:"",
    patientLastName:"",
    patientPhone:"",
    patientAddress:"",
    appointmentDate: {
      startDate: null,
      endDate: null
    }
  })

  function loadScript(src:string) {
    return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = src
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script)
    })
  }
  
  const pay = async (amount:number) => {
      const data = {
          amount: amount * 100,
          currency: "INR",
          customerId:"f55f1ec0-5793-4f4c-8fd6-cb042dd22fc4",
          appointmentDetails:appointmentFormData
        }
    
        // const config = {
        //   method: "post",
        //   maxBodyLength: Infinity,
        //   url: `${BACKEND_URL}/api/v1/razorpay/initiatePayment`,
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   data: data
        // }
    
      const initiatePayment = await axios.post(`${BACKEND_URL}/api/v1/razorpay/initiatePayment`, data, {withCredentials:true})

    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
    if (!res) {
      alert("Some error at razorpay screen loading")
      return;
    }
  //   const data = await axios.post(`${BACKEND_URL}/razorpay`)
    // Get the orderId
  
  //   let a = await initiate(amount, params.username, paymentform)
    const {order, customerInfo}:any = initiatePayment.data;
    var options = {
        "key": PAYMENT_KEY_ID, // Enter the Key ID generated from the Dashboard
        "amount": amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "SmartClinic", //your business name
        "description": "Test Transaction",
        "image": "/logo.png",
        "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "callback_url": `${BACKEND_URL}/api/v1/razorpay/verifyPayment`,
        "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
            "name": customerInfo.customerName, //your customer's name
            "email": customerInfo.email,
            "contact": customerInfo.phone //Provide the customer's phone number for better conversion rates 
        },
        "notes": {
          "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    
    //@ts-ignore
    var paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(appointmentFormData);
    pay(10);

  };
  return (
    <AuroraBackground>
      <AceternityNav/>
      <div className='m-[50px] h-full flex gap-4 mt-[140px]'>
        <div className='left w-[70%]'>
          <div className='min-h-1/2 border shadow-sm rounded-xl p-6 bg-white bg-opacity-70 backdrop-blur-xl'>
            <div className='about-doctor flex items-center gap-[50px]'>
              <div className="relative justify-items-center w-[140px] h-[140px] overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                <svg className="absolute w-[150px] h-[150px] text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
              </div>
              <div className='flex flex-col'>
                <span className='text-4xl'>Dr. Jane Smith</span>
                <span className='text-slate-400'>Cardiologist</span>
              </div>
            </div>
            <span>Dr. Jane Smith is a board-certified cardiologist with over 15 years of experience in treating heart-related conditions.</span>
          </div>
          <div className='doctor-reviews'></div>
        </div>
        <div className="book-appointment border w-[30%] shadow-sm rounded-xl p-6 bg-white bg-opacity-70 backdrop-blur-xl">
          <div className='heading flex flex-col gap-2'>
            <span className='font-semibold text-3xl'>Book an Appointment</span>
            <span className='text-slate-400 text-sm'>Select a date and time to schedule your visit</span>
          </div>
          <form className="my-8" onSubmit={handleSubmit}>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="firstName">Patient First name</Label>
              <Input id="firstName" placeholder="" type="text" value={appointmentFormData.patientFirstName} onChange={(e) => setAppointmentFormData({ ...appointmentFormData, patientFirstName: e.target.value })} />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="lastName">Patient Last name</Label>
              <Input id="lastName" placeholder="" type="text" value={appointmentFormData.patientLastName} onChange={(e) => setAppointmentFormData({ ...appointmentFormData, patientLastName: e.target.value })} />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="" type="tel" value={appointmentFormData.patientPhone} onChange={(e) => setAppointmentFormData({ ...appointmentFormData, patientPhone: e.target.value })} />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="appointmentDate">Appointment Date</Label>
              <Datepicker
              primaryColor='blue'
          asSingle={true}
          value={appointmentFormData.appointmentDate}
          onChange={(newValue: any) => setAppointmentFormData({...appointmentFormData, appointmentDate:newValue})}
        />
            </LabelInputContainer>

            <button
              className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="submit"
            >
              Book &rarr;
              <BottomGradient />
            </button>

            <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />          
          </form>
        </div>
      </div>


    </AuroraBackground>
  )
}

export default DoctorProfile

export const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

