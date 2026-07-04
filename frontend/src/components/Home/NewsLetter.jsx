import React from 'react'

const NewsLetter = () => {
  const onsubmitHandler = (e) => {
    e.preventDefault();
  }
  return (
    <>
    <div className="text-center">
        <p className="text-2xl font-medium">Subscribe now & get 20% off</p>
        <p className="py-5 text-gray-500">Subscribe to receive exclusive discounts, new collection updates,
  and special member-only offers.</p>
  <form onClick={onsubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
    <input type="email" placeholder='Enter your email' className='w-full sm:flex-1 outline-none ' required/>
    <button type='submit' className='bg-black text-white text-sm px-10 py-4'>Subscribe</button>
  </form>
    </div>
    </>
  )
}

export default NewsLetter