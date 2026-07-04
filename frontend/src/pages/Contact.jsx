import React from 'react'
import { Title, NewsLetter } from '../components/index.js'
import { assets } from '../assets/assets.js'

const Contact = () => {
  return (
    <>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"CONTACT"} text2={"US"} />
      </div>
       <div className="flex my-10 flex-col justify-center md:flex-row gap-10 mb-28">
        <img className='w-full max-w-120 ' src={assets.contact_img} alt="" />
         <div className="flex flex-col justify-center items-start gap-6 ">
          <p className='font-semibold text-xl text-gray-600'>Our Store</p>
          <p className='text-gray-500'>Near Durga petroleum <br /> Chirana {"(RAJASTHAN)"} </p>
          <p className='text-gray-500'>Tel: +91-1234567890 <br /> Email: admin@forever.com</p>
          <p className='font-semibold text-xl text-gray-600'>Careers at Forever</p>
          <p className='text-gray-500'>Learn more about our teams and job openings</p>
          <button className='border border-black bg-black text-white px-8 py-4 text-sm hover:bg-white hover:text-black transition-all duration-500'>Explore Jobs</button>
         </div>
       </div>
      <NewsLetter />
    </>
  )
}

export default Contact