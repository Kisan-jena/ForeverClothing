
import React, { useEffect, useState } from 'react'
import assets from '../assets/assets'
import axios from 'axios'
import backendUrl from '../config.js'
import { toast } from 'react-toastify'

const Add = ({token}) => {
  const [images, setImages] = useState([null, null, null, null]);
  const [previewUrls, setPreviewUrls] = useState([null, null, null, null])

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Men')
  const [subCategory, setSubCategory] = useState('Topwear')
  const [bestseller, setBestseller] = useState(false)
  const [sizes, setSizes] = useState([])

  const handleImageChange = (index, file) => {
    const newImages = [...images]
    newImages[index] = file
    setImages(newImages)
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

  console.log("Token being sent:", token);

  try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      images[0] && formData.append("image1", images[0]);
      images[1] && formData.append("image2", images[1]);
      images[2] && formData.append("image3", images[2]);
      images[3] && formData.append("image4", images[3]);

      const response = await axios.post(backendUrl + "/api/product/add", formData, { headers: { token } })
      console.log(response.data)

      if (response.data.success) {
        toast.success(response.data.message);
        setName('');
        setDescription('');
        setImages([null, null, null, null]);
        setPrice('');
      } else {
        toast.error(response.data.message);
      }

  } catch (error) {
      console.log(error);
      toast.error(error.message);
    }

  }

  // 👇 useEffect to handle preview URLs and cleanup
  useEffect(() => {
    const newPreviewUrls = images.map((file) => (file ? URL.createObjectURL(file) : null));
    setPreviewUrls(newPreviewUrls);

    // Cleanup: revoke old object URLs when images change
    return () => {
      newPreviewUrls.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [images]);

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full gap-3 items-start p-0 bgblue-400' >
      
      <div className='bgred-600 p-0 w-full' >
        <p className='mb-2 bgamber-300 ' >Upload Image</p>
        <div className='flex gap-2 bgamber-800' >
          {[0,1, 2, 3].map((num) => (
            <label htmlFor={`image${num}`} key={num}>
              <img className='w-20' src={previewUrls[num]
                    ? previewUrls[num] 
                    : assets.upload_area} />
              <input onChange={(e)=>handleImageChange(num, e.target.files[0])} type="file" id={`image${num}`} hidden />
            </label>
          ))}
        </div>

        { // ^ Simpler of above approach
        /* <div>
          <label htmlFor="image1">
            <img src={assets.upload_area} alt="" />
            <input type="file" id='image1' hidden />
          </label>
          <label htmlFor="image2">
            <img src={assets.upload_area} alt="" />
            <input type="file" id='image2' hidden />
          </label>
          <label htmlFor="image3">
            <img src={assets.upload_area} alt="" />
            <input type="file" id='image3' hidden />
          </label>
          <label htmlFor="image4">
            <img src={assets.upload_area} alt="" />
            <input type="file" id='image4' hidden />
          </label>
        </div> */
        }
      </div>

      <div className='w-full bggray-500'>
          <p className='mb-2 bgamber-300'>Product name</p>
          <input onChange={(e)=>setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Type here' required />
      </div>

      <div className='w-full bggray-500'>
        <p className='mb-2 bgamber-300'>Product description</p>
        <textarea onChange={(e)=> setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='write content here' required />
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8' >

        <div>
          <p className='mb-2' >Product Categoery</p>
          <select onChange={(e)=>setCategory(e.target.value)} className='w-full px-2 py-1' >
            <option value="Men">Men</option>
            <option value="Women">Womne</option>
            <option value="Kids">Kid</option>
          </select>
        </div>

        <div>
          <p className='mb-2' >Sub Categoery</p>
          <select onChange={(e)=>setSubCategory(e.target.value)} className='w-full px-2 py-1 ' >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div>
          <p className='mb-2' >Product Price</p>
          <input onChange={(e)=>setPrice(e.target.value)} value={price} className='w-full px-2 py-1 sm:w-[120px]' type="Number" placeholder='25' />
        </div>

      </div>

      <div>
        <p className='mb-2' >Product Sizes</p>
        <div className='flex gap-3' >
          {["S",'M','L','XL','XXL'].map((size)=>(
            <div
              onClick={() => setSizes(prev => 
              prev.includes(size) 
              ? prev.filter(item => item !== size)  // remove if already selected
              : [...prev, size])} key={size}        // add if not selected
              >
              <p className={`${sizes.includes(size) ? 'bg-pink-100' : 'bg-slate-200'} px-3 py-1 cursor-pointer`} >{size}</p>
            </div>
          ))}
          {/* <div>
            <p className='bg-slate-200 px-3 pt-1 cursor-pointer' >S</p>
          </div>
          <div>
            <p className='bg-slate-200 px-3 pt-1 cursor-pointer' >M</p>
          </div>
          <div>
            <p className='bg-slate-200 px-3 pt-1 cursor-pointer' >L</p>
          </div>
          <div>
            <p className='bg-slate-200 px-3 pt-1 cursor-pointer' >XL</p>
          </div>
          <div>
            <p className='bg-slate-200 px-3 pt-1 cursor-pointer' >XXL</p>
          </div> */}
        </div>
      </div>

      <div className='flex gap-2 mt-2' >
        <input onChange={()=>setBestseller(prev=>!prev)} checked={bestseller} type="checkbox" id="bestseller" />
        <label className='cursor-pointer' htmlFor="bestseller">Add to Bestseller</label>
      </div>

      <button type='submit' className='w-28 py-3 mt-4 bg-black text-amber-50' > ADD</button>

    </form>
  )
}

export default Add
