// import Razorpay from "razorpay"

// export const initiate = async (amount:string, to_user:string, paymentform:string) => {
//   // await connectDB()
//   let user = await User.findOne({username:to_user})

//   let instance = new Razorpay({key_id: user.paymentId, key_secret: user.paymentSecret })

//   let options = {
//           amount: amount,
//           currency: "INR",
//       }
  
//   let x = await instance.orders.create(options)

//   // Creating a payemnt object
//   await Payment.create({oid:x.id, amount:(Number(amount)/100), to_user:to_user, name: paymentform.name, message:paymentform.message})

//   return x
// }